'use client';

import { useState, useEffect } from 'react';
import { Clock, TrendingUp, Lock, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

interface StakePosition {
  _id: string;
  amountXLM: number;
  lockPeriodDays: number;
  apyRate: number;
  stakedAt: string;
  unlocksAt: string;
  status: 'active' | 'unlocked' | 'withdrawn' | 'emergency_withdrawn';
  yieldEarned?: number;
  currentYield?: number;
}

interface StakeCardProps {
  position: StakePosition;
  onClaim?: (id: string) => void;
  onUnstake?: (id: string) => void;
}

export default function StakeCard({ position, onClaim, onUnstake }: StakeCardProps) {
  const [displayYield, setDisplayYield] = useState(position.currentYield || 0);

  useEffect(() => {
    if (position.status === 'active') {
      const interval = setInterval(() => {
        // Simple tick animation for show
        setDisplayYield(prev => prev + 0.0001);
      }, 60000);
      return () => clearInterval(interval);
    }
  }, [position.status]);

  const isLocked = new Date(position.unlocksAt) > new Date();
  const progress = Math.min(100, Math.max(0, 
    ((new Date().getTime() - new Date(position.stakedAt).getTime()) / 
    (new Date(position.unlocksAt).getTime() - new Date(position.stakedAt).getTime())) * 100
  ));

  const statusColor = {
    active: 'bg-violet-500',
    unlocked: 'bg-fuchsia-500',
    withdrawn: 'bg-slate-500',
    emergency_withdrawn: 'bg-rose-500',
  }[position.status];

  const apyColor = position.lockPeriodDays === 90 ? 'text-accent-fuchsia' : position.lockPeriodDays === 30 ? 'text-primary' : 'text-accent-indigo';

  return (
    <div className="card-surface card-hover relative group flex flex-col h-full">
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${statusColor}`} />
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-text-secondary text-xs uppercase tracking-wider font-semibold">
            {position.lockPeriodDays} Day Lock
          </span>
          <h3 className="text-2xl font-bold gradient-text mt-1">
            {position.amountXLM.toLocaleString()} XLM
          </h3>
        </div>
        <div className={`badge bg-background border border-border-default ${apyColor}`}>
          {(position.apyRate * 100).toFixed(0)}% APY
        </div>
      </div>

      <div className="space-y-4 flex-grow">
        <div>
          <div className="flex justify-between text-xs text-text-secondary mb-1.5">
            <span>Staking Progress</span>
            <span>{Math.floor(progress)}%</span>
          </div>
          <div className="w-full h-1.5 bg-background rounded-full overflow-hidden">
            <div 
              className="h-full progress-bar-fill transition-all duration-1000" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background/50 rounded-xl p-3">
            <span className="text-[10px] text-text-secondary block mb-1">Yield Earned</span>
            <div className="flex items-center gap-1.5">
              <TrendingUp size={14} className="text-accent-fuchsia" />
              <span className="font-mono text-sm font-bold text-text-primary animate-yieldTick">
                {(position.status === 'withdrawn' ? position.yieldEarned : displayYield)?.toFixed(4)} XLM
              </span>
            </div>
          </div>
          <div className="bg-background/50 rounded-xl p-3">
            <span className="text-[10px] text-text-secondary block mb-1">Unlocks In</span>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-primary" />
              <span className="text-sm font-bold text-text-primary">
                {isLocked ? formatDistanceToNow(new Date(position.unlocksAt)) : 'READY'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-2">
        <Link 
          href={`/staker/positions/${position._id}`}
          className="btn-secondary py-2 px-4 text-xs flex-1 flex items-center justify-center gap-2"
        >
          Details <ArrowUpRight size={14} />
        </Link>
        {position.status === 'active' && !isLocked && (
          <button 
            onClick={() => onUnstake?.(position._id)}
            className="btn-primary py-2 px-4 text-xs flex-1"
          >
            Withdraw All
          </button>
        )}
      </div>
    </div>
  );
}
