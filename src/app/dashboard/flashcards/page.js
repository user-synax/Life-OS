'use client';

import FlashcardComponent from '@/components/dashboard/FlashcardComponent';

export default function FlashcardsPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-6">
        <h1 className="text-2xl font-normal text-[#fafafa]">Flashcards</h1>
        <p className="text-[#898989] mt-1">Spaced repetition learning system</p>
      </div>
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <FlashcardComponent />
        </div>
      </div>
    </div>
  );
}
