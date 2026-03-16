'use client';

import { 
  Github, 
  Twitter, 
  Linkedin, 
  Mail, 
  Slack, 
  Figma, 
  Plus
} from 'lucide-react';

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
      <div className="grid grid-cols-3 gap-2 flex-1">
        {quickLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-[4px] bg-muted/20 border border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group"
          >
            <link.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
            <span className="text-[8px] font-bold text-muted-foreground/60 group-hover:text-foreground transition-colors uppercase tracking-wider">
              {link.label}
            </span>
          </a>
        ))}
        <button className="flex flex-col items-center justify-center gap-1.5 p-2 rounded-[4px] border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-colors group">
          <Plus size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
          <span className="text-[8px] font-bold text-muted-foreground/30 group-hover:text-foreground transition-colors uppercase tracking-wider">
            Add
          </span>
        </button>
      </div>
    </div>
  );
}
