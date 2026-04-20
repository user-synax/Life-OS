import { create } from 'zustand';
import axios from 'axios';

const useFlashcardStore = create((set, get) => ({
  flashcards: [],
  currentCard: null,
  dueCards: [],
  reviews: [],
  loading: false,
  studyMode: false,
  selectedDeck: 'all',
  selectedTags: [],

  fetchFlashcards: async (filters = {}) => {
    try {
      set({ loading: true });
      const params = new URLSearchParams();
      
      if (filters.deck && filters.deck !== 'all') {
        params.append('deck', filters.deck);
      }
      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }
      if (filters.due) {
        params.append('due', 'true');
      }
      
      const { data } = await axios.get(`/api/knowledge/flashcards?${params}`);
      set({ flashcards: data.flashcards, loading: false });
    } catch (error) {
      console.error('Fetch flashcards error:', error);
      set({ loading: false });
    }
  },

  fetchDueCards: async () => {
    try {
      const { data } = await axios.get('/api/knowledge/flashcards?due=true');
      set({ dueCards: data.flashcards });
    } catch (error) {
      console.error('Fetch due cards error:', error);
    }
  },

  addFlashcard: async (cardData) => {
    try {
      const { data } = await axios.post('/api/knowledge/flashcards', cardData);
      set({ flashcards: [data.flashcard, ...get().flashcards] });
      return data.flashcard;
    } catch (error) {
      console.error('Add flashcard error:', error);
      throw error;
    }
  },

  updateFlashcard: async (id, updates) => {
    const oldFlashcards = get().flashcards;
    set({
      flashcards: get().flashcards.map((c) =>
        c._id === id ? { ...c, ...updates } : c
      ),
    });

    try {
      // Note: You would need to create a PATCH endpoint for flashcards
      // For now, we'll just update locally
      return get().flashcards.find(c => c._id === id);
    } catch (error) {
      console.error('Update flashcard error:', error);
      set({ flashcards: oldFlashcards });
      throw error;
    }
  },

  deleteFlashcard: async (id) => {
    try {
      // Note: You would need to create a DELETE endpoint for flashcards
      set({ 
        flashcards: get().flashcards.filter((c) => c._id !== id),
        dueCards: get().dueCards.filter((c) => c._id !== id),
      });
    } catch (error) {
      console.error('Delete flashcard error:', error);
      throw error;
    }
  },

  reviewCard: async (id, quality, timeTaken) => {
    try {
      const { data } = await axios.post(`/api/knowledge/flashcards/${id}/review`, {
        quality,
        timeTaken,
      });

      // Update the card in state
      set({
        flashcards: get().flashcards.map((c) =>
          c._id === id ? data.flashcard : c
        ),
        dueCards: get().dueCards.filter((c) => c._id !== id),
        reviews: [data.review, ...get().reviews],
      });

      // Get next due card
      const remainingCards = get().dueCards.filter((c) => c._id !== id);
      set({ currentCard: remainingCards.length > 0 ? remainingCards[0] : null });

      return data;
    } catch (error) {
      console.error('Review card error:', error);
      throw error;
    }
  },

  startStudySession: async () => {
    await get().fetchDueCards();
    const dueCards = get().dueCards;
    set({ 
      studyMode: true, 
      currentCard: dueCards.length > 0 ? dueCards[0] : null 
    });
  },

  endStudySession: () => {
    set({ 
      studyMode: false, 
      currentCard: null 
    });
  },

  nextCard: () => {
    const dueCards = get().dueCards;
    const currentCard = get().currentCard;
    const currentIndex = dueCards.findIndex(c => c._id === currentCard?._id);
    const nextIndex = currentIndex + 1;
    
    if (nextIndex < dueCards.length) {
      set({ currentCard: dueCards[nextIndex] });
    } else {
      set({ currentCard: null });
    }
  },

  setSelectedDeck: (deck) => set({ selectedDeck: deck }),
  setSelectedTags: (tags) => set({ selectedTags: tags }),

  getDecks: () => {
    const flashcards = get().flashcards;
    const decks = [...new Set(flashcards.map(c => c.deck).filter(Boolean))];
    return decks.sort();
  },

  getAllTags: () => {
    const flashcards = get().flashcards;
    const tags = [...new Set(flashcards.flatMap(c => c.tags))];
    return tags.sort();
  },

  getStats: () => {
    const flashcards = get().flashcards;
    const reviews = get().reviews;
    
    const totalCards = flashcards.length;
    const dueCards = flashcards.filter(c => 
      new Date(c.nextReview) <= new Date() && !c.suspended
    ).length;
    const suspendedCards = flashcards.filter(c => c.suspended).length;
    
    const todayReviews = reviews.filter(r => 
      new Date(r.reviewDate).toDateString() === new Date().toDateString()
    ).length;
    
    const avgQuality = reviews.length > 0 
      ? reviews.reduce((sum, r) => sum + r.quality, 0) / reviews.length 
      : 0;

    return {
      totalCards,
      dueCards,
      suspendedCards,
      todayReviews,
      avgQuality: Math.round(avgQuality * 10) / 10,
    };
  },
}));

export default useFlashcardStore;
