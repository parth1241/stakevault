'use client';

import { useState, useEffect } from 'react';
import { 
  Shield, Settings, AlertTriangle, Save, 
  RotateCcw, ShieldAlert, Cpu, Network,
  Lock, Zap, Users, Wallet, Loader2
} from 'lucide-react';
import ContractStatus from '@/components/shared/ContractStatus';
import { useToast } from '@/components/shared/Toast';
import { DashboardSkeleton } from '@/components/shared/Skeleton';

export const dynamic = 'force-dynamic';

interface ApyRates {
  days7: number;
  days30: number;
  days90: number;
}

interface ContractConfig {
  apyRates: ApyRates;
  minStake: number;
  maxStake: number;
  isActive: boolean;
  contractId: string;
  adminWallet: string;
  deployedAt: string;
  lastUpdated?: string;
  totalStaked: number;
  totalStakers: number;
}

export default function ContractManagementPage() {
  const { toast } = useToast();
  const [config, setConfig] = useState<ContractConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Local state for editing
  const [apyRates, setApyRates] = useState<ApyRates>({ days7: 0, days30: 0, days90: 0 });
  const [limits, setLimits] = useState({ minStake: 0, maxStake: 0 });
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetch('/api/contract')
      .then(res => res.json())
      .then(d => {
        setConfig(d);
        setApyRates(d.apyRates);
        setLimits({ minStake: d.minStake, maxStake: d.maxStake });
        setIsActive(d.isActive);
        setLoading(false);
      });
  }, []);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/contract/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apyRates, minStake: limits.minStake, maxStake: limits.maxStake, isActive }),
      });
      
      if (res.ok) {
        toast("Contract configuration updated successfully", "success");
        const updated = await res.json();
        setConfig(updated);
      } else {
        toast("Failed to update contract", "error");
      }
    } catch (err) {
      toast("An error occurred", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !config) return <DashboardSkeleton />;

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Contract Management</h1>
          <p className="text-text-secondary">Update smart contract parameters and manage platform operational state.</p>
        </div>
        <button 
          onClick={handleUpdate}
          disabled={saving}
          className="btn-primary flex items-center gap-2"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />} 
          Save Contract Configuration
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-10">
           {/* APY Editor */}
           <div className="card-surface space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                    <Zap className="text-primary" size={20} /> APY Rate Configuration
                 </h3>
                 <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-full font-black uppercase">On-Chain</span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <ApyInput label="7 Days" val={apyRates.days7} onChange={(v: number) => setApyRates({...apyRates, days7: v})} color="border-accent-indigo" />
                 <ApyInput label="30 Days" val={apyRates.days30} onChange={(v: number) => setApyRates({...apyRates, days30: v})} color="border-primary" />
                 <ApyInput label="90 Days" val={apyRates.days90} onChange={(v: number) => setApyRates({...apyRates, days90: v})} color="border-accent-fuchsia" />
              </div>

              <div className="bg-high/50 p-4 rounded-xl flex gap-3 text-xs text-text-muted leading-relaxed border border-border-subtle">
                 <AlertTriangle size={18} className="text-accent-amber shrink-0" />
                 <span>Warning: Changes to APY rates only affect <strong>new stakes</strong> created after the smart contract update is confirmed.</span>
              </div>
           </div>

           {/* Limits Editor */}
           <div className="card-surface space-y-8">
              <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
                 <Lock className="text-accent-indigo" size={20} /> Stake Limits
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">Minimum Stake (XLM)</label>
                    <input 
                      type="number" 
                      value={limits.minStake}
                      onChange={(e) => setLimits({...limits, minStake: Number(e.target.value)})}
                      className="input-field text-xl font-bold"
                    />
                 </div>
                 <div className="space-y-4">
                    <label className="text-xs font-bold text-text-muted uppercase tracking-widest block">Maximum Stake (XLM)</label>
                    <input 
                      type="number" 
                      value={limits.maxStake}
                      onChange={(e) => setLimits({...limits, maxStake: Number(e.target.value)})}
                      className="input-field text-xl font-bold"
                    />
                 </div>
              </div>
           </div>

           {/* Operational Control */}
           <div className="card-surface border-accent-rose/20">
              <div className="flex items-center justify-between mb-8">
                 <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Operational State</h3>
                    <p className="text-xs text-text-secondary">Emergency pause or resume the staking protocol.</p>
                 </div>
                 <button 
                   onClick={() => setIsActive(!isActive)}
                   className={`px-8 py-3 rounded-xl font-black text-xs transition-all ${isActive ? 'bg-accent-rose/10 border border-accent-rose/30 text-accent-rose hover:bg-accent-rose hover:text-white' : 'bg-primary/20 border border-primary/30 text-primary hover:bg-primary hover:text-white'}`}
                 >
                   {isActive ? 'PAUSE PROTOCOL' : 'RESUME PROTOCOL'}
                 </button>
              </div>

              {!isActive && (
                <div className="bg-accent-rose/10 p-6 rounded-2xl border border-accent-rose/40 animate-pulse">
                   <div className="flex items-center gap-3 text-accent-rose mb-2 font-black text-sm">
                      <ShieldAlert size={20} /> PROTOCOL PAUSED
                   </div>
                   <p className="text-xs text-rose-400 font-medium leading-relaxed">
                      While paused, users cannot create new staking positions. Existing positions can still be withdrawn at maturity or via emergency exit.
                   </p>
                </div>
              )}
           </div>
        </div>

        <div className="space-y-8">
           <ContractStatus config={config} className="shadow-2xl border-primary/30" />
           
           <div className="card-elevated space-y-6">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em] mb-4">Metadata</h4>
              
              <div className="space-y-4">
                 <MetadataItem icon={Cpu} label="Engine" value="Soroban v21.0.0" />
                 <MetadataItem icon={Network} label="Network" value="Testnet (SDF)" />
                 <MetadataItem icon={Lock} label="Contract ID" value={config.contractId} isMono />
                 <MetadataItem icon={Wallet} label="Admin Wallet" value={config.adminWallet} isMono />
                 <MetadataItem icon={RotateCcw} label="Last Rotated" value={(mounted && (config?.lastUpdated || config?.deployedAt)) ? new Date(config.lastUpdated || config.deployedAt).toLocaleString() : 'N/A'} />
              </div>
           </div>

           <div className="p-6 bg-high/30 rounded-3xl border border-dashed border-border-subtle flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-accent-amber/10 rounded-full flex items-center justify-center text-accent-amber mb-4">
                 <RotateCcw size={24} />
              </div>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Resetting configuration will revert all parameters to values stored on the smart contract's initial block.
              </p>
              <button className="mt-4 text-[10px] font-bold text-accent-amber border border-accent-amber/30 px-4 py-2 rounded-lg hover:bg-accent-amber hover:text-white transition-all uppercase">
                 Reset Config
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}

function ApyInput({ label, val, onChange, color }: any) {
  return (
    <div className={`bg-background/50 rounded-2xl p-5 border-2 ${color}`}>
       <label className="text-[10px] font-black text-text-muted uppercase tracking-widest block mb-4">{label} APY</label>
       <div className="flex items-center gap-3">
          <input 
            type="number" 
            step="0.01"
            value={(val * 100).toFixed(1)}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="bg-transparent border-none text-3xl font-black text-text-primary p-0 w-full focus:ring-0"
          />
          <span className="text-2xl font-black text-text-muted">%</span>
       </div>
    </div>
  );
}

function MetadataItem({ icon: Icon, label, value, isMono }: any) {
  return (
    <div className="flex flex-col gap-1">
       <div className="flex items-center gap-2 text-text-muted">
          <Icon size={12} />
          <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
       </div>
       <p className={`text-xs font-semibold break-all ${isMono ? 'font-mono text-[10px] opacity-70' : 'text-text-secondary'}`}>
          {value}
       </p>
    </div>
  );
}
