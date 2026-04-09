'use client';

import { useState, useEffect } from 'react';
import { useYieldCalculator } from '@/hooks/useYieldCalculator';
import { Calculator, Zap, Calendar, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface YieldCalculatorProps {
  defaultAmount?: number;
  defaultDays?: number;
  className?: string;
  onStake?: (amount: number, days: number) => void;
}

export default function YieldCalculator({ defaultAmount = 1000, defaultDays = 30, className, onStake }: YieldCalculatorProps) {
  const [mounted, setMounted] = useState(false);
  const [amount, setAmount] = useState(defaultAmount);
  const [days, setDays] = useState(defaultDays);

  useEffect(() => {
    setMounted(true);
  }, []);
  const apyRates = {
    7: 0.03,
    30: 0.07,
    90: 0.12,
  };

  const { projectedYield, dailyYield, totalReturn } = useYieldCalculator({
    amountXLM: amount,
    lockPeriodDays: days,
    apyRate: apyRates[days as keyof typeof apyRates] || 0.03,
  });

  return (
    <div className={cn("card-surface max-w-xl mx-auto", className)}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-primary/20 rounded-lg text-primary">
          <Calculator size={24} />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-primary">Yield Calculator</h3>
          <p className="text-text-secondary text-sm">Estimate your rewards on-chain</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-semibold text-text-secondary mb-2 block">Amount to Stake (XLM)</label>
          <div className="relative">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="input-field pl-10"
              placeholder="1000"
            />
            <Zap size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-primary" />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-text-secondary mb-2 block">Lock Period</label>
          <div className="grid grid-cols-3 gap-3">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={cn(
                  "py-3 rounded-xl border transition-all font-bold text-sm",
                  days === d 
                    ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_rgba(139,92,246,0.2)]" 
                    : "bg-background border-border-default text-text-secondary hover:border-primary/50"
                )}
              >
                {d} Days
                <span className="block text-[10px] opacity-70">
                  {(apyRates[d as keyof typeof apyRates] * 100).toFixed(0)}% APY
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-background rounded-2xl p-4 border border-border-subtle">
            <span className="text-xs text-text-secondary block mb-1">Projected Yield</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-accent-fuchsia">{projectedYield}</span>
              <span className="text-xs text-text-muted font-mono">XLM</span>
            </div>
          </div>
          <div className="bg-background rounded-2xl p-4 border border-border-subtle">
            <span className="text-xs text-text-secondary block mb-1">Daily Earnings</span>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-accent-indigo">{dailyYield}</span>
              <span className="text-xs text-text-muted font-mono">XLM</span>
            </div>
          </div>
        </div>

        <div className="bg-primary/10 rounded-2xl p-4 border border-primary/20 flex justify-between items-center">
          <div>
            <span className="text-xs text-primary font-semibold uppercase tracking-wider block">Total Return</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-text-primary">{totalReturn.toLocaleString()}</span>
              <span className="text-xs text-text-secondary font-mono">XLM</span>
            </div>
          </div>
          <div className="text-right">
             <Calendar size={16} className="text-primary ml-auto mb-1" />
             <span className="text-[10px] text-text-muted block">Estimated Unlock</span>
             <span className="text-xs font-bold text-text-secondary">
               {mounted ? new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString() : '...'}
             </span>
          </div>
        </div>

        {onStake && (
          <button 
            onClick={() => onStake(amount, days)}
            className="btn-primary w-full flex items-center justify-center gap-2 group"
          >
            Start Staking <TrendingUp size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
          </button>
        )}
      </div>
    </div>
  );
}
