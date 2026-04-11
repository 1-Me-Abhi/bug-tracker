const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Issue title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['bug', 'feature', 'task', 'improvement'],
    default: 'bug'
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'in_review', 'done'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },
  assignee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  labels: [{
    type: String,
    trim: true
  }],
  attachments: [{
    filename: String,
    originalname: String,
    path: String,
    mimetype: String,
    size: Number
  }],
  order: {
    type: Number,
    default: 0
  },
  ticketNumber: {
    type: Number
  },
  dueDate: {
    type: Date,
    default: null
  }
}, { timestamps: true });

// Auto-generate ticket number per project
issueSchema.pre('save', async function(next) {
  if (this.isNew) {
    const count = await mongoose.model('Issue').countDocuments({ project: this.project });
    this.ticketNumber = count + 1;
  }
  next();
});

module.exports = mongoose.model('Issue', issueSchema);
