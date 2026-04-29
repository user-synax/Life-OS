import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import Project from '@/lib/db/models/Project';
import { log } from '@/lib/logger';
import { createErrorResponse } from '@/lib/errorHandler';

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Await params in Next.js 15+
    const { id } = await params;

    await connectDB();
    
    const project = await Project.findOne({ 
      _id: id, 
      userId: decoded.userId 
    })
      .populate('templateId', 'name category structure')
      .populate('subProjects', 'name status')
      .populate('teamMembers.userId', 'name role')
      .populate('linkedTasks', 'title status')
      .populate('linkedKnowledge', 'title tags')
      .populate('milestones', 'name status dueDate');

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    log.error('Get project error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    const updates = await req.json();
    
    await connectDB();
    
    // Handle dates
    if (updates.startDate) updates.startDate = new Date(updates.startDate);
    if (updates.endDate) updates.endDate = new Date(updates.endDate);
    if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);

    const project = await Project.findOneAndUpdate(
      { 
        _id: id, 
        userId: decoded.userId 
      },
      updates,
      { new: true }
    );

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    log.error('Update project error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    
    await connectDB();
    
    const project = await Project.findOneAndDelete({ 
      _id: id, 
      userId: decoded.userId 
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    log.error('Delete project error', error);
    const { error: message, statusCode } = createErrorResponse(error, req);
    return NextResponse.json({ error: message }, { status: statusCode });
  }
}
