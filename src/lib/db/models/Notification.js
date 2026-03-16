import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  type: { type: String, required: true }, // 'task', 'event', 'habit', 'system'
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);
