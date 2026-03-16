'use client';

import { useState } from 'react';
import { 
  User, 
  Bell, 
  Eye, 
  Palette, 
  Shield, 
  Camera,
  Smartphone,
  CreditCard,
  Trash2,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import useAuthStore from '@/store/useAuthStore';
import { cn } from '@/lib/utils';
import axios from 'axios';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  if (!user) return null;

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updates = {
      name: formData.get('name'),
      email: formData.get('email'),
      bio: formData.get('bio'),
    };

    try {
      setIsSaving(true);
      await axios.patch('/api/auth/me', updates);
      await fetchUser();
      setIsSaving(false);
    } catch (error) {
      console.error('Update profile error:', error);
      setIsSaving(false);
    }
  };

  const tabs = [
    { id: 'profile', icon: User, label: 'Profile' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
    { id: 'security', icon: Shield, label: 'Security' },
    { id: 'billing', icon: CreditCard, label: 'Billing' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your account and preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-6">
         <aside className="space-y-1">
            {tabs.map((tab) => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "w-full flex items-center gap-3 px-3 py-2 rounded-[4px] transition-colors group",
                     activeTab === tab.id 
                        ? "bg-primary text-primary-foreground font-bold" 
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
               >
                  <tab.icon size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">{tab.label}</span>
               </button>
            ))}
            
            <div className="pt-4 mt-4 border-t border-border">
               <Button 
                  variant="ghost" 
                  className="w-full justify-start gap-3 text-destructive hover:bg-destructive/10 hover:text-destructive rounded-[4px] h-9 px-3"
                  onClick={logout}
               >
                  <LogOut size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
               </Button>
            </div>
         </aside>

         <div className="space-y-6">
            {activeTab === 'profile' && (
               <div className="space-y-6">
                  <form onSubmit={handleUpdateProfile} className="space-y-6">
                     <Card className="bg-card border-border rounded-[4px] overflow-hidden shadow-sm">
                        <CardHeader className="p-6 border-b border-border bg-muted/20">
                           <CardTitle className="text-xs font-bold uppercase tracking-wider">Public Profile</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                           <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
                              <div className="relative group">
                                 <Avatar className="h-20 w-20 border-2 border-border rounded-[4px]">
                                    <AvatarImage src={user?.avatar} className="rounded-[4px]" />
                                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold rounded-[4px]">
                                       {user?.name?.charAt(0) || <User size={24} />}
                                    </AvatarFallback>
                                 </Avatar>
                                 <button type="button" className="absolute -bottom-2 -right-2 p-1.5 bg-background border border-border text-foreground rounded-[4px] shadow-sm hover:bg-muted transition-colors">
                                    <Camera size={14} />
                                 </button>
                              </div>
                              <div className="space-y-1">
                                 <h3 className="text-xl font-bold tracking-tight">{user?.name || 'User'}</h3>
                                 <p className="text-xs text-muted-foreground font-medium">{user?.email || 'user@example.com'}</p>
                                 <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-wider rounded-[2px] mt-2">Personal Account</Badge>
                              </div>
                           </div>

                           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Full Name</label>
                                 <Input name="name" defaultValue={user?.name || ''} className="bg-muted/30 border-border rounded-[4px] h-9 text-sm" />
                              </div>
                              <div className="space-y-1.5">
                                 <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Email Address</label>
                                 <Input name="email" defaultValue={user?.email || ''} className="bg-muted/30 border-border rounded-[4px] h-9 text-sm" />
                              </div>
                              <div className="col-span-full space-y-1.5">
                                 <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Bio</label>
                                 <textarea 
                                    name="bio"
                                    defaultValue={user?.bio || ''}
                                    className="w-full min-h-[100px] bg-muted/30 border border-border rounded-[4px] p-3 focus:ring-1 focus:ring-primary focus:border-primary transition-all resize-none text-sm outline-none"
                                    placeholder="Tell us a bit about yourself..."
                                 />
                              </div>
                           </div>
                        </CardContent>
                        <CardFooter className="p-6 bg-muted/10 border-t border-border flex justify-end">
                           <Button type="submit" size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] px-6 font-bold uppercase tracking-wider h-9 text-[10px]" disabled={isSaving}>
                              {isSaving ? 'Saving...' : 'Save Changes'}
                           </Button>
                        </CardFooter>
                     </Card>
                  </form>

                  <Card className="bg-card border-border rounded-[4px] overflow-hidden shadow-sm">
                     <CardHeader className="p-6 border-b border-border bg-muted/20">
                        <CardTitle className="text-xs font-bold uppercase tracking-wider text-destructive">Danger Zone</CardTitle>
                     </CardHeader>
                     <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                           <h4 className="font-bold text-sm">Delete Account</h4>
                           <p className="text-xs text-muted-foreground mt-1">Permanently delete your account and data.</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive rounded-[4px] h-9 px-4 font-bold uppercase tracking-wider text-[10px]">
                           <Trash2 size={14} className="mr-2" />
                           Delete
                        </Button>
                     </CardContent>
                  </Card>
               </div>
            )}

            {activeTab === 'appearance' && (
               <div className="space-y-6">
                  <Card className="bg-card border-border rounded-[4px] p-6 shadow-sm">
                     <h3 className="text-xs font-bold uppercase tracking-wider mb-6">Theme Preferences</h3>
                     <div className="space-y-6">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-[4px] bg-muted border border-border flex items-center justify-center">
                                 <Eye size={18} className="text-primary" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm">High Contrast</h4>
                                 <p className="text-xs text-muted-foreground">Improve visibility.</p>
                              </div>
                           </div>
                           <Switch />
                        </div>
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-[4px] bg-muted border border-border flex items-center justify-center">
                                 <Smartphone size={18} className="text-primary" />
                              </div>
                              <div>
                                 <h4 className="font-bold text-sm">Sync with System</h4>
                                 <p className="text-xs text-muted-foreground">Match OS theme.</p>
                              </div>
                           </div>
                           <Switch defaultChecked />
                        </div>
                     </div>
                  </Card>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
