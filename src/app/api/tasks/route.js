import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Task from '@/lib/db/models/Task';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const tasks = await Task.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, priority, dueDate } = await req.json();
    await connectDB();
    const task = await Task.create({
      title,
      priority: priority || 'medium',
      dueDate,
      userId: decoded.userId,
    });
    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
