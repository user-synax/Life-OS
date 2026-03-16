import mongoose from 'mongoose';

const NoteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  tags: [{ type: String }],
  pinned: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Note || mongoose.model('Note', NoteSchema);
