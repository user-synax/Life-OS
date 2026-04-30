import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import MoodJournal from '@/lib/db/models/MoodJournal';
import { moodJournalSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const entries = await MoodJournal.find({ userId: decoded.userId })
      .sort({ date: -1, createdAt: -1 });
    return NextResponse.json({ entries });
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

    const validationResult = moodJournalSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { mood, journal, tags, date } = validationResult.data;
    await connectDB();
    const entry = await MoodJournal.create({
      mood,
      journal,
      tags: tags || [],
      date: date || new Date(),
      userId: decoded.userId,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
