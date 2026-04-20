'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, BookOpen, Tag, Calendar, Pin, Archive, Link2 } from 'lucide-react';
import useKnowledgeStore from '@/store/useKnowledgeStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ArticleDetailModal from '@/components/dashboard/ArticleDetailModal';

export default function KnowledgeComponent() {
  const {
    articles,
    loading,
    searchQuery,
    selectedCategory,
    fetchArticles,
    addArticle,
    setSearchQuery,
    setSelectedCategory,
    getCategories,
    getAllTags,
  } = useKnowledgeStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    tags: '',
    category: 'general',
  });

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  const categories = getCategories();
  const tags = getAllTags();

  const handleAddArticle = async (e) => {
    e.preventDefault();
    try {
      await addArticle({
        ...newArticle,
        tags: newArticle.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setNewArticle({ title: '', content: '', tags: '', category: 'general' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add article:', error);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article._id);
    setShowDetailModal(true);
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedArticle(null);
  };

  const handleEditArticle = (articleId) => {
    setSelectedArticle(articleId);
    setShowDetailModal(true);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchArticles({ search: query, category: selectedCategory });
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    fetchArticles({ category, search: searchQuery });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#fafafa] flex items-center gap-2">
          <BookOpen size={18} className="text-[#3ecf8e]" />
          Knowledge Base
        </h3>
        <Button
          size="sm"
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
        >
          <Plus size={14} className="mr-1" />
          Add
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#898989]" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9 bg-[#171717] border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px]"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => handleCategoryChange(e.target.value)}
          className="px-3 py-2 bg-[#171717] border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Add Article Form */}
      {showAddForm && (
        <Card className="p-4 bg-[#171717] border-[#2e2e2e] rounded-[4px]">
          <form onSubmit={handleAddArticle} className="space-y-3">
            <Input
              placeholder="Article title..."
              value={newArticle.title}
              onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
              className="bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px]"
              required
            />
            <textarea
              placeholder="Article content..."
              value={newArticle.content}
              onChange={(e) => setNewArticle({ ...newArticle, content: e.target.value })}
              className="w-full h-24 px-3 py-2 bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px] resize-none"
              required
            />
            <div className="flex gap-2">
              <Input
                placeholder="Tags (comma separated)..."
                value={newArticle.tags}
                onChange={(e) => setNewArticle({ ...newArticle, tags: e.target.value })}
                className="flex-1 bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px]"
              />
              <select
                value={newArticle.category}
                onChange={(e) => setNewArticle({ ...newArticle, category: e.target.value })}
                className="px-3 py-2 bg-[#0f0f0f] border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
              >
                <option value="general">General</option>
                <option value="tech">Tech</option>
                <option value="learning">Learning</option>
                <option value="notes">Notes</option>
                <option value="ideas">Ideas</option>
              </select>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]">
                Create Article
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAddForm(false)}
                className="border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Articles List */}
      <div className="flex-1 overflow-y-auto space-y-2">
        {articles.length === 0 ? (
          <div className="text-center py-8">
            <BookOpen size={32} className="mx-auto text-[#898989] mb-2" />
            <p className="text-[#898989] text-sm">No articles yet. Create your first article!</p>
          </div>
        ) : (
          articles.map((article) => (
            <Card
              key={article._id}
              onClick={() => handleArticleClick(article)}
              className="p-3 bg-[#171717] border-[#2e2e2e] hover:border-[#3ecf8e] transition-colors rounded-[4px] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {article.pinned && <Pin size={12} className="text-[#3ecf8e]" />}
                    <h4 className="text-sm font-medium text-[#fafafa] truncate">
                      {article.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#898989] line-clamp-2 mb-2">
                    {article.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[#898989]">
                    <span className="flex items-center gap-1">
                      <Calendar size={10} />
                      {formatDate(article.updatedAt)}
                    </span>
                    {article.tags.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Tag size={10} />
                        {article.tags.slice(0, 2).join(', ')}
                        {article.tags.length > 2 && '...'}
                      </span>
                    )}
                    {article.links.length > 0 && (
                      <span className="flex items-center gap-1">
                        <Link2 size={10} />
                        {article.links.length}
                      </span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#898989] ml-2">
                  {article.category}
                </span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Stats Footer */}
      <div className="flex items-center justify-between text-xs text-[#898989] pt-2 border-t border-[#2e2e2e]">
        <span>{articles.length} articles</span>
        <span>{tags.length} tags</span>
        <span>{categories.length} categories</span>
      </div>

      {/* Article Detail Modal */}
      <ArticleDetailModal
        articleId={selectedArticle}
        isOpen={showDetailModal}
        onClose={handleCloseModal}
        onEdit={handleEditArticle}
      />
    </div>
  );
}
