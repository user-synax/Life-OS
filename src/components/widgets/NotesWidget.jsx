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

export default function NotesWidget() {
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const { notes, loading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();

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
      <form onSubmit={handleAddNote} className="flex items-center gap-2 mb-3">
        <Input
          placeholder="New note..."
          className="bg-muted/30 border-border h-8 text-xs rounded-[4px] focus:ring-1 focus:ring-primary"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-8 w-8 bg-primary text-primary-foreground rounded-[4px]">
          <Plus size={14} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-2">
        {loading && notes.length === 0 ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-muted/50 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground/40 italic text-xs">
             No notes.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-1.5">
            {notes.map((note) => (
              <div
                key={note._id}
                className={cn(
                  "flex flex-col p-2.5 rounded-[4px] border border-border bg-muted/10 group transition-colors relative",
                  note.pinned && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <StickyNote size={12} className={note.pinned ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-xs font-bold truncate tracking-tight">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary rounded-[4px]"
                      onClick={() => updateNote(note._id, { pinned: !note.pinned })}
                    >
                      {note.pinned ? <Pin size={10} /> : <PinOff size={10} />}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground transition-colors outline-none">
                        <MoreVertical size={10} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border rounded-[4px]">
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive/10 focus:text-destructive rounded-[4px] text-xs p-2"
                          onClick={() => removeNote(note._id)}
                        >
                          <Trash2 size={12} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                  {note.content || "No content..."}
                </p>
                <div className="flex items-center justify-between mt-2">
                   <span className="text-[9px] text-muted-foreground/50 font-medium">
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
