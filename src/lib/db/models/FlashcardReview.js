import mongoose from 'mongoose';

const FlashcardReviewSchema = new mongoose.Schema({
  flashcardId: { type: mongoose.Schema.Types.ObjectId, ref: 'Flashcard', required: true },
  quality: { type: Number, required: true, min: 0, max: 5 }, // SM-2 algorithm quality rating
  timeTaken: { type: Number, default: 0 }, // seconds to answer
  correct: { type: Boolean, required: true },
  reviewDate: { type: Date, default: Date.now },
  previousInterval: { type: Number },
  newInterval: { type: Number },
  previousEaseFactor: { type: Number },
  newEaseFactor: { type: Number },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index for performance analytics
FlashcardReviewSchema.index({ flashcardId: 1, reviewDate: -1 });
FlashcardReviewSchema.index({ userId: 1, reviewDate: -1 });

export default mongoose.models.FlashcardReview || mongoose.model('FlashcardReview', FlashcardReviewSchema);
