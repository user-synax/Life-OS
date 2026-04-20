'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, Award, Target, Plus, Edit, Trash2, Clock, BarChart } from 'lucide-react';
import useAnalyticsStore from '@/store/useAnalyticsStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function SkillMastery() {
  const { 
    skills, 
    skillsStats, 
    topSkills, 
    skillsNeedingAttention, 
    fetchSkills, 
    createSkill, 
    updateSkill,
    skillsLoading,
    skillFilters,
    setSkillFilters
  } = useAnalyticsStore();

  const [showAddSkill, setShowAddSkill] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState({
    skillName: '',
    category: 'technical',
    currentLevel: 0,
    targetLevel: 100,
    tags: '',
    notes: ''
  });

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const getLevelColor = (level) => {
    if (level >= 80) return 'text-[#22c55e]';
    if (level >= 60) return 'text-[#3ecf8e]';
    if (level >= 40) return 'text-[#f59e0b]';
    if (level >= 20) return 'text-[#f97316]';
    return 'text-[#ef4444]';
  };

  const getLevelLabel = (level) => {
    if (level >= 80) return 'Expert';
    if (level >= 60) return 'Advanced';
    if (level >= 40) return 'Intermediate';
    if (level >= 20) return 'Beginner';
    return 'Novice';
  };

  const getCategoryColor = (category) => {
    const colors = {
      technical: '#3ecf8e',
      creative: '#f59e0b',
      language: '#8b5cf6',
      business: '#06b6d4',
      science: '#ef4444',
      arts: '#ec4899',
      other: '#898989'
    };
    return colors[category] || '#898989';
  };

  const handleCreateSkill = async (e) => {
    e.preventDefault();
    try {
      await createSkill({
        ...newSkill,
        tags: newSkill.tags.split(',').map(tag => tag.trim()).filter(Boolean)
      });
      setNewSkill({
        skillName: '',
        category: 'technical',
        currentLevel: 0,
        targetLevel: 100,
        tags: '',
        notes: ''
      });
      setShowAddSkill(false);
    } catch (error) {
      console.error('Failed to create skill:', error);
    }
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
    try {
      await updateSkill(editingSkill._id, {
        currentLevel: newSkill.currentLevel,
        notes: newSkill.notes
      });
      setEditingSkill(null);
      setNewSkill({
        skillName: '',
        category: 'technical',
        currentLevel: 0,
        targetLevel: 100,
        tags: '',
        notes: ''
      });
    } catch (error) {
      console.error('Failed to update skill:', error);
    }
  };

  const startEditSkill = (skill) => {
    setEditingSkill(skill);
    setNewSkill({
      skillName: skill.skillName,
      category: skill.category,
      currentLevel: skill.currentLevel,
      targetLevel: skill.targetLevel,
      tags: skill.tags.join(', '),
      notes: skill.notes || ''
    });
  };

  const cancelEdit = () => {
    setEditingSkill(null);
    setNewSkill({
      skillName: '',
      category: 'technical',
      currentLevel: 0,
      targetLevel: 100,
      tags: '',
      notes: ''
    });
  };

  const renderProgressBar = (current, target) => {
    const percentage = Math.min((current / target) * 100, 100);
    return (
      <div className="w-full bg-[#2e2e2e] rounded-full h-2">
        <div 
          className="h-2 rounded-full transition-all duration-300"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getLevelColor(current).replace('text-', '#')
          }}
        ></div>
      </div>
    );
  };

  if (skillsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3ecf8e]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-[#fafafa] flex items-center gap-2">
          <Brain size={18} className="text-[#3ecf8e]" />
          Skill Mastery
        </h3>
        <Button
          onClick={() => setShowAddSkill(!showAddSkill)}
          className="bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
        >
          <Plus size={14} className="mr-1" />
          Add Skill
        </Button>
      </div>

      {/* Overview Stats */}
      {skillsStats && (
        <div className="grid grid-cols-4 gap-4">
          <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
            <div className="text-2xl font-bold text-[#3ecf8e]">{skillsStats.totalSkills}</div>
            <div className="text-xs text-[#898989]">Total Skills</div>
          </Card>
          <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
            <div className="text-2xl font-bold text-[#f59e0b]">{Math.round(skillsStats.averageLevel)}%</div>
            <div className="text-xs text-[#898989]">Average Level</div>
          </Card>
          <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
            <div className="text-2xl font-bold text-[#8b5cf6]">{skillsStats.topSkillsCount}</div>
            <div className="text-xs text-[#898989]">Mastered</div>
          </Card>
          <Card className="p-4 bg-[#171717] border border-[#2e2e2e] rounded-[8px] text-center">
            <div className="text-2xl font-bold text-[#06b6d4]">{Math.round(skillsStats.totalStudyTime / 60)}h</div>
            <div className="text-xs text-[#898989]">Study Time</div>
          </Card>
        </div>
      )}

      {/* Add/Edit Skill Form */}
      {(showAddSkill || editingSkill) && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4">
            {editingSkill ? 'Edit Skill' : 'Add New Skill'}
          </h4>
          <form onSubmit={editingSkill ? handleUpdateSkill : handleCreateSkill} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.skillName}
                  onChange={(e) => setNewSkill({ ...newSkill, skillName: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
                  required
                  disabled={!!editingSkill}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#898989]">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
                  disabled={!!editingSkill}
                >
                  <option value="technical">Technical</option>
                  <option value="creative">Creative</option>
                  <option value="language">Language</option>
                  <option value="business">Business</option>
                  <option value="science">Science</option>
                  <option value="arts">Arts</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-[#898989]">
                Current Level: {newSkill.currentLevel}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={newSkill.currentLevel}
                onChange={(e) => setNewSkill({ ...newSkill, currentLevel: parseInt(e.target.value) })}
                className="w-full"
              />
              {renderProgressBar(newSkill.currentLevel, 100)}
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Tags (comma separated)</label>
              <input
                type="text"
                value={newSkill.tags}
                onChange={(e) => setNewSkill({ ...newSkill, tags: e.target.value })}
                className="w-full px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px]"
                placeholder="web, javascript, frontend..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#898989]">Notes</label>
              <textarea
                value={newSkill.notes}
                onChange={(e) => setNewSkill({ ...newSkill, notes: e.target.value })}
                className="w-full h-20 px-3 py-2 bg-[#0f0f0f] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] resize-none"
                placeholder="Add notes about your learning progress..."
              />
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-[#3ecf8e] text-[#0f0f0f] hover:bg-[#00c573] rounded-[4px]"
              >
                {editingSkill ? 'Update Skill' : 'Add Skill'}
              </Button>
              <Button
                type="button"
                onClick={cancelEdit}
                className="border-[#2e2e2e] text-[#fafafa] hover:bg-[#2e2e2e] rounded-[4px]"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Filter Controls */}
      <div className="flex gap-2 flex-wrap">
        <select
          value={skillFilters.category}
          onChange={(e) => setSkillFilters({ ...skillFilters, category: e.target.value })}
          className="px-3 py-2 bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
        >
          <option value="all">All Categories</option>
          <option value="technical">Technical</option>
          <option value="creative">Creative</option>
          <option value="language">Language</option>
          <option value="business">Business</option>
          <option value="science">Science</option>
          <option value="arts">Arts</option>
          <option value="other">Other</option>
        </select>
        
        <select
          value={skillFilters.sortBy}
          onChange={(e) => setSkillFilters({ ...skillFilters, sortBy: e.target.value })}
          className="px-3 py-2 bg-[#171717] border border-[#2e2e2e] text-[#fafafa] rounded-[4px] text-sm"
        >
          <option value="level">Sort by Level</option>
          <option value="progress">Sort by Progress</option>
          <option value="time">Sort by Time</option>
          <option value="name">Sort by Name</option>
        </select>
      </div>

      {/* Top Skills */}
      {topSkills && topSkills.length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4 flex items-center gap-2">
            <Award size={18} className="text-[#f59e0b]" />
            Top Skills
          </h4>
          <div className="space-y-3">
            {topSkills.map((skill, index) => (
              <div key={skill._id} className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div className="text-lg font-bold text-[#f59e0b]">#{index + 1}</div>
                  <div>
                    <div className="text-sm text-[#fafafa]">{skill.name}</div>
                    <div className="text-xs text-[#898989]">{skill.category}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getLevelColor(skill.level)}`}>
                    {skill.level}%
                  </div>
                  <div className="text-xs text-[#898989]">{getLevelLabel(skill.level)}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Skills Needing Attention */}
      {skillsNeedingAttention && skillsNeedingAttention.length > 0 && (
        <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
          <h4 className="text-lg font-medium text-[#fafafa] mb-4 flex items-center gap-2">
            <Target size={18} className="text-[#ef4444]" />
            Skills Needing Attention
          </h4>
          <div className="space-y-3">
            {skillsNeedingAttention.map((skill) => (
              <div key={skill._id} className="flex items-center justify-between p-3 bg-[#0f0f0f] border border-[#ef4444]/30 rounded-[4px]">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getCategoryColor(skill.category) }}
                  ></div>
                  <div>
                    <div className="text-sm text-[#fafafa]">{skill.skillName}</div>
                    <div className="text-xs text-[#898989]">
                      {skill.tags.slice(0, 2).join(', ')}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${getLevelColor(skill.currentLevel)}`}>
                    {skill.currentLevel}%
                  </div>
                  <Button
                    size="sm"
                    onClick={() => startEditSkill(skill)}
                    className="bg-[#363636] text-[#fafafa] hover:bg-[#434343] rounded-[2px]"
                  >
                    <Edit size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* All Skills */}
      <Card className="p-6 bg-[#171717] border-[#2e2e2e] rounded-[8px]">
        <h4 className="text-lg font-medium text-[#fafafa] mb-4">All Skills</h4>
        {skills.length === 0 ? (
          <div className="text-center py-8">
            <Brain size={32} className="mx-auto text-[#898989] mb-2" />
            <p className="text-[#898989] text-sm">No skills tracked yet. Add your first skill!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {skills.map((skill) => (
              <div key={skill._id} className="flex items-center justify-between p-4 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[4px]">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: getCategoryColor(skill.category) }}
                    ></div>
                    <div className="text-sm text-[#fafafa] font-medium">{skill.skillName}</div>
                    <span className="text-xs text-[#898989] capitalize">{skill.category}</span>
                    <span className={`text-xs px-2 py-1 rounded-[2px] ${getLevelColor(skill.currentLevel)}`}>
                      {getLevelLabel(skill.currentLevel)}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-[#898989]">
                      <span>Progress: {skill.currentLevel}%</span>
                      <span>Target: {skill.targetLevel}%</span>
                    </div>
                    {renderProgressBar(skill.currentLevel, skill.targetLevel)}
                  </div>
                  
                  {skill.tags.length > 0 && (
                    <div className="flex gap-1 mt-2">
                      {skill.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="text-xs px-2 py-1 bg-[#363636] text-[#898989] rounded-[2px]">
                          {tag}
                        </span>
                      ))}
                      {skill.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 bg-[#363636] text-[#898989] rounded-[2px]">
                          +{skill.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}
                  
                  {skill.timeSpent && (
                    <div className="flex items-center gap-4 mt-2 text-xs text-[#898989]">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <span>{Math.round(skill.timeSpent.totalMinutes / 60)}h total</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BarChart size={12} />
                        <span>{skill.timeSpent.sessionsCount} sessions</span>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2 ml-4">
                  <Button
                    size="sm"
                    onClick={() => startEditSkill(skill)}
                    className="bg-[#363636] text-[#fafafa] hover:bg-[#434343] rounded-[2px]"
                  >
                    <Edit size={12} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
