'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Layers, Search, Filter, SlidersHorizontal, Plus } from 'lucide-react';
import Link from 'next/link';
import StakeCard from '@/components/shared/StakeCard';
import { DashboardSkeleton } from '@/components/shared/Skeleton';
import { useToast } from '@/components/shared/Toast';

export const dynamic = 'force-dynamic';

export default function PositionsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  
  const [positions, setPositions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetch('/api/positions')
      .then(res => res.json())
      .then(d => {
        setPositions(d.positions || []);
        setLoading(false);
      });
  }, []);

  const handleUnstake = async (id: string) => {
    toast("Opening unstake portal...", "info");
    // In real app, this would trigger a Freighter sign
    // For now, redirect to position detail which handles it
  };

  const filtered = positions.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">My Staking Positions</h1>
          <p className="text-text-secondary">Manage and monitor your active funds on the Soroban network.</p>
        </div>
        <Link href="/staker/stake" className="btn-primary flex items-center gap-2">
          <Plus size={20} /> New Stake
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex bg-high/50 p-1 rounded-2xl border border-border-subtle w-full md:w-auto">
          {['all', 'active', 'unlocked', 'withdrawn'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filter === f ? 'bg-primary text-white shadow-lg' : 'text-text-muted hover:text-text-primary'}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full md:w-64">
           <input 
             type="text" 
             placeholder="Search by ID or amount..." 
             className="input-field py-2.5 text-xs pl-10"
           />
           <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((pos) => (
            <StakeCard key={pos._id} position={pos} onUnstake={handleUnstake} />
          ))}
        </div>
      ) : (
        <div className="card-surface py-32 flex flex-col items-center justify-center text-center">
           <Layers size={48} className="text-primary/20 mb-6" />
           <h3 className="text-xl font-bold text-text-primary mb-2">No {filter} positions found</h3>
           <p className="text-text-secondary max-w-xs">
             Try changing your filters or create a new stake position.
           </p>
        </div>
      )}
    </div>
  );
}
