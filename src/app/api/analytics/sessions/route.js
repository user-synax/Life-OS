import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import StudySession from '@/lib/db/models/StudySession';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const sessionType = searchParams.get('sessionType');
    const limit = parseInt(searchParams.get('limit')) || 50;
    const page = parseInt(searchParams.get('page')) || 1;

    const query = { userId: decoded.userId };
    
    if (startDate || endDate) {
      query.startTime = {};
      if (startDate) query.startTime.$gte = new Date(startDate);
      if (endDate) query.startTime.$lte = new Date(endDate);
    }
    
    if (sessionType && sessionType !== 'all') {
      query.sessionType = sessionType;
    }

    const sessions = await StudySession.find(query)
      .populate('articlesStudied', 'title category tags')
      .populate('flashcardsStudied.flashcardId', 'front deck tags')
      .sort({ startTime: -1 })
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await StudySession.countDocuments(query);

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const sessionData = await req.json();
    
    await connectDB();
    
    const session = new StudySession({
      ...sessionData,
      userId: decoded.userId,
      startTime: new Date(sessionData.startTime),
      endTime: new Date(sessionData.endTime)
    });

    await session.save();

    // Update learning streak
    await updateLearningStreak(decoded.userId, session.startTime);

    return NextResponse.json({ session }, { status: 201 });
  } catch (error) {
    console.error('Create session error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

async function updateLearningStreak(userId, studyDate) {
  const LearningStreak = require('@/lib/db/models/LearningStreak');
  
  let streak = await LearningStreak.findOne({ userId });
  
  if (!streak) {
    streak = new LearningStreak({ userId });
  }

  const today = new Date(studyDate);
  today.setHours(0, 0, 0, 0);
  
  const lastStudy = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
  
  // Check if studying today continues the streak
  if (!lastStudy || Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24)) === 1) {
    streak.currentStreak += 1;
  } else if (Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24)) > 1) {
    // Streak broken
    if (streak.currentStreak > 0) {
      streak.streakHistory.push({
        startDate: new Date(lastStudy).setDate(lastStudy.getDate() - streak.currentStreak + 1),
        endDate: lastStudy,
        length: streak.currentStreak
      });
    }
    streak.currentStreak = 1;
  }
  
  // Update longest streak
  if (streak.currentStreak > streak.longestStreak) {
    streak.longestStreak = streak.currentStreak;
  }
  
  // Update study dates
  const existingDateIndex = streak.studyDates.findIndex(d => 
    d.date.toDateString() === today.toDateString()
  );
  
  if (existingDateIndex >= 0) {
    streak.studyDates[existingDateIndex].sessionsCount += 1;
  } else {
    streak.studyDates.push({
      date: today,
      sessionsCount: 1,
      sessionTypes: []
    });
  }
  
  streak.lastStudyDate = today;
  streak.stats.totalStudyDays = streak.studyDates.length;
  streak.stats.totalSessions += 1;
  
  // Check achievements
  checkAchievements(streak);
  
  await streak.save();
}

function checkAchievements(streak) {
  const achievements = [];
  
  if (streak.currentStreak === 1 && !streak.achievements.some(a => a.type === 'first_day')) {
    achievements.push({ type: 'first_day' });
  }
  
  if (streak.currentStreak === 7 && !streak.achievements.some(a => a.type === 'week_streak')) {
    achievements.push({ type: 'week_streak' });
  }
  
  if (streak.currentStreak === 30 && !streak.achievements.some(a => a.type === 'month_streak')) {
    achievements.push({ type: 'month_streak' });
  }
  
  achievements.forEach(achievement => {
    streak.achievements.push(achievement);
  });
}
