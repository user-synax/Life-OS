import mongoose from 'mongoose';

const FlashcardSchema = new mongoose.Schema({
  front: { type: String, required: true },
  back: { type: String, required: true },
  type: { type: String, enum: ['basic', 'cloze', 'image'], default: 'basic' },
  deck: { type: String, default: 'default' },
  tags: [{ type: String }],
  difficulty: { type: Number, default: 0 }, // 0-5 scale
  interval: { type: Number, default: 1 }, // days until next review
  repetitions: { type: Number, default: 0 },
  easeFactor: { type: Number, default: 2.5 },
  nextReview: { type: Date, default: Date.now },
  lastReview: { type: Date },
  suspended: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index for efficient querying of due cards
FlashcardSchema.index({ userId: 1, nextReview: 1, suspended: 1 });
FlashcardSchema.index({ userId: 1, deck: 1 });

export default mongoose.models.Flashcard || mongoose.model('Flashcard', FlashcardSchema);
