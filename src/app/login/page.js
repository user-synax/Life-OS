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
import { ShieldCheck, Command, Fingerprint, ArrowRight } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt:', { email });
    const result = await login(email, password);
    console.log('Login result:', result);
    setLoading(false);
    if (result.success) {
      toast.success('ACCESS GRANTED');
      console.log('Redirecting to dashboard...');
      // Use window.location for full page reload to ensure middleware runs
      window.location.href = '/dashboard';
    } else {
      toast.error(result.error || 'ACCESS DENIED');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#171717] px-4">
      <div className="w-full max-w-[400px] space-y-6">
        <div className="flex flex-col items-center space-y-2">
           <div className="h-12 w-12 rounded-xl bg-[#3ecf8e] flex items-center justify-center text-[#0a0a0a]">
              <Command size={24} />
           </div>
           <h1 className="text-[2.25rem] font-normal leading-[1.25] tracking-tight">Life OS</h1>
           <p className="text-sm text-[#898989]">Sign in to your account</p>
        </div>

        <Card className="border-[#2e2e2e]">
          <CardHeader className="space-y-1">
            <CardTitle className="text-[1.5rem] font-normal tracking-[-0.16px]">Login</CardTitle>
          </CardHeader>
          
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
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
                {loading ? 'Logging in...' : 'Login'}
              </Button>
              
              <div className="text-center text-sm text-[#898989]">
                Don&apos;t have an account? {' '}
                <Link href="/register" className="text-[#00c573] hover:underline underline-offset-4">
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
}
