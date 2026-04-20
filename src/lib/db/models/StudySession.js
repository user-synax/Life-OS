const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  sessionType: {
    type: String,
    enum: ['knowledge', 'flashcards', 'mixed'],
    required: true
  },
  startTime: {
    type: Date,
    required: true
  },
  endTime: {
    type: Date,
    required: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  articlesStudied: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'KnowledgeArticle'
  }],
  flashcardsStudied: [{
    flashcardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flashcard'
    },
    reviews: [{
      quality: {
        type: Number,
        min: 0,
        max: 3
      },
      timeTaken: Number,
      reviewedAt: {
        type: Date,
        default: Date.now
      }
    }]
  }],
  focusScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  breaks: [{
    startTime: Date,
    endTime: Date,
    duration: Number
  }],
  notes: {
    type: String,
    maxlength: 500
  },
  tags: [{
    type: String,
    trim: true
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  satisfaction: {
    type: Number,
    min: 1,
    max: 5
  }
}, {
  timestamps: true
});

// Indexes for analytics queries
studySessionSchema.index({ userId: 1, startTime: -1 });
studySessionSchema.index({ userId: 1, sessionType: 1, startTime: -1 });
studySessionSchema.index({ userId: 1, date: { $dateToString: { format: "%Y-%m-%d", date: "$startTime" } } });

module.exports = mongoose.models.StudySession || mongoose.model('StudySession', studySessionSchema);
