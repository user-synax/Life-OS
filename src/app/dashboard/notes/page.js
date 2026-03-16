'use client';

import { useState, useEffect } from 'react';
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

export default function NotesPage() {
  const { notes, loading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid, list
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditContentTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    await addNote({ title: 'New Note', content: '', tags: [] });
    setIsEditing(false);
  };

  const handleSaveNote = async () => {
    if (!activeNote) return;
    try {
      setIsSaving(true);
      await updateNote(activeNote._id, { 
        title: editTitle, 
        content: editContent,
        tags: editTags 
      });
      setIsSaving(false);
      setIsEditing(false);
      setActiveNote(null);
    } catch (error) {
      console.error('Save note error:', error);
      setIsSaving(false);
    }
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setEditTitle(note.title);
    setEditContent(note.content);
    setEditContentTags(note.tags || []);
    setIsEditing(true);
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!editTags.includes(newTag.trim())) {
      setEditContentTags([...editTags, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditContentTags(editTags.filter(t => t !== tagToRemove));
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  if (isEditing) {
    return (
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        <div className="flex items-center justify-between">
           <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground rounded-[4px]" onClick={() => setIsEditing(false)}>
              <ChevronLeft size={16} />
              <span className="text-[10px] font-bold uppercase tracking-wider">Back</span>
           </Button>
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 border-border rounded-[4px]" onClick={() => setIsEditing(false)}>
                 <X size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-wider">Cancel</span>
              </Button>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px]" onClick={handleSaveNote} disabled={isSaving}>
                 <Save size={16} />
                 <span className="text-[10px] font-bold uppercase tracking-wider">{isSaving ? 'Saving...' : 'Save'}</span>
              </Button>
           </div>
        </div>

        <Card className="flex-1 flex flex-col bg-card border border-border rounded-[4px] shadow-sm overflow-hidden">
           <CardHeader className="p-6 border-b border-border bg-muted/20">
              <Input 
                 className="text-2xl font-bold border-none bg-transparent focus:ring-0 p-0 placeholder:text-muted-foreground/30 h-auto"
                 placeholder="Note Title"
                 value={editTitle}
                 onChange={(e) => setEditTitle(e.target.value)}
              />
              <div className="flex flex-wrap items-center gap-2 mt-4">
                 {editTags.map(tag => (
                    <Badge key={tag} variant="outline" className="gap-1 px-1.5 py-0.5 border-primary/20 bg-primary/5 text-primary rounded-[2px]">
                       <Tag size={8} />
                       <span className="text-[8px]">{tag}</span>
                       <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive transition-colors ml-1">
                          <X size={8} />
                       </button>
                    </Badge>
                 ))}
                 <div className="flex items-center gap-1 ml-2">
                    <Input 
                       className="h-6 w-24 text-[10px] bg-muted/30 border-border px-2 py-0"
                       placeholder="New tag..."
                       value={newTag}
                       onChange={(e) => setNewTag(e.target.value)}
                       onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button 
                       variant="ghost" 
                       size="sm" 
                       className="h-6 w-6 p-0 text-primary hover:bg-primary/10 rounded-[2px]"
                       onClick={handleAddTag}
                    >
                       <Plus size={12} />
                    </Button>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-6 flex-1">
              <textarea 
                 className="w-full h-[400px] bg-transparent border-none focus:ring-0 resize-none text-base text-foreground/80 leading-relaxed placeholder:text-muted-foreground/20 outline-none"
                 placeholder="Start writing..."
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
              />
           </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1 text-sm">Capture your ideas and thoughts.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="relative w-full max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-9 bg-muted/30 border-border rounded-[4px] text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="bg-muted/50 p-1 rounded-[4px] border border-border flex items-center gap-1">
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-7 w-7 rounded-[2px]"
                onClick={() => setView('grid')}
              >
                <Grid size={14} />
              </Button>
              <Button 
                variant={view === 'list' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-7 w-7 rounded-[2px]"
                onClick={() => setView('list')}
              >
                <ListIcon size={14} />
              </Button>
           </div>
           <Button size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-4 font-bold uppercase tracking-wider h-9 gap-2 text-[10px]" onClick={handleAddNote}>
              <Plus size={16} />
              <span>New Note</span>
           </Button>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-200px)] pr-4">
        <div className={cn(
          "grid gap-4",
          view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
        )}>
          {pinnedNotes.length > 0 && (
             <div className="col-span-full space-y-3 mb-2">
                <div className="flex items-center gap-2 px-1">
                   <Pin size={12} className="text-primary" />
                   <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Pinned</span>
                </div>
                <div className={cn(
                   "grid gap-4",
                   view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
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
             <div className="col-span-full space-y-3">
                <div className="flex items-center gap-2 px-1">
                   <StickyNote size={12} className="text-muted-foreground/30" />
                   <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">Notes</span>
                </div>
                <div className={cn(
                   "grid gap-4",
                   view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
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
             [1, 2, 3, 4].map((i) => (
                <div key={i} className="h-40 bg-muted/20 animate-pulse rounded-[4px]" />
             ))
          )}

          {!loading && notes.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center h-48 text-muted-foreground/20">
                <FileText size={40} className="mb-2" />
                <p className="text-xs font-bold uppercase tracking-widest">Notebook is empty.</p>
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
          "group relative flex flex-col overflow-hidden bg-card border-border hover:border-primary/50 transition-colors rounded-[4px] shadow-sm",
          view === 'list' ? "flex-row items-center h-20" : "h-48",
          note.pinned && "border-primary/20 bg-primary/5"
        )}
      >
         <CardHeader className={cn("p-4 pb-1", view === 'list' && "flex-1 pb-4")}>
            <div className="flex items-start justify-between">
               <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-bold tracking-tight truncate group-hover:text-primary transition-colors">{note.title}</CardTitle>
                  <p className="text-[9px] font-bold text-muted-foreground/40 mt-1 uppercase tracking-wider">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
               </div>
            </div>
         </CardHeader>
         <CardContent className={cn("px-4 py-1 flex-1 overflow-hidden", view === 'list' && "hidden")}>
            <p className="text-xs text-muted-foreground/70 leading-relaxed line-clamp-3">
               {note.content || "No content..."}
            </p>
         </CardContent>
         <CardFooter className={cn("p-4 pt-1 flex items-center justify-between", view === 'list' && "p-4")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
               {note.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-[8px] uppercase font-bold tracking-wider px-1.5 py-0 border-border rounded-[2px]">{tag}</Badge>
               ))}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-primary" onClick={onPin}>
                  {note.pinned ? <Pin size={14} /> : <PinOff size={14} />}
               </Button>
               <Button variant="ghost" size="icon" className="h-7 w-7 rounded-[4px] text-muted-foreground hover:text-primary" onClick={onEdit}>
                  <Edit3 size={14} />
               </Button>
               <DropdownMenu>
                  <DropdownMenuTrigger render={
                     <div role="button" className="h-7 w-7 flex items-center justify-center rounded-[4px] text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition-colors">
                        <MoreVertical size={14} />
                     </div>
                  } />
                  <DropdownMenuContent align="end" className="bg-card border-border p-1 rounded-[4px] shadow-sm">
                     <DropdownMenuItem className="rounded-[4px] text-xs font-bold uppercase tracking-wider p-2" onClick={onDelete}>
                        <Trash2 size={12} className="mr-2" />
                        Delete
                     </DropdownMenuItem>
                  </DropdownMenuContent>
               </DropdownMenu>
            </div>
         </CardFooter>
      </Card>
   );
}
