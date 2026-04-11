const express = require('express');
const { body, validationResult } = require('express-validator');
const Issue = require('../models/Issue');
const Project = require('../models/Project');
const protect = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// GET /api/projects/:projectId/issues - List issues with filters
router.get('/project/:projectId', protect, async (req, res) => {
  try {
    const { status, priority, assignee, type, search, sort, label } = req.query;

    const filter = { project: req.params.projectId };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (assignee) filter.assignee = assignee;
    if (label) filter.labels = { $in: [label] };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    let sortOption = { order: 1, createdAt: -1 };
    if (sort === 'newest') sortOption = { createdAt: -1 };
    if (sort === 'oldest') sortOption = { createdAt: 1 };
    if (sort === 'priority') sortOption = { priority: 1 };
    if (sort === 'updated') sortOption = { updatedAt: -1 };

    const issues = await Issue.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .sort(sortOption);

    res.json(issues);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/issues - Create issue
router.post('/', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const { title, description, type, priority, assignee, project, labels, dueDate } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }

    const projectDoc = await Project.findById(project);
    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Calculate order (add to end)
    const maxOrder = await Issue.findOne({ project, status: 'todo' })
      .sort({ order: -1 })
      .select('order');
    const order = maxOrder ? maxOrder.order + 1 : 0;

    const attachments = req.files ? req.files.map(f => ({
      filename: f.filename,
      originalname: f.originalname,
      path: `/uploads/${f.filename}`,
      mimetype: f.mimetype,
      size: f.size
    })) : [];

    const issue = await Issue.create({
      title,
      description: description || '',
      type: type || 'bug',
      priority: priority || 'medium',
      assignee: assignee || null,
      reporter: req.user._id,
      project,
      labels: labels ? (typeof labels === 'string' ? JSON.parse(labels) : labels) : [],
      attachments,
      order,
      dueDate: dueDate || null
    });

    const populated = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar');

    // Emit socket event
    if (req.app.get('io')) {
      req.app.get('io').to(`project:${project}`).emit('issue-created', populated);
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// GET /api/issues/:id - Get issue detail
router.get('/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar')
      .populate('project', 'name key');

    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    res.json(issue);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT /api/issues/:id - Update issue
router.put('/:id', protect, upload.array('attachments', 5), async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const { title, description, type, priority, assignee, labels, dueDate, status } = req.body;

    if (title) issue.title = title;
    if (description !== undefined) issue.description = description;
    if (type) issue.type = type;
    if (priority) issue.priority = priority;
    if (status) issue.status = status;
    if (assignee !== undefined) issue.assignee = assignee || null;
    if (labels) issue.labels = typeof labels === 'string' ? JSON.parse(labels) : labels;
    if (dueDate !== undefined) issue.dueDate = dueDate || null;

    if (req.files && req.files.length > 0) {
      const newAttachments = req.files.map(f => ({
        filename: f.filename,
        originalname: f.originalname,
        path: `/uploads/${f.filename}`,
        mimetype: f.mimetype,
        size: f.size
      }));
      issue.attachments.push(...newAttachments);
    }

    await issue.save();

    const populated = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar');

    if (req.app.get('io')) {
      req.app.get('io').to(`project:${issue.project}`).emit('issue-updated', populated);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/issues/:id/status - Update status (Kanban drag)
router.patch('/:id/status', protect, async (req, res) => {
  try {
    const { status, order } = req.body;
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    issue.status = status;
    if (order !== undefined) issue.order = order;
    await issue.save();

    const populated = await Issue.findById(issue._id)
      .populate('assignee', 'name email avatar')
      .populate('reporter', 'name email avatar');

    if (req.app.get('io')) {
      req.app.get('io').to(`project:${issue.project}`).emit('issue-updated', populated);
    }

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PATCH /api/issues/reorder - Bulk reorder
router.patch('/reorder', protect, async (req, res) => {
  try {
    const { issues } = req.body; // [{ id, order, status }]
    if (!issues || !Array.isArray(issues)) {
      return res.status(400).json({ message: 'Issues array is required' });
    }

    const bulkOps = issues.map(item => ({
      updateOne: {
        filter: { _id: item.id },
        update: { $set: { order: item.order, status: item.status } }
      }
    }));

    await Issue.bulkWrite(bulkOps);
    res.json({ message: 'Issues reordered' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/issues/:id - Delete issue
router.delete('/:id', protect, async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const projectId = issue.project;
    await Issue.findByIdAndDelete(req.params.id);

    if (req.app.get('io')) {
      req.app.get('io').to(`project:${projectId}`).emit('issue-deleted', { id: req.params.id });
    }

    res.json({ message: 'Issue deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
