'use client';

import { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { TrendingUp, Clock, Calendar, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import useAnalyticsStore from '@/store/useAnalyticsStore';
import { Card } from '@/components/ui/card';

const COLORS = {
  knowledge: '#3ecf8e',
  flashcards: '#f59e0b',
  mixed: '#8b5cf6',
  monday: '#ef4444',
  tuesday: '#f97316',
  wednesday: '#eab308',
  thursday: '#22c55e',
  friday: '#06b6d4',
  saturday: '#8b5cf6',
  sunday: '#ec4899'
};

export default function ProgressCharts() {
  const { overview, fetchOverview, overviewLoading } = useAnalyticsStore();
  const [activeChart, setActiveChart] = useState('daily');

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const formatMinutes = (minutes) => {
    if (minutes < 60) return `${minutes}m`;
    return `${Math.round(minutes / 60 * 10) / 10}h`;
  };

  const formatHour = (hour) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}${period}`;
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#171717] border border-[#2e2e2e] p-3 rounded-[4px]">
          <p className="text-sm text-[#fafafa] mb-2">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('minutes') || entry.name.includes('duration') ? 
                formatMinutes(entry.value) : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderDailyChart = () => {
    if (!overview?.dailyData || overview.dailyData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          No daily data available
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={overview.dailyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
          <XAxis 
            dataKey="date" 
            stroke="#898989"
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#898989" tickFormatter={formatMinutes} />
          <Tooltip content={<CustomTooltip />} />
          <Area 
            type="monotone" 
            dataKey="minutes" 
            stroke={COLORS.knowledge} 
            fill={COLORS.knowledge}
            fillOpacity={0.3}
            strokeWidth={2}
            name="Study Time"
          />
        </AreaChart>
      </ResponsiveContainer>
    );
  };

  const renderHourlyChart = () => {
    if (!overview?.hourlyData) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          No hourly data available
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={overview.hourlyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
          <XAxis 
            dataKey="hour" 
            stroke="#898989"
            tickFormatter={formatHour}
          />
          <YAxis stroke="#898989" tickFormatter={formatMinutes} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="minutes" 
            fill={COLORS.flashcards}
            name="Study Time"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderWeeklyChart = () => {
    if (!overview?.weeklyData) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          No weekly data available
        </div>
      );
    }

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={overview.weeklyData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
          <XAxis 
            dataKey="day" 
            stroke="#898989"
          />
          <YAxis stroke="#898989" tickFormatter={formatMinutes} />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="minutes" 
            fill={COLORS.mixed}
            name="Study Time"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  const renderSessionTypesChart = () => {
    if (!overview?.sessionTypes || Object.keys(overview.sessionTypes).length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          No session type data available
        </div>
      );
    }

    const data = Object.entries(overview.sessionTypes).map(([type, count]) => ({
      name: type.charAt(0).toUpperCase() + type.slice(1),
      value: count,
      color: COLORS[type] || '#898989'
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    );
  };

  const renderFocusScoreChart = () => {
    if (!overview?.dailyData || overview.dailyData.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 text-[#898989]">
          No focus score data available
        </div>
      );
    }

    // Simulate focus score data (in real implementation, this would come from the API)
    const data = overview.dailyData.map((day, index) => ({
      date: day.date,
      focusScore: Math.max(50, 100 - Math.random() * 30) // Simulated data
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
          <XAxis 
            dataKey="date" 
            stroke="#898989"
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis stroke="#898989" domain={[0, 100]} />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="focusScore" 
            stroke={COLORS.knowledge} 
            strokeWidth={2}
            dot={{ fill: COLORS.knowledge, r: 4 }}
            name="Focus Score"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  if (overviewLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="text-center py-8">
        <BarChart3 size={32} className="mx-auto text-[#898989] mb-2" />
        <p className="text-[#898989] text-sm">Start studying to see your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Chart Type Selector */}
      <div className="flex gap-2 flex-wrap">
        {[
          { id: 'daily', label: 'Daily Progress', icon: <Calendar size={16} /> },
          { id: 'hourly', label: 'Hourly Distribution', icon: <Clock size={16} /> },
          { id: 'weekly', label: 'Weekly Pattern', icon: <TrendingUp size={16} /> },
          { id: 'types', label: 'Session Types', icon: <PieChartIcon size={16} /> },
          { id: 'focus', label: 'Focus Score', icon: <BarChart3 size={16} /> }
        ].map((chart) => (
          <button
            key={chart.id}
            onClick={() => setActiveChart(chart.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm transition-colors ${
              activeChart === chart.id
                ? 'bg-[#3ecf8e] text-[#0f0f0f]'
                : 'bg-[#363636] text-[#898989] hover:bg-[#434343] hover:text-[#fafafa]'
            }`}
          >
            {chart.icon}
            {chart.label}
          </button>
        ))}
      </div>

      {/* Main Chart */}
      <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
        <h3 className="text-lg font-medium text-[#fafafa] mb-4">
          {activeChart === 'daily' && 'Daily Study Progress'}
          {activeChart === 'hourly' && 'Hourly Study Distribution'}
          {activeChart === 'weekly' && 'Weekly Study Pattern'}
          {activeChart === 'types' && 'Session Type Distribution'}
          {activeChart === 'focus' && 'Focus Score Trend'}
        </h3>
        
        {activeChart === 'daily' && renderDailyChart()}
        {activeChart === 'hourly' && renderHourlyChart()}
        {activeChart === 'weekly' && renderWeeklyChart()}
        {activeChart === 'types' && renderSessionTypesChart()}
        {activeChart === 'focus' && renderFocusScoreChart()}
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#3ecf8e]">{overview.summary.totalSessions}</div>
          <div className="text-xs text-[#898989]">Total Sessions</div>
        </Card>
        <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#f59e0b]">{formatMinutes(overview.summary.totalMinutes)}</div>
          <div className="text-xs text-[#898989]">Total Time</div>
        </Card>
        <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#8b5cf6]">{formatMinutes(overview.summary.averageSessionDuration)}</div>
          <div className="text-xs text-[#898989]">Avg Session</div>
        </Card>
        <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
          <div className="text-2xl font-bold text-[#06b6d4]">{Math.round(overview.focusScore)}%</div>
          <div className="text-xs text-[#898989]">Avg Focus</div>
        </Card>
      </div>

      {/* Session Type Breakdown */}
      {overview.sessionTypes && Object.keys(overview.sessionTypes).length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4">Session Type Breakdown</h4>
          <div className="space-y-3">
            {Object.entries(overview.sessionTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[type] || '#898989' }}
                  ></div>
                  <span className="text-sm text-[#fafafa] capitalize">{type}</span>
                </div>
                <span className="text-sm text-[#898989]">{count} sessions</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
