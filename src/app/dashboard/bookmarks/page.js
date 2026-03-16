'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  ExternalLink, 
  Trash2, 
  Globe, 
  MoreVertical,
  Tag,
  Folder,
  LayoutGrid,
  List as ListIcon,
  ChevronRight,
  Bookmark as BookmarkIcon
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
import useBookmarkStore from '@/store/useBookmarkStore';
import { cn } from '@/lib/utils';
import gsap from 'gsap';

export default function BookmarksPage() {
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark } = useBookmarkStore();
  const [search, setSearch] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [view, setView] = useState('grid'); // grid, list
  const containerRef = useRef(null);

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  useEffect(() => {
    if (!loading && containerRef.current) {
      gsap.fromTo(
        containerRef.current.children,
        { opacity: 0, scale: 0.95, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, stagger: 0.03, ease: 'power2.out' }
      );
    }
  }, [loading, view]);

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
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">Bookmarks</h1>
          <p className="text-muted-foreground mt-1">Your personal gateway to the internet.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="bg-sidebar/50 p-1 rounded-xl border border-border flex items-center gap-1">
              <Button 
                variant={view === 'grid' ? 'secondary' : 'ghost'} 
                size="icon" 
                className="h-8 w-8 rounded-lg"
                onClick={() => setView('grid')}
              >
                <LayoutGrid size={16} />
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
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
         <aside className="space-y-6">
            <Card className="bg-card border-border rounded-3xl p-6 shadow-xl shadow-primary/5">
               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-4">Add Quick Link</h3>
               <form onSubmit={handleAddBookmark} className="space-y-4">
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 px-1">URL</label>
                     <Input 
                        placeholder="https://github.com" 
                        className="bg-sidebar/50 border-border rounded-xl h-11"
                        value={newUrl}
                        onChange={(e) => setNewUrl(e.target.value)}
                     />
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/30 px-1">Title (Optional)</label>
                     <Input 
                        placeholder="GitHub" 
                        className="bg-sidebar/50 border-border rounded-xl h-11"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                     />
                  </div>
                  <Button type="submit" className="w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl h-11 font-bold uppercase tracking-widest shadow-lg shadow-primary/20">
                     Save Bookmark
                  </Button>
               </form>
            </Card>

            <Card className="bg-card border-border rounded-3xl p-6 shadow-xl shadow-primary/5">
               <h3 className="text-[10px] uppercase font-black tracking-[0.2em] text-muted-foreground/50 mb-4">Collections</h3>
               <div className="space-y-1">
                  {['All Bookmarks', 'Development', 'Design', 'News', 'Social'].map((cat, idx) => (
                     <button key={cat} className={cn(
                        "w-full flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-300 group",
                        idx === 0 ? "bg-primary/10 text-primary font-bold" : "text-muted-foreground hover:bg-sidebar hover:text-foreground"
                     )}>
                        <div className="flex items-center gap-3">
                           <Folder size={16} className={cn(idx === 0 ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary")} />
                           <span className="text-sm">{cat}</span>
                        </div>
                        {idx === 0 && <span className="text-[10px] bg-primary/20 px-2 py-0.5 rounded-full">{bookmarks.length}</span>}
                     </button>
                  ))}
               </div>
            </Card>
         </aside>

         <div className="space-y-6">
            <div className="relative w-full">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
               <Input 
                  placeholder="Search your library..." 
                  className="pl-12 h-14 bg-card border-border rounded-2xl text-lg shadow-xl shadow-primary/5"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
               />
            </div>

            <ScrollArea className="h-[calc(100vh-280px)] pr-4">
               <div ref={containerRef} className={cn(
                  "grid gap-4",
                  view === 'grid' ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
               )}>
                  {loading && bookmarks.length === 0 ? (
                     [1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="h-32 bg-sidebar/50 animate-pulse rounded-2xl" />
                     ))
                  ) : filteredBookmarks.length === 0 ? (
                     <div className="col-span-full flex flex-col items-center justify-center h-80 text-muted-foreground/30">
                        <BookmarkIcon size={80} className="mb-6 opacity-5" />
                        <p className="text-2xl font-black italic tracking-tight">Library is empty.</p>
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
         "group relative bg-card border-border hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300 rounded-2xl overflow-hidden",
         view === 'list' ? "flex items-center p-4 gap-4" : "p-5"
      )}>
         <div className={cn(
            "flex items-center justify-center rounded-xl bg-sidebar border border-border/50 overflow-hidden",
            view === 'list' ? "h-12 w-12 shrink-0" : "h-14 w-14 mb-4"
         )}>
            {bookmark.favicon ? (
               <img 
                  src={bookmark.favicon} 
                  alt="" 
                  className="h-8 w-8 object-contain" 
                  onError={(e) => {
                     e.target.style.display = 'none';
                     e.target.nextSibling.style.display = 'block';
                  }} 
               />
            ) : null}
            <Globe size={24} className={cn("text-muted-foreground/30", bookmark.favicon && "hidden")} />
         </div>

         <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
               <h4 className="text-lg font-bold tracking-tight truncate group-hover:text-primary transition-colors">{bookmark.title}</h4>
               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  <a 
                     href={bookmark.url} 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="p-2 rounded-lg bg-sidebar text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                  >
                     <ExternalLink size={16} />
                  </a>
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button className="p-2 rounded-lg bg-sidebar text-muted-foreground hover:text-foreground transition-colors">
                           <MoreVertical size={16} />
                        </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="bg-card border-border p-2 rounded-xl shadow-2xl">
                        <DropdownMenuItem className="focus:bg-destructive/10 focus:text-destructive rounded-lg font-medium" onClick={onDelete}>
                           <Trash2 size={14} className="mr-2" />
                           Delete
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            </div>
            <p className="text-xs text-muted-foreground/50 truncate mt-0.5 font-medium">{new URL(bookmark.url).hostname}</p>
            {view === 'grid' && (
               <div className="flex items-center gap-2 mt-4">
                  <Badge variant="outline" className="text-[8px] uppercase font-bold tracking-widest px-2 py-0 border-border/50 text-muted-foreground/40">General</Badge>
               </div>
            )}
         </div>
      </Card>
   );
}
