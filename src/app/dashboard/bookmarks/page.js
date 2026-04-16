'use client';

import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Globe, 
  MoreVertical,
  Folder,
  LayoutGrid,
  List as ListIcon,
  Bookmark as BookmarkIcon,
  Settings2,
  Pencil,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import useBookmarkStore from '@/store/useBookmarkStore';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const CATEGORIES = ['All Bookmarks', 'Dev', 'Design', 'Social', 'Personal', 'Tools'];

export default function BookmarksPage() {
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark, updateBookmark } = useBookmarkStore();
  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('All Bookmarks');
  const [view, setView] = useState('grid');
  const [activeCategory, setActiveCategory] = useState('All Bookmarks');
  
  // Edit state
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editUrl, setEditUrl] = useState('');
  const [editTitle, setEditTitle] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    
    try {
      let url = newUrl;
      if (!url.startsWith('http')) url = 'https://' + url;
      
      await addBookmark({ 
        title: newTitle || new URL(url).hostname, 
        url,
        category: newCategory === 'All Bookmarks' ? 'Personal' : newCategory
      });
      setNewUrl('');
      setNewTitle('');
      setNewCategory('All Bookmarks');
      toast.success('Bookmark archived successfully');
    } catch (error) {
      toast.error('Failed to archive bookmark');
    }
  };

  const handleEditClick = (bookmark) => {
    setEditingBookmark(bookmark);
    setEditUrl(bookmark.url);
    setEditTitle(bookmark.title);
    setEditCategory(bookmark.category || 'Personal');
    setIsEditModalOpen(true);
  };

  const handleUpdateBookmark = async (e) => {
    e.preventDefault();
    try {
      await updateBookmark(editingBookmark._id, {
        title: editTitle,
        url: editUrl,
        category: editCategory
      });
      setIsEditModalOpen(false);
      toast.success('Bookmark updated successfully');
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const filteredBookmarks = bookmarks.filter((b) => {
    const matchesSearch = b.title.toLowerCase().includes(search.toLowerCase()) ||
                         b.url.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All Bookmarks' || b.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Bookmarks
            </h1>
            <p className="text-[#898989] mt-1 text-[1rem] font-medium">Manage your personal links library.</p>
          </div>
          <div className="flex items-center gap-2">
             <div className="bg-[#0f0f0f] p-1 rounded-[9999px] border border-[#2e2e2e] flex items-center gap-1">
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-9 w-9 rounded-[9999px]"
                onClick={() => setView('grid')}
              >
                <LayoutGrid size={16} />
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
        </div>
      </div>

      <div className="p-4 md:p-6">

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
         <aside className="space-y-6">
            <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] p-5 sm:p-6">
               <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#3ecf8e]/60 mb-5 flex items-center gap-2">
                  <Plus size={14} />
                  Registry Entry
               </h3>
               <form onSubmit={handleAddBookmark} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Source URL</label>
                     <Input 
                        placeholder="https://..." 
                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-11 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Alias Title</label>
                     <Input 
                        placeholder="Optional" 
                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-11 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Collection</label>
                     <Select value={newCategory} onValueChange={setNewCategory}>
                        <SelectTrigger className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-11 text-[14px] font-medium">
                           <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-[#2e2e2e]">
                           {CATEGORIES.map(cat => (
                              <SelectItem key={cat} value={cat} className="text-[14px] font-medium">
                                 {cat}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <Button type="submit" className="w-full bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] h-11 font-medium transition-all mt-2">
                     Add to Archive
                  </Button>
               </form>
            </Card>

            <Card className="bg-[#0f0f0f] border-[#2e2e2e] rounded-[8px] p-2">
               <h3 className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] p-3 mb-1">Collections</h3>
               <div className="space-y-1">
                  {CATEGORIES.map((cat, idx) => {
                     const count = cat === 'All Bookmarks' 
                        ? bookmarks.length 
                        : bookmarks.filter(b => b.category === cat).length;
                     const isActive = activeCategory === cat;
                     
                     return (
                        <button 
                           key={cat} 
                           onClick={() => setActiveCategory(cat)}
                           className={cn(
                              "w-full flex items-center justify-between px-4 py-3 rounded-[6px] transition-all group",
                              isActive ? "bg-[#3ecf8e]/5 text-[#3ecf8e] font-medium" : "text-[#898989]/40 hover:bg-[#171717]/30 hover:text-[#fafafa]"
                           )}
                        >
                           <div className="flex items-center gap-3">
                              <Folder size={14} className={cn("transition-colors", isActive ? "text-[#3ecf8e]" : "text-[#898989]/20 group-hover:text-[#3ecf8e]/60")} />
                              <span className="text-[14px] font-medium">{cat}</span>
                           </div>
                           <span className={cn(
                              "text-[12px] font-medium px-2 py-0.5 rounded-[9999px] border",
                              isActive ? "bg-[#3ecf8e]/10 border-[#3ecf8e]/10" : "bg-[#171717]/20 border-[#2e2e2e]/30 opacity-40"
                           )}>
                              {count}
                           </span>
                        </button>
                     );
                  })}
               </div>
            </Card>
         </aside>

         <div className="space-y-6">
            <div className="relative w-full group">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#898989]/30 group-focus-within:text-[#3ecf8e] transition-colors" size={16} />
               <Input 
                  placeholder="Search archives..." 
                  className="pl-12 h-11 bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>

            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
               <div className={cn(
                  "grid gap-4",
                  view === 'grid' ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
               )}>
                  {loading && bookmarks.length === 0 ? (
                     [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-24 bg-[#171717]/20 animate-pulse rounded-[8px]" />
                     ))
                  ) : filteredBookmarks.length === 0 ? (
                     <div className="col-span-full flex flex-col items-center justify-center h-48 text-[#898989]/20">
                        <BookmarkIcon size={48} className="mb-2" />
                        <p className="text-[14px] font-medium uppercase tracking-wider">No bookmarks found in this collection.</p>
                     </div>
                  ) : (
                     filteredBookmarks.map((bookmark) => (
                        <BookmarkCard 
                           key={bookmark._id} 
                           bookmark={bookmark} 
                           view={view}
                           onDelete={() => {
                              removeBookmark(bookmark._id);
                              toast.success('Bookmark removed');
                           }}
                           onEdit={() => handleEditClick(bookmark)}
                        />
                     ))
                  )}
               </div>
            </ScrollArea>
         </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
         <DialogContent className="max-w-md bg-[#0f0f0f] border-[#2e2e2e] p-0 overflow-hidden rounded-[8px]">
            <DialogHeader className="p-6 border-b border-[#2e2e2e] bg-[#3ecf8e]/5">
               <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-[9999px] bg-[#3ecf8e]/10 flex items-center justify-center text-[#3ecf8e] shrink-0">
                     <Pencil size={20} />
                  </div>
                  <div>
                     <DialogTitle className="text-[1.5rem] font-normal tracking-tight text-[#fafafa]/90 leading-tight">Modify Archive</DialogTitle>
                     <p className="text-[12px] font-medium text-[#3ecf8e]/40 uppercase tracking-wider mt-1.5 flex items-center gap-2">
                        Update link entry registry
                     </p>
                  </div>
               </div>
            </DialogHeader>

            <form onSubmit={handleUpdateBookmark}>
               <div className="p-6 space-y-5">
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Alias Title</label>
                     <Input 
                        placeholder="Archive Name" 
                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Source URL</label>
                     <Input 
                        placeholder="https://..." 
                        className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium placeholder:text-[#898989]/20 focus:bg-[#171717] focus:border-[#3ecf8e] transition-all"
                        value={editUrl}
                        onChange={(e) => setEditUrl(e.target.value)}
                        required
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[12px] font-medium uppercase tracking-[0.2em] text-[#898989] px-1">Collection</label>
                     <Select value={editCategory} onValueChange={setEditCategory}>
                        <SelectTrigger className="bg-[#171717]/50 border-[#2e2e2e] rounded-[6px] h-12 text-[14px] font-medium">
                           <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0f0f0f] border-[#2e2e2e]">
                           {CATEGORIES.filter(c => c !== 'All Bookmarks').map(cat => (
                              <SelectItem key={cat} value={cat} className="text-[14px] font-medium">
                                 {cat}
                              </SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
               </div>

               <DialogFooter className="p-6 bg-[#0f0f0f] border-t border-[#2e2e2e] gap-3 sm:gap-0">
                  <Button 
                     type="button" 
                     variant="ghost" 
                     onClick={() => setIsEditModalOpen(false)}
                     className="h-11 rounded-[6px] text-[14px] font-medium text-[#898989]/30 hover:text-[#fafafa] transition-all border border-transparent hover:border-[#2e2e2e]/50"
                  >
                     Abort
                  </Button>
                  <Button 
                     type="submit" 
                     className="h-11 bg-[#3ecf8e] text-[#0a0a0a] hover:bg-[#3ecf8e]/90 rounded-[9999px] font-medium transition-all"
                  >
                     Confirm Changes
                  </Button>
               </DialogFooter>
            </form>
         </DialogContent>
      </Dialog>
    </div>
    </div>
  );
}

function BookmarkCard({ bookmark, view, onDelete, onEdit }) {
   const [isEditing, setIsEditing] = useState(false);
   const [editTitle, setEditTitle] = useState(bookmark.title);
   const [editUrl, setEditUrl] = useState(bookmark.url);

   const handleSaveEdit = () => {
      onEdit({ ...bookmark, title: editTitle, url: editUrl });
      setIsEditing(false);
   };

   const handleCancelEdit = () => {
      setEditTitle(bookmark.title);
      setEditUrl(bookmark.url);
      setIsEditing(false);
   };

   return (
      <Card className={cn(
         "group relative bg-[#0f0f0f] border-[#2e2e2e] hover:border-[#3ecf8e]/50 transition-colors rounded-[8px] overflow-hidden",
         view === 'list' ? "flex items-center p-4 gap-4" : "p-5"
      )}>
         <div className={cn(
            "flex items-center justify-center rounded-[9999px] bg-[#171717] border border-[#2e2e2e] overflow-hidden shrink-0",
            view === 'list' ? "h-10 w-10" : "h-12 w-12 mb-3"
         )}>
            {bookmark.favicon ? (
               <img 
                  src={bookmark.favicon} 
                  alt="" 
                  className="h-6 w-6 object-contain" 
                  onError={(e) => {
                     e.target.style.display = 'none';
                     e.target.nextSibling.style.display = 'block';
                  }} 
               />
            ) : null}
            <Globe size={18} className={cn("text-[#898989]/20", bookmark.favicon && "hidden")} />
         </div>

         <div className="flex-1 min-w-0">
            {isEditing ? (
               <div className="space-y-2">
                  <Input
                     value={editTitle}
                     onChange={(e) => setEditTitle(e.target.value)}
                     className="h-9 text-[14px]"
                     placeholder="Title"
                  />
                  <Input
                     value={editUrl}
                     onChange={(e) => setEditUrl(e.target.value)}
                     className="h-9 text-[14px]"
                     placeholder="URL"
                  />
                  <div className="flex gap-1">
                     <Button size="sm" className="h-9 px-3 text-[14px]" onClick={handleSaveEdit}>
                        <Check size={14} />
                     </Button>
                     <Button size="sm" variant="ghost" className="h-9 px-3 text-[14px]" onClick={handleCancelEdit}>
                        <X size={14} />
                     </Button>
                  </div>
               </div>
            ) : (
               <>
                  <div className="flex items-start justify-between gap-2">
                     <div className="flex-1 min-w-0">
                        <h4 className="text-[16px] font-medium tracking-tight truncate group-hover:text-[#3ecf8e] transition-colors">{bookmark.title}</h4>
                        <p className="text-[12px] text-[#898989]/50 truncate font-medium">{new URL(bookmark.url).hostname}</p>
                     </div>
                     
                     <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                           href={bookmark.url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="p-2 rounded-[9999px] text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5 transition-all"
                        >
                           <ExternalLink size={14} />
                        </a>
                        <button
                           onClick={() => setIsEditing(true)}
                           className="p-2 rounded-[9999px] text-[#898989]/40 hover:text-[#3ecf8e] hover:bg-[#3ecf8e]/5 transition-all"
                        >
                           <Edit2 size={14} />
                        </button>
                        <button
                           onClick={onDelete}
                           className="p-2 rounded-[9999px] text-[#898989]/40 hover:text-[#ef4444] hover:bg-[#ef4444]/5 transition-all"
                        >
                           <Trash2 size={14} />
                        </button>
                     </div>
                  </div>
                  {view === 'grid' && bookmark.category && (
                     <div className="mt-3 flex items-center justify-between">
                        <Badge variant="outline" className="text-[12px] font-medium px-2 py-0.5 rounded-[9999px] border-[#2e2e2e]/50 bg-[#171717]/20 text-[#898989]/40">
                           {bookmark.category}
                        </Badge>
                     </div>
                  )}
               </>
            )}
         </div>
      </Card>
   );
}
