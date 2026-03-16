'use client';

import { useState } from 'react';
import { Quote, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
  { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "Don't count the days, make the days count.", author: "Muhammad Ali" },
  { text: "The mind is everything. What you think you become.", author: "Buddha" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
];

export default function QuoteWidget() {
  const [quote, setQuote] = useState(quotes[0]);
  const [loading, setLoading] = useState(false);

  const getRandomQuote = () => {
    setLoading(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setQuote(quotes[randomIndex]);
      setLoading(false);
    }, 400);
  };

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between mb-2">
        <Quote size={16} className="text-primary/20" />
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground rounded-[4px]" onClick={getRandomQuote}>
          <RefreshCw size={12} className={cn(loading && "animate-spin")} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-2">
         <p className="text-sm font-bold italic leading-relaxed text-foreground/80 tracking-tight">
            &ldquo;{quote.text}&rdquo;
         </p>
         <div className="flex items-center gap-2 mt-4">
            <div className="h-px w-4 bg-primary/30" />
            <span className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground/60">
               {quote.author}
            </span>
         </div>
      </div>
      
      <div className="mt-4 pt-2 border-t border-border/30 flex justify-between items-center">
         <span className="text-[8px] uppercase font-bold text-muted-foreground/30 tracking-wider">Inspiration</span>
         <span className="text-[8px] uppercase font-bold text-primary/40 tracking-wider">Daily Quote</span>
      </div>
    </div>
  );
}
