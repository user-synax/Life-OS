import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Habit from '@/lib/db/models/Habit';
import HabitLog from '@/lib/db/models/HabitLog';

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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { name } = await req.json();
    await connectDB();
    const habit = await Habit.create({
      name,
      userId: decoded.userId,
    });
    return NextResponse.json({ habit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
