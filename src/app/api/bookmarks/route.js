import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Bookmark from '@/lib/db/models/Bookmark';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const bookmarks = await Bookmark.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ bookmarks });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, url, category } = await req.json();
    await connectDB();
    
    // Simple favicon generator (clearbit)
    const favicon = `https://logo.clearbit.com/${new URL(url).hostname}`;
    
    const bookmark = await Bookmark.create({
      title,
      url,
      category,
      favicon,
      userId: decoded.userId,
    });
    return NextResponse.json({ bookmark });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
