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
      <form onSubmit={handleAddBookmark} className="flex items-center gap-2 mb-3">
        <Input
          placeholder="https://..."
          className="bg-muted/30 border-border h-8 text-xs rounded-[4px] focus:ring-1 focus:ring-primary flex-1"
          value={newBookmarkUrl}
          onChange={(e) => setNewBookmarkUrl(e.target.value)}
        />
        <Button type="submit" size="icon" className="h-8 w-8 bg-primary text-primary-foreground rounded-[4px]">
          <Plus size={14} />
        </Button>
      </form>

      <ScrollArea className="flex-1 pr-2">
        {loading && bookmarks.length === 0 ? (
          <div className="grid grid-cols-2 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-muted/50 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex items-center justify-center h-20 text-muted-foreground/40 italic text-xs">
             No bookmarks.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex flex-col p-2.5 rounded-[4px] border border-border bg-muted/10 group transition-colors relative"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="h-6 w-6 rounded-[2px] bg-background flex items-center justify-center overflow-hidden border border-border">
                    {bookmark.favicon ? (
                       <img src={bookmark.favicon} alt="" className="h-3.5 w-3.5" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                       <Globe size={10} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary p-0.5"
                    >
                      <ExternalLink size={10} />
                    </a>
                    <button 
                      onClick={() => removeBookmark(bookmark._id)}
                      className="text-muted-foreground hover:text-destructive p-0.5"
                    >
                      <Trash2 size={10} />
                    </button>
                  </div>
                </div>
                <span className="text-[10px] font-bold truncate text-foreground/80 tracking-tight">{bookmark.title}</span>
                <span className="text-[8px] text-muted-foreground truncate font-medium">{new URL(bookmark.url).hostname}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
