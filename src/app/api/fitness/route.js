import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Fitness from '@/lib/db/models/Fitness';
import { fitnessSchema } from '@/lib/validations';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const entries = await Fitness.find({ userId: decoded.userId })
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

    const validationResult = fitnessSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const { type, title, details, duration, calories, value, unit, tags, notes, date } = validationResult.data;
    await connectDB();
    const entry = await Fitness.create({
      type,
      title,
      details,
      duration,
      calories,
      value,
      unit,
      tags: tags || [],
      notes,
      date: date || new Date(),
      userId: decoded.userId,
    });
    return NextResponse.json({ entry });
  } catch (error) {
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
