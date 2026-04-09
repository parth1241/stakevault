'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, Users, TrendingUp, Activity, 
  ExternalLink, Info, Globe, Zap, Clock, Lock
} from 'lucide-react';
import Link from 'next/link';
import ContractStatus from '@/components/shared/ContractStatus';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

const mockChartData = [
  { name: 'Week 1', tvl: 1200 }, { name: 'Week 2', tvl: 2100 },
  { name: 'Week 3', tvl: 1800 }, { name: 'Week 4', tvl: 2900 },
  { name: 'Week 5', tvl: 3500 }, { name: 'Week 6', tvl: 4291 },
];

export default function PoolStatsPage({ params }: { params: { contractId: string } }) {
  const [config, setConfig] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contract')
      .then(res => res.json())
      .then(d => {
        setConfig(d);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 space-y-16">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full mb-4">
              <Globe size={14} className="text-primary" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">Public Protocol Stats</span>
           </div>
           <h1 className="text-4xl md:text-6xl font-black text-text-primary tracking-tighter mb-4">
             Soroban Staking Pool
           </h1>
           <p className="text-xl text-text-secondary max-w-2xl font-medium">
             Real-time on-chain statistics for the StakeVault decentralized yield pool. 
             Transparent, immutable, and verified by the Stellar network.
           </p>
        </div>
        <Link href="/signup" className="btn-primary px-10 py-5 text-lg shadow-[0_4px_30px_rgba(139,92,246,0.35)]">
           Join the Pool
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 space-y-10">
            {/* TVL Chart */}
            <div className="card-surface">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl text-text-primary flex items-center gap-2">
                    <TrendingUp className="text-primary" /> TVL Growth
                  </h3>
                  <div className="flex items-center gap-2 text-xs font-bold text-text-muted">
                     <span className="w-2 h-2 rounded-full bg-primary" /> 
                     Cumulative XLM Locked
                  </div>
               </div>
               <div className="h-[400px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={mockChartData}>
                       <defs>
                          <linearGradient id="poolTvl" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                             <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                       <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                       <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                       <Tooltip 
                         contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                         itemStyle={{ color: '#8b5cf6' }}
                       />
                       <Area type="monotone" dataKey="tvl" stroke="#8b5cf6" fillOpacity={1} fill="url(#poolTvl)" strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
               </div>
            </div>

            {/* Protocol Events */}
            <div className="card-surface p-0 overflow-hidden border-border-subtle">
               <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center bg-high/10">
                  <h3 className="font-bold text-xl text-text-primary">Recent Network Events</h3>
                  <span className="badge badge-indigo">Live Explorer</span>
               </div>
               <div className="divide-y divide-border-subtle/30">
                  <EventRow type="Stake" amount="500 XLM" time="2 mins ago" tx="0x4a...c23d" />
                  <EventRow type="Yield Claim" amount="12.4 XLM" time="15 mins ago" tx="0x8f...11a2" />
                  <EventRow type="Stake" amount="1,200 XLM" time="1 hour ago" tx="0x2b...99e5" />
                  <EventRow type="Withdrawal" amount="2,000 XLM" time="3 hours ago" tx="0x7d...ee04" />
                  <EventRow type="Stake" amount="50 XLM" time="5 hours ago" tx="0x5c...88fa" />
               </div>
            </div>
         </div>

         <div className="space-y-8">
            <ContractStatus config={config} className="shadow-2xl border-primary/20" />
            
            <div className="card-elevated space-y-6">
               <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-4">Security verification</h4>
               <p className="text-xs text-text-secondary leading-relaxed">
                  StakeVault uses verified Soroban smart contracts. No human has access to the principal funds once locked.
               </p>
               <div className="space-y-4">
                  <SecurityPoint icon={Shield} text="Immutable Yield Calculations" />
                  <SecurityPoint icon={Lock} text="Time-Locked Principal Assets" />
                  <SecurityPoint icon={Zap} text="Verifiable On-Chain APR" />
               </div>
            </div>

            <div className="bg-gradient-to-br from-primary/10 to-accent-fuchsia/10 rounded-3xl p-8 border border-primary/20 text-center">
               <h4 className="text-lg font-bold text-text-primary mb-2">Ready to earn?</h4>
               <p className="text-xs text-text-secondary mb-6">Start your first staking position and join our growing community.</p>
               <Link href="/signup" className="btn-primary w-full py-3 text-sm">Launch App</Link>
            </div>
         </div>
      </div>
    </div>
  );
}

function EventRow({ type, amount, time, tx }: any) {
  return (
    <div className="px-8 py-5 flex items-center justify-between group hover:bg-primary/5 transition-colors">
       <div className="flex items-center gap-4">
          <div className={`p-2 rounded-lg ${type === 'Stake' ? 'bg-primary/10 text-primary' : type === 'Withdrawal' ? 'bg-accent-indigo/10 text-accent-indigo' : 'bg-accent-fuchsia/10 text-accent-fuchsia'}`}>
             {type === 'Stake' ? <TrendingUp size={16} /> : type === 'Withdrawal' ? <Clock size={16} /> : <Zap size={16} />}
          </div>
          <div>
             <span className="text-xs font-bold text-text-primary block">{type}: {amount}</span>
             <span className="text-[10px] text-text-muted">{time}</span>
          </div>
       </div>
       <a href="#" className="p-2 text-text-muted hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
          <ExternalLink size={16} />
       </a>
    </div>
  );
}

function SecurityPoint({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3">
       <div className="w-6 h-6 rounded-full bg-high/50 flex items-center justify-center text-primary">
          <Icon size={12} />
       </div>
       <span className="text-xs font-semibold text-text-secondary">{text}</span>
    </div>
  );
}
