import mongoose from 'mongoose';

const HabitLogSchema = new mongoose.Schema({
  habitId: { type: mongoose.Schema.Types.ObjectId, ref: 'Habit', required: true },
  date: { type: Date, required: true },
  completed: { type: Boolean, default: false },
});

export default mongoose.models.HabitLog || mongoose.model('HabitLog', HabitLogSchema);
