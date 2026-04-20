'use client';

import { useState, useEffect, useRef } from 'react';
import { Plus, Play, RotateCcw, Clock, CheckCircle, X, Star } from 'lucide-react';
import useFlashcardStore from '@/store/useFlashcardStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { gsap } from 'gsap';
import AddCardModal from '@/components/dashboard/AddCardModal';

export default function FlashcardComponent() {
  const {
    flashcards,
    loading,
    selectedDeck,
    fetchFlashcards,
    addFlashcard,
    setSelectedDeck,
    getDecks,
  } = useFlashcardStore();

  const [showAddForm, setShowAddForm] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    deck: 'default',
    tags: '',
  });

  const cardRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards]);

  const decks = getDecks();
  const currentCard = flashcards[currentCardIndex] || null;

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
      // Reset card rotation to proper starting positions
      if (frontRef.current && backRef.current) {
        gsap.set(frontRef.current, { rotationY: 0 });
        gsap.set(backRef.current, { rotationY: -90 });
      }
    }
  };

  const handlePrevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
      // Reset card rotation to proper starting positions
      if (frontRef.current && backRef.current) {
        gsap.set(frontRef.current, { rotationY: 0 });
        gsap.set(backRef.current, { rotationY: -90 });
      }
    }
  };

  const handleCardClick = (index) => {
    setCurrentCardIndex(index);
    setShowAnswer(false);
    // Reset card rotation to proper starting positions
    if (frontRef.current && backRef.current) {
      gsap.set(frontRef.current, { rotationY: 0 });
      gsap.set(backRef.current, { rotationY: -90 });
    }
  };

  const handleCardFlip = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    const tl = gsap.timeline({
      onComplete: () => {
        setShowAnswer(!showAnswer);
        setIsFlipping(false);
      }
    });

    if (!showAnswer) {
      // Flip to show back
      tl.to(frontRef.current, {
        rotationY: 90,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .set(backRef.current, { rotationY: -90 })
      .to(backRef.current, {
        rotationY: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, "-=0.15")
      .set(frontRef.current, { rotationY: 90 });
    } else {
      // Flip to show front
      tl.to(backRef.current, {
        rotationY: 90,
        duration: 0.3,
        ease: "power2.inOut",
      })
      .set(frontRef.current, { rotationY: -90 })
      .to(frontRef.current, {
        rotationY: 0,
        duration: 0.3,
        ease: "power2.inOut",
      }, "-=0.15")
      .set(backRef.current, { rotationY: 90 });
    }
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
          <Star size={18} className="text-[#3ecf8e]" />
          Flashcards
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#898989]">
            {currentCardIndex + 1} / {flashcards.length}
          </span>
          <Button
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
          >
            <Plus size={14} className="mr-1" />
            Add
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="text-center p-2 bg-[#171717] border border-[#2e2e2e] rounded-[4px]">
          <div className="text-lg font-bold text-[#3ecf8e]">{flashcards.length}</div>
          <div className="text-xs text-[#898989]">Total</div>
        </div>
        <div className="text-center p-2 bg-[#171717] border border-[#2e2e2e] rounded-[4px]">
          <div className="text-lg font-bold text-[#f59e0b]">{decks.length}</div>
          <div className="text-xs text-[#898989]">Decks</div>
        </div>
        <div className="text-center p-2 bg-[#171717] border border-[#2e2e2e] rounded-[4px]">
          <div className="text-lg font-bold text-[#8b5cf6]">{selectedDeck === 'all' ? 'All' : selectedDeck}</div>
          <div className="text-xs text-[#898989]">Current</div>
        </div>
      </div>

      {/* Deck Filter */}
      <div className="flex gap-2">
        <select
          value={selectedDeck}
          onChange={(e) => setSelectedDeck(e.target.value)}
          className="flex-1 px-3 py-2 bg-[#171717] border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
        >
          <option value="all">All Decks</option>
          {decks.map(deck => (
            <option key={deck} value={deck}>{deck}</option>
          ))}
        </select>
      </div>

      
      {/* Flashcard Viewer */}
      {flashcards.length > 0 && currentCard && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-[#fafafa]">Current Card</h4>
            <div className="flex gap-1">
              <Button
                size="sm"
                onClick={handlePrevCard}
                disabled={currentCardIndex === 0}
                className="px-2 py-1 bg-[#363636] text-[#fafafa] hover:bg-[#434343] disabled:opacity-50 rounded-[2px] text-xs"
              >
                Prev
              </Button>
              <Button
                size="sm"
                onClick={handleNextCard}
                disabled={currentCardIndex === flashcards.length - 1}
                className="px-2 py-1 bg-[#363636] text-[#fafafa] hover:bg-[#434343] disabled:opacity-50 rounded-[2px] text-xs"
              >
                Next
              </Button>
            </div>
          </div>
          
          <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[4px] relative overflow-hidden" style={{ height: '280px' }}>
            <div className="relative w-full h-full" ref={cardRef}>
              {/* Front of Card - Blue Theme */}
              <div 
                ref={frontRef}
                className="absolute inset-0 p-6 rounded-[4px] bg-[#1e40af] border border-[#3b82f6] cursor-pointer flex flex-col justify-center backface-hidden"
                onClick={handleCardFlip}
                style={{ transformStyle: 'preserve-3d' }}
              >
                <div className="mb-2">
                  <span className="text-xs text-[#93c5fd] uppercase tracking-wide font-medium">Front</span>
                </div>
                <p className="text-lg text-[#dbeafe] font-medium">
                  {currentCard.front}
                </p>
                <div className="mt-3 text-xs text-[#93c5fd]">
                  Click to flip
                </div>
              </div>
              
              {/* Back of Card - Green Theme */}
              <div 
                ref={backRef}
                className="absolute inset-0 p-6 rounded-[4px] bg-[#14532d] border border-[#22c55e] flex flex-col justify-center backface-hidden"
                style={{ 
                  transformStyle: 'preserve-3d',
                  transform: 'rotateY(-90deg)',
                  backfaceVisibility: 'hidden'
                }}
              >
                <div className="mb-2">
                  <span className="text-xs text-[#86efac] uppercase tracking-wide font-medium">Back</span>
                </div>
                <p className="text-lg text-[#dcfce7] font-medium">
                  {currentCard.back}
                </p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* All Cards */}
      <div className="flex-1 overflow-y-auto">
        <h4 className="text-sm font-medium text-[#fafafa] mb-2">All Cards</h4>
        {flashcards.length === 0 ? (
          <div className="text-center py-8">
            <Star size={32} className="mx-auto text-[#898989] mb-2" />
            <p className="text-[#898989] text-sm">No flashcards yet. Create your first card!</p>
          </div>
        ) : (
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {flashcards.map((card, index) => (
              <div
                key={card._id}
                onClick={() => handleCardClick(index)}
                className={cn(
                  "p-2 bg-[#171717] border rounded-[4px] cursor-pointer transition-colors",
                  index === currentCardIndex 
                    ? "border-[#3ecf8e] bg-[#0f0f0f]" 
                    : "border-[#2e2e2e] hover:border-[#3b82f6]"
                )}
              >
                <div className="text-sm text-[#fafafa] truncate">{card.front}</div>
                <div className="text-xs text-[#898989] mt-1">
                  {card.deck} {card.tags.length > 0 && `· ${card.tags[0]}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
      />
    </div>
  );
}
