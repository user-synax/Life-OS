import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  category: { type: String },
  favicon: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
