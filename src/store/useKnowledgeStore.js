import { create } from 'zustand';
import axios from 'axios';

const useKnowledgeStore = create((set, get) => ({
  articles: [],
  currentArticle: null,
  loading: false,
  searchQuery: '',
  selectedCategory: 'all',
  selectedTags: [],

  fetchArticles: async (filters = {}) => {
    try {
      set({ loading: true });
      const params = new URLSearchParams();
      
      if (filters.category && filters.category !== 'all') {
        params.append('category', filters.category);
      }
      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      const { data } = await axios.get(`/api/knowledge/articles?${params}`);
      set({ articles: data.articles, loading: false });
    } catch (error) {
      console.error('Fetch articles error:', error);
      set({ loading: false });
    }
  },

  addArticle: async (articleData) => {
    try {
      const { data } = await axios.post('/api/knowledge/articles', articleData);
      set({ articles: [data.article, ...get().articles] });
      return data.article;
    } catch (error) {
      console.error('Add article error:', error);
      throw error;
    }
  },

  updateArticle: async (id, updates) => {
    const oldArticles = get().articles;
    set({
      articles: get().articles.map((a) =>
        a._id === id ? { ...a, ...updates } : a
      ),
    });

    try {
      const { data } = await axios.patch(`/api/knowledge/articles/${id}`, updates);
      set({
        articles: get().articles.map((a) => (a._id === id ? data.article : a)),
        currentArticle: get().currentArticle?._id === id ? data.article : get().currentArticle,
      });
      return data.article;
    } catch (error) {
      console.error('Update article error:', error);
      set({ articles: oldArticles });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    try {
      await axios.delete(`/api/knowledge/articles/${id}`);
      set({ articles: get().articles.filter((a) => a._id !== id) });
      if (get().currentArticle?._id === id) {
        set({ currentArticle: null });
      }
    } catch (error) {
      console.error('Delete article error:', error);
      throw error;
    }
  },

  getArticle: async (id) => {
    try {
      const { data } = await axios.get(`/api/knowledge/articles/${id}`);
      set({ currentArticle: data.article });
      return data.article;
    } catch (error) {
      console.error('Get article error:', error);
      throw error;
    }
  },

  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  getCategories: () => {
    const articles = get().articles;
    const categories = [...new Set(articles.map(a => a.category).filter(Boolean))];
    return categories.sort();
  },

  getAllTags: () => {
    const articles = get().articles;
    const tags = [...new Set(articles.flatMap(a => a.tags))];
    return tags.sort();
  },

  getLinkedArticles: (articleId) => {
    const articles = get().articles;
    return articles.filter(a => a.links?.includes(articleId));
  },

  getBacklinkedArticles: (articleId) => {
    const articles = get().articles;
    return articles.filter(a => a.backlinks?.includes(articleId));
  },
}));

export default useKnowledgeStore;
