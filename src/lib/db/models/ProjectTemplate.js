const mongoose = require('mongoose');

const projectTemplateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  category: {
    type: String,
    enum: ['work', 'personal', 'learning', 'hobby', 'business', 'creative', 'other'],
    default: 'work'
  },
  tags: [{
    type: String,
    trim: true
  }],
  color: {
    type: String,
    default: '#3ecf8e',
    match: /^#[0-9A-F]{6}$/
  },
  icon: {
    type: String,
    default: 'folder'
  },
  structure: {
    type: mongoose.Schema.Types.Mixed,
    default: {
      sections: [],
      customFields: [],
      layout: 'default'
    }
  },
  defaultSettings: {
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium'
    },
    estimatedHours: {
      type: Number,
      min: 0,
      default: 40
    },
    checklist: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        trim: true
      },
      required: {
        type: Boolean,
        default: false
      },
      order: {
        type: Number,
        default: 0
      }
    }],
    milestones: [{
      name: {
        type: String,
        required: true
      },
      description: {
        type: String,
        trim: true
      },
      estimatedDays: {
        type: Number,
        min: 1,
        default: 7
      }
    }],
    tags: [{
      type: String,
        trim: true
    }],
    teamRoles: [{
      name: {
        type: String,
        enum: ['owner', 'admin', 'member', 'viewer'],
        default: 'member'
      },
      permissions: {
        type: [String],
        default: ['view']
      }
    }]
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  isSystem: {
    type: Boolean,
    default: false
  },
  usageCount: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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

// Indexes
projectTemplateSchema.index({ isPublic: 1, category: 1 });
projectTemplateSchema.index({ createdBy: 1 });
projectTemplateSchema.index({ usageCount: -1 });

module.exports = mongoose.models.ProjectTemplate || mongoose.model('ProjectTemplate', projectTemplateSchema);
