'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface PositionTrackerProps {
  position: {
    stakedAt: string;
    unlocksAt: string;
    status: string;
    amountXLM: number;
    apyRate: number;
  };
}

export default function PositionTracker({ position }: PositionTrackerProps) {
  const [timeLeft, setTimeLeft] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const start = new Date(position.stakedAt).getTime();
      const end = new Date(position.unlocksAt).getTime();
      const now = new Date().getTime();

      const total = end - start;
      const elapsed = now - start;
      const calculatedProgress = Math.min(100, Math.max(0, (elapsed / total) * 100));
      
      setProgress(calculatedProgress);

      if (now >= end) {
        setTimeLeft('UNLOCKED');
      } else {
        const diff = end - now;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${mins}m ${secs}s`);
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [position.stakedAt, position.unlocksAt]);

  const steps = [
    { label: 'Staked', completed: true, icon: Check, color: 'text-violet-500' },
    { label: 'Locking', completed: progress > 0, icon: Clock, color: 'text-primary' },
    { label: 'Maturity', completed: progress >= 100, icon: TrendingUp, color: 'text-accent-fuchsia' },
    { label: 'Withdrawn', completed: position.status === 'withdrawn', icon: Check, color: 'text-text-secondary' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-elevated rounded-3xl p-6 border border-border-default">
        <div>
          <span className="text-sm text-text-secondary block mb-1">Status</span>
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${progress >= 100 ? 'bg-accent-fuchsia animate-pulse' : 'bg-primary animate-pulse'}`} />
            <span className="font-bold text-text-primary capitalize">{position.status}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm text-text-secondary block mb-1">Time Remaining</span>
          <span className="text-xl font-mono font-bold text-primary">{timeLeft}</span>
        </div>
      </div>

      <div className="relative">
        {/* Timeline Line */}
        <div className="absolute top-5 left-0 w-full h-1 bg-background rounded-full overflow-hidden">
          <div 
            className="h-full progress-bar-fill transition-all duration-1000" 
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex justify-between">
          {steps.map((step, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 
                ${step.completed ? 'bg-high border-2 border-primary shadow-[0_0_15px_rgba(139,92,246,0.5)]' : 'bg-background border border-border-default'}`}>
                <step.icon size={20} className={step.completed ? step.color : 'text-text-muted'} />
              </div>
              <span className={`text-[10px] font-bold mt-2 uppercase tracking-tighter ${step.completed ? 'text-text-primary' : 'text-text-muted'}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {progress < 100 && (
        <div className="bg-accent-rose/10 border border-accent-rose/20 rounded-2xl p-4 flex items-start gap-3">
          <AlertCircle className="text-accent-rose mt-0.5" size={18} />
          <div>
            <p className="text-xs font-bold text-accent-rose uppercase tracking-wider mb-1">Withdrawal Warning</p>
            <p className="text-xs text-text-secondary leading-relaxed">
              Your funds are currently locked in the Soroban smart contract. 
              Withdrawing before maturity will incur a <strong className="text-accent-rose">10% penalty</strong> on your principal.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
