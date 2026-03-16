import mongoose from 'mongoose';

const WidgetSchema = new mongoose.Schema({
  widgetType: { type: String, required: true }, // 'tasks', 'notes', 'calendar', etc.
  position: {
    x: { type: Number, default: 0 },
    y: { type: Number, default: 0 },
  },
  size: {
    w: { type: Number, default: 1 },
    h: { type: Number, default: 1 },
  },
  visible: { type: Boolean, default: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Widget || mongoose.model('Widget', WidgetSchema);
