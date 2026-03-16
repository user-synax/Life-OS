import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Habit from '@/lib/db/models/Habit';
import HabitLog from '@/lib/db/models/HabitLog';

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    
    const habit = await Habit.findOneAndDelete({ _id: id, userId: decoded.userId });
    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });

    // Also delete associated logs
    await HabitLog.deleteMany({ habitId: id });

    return NextResponse.json({ message: 'Habit deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();

    await connectDB();
    const habit = await Habit.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updates,
      { new: true }
    );

    if (!habit) return NextResponse.json({ error: 'Habit not found' }, { status: 404 });
    return NextResponse.json({ habit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
