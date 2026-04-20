const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'archived'],
    default: 'planning',
    index: true
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium',
    index: true
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'learning', 'hobby', 'business', 'creative', 'other'],
    default: 'work',
    index: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#3ecf8e'
  },
  startDate: {
    type: Date,
    default: null
  },
  endDate: {
    type: Date,
    default: null
  },
  dueDate: {
    type: Date,
    default: null,
    index: true
  },
  estimatedHours: {
    type: Number,
    min: 0,
    default: 0
  },
  actualHours: {
    type: Number,
    min: 0,
    default: 0
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ProjectTemplate',
    default: null
  },
  parentProjectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    default: null
  },
  subProjects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }],
  teamMembers: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  milestones: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    dueDate: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'in_progress', 'completed', 'overdue'],
      default: 'pending'
    },
    completedAt: {
      type: Date,
      default: null
    },
    created: {
      type: Date,
      default: Date.now
    }
  }],
  files: [{
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['document', 'image', 'video', 'link', 'other'],
      default: 'document'
    },
    size: {
      type: Number,
      min: 0
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  linkedTasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }],
  linkedKnowledge: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeArticle'
  }],
  notes: {
    type: String,
    trim: true,
    maxlength: 2000
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isTemplate: {
    type: Boolean,
    default: false
  },
  templateName: {
    type: String,
    trim: true
  },
  settings: {
    allowTimeTracking: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    budget: {
      type: Number,
      min: 0,
      default: 0
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'JPY', 'CNY'],
      default: 'USD'
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for performance
projectSchema.index({ userId: 1, status: 1, dueDate: 1 });
projectSchema.index({ userId: 1, category: 1, priority: 1 });
projectSchema.index({ userId: 1, tags: 1 });
projectSchema.index({ 'subProjects': 1 });
projectSchema.index({ 'teamMembers.userId': 1 });

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
