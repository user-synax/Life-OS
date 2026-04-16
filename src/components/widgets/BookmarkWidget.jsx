'use client';

import { useState, useEffect } from 'react';
import { Plus, ExternalLink, Globe, ArrowRight, Trash2, Edit2, Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import useBookmarkStore from '@/store/useBookmarkStore';
import { useRouter } from 'next/navigation';

export default function BookmarkWidget() {
  const [newBookmarkUrl, setNewBookmarkUrl] = useState('');
  const [editingBookmark, setEditingBookmark] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editUrl, setEditUrl] = useState('');
  const { bookmarks, loading, fetchBookmarks, addBookmark, removeBookmark, updateBookmark } = useBookmarkStore();
  const router = useRouter();

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

  const handleDeleteBookmark = async (id) => {
    await removeBookmark(id);
  };

  const handleStartEdit = (bookmark) => {
    setEditingBookmark(bookmark._id);
    setEditTitle(bookmark.title);
    setEditUrl(bookmark.url);
  };

  const handleCancelEdit = () => {
    setEditingBookmark(null);
    setEditTitle('');
    setEditUrl('');
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim() || !editUrl.trim()) return;
    let url = editUrl;
    if (!url.startsWith('http')) url = 'https://' + url;
    
    await updateBookmark(id, { title: editTitle, url });
    handleCancelEdit();
  };

  const latestBookmarks = bookmarks.slice(0, 3);

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
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-muted/20 animate-pulse rounded-[4px]" />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground/20 italic text-[14px] uppercase font-medium tracking-widest">
             <Plus size={16} className="opacity-10" />
             No bookmarks.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {latestBookmarks.map((bookmark) => (
              <div
                key={bookmark._id}
                className="flex flex-col p-2 rounded-[4px] bg-[#171717]/50 hover:bg-[#2e2e2e]/50 transition-all duration-200 border border-[#2e2e2e]/30 hover:border-[#3ecf8e]/30 group relative overflow-hidden"
              >
                {editingBookmark === bookmark._id ? (
                  <div className="space-y-2">
                    <Input
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="h-6 text-[10px] px-1 py-0"
                      placeholder="Title"
                    />
                    <Input
                      value={editUrl}
                      onChange={(e) => setEditUrl(e.target.value)}
                      className="h-6 text-[10px] px-1 py-0"
                      placeholder="URL"
                    />
                    <div className="flex gap-1">
                      <Button size="sm" className="h-6 px-2 text-[10px]" onClick={() => handleSaveEdit(bookmark._id)}>
                        <Check size={10} />
                      </Button>
                      <Button size="sm" variant="ghost" className="h-6 px-2 text-[10px]" onClick={handleCancelEdit}>
                        <X size={10} />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="h-7 w-7 rounded-[2px] bg-background flex items-center justify-center overflow-hidden border border-border/50">
                        {bookmark.favicon ? (
                           <img src={bookmark.favicon} alt="" className="h-4 w-4" onError={(e) => e.target.style.display = 'none'} />
                        ) : (
                           <Globe size={14} className="text-muted-foreground/40" />
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleStartEdit(bookmark)}
                          className="text-muted-foreground/40 hover:text-primary p-0.5 transition-colors"
                        >
                          <Edit2 size={11} />
                        </button>
                        <button
                          onClick={() => handleDeleteBookmark(bookmark._id)}
                          className="text-muted-foreground/40 hover:text-red-500 p-0.5 transition-colors"
                        >
                          <Trash2 size={11} />
                        </button>
                        <a 
                          href={bookmark.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-muted-foreground/40 hover:text-primary p-0.5 transition-colors"
                        >
                          <ExternalLink size={11} />
                        </a>
                      </div>
                    </div>
                    <span className="text-[16px] font-medium truncate text-foreground/90 tracking-tight leading-tight">{bookmark.title}</span>
                    <span className="text-[12px] text-muted-foreground/40 truncate font-medium uppercase tracking-tighter mt-0.5">
                      {new URL(bookmark.url).hostname.replace('www.', '')}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </ScrollArea>

      {bookmarks.length > 3 && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full mt-3 text-xs font-medium text-muted-foreground hover:text-foreground"
          onClick={() => router.push('/dashboard/bookmarks')}
        >
          View All Bookmarks
          <ArrowRight size={12} className="ml-1" />
        </Button>
      )}
    </div>
  );
}
