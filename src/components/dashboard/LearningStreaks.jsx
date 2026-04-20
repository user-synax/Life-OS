'use client';

import { useState, useEffect } from 'react';
import { Flame, Target, Trophy, Calendar, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import useAnalyticsStore from '@/store/useAnalyticsStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LearningStreaks() {
  const { streak, fetchStreak, updateStreak, streakLoading } = useAnalyticsStore();
  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [goals, setGoals] = useState({
    dailyTargetMinutes: 30,
    weeklyTargetDays: 5,
    streakTargetDays: 30
  });

  useEffect(() => {
    fetchStreak();
  }, [fetchStreak]);

  useEffect(() => {
    if (streak) {
      setGoals({
        dailyTargetMinutes: streak.goals.dailyTargetMinutes,
        weeklyTargetDays: streak.goals.weeklyTargetDays,
        streakTargetDays: streak.goals.streakTargetDays
      });
    }
  }, [streak]);

  const handleSaveGoals = async () => {
    try {
      await updateStreak({ goals });
      setIsEditingGoals(false);
    } catch (error) {
      console.error('Failed to update goals:', error);
    }
  };

  const getStreakColor = (currentStreak, targetStreak) => {
    const percentage = (currentStreak / targetStreak) * 100;
    if (percentage >= 100) return 'text-[#22c55e]';
    if (percentage >= 50) return 'text-[#f59e0b]';
    return 'text-[#898989]';
  };

  const getStreakEmoji = (streakLength) => {
    if (streakLength === 0) return 'ð';
    if (streakLength < 7) return 'ð';
    if (streakLength < 30) return 'ð';
    if (streakLength < 100) return 'ð';
    return 'ð';
  };

  const getAchievementIcon = (type) => {
    switch (type) {
      case 'first_day': return <CheckCircle size={16} className="text-[#3ecf8e]" />;
      case 'week_streak': return <Trophy size={16} className="text-[#f59e0b]" />;
      case 'month_streak': return <Award size={16} className="text-[#8b5cf6]" />;
      case '3_month_streak': return <Award size={16} className="text-[#ef4444]" />;
      case 'year_streak': return <Award size={16} className="text-[#ffd700]" />;
      case 'perfect_week': return <Target size={16} className="text-[#3ecf8e]" />;
      case 'study_marathon': return <Clock size={16} className="text-[#06b6d4]" />;
      default: return <Award size={16} className="text-[#898989]" />;
    }
  };

  const getAchievementName = (type) => {
    switch (type) {
      case 'first_day': return 'First Day';
      case 'week_streak': return 'Week Warrior';
      case 'month_streak': return 'Month Master';
      case '3_month_streak': return 'Quarter Champion';
      case 'year_streak': return 'Year Legend';
      case 'perfect_week': return 'Perfect Week';
      case 'study_marathon': return 'Study Marathon';
      default: return 'Achievement';
    }
  };

  if (streakLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  if (!streak) {
    return (
      <div className="text-center py-8">
        <Flame size={32} className="mx-auto text-[#898989] mb-2" />
        <p className="text-[#898989] text-sm">Start studying to build your streak!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Streak Display */}
      <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
        <div className="text-center">
          <div className="text-6xl mb-2">{getStreakEmoji(streak.currentStreak)}</div>
          <h3 className="text-3xl font-bold text-[#fafafa] mb-1">
            {streak.currentStreak}
          </h3>
          <p className="text-[#898989] mb-4">Day Streak</p>
          
          <div className="flex items-center justify-center gap-4 text-sm text-[#898989]">
            <div className="flex items-center gap-1">
              <Trophy size={14} />
              <span>Longest: {streak.longestStreak}</span>
            </div>
            {streak.lastStudyDate && (
              <div className="flex items-center gap-1">
                <Calendar size={14} />
                <span>Last: {new Date(streak.lastStudyDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      {/* Goals Progress */}
      <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-medium text-[#fafafa] flex items-center gap-2">
            <Target size={18} className="text-[#3ecf8e]" />
            Goals
          </h4>
          <Button
            size="sm"
            onClick={() => setIsEditingGoals(!isEditingGoals)}
            className="bg-[#363636] text-[#fafafa] hover:bg-[#434343] rounded-[4px]"
          >
            {isEditingGoals ? 'Cancel' : 'Edit'}
          </Button>
        </div>

        {isEditingGoals ? (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Daily Target (minutes)</label>
              <input
                type="number"
                min="1"
                value={goals.dailyTargetMinutes}
                onChange={(e) => setGoals({ ...goals, dailyTargetMinutes: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Weekly Target (days)</label>
              <input
                type="number"
                min="1"
                max="7"
                value={goals.weeklyTargetDays}
                onChange={(e) => setGoals({ ...goals, weeklyTargetDays: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Streak Target (days)</label>
              <input
                type="number"
                min="1"
                value={goals.streakTargetDays}
                onChange={(e) => setGoals({ ...goals, streakTargetDays: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
              />
            </div>
            <Button
              onClick={handleSaveGoals}
              className="w-full bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
            >
              Save Goals
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#898989]">Daily Target</span>
              <span className="text-sm text-[#fafafa]">{goals.dailyTargetMinutes} min</span>
            </div>
            <div className="w-full bg-[#2e2e2e] rounded-full h-2">
              <div 
                className="bg-[#3ecf8e] h-2 rounded-full transition-all"
                style={{ width: `${Math.min(streak.stats?.dailyGoalProgress || 0, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#898989]">Weekly Target</span>
              <span className="text-sm text-[#fafafa]">{streak.stats?.thisWeekSessions || 0}/{goals.weeklyTargetDays} days</span>
            </div>
            <div className="w-full bg-[#2e2e2e] rounded-full h-2">
              <div 
                className="bg-[#3ecf8e] h-2 rounded-full transition-all"
                style={{ width: `${Math.min(streak.stats?.weeklyGoalProgress || 0, 100)}%` }}
              ></div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-[#898989]">Streak Target</span>
              <span className={`text-sm font-medium ${getStreakColor(streak.currentStreak, goals.streakTargetDays)}`}>
                {streak.currentStreak}/{goals.streakTargetDays} days
              </span>
            </div>
            <div className="w-full bg-[#2e2e2e] rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all ${streak.currentStreak >= goals.streakTargetDays ? 'bg-[#22c55e]' : 'bg-[#f59e0b]'}`}
                style={{ width: `${Math.min((streak.currentStreak / goals.streakTargetDays) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        )}
      </Card>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4 bg-[#171717] border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#3ecf8e]">{streak.stats?.totalStudyDays || 0}</div>
          <div className="text-xs text-[#898989]">Total Study Days</div>
        </Card>
        <Card className="p-4 bg-[#171717] border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">{streak.stats?.totalSessions || 0}</div>
          <div className="text-xs text-[#898989]">Total Sessions</div>
        </Card>
        <Card className="p-4 bg-[#171717] border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#8b5cf6]">{Math.round((streak.stats?.totalMinutes || 0) / 60)}h</div>
          <div className="text-xs text-[#898989]">Total Hours</div>
        </Card>
        <Card className="p-4 bg-[#171717] border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#06b6d4]">{Math.round(streak.stats?.averageSessionDuration || 0)}m</div>
          <div className="text-xs text-[#898989]">Avg Session</div>
        </Card>
      </div>

      {/* Recent Achievements */}
      {streak.achievements && streak.achievements.length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4 flex items-center gap-2">
            <Trophy size={18} className="text-[#f59e0b]" />
            Recent Achievements
          </h4>
          <div className="space-y-2">
            {streak.achievements
              .sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt))
              .slice(0, 5)
              .map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]"
                >
                  <div className="flex items-center gap-3">
                    {getAchievementIcon(achievement.type)}
                    <div>
                      <div className="text-sm text-[#fafafa]">{getAchievementName(achievement.type)}</div>
                      <div className="text-xs text-[#898989]">
                        {new Date(achievement.achievedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}

      {/* Streak History */}
      {streak.streakHistory && streak.streakHistory.length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-[#3ecf8e]" />
            Streak History
          </h4>
          <div className="space-y-2">
            {streak.streakHistory
              .sort((a, b) => new Date(b.endDate) - new Date(a.endDate))
              .slice(0, 3)
              .map((history, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]"
                >
                  <div>
                    <div className="text-sm text-[#fafafa]">{history.length} days</div>
                    <div className="text-xs text-[#898989]">
                      {new Date(history.startDate).toLocaleDateString()} - {new Date(history.endDate).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-xs text-[#898989]">
                    {history.brokenReason === 'skip' ? 'Missed day' : history.brokenReason}
                  </div>
                </div>
              ))}
          </div>
        </Card>
      )}
    </div>
  );
}
