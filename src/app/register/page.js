'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { toast } from 'sonner';
import useAuthStore from '@/store/useAuthStore';
import { UserPlus, Command, ShieldCheck, ArrowRight, User } from 'lucide-react';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);
    if (result.success) {
      toast.success('ENTITY INITIALIZED');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'REGISTRATION FAILED');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#030303] px-4 relative overflow-hidden">
      {/* Tactical Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary),0.05),transparent_70%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative w-full max-w-[420px] animate-in fade-in zoom-in-95 duration-700">
        {/* System Header */}
        <div className="flex flex-col items-center mb-8 space-y-4">
           <div className="h-16 w-16 rounded-[4px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shadow-2xl shadow-primary/20">
              <Command size={32} />
           </div>
           <div className="text-center">
              <h1 className="text-2xl font-black uppercase tracking-[0.3em] text-foreground leading-tight">Life OS</h1>
              <p className="text-[10px] font-black text-primary/40 uppercase tracking-[0.4em] mt-2 flex items-center justify-center gap-2">
                 <span className="h-1 w-1 rounded-full bg-primary animate-pulse" />
                 Registry Entry Protocol
              </p>
           </div>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-2xl rounded-[4px] shadow-2xl shadow-black/50 ring-1 ring-white/5">
          <CardHeader className="p-8 pb-4 border-b border-border/30 bg-muted/5">
            <div className="flex items-center gap-3">
               <UserPlus size={18} className="text-primary/60" />
               <CardTitle className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground/80">Entity Initialization</CardTitle>
            </div>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-1 font-mono">Designation</Label>
                <div className="relative group">
                   <User size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/20 group-focus-within:text-primary transition-colors" />
                   <Input
                     id="name"
                     placeholder="OPERATIVE NAME"
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                     required
                     className="pl-11 h-12 bg-muted/10 border-border/50 rounded-[4px] text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/10 focus:bg-muted/20 transition-all border-none focus:ring-1 focus:ring-primary/20 font-mono"
                   />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-1 font-mono">Source Identifier</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="USER@OS.INTERNAL"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="h-12 bg-muted/10 border-border/50 rounded-[4px] text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/10 focus:bg-muted/20 transition-all border-none focus:ring-1 focus:ring-primary/20 font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground/40 px-1 font-mono">Access Protocol</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 bg-muted/10 border-border/50 rounded-[4px] text-[11px] font-black uppercase tracking-widest placeholder:text-muted-foreground/10 focus:bg-muted/20 transition-all border-none focus:ring-1 focus:ring-primary/20 font-mono"
                />
              </div>
            </CardContent>
            
            <CardFooter className="p-8 pt-0 flex flex-col gap-6">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary text-primary-foreground hover:bg-primary/90 rounded-[4px] font-black uppercase tracking-[0.3em] text-[10px] shadow-2xl shadow-primary/20 transition-all active:scale-[0.98] group" 
                disabled={loading}
              >
                {loading ? 'Initializing...' : (
                  <div className="flex items-center gap-2">
                     <span>Deploy Entity</span>
                     <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                )}
              </Button>
              
              <div className="w-full flex items-center justify-between px-1">
                 <div className="h-px flex-1 bg-border/30" />
                 <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground/20 px-4">Registry Access</span>
                 <div className="h-px flex-1 bg-border/30" />
              </div>

              <div className="text-center">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">Already Registered? </span>
                <Link href="/login" className="text-[9px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/80 transition-colors underline underline-offset-4 decoration-primary/20">
                  Secure Sign In
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>

        {/* System Footer Info */}
        <div className="mt-8 flex items-center justify-between px-2 opacity-20 group hover:opacity-100 transition-opacity">
           <div className="flex items-center gap-2">
              <ShieldCheck size={12} className="text-primary" />
              <span className="text-[8px] font-black uppercase tracking-[0.3em]">End-to-End Encryption Active</span>
           </div>
           <span className="text-[8px] font-black uppercase tracking-[0.3em]">v1.0.4-STABLE</span>
        </div>
      </div>
    </div>
  );
}
