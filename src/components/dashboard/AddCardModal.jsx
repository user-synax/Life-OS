'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import useFlashcardStore from '@/store/useFlashcardStore';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AddCardModal({ isOpen, onClose }) {
  const { addFlashcard, getDecks } = useFlashcardStore();
  const [newCard, setNewCard] = useState({
    front: '',
    back: '',
    deck: 'default',
    tags: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const decks = getDecks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newCard.front.trim() || !newCard.back.trim()) return;

    setIsSubmitting(true);
    try {
      await addFlashcard({
        ...newCard,
        tags: newCard.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      });
      setNewCard({ front: '', back: '', deck: 'default', tags: '' });
      onClose();
    } catch (error) {
      console.error('Failed to add flashcard:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setNewCard({ front: '', back: '', deck: 'default', tags: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <Card className="w-full max-w-md bg-[#171717] border-[#2e2e2e] rounded-[8px] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2e2e2e]">
          <h3 className="text-lg font-medium text-[#fafafa] flex items-center gap-2">
            <Plus size={18} className="text-[#3ecf8e]" />
            Add New Flashcard
          </h3>
          <Button
            onClick={handleClose}
            variant="ghost"
            size="sm"
            className="text-[#898989] hover:text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
          >
            <X size={16} />
          </Button>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Front of card</label>
              <textarea
                placeholder="Enter the question or prompt..."
                value={newCard.front}
                onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px] resize-none"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Back of card</label>
              <textarea
                placeholder="Enter the answer..."
                value={newCard.back}
                onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px] resize-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Deck</label>
                <input
                  type="text"
                  placeholder="Deck name..."
                  value={newCard.deck}
                  onChange={(e) => setNewCard({ ...newCard, deck: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Tags</label>
                <input
                  type="text"
                  placeholder="tag1, tag2..."
                  value={newCard.tags}
                  onChange={(e) => setNewCard({ ...newCard, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] placeholder-[#898989] rounded-[4px]"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting || !newCard.front.trim() || !newCard.back.trim()}
                className="flex-1 bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] disabled:opacity-50 rounded-[4px]"
              >
                {isSubmitting ? 'Adding...' : 'Add Card'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                className="border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
}
