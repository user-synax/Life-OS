'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  StickyNote, 
  Pin, 
  PinOff, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Save, 
  X,
  FileText,
  Tag,
  Grid,
  List as ListIcon,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import useNoteStore from '@/store/useNoteStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function NotesPage() {
  const { notes, loading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid, list
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const containerRef = useRef(null);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [loading, view]);

  const handleAddNote = async () => {
    await addNote({ title: 'New Note', content: '', tags: [] });
    setIsEditing(false);
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    await updateNote(activeNote._id, { title: editTitle, content: editContent });
    setIsEditing(false);
    setActiveNote(null);
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between">
           <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-foreground" onClick={() => setIsEditing(false)}>
              <ChevronLeft size={18} />
              <span>Back to Notes</span>
           </Button>
           <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-border" onClick={() => setIsEditing(false)}>
                 <X size={18} />
                 <span>Cancel</span>
              </Button>
              <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90" onClick={handleSaveNote}>
                 <Save size={18} />
                 <span>Save Note</span>
              </Button>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-4 bg-card border border-border rounded-3xl p-8 shadow-2xl shadow-primary/5">
           <Input 
              className="text-4xl font-extrabold border-none bg-transparent focus:ring-0 p-0 placeholder:text-muted-foreground/20"
              placeholder="Note Title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
           />
           <div className="flex items-center gap-2 border-b border-border/50 pb-4">
              <Badge variant="outline" className="gap-1 px-2 py-0.5 border-primary/20 bg-primary/5 text-primary">
                 <Tag size={10} />
                 <span>General</span>
              </Badge>
              <Button variant="ghost" size="sm" className="h-7 px-2 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
                 Add Tag
              </Button>
           </div>
           <textarea 
              className="flex-1 w-full bg-transparent border-none focus:ring-0 resize-none text-lg text-foreground/80 leading-relaxed placeholder:text-muted-foreground/10"
              placeholder="Start writing your thoughts..."
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
           />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1">Capture your ideas and organize your thoughts.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="relative w-full max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search notes..." 
                className="pl-10 h-10 bg-sidebar border-border rounded-xl text-sm w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="bg-sidebar/50 p-1 rounded-xl border border-border flex items-center gap-1">
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8 rounded-lg"
                onClick={() => setView('grid')}
              >
                <Grid size={16} />
              </Button>
              <Button 
                variant={view === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8 rounded-lg"
                onClick={() => setView('list')}
              >
                <ListIcon size={16} />
              </Button>
           </div>
           <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6 font-bold uppercase tracking-widest h-10 gap-2" onClick={handleAddNote}>
              <Plus size={20} />
              <span>New Note</span>
           </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div ref={containerRef} className={cn(
          "grid gap-6",
          view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {pinnedNotes.length > 0 && (
             <div className="col-span-full space-y-4 mb-4">
                <div className="flex items-center gap-2 px-2">
                   <Pin size={16} className="text-primary" />
                   <span className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-muted-foreground/50">Pinned Notes</span>
                </div>
                <div className={cn(
                   "grid gap-6",
                   view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                )}>
                   {pinnedNotes.map((note) => (
                      <NoteCard 
                        key={note._id} 
                        note={note} 
                        view={view} 
                        onEdit={() => handleEditNote(note)} 
                        onPin={() => updateNote(note._id, { pinned: !note.pinned })}
                        onDelete={() => removeNote(note._id)}
                      />
                   ))}
                </div>
             </div>
          )}

          {otherNotes.length > 0 && (
             <div className="col-span-full space-y-4">
                <div className="flex items-center gap-2 px-2">
                   <StickyNote size={16} className="text-muted-foreground/30" />
                   <span className="text-[10px] uppercase font-extrabold tracking-[0.2em] text-muted-foreground/50">Other Notes</span>
                </div>
                <div className={cn(
                   "grid gap-6",
                   view === 'grid' ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
                )}>
                   {otherNotes.map((note) => (
                      <NoteCard 
                        key={note._id} 
                        note={note} 
                        view={view} 
                        onEdit={() => handleEditNote(note)} 
                        onPin={() => updateNote(note._id, { pinned: !note.pinned })}
                        onDelete={() => removeNote(note._id)}
                      />
                   ))}
                </div>
             </div>
          )}

          {loading && notes.length === 0 && (
             [1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="h-48 bg-sidebar/50 animate-pulse rounded-3xl" />
             ))
          )}

          {!loading && notes.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center h-64 text-muted-foreground/30">
                <FileText size={64} className="mb-4 opacity-5" />
                <p className="text-xl italic font-medium">Your notebook is empty.</p>
             </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

function NoteCard({ note, view, onEdit, onPin, onDelete }) {
   return (
      <Card 
        className={cn(
          "group relative flex flex-col overflow-hidden bg-card border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-3xl",
          view === 'list' ? "flex-row items-center h-24" : "h-64",
          note.pinned && "border-primary/20 bg-primary/[0.02]"
        )}
      >
         <CardHeader className={cn("p-6 pb-2", view === 'list' && "flex-1 pb-6")}>
            <div className="flex items-start justify-between">
               <div className="flex-1 min-w-0">
                  <CardTitle className="text-xl font-bold tracking-tight truncate group-hover:text-primary transition-colors">{note.title}</CardTitle>
                  <p className="text-[10px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-widest">{format(new Date(note.createdAt), 'MMMM d, yyyy')}</p>
               </div>
            </div>
         </CardHeader>
         <CardContent className={cn("px-6 py-2 flex-1 overflow-hidden", view === 'list' && "hidden")}>
            <p className="text-sm text-muted-foreground/80 leading-relaxed line-clamp-4 italic">
               {note.content || "No content yet..."}
            </p>
         </CardContent>
         <CardFooter className={cn("p-6 pt-2 flex items-center justify-between", view === 'list' && "p-6")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
               {note.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-[8px] uppercase font-bold tracking-widest px-1.5 py-0 border-border/50">{tag}</Badge>
               ))}
               {note.tags?.length > 2 && <span className="text-[10px] text-muted-foreground">+{note.tags.length - 2}</span>}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0">
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={onPin}>
                  {note.pinned ? <Pin size={16} /> : <PinOff size={16} />}
               </Button>
               <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-primary" onClick={onEdit}>
                  <Edit3 size={16} />
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                     <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground">
                        <MoreVertical size={16} />
                     </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border-border p-2 rounded-xl shadow-2xl min-w-32">
                     <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive rounded-lg font-medium" onClick={onDelete}>
                        <Trash2 size={14} className="mr-2" />
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardFooter>
      </Card>
   );
}
