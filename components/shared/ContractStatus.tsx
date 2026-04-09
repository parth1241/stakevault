'use client';

import { Shield, Users, Activity, ExternalLink, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContractConfig {
  contractId: string;
  totalStaked: number;
  totalStakers: number;
  apyRates: {
    days7: number;
    days30: number;
    days90: number;
  };
  isActive: boolean;
}

interface ContractStatusProps {
  config: ContractConfig;
  compact?: boolean;
  className?: string;
}

export default function ContractStatus({ config, compact, className }: ContractStatusProps) {
  return (
    <div className={cn("card-surface overflow-hidden", className)}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className={cn("w-2.5 h-2.5 rounded-full", config.isActive ? "bg-primary animate-pulse shadow-[0_0_10px_rgba(139,92,246,0.8)]" : "bg-accent-rose")} />
          <h4 className="font-bold text-text-primary uppercase tracking-widest text-xs">
            Contract Status: {config.isActive ? 'Active' : 'Paused'}
          </h4>
        </div>
        <a 
          href={`https://stellar.expert/explorer/testnet/contract/${config?.contractId || ''}`}
          target="_blank"
          className="text-primary hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          View on Explorer <ExternalLink size={14} />
        </a>
      </div>

      {!compact && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-background/40 rounded-2xl p-4 border border-border-subtle">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Activity size={12} /> Total TVL
            </div>
            <div className="text-xl font-bold gradient-text">
              {(config?.totalStaked || 0).toLocaleString()} XLM
            </div>
          </div>
          <div className="bg-background/40 rounded-2xl p-4 border border-border-subtle">
            <div className="flex items-center gap-2 text-text-secondary text-xs mb-1">
              <Users size={12} /> Stakers
            </div>
            <div className="text-xl font-bold text-text-primary">
              {(config?.totalStakers || 0).toLocaleString()}
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-text-muted mb-1">
          <Shield size={14} className="text-accent-indigo" /> 
          CURRENT APY RATES
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(config?.apyRates || {}).map(([key, val]) => (
            <div key={key} className="bg-high/50 border border-border-subtle rounded-xl p-2 text-center">
              <span className="text-[10px] text-text-secondary block capitalize">{key.replace('days', '')}d</span>
              <span className={cn(
                "font-bold text-sm",
                key === 'days90' ? 'text-accent-fuchsia' : key === 'days30' ? 'text-primary' : 'text-accent-indigo'
              )}>
                {((val as number || 0) * 100).toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-start gap-2 text-[10px] text-text-muted bg-primary/5 p-3 rounded-xl border border-primary/10">
        <Info size={12} className="shrink-0 mt-0.5" />
        <p>
          Managed by Soroban smart contract. Contract ID: <span className="font-mono text-primary/80">{(config?.contractId || 'N/A').slice(0, 10)}...{(config?.contractId || 'N/A').slice(-4)}</span>
        </p>
      </div>
    </div>
  );
}
