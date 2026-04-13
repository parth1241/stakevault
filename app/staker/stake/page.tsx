'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { 
  ArrowRight, ArrowLeft, Check, 
  Wallet, Shield, Clock, Zap, 
  Loader2, AlertCircle, TrendingUp
} from 'lucide-react';
import WalletButton from '@/components/shared/WalletButton';
import YieldCalculator from '@/components/shared/YieldCalculator';
import Confetti from '@/components/shared/Confetti';
import { getWalletBalance } from '@/lib/stellar';
import { stakeXLM } from '@/lib/soroban';
import { useToast } from '@/components/shared/Toast';
import TransactionSuccessCard from '@/components/shared/TransactionSuccessCard';
import { cn } from '@/lib/utils';

export default function StakePage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState(100);
  const [days, setDays] = useState(30);
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [showSuccessCard, setShowSuccessCard] = useState(false);
  const [lastTxHash, setLastTxHash] = useState("");
  const [updatedBalance, setUpdatedBalance] = useState("0.00");

  const apyRates = { 7: 0.03, 30: 0.07, 90: 0.12 };
  const currentApy = apyRates[days as keyof typeof apyRates];

  useEffect(() => {
    if (session?.user?.linkedWallet) {
      getWalletBalance(session.user.linkedWallet).then(setWalletBalance);
    }
  }, [session]);

  const handleNext = () => {
    if (step === 1 && amount < 10) {
      toast("Minimum stake is 10 XLM", "error");
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => setStep(step - 1);

  const confirmStake = async () => {
    if (!session?.user?.linkedWallet) {
      toast("Please link your wallet first", "error");
      return;
    }

    setLoading(true);
    try {
      setStatusMessage('Preparing smart contract call...');
      // Simulated delay for UX
      await new Promise(r => setTimeout(r, 1500));
      
      setStatusMessage('Please sign the transaction in Freighter...');
      const { txHash, positionId } = await stakeXLM(session.user.linkedWallet, amount, days);
      
      setStatusMessage('Confirming on Soroban...');
      const res = await fetch('/api/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountXLM: amount,
          lockPeriodDays: days,
          txHash,
          stakerWallet: session.user.linkedWallet
        }),
      });

      if (res.ok) {
        setLastTxHash(txHash);
        
        // Fetch fresh balance
        try {
          const bal = await getWalletBalance(session.user.linkedWallet);
          setUpdatedBalance(bal.toFixed(2));
        } catch (e) {}

        setSuccess(true);
        setShowSuccessCard(true);
        setStatusMessage('Position confirmed!');
        toast("XLM Staked Successfully!", "success");
      } else {
        const data = await res.json();
        throw new Error(data.error || "Failed to record stake");
      }
    } catch (err: any) {
      toast(err.message || "Staking failed", "error");
      setLoading(false);
      setStatusMessage('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10">
      <Confetti active={success} />
      
      <div className="mb-12">
        <h1 className="text-4xl font-black text-text-primary mb-4 tracking-tighter">Stake XLM</h1>
        <p className="text-text-secondary">Follow the wizard to lock your funds and start earning yield.</p>
      </div>

      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-16">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-4">
            <div className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300",
              step >= s ? "bg-primary text-white shadow-[0_0_15px_rgba(139,92,246,0.5)]" : "bg-high text-text-muted border border-border-subtle"
            )}>
              {step > s ? <Check size={20} /> : s}
            </div>
            {s < 3 && <div className={cn("flex-1 h-0.5 rounded-full transition-all duration-500", step > s ? "bg-primary" : "bg-high")} />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          {step === 1 && (
            <div className="card-surface space-y-8 animate-stakeConfirm">
              <h2 className="text-2xl font-bold text-text-primary">Step 1: Choose Amount</h2>
              <div className="space-y-4">
                <label className="text-sm font-bold text-text-secondary block">Amount to Stake (XLM)</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="input-field text-3xl font-black py-6 pl-12 h-20"
                    placeholder="100"
                  />
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={24} />
                </div>
                <div className="flex justify-between items-center text-xs px-2">
                  <span className="text-text-muted">Min: 10 XLM • Max: 10,000 XLM</span>
                  <div className="flex items-center gap-2">
                    <span className="text-text-secondary">Balance: {walletBalance !== null ? `${walletBalance.toLocaleString()} XLM` : 'Loading...'}</span>
                    <button 
                      onClick={() => setAmount(walletBalance ? walletBalance - 2 : 0)}
                      className="text-primary font-bold hover:underline"
                    >
                      MAX
                    </button>
                  </div>
                </div>
              </div>
              {walletBalance !== null && amount > walletBalance && (
                <div className="bg-rose-500/10 text-rose-400 p-4 rounded-xl flex gap-3 text-sm font-semibold border border-rose-500/20">
                  <AlertCircle size={20} className="shrink-0" />
                  Insufficient wallet balance (Leave 2 XLM for fees)
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-8 animate-stakeConfirm">
              <h2 className="text-2xl font-bold text-text-primary">Step 2: Choose Lock Period</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <PeriodCard 
                    days={7} apy="3%" desc="Quick liquidity" 
                    selected={days === 7} onClick={() => setDays(7)} 
                    color="border-accent-indigo"
                 />
                 <PeriodCard 
                    days={30} apy="7%" desc="Best balance" recommended 
                    selected={days === 30} onClick={() => setDays(30)} 
                    color="border-primary"
                 />
                 <PeriodCard 
                    days={90} apy="12%" desc="Maximum yield" 
                    selected={days === 90} onClick={() => setDays(90)} 
                    color="border-accent-fuchsia"
                 />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="card-surface space-y-8 animate-stakeConfirm">
              <h2 className="text-2xl font-bold text-text-primary">Step 3: Confirm & Stake</h2>
              <div className="bg-background/50 rounded-3xl p-8 space-y-6 border border-border-subtle">
                 <div className="flex justify-between items-center pb-6 border-b border-border-subtle">
                   <span className="text-text-secondary font-semibold">Staking Amount</span>
                   <span className="text-2xl font-black text-text-primary">{amount.toLocaleString()} XLM</span>
                 </div>
                 <div className="grid grid-cols-2 gap-y-4 text-sm">
                   <span className="text-text-secondary">Lock Period</span>
                   <span className="text-right font-bold text-text-primary">{days} Days</span>
                   <span className="text-text-secondary">Current APY</span>
                   <span className="text-right font-bold text-primary">{(currentApy * 100).toFixed(0)}%</span>
                   <span className="text-text-secondary">Unlock Date</span>
                   <span className="text-right font-bold text-text-primary">
                     {new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString()}
                   </span>
                 </div>
                 <div className="pt-6 border-t border-border-subtle">
                   <div className="flex justify-between items-center text-accent-fuchsia font-bold">
                     <span>Projected Yield</span>
                     <span className="text-xl">{(amount * currentApy * (days/365)).toFixed(4)} XLM</span>
                   </div>
                 </div>
              </div>

              <div className="bg-high p-4 rounded-xl border border-border-default flex gap-3 text-xs text-text-muted leading-relaxed">
                <Shield size={18} className="text-primary shrink-0" />
                <span>
                  Funds will be locked in the smart contract until maturity. Early withdrawal is possible but incurs a <strong>10% penalty</strong> on the principal amount.
                </span>
              </div>

              {!session?.user?.linkedWallet ? (
                <div className="space-y-4">
                  <p className="text-sm text-center text-text-secondary">Please connect your wallet to proceed</p>
                  <WalletButton className="w-full py-6" />
                </div>
              ) : null}
            </div>
          )}

          <div className="flex gap-4 pt-8">
            {step > 1 && (
              <button 
                onClick={handleBack}
                disabled={loading || success}
                className="btn-secondary px-8 py-4 flex items-center gap-2"
              >
                <ArrowLeft size={20} /> Back
              </button>
            )}
            {step < 3 ? (
              <button 
                onClick={handleNext}
                disabled={amount < 10 || (walletBalance !== null && amount > walletBalance)}
                className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={confirmStake}
                disabled={loading || success || !session?.user?.linkedWallet}
                className="btn-primary flex-1 py-4 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : success ? <Check size={20} /> : "Confirm & Stake Funds"}
              </button>
            )}
          </div>
          
          {statusMessage && (
            <div className="text-center pt-4">
              <span className="text-sm font-bold text-primary animate-pulse">{statusMessage}</span>
            </div>
          )}
        </div>

        <div className="space-y-8">
          <div className="card-elevated bg-surface/50">
             <h3 className="font-bold text-xs text-text-muted uppercase tracking-widest mb-6">Real-time Calculation</h3>
             <div className="space-y-6">
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Projected Yield</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-black text-accent-fuchsia">{(amount * currentApy * (days/365)).toFixed(4)}</span>
                    <span className="text-xs font-mono text-text-muted">XLM</span>
                  </div>
                </div>
                <div className="w-full h-px bg-high" />
                <div>
                  <span className="text-[10px] text-text-secondary uppercase">Daily Earnings</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl font-bold text-accent-indigo">{((amount * currentApy) / 365).toFixed(4)}</span>
                    <span className="text-xs font-mono text-text-muted">XLM</span>
                  </div>
                </div>
             </div>
          </div>
          <div className="p-6 bg-high/30 rounded-3xl border border-dashed border-border-subtle flex flex-col items-center text-center">
             <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                <Clock size={24} />
             </div>
             <p className="text-xs text-text-secondary leading-relaxed font-medium">
               Select your preferred lock duration. Longer periods unlock significantly higher reward multipliers on the Soroban network.
             </p>
          </div>
        </div>
        </div>
      </div>

      {showSuccessCard && (
        <TransactionSuccessCard 
          title="Staking Successful!"
          subtitle="Your XLM has been securely locked in the Soroban smart contract."
          txHash={lastTxHash}
          amount={amount.toString()}
          walletAddress={session?.user?.linkedWallet}
          walletBalance={updatedBalance}
          extraDetails={[
            { label: "Lock Period", value: `${days} Days` },
            { label: "Current APY", value: `${(currentApy * 100).toFixed(0)}%` },
            { label: "Expected Yield", value: `${(amount * currentApy * (days/365)).toFixed(4)} XLM` }
          ]}
          onClose={() => {
            setShowSuccessCard(false);
            router.push('/staker/positions');
          }}
        />
      )}
    </div>
  );
}

function PeriodCard({ days, apy, desc, selected, onClick, color, recommended }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "card-surface p-6 flex flex-col items-center text-center transition-all border-2 relative",
        selected ? `${color} shadow-lg scale-105` : "border-border-subtle opacity-70 hover:opacity-100"
      )}
    >
      {recommended && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-[10px] font-black uppercase text-white px-3 py-1 rounded-full shadow-lg">
          Best Value
        </div>
      )}
      <span className="text-2xl font-black text-text-primary mb-1">{days} Days</span>
      <span className={cn("text-xl font-bold mb-4", color.replace('border-', 'text-'))}>{apy} APY</span>
      <p className="text-xs text-text-secondary font-medium">{desc}</p>
      {selected && <div className="mt-4 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white"><Check size={14} /></div>}
    </button>
  );
}
