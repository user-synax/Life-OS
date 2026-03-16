'use client';

import { useState, useEffect } from 'react';
import { Plus, StickyNote, Pin, PinOff, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useNoteStore from '@/store/useNoteStore';
import { format } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { useRouter } from 'next/navigation';

export default function NotesWidget() {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const { notes, loading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNoteTitle.trim()) return;
    await addNote({ title: newNoteTitle, content: '' });
    setNewNoteTitle('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddNote} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={12} />
          <Input
            placeholder="Add note..."
            className="bg-muted/30 border-none h-9 text-[11px] pl-8 rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
            value={newNoteTitle}
            onChange={(e) => setNewNoteTitle(e.target.value)}
          />
        </div>
      </form>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        {loading && notes.length === 0 ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted/20 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/20 italic text-[10px] uppercase font-bold tracking-widest">
             <Plus size={16} className="opacity-10" />
             No notes.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1">
            {notes.map((note) => (
              <div
                key={note._id}
                onClick={() => router.push('/dashboard/notes')}
                className={cn(
                  "flex flex-col p-2 rounded-[4px] hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50 group relative cursor-pointer",
                  note.pinned && "bg-primary/5 border-primary/10 hover:border-primary/20"
                )}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <StickyNote size={10} className={cn("shrink-0", note.pinned ? "text-primary" : "text-muted-foreground/40")} />
                    <span className="text-[11px] font-bold truncate tracking-tight text-foreground/90">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                    <button 
                      className={cn(
                        "h-5 w-5 flex items-center justify-center rounded-[2px] transition-colors",
                        note.pinned ? "text-primary hover:bg-primary/10" : "text-muted-foreground/30 hover:text-primary hover:bg-primary/5"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNote(note._id, { pinned: !note.pinned });
                      }}
                    >
                      {note.pinned ? <Pin size={8} /> : <PinOff size={8} />}
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-[9px] text-muted-foreground/60 line-clamp-1 pl-4 leading-tight">
                    {note.content.replace(/[#*`]/g, '').slice(0, 50)}
                  </p>
                )}
                <div className="flex items-center justify-between mt-1 pl-4">
                  <span className="text-[7px] text-muted-foreground/40 uppercase font-black tracking-widest">
                    {format(new Date(note.createdAt), 'MMM d')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
