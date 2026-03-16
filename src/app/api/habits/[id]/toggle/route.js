import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Habit from '@/lib/db/models/Habit';
import HabitLog from '@/lib/db/models/HabitLog';
import { startOfDay } from 'date-fns';

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const { date } = await req.json();
    const habitId = id;

    await connectDB();
    const habit = await Habit.findOne({ _id: habitId, userId: decoded.userId });
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    const logDate = startOfDay(new Date(date));
    let log = await HabitLog.findOne({ habitId, date: logDate });

    if (log) {
      log.completed = !log.completed;
      await log.save();
    } else {
      log = await HabitLog.create({ habitId, date: logDate, completed: true });
    }

    // Update streak (simplified)
    const logs = await HabitLog.find({ habitId, completed: true }).sort({ date: -1 });
    let streak = 0;
    if (logs.length > 0) {
      streak = 1;
      for (let i = 0; i < logs.length - 1; i++) {
        const diff = (startOfDay(logs[i].date) - startOfDay(logs[i+1].date)) / (1000 * 60 * 60 * 24);
        if (diff === 1) streak++;
        else break;
      }
    }
    habit.streak = streak;
    await habit.save();

    return NextResponse.json({ log, habit });
  } catch (error) {
    console.error('Toggle habit error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
