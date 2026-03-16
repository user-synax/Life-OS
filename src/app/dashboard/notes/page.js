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
  ChevronLeft,
  AlertTriangle
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import useNoteStore from '@/store/useNoteStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function NotesPage() {
  const { notes, loading, fetchNotes, addNote, updateNote, removeNote } = useNoteStore();
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid'); // grid, list
  const [activeNote, setActiveNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleAddNote = async () => {
    try {
      setIsSaving(true);
      const newNote = await addNote({ title: 'New Note', content: '', tags: [] });
      if (newNote) {
        handleEditNote(newNote);
      }
      setIsSaving(false);
    } catch (error) {
      console.error('Add note error:', error);
      setIsSaving(false);
      toast.error('Failed to create note');
    }
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
      toast.success('Note updated successfully');
    } catch (error) {
      console.error('Save note error:', error);
      setIsSaving(false);
      toast.error('Failed to update note');
    }
  };

  const handleEditNote = (note) => {
    setActiveNote(note);
    setEditTitle(note.title || '');
    setEditContent(note.content || '');
    setEditTags(note.tags || []);
    setIsEditing(true);
  };

  const handleOpenDeleteModal = (note) => {
    setActiveNote(note);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await removeNote(activeNote._id);
      setIsDeleteModalOpen(false);
      setActiveNote(null);
      toast.success('Note deleted successfully');
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const handleAddTag = () => {
    if (!newTag.trim()) return;
    if (!editTags.includes(newTag.trim())) {
      setEditTags([...editTags, newTag.trim()]);
    }
    setNewTag('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setEditTags(editTags.filter(t => t !== tagToRemove));
  };

  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(search.toLowerCase()) ||
    note.content.toLowerCase().includes(search.toLowerCase())
  );

  const pinnedNotes = filteredNotes.filter(n => n.pinned);
  const otherNotes = filteredNotes.filter(n => !n.pinned);

  if (isEditing) {
    return (
      <div className="max-w-5xl mx-auto flex flex-col gap-4 sm:gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
           <Button variant="ghost" size="sm" className="w-fit gap-2 text-muted-foreground/50 hover:text-primary hover:bg-primary/5 rounded-[4px] px-4" onClick={() => setIsEditing(false)}>
              <ChevronLeft size={16} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Back to Library</span>
           </Button>
           <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" className="flex-1 sm:flex-none gap-2 text-muted-foreground/40 hover:text-foreground rounded-[4px] px-4 h-10 sm:h-9" onClick={() => setIsEditing(false)}>
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Cancel</span>
              </Button>
              <Button size="sm" className="flex-[2] sm:flex-none gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-6 h-10 sm:h-9 shadow-lg shadow-primary/20" onClick={handleSaveNote} disabled={isSaving}>
                 <Save size={14} />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em]">{isSaving ? 'Saving...' : 'Save Note'}</span>
              </Button>
           </div>
        </div>

        <Card className="flex-1 flex flex-col bg-card border-border/50 rounded-[4px] shadow-2xl overflow-hidden min-h-[70vh] sm:min-h-[600px]">
           <CardHeader className="p-5 sm:p-8 border-b border-border/50 bg-muted/5">
              <div className="space-y-4">
                 <input 
                    className="w-full text-2xl sm:text-4xl font-black border-none bg-transparent focus:ring-0 p-0 placeholder:text-muted-foreground/10 h-auto uppercase tracking-tight text-foreground/90 outline-none"
                    placeholder="NOTE TITLE"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                 />
                 <div className="flex flex-wrap items-center gap-2 pt-2">
                    {editTags.map(tag => (
                       <Badge key={tag} variant="outline" className="gap-1.5 px-2 py-1 border-primary/20 bg-primary/5 text-primary rounded-[2px] shrink-0">
                          <Tag size={10} className="opacity-50" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{tag}</span>
                          <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive transition-colors ml-1">
                             <X size={10} />
                          </button>
                       </Badge>
                    ))}
                    <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                       <input 
                          className="h-8 flex-1 sm:flex-none sm:w-32 text-[10px] font-black uppercase tracking-widest bg-muted/20 border-none rounded-[2px] px-3 placeholder:text-muted-foreground/20 outline-none focus:bg-muted/30 transition-colors"
                          placeholder="ADD TAG..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                       />
                       <button 
                          className="h-8 w-8 flex items-center justify-center text-primary/40 hover:text-primary hover:bg-primary/10 rounded-[2px] transition-all shrink-0"
                          onClick={handleAddTag}
                       >
                          <Plus size={14} />
                       </button>
                    </div>
                 </div>
              </div>
           </CardHeader>
           <CardContent className="p-0 flex-1 relative bg-card/50">
              <textarea 
                 className="w-full h-full min-h-[400px] bg-transparent border-none focus:ring-0 resize-none text-sm sm:text-base text-foreground/70 leading-relaxed placeholder:text-muted-foreground/10 outline-none p-5 sm:p-10 font-medium custom-scrollbar"
                 placeholder="Start writing your thoughts..."
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
              />
           </CardContent>
           <CardFooter className="px-5 sm:px-8 py-4 border-t border-border/30 bg-muted/5 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 opacity-30">
                 <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">Markdown Protocol Active</span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                    <span className="text-[7px] uppercase font-black text-muted-foreground/30 tracking-widest mb-0.5">Length</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                       {editContent.length} <span className="text-[8px] opacity-50">Chars</span>
                    </span>
                 </div>
                 <div className="h-6 w-px bg-border/50 hidden sm:block" />
                 <div className="flex flex-col items-end">
                    <span className="text-[7px] uppercase font-black text-muted-foreground/30 tracking-widest mb-0.5">Volume</span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                       {editContent.split(/\s+/).filter(Boolean).length} <span className="text-[8px] opacity-50">Words</span>
                    </span>
                 </div>
              </div>
           </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-foreground">Notes</h1>
          <p className="text-muted-foreground mt-1 text-[10px] sm:text-xs font-medium uppercase tracking-widest opacity-50">Capture your ideas and thoughts.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
           <div className="relative w-full sm:max-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
              <Input 
                placeholder="Search..." 
                className="pl-9 h-10 sm:h-9 bg-muted/10 border-border/50 rounded-[4px] text-[10px] font-black uppercase tracking-widest placeholder:text-muted-foreground/20 focus:bg-muted/20 transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
           </div>
           <div className="flex items-center gap-2">
              <div className="bg-muted/10 p-1 rounded-[4px] border border-border/50 flex items-center gap-1">
                 <Button 
                   variant={view === 'grid' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className="h-8 w-8 sm:h-7 sm:w-7 rounded-[2px]"
                   onClick={() => setView('grid')}
                 >
                   <Grid size={14} />
                 </Button>
                 <Button 
                   variant={view === 'list' ? 'secondary' : 'ghost'} 
                   size="icon" 
                   className="h-8 w-8 sm:h-7 sm:w-7 rounded-[2px]"
                   onClick={() => setView('list')}
                 >
                   <ListIcon size={14} />
                 </Button>
              </div>
              <Button 
                size="sm" 
                className="flex-1 sm:flex-none bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-6 font-black uppercase tracking-[0.2em] h-10 sm:h-9 gap-2 text-[10px] shadow-lg shadow-primary/20 transition-all active:scale-[0.98]" 
                onClick={handleAddNote}
                disabled={isSaving}
              >
                 <Plus size={16} />
                 <span>{isSaving ? 'Creating...' : 'New Note'}</span>
              </Button>
           </div>
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-200px)] pr-4">
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
                        onDelete={() => handleOpenDeleteModal(note)}
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
                        onDelete={() => handleOpenDeleteModal(note)}
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-full sm:max-w-lg bg-card border-border/50 p-0 overflow-hidden rounded-[4px] shadow-2xl transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-border/50 bg-destructive/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[4px] bg-destructive/10 flex items-center justify-center text-destructive shadow-sm shrink-0">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <DialogTitle className="text-xl sm:text-2xl font-black uppercase tracking-[0.2em] text-destructive/90 leading-tight">Delete Note?</DialogTitle>
                  <p className="text-[10px] font-black text-destructive/30 uppercase tracking-[0.25em] mt-1.5">Critical System Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8">
            <p className="text-xs sm:text-sm font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-widest">
              Are you sure you want to delete <span className="font-black text-foreground underline decoration-destructive/30 underline-offset-4 decoration-2">&ldquo;{activeNote?.title}&rdquo;</span>? This will permanently remove this note and all its content from the system registry.
            </p>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-muted/5 border-t border-border/30 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsDeleteModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/30 hover:text-foreground transition-all border border-transparent hover:border-border/50"
            >
              Abort
            </Button>
            <Button 
               variant="destructive"
               size="sm" 
               onClick={handleConfirmDelete} 
               className="w-full sm:flex-1 h-12 bg-destructive text-white hover:bg-destructive/90 rounded-[4px] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl shadow-destructive/20 transition-all active:scale-[0.98]"
            >
              Confirm Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function NoteCard({ note, view, onEdit, onPin, onDelete }) {
   return (
      <Card 
        className={cn(
          "group relative flex flex-col overflow-hidden bg-card border-border hover:border-primary/50 transition-all duration-300 rounded-[4px] shadow-sm cursor-pointer",
          view === 'list' ? "flex-row items-center h-20" : "h-48",
          note.pinned && "border-primary/20 bg-primary/5"
        )}
        onClick={onEdit}
      >
         <CardHeader className={cn("p-4 pb-1", view === 'list' && "flex-1 pb-4")}>
            <div className="flex items-start justify-between">
               <div className="flex-1 min-w-0">
                  <CardTitle className="text-sm font-black tracking-tight truncate group-hover:text-primary transition-colors uppercase">{note.title}</CardTitle>
                  <p className="text-[9px] font-black text-muted-foreground/30 mt-1 uppercase tracking-[0.2em]">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
               </div>
            </div>
         </CardHeader>
         <CardContent className={cn("px-4 py-1 flex-1 overflow-hidden", view === 'list' && "hidden")}>
            <p className="text-xs text-muted-foreground/60 leading-relaxed line-clamp-3 font-medium">
               {note.content || "No content..."}
            </p>
         </CardContent>
         <CardFooter className={cn("p-4 pt-1 flex items-center justify-between", view === 'list' && "p-4")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
               {note.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-[7px] uppercase font-black tracking-[0.1em] px-1.5 py-0 border-primary/10 bg-primary/5 text-primary/60 rounded-[2px]">{tag}</Badge>
               ))}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-[4px] text-muted-foreground/40 hover:text-primary hover:bg-primary/5" 
                  onClick={(e) => {
                     e.stopPropagation();
                     onPin();
                  }}
               >
                  {note.pinned ? <Pin size={14} /> : <PinOff size={14} />}
               </Button>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-[4px] text-muted-foreground/40 hover:text-primary hover:bg-primary/5" 
                  onClick={(e) => {
                     e.stopPropagation();
                     onEdit();
                  }}
               >
                  <Edit3 size={14} />
               </Button>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7 rounded-[4px] text-muted-foreground/40 hover:text-destructive hover:bg-destructive/5" 
                  onClick={(e) => {
                     e.stopPropagation();
                     onDelete();
                  }}
               >
                  <Trash2 size={14} />
               </Button>
               <div onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                        <DropdownMenuTrigger render={
                           <button 
                              type="button"
                              className="h-7 w-7 flex items-center justify-center rounded-[4px] text-muted-foreground/40 hover:bg-muted hover:text-foreground cursor-pointer transition-colors"
                           >
                              <MoreVertical size={14} />
                           </button>
                        } />
                     <DropdownMenuContent align="end" className="bg-card border-border/50 p-1 rounded-[4px] shadow-xl min-w-32">
                        <DropdownMenuItem 
                           className="rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer focus:bg-primary/10 focus:text-primary"
                           onSelect={onEdit}
                        >
                           <Edit3 size={12} className="mr-2" />
                           Edit Note
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                           className="rounded-[2px] text-[9px] font-black uppercase tracking-[0.2em] p-2.5 cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
                           onSelect={onDelete}
                        >
                           <Trash2 size={12} className="mr-2" />
                           Delete Note
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
         </CardFooter>
      </Card>
   );
}
