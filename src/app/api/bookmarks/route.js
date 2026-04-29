import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Bookmark from '@/lib/db/models/Bookmark';
import { bookmarkSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const bookmarks = await Bookmark.find({ userId: decoded.userId }).sort({ createdAt: -1 });
    return NextResponse.json({ bookmarks });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();

    // Validate input using Zod
    const validationResult = bookmarkSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, url, category } = validationResult.data;
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
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
