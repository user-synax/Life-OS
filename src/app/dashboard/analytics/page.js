'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Brain, Flame, TrendingUp, Calendar, Clock, Target, Award } from 'lucide-react';
import useAnalyticsStore from '@/store/useAnalyticsStore';
import LearningStreaks from '@/components/dashboard/LearningStreaks';
import ProgressCharts from '@/components/dashboard/ProgressCharts';
import SkillMastery from '@/components/dashboard/SkillMastery';
import { Card } from '@/components/ui/card';

export default function AnalyticsPage() {
  const { overview, initializeAnalytics, overviewLoading } = useAnalyticsStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    initializeAnalytics();
  }, [initializeAnalytics]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'streaks', label: 'Learning Streaks', icon: <Flame size={16} /> },
    { id: 'charts', label: 'Progress Charts', icon: <TrendingUp size={16} /> },
    { id: 'skills', label: 'Skill Mastery', icon: <Brain size={16} /> }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewSection overview={overview} loading={overviewLoading} />;
      case 'streaks':
        return <LearningStreaks />;
      case 'charts':
        return <ProgressCharts />;
      case 'skills':
        return <SkillMastery />;
      default:
        return <OverviewSection overview={overview} loading={overviewLoading} />;
    }
  };

  if (overviewLoading && !overview) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-background">
      <div className="border-b border-[#2e2e2e] px-6 py-6">
        <h1 className="text-2xl font-normal text-[#fafafa]">Study Analytics</h1>
        <p className="text-[#898989] mt-1">Track your learning progress and achievements</p>
      </div>
      
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-[#2e2e2e]">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#3ecf8e] text-[#3ecf8e]'
                    : 'border-transparent text-[#898989] hover:text-[#fafafa]'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="min-h-[600px]">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewSection({ overview, loading }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-12">
        <BarChart3 size={48} className="mx-auto text-[#898989] mb-4" />
        <h3 className="text-lg font-medium text-[#fafafa] mb-2">No Analytics Data Yet</h3>
        <p className="text-[#898989]">Start studying to see your learning analytics!</p>
      </div>
    );
  }

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.round(minutes / 60 * 10) / 10}h`;
  };

  const getStreakEmoji = (streak) => {
    if (streak === 0) return 'ð';
    if (streak < 7) return 'ð';
    if (streak < 30) return 'ð';
    if (streak < 100) return 'ð';
    return 'ð';
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#3ecf8e]/20 rounded-lg">
              <Calendar size={20} className="text-[#3ecf8e]" />
            </div>
            <span className="text-3xl">{getStreakEmoji(overview.summary.currentStreak)}</span>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#fafafa]">{overview.summary.currentStreak}</div>
            <div className="text-sm text-[#898989]">Current Streak</div>
          </div>
          <div className="text-xs text-[#898989] mt-2">
            Longest: {overview.summary.longestStreak} days
          </div>
        </Card>

        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#f59e0b]/20 rounded-lg">
              <Clock size={20} className="text-[#f59e0b]" />
            </div>
            <TrendingUp size={20} className="text-[#f59e0b]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#fafafa]">{overview.summary.totalHours}</div>
            <div className="text-sm text-[#898989]">Total Hours</div>
          </div>
          <div className="text-xs text-[#898989] mt-2">
            {overview.summary.totalSessions} sessions
          </div>
        </Card>

        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#8b5cf6]/20 rounded-lg">
              <Target size={20} className="text-[#8b5cf6]" />
            </div>
            <Award size={20} className="text-[#8b5cf6]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#fafafa]">{formatMinutes(overview.summary.averageSessionDuration)}</div>
            <div className="text-sm text-[#898989]">Avg Session</div>
          </div>
          <div className="text-xs text-[#898989] mt-2">
            Focus: {Math.round(overview.focusScore)}%
          </div>
        </Card>

        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-[#06b6d4]/20 rounded-lg">
              <Brain size={20} className="text-[#06b6d4]" />
            </div>
            <BarChart3 size={20} className="text-[#06b6d4]" />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold text-[#fafafa]">{overview.summary.totalArticles}</div>
            <div className="text-sm text-[#898989]">Articles</div>
          </div>
          <div className="text-xs text-[#898989] mt-2">
            {overview.summary.totalFlashcards} flashcards
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Recent Study Sessions</h3>
          {overview.dailyData && overview.dailyData.length > 0 ? (
            <div className="space-y-3">
              {overview.dailyData
                .slice(-5)
                .reverse()
                .map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]">
                    <div>
                      <div className="text-sm text-[#fafafa]">
                        {new Date(day.date).toLocaleDateString('en-US', { 
                          weekday: 'short', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </div>
                      <div className="text-xs text-[#898989]">
                        {day.sessions} session{day.sessions !== 1 ? 's' : ''}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-[#fafafa]">{formatMinutes(day.minutes)}</div>
                      <div className="text-xs text-[#898989]">Study time</div>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#898989]">
              No recent study sessions
            </div>
          )}
        </Card>

        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Session Types</h3>
          {overview.sessionTypes && Object.keys(overview.sessionTypes).length > 0 ? (
            <div className="space-y-3">
              {Object.entries(overview.sessionTypes).map(([type, count]) => (
                <div key={type} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#3ecf8e]"></div>
                    <span className="text-sm text-[#fafafa] capitalize">{type}</span>
                  </div>
                  <div className="text-sm text-[#898989]">{count} sessions</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-[#898989]">
              No session data available
            </div>
          )}
        </Card>
      </div>

      {/* Weekly Pattern */}
      {overview.weeklyData && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Weekly Study Pattern</h3>
          <div className="grid grid-cols-7 gap-2">
            {overview.weeklyData.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-[#898989] mb-2">{day.day.slice(0, 3)}</div>
                <div className="h-20 flex items-end justify-center">
                  <div 
                    className="w-full bg-[#3ecf8e] rounded-t"
                    style={{ 
                      height: `${Math.max((day.minutes / (Math.max(...overview.weeklyData.map(d => d.minutes)) || 1)) * 100, 5)}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-[#898989] mt-1">
                  {day.minutes > 0 ? formatMinutes(day.minutes) : '0m'}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Achievements */}
      {overview.recentAchievements && overview.recentAchievements.length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h3 className="text-lg font-medium text-[#fafafa] mb-4">Recent Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {overview.recentAchievements.slice(0, 3).map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]">
                <div className="p-2 bg-[#f59e0b]/20 rounded-lg">
                  <Award size={16} className="text-[#f59e0b]" />
                </div>
                <div>
                  <div className="text-sm text-[#fafafa] capitalize">
                    {achievement.type.replace('_', ' ')}
                  </div>
                  <div className="text-xs text-[#898989]">
                    {new Date(achievement.achievedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
