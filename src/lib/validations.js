import { z } from 'zod';

// Password validation schema
// Requirements: at least 8 characters, 1 uppercase, 1 lowercase, 1 number
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/\d/, 'Password must contain at least one number');

// Login validation schema
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// Register validation schema
export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  password: passwordSchema,
});

// Task validation schema
export const taskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  description: z.string().max(1000, 'Description must be less than 1000 characters').optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Note validation schema
export const noteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Habit validation schema
export const habitSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
});

// Bookmark validation schema
export const bookmarkSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  url: z.string().url('Invalid URL'),
  category: z.string().optional(),
});

// Mood journal validation schema
export const moodJournalSchema = z.object({
  mood: z.enum(['great', 'good', 'okay', 'bad', 'terrible'], 'Invalid mood'),
  journal: z.string().min(1, 'Journal entry is required').max(5000, 'Journal must be less than 5000 characters'),
  tags: z.array(z.string()).optional(),
  date: z.string().optional(),
});

// Fitness validation schema
export const fitnessSchema = z.object({
  type: z.enum(['workout', 'weight', 'nutrition', 'measurement', 'other'], 'Invalid type'),
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  details: z.string().optional(),
  duration: z.number().optional(),
  calories: z.number().optional(),
  value: z.number().optional(),
  unit: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
  date: z.string().optional(),
});
