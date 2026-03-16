import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Event from '@/lib/db/models/Event';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const events = await Event.find({ userId: decoded.userId }).sort({ date: 1 });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, date, description, startTime, endTime, location } = await req.json();
    await connectDB();
    const event = await Event.create({
      title,
      date,
      description,
      startTime,
      endTime,
      location,
      userId: decoded.userId,
    });
    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
