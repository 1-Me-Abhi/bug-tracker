const express = require('express');
const { body, validationResult } = require('express-validator');
const Comment = require('../models/Comment');
const protect = require('../middleware/auth');

const router = express.Router();

// GET /api/issues/:issueId/comments - List comments
router.get('/issue/:issueId', protect, async (req, res) => {
  try {
    const comments = await Comment.find({ issue: req.params.issueId })
      .populate('author', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// POST /api/comments - Add comment
router.post('/', protect, [
  body('text').trim().notEmpty().withMessage('Comment text is required'),
  body('issue').notEmpty().withMessage('Issue ID is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array()[0].msg });
    }

    const comment = await Comment.create({
      text: req.body.text,
      author: req.user._id,
      issue: req.body.issue
    });

    const populated = await Comment.findById(comment._id)
      .populate('author', 'name email avatar');

    if (req.app.get('io')) {
      const Issue = require('../models/Issue');
      const issue = await Issue.findById(req.body.issue);
      if (issue) {
        req.app.get('io').to(`project:${issue.project}`).emit('comment-added', {
          issueId: req.body.issue,
          comment: populated
        });
      }
    }

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// DELETE /api/comments/:id - Delete comment
router.delete('/:id', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comment deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
