'use client';

import { useState } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Camera,
  LogOut,
  Edit3,
  Check,
  X,
  ArrowLeft,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/useAuthStore';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import axios from 'axios';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || ''
  });

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      await axios.patch('/api/auth/me', formData);
      await fetchUser();
      setIsSaving(false);
      setIsEditing(false);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error('Update profile error:', error);
      setIsSaving(false);
      toast.error('Failed to update profile');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          className="gap-2 -ml-2 text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => router.back()}
        >
          <ArrowLeft size={16} />
          <span className="text-xs font-bold uppercase tracking-widest">Back</span>
        </Button>
        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">
          Operator Status: Active
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary/20 to-accent/20" />
            <div className="px-6 pb-6 -mt-12 flex flex-col items-center text-center">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-4 border-background shadow-xl rounded-2xl">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-black rounded-xl">
                    {user.name?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-2 bg-primary text-primary-foreground rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={14} />
                </button>
              </div>
              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-bold tracking-tight">{user.name}</h2>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest opacity-60">System Operator</p>
              </div>
              <div className="mt-6 w-full pt-6 border-t border-border/50 space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">Joined</span>
                  <span className="font-bold">{new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium uppercase tracking-widest opacity-60">Auth Level</span>
                  <Badge variant="outline" className="text-[10px] font-black uppercase">Standard</Badge>
                </div>
              </div>
            </div>
          </Card>

          <Card className="border-border/50 bg-card/50 p-6 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">Quick Stats</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                  <Activity size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Uptime</p>
                  <p className="text-sm font-bold">99.9%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Target size={14} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Operations</p>
                  <p className="text-sm font-bold">1,240</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="space-y-6">
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <User size={18} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight">Identity Registry</CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">Personnel Information</p>
                </div>
              </div>
              {!isEditing ? (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="rounded-lg gap-2 h-9 px-4 text-xs font-bold uppercase tracking-widest"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={14} />
                  Edit
                </Button>
              ) : (
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="rounded-lg h-9 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    className="rounded-lg gap-2 h-9 px-4 text-xs font-bold uppercase tracking-widest shadow-lg shadow-primary/20"
                    onClick={handleUpdateProfile}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : (
                      <>
                        <Check size={14} />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Full Designation</label>
                  {isEditing ? (
                    <Input 
                      value={formData.name} 
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="rounded-xl border-border/50 h-11 bg-background/50 focus:bg-background transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-muted/20 border border-border/30">
                      <User size={14} className="text-muted-foreground/40" />
                      <span className="text-sm font-bold">{user.name}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Access Identifier</label>
                  {isEditing ? (
                    <Input 
                      value={formData.email} 
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="rounded-xl border-border/50 h-11 bg-background/50 focus:bg-background transition-all"
                    />
                  ) : (
                    <div className="flex items-center gap-3 h-11 px-4 rounded-xl bg-muted/20 border border-border/30">
                      <Mail size={14} className="text-muted-foreground/40" />
                      <span className="text-sm font-bold">{user.email}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Personnel Biography</label>
                {isEditing ? (
                  <textarea 
                    value={formData.bio} 
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    placeholder="Tell us about yourself..."
                    className="w-full rounded-xl border border-border/50 bg-background/50 focus:bg-background transition-all p-4 min-h-[120px] text-sm font-medium focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                ) : (
                  <div className="p-4 rounded-xl bg-muted/20 border border-border/30 min-h-[120px]">
                    <p className="text-sm font-medium leading-relaxed text-foreground/80 italic">
                      {user.bio || 'No designation data provided.'}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50 overflow-hidden">
            <CardHeader className="border-b border-border/30 bg-muted/5">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500">
                  <Shield size={18} />
                </div>
                <div>
                  <CardTitle className="text-lg font-bold tracking-tight">Security & Protocols</CardTitle>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider opacity-60">Session Management</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-rose-500/5 border border-rose-500/10">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-rose-500 uppercase tracking-widest">Terminate Session</h4>
                  <p className="text-xs text-muted-foreground font-medium">Log out of the system and invalidate current access tokens.</p>
                </div>
                <Button 
                  variant="ghost" 
                  className="rounded-xl h-11 px-6 gap-2 text-rose-500 hover:bg-rose-500/10 hover:text-rose-600 transition-all border border-rose-500/20"
                  onClick={logout}
                >
                  <LogOut size={16} />
                  <span className="text-xs font-bold uppercase tracking-widest">Sign Out</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
