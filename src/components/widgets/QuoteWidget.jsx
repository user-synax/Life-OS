'use client';

import { useState, useEffect } from 'react';
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
    }, 500);
  };

  return (
    <div className="flex flex-col h-full justify-between p-2">
      <div className="flex items-center justify-between mb-4">
        <Quote size={20} className="text-primary/20" />
        <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground" onClick={getRandomQuote}>
          <RefreshCw size={12} className={cn(loading && "animate-spin")} />
        </Button>
      </div>

      <div className="flex-1 flex flex-col justify-center">
         <p className="text-sm font-medium italic leading-relaxed text-foreground/90">
            &ldquo;{quote.text}&rdquo;
         </p>
         <div className="flex items-center gap-2 mt-4">
            <div className="h-px w-4 bg-primary/30" />
            <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/50">
               {quote.author}
            </span>
         </div>
      </div>
      
      <div className="mt-4 flex justify-end">
         <span className="text-[8px] uppercase font-bold text-primary/30 tracking-tighter">Daily Inspiration</span>
      </div>
    </div>
  );
}
