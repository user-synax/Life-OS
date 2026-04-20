import mongoose from 'mongoose';

const KnowledgeArticleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: String }],
  category: { type: String, default: 'general' },
  links: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeArticle' }],
  backlinks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'KnowledgeArticle' }],
  pinned: { type: Boolean, default: false },
  archived: { type: Boolean, default: false },
  lastReviewed: { type: Date },
  reviewCount: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

// Index for search functionality
KnowledgeArticleSchema.index({ title: 'text', content: 'text', tags: 'text' });

export default mongoose.models.KnowledgeArticle || mongoose.model('KnowledgeArticle', KnowledgeArticleSchema);
