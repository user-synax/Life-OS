import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import ProjectTemplate from '@/lib/db/models/ProjectTemplate';

export async function GET(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const priority = searchParams.get('priority');
    const tags = searchParams.get('tags');
    const search = searchParams.get('search');
    const limit = parseInt(searchParams.get('limit')) || 20;
    const page = parseInt(searchParams.get('page')) || 1;
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    // Build query
    const query = { userId: decoded.userId };
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (priority && priority !== 'all') {
      query.priority = priority;
    }
    
    if (tags) {
      query.tags = { $in: tags.split(',').map(tag => tag.trim()).filter(Boolean) };
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
      case 'priority':
        sortOptions = { priority: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'dueDate':
        sortOptions = { dueDate: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'progress':
        sortOptions = { progress: sortOrder === 'desc' ? -1 : 1 };
        break;
      case 'createdAt':
        sortOptions = { createdAt: sortOrder === 'desc' ? -1 : 1 };
        break;
      default:
        sortOptions = { updatedAt: sortOrder === 'desc' ? -1 : 1 };
    }

    const projects = await Project.find(query)
      .populate('templateId', 'name category')
      .populate('subProjects', 'name status')
      .populate('teamMembers.userId', 'name')
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit);

    const total = await Project.countDocuments(query);

    return NextResponse.json({
      projects,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get projects error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const projectData = await req.json();
    
    await connectDB();
    
    const project = new Project({
      ...projectData,
      userId: decoded.userId,
      // Handle dates
      startDate: projectData.startDate ? new Date(projectData.startDate) : null,
      endDate: projectData.endDate ? new Date(projectData.endDate) : null,
      dueDate: projectData.dueDate ? new Date(projectData.dueDate) : null
    });

    await project.save();

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error('Create project error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
