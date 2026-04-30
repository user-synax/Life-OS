'use client';

import { useState, useEffect } from 'react';
import { Smile, Meh, Frown, Heart, X, Calendar, Tag, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useMoodJournalStore from '@/store/useMoodJournalStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

const MOOD_CONFIG = {
  great: { icon: Smile, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', label: 'Great' },
  good: { icon: Heart, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', label: 'Good' },
  okay: { icon: Meh, color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20', label: 'Okay' },
  bad: { icon: Frown, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', label: 'Bad' },
  terrible: { icon: X, color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', label: 'Terrible' },
};

export default function MoodJournalWidget() {
  const [selectedMood, setSelectedMood] = useState('');
  const [journalText, setJournalText] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const { entries, loading, fetchEntries, addEntry, removeEntry } = useMoodJournalStore();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleAddTag = (e) => {
    e.preventDefault();
    if (!tagInput.trim() || tags.includes(tagInput.trim())) return;
    setTags([...tags, tagInput.trim()]);
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedMood || !journalText.trim()) {
      toast.error('Please select a mood and write a journal entry');
      return;
    }

    try {
      await addEntry({
        mood: selectedMood,
        journal: journalText,
        tags,
        date: new Date().toISOString(),
      });
      toast.success('Journal entry saved');
      setSelectedMood('');
      setJournalText('');
      setTags([]);
    } catch (error) {
      toast.error('Failed to save journal entry');
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeEntry(id);
      toast.success('Entry deleted');
    } catch (error) {
      toast.error('Failed to delete entry');
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleSubmit} className="space-y-4 mb-4">
        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-2 block">
            How are you feeling?
          </label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(MOOD_CONFIG).map(([mood, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={mood}
                  type="button"
                  onClick={() => setSelectedMood(mood)}
                  className={cn(
                    'flex-1 min-w-[60px] p-3 rounded-[4px] border transition-all duration-300 flex flex-col items-center gap-1.5',
                    'hover:scale-105 active:scale-95',
                    selectedMood === mood
                      ? `${config.bg} ${config.border} ${config.color} border-current`
                      : 'bg-[#171717]/50 border-[#2e2e2e]/30 hover:border-[#3ecf8e]/30 text-muted-foreground/40'
                  )}
                  aria-label={`Select ${config.label} mood`}
                >
                  <Icon size={20} />
                  <span className="text-[10px] font-medium uppercase tracking-wider">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Textarea
            placeholder="Write your thoughts..."
            value={journalText}
            onChange={(e) => setJournalText(e.target.value)}
            className="bg-muted/30 border-[#2e2e2e]/30 min-h-[80px] text-[13px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30 resize-none"
            aria-label="Journal entry"
          />
        </div>

        <div>
          <label className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-2 block">
            Tags
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-[2px] bg-[#3ecf8e]/10 border border-[#3ecf8e]/20 text-[11px] font-medium text-[#3ecf8e]"
              >
                <Tag size={10} />
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-white transition-colors"
                  aria-label={`Remove ${tag} tag`}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          <form onSubmit={handleAddTag} className="flex gap-2">
            <input
              type="text"
              placeholder="Add tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="flex-1 bg-muted/30 border-[#2e2e2e]/30 h-8 text-[11px] px-3 rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
              aria-label="Add tag"
            />
            <Button
              type="button"
              onClick={handleAddTag}
              size="sm"
              className="h-8 px-3 bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[4px]"
            >
              <Plus size={14} />
            </Button>
          </form>
        </div>

        <Button
          type="submit"
          className="w-full bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[4px] font-medium"
          disabled={!selectedMood || !journalText.trim() || loading}
        >
          {loading ? 'Saving...' : 'Save Entry'}
        </Button>
      </form>

      <div className="border-t border-[#2e2e2e]/30 pt-4">
        <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-3 flex items-center gap-2">
          <Calendar size={12} />
          Recent Entries
        </h3>
        <ScrollArea className="flex-1 -mr-4 pr-4 h-[200px]">
          {loading && entries.length === 0 ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-muted/10 animate-pulse rounded-[4px]" />
              ))}
            </div>
          ) : entries.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/10 py-8">
              <div className="p-4 rounded-full bg-muted/5 border border-dashed border-border/50">
                <Heart size={24} className="opacity-20" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Entries Yet</p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {entries.slice(0, 5).map((entry) => {
                const config = MOOD_CONFIG[entry.mood];
                const Icon = config.icon;
                return (
                  <div
                    key={entry._id}
                    className={cn(
                      'p-3 rounded-[4px] bg-[#171717]/50 hover:bg-[#2e2e2e]/50 transition-all duration-300 border border-[#2e2e2e]/30',
                      config.border
                    )}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={config.color} />
                        <span className={cn('text-[11px] font-medium uppercase tracking-wider', config.color)}>
                          {config.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground/50">
                          {format(new Date(entry.date || entry.createdAt), 'MMM d, yyyy')}
                        </span>
                        <button
                          onClick={() => handleDelete(entry._id)}
                          className="text-muted-foreground/30 hover:text-red-400 transition-colors"
                          aria-label="Delete entry"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                    <p className="text-[13px] text-foreground/70 line-clamp-2 mb-2">{entry.journal}</p>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[2px] bg-[#3ecf8e]/5 border border-[#3ecf8e]/10 text-[10px] text-muted-foreground/60"
                          >
                            <Tag size={8} />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
