'use client';

import { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import { 
  Shield, Users, TrendingUp, Activity, 
  ArrowUpRight, ChevronRight, Search 
} from 'lucide-react';
import Link from 'next/link';
import ContractStatus from '@/components/shared/ContractStatus';
import { DashboardSkeleton } from '@/components/shared/Skeleton';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    Promise.all([
      fetch('/api/positions').then(res => res.json()),
      fetch('/api/contract').then(res => res.json())
    ]).then(([posData, contractData]) => {
      setData(posData);
      setContract(contractData);
      setLoading(false);
    });
  }, []);

  if (loading) return <DashboardSkeleton />;

  const positions = data?.positions || [];
  const activeStakers = new Set(positions.map((p: any) => p?.stakerWallet)).size;
  const totalYieldDistributed = positions.reduce((acc: number, p: any) => acc + (p?.yieldEarned || 0), 0);
  const totalStaked = data?.totalStaked || 0;

  // Mock data for BarChart
  const barData = [
    { name: 'Mon', count: 12 }, { name: 'Tue', count: 19 },
    { name: 'Wed', count: 15 }, { name: 'Thu', count: 22 },
    { name: 'Fri', count: 30 }, { name: 'Sat', count: 25 },
    { name: 'Sun', count: 18 }
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Platform Administration</h1>
          <p className="text-text-secondary">Global overview of StakeVault protocol health and staker activity.</p>
        </div>
        <div className="flex gap-4">
          <Link href="/admin/contract" className="btn-secondary flex items-center gap-2 text-xs">
            <Shield size={16} /> Manage Contract
          </Link>
          <Link href="/admin/stakers" className="btn-primary flex items-center gap-2 text-xs">
            <Users size={16} /> View All Stakers
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard label="Total XLM in Contract" value={(contract?.totalStaked ?? 0).toLocaleString()} icon={Shield} color="text-accent-indigo" />
        <AdminStatCard label="Active Stakers" value={(activeStakers ?? 0).toLocaleString()} icon={Users} color="text-primary" />
        <AdminStatCard label="Yield Distributed" value={(totalYieldDistributed ?? 0).toFixed(2)} icon={TrendingUp} color="text-accent-fuchsia" />
        <AdminStatCard label="Protocol Status" value={contract?.isActive ? 'Active' : 'Paused'} icon={Activity} color="text-accent-amber" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <div className="card-surface">
              <h3 className="font-bold text-lg text-text-primary mb-8">Daily Staking Volume (7d)</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                    <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip 
                      cursor={{fill: 'rgba(139,92,246,0.05)'}}
                      contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                      itemStyle={{ color: '#6366f1' }}
                    />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {barData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#6366f1' : '#8b5cf6'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
           </div>

           <div className="card-surface overflow-hidden p-0 border-border-subtle">
              <div className="px-8 py-6 border-b border-border-subtle flex justify-between items-center bg-high/10">
                 <h3 className="font-bold text-lg text-text-primary">Recent Stakers</h3>
                 <Link href="/admin/stakers" className="text-xs font-bold text-accent-indigo hover:underline flex items-center gap-1">
                    See More <ChevronRight size={14} />
                 </Link>
              </div>
              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="bg-high/30 border-b border-border-subtle">
                          <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Wallet</th>
                          <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Amount</th>
                          <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Date</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/30">
                       {positions.slice(0, 5).map((p: any) => (
                          <tr key={p?._id} className="hover:bg-accent-indigo/5 transition-colors">
                             <td className="px-8 py-4 flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-accent-indigo/20 text-accent-indigo flex items-center justify-center font-mono text-xs font-bold ring-1 ring-accent-indigo/30">
                                   W
                                </div>
                                <span className="font-mono text-xs text-text-secondary">{p?.stakerWallet?.slice(0, 4)}...{p?.stakerWallet?.slice(-4)}</span>
                             </td>
                             <td className="px-8 py-4">
                                <span className="font-bold text-text-primary">{(p?.amountXLM ?? 0).toLocaleString()}</span>
                                <span className="text-[10px] font-mono text-text-muted ml-2">XLM</span>
                             </td>
                             <td className="px-8 py-4 text-right text-xs text-text-muted">
                                {(mounted && p?.stakedAt) ? new Date(p.stakedAt).toLocaleDateString() : 'N/A'}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <ContractStatus config={contract} className="shadow-2xl" />
           <div className="card-elevated bg-accent-indigo/5 border-accent-indigo/20">
              <h4 className="font-bold text-xs text-accent-indigo uppercase tracking-widest mb-4">Admin Notice</h4>
              <p className="text-xs text-text-secondary leading-relaxed mb-6 font-medium">
                 All activities on this dashboard are mirrored across the Soroban RPC. Contract state changes affect all participants immediately.
              </p>
              <div className="flex items-center gap-3 p-3 bg-high/50 rounded-xl border border-border-subtle">
                 <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                 <span className="text-[10px] font-mono text-text-muted">Soroban RPC Connected</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function AdminStatCard({ label, value, icon: Icon, color }: any) {
  return (
    <div className="card-surface flex flex-col justify-between group cursor-default">
       <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</span>
          <div className={color}>
             <Icon size={20} className="group-hover:scale-110 transition-transform" />
          </div>
       </div>
       <div className="text-2xl font-black text-text-primary tracking-tighter">
          {value}
       </div>
    </div>
  );
}
