import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Bookmark from '@/lib/db/models/Bookmark';

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    await connectDB();
    const bookmark = await Bookmark.findOneAndDelete({ _id: id, userId: decoded.userId });

    if (!bookmark) return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    return NextResponse.json({ message: 'Bookmark deleted' });
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
    const bookmark = await Bookmark.findOneAndUpdate(
      { _id: id, userId: decoded.userId },
      updates,
      { new: true }
    );

    if (!bookmark) return NextResponse.json({ error: 'Bookmark not found' }, { status: 404 });
    return NextResponse.json({ bookmark });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
