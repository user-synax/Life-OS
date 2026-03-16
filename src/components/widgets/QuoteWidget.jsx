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
    <div className="flex flex-col h-full justify-between py-1">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-muted/10 rounded-[4px] border border-transparent">
          <Quote size={12} className="text-primary/40" />
        </div>
        <button 
          className="h-7 w-7 flex items-center justify-center text-muted-foreground/30 hover:text-primary hover:bg-primary/5 rounded-[4px] transition-all" 
          onClick={getRandomQuote}
          disabled={loading}
        >
          <RefreshCw size={10} className={cn("transition-transform duration-500", loading && "animate-spin")} />
        </button>
      </div>

      <div className="flex-1 flex flex-col justify-center px-1">
         <p className="text-[13px] font-black italic leading-[1.6] text-foreground/80 tracking-tight">
            &ldquo;{quote.text}&rdquo;
         </p>
         <div className="flex items-center gap-3 mt-4">
            <div className="h-[2px] w-6 bg-primary/20 rounded-full" />
            <span className="text-[8px] uppercase font-black tracking-[0.2em] text-muted-foreground/40">
               {quote.author}
            </span>
         </div>
      </div>
      
      <div className="mt-6 pt-3 border-t border-border/10 flex justify-between items-center">
         <span className="text-[7px] uppercase font-black text-muted-foreground/20 tracking-[0.3em]">Momentum</span>
         <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={cn("h-1 w-1 rounded-full bg-primary/10", i === 1 && "bg-primary/40")} />
            ))}
         </div>
      </div>
    </div>
  );
}
