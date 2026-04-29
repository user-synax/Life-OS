import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import KnowledgeArticle from '@/lib/db/models/KnowledgeArticle';
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
    const tags = searchParams.get('tags')?.split(',').filter(Boolean);
    const search = searchParams.get('search');
    const archived = searchParams.get('archived') === 'true';
    
    let query = { userId: decoded.userId };
    
    if (category) query.category = category;
    if (tags && tags.length > 0) query.tags = { $in: tags };
    if (search) {
      query.$text = { $search: search };
    }
    if (!archived) {
      query.archived = { $ne: true };
    }
    
    const articles = await KnowledgeArticle.find(query)
      .populate('links', 'title')
      .populate('backlinks', 'title')
      .sort({ pinned: -1, updatedAt: -1 });
    
    return NextResponse.json({ articles });
  } catch (error) {
    log.error('Get articles error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { title, content, tags, category, links } = await req.json();
    
    await connectDB();
    
    const article = await KnowledgeArticle.create({
      title,
      content,
      tags: tags || [],
      category: category || 'general',
      links: links || [],
      userId: decoded.userId,
    });
    
    // Update backlinks
    if (links && links.length > 0) {
      await KnowledgeArticle.updateMany(
        { _id: { $in: links } },
        { $addToSet: { backlinks: article._id } }
      );
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    log.error('Create article error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
