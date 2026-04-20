const mongoose = require('mongoose');

const learningStreakSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  currentStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  longestStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  lastStudyDate: {
    type: Date,
    default: null
  },
  studyDates: [{
    date: {
      type: Date,
      required: true
    },
    sessionsCount: {
      type: Number,
      default: 1
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    sessionTypes: [{
      type: String,
      enum: ['knowledge', 'flashcards', 'mixed']
    }]
  }],
  streakHistory: [{
    startDate: Date,
    endDate: Date,
    length: Number,
    brokenReason: {
      type: String,
      enum: ['skip', 'break', 'vacation', 'illness', 'other'],
      default: 'skip'
    }
  }],
  achievements: [{
    type: {
      type: String,
      enum: ['first_day', 'week_streak', 'month_streak', '3_month_streak', 'year_streak', 'perfect_week', 'study_marathon']
    },
    achievedAt: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  goals: {
    dailyTargetMinutes: {
      type: Number,
      default: 30,
      min: 0
    },
    weeklyTargetDays: {
      type: Number,
      default: 5,
      min: 1,
      max: 7
    },
    streakTargetDays: {
      type: Number,
      default: 30,
      min: 1
    }
  },
  stats: {
    totalStudyDays: {
      type: Number,
      default: 0
    },
    totalSessions: {
      type: Number,
      default: 0
    },
    totalMinutes: {
      type: Number,
      default: 0
    },
    averageSessionDuration: {
      type: Number,
      default: 0
    },
    favoriteSessionType: {
      type: String,
      enum: ['knowledge', 'flashcards', 'mixed']
    },
    mostProductiveHour: {
      type: Number,
      min: 0,
      max: 23
    },
    mostProductiveDay: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    }
  }
}, {
  timestamps: true
});

// Indexes for performance
learningStreakSchema.index({ userId: 1 });
learningStreakSchema.index({ 'studyDates.date': -1 });

module.exports = mongoose.models.LearningStreak || mongoose.model('LearningStreak', learningStreakSchema);
