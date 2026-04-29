import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import SkillMastery from '@/lib/db/models/SkillMastery';
import { log } from '@/lib/logger';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const sortBy = searchParams.get('sortBy') || 'currentLevel';
    const limit = parseInt(searchParams.get('limit')) || 20;

    const query = { userId: decoded.userId };
    
    if (category && category !== 'all') {
      query.category = category;
    }

    let sortOptions = {};
    switch (sortBy) {
      case 'level':
        sortOptions = { currentLevel: -1 };
        break;
      case 'progress':
        sortOptions = { 'progressHistory.date': -1 };
        break;
      case 'time':
        sortOptions = { 'timeSpent.totalMinutes': -1 };
        break;
      case 'name':
        sortOptions = { skillName: 1 };
        break;
      default:
        sortOptions = { currentLevel: -1 };
    }

    const skills = await SkillMastery.find(query)
      .populate('relatedArticles', 'title tags')
      .populate('relatedFlashcards', 'front deck')
      .sort(sortOptions)
      .limit(limit);

    // Calculate overall stats
    const totalSkills = skills.length;
    const averageLevel = skills.reduce((sum, skill) => sum + skill.currentLevel, 0) / totalSkills || 0;
    const skillsByCategory = skills.reduce((acc, skill) => {
      acc[skill.category] = (acc[skill.category] || 0) + 1;
      return acc;
    }, {});

    const topSkills = skills
      .filter(skill => skill.currentLevel >= 70)
      .slice(0, 5);

    const skillsNeedingAttention = skills
      .filter(skill => skill.currentLevel < 30)
      .slice(0, 5);

    return NextResponse.json({
      skills,
      stats: {
        totalSkills,
        averageLevel: Math.round(averageLevel * 100) / 100,
        skillsByCategory,
        topSkillsCount: topSkills.length,
        skillsNeedingAttentionCount: skillsNeedingAttention.length,
        totalStudyTime: skills.reduce((sum, skill) => sum + skill.timeSpent.totalMinutes, 0)
      },
      topSkills,
      skillsNeedingAttention
    });
  } catch (error) {
    log.error('Get skills error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const skillData = await req.json();
    
    await connectDB();
    
    // Check if skill already exists
    const existingSkill = await SkillMastery.findOne({
      userId: decoded.userId,
      skillName: skillData.skillName
    });

    if (existingSkill) {
      return NextResponse.json({ 
        error: 'Skill already exists',
        existingSkill 
      }, { status: 409 });
    }

    const skill = new SkillMastery({
      ...skillData,
      userId: decoded.userId,
      progressHistory: [{
        date: new Date(),
        level: skillData.currentLevel || 0,
        sessionType: 'knowledge'
      }]
    });

    await skill.save();

    return NextResponse.json({ skill }, { status: 201 });
  } catch (error) {
    log.error('Create skill error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PATCH(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    const { skillId, ...updateData } = updates;
    
    await connectDB();
    
    const skill = await SkillMastery.findOneAndUpdate(
      { 
        _id: skillId,
        userId: decoded.userId 
      },
      {
        ...updateData,
        $push: {
          progressHistory: {
            date: new Date(),
            level: updateData.currentLevel,
            sessionType: updateData.sessionType || 'knowledge'
          }
        }
      },
      { new: true }
    ).populate('relatedArticles relatedFlashcards');

    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json({ skill });
  } catch (error) {
    log.error('Update skill error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
