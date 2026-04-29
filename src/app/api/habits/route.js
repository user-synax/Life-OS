import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Habit from '@/lib/db/models/Habit';
import HabitLog from '@/lib/db/models/HabitLog';
import { habitSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const habits = await Habit.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    const logs = await HabitLog.find({
      habitId: { $in: habits.map(h => h._id) },
    });

    return NextResponse.json({ habits, logs });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Validate input using Zod
    const validationResult = habitSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { name } = validationResult.data;
    await connectDB();
    const habit = await Habit.create({
      name,
      userId: decoded.userId,
    });
    return NextResponse.json({ habit });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
