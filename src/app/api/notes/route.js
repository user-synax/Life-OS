import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Note from '@/lib/db/models/Note';
import { noteSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const notes = await Note.find({ userId: decoded.userId }).sort({ pinned: -1, createdAt: -1 });
    return NextResponse.json({ notes });
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
    const validationResult = noteSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { title, content, tags } = validationResult.data;
    await connectDB();
    const note = await Note.create({
      title,
      content: content || '',
      tags: tags || [],
      userId: decoded.userId,
    });
    return NextResponse.json({ note });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
