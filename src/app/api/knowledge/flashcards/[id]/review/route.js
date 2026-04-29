import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Flashcard from '@/lib/db/models/Flashcard';
import FlashcardReview from '@/lib/db/models/FlashcardReview';
import { log } from '@/lib/logger';
import { createErrorResponse } from '@/lib/errorHandler';

// SM-2 Algorithm implementation
function calculateNextReview(card, quality) {
  let { easeFactor, interval, repetitions } = card;
  
  easeFactor = Math.max(1.3, easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));
  
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    repetitions += 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
  }
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);
  
  return {
    easeFactor: Math.round(easeFactor * 100) / 100,
    interval,
    repetitions,
    nextReview,
  };
}

export async function POST(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { quality, timeTaken } = await req.json();
    
    if (quality < 0 || quality > 5) {
      return NextResponse.json({ error: 'Quality must be between 0 and 5' }, { status: 400 });
    }
    
    await connectDB();
    
    const flashcard = await Flashcard.findOne({ 
      _id: params.id, 
      userId: decoded.userId 
    });
    
    if (!flashcard) {
      return NextResponse.json({ error: 'Flashcard not found' }, { status: 404 });
    }
    
    const previousState = {
      interval: flashcard.interval,
      easeFactor: flashcard.easeFactor,
    };
    
    const newState = calculateNextReview(flashcard, quality);
    
    // Create review record
    const review = await FlashcardReview.create({
      flashcardId: flashcard._id,
      quality,
      timeTaken: timeTaken || 0,
      correct: quality >= 3,
      previousInterval: previousState.interval,
      newInterval: newState.interval,
      previousEaseFactor: previousState.easeFactor,
      newEaseFactor: newState.easeFactor,
      userId: decoded.userId,
    });
    
    // Update flashcard
    const updatedFlashcard = await Flashcard.findByIdAndUpdate(
      params.id,
      {
        ...newState,
        lastReview: new Date(),
        reviewCount: flashcard.reviewCount + 1,
      },
      { new: true }
    );
    
    return NextResponse.json({ 
      review, 
      flashcard: updatedFlashcard 
    });
  } catch (error) {
    log.error('Review flashcard error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
