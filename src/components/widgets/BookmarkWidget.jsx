'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useBookmarkStore from '@/store/useBookmarkStore';

export default function BookmarkWidget() {
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newBookmarkUrl.trim()) return;
    let url = newBookmarkUrl;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    try {
      const hostname = new URL(url).hostname;
      await addBookmark({ 
        title: hostname, 
        url 
      });
      setNewBookmarkUrl('');
    } catch (err) {
      console.error("Invalid URL");
    }
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddBookmark} className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Plus className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/50" size={12} />
          <Input
            placeholder="Add bookmark..."
            className="bg-muted/30 border-none h-9 text-[11px] pl-8 rounded-[4px] focus:bg-muted/50 transition-colors placeholder:text-muted-foreground/30"
            value={newBookmarkUrl}
            onChange={(e) => setNewBookmarkUrl(e.target.value)}
          />
        </div>
      </form>

      <ScrollArea className="flex-1 -mr-2 pr-2">
        {loading && bookmarks.length === 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/20 italic text-[10px] uppercase font-bold tracking-widest">
             <Plus size={16} className="opacity-10" />
             No bookmarks.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex flex-col p-2 rounded-[4px] hover:bg-muted/30 transition-all duration-200 border border-transparent hover:border-border/50 group relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-6 w-6 rounded-[2px] bg-background flex items-center justify-center overflow-hidden border border-border/50">
                    {bookmark.favicon ? (
                       <img src={bookmark.favicon} alt="" className="h-3.5 w-3.5" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                       <Globe size={10} className="text-muted-foreground/40" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground/40 hover:text-primary p-0.5 transition-colors"
                    >
                      <ExternalLink size={10} />
                    </a>
                  </div>
                </div>
                <span className="text-[10px] font-bold truncate text-foreground/90 tracking-tight leading-tight">{bookmark.title}</span>
                <span className="text-[7px] text-muted-foreground/40 truncate font-black uppercase tracking-tighter mt-0.5">
                  {new URL(bookmark.url).hostname.replace('www.', '')}
                </span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
