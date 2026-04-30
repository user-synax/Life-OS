'use client';

import FitnessWidget from '@/components/widgets/FitnessWidget';
import { Card } from '@/components/ui/card';
import { Dumbbell } from 'lucide-react';

export default function FitnessPage() {
  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-[#3ecf8e]/10 flex items-center justify-center">
            <Dumbbell size={20} className="text-[#3ecf8e]" />
          </div>
          <div>
            <h1 className="text-[2.25rem] font-normal leading-[1.25] text-[#fafafa]">
              Fitness & Health
            </h1>
            <p className="text-sm text-[#898989]">Track your workouts, weight, nutrition, and measurements</p>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <Card className="border-[#2e2e2e] bg-[#0f0f0f] rounded-[8px] p-6">
            <FitnessWidget />
          </Card>
        </div>
      </div>
    </div>
  );
}
