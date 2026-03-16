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
      <form onSubmit={handleAddNote} className="flex items-center gap-2 mb-4 px-1">
        <Input
          placeholder="Quick note title..."
          className="bg-sidebar/50 border-border h-9 text-sm focus:ring-primary"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-9 w-9 bg-primary text-primary-foreground">
          <Plus size={16} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-3">
        {loading && notes.length === 0 ? (
          <div className="space-y-3 py-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-20 bg-sidebar/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 italic text-sm">
             No notes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2 py-1">
            {notes.map((note) => (
              <div
                key={note._id}
                className={cn(
                  "flex flex-col p-3 rounded-xl border border-border/50 bg-sidebar/30 group hover:border-primary/30 transition-all duration-300 relative",
                  note.pinned && "border-primary/20 bg-primary/5"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <StickyNote size={14} className={note.pinned ? "text-primary" : "text-muted-foreground"} />
                    <span className="text-sm font-semibold truncate">{note.title}</span>
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 text-muted-foreground hover:text-primary"
                      onClick={() => updateNote(note._id, { pinned: !note.pinned })}
                    >
                      {note.pinned ? <Pin size={12} /> : <PinOff size={12} />}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-all outline-none">
                        <MoreVertical size={12} />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem 
                          className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                          onClick={() => removeNote(note._id)}
                        >
                          <Trash2 size={14} className="mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {note.content || "No content yet..."}
                </p>
                <div className="flex items-center justify-between mt-auto">
                   <span className="text-[10px] text-muted-foreground/50">
                      {format(new Date(note.createdAt), 'MMM d, yyyy')}
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
