'use client';

import { useState, useEffect } from 'react';
import { 
  Users, Search, Download, ExternalLink, 
  ChevronDown, ChevronUp, Wallet, Award 
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/Skeleton';
import Papa from 'papaparse';
import { useToast } from '@/components/shared/Toast';

export const dynamic = 'force-dynamic';

export default function AdminStakersPage() {
  const { toast } = useToast();
  const [stakers, setStakers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState('');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    fetch('/api/admin/stakers')
      .then(res => res.json())
      .then(d => {
        setStakers(d.stakers);
        setLoading(false);
      });
  }, []);

  const filtered = stakers.filter(s => 
    s.user.name.toLowerCase().includes(search.toLowerCase()) || 
    s.user.linkedWallet?.toLowerCase().includes(search.toLowerCase())
  );

  const exportCSV = () => {
    const data = stakers.map(s => ({
      Name: s?.user?.name || 'Unknown',
      Email: s?.user?.email || 'N/A',
      Wallet: s?.user?.linkedWallet || 'N/A',
      Position_Count: s?.positionCount || 0,
      Total_Staked: s?.totalStaked || 0,
      Total_Earned: s?.totalEarned || 0,
      Joined: (mounted && s?.user?.createdAt) ? new Date(s.user.createdAt).toLocaleDateString() : 'N/A'
    }));

    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'stakevault_stakers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast("Stakers list exported", "success");
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Registered Stakers</h1>
          <p className="text-text-secondary">Directory of all users currently or previously staking on the protocol.</p>
        </div>
        <button 
          onClick={exportCSV}
          className="btn-secondary flex items-center gap-2"
        >
          <Download size={20} /> Export CSV
        </button>
      </div>

      <div className="relative">
         <input 
           type="text" 
           value={search}
           onChange={(e) => setSearch(e.target.value)}
           placeholder="Search stakers by name or wallet address..." 
           className="input-field py-4 pl-12 text-sm"
         />
         <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      </div>

      <div className="card-surface p-0 overflow-hidden border-border-subtle">
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-high/50 border-b border-border-subtle">
                     <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Staker</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-center">Positions</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Total Staked</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest">Yield Paid</th>
                     <th className="px-8 py-4 text-[10px] font-bold text-text-muted uppercase tracking-widest text-right">Actions</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/30">
                  {filtered.map((s) => (
                     <>
                        <tr 
                          key={s.user.id} 
                          className={`hover:bg-primary/5 transition-colors cursor-pointer ${expandedRow === s.user.id ? 'bg-primary/5' : ''}`}
                          onClick={() => setExpandedRow(expandedRow === s.user.id ? null : s.user.id)}
                        >
                           <td className="px-8 py-6">
                              <div className="flex items-center gap-4">
                                 <div 
                                   className="w-10 h-10 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                                   style={{ backgroundColor: s.user.avatarColor || '#8b5cf6' }}
                                 >
                                    {s?.user?.name ? s.user.name[0] : '?'}
                                 </div>
                                 <div className="flex flex-col">
                                    <span className="font-bold text-text-primary text-sm">{s?.user?.name || 'Unknown'}</span>
                                    <span className="text-[10px] font-mono text-text-muted truncate max-w-[120px]">{s?.user?.linkedWallet || 'No wallet linked'}</span>
                                 </div>
                              </div>
                           </td>
                           <td className="px-8 py-6 text-center">
                               <span className="badge badge-indigo">{s?.positionCount || 0}</span>
                           </td>
                           <td className="px-8 py-6">
                               <span className="font-bold text-text-primary">{(s?.totalStaked || 0).toLocaleString()}</span>
                               <span className="text-[10px] font-mono text-text-muted ml-2">XLM</span>
                           </td>
                           <td className="px-8 py-6">
                               <span className="font-bold text-accent-fuchsia">+{(s?.totalEarned || 0).toFixed(2)}</span>
                               <span className="text-[10px] font-mono text-text-muted ml-2">XLM</span>
                           </td>
                           <td className="px-8 py-6 text-right">
                              <div className="flex items-center justify-end gap-2">
                                 {s.user.linkedWallet && (
                                    <a 
                                      href={`https://stellar.expert/explorer/testnet/account/${s.user.linkedWallet}`}
                                      target="_blank"
                                      onClick={(e) => e.stopPropagation()}
                                      className="p-2 bg-high rounded-lg text-text-muted hover:text-primary transition-colors"
                                    >
                                       <ExternalLink size={16} />
                                    </a>
                                 )}
                                 <div className="p-2 text-text-muted">
                                    {expandedRow === s.user.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                 </div>
                              </div>
                           </td>
                        </tr>
                        {expandedRow === s.user.id && (
                           <tr className="bg-primary/5 border-b border-primary/10">
                              <td colSpan={5} className="px-16 py-8">
                                 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-4">
                                       <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Account Details</h4>
                                       <DetailItem label="Email Address" value={s.user.email} />
                                       <DetailItem label="Joined Protocol" value={(mounted && s.user.createdAt) ? new Date(s.user.createdAt).toLocaleDateString() : 'N/A'} />
                                       <DetailItem label="Account Type" value="Active Staker" />
                                    </div>
                                    <div className="space-y-4">
                                       <h4 className="text-[10px] font-black text-accent-fuchsia uppercase tracking-widest">Financial Summary</h4>
                                       <DetailItem label="Avg Stake Size" value={`${((s?.totalStaked || 0) / (s?.positionCount || 1)).toFixed(0)} XLM`} />
                                       <DetailItem label="Total Earnings" value={`${(s?.totalEarned || 0).toFixed(4)} XLM`} />
                                       <DetailItem label="Retention Rank" value="Elite Staker" />
                                    </div>
                                    <div className="flex flex-col justify-center gap-3">
                                       <button className="btn-secondary py-2.5 text-xs w-full">Message Staker</button>
                                       <button className="btn-secondary py-2.5 text-xs w-full text-accent-rose border-accent-rose/30 hover:bg-accent-rose/10">Flag Account</button>
                                    </div>
                                 </div>
                              </td>
                           </tr>
                        )}
                     </>
                  ))}
               </tbody>
            </table>
         </div>
         {filtered.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center">
               <Users size={48} className="text-text-muted/20 mb-4" />
               <p className="text-text-secondary font-medium">No stakers matching your search.</p>
            </div>
         )}
      </div>
    </div>
  );
}

function DetailItem({ label, value }: any) {
  return (
    <div>
       <span className="text-[10px] text-text-muted block mb-0.5">{label}</span>
       <span className="text-sm font-bold text-text-primary">{value}</span>
    </div>
  );
}
