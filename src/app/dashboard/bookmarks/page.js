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
  Bookmark as BookmarkIcon
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
import { Badge } from '@/components/ui/badge';
import useBookmarkStore from '@/store/useBookmarkStore';
import { cn } from '@/lib/utils';

export default function BookmarksPage() {
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [view, setView] = useState('grid'); // grid, list

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newUrl.trim()) return;
    let url = newUrl;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    await addBookmark({ 
      title: newTitle || new URL(url).hostname, 
      url 
    });
    setNewUrl('');
    setNewTitle('');
  };

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.url.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Bookmarks</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your personal links library.</p>
        </div>
        <div className="flex items-center gap-2">
           <div className="bg-muted/50 p-1 rounded-[4px] border border-border flex items-center gap-1">
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-7 w-7 rounded-[2px]"
                onClick={() => setView('grid')}
              >
                <LayoutGrid size={14} />
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[250px_1fr] gap-6">
         <aside className="space-y-6">
            <Card className="bg-card border-border rounded-[4px] p-4 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 mb-4">Add Bookmark</h3>
               <form onSubmit={handleAddBookmark} className="space-y-3">
                  <div className="space-y-1">
                     <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/30 px-1">URL</label>
                     <Input 
                        placeholder="https://..." 
                        className="bg-muted/30 border-border rounded-[4px] h-9 text-xs"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                     />
                  </div>
                  <div className="space-y-1">
                     <label className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/30 px-1">Title</label>
                     <Input 
                        placeholder="Optional" 
                        className="bg-muted/30 border-border rounded-[4px] h-9 text-xs"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                     />
                  </div>
                  <Button type="submit" size="sm" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] h-9 font-bold uppercase tracking-wider text-[10px]">
                     Save
                  </Button>
               </form>
            </Card>

            <Card className="bg-card border-border rounded-[4px] p-2 shadow-sm">
               <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 p-2 mb-1">Collections</h3>
               <div className="space-y-0.5">
                  {['All Bookmarks', 'Dev', 'Design', 'Social'].map((cat, idx) => (
                     <button key={cat} className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-[4px] transition-colors group",
                        idx === 0 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                     )}>
                        <div className="flex items-center gap-2">
                           <Folder size={14} className={cn(idx === 0 ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary")} />
                           <span className="text-xs">{cat}</span>
                        </div>
                        {idx === 0 && <span className="text-[9px] font-bold bg-primary/20 px-1.5 py-0.5 rounded-[2px]">{bookmarks.length}</span>}
                     </button>
                  ))}
               </div>
            </Card>
         </aside>

         <div className="space-y-6">
            <div className="relative w-full">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
               <Input 
                  placeholder="Search bookmarks..." 
                  className="pl-10 h-10 bg-card border-border rounded-[4px] text-sm shadow-sm"
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
                        <div key={i} className="h-24 bg-muted/20 animate-pulse rounded-[4px]" />
                     ))
                  ) : filteredBookmarks.length === 0 ? (
                     <div className="col-span-full flex flex-col items-center justify-center h-48 text-muted-foreground/20">
                        <BookmarkIcon size={40} className="mb-2" />
                        <p className="text-[10px] font-bold uppercase tracking-widest">No bookmarks found.</p>
                     </div>
                  ) : (
                     filteredBookmarks.map((bookmark) => (
                        <BookmarkCard 
                           key={bookmark._id} 
                           bookmark={bookmark} 
                           view={view}
                           onDelete={() => removeBookmark(bookmark._id)}
                        />
                     ))
                  )}
               </div>
            </ScrollArea>
         </div>
      </div>
    </div>
  );
}

function BookmarkCard({ bookmark, view, onDelete }) {
   return (
      <Card className={cn(
         "group relative bg-card border-border hover:border-primary/50 transition-colors rounded-[4px] overflow-hidden shadow-sm",
         view === 'list' ? "flex items-center p-3 gap-3" : "p-4"
      )}>
         <div className={cn(
            "flex items-center justify-center rounded-[2px] bg-muted border border-border overflow-hidden shrink-0",
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
            <Globe size={18} className={cn("text-muted-foreground/20", bookmark.favicon && "hidden")} />
         </div>

         <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
               <h4 className="text-sm font-bold tracking-tight truncate group-hover:text-primary transition-colors">{bookmark.title}</h4>
               <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a 
                     href={bookmark.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-1.5 rounded-[4px] text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
                  >
                     <ExternalLink size={14} />
                  </a>
                  <DropdownMenu>
                     <DropdownMenuTrigger render={
                        <button className="p-1.5 rounded-[4px] text-muted-foreground hover:text-foreground transition-colors outline-none">
                           <MoreVertical size={14} />
                        </button>
                     } />
                     <DropdownMenuContent align="end" className="bg-card border-border p-1 rounded-[4px] shadow-sm">
                        <DropdownMenuItem className="rounded-[4px] text-xs font-bold uppercase tracking-wider p-2" onClick={onDelete}>
                           <Trash2 size={12} className="mr-2" />
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            <p className="text-[10px] text-muted-foreground/50 truncate font-medium">{new URL(bookmark.url).hostname}</p>
         </div>
      </Card>
   );
}
