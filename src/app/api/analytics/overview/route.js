import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import StudySession from '@/lib/db/models/StudySession';
import LearningStreak from '@/lib/db/models/LearningStreak';
import SkillMastery from '@/lib/db/models/SkillMastery';
import KnowledgeArticle from '@/lib/db/models/KnowledgeArticle';
import Flashcard from '@/lib/db/models/Flashcard';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'week'; // week, month, year, all
    
    // Calculate date ranges
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(0); // Beginning of time
    }

    // Get study sessions data
    const sessionQuery = { 
      userId: decoded.userId,
      startTime: { $gte: startDate }
    };
    
    const sessions = await StudySession.find(sessionQuery)
      .sort({ startTime: -1 });

    // Get streak data
    const streakData = await LearningStreak.findOne({ userId: decoded.userId });
    
    // Get skills data
    const skills = await SkillMastery.find({ userId: decoded.userId });
    
    // Get content counts
    const [articleCount, flashcardCount] = await Promise.all([
      KnowledgeArticle.countDocuments({ userId: decoded.userId }),
      Flashcard.countDocuments({ userId: decoded.userId })
    ]);

    // Calculate overview metrics
    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((sum, session) => sum + session.duration, 0);
    const averageSessionDuration = totalSessions > 0 ? totalMinutes / totalSessions : 0;
    
    // Session type distribution
    const sessionTypes = sessions.reduce((acc, session) => {
      acc[session.sessionType] = (acc[session.sessionType] || 0) + 1;
      return acc;
    }, {});

    // Daily study data for charts
    const dailyData = {};
    sessions.forEach(session => {
      const dateKey = session.startTime.toISOString().split('T')[0];
      if (!dailyData[dateKey]) {
        dailyData[dateKey] = {
          date: dateKey,
          minutes: 0,
          sessions: 0,
          types: {}
        };
      }
      dailyData[dateKey].minutes += session.duration;
      dailyData[dateKey].sessions += 1;
      dailyData[dateKey].types[session.sessionType] = (dailyData[dateKey].types[session.sessionType] || 0) + 1;
    });

    // Hourly distribution
    const hourlyData = Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      minutes: 0,
      sessions: 0
    }));
    
    sessions.forEach(session => {
      const hour = session.startTime.getHours();
      hourlyData[hour].minutes += session.duration;
      hourlyData[hour].sessions += 1;
    });

    // Weekly distribution
    const weeklyData = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      .map((day, index) => ({
        day,
        dayIndex: index,
        minutes: 0,
        sessions: 0
      }));
    
    sessions.forEach(session => {
      const dayIndex = session.startTime.getDay();
      weeklyData[dayIndex === 0 ? 6 : dayIndex - 1].minutes += session.duration;
      weeklyData[dayIndex === 0 ? 6 : dayIndex - 1].sessions += 1;
    });

    // Skill progress
    const skillStats = {
      totalSkills: skills.length,
      averageLevel: skills.length > 0 ? 
        skills.reduce((sum, skill) => sum + skill.currentLevel, 0) / skills.length : 0,
      skillsByLevel: {
        beginner: skills.filter(s => s.currentLevel < 30).length,
        intermediate: skills.filter(s => s.currentLevel >= 30 && s.currentLevel < 70).length,
        advanced: skills.filter(s => s.currentLevel >= 70).length
      },
      topSkills: skills
        .sort((a, b) => b.currentLevel - a.currentLevel)
        .slice(0, 5)
        .map(skill => ({
          name: skill.skillName,
          level: skill.currentLevel,
          category: skill.category
        }))
    };

    // Recent achievements
    const recentAchievements = streakData?.achievements
      ?.sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))
      ?.slice(0, 3) || [];

    const overview = {
      period,
      summary: {
        totalSessions,
        totalMinutes,
        totalHours: Math.round(totalMinutes / 60 * 10) / 10,
        averageSessionDuration: Math.round(averageSessionDuration * 10) / 10,
        currentStreak: streakData?.currentStreak || 0,
        longestStreak: streakData?.longestStreak || 0,
        totalArticles: articleCount,
        totalFlashcards: flashcardCount
      },
      sessionTypes,
      dailyData: Object.values(dailyData).sort((a, b) => new Date(a.date) - new Date(b.date)),
      hourlyData,
      weeklyData,
      skillStats,
      recentAchievements,
      focusScore: sessions.length > 0 ? 
        sessions.reduce((sum, session) => sum + (session.focusScore || 100), 0) / sessions.length : 100
    };

    return NextResponse.json({ overview });
  } catch (error) {
    console.error('Get overview error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
