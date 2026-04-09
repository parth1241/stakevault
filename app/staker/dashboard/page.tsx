'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Plus, TrendingUp, Wallet, Clock, 
  ArrowUpRight, AlertCircle, ChevronRight 
} from 'lucide-react';
import Link from 'next/link';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';
import StakeCard from '@/components/shared/StakeCard';
import YieldCalculator from '@/components/shared/YieldCalculator';
import { DashboardSkeleton } from '@/components/shared/Skeleton';

export const dynamic = 'force-dynamic';

export default function StakerDashboard() {
  const { data: session } = useSession();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('/api/positions')
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, []);

  if (loading) return <DashboardSkeleton />;

  const positions = data?.positions || [];
  const totalStaked = data?.totalStaked || 0;
  const totalYield = data?.totalYield || 0;

  const activePositions = positions.filter((p: any) => p.status === 'active');
  const nextUnlock = activePositions.length > 0 
    ? new Date(Math.min(...activePositions.map((p: any) => new Date(p.unlocksAt).getTime()))) 
    : null;

  // Mock data for chart
  const chartData = [
    { day: '01', yield: 12 }, { day: '05', yield: 18 }, { day: '10', yield: 25 },
    { day: '15', yield: 32 }, { day: '20', yield: 45 }, { day: '25', yield: 58 },
    { day: '30', yield: totalYield }
  ];

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Portfolio Overview</h1>
          <p className="text-text-secondary">Welcome back, {session?.user?.name}. Here's your staking performance.</p>
        </div>
        <Link href="/staker/stake" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> Stake More XLM
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <SummaryCard 
          label="Total Staked XLM" 
          value={totalStaked.toLocaleString()} 
          icon={Wallet} 
          color="text-primary" 
          bgColor="bg-primary/10" 
        />
        <SummaryCard 
          label="Total Yield Earned" 
          value={`${totalYield.toFixed(4)} XLM`} 
          icon={TrendingUp} 
          color="text-accent-fuchsia" 
          bgColor="bg-accent-fuchsia/10" 
        />
        <SummaryCard 
          label="Active Positions" 
          value={activePositions.length.toString()} 
          icon={Clock} 
          color="text-accent-indigo" 
          bgColor="bg-accent-indigo/10" 
        />
        <SummaryCard 
          label="Next Unlock" 
          value={(mounted && nextUnlock) ? nextUnlock.toLocaleDateString() : 'N/A'} 
          icon={Clock} 
          color="text-accent-cyan" 
          bgColor="bg-accent-cyan/10" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Yield Performance Chart */}
        <div className="lg:col-span-2 card-surface">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-lg text-text-primary">Cumulative Yield (30d)</h3>
            <div className="flex gap-2">
              <span className="badge badge-violet">Live Updates</span>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorYield" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                <XAxis dataKey="day" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}X`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                  itemStyle={{ color: '#8b5cf6' }}
                />
                <Area type="monotone" dataKey="yield" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorYield)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="card-elevated bg-primary/5 border-primary/20">
            <h4 className="font-bold text-sm text-primary uppercase tracking-widest mb-4">Quick Action</h4>
            <p className="text-xs text-text-secondary mb-6 leading-relaxed">
              New to staking? Use our calculator to see how much you can earn based on current APY rates.
            </p>
            <Link href="/staker/stake" className="btn-secondary w-full py-3 text-xs flex items-center justify-center gap-2">
              New Stake Wizard <ArrowUpRight size={14} />
            </Link>
          </div>
          <YieldCalculator className="p-4" />
        </div>
      </div>

      {/* Active Positions */}
      <div>
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-bold text-text-primary">Active Positions</h3>
          <Link href="/staker/positions" className="text-primary font-bold text-sm hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        {activePositions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activePositions.slice(0, 3).map((pos: any) => (
              <StakeCard key={pos._id} position={pos} />
            ))}
          </div>
        ) : (
          <div className="card-surface flex flex-col items-center justify-center py-20 text-center border-dashed border-2">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-bob1">
               <TrendingUp size={32} />
            </div>
            <h4 className="text-xl font-bold text-text-primary mb-2">No active stakes</h4>
            <p className="text-text-secondary max-w-sm mb-8">
              Start earning yield on your XLM by opening your first staking position today.
            </p>
            <Link href="/staker/stake" className="btn-primary px-10">
              Stake Your First XLM
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color, bgColor }: any) {
  return (
    <div className="card-surface border-border-subtle hover:border-border-default h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-text-secondary uppercase tracking-widest">{label}</span>
        <div className={`p-2 rounded-lg ${bgColor} ${color}`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="text-2xl font-black text-text-primary tracking-tight">
        {value}
      </div>
    </div>
  );
}
