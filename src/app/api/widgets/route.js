import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Widget from '@/lib/db/models/Widget';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const widgets = await Widget.find({ userId: decoded.userId }).sort('position.y position.x');
    
    // If no widgets, create default ones
    if (widgets.length === 0) {
      const defaults = [
        { widgetType: 'tasks', position: { x: 0, y: 0 }, size: { w: 2, h: 2 }, userId: decoded.userId },
        { widgetType: 'notes', position: { x: 2, y: 0 }, size: { w: 1, h: 2 }, userId: decoded.userId },
        { widgetType: 'calendar', position: { x: 0, y: 2 }, size: { w: 2, h: 2 }, userId: decoded.userId },
        { widgetType: 'habits', position: { x: 2, y: 2 }, size: { w: 1, h: 1 }, userId: decoded.userId },
      ];
      const created = await Widget.insertMany(defaults);
      return NextResponse.json({ widgets: created });
    }

    return NextResponse.json({ widgets });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { widgetType } = await req.json();
    await connectDB();
    const widget = await Widget.create({
      widgetType,
      userId: decoded.userId,
      position: { x: 0, y: 0 }, // Should find next available position
      size: { w: 1, h: 1 },
    });
    return NextResponse.json({ widget });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
