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
           <Button variant="ghost" size="sm" className="w-fit gap-2 text-[#898989]/50 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5 rounded-[6px] px-4" onClick={() => setIsEditing(false)}>
              <ChevronLeft size={16} />
              <span className="text-[0.88rem] font-medium">Back to Library</span>
           </Button>
           <div className="flex items-center gap-2 sm:gap-3">
              <Button variant="ghost" size="sm" className="flex-1 sm:flex-none gap-2 text-[#898989]/40 hover:text-[#fafafa] rounded-[6px] px-4 h-10 sm:h-9" onClick={() => setIsEditing(false)}>
                 <span className="text-[0.88rem] font-medium">Cancel</span>
              </Button>
              <Button size="default" className="flex-[2] sm:flex-none gap-2 bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] px-8 h-10 sm:h-9" onClick={handleSaveNote} disabled={isSaving}>
                 <Save size={14} />
                 <span className="text-[0.88rem] font-medium">{isSaving ? 'Saving...' : 'Save Note'}</span>
              </Button>
           </div>
        </div>

        <Card className="flex-1 flex flex-col bg-card border-[#2e2e2e] rounded-[8px] overflow-hidden min-h-[70vh] sm:min-h-[600px]">
           <CardHeader className="p-5 sm:p-8 border-b border-[#2e2e2e] bg-[#0f0f0f]">
              <div className="space-y-4">
                 <input 
                    className="w-full text-2xl sm:text-4xl font-normal border-none bg-transparent focus:ring-0 p-0 placeholder:text-[#898989]/10 h-auto tracking-tight text-[#fafafa]/90 outline-none"
                    placeholder="NOTE TITLE"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                 />
                 <div className="flex flex-wrap items-center gap-2 pt-2">
                    {editTags.map(tag => (
                       <Badge key={tag} variant="outline" className="gap-1.5 px-2 py-1 border-[#3ecf8e]/20 bg-[#3ecf8e]/5 text-[#3ecf8e] rounded-[2px] shrink-0">
                          <Tag size={10} className="opacity-50" />
                          <span className="text-[0.75rem] font-medium tracking-wide">{tag}</span>
                          <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive transition-colors ml-1">
                             <X size={10} />
                          </button>
                       </Badge>
                    ))}
                    <div className="flex items-center gap-2 flex-1 min-w-[120px]">
                       <input 
                          className="h-8 flex-1 sm:flex-none sm:w-32 text-[0.88rem] font-medium bg-[#171717] border-none rounded-[6px] px-3 placeholder:text-[#898989]/20 outline-none focus:bg-[#2e2e2e] transition-colors"
                          placeholder="ADD TAG..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                       />
                       <button 
                          className="h-8 w-8 flex items-center justify-center text-[#3ecf8e]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/10 rounded-[6px] transition-all shrink-0"
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
                 className="w-full h-full min-h-[400px] bg-transparent border-none focus:ring-0 resize-none text-sm sm:text-base text-[#fafafa]/70 leading-relaxed placeholder:text-[#898989]/10 outline-none p-5 sm:p-10 font-medium custom-scrollbar"
                 placeholder="Start writing your thoughts..."
                 value={editContent}
                 onChange={(e) => setEditContent(e.target.value)}
              />
           </CardContent>
           <CardFooter className="px-5 sm:px-8 py-4 border-t border-[#2e2e2e] bg-[#0f0f0f] flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-2 opacity-30">
                 <div className="h-1.5 w-1.5 rounded-full bg-[#3ecf8e] animate-pulse" />
                 <span className="code-label text-[#898989]">Markdown Protocol Active</span>
              </div>
              <div className="flex items-center gap-6">
                 <div className="flex flex-col items-end">
                    <span className="code-label text-[#898989]/30 mb-0.5">Length</span>
                    <span className="text-[0.88rem] font-medium tracking-wide text-[#898989]/60">
                       {editContent.length} <span className="text-[0.75rem] opacity-50">Chars</span>
                    </span>
                 </div>
                 <div className="h-6 w-px bg-[#2e2e2e]/50 hidden sm:block" />
                 <div className="flex flex-col items-end">
                    <span className="code-label text-[#898989]/30 mb-0.5">Volume</span>
                    <span className="text-[0.88rem] font-medium tracking-wide text-[#898989]/60">
                       {editContent.split(/\s+/).filter(Boolean).length} <span className="text-[0.75rem] opacity-50">Words</span>
                    </span>
                 </div>
              </div>
           </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Notes
            </h1>
            <p className="text-[#898989] mt-1 text-[1rem] font-medium">Capture your ideas and thoughts.</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
             <div className="relative w-full sm:max-w-[240px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#898989]/40" size={16} />
                <Input 
                  placeholder="Search notes..." 
                  className="pl-10 h-11 bg-[#0f0f0f] border-[#2e2e2e] rounded-[6px] text-[0.88rem] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-colors"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <div className="flex items-center gap-2">
                <div className="bg-[#0f0f0f] p-1 rounded-[9999px] border border-[#2e2e2e] flex items-center gap-1">
                   <Button 
                     variant={view === 'grid' ? 'secondary' : 'ghost'} 
                     size="icon" 
                     className="h-9 w-9 rounded-[9999px]"
                     onClick={() => setView('grid')}
                   >
                     <Grid size={16} />
                   </Button>
                   <Button 
                     variant={view === 'list' ? 'secondary' : 'ghost'} 
                     size="icon" 
                     className="h-9 w-9 rounded-[9999px]"
                     onClick={() => setView('list')}
                   >
                     <ListIcon size={16} />
                   </Button>
                </div>
                <Button 
                  size="default" 
                  className="flex-1 sm:flex-none bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] px-8 font-medium h-11 gap-2 transition-all" 
                  onClick={handleAddNote}
                  disabled={isSaving}
                >
                   <Plus size={18} />
                   <span>{isSaving ? 'Creating...' : 'New Note'}</span>
                </Button>
             </div>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <ScrollArea className="h-[calc(100vh-250px)] sm:h-[calc(100vh-200px)] pr-4">
          <div className={cn(
            "grid gap-4",
            view === 'grid' ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"
          )}>
          {pinnedNotes.length > 0 && (
             <div className="col-span-full space-y-4 mb-4">
                <div className="flex items-center gap-2 px-1">
                   <Pin size={14} className="text-[#3ecf8e]" />
                   <span className="text-[14px] font-medium tracking-wide text-[#898989]">Pinned</span>
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
             <div className="col-span-full space-y-4">
                <div className="flex items-center gap-2 px-1">
                   <StickyNote size={14} className="text-[#898989]/40" />
                   <span className="text-[14px] font-medium tracking-wide text-[#898989]">Notes</span>
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
                <div key={i} className="h-40 bg-[#2e2e2e]/20 animate-pulse rounded-[8px]" />
             ))
          )}

          {!loading && notes.length === 0 && (
             <div className="col-span-full flex flex-col items-center justify-center h-64 text-[#898989]/20">
                <FileText size={48} className="mb-3" />
                <p className="text-[16px] font-medium tracking-wide">Notebook is empty.</p>
             </div>
          )}
          </div>
        </ScrollArea>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="max-w-full sm:max-w-lg bg-card border-[#2e2e2e] p-0 overflow-hidden rounded-[8px] transition-all duration-500">
          <DialogHeader className="p-6 sm:p-8 border-b border-[#2e2e2e] bg-[#ef4444]/5">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
               <div className="h-12 w-12 rounded-[6px] bg-[#ef4444]/10 flex items-center justify-center text-[#ef4444] shrink-0">
                  <AlertTriangle size={24} />
               </div>
               <div>
                  <DialogTitle className="text-[1.5rem] font-normal tracking-[-0.16px] text-[#ef4444]/90 leading-tight">Delete Note?</DialogTitle>
                  <p className="code-label text-[#ef4444]/30 mt-1.5">Critical System Action</p>
               </div>
            </div>
          </DialogHeader>
          
          <div className="p-6 sm:p-8">
            <p className="text-xs sm:text-sm font-medium text-[#898989]/60 leading-relaxed tracking-wide">
              Are you sure you want to delete <span className="font-medium text-[#fafafa] underline decoration-[#ef4444]/30 underline-offset-4 decoration-2">&ldquo;{activeNote?.title}&rdquo;</span>? This will permanently remove this note and all its content from the system registry.
            </p>
          </div>

          <DialogFooter className="p-6 sm:p-8 bg-[#0f0f0f] border-t border-[#2e2e2e] flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
               variant="ghost" 
               size="sm" 
               onClick={() => setIsDeleteModalOpen(false)} 
               className="w-full sm:flex-1 h-12 rounded-[6px] text-[0.88rem] font-medium text-[#898989]/30 hover:text-[#fafafa] transition-all border border-transparent hover:border-[#2e2e2e]/50"
            >
              Abort
            </Button>
            <Button 
               variant="destructive"
               size="default" 
               onClick={handleConfirmDelete} 
               className="w-full sm:flex-1 h-12 bg-[#ef4444] text-[#fafafa] hover:bg-[#ef4444]/90 rounded-[9999px] text-[0.88rem] font-medium transition-all"
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
          "group relative flex flex-col overflow-hidden bg-[#0f0f0f] border-[#2e2e2e] hover:border-[#3ecf8e]/30 transition-all duration-300 rounded-[8px] cursor-pointer",
          view === 'list' ? "flex-row items-center h-24" : "h-56",
          note.pinned && "border-[#3ecf8e]/30 bg-[#3ecf8e]/5"
        )}
        onClick={onEdit}
      >
         <CardHeader className={cn("p-5 pb-2", view === 'list' && "flex-1 pb-5")}>
            <div className="flex items-start justify-between">
               <div className="flex-1 min-w-0">
                  <CardTitle className="text-[16px] font-medium tracking-tight truncate group-hover:text-[#3ecf8e] transition-colors">{note.title}</CardTitle>
                  <p className="text-[12px] font-medium text-[#898989]/40 mt-1.5 tracking-wide">{format(new Date(note.createdAt), 'MMM d, yyyy')}</p>
               </div>
            </div>
         </CardHeader>
         <CardContent className={cn("px-5 py-2 flex-1 overflow-hidden", view === 'list' && "hidden")}>
            <p className="text-[14px] text-[#898989]/50 leading-relaxed line-clamp-4 font-medium">
               {note.content || "No content..."}
            </p>
         </CardContent>
         <CardFooter className={cn("p-5 pt-2 flex items-center justify-between", view === 'list' && "p-5")}>
            <div className="flex items-center gap-1.5 overflow-hidden">
               {note.tags?.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-[12px] font-medium tracking-wide px-2 py-0.5 border-[#3ecf8e]/20 bg-[#3ecf8e]/5 text-[#3ecf8e]/80 rounded-[9999px]">{tag}</Badge>
               ))}
            </div>
            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-[9999px] text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5" 
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
                  className="h-8 w-8 rounded-[9999px] text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5" 
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
                  className="h-8 w-8 rounded-[9999px] text-[#898989]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/5" 
                  onClick={(e) => {
                     e.stopPropagation();
                     onDelete();
                  }}
               >
                  <Trash2 size={14} />
               </Button>
            </div>
         </CardFooter>
      </Card>
   );
}
