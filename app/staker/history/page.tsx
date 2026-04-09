'use client';

import { useState, useEffect } from 'react';
import { 
  Download, Search, Filter, History, 
  ExternalLink, TrendingUp, Wallet, Award 
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/Skeleton';
import Papa from 'papaparse';
import { useToast } from '@/components/shared/Toast';

export const dynamic = 'force-dynamic';

export default function HistoryPage() {
  const { toast } = useToast();
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/positions')
      .then(res => res.json())
      .then(d => {
        setPositions(d.positions);
        setLoading(false);
      });
  }, []);

  const history = positions.filter(p => p.status !== 'active');
  const filteredHistory = history.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  const exportCSV = () => {
    const data = filteredHistory.map(p => ({
      ID: p._id,
      Amount_XLM: p.amountXLM,
      Lock_Period: `${p.lockPeriodDays} Days`,
      APY: `${(p.apyRate * 100).toFixed(0)}%`,
      Staked_At: new Date(p.stakedAt).toLocaleString(),
      Unlocks_At: new Date(p.unlocksAt).toLocaleString(),
      Status: p.status,
      Yield_Earned: p.yieldEarned?.toFixed(4) || '0',
      Stake_TX: p.txHashStake,
      Unstake_TX: p.txHashUnstake || 'N/A'
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stakevault_history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("History exported to CSV", "success");
  };

  if (loading) return <DashboardSkeleton />;

  const totalEverStaked = history.reduce((acc, p) => acc + p.amountXLM, 0);
  const totalYieldEarned = history.reduce((acc, p) => acc + (p.yieldEarned || 0), 0);
  const avgAPY = history.length > 0 ? (history.reduce((acc, p) => acc + p.apyRate, 0) / history.length) * 100 : 0;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Transaction History</h1>
          <p className="text-text-secondary">View and export your completed staking activity.</p>
        </div>
        <button 
          onClick={exportCSV}
          disabled={filteredHistory.length === 0}
          className="btn-secondary flex items-center gap-2 group"
        >
          <Download size={20} className="group-hover:translate-y-0.5 transition-transform" /> Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <StatsCard label="Total XLM Ever Staked" value={totalEverStaked.toLocaleString()} icon={Wallet} color="text-primary" />
         <StatsCard label="Total Yield Earned" value={totalYieldEarned.toFixed(4)} icon={TrendingUp} color="text-accent-fuchsia" />
         <StatsCard label="Average APY Rate" value={`${avgAPY.toFixed(1)}%`} icon={Award} color="text-accent-indigo" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-high/50 p-1 rounded-2xl border border-border-subtle">
           {['all', 'withdrawn', 'emergency_withdrawn'].map((f) => (
             <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? 'bg-primary text-white' : 'text-text-muted hover:text-text-primary'}`}
             >
                {f === 'emergency_withdrawn' ? 'Emergency' : f === 'withdrawn' ? 'Completed' : 'All'}
             </button>
           ))}
        </div>
        <div className="relative w-full md:w-64">
           <input type="text" placeholder="Search history..." className="input-field py-2.5 text-xs pl-10" />
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      <div className="card-surface overflow-hidden border-border-subtle p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-high/50 border-b border-border-subtle">
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Period</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">APY</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Yield Earned</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Transaction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle/30">
              {filteredHistory.map((p) => (
                <tr key={p._id} className="hover:bg-primary/5 transition-colors group">
                  <td className="px-6 py-5">
                    <span className="font-bold text-text-primary">{p.amountXLM.toLocaleString()}</span>
                    <span className="text-[10px] font-mono text-text-muted ml-2">XLM</span>
                  </td>
                  <td className="px-6 py-5 text-sm text-text-secondary">{p.lockPeriodDays} Days</td>
                  <td className="px-6 py-5">
                    <span className="badge badge-violet">{(p.apyRate * 100).toFixed(0)}%</span>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-accent-fuchsia">
                    +{p.yieldEarned?.toFixed(4) || '0.0000'}
                  </td>
                  <td className="px-6 py-5">
                    <span className={`badge ${p.status === 'withdrawn' ? 'badge-indigo' : 'badge-rose'}`}>
                      {p.status === 'withdrawn' ? 'Completed' : 'Emergency'}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <a 
                      href={`https://stellar.expert/explorer/testnet/tx/${p.txHashUnstake || p.txHashStake}`}
                      target="_blank"
                      className="inline-flex items-center gap-2 p-2 rounded-lg bg-high hover:bg-primary hover:text-white transition-all text-text-muted"
                    >
                       <span className="text-[10px] font-mono">0x...{p.txHashStake.slice(-4)}</span>
                       <ExternalLink size={14} />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredHistory.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center">
             <History size={48} className="text-text-muted/20 mb-4" />
             <p className="text-text-secondary font-medium">No archived transactions found.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function StatsCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card-elevated flex items-center gap-6">
       <div className={`p-4 rounded-2xl bg-surface ${color} border border-border-subtle shadow-inner`}>
          <Icon size={24} />
       </div>
       <div>
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-1">{label}</p>
          <p className="text-2xl font-black text-text-primary tracking-tighter">{value}</p>
       </div>
    </div>
  );
}
