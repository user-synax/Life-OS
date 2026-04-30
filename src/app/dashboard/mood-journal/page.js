'use client';

import { useEffect } from 'react';
import MoodJournalWidget from '@/components/widgets/MoodJournalWidget';
import { Card } from '@/components/ui/card';
import { Heart } from 'lucide-react';

export default function MoodJournalPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#3ecf8e]/10 flex items-center justify-center">
            <Heart size={20} className="text-[#3ecf8e]" />
          </div>
          <div>
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Mood & Journal
            </h1>
            <p className="text-sm text-[#898989]">Track your daily mood and journal your thoughts</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6">
            <MoodJournalWidget />
          </Card>
        </div>
      </div>
    </div>
  );
}
