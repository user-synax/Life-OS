import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Widget from '@/lib/db/models/Widget';

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const widget = await Widget.findOneAndDelete({ _id: id, userId: decoded.userId });

    if (!widget) return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    return NextResponse.json({ message: 'Widget deleted' });
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
    const widget = await Widget.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updates,
      { new: true }
    );

    if (!widget) return NextResponse.json({ error: 'Widget not found' }, { status: 404 });
    return NextResponse.json({ widget });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
