'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, Shield, TrendingUp, AlertCircle, 
  ExternalLink, Loader2, CheckCircle2, X
} from 'lucide-react';
import Link from 'next/link';
import PositionTracker from '@/components/shared/PositionTracker';
import { useToast } from '@/components/shared/Toast';
import Confetti from '@/components/shared/Confetti';
import { unstakeXLM, claimYield, emergencyWithdraw } from '@/lib/soroban';
import { signTransaction } from '@stellar/freighter-api';

export const dynamic = 'force-dynamic';

export default function PositionDetailPage({ params }: { params: { positionId: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [position, setPosition] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    fetch(`/api/stake/${params.positionId}`)
      .then(res => res.json())
      .then(data => {
        setPosition(data);
        setLoading(false);
      });
  }, [params.positionId]);

  const handleClaim = async () => {
    setActionLoading(true);
    try {
      // In a real app, sign via Freighter
      await claimYield(position.stakerWallet, 123); // Stub ID
      
      const res = await fetch(`/api/stake/${params.positionId}/claim-yield`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: 'simulated_hash' }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setShowConfetti(true);
        toast(`Claimed ${data.yieldClaimed} XLM successfully!`, "success");
        // Refresh data
        const updatedRes = await fetch(`/api/stake/${params.positionId}`);
        const updatedData = await updatedRes.json();
        setPosition(updatedData);
      }
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setActionLoading(false);
      setTimeout(() => setShowConfetti(false), 5000);
    }
  };

  const handleUnstake = async () => {
    setActionLoading(true);
    try {
      await unstakeXLM(position.stakerWallet, 123);
      
      const res = await fetch(`/api/stake/${params.positionId}/unstake`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: 'simulated_hash' }),
      });

      if (res.ok) {
        setShowConfetti(true);
        toast("Funds and yield withdrawn to your wallet!", "success");
        setTimeout(() => router.push('/staker/history'), 3000);
      }
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEmergency = async () => {
    if (confirmText !== 'CONFIRM') return;
    setActionLoading(true);
    try {
      await emergencyWithdraw(position.stakerWallet, 123);
      
      const res = await fetch(`/api/stake/${params.positionId}/emergency`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ txHash: 'simulated_hash' }),
      });

      if (res.ok) {
        toast("Emergency withdrawal successful. Penalty applied.", "success");
        router.push('/staker/history');
      }
    } catch (err: any) {
      toast(err.message, "error");
    } finally {
      setActionLoading(false);
      setShowEmergencyModal(false);
    }
  };

  if (loading) return null; // Root loading handles this

  const isUnlocked = new Date(position.unlocksAt) <= new Date();

  return (
    <div className="max-w-5xl mx-auto py-10">
      <Confetti active={showConfetti} />
      
      <Link href="/staker/positions" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors text-sm font-bold mb-8">
        <ArrowLeft size={16} /> Back to Positions
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
           <div className="card-surface p-8">
              <div className="flex justify-between items-start mb-8">
                 <div>
                    <h1 className="text-4xl font-black gradient-text tracking-tighter mb-2">
                      {(position?.amountXLM ?? 0).toLocaleString()} XLM
                    </h1>
                    <div className="flex items-center gap-3">
                       <span className="badge badge-indigo">{(position?.lockPeriodDays ?? 0)} Day Lock</span>
                       <span className="text-text-muted text-xs font-mono">ID: {position?._id || 'N/A'}</span>
                    </div>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-text-muted font-bold uppercase tracking-widest block mb-1">Status</span>
                    <span className={`badge ${position?.status === 'active' ? 'badge-violet' : 'badge-fuchsia'}`}>
                      {position?.status || 'unknown'}
                    </span>
                 </div>
              </div>

              <PositionTracker position={position} />
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card-elevated">
                 <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Position Stats</h3>
                 <div className="space-y-4">
                    <StatRow label="Staked At" value={(mounted && position?.stakedAt) ? new Date(position.stakedAt).toLocaleDateString() : 'N/A'} />
                    <StatRow label="Unlocks At" value={(mounted && position?.unlocksAt) ? new Date(position.unlocksAt).toLocaleDateString() : 'N/A'} />
                    <StatRow label="APY Rate" value={`${((position?.apyRate ?? 0) * 100).toFixed(0)}%`} color="text-primary" />
                    <StatRow label="Initial Deposit" value={`${position?.amountXLM ?? 0} XLM`} />
                 </div>
              </div>
              <div className="card-elevated border-accent-indigo/20">
                 <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-6">Network Info</h3>
                 <div className="space-y-4">
                    <StatRow label="Contract ID" value={(position?.contractId ?? '').slice(0, 10) + '...'} />
                    <StatRow label="Wallet" value={(position?.stakerWallet ?? '').slice(0, 10) + '...'} />
                    <StatLink label="Stellar Expert" href={`https://stellar.expert/explorer/testnet/tx/${position?.txHashStake ?? ''}`} />
                    <StatLink label="Soroban RPC" href="#" />
                 </div>
              </div>
           </div>
        </div>

        <div className="space-y-8">
           <div className="card-surface bg-accent-fuchsia/5 border-accent-fuchsia/20">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="text-accent-fuchsia" /> Yield Accrual
              </h3>
              <div className="space-y-6">
                 <div>
                    <span className="text-xs text-text-secondary block mb-1">Accrued so far</span>
                    <div className="flex items-baseline gap-2">
                       <span className="text-4xl font-black text-text-primary animate-yieldTick">
                         {(position?.currentYield ?? 0).toFixed(4)}
                       </span>
                       <span className="text-sm font-mono text-text-muted">XLM</span>
                    </div>
                 </div>
                 
                 <div className="w-full h-px bg-high" />

                 <div className="flex items-center gap-4 text-xs font-bold">
                    <div className="flex-1">
                       <span className="text-text-muted block">Already Claimed</span>
                       <span className="text-text-secondary">{(position?.yieldEarned || 0).toFixed(4)} XLM</span>
                    </div>
                    <div className="flex-1">
                       <span className="text-text-muted block">Daily Accrual</span>
                       <span className="text-text-secondary">{(((position?.amountXLM || 0) * (position?.apyRate || 0)) / 365).toFixed(4)} XLM</span>
                    </div>
                 </div>

                 {position?.status === 'active' && (
                    <button 
                      onClick={handleClaim}
                      disabled={actionLoading || (position?.currentYield || 0) < 0.0001}
                      className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(217,70,239,0.3)] bg-gradient-to-r from-fuchsia-600 to-violet-600"
                    >
                      {actionLoading ? <Loader2 className="animate-spin" size={20} /> : "Claim Accrued Yield"}
                    </button>
                 )}
              </div>
           </div>

           <div className="space-y-4 pt-4">
              {isUnlocked && position.status === 'active' ? (
                <button 
                  onClick={handleUnstake}
                  disabled={actionLoading}
                  className="btn-primary w-full py-4 text-lg font-bold shadow-[0_4px_20px_rgba(139,92,246,0.4)]"
                >
                   Withdraw Principal + Yield
                </button>
              ) : position.status === 'active' ? (
                <button 
                  onClick={() => setShowEmergencyModal(true)}
                  className="btn-secondary w-full py-4 text-accent-rose border-accent-rose/30 hover:bg-accent-rose/10"
                >
                  Emergency Exit (Penalty)
                </button>
              ) : (
                <div className="bg-high p-4 rounded-xl text-center border border-border-subtle">
                   <p className="text-xs font-bold text-text-muted uppercase tracking-widest">POSITION CLOSED</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-background/90 backdrop-blur-sm">
           <div className="w-full max-w-md card-elevated border-accent-rose/40 animate-stakeConfirm">
              <div className="flex justify-between items-start mb-6">
                 <div className="w-12 h-12 bg-accent-rose/10 rounded-2xl flex items-center justify-center text-accent-rose">
                    <AlertCircle size={28} />
                 </div>
                 <button onClick={() => setShowEmergencyModal(false)} className="text-text-muted hover:text-white transition-colors">
                    <X size={24} />
                 </button>
              </div>
              <h3 className="text-2xl font-bold text-text-primary mb-2">Emergency Withdrawal</h3>
              <p className="text-text-secondary text-sm leading-relaxed mb-6">
                 Warning: You are attempting to withdraw before the unlock date. This will incur a 
                 <strong className="text-accent-rose mx-1">10% penalty ({ (position.amountXLM * 0.1).toFixed(2) } XLM)</strong>. 
                 Any accrued yield will be forfeited.
              </p>
              
              <div className="space-y-4 mb-8">
                 <p className="text-xs font-bold text-text-muted uppercase tracking-widest">Type CONFIRM to proceed</p>
                 <input 
                   type="text" 
                   value={confirmText}
                   onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                   className="input-field border-accent-rose/20 focus:border-accent-rose font-black tracking-widest text-center"
                   placeholder="CONFIRM"
                 />
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowEmergencyModal(false)} className="btn-secondary flex-1 py-3">Cancel</button>
                 <button 
                   onClick={handleEmergency}
                   disabled={confirmText !== 'CONFIRM' || actionLoading}
                   className="btn-primary flex-[2] bg-accent-rose hover:bg-rose-700 py-3 shadow-[0_4px_15px_rgba(244,63,94,0.4)]"
                 >
                   {actionLoading ? <Loader2 className="animate-spin mx-auto" size={18} /> : "Withdraw with Penalty"}
                 </button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, color }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
       <span className="text-text-secondary">{label}</span>
       <span className={`font-bold ${color || 'text-text-primary'}`}>{value}</span>
    </div>
  );
}

function StatLink({ label, href }: any) {
  return (
    <div className="flex justify-between items-center text-sm">
       <span className="text-text-secondary">{label}</span>
       <a href={href} target="_blank" className="font-bold text-primary hover:underline flex items-center gap-1">
          Explore <ExternalLink size={12} />
       </a>
    </div>
  );
}
