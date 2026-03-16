'use client';

import { useEffect } from 'react';
import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Slack, 
  Figma, 
  Plus,
  Globe
} from 'lucide-react';
import useBookmarkStore from '@/store/useBookmarkStore';

const DEFAULT_LINKS = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Mail, label: 'Gmail', href: 'https://gmail.com' },
  { icon: Slack, label: 'Slack', href: 'https://slack.com' },
  { icon: Figma, label: 'Figma', href: 'https://figma.com' },
];

export default function QuickLinksWidget() {
  const { bookmarks, fetchBookmarks } = useBookmarkStore();

  useEffect(() => {
    fetchBookmarks();
  }, [fetchBookmarks]);

  // Display first 5 bookmarks + defaults if needed
  const displayLinks = bookmarks.length > 0 
    ? bookmarks.slice(0, 5).map(b => ({
        icon: Globe,
        label: b.title,
        href: b.url
      }))
    : DEFAULT_LINKS;

  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-3 gap-1.5 flex-1">
        {displayLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-2 rounded-[4px] hover:bg-muted/30 border border-transparent hover:border-border/50 transition-all duration-300 group overflow-hidden"
          >
            <div className="p-2.5 rounded-[4px] bg-muted/10 group-hover:bg-primary/10 transition-colors">
              <link.icon size={14} className="text-muted-foreground/40 group-hover:text-primary transition-colors shrink-0" />
            </div>
            <span className="text-[7px] font-black text-muted-foreground/30 group-hover:text-foreground/80 transition-colors uppercase tracking-[0.2em] truncate w-full text-center px-1">
              {link.label}
            </span>
          </a>
        ))}
        {displayLinks.length < 6 && (
           <button className="flex flex-col items-center justify-center gap-2 p-2 rounded-[4px] border border-dashed border-border/30 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 group">
             <div className="p-2.5 rounded-[4px] bg-transparent group-hover:bg-primary/5 transition-colors">
               <Plus size={14} className="text-muted-foreground/20 group-hover:text-primary transition-colors" />
             </div>
             <span className="text-[7px] font-black text-muted-foreground/20 group-hover:text-foreground/40 transition-colors uppercase tracking-[0.2em]">
               Add
             </span>
           </button>
        )}
      </div>
    </div>
  );
}
