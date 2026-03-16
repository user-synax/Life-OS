import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Note from '@/lib/db/models/Note';

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();

    await connectDB();
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updates,
      { new: true }
    );

    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ note });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const note = await Note.findOneAndDelete({ _id: id, userId: decoded.userId });

    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ message: 'Note deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
