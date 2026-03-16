import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
  name: { type: String, required: true },
  streak: { type: Number, default: 0 },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Habit || mongoose.model('Habit', HabitSchema);
