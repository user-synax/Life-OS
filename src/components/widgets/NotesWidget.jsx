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

      <ScrollArea className="flex-1 -mr-4 pr-4">
        {loading && notes.length === 0 ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-muted/10 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground/10 py-10">
             <div className="p-4 rounded-full bg-muted/5 border border-dashed border-border/50">
                <StickyNote size={24} className="opacity-20" />
             </div>
             <p className="text-[9px] font-black uppercase tracking-[0.3em]">Vault is Empty</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 pb-4">
            {notes.map((note) => (
              <div
                key={note._id}
                onClick={() => router.push('/dashboard/notes')}
                className={cn(
                  "flex flex-col p-3 rounded-[4px] hover:bg-muted/30 transition-all duration-300 border border-transparent hover:border-border/50 group relative cursor-pointer",
                  note.pinned && "bg-primary/5 border-primary/10 hover:border-primary/20 shadow-sm"
                )}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={cn(
                      "p-1.5 rounded-[2px] transition-colors",
                      note.pinned ? "bg-primary/10 text-primary" : "bg-muted/20 text-muted-foreground/40 group-hover:bg-primary/5 group-hover:text-primary/60"
                    )}>
                      <StickyNote size={12} className="shrink-0" />
                    </div>
                    <span className="text-[12px] font-black truncate tracking-tight text-foreground/80 group-hover:text-foreground transition-colors uppercase">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 shrink-0">
                    <button 
                      className={cn(
                        "h-6 w-6 flex items-center justify-center rounded-[2px] transition-colors",
                        note.pinned ? "text-primary hover:bg-primary/10" : "text-muted-foreground/30 hover:text-primary hover:bg-primary/5"
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        updateNote(note._id, { pinned: !note.pinned });
                      }}
                    >
                      {note.pinned ? <Pin size={10} /> : <PinOff size={10} />}
                    </button>
                  </div>
                </div>
                {note.content && (
                  <p className="text-[10px] text-muted-foreground/50 line-clamp-2 pl-10 leading-relaxed font-medium">
                    {note.content.replace(/[#*`]/g, '').slice(0, 80)}...
                  </p>
                )}
                <div className="flex items-center justify-between mt-2.5 pl-10">
                  <div className="flex items-center gap-2">
                     <span className="text-[7px] text-muted-foreground/30 uppercase font-black tracking-[0.2em] bg-muted/10 px-1.5 py-0.5 rounded-[2px]">
                        {format(new Date(note.createdAt), 'MMM d, yyyy')}
                     </span>
                     {note.tags?.length > 0 && (
                        <span className="text-[7px] text-primary/40 uppercase font-black tracking-[0.2em]">
                           + {note.tags.length} Tags
                        </span>
                     )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
