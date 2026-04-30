import mongoose from 'mongoose';

const MoodJournalSchema = new mongoose.Schema({
  mood: { 
    type: String, 
    required: true,
    enum: ['great', 'good', 'okay', 'bad', 'terrible']
  },
  journal: { type: String, required: true },
  tags: [{ type: String }],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.MoodJournal || mongoose.model('MoodJournal', MoodJournalSchema);
