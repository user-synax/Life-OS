'use client';

import { useState, useEffect } from 'react';
import { Dumbbell, Scale, Apple, Ruler, Plus, X, Calendar, Tag, Clock, Flame } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useFitnessStore from '@/store/useFitnessStore';
import { format } from 'date-fns';
import { toast } from 'sonner';

const TYPE_CONFIG = {
  workout: { icon: Dumbbell, color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', label: 'Workout' },
  weight: { icon: Scale, color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20', label: 'Weight' },
  nutrition: { icon: Apple, color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', label: 'Nutrition' },
  measurement: { icon: Ruler, color: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20', label: 'Measurement' },
  other: { icon: Plus, color: 'text-gray-400', bg: 'bg-gray-400/10', border: 'border-gray-400/20', label: 'Other' },
};

export default function FitnessWidget() {
  const [selectedType, setSelectedType] = useState('');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [value, setValue] = useState('');
  const [unit, setUnit] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const { entries, loading, fetchEntries, addEntry, removeEntry } = useFitnessStore();

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
    if (!selectedType || !title.trim()) {
      toast.error('Please select a type and enter a title');
      return;
    }

    try {
      await addEntry({
        type: selectedType,
        title,
        details,
        duration: duration ? parseInt(duration) : undefined,
        calories: calories ? parseInt(calories) : undefined,
        value: value ? parseFloat(value) : undefined,
        unit,
        tags,
        notes,
        date: new Date().toISOString(),
      });
      toast.success('Fitness entry saved');
      setSelectedType('');
      setTitle('');
      setDetails('');
      setDuration('');
      setCalories('');
      setValue('');
      setUnit('');
      setNotes('');
      setTags([]);
    } catch (error) {
      toast.error('Failed to save fitness entry');
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
            Entry Type
          </label>
          <div className="flex gap-2 flex-wrap">
            {Object.entries(TYPE_CONFIG).map(([type, config]) => {
              const Icon = config.icon;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'flex-1 min-w-[70px] p-3 rounded-[4px] border transition-all duration-300 flex flex-col items-center gap-1.5',
                    'hover:scale-105 active:scale-95',
                    selectedType === type
                      ? `${config.bg} ${config.border} ${config.color} border-current`
                      : 'bg-[#171717]/50 border-[#2e2e2e]/30 hover:border-[#3ecf8e]/30 text-muted-foreground/40'
                  )}
                  aria-label={`Select ${config.label} type`}
                >
                  <Icon size={18} />
                  <span className="text-[9px] font-medium uppercase tracking-wider">{config.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Input
            placeholder="Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="bg-muted/30 border-[#2e2e2e]/30 h-9 text-[13px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
            aria-label="Title"
          />
        </div>

        <div>
          <Textarea
            placeholder="Details..."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="bg-muted/30 border-[#2e2e2e]/30 min-h-[60px] text-[13px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30 resize-none"
            aria-label="Details"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1 block">
              Duration (min)
            </label>
            <Input
              type="number"
              placeholder="0"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="bg-muted/30 border-[#2e2e2e]/30 h-8 text-[12px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
              aria-label="Duration in minutes"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1 block">
              Calories
            </label>
            <Input
              type="number"
              placeholder="0"
              value={calories}
              onChange={(e) => setCalories(e.target.value)}
              className="bg-muted/30 border-[#2e2e2e]/30 h-8 text-[12px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
              aria-label="Calories"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1 block">
              Value
            </label>
            <Input
              type="number"
              step="0.1"
              placeholder="0"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="bg-muted/30 border-[#2e2e2e]/30 h-8 text-[12px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
              aria-label="Value"
            />
          </div>
          <div>
            <label className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50 mb-1 block">
              Unit
            </label>
            <Input
              placeholder="kg, lbs, cm..."
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="bg-muted/30 border-[#2e2e2e]/30 h-8 text-[12px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
              aria-label="Unit"
            />
          </div>
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

        <div>
          <Textarea
            placeholder="Notes..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="bg-muted/30 border-[#2e2e2e]/30 min-h-[60px] text-[13px] rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30 resize-none"
            aria-label="Notes"
          />
        </div>

        <Button
          type="submit"
          className="w-full bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[4px] font-medium"
          disabled={!selectedType || !title.trim() || loading}
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
                <Dumbbell size={24} className="opacity-20" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-[0.3em]">No Entries Yet</p>
            </div>
          ) : (
            <div className="space-y-2 pb-4">
              {entries.slice(0, 5).map((entry) => {
                const config = TYPE_CONFIG[entry.type];
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
                    <p className="text-[13px] text-foreground/70 font-medium mb-1">{entry.title}</p>
                    {entry.details && (
                      <p className="text-[12px] text-muted-foreground/50 line-clamp-1 mb-2">{entry.details}</p>
                    )}
                    <div className="flex items-center gap-3 flex-wrap">
                      {entry.duration && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
                          <Clock size={10} />
                          {entry.duration}m
                        </div>
                      )}
                      {entry.calories && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
                          <Flame size={10} />
                          {entry.calories} cal
                        </div>
                      )}
                      {entry.value && entry.unit && (
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
                          <Scale size={10} />
                          {entry.value} {entry.unit}
                        </div>
                      )}
                    </div>
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-2">
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
