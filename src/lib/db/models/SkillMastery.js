const mongoose = require('mongoose');

const skillMasterySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  skillName: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'creative', 'language', 'business', 'science', 'arts', 'other'],
    index: true
  },
  currentLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
    index: true
  },
  targetLevel: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  progressHistory: [{
    date: {
      type: Date,
      required: true
    },
    level: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    sessionType: {
      type: String,
      enum: ['knowledge', 'flashcards', 'mixed']
    },
    studyDuration: Number,
    relatedContent: [{
      contentType: {
        type: String,
        enum: ['article', 'flashcard', 'session']
      },
      contentId: mongoose.Schema.Types.ObjectId,
      score: Number
    }]
  }],
  relatedArticles: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeArticle'
  }],
  relatedFlashcards: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Flashcard'
  }],
  strengths: [{
    aspect: String,
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAssessed: Date
  }],
  weaknesses: [{
    aspect: String,
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    lastAssessed: Date,
    improvementPlan: String
  }],
  milestones: [{
    name: String,
    description: String,
    targetLevel: {
      type: Number,
      min: 0,
      max: 100
    },
    achievedAt: Date,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  nextActions: [{
    action: String,
    priority: {
      type: String,
      enum: ['high', 'medium', 'low'],
      default: 'medium'
    },
    dueDate: Date,
    isCompleted: {
      type: Boolean,
      default: false
    }
  }],
  timeSpent: {
    totalMinutes: {
      type: Number,
      default: 0
    },
    sessionsCount: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    }
  },
  learningMetrics: {
    retentionRate: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    improvementRate: {
      type: Number,
      default: 0
    },
    consistencyScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0
    },
    difficultyProgression: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced', 'expert'],
      default: 'beginner'
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  notes: {
    type: String,
    maxlength: 1000
  }
}, {
  timestamps: true
});

// Compound indexes
skillMasterySchema.index({ userId: 1, category: 1, currentLevel: -1 });
skillMasterySchema.index({ userId: 1, skillName: 1 });
skillMasterySchema.index({ 'progressHistory.date': -1 });

module.exports = mongoose.models.SkillMastery || mongoose.model('SkillMastery', skillMasterySchema);
