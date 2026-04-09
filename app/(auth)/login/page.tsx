'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Wallet, Eye, EyeOff, Lock, Mail, ArrowRight, Loader2, ShieldCheck, User as UserIcon } from 'lucide-react';
import WalletButton from '@/components/shared/WalletButton';
import { useToast } from '@/components/shared/Toast';

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  
  const [role, setRole] = useState<'staker' | 'admin'>('staker');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorShake, setErrorShake] = useState(false);

  useEffect(() => {
    if (session) {
      const returnUrl = searchParams.get('returnUrl') || (session.user as any).role === 'admin' ? '/admin/dashboard' : '/staker/dashboard';
      router.push(returnUrl);
    }
  }, [session, router, searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorShake(false);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast(result.error, 'error');
        setErrorShake(true);
      } else {
        toast('Welcome back to StakeVault!', 'success');
        // Redirect logic is in useEffect
      }
    } catch (err: any) {
      toast('Login failed. Please check your credentials.', 'error');
      setErrorShake(true);
    } finally {
      setLoading(false);
    }
  };

  const handleWalletLogin = async (address: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/auth/wallet-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkedWallet: address }),
      });
      
      const data = await res.json();
      if (res.ok) {
        // Since we don't have a direct wallet provider in NextAuth, 
        // in a real app we'd use a custom provider or sign a message.
        // For this demo, we'll suggest using email/pass if not already linked.
        toast('Wallet recognized. Signing in...', 'success');
        // Auto sign in with a pseudo-credential if we were implementing that, 
        // but here we just show the flow.
      } else {
        toast(data.error || 'No account linked to this wallet.', 'error');
      }
    } catch (e) {
      toast('Wallet login failed.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className={`w-full max-w-md card-elevated shadow-[0_0_50px_rgba(139,92,246,0.15)] ${errorShake ? 'animate-shake' : ''}`}>
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-fuchsia rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Wallet className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black gradient-text tracking-tighter">StakeVault</h1>
          </Link>
          <p className="text-text-secondary text-sm font-medium">Earn yield on your XLM with Soroban smart contracts</p>
        </div>

        {/* Role Toggle */}
        <div className="flex bg-background p-1 rounded-2xl mb-8 border border-border-subtle">
          <button 
            onClick={() => setRole('staker')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'staker' ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
          >
            <UserIcon size={16} /> Staker
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all ${role === 'admin' ? 'bg-accent-indigo text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
          >
            <ShieldCheck size={16} /> Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Email Address</label>
            <div className="relative">
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input-field pl-12" 
                placeholder="name@example.com"
              />
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="input-field pl-12 pr-12" 
                placeholder="••••••••"
              />
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs py-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-border-default bg-background checked:bg-primary transition-all cursor-pointer" />
              <span className="text-text-secondary group-hover:text-text-primary transition-colors">Remember me</span>
            </label>
            <Link href="#" className="text-primary font-bold hover:underline">Forgot password?</Link>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 py-4 shadow-[0_4px_20px_rgba(139,92,246,0.3)]"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : (
              <>Sign In <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="relative my-10">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border-subtle" /></div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest"><span className="bg-elevated px-4 text-text-muted font-bold">Or continue with</span></div>
        </div>

        <WalletButton onConnect={handleWalletLogin} className="w-full py-4" />

        <p className="mt-10 text-center text-sm text-text-secondary">
          Don't have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Create Account</Link>
        </p>
      </div>
    </div>
  );
}
