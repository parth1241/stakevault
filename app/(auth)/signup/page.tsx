'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Wallet, TrendingUp, Settings, ArrowRight, User, Mail, Lock, ShieldCheck, Loader2, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

export default function SignupPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'staker' | 'admin'>('staker');
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleNext = () => setStep(2);

  const getPasswordStrength = () => {
    const pw = formData.password;
    if (!pw) return 0;
    let score = 0;
    if (pw.length > 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const strengthColors = ['bg-accent-rose', 'bg-accent-amber', 'bg-yellow-400', 'bg-primary'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      toast("Passwords do not match", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          role
        }),
      });

      if (res.ok) {
        toast("Account created successfully!", "success");
        router.push('/login');
      } else {
        const data = await res.json();
        toast(data.error || "Signup failed", "error");
      }
    } catch (err) {
      toast("An error occurred during signup", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-20">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-4 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-fuchsia rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Wallet className="text-white" size={24} />
            </div>
            <h1 className="text-3xl font-black gradient-text tracking-tighter">StakeVault</h1>
          </Link>
          <h2 className="text-2xl font-bold text-text-primary">Join the Protocol</h2>
          <p className="text-text-secondary mt-2">Start earning on-chain yield in minutes</p>
        </div>

        {step === 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RoleCard 
              selected={role === 'staker'} 
              onClick={() => setRole('staker')}
              icon={TrendingUp}
              title="I want to earn yield"
              color="border-primary"
              features={[
                "Stake XLM with time locks",
                "Earn up to 12% APY",
                "Withdraw anytime (penalty applies)"
              ]}
            />
            <RoleCard 
              selected={role === 'admin'} 
              onClick={() => setRole('admin')}
              icon={Settings}
              title="I manage a staking pool"
              color="border-accent-indigo"
              features={[
                "Deploy Soroban contracts",
                "Set APY rates",
                "Monitor all stakers"
              ]}
            />
            <div className="md:col-span-2 pt-6">
              <button 
                onClick={handleNext}
                className="btn-primary w-full py-4 flex items-center justify-center gap-2 text-lg"
              >
                Continue as {role === 'staker' ? 'Staker' : 'Admin'} <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ) : (
          <div className="card-elevated max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Full Name</label>
                <div className="relative">
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                    className="input-field pl-12" 
                    placeholder="John Doe"
                  />
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                    className="input-field pl-12" 
                    placeholder="john@example.com"
                  />
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Password</label>
                  <div className="relative">
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                      className="input-field pl-12" 
                      placeholder="••••••••"
                    />
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                  </div>
                </div>

                {/* Password Strength */}
                <div className="flex gap-1.5 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${getPasswordStrength() >= i ? strengthColors[getPasswordStrength() - 1] : 'bg-high'}`} 
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted uppercase tracking-widest mb-2 block">Confirm Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                    className="input-field pl-12" 
                    placeholder="••••••••"
                  />
                  <CheckCircle2 size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="btn-secondary flex-1 py-4"
                >
                  Back
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary flex-[2] flex items-center justify-center gap-2 py-4"
                >
                  {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
                </button>
              </div>
            </form>
          </div>
        )}

        <p className="mt-10 text-center text-sm text-text-secondary">
          Already have an account? <Link href="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

function RoleCard({ selected, onClick, icon: Icon, title, features, color }: any) {
  return (
    <button 
      onClick={onClick}
      className={`card-surface flex flex-col items-start text-left p-8 transition-all border-2 relative overflow-hidden group ${selected ? `${color} shadow-[0_0_30px_rgba(139,92,246,0.1)]` : 'border-border-subtle grayscale hover:grayscale-0'}`}
    >
      <div className={`p-4 rounded-2xl bg-surface mb-6 ${selected ? 'text-primary' : 'text-text-muted'} group-hover:scale-110 transition-transform`}>
        <Icon size={32} />
      </div>
      <h3 className={`text-xl font-bold mb-6 ${selected ? 'text-text-primary' : 'text-text-secondary'}`}>{title}</h3>
      <ul className="space-y-4">
        {features.map((f: string, i: number) => (
          <li key={i} className="flex items-center gap-3 text-sm text-text-secondary">
            <CheckCircle2 size={16} className={selected ? 'text-primary' : 'text-text-muted'} />
            {f}
          </li>
        ))}
      </ul>
      {selected && <div className={`absolute top-4 right-4 w-4 h-4 rounded-full ${color.replace('border-', 'bg-')} animate-pulse`} />}
    </button>
  );
}
