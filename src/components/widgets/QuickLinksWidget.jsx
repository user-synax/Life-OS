'use client';

import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Globe, 
  Slack, 
  Figma, 
  Youtube,
  Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const quickLinks = [
  { icon: Github, label: 'GitHub', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Mail, label: 'Gmail', href: 'https://gmail.com' },
  { icon: Slack, label: 'Slack', href: 'https://slack.com' },
  { icon: Figma, label: 'Figma', href: 'https://figma.com' },
];

export default function QuickLinksWidget() {
  return (
    <div className="flex flex-col h-full w-full">
      <div className="grid grid-cols-3 gap-3 flex-1">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl bg-sidebar/30 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group"
          >
            <link.icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-bold text-muted-foreground/50 group-hover:text-foreground transition-colors uppercase tracking-widest">
              {link.label}
            </span>
          </a>
        ))}
        <button className="flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border border-dashed border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 group">
          <Plus size={20} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
          <span className="text-[10px] font-bold text-muted-foreground/30 group-hover:text-foreground transition-colors uppercase tracking-widest">
            Add
          </span>
        </button>
      </div>
    </div>
  );
}
