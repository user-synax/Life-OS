'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Trash2, Globe, Bookmark as BookmarkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useBookmarkStore from '@/store/useBookmarkStore';

export default function BookmarkWidget() {
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
  const [newBookmarkTitle, setNewBookmarkTitle] = useState('');
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  const handleAddBookmark = async (e) => {
    e.preventDefault();
    if (!newBookmarkUrl.trim()) return;
    let url = newBookmarkUrl;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    await addBookmark({ 
      title: newBookmarkTitle || new URL(url).hostname, 
      url 
    });
    setNewBookmarkUrl('');
    setNewBookmarkTitle('');
  };

  return (
    <div className="flex flex-col h-full w-full">
      <form onSubmit={handleAddBookmark} className="space-y-2 mb-4 px-1">
        <div className="flex items-center gap-2">
           <Input
             placeholder="https://..."
             className="bg-sidebar/50 border-border h-8 text-xs focus:ring-primary flex-1"
             value={newBookmarkUrl}
             onChange={(e) => setNewBookmarkUrl(e.target.value)}
           />
           <Button type="submit" size="icon" className="h-8 w-8 bg-primary text-primary-foreground">
             <Plus size={14} />
           </Button>
        </div>
      </form>

      <ScrollArea className="flex-1 pr-3">
        {loading && bookmarks.length === 0 ? (
          <div className="grid grid-cols-2 gap-2 py-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-16 bg-sidebar/50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-muted-foreground/50 italic text-sm">
             Save your favorite links.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 py-1">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex flex-col p-2 rounded-xl border border-border/50 bg-sidebar/30 group hover:border-primary/30 transition-all duration-300 relative"
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="h-6 w-6 rounded bg-background flex items-center justify-center overflow-hidden border border-border/50">
                    {bookmark.favicon ? (
                       <img src={bookmark.favicon} alt="" className="h-4 w-4" onError={(e) => e.target.style.display = 'none'} />
                    ) : (
                       <Globe size={12} className="text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <a 
                      href={bookmark.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-primary p-1"
                    >
                      <ExternalLink size={12} />
                    </a>
                    <button 
                      onClick={() => removeBookmark(bookmark._id)}
                      className="text-muted-foreground hover:text-destructive p-1"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
                <span className="text-[10px] font-bold truncate text-foreground/80 mt-1">{bookmark.title}</span>
                <span className="text-[8px] text-muted-foreground truncate">{new URL(bookmark.url).hostname}</span>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
