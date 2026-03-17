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
      toast.success('REGISTRATION SUCCESSFUL');
      router.push('/dashboard');
    } else {
      toast.error(result.error || 'REGISTRATION FAILED');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-2">
           <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-lg">
              <Command size={24} />
           </div>
           <h1 className="text-2xl font-bold tracking-tight">Life OS</h1>
           <p className="text-sm text-muted-foreground">Create your account</p>
        </div>

        <Card className="shadow-xl border-border">
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl font-bold">Register</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            
            <CardFooter className="flex flex-col gap-4">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? 'Creating account...' : 'Sign up'}
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Already have an account? {' '}
                <Link href="/login" className="text-primary hover:underline underline-offset-4">
                  Login
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
