import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth/jwt';
import connectDB from '@/lib/db/mongodb';
import KnowledgeArticle from '@/lib/db/models/KnowledgeArticle';
import { ObjectId } from 'mongodb';

export async function GET(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    // Await params in Next.js 15+
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }
    
    const article = await KnowledgeArticle.findOne({ 
      _id: new ObjectId(id), 
      userId: decoded.userId 
    })
    .populate('links', 'title')
    .populate('backlinks', 'title');
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Get article error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const updates = await req.json();
    
    await connectDB();
    
    // Await params in Next.js 15+
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }
    
    const article = await KnowledgeArticle.findOneAndUpdate(
      { _id: new ObjectId(id), userId: decoded.userId },
      updates,
      { new: true }
    ).populate('links', 'title').populate('backlinks', 'title');
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    return NextResponse.json({ article });
  } catch (error) {
    console.error('Update article error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const token = req.cookies.get('token')?.value;
    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    
    // Await params in Next.js 15+
    const { id } = await params;
    
    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid article ID' }, { status: 400 });
    }
    
    const article = await KnowledgeArticle.findOneAndDelete({ 
      _id: new ObjectId(id), 
      userId: decoded.userId 
    });
    
    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }
    
    // Remove from backlinks
    await KnowledgeArticle.updateMany(
      { backlinks: new ObjectId(id) },
      { $pull: { backlinks: new ObjectId(id) } }
    );
    
    return NextResponse.json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Delete article error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
