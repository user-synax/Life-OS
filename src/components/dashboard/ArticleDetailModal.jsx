'use client';

import { useState, useEffect } from 'react';
import { X, Edit, Trash2, Calendar, Tag, Link2, Pin, Archive } from 'lucide-react';
import useKnowledgeStore from '@/store/useKnowledgeStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function ArticleDetailModal({ articleId, isOpen, onClose, onEdit }) {
  const { currentArticle, getArticle, deleteArticle, updateArticle } = useKnowledgeStore();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'general',
    pinned: false,
  });

  useEffect(() => {
    if (isOpen && articleId) {
      getArticle(articleId);
    }
  }, [isOpen, articleId, getArticle]);

  useEffect(() => {
    if (currentArticle) {
      setEditForm({
        title: currentArticle.title,
        content: currentArticle.content,
        tags: currentArticle.tags.join(', '),
        category: currentArticle.category,
        pinned: currentArticle.pinned,
      });
    }
  }, [currentArticle]);

  const handleSave = async () => {
    try {
      await updateArticle(articleId, {
        ...editForm,
        tags: editForm.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update article:', error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this article?')) {
      try {
        await deleteArticle(articleId);
        onClose();
      } catch (error) {
        console.error('Failed to delete article:', error);
      }
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isOpen || !currentArticle) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-4xl max-h-[90vh] bg-[#171717] border-[#2e2e2e] rounded-[8px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2e2e2e]">
          <div className="flex items-center gap-3">
            {currentArticle.pinned && <Pin size={16} className="text-[#3ecf8e]" />}
            {isEditing ? (
              <input
                type="text"
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="text-xl font-medium bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] px-3 py-1 rounded-[4px] flex-1"
              />
            ) : (
              <h2 className="text-xl font-medium text-[#fafafa]">{currentArticle.title}</h2>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button
                  onClick={handleSave}
                  className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
                >
                  Save
                </Button>
                <Button
                  onClick={() => setIsEditing(false)}
                  variant="outline"
                  className="border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="ghost"
                  size="sm"
                  className="text-[#898989] hover:text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
                >
                  <Edit size={14} />
                </Button>
                <Button
                  onClick={handleDelete}
                  variant="ghost"
                  size="sm"
                  className="text-[#898989] hover:text-[#ef4444] hover:bg-[#ef4444]/10 rounded-[4px]"
                >
                  <Trash2 size={14} />
                </Button>
              </>
            )}
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-[#898989] hover:text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
            >
              <X size={16} />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-[#898989]">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Created: {formatDate(currentArticle.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>Updated: {formatDate(currentArticle.updatedAt)}</span>
            </div>
            {currentArticle.category && (
              <span className="px-2 py-1 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px] text-xs">
                {currentArticle.category}
              </span>
            )}
            {currentArticle.tags.length > 0 && (
              <div className="flex items-center gap-1">
                <Tag size={12} />
                <span>{currentArticle.tags.join(', ')}</span>
              </div>
            )}
            {currentArticle.links.length > 0 && (
              <div className="flex items-center gap-1">
                <Link2 size={12} />
                <span>{currentArticle.links.length} links</span>
              </div>
            )}
          </div>

          {/* Edit Mode */}
          {isEditing ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Content</label>
                <textarea
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full h-64 px-4 py-3 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] resize-none"
                  placeholder="Article content..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-[#898989]">Tags</label>
                  <input
                    type="text"
                    value={editForm.tags}
                    onChange={(e) => setEditForm({ ...editForm, tags: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
                    placeholder="Tags (comma separated)..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-[#898989]">Category</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
                  >
                    <option value="general">General</option>
                    <option value="tech">Tech</option>
                    <option value="learning">Learning</option>
                    <option value="notes">Notes</option>
                    <option value="ideas">Ideas</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinned"
                  checked={editForm.pinned}
                  onChange={(e) => setEditForm({ ...editForm, pinned: e.target.checked })}
                  className="rounded border-[#2e2e2e]"
                />
                <label htmlFor="pinned" className="text-sm text-[#fafafa]">Pin article</label>
              </div>
            </div>
          ) : (
            /* View Mode */
            <div className="space-y-6">
              <div className="prose prose-invert max-w-none">
                <div className="whitespace-pre-wrap text-[#fafafa] leading-relaxed">
                  {currentArticle.content}
                </div>
              </div>

              {/* Linked Articles */}
              {currentArticle.links.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#fafafa] flex items-center gap-2">
                    <Link2 size={16} className="text-[#3ecf8e]" />
                    Linked Articles
                  </h3>
                  <div className="grid gap-2">
                    {currentArticle.links.map((link) => (
                      <div
                        key={link._id}
                        className="p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px] cursor-pointer hover:border-[#3ecf8e] transition-colors"
                        onClick={() => onEdit(link._id)}
                      >
                        <div className="text-sm text-[#fafafa]">{link.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Backlinked Articles */}
              {currentArticle.backlinks.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-medium text-[#fafafa]">Backlinked Articles</h3>
                  <div className="grid gap-2">
                    {currentArticle.backlinks.map((backlink) => (
                      <div
                        key={backlink._id}
                        className="p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px] cursor-pointer hover:border-[#3ecf8e] transition-colors"
                        onClick={() => onEdit(backlink._id)}
                      >
                        <div className="text-sm text-[#fafafa]">{backlink.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
