import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import LearningStreak from '@/lib/db/models/LearningStreak';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    let streak = await LearningStreak.findOne({ userId: decoded.userId })
      .populate('studyDates.date');

    if (!streak) {
      // Create initial streak record
      streak = new LearningStreak({ userId: decoded.userId });
      await streak.save();
    }

    // Calculate additional stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const lastStudy = streak.lastStudyDate ? new Date(streak.lastStudyDate) : null;
    const daysSinceLastStudy = lastStudy ? Math.floor((today - lastStudy) / (1000 * 60 * 60 * 24)) : null;
    
    // Calculate weekly progress
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekSessions = streak.studyDates.filter(date => 
      new Date(date.date) >= weekStart
    ).length;
    
    // Calculate monthly progress
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthSessions = streak.studyDates.filter(date => 
      new Date(date.date) >= monthStart
    ).length;

    return NextResponse.json({
      streak: {
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastStudyDate: streak.lastStudyDate,
        daysSinceLastStudy,
        achievements: streak.achievements,
        goals: streak.goals,
        stats: {
          ...streak.stats,
          thisWeekSessions,
          thisMonthSessions,
          weeklyGoalProgress: (thisWeekSessions / streak.goals.weeklyTargetDays) * 100,
          dailyGoalProgress: streak.stats.averageSessionDuration ? 
            Math.min((streak.stats.averageSessionDuration / streak.goals.dailyTargetMinutes) * 100, 100) : 0
        }
      }
    });
  } catch (error) {
    console.error('Get streak error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    
    await connectDB();
    
    const streak = await LearningStreak.findOneAndUpdate(
      { userId: decoded.userId },
      updates,
      { new: true, upsert: true }
    );

    return NextResponse.json({ streak });
  } catch (error) {
    console.error('Update streak error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
