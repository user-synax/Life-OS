import mongoose from 'mongoose';

const FitnessSchema = new mongoose.Schema({
  type: { 
    type: String, 
    required: true,
    enum: ['workout', 'weight', 'nutrition', 'measurement', 'other']
  },
  title: { type: String, required: true },
  details: { type: String },
  duration: { type: Number }, // in minutes
  calories: { type: Number },
  value: { type: Number }, // for weight, measurements, etc.
  unit: { type: String }, // kg, lbs, cm, etc.
  tags: [{ type: String }],
  notes: { type: String },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Fitness || mongoose.model('Fitness', FitnessSchema);
