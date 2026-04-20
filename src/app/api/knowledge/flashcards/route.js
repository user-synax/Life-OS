import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Flashcard from '@/lib/db/models/Flashcard';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const deck = searchParams.get('deck');
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const due = searchParams.get('due') === 'true';
    const suspended = searchParams.get('suspended') === 'true';
    
    let query = { userId: decoded.userId };
    
    if (deck) query.deck = deck;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (due) {
      query.nextReview = { $lte: new Date() };
      query.suspended = false;
    }
    if (!suspended) {
      query.suspended = { $ne: true };
    }
    
    const flashcards = await Flashcard.find(query)
      .sort({ nextReview: 1, createdAt: -1 });
    
    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Get flashcards error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { front, back, type, deck, tags } = await req.json();
    
    await connectDB();
    
    const flashcard = await Flashcard.create({
      front,
      back,
      type: type || 'basic',
      deck: deck || 'default',
      tags: tags || [],
      userId: decoded.userId,
    });
    
    return NextResponse.json({ flashcard });
  } catch (error) {
    console.error('Create flashcard error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
