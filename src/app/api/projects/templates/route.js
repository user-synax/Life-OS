import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import ProjectTemplate from '@/lib/db/models/ProjectTemplate';
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
    const search = searchParams.get('search');
    const isPublic = searchParams.get('isPublic') === 'true';
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const sortBy = searchParams.get('sortBy') || 'usageCount';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = {};
    
    if (isPublic) {
      query.isPublic = true;
      query.isSystem = true;
    } else {
      query.createdBy = decoded.userId;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Build sort options
    let sortOptions = {};
    switch (sortBy) {
      case 'name':
        sortOptions = { name: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'category':
        sortOptions = { category: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'usageCount':
        sortOptions = { usageCount: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'createdAt':
        sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
    }

    const templates = await ProjectTemplate.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await ProjectTemplate.countDocuments(query);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    log.error('Get templates error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const templateData = await req.json();
    
    await connectDB();
    
    const template = new ProjectTemplate({
      ...templateData,
      createdBy: decoded.userId,
      isSystem: false
    });

    await template.save();

    return NextResponse.json({ template }, { status: 201 });
  } catch (error) {
    log.error('Create template error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
