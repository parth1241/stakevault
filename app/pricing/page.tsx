'use client';

import { Check, Info, TrendingUp, Shield, Zap, Lock, Sparkles, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import YieldCalculator from '@/components/shared/YieldCalculator';

export default function PricingPage() {
  const tiers = [
    {
      name: "Short Term",
      duration: "7 Days",
      apy: "3%",
      multiplier: "1.0x",
      color: "border-accent-indigo",
      bgColor: "bg-accent-indigo/10",
      textColor: "text-accent-indigo",
      features: [
        "Highest liquidity",
        "Shortest lock-up",
        "Standard yield accrual",
        "No platform fees"
      ]
    },
    {
      name: "Balanced",
      duration: "30 Days",
      apy: "7%",
      multiplier: "2.3x",
      color: "border-primary",
      bgColor: "bg-primary/10",
      textColor: "text-primary",
      recommended: true,
      features: [
        "Optimized yield curve",
        "Compound verification",
        "Priority staker status",
        "Zero management fees"
      ]
    },
    {
      name: "Long Term",
      duration: "90 Days",
      apy: "12%",
      multiplier: "4.0x",
      color: "border-accent-fuchsia",
      bgColor: "bg-accent-fuchsia/10",
      textColor: "text-accent-fuchsia",
      features: [
        "Maximum APR available",
        "Elite protocol privileges",
        "Quarterly rewards focus",
        "Soroban engine priority"
      ]
    }
  ];

  return (
    <div className="pt-20 pb-32 space-y-32">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Staking <span className="gradient-text">APY Tiers</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Choose a lock-in period that matches your financial goals. 
          Higher duration equals higher on-chain authority and reward multipliers.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div 
            key={tier.name}
            className={`card-surface p-10 flex flex-col items-center text-center transition-all border-2 relative overflow-hidden ${tier.recommended ? `${tier.color} shadow-[0_0_50px_rgba(139,92,246,0.2)] scale-105 z-10` : 'border-border-subtle opacity-90'}`}
          >
            {tier.recommended && (
              <div className="absolute top-0 right-0 left-0 bg-primary text-white py-2 text-[10px] font-black uppercase tracking-[0.2em]">
                Most Popular Choice
              </div>
            )}
            <h3 className="text-sm font-black text-text-muted uppercase tracking-[0.3em] mb-4">{tier.name}</h3>
            <div className="mb-8">
               <span className="text-6xl font-black text-text-primary">{tier.apy}</span>
               <span className="text-sm font-bold text-text-muted block mt-2">Annual Percentage Yield</span>
            </div>
            
            <div className={`w-full py-4 ${tier.bgColor} ${tier.textColor} rounded-2xl mb-10 font-black text-xs uppercase tracking-widest border border-current opacity-30`}>
               {tier.duration} Lock Duration
            </div>

            <ul className="space-y-4 mb-12 w-full text-left">
               {tier.features.map((f) => (
                 <li key={f} className="flex items-center gap-3 text-sm text-text-secondary">
                    <Check size={16} className={tier.textColor} /> {f}
                 </li>
               ))}
            </ul>

            <Link href="/signup" className={`btn-primary w-full py-4 text-xs font-black uppercase tracking-widest ${tier.recommended ? 'shadow-xl' : 'opacity-80'}`}>
               Start Staking
            </Link>
          </div>
        ))}
      </section>

      {/* Comparison Table */}
      <section className="max-w-5xl mx-auto px-6 space-y-16">
         <div className="text-center">
            <h2 className="text-3xl font-black text-text-primary mb-4">Parameter Comparison</h2>
            <p className="text-text-secondary text-sm">Every tier is backed by the same secure Soroban infrastructure.</p>
         </div>

         <div className="card-surface p-0 overflow-hidden border-border-subtle">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="bg-high/50 border-b border-border-subtle">
                     <th className="px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Feature</th>
                     <th className="px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Short</th>
                     <th className="px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Balanced</th>
                     <th className="px-8 py-6 text-[10px] font-bold text-text-muted uppercase tracking-widest">Long</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-border-subtle/30 text-sm">
                  <ComparisonRow label="Multiplier" short="1.0x" balanced="2.3x" long="4.0x" />
                  <ComparisonRow label="Early Withdrawal" short="10% Penalty" balanced="10% Penalty" long="10% Penalty" />
                  <ComparisonRow label="Minimum XLM" short="10" balanced="10" long="10" />
                  <ComparisonRow label="Max Exposure" short="10k" balanced="10k" long="10k" />
                  <ComparisonRow label="Yield Payout" short="On-Chain" balanced="On-Chain" long="On-Chain" />
               </tbody>
            </table>
         </div>
      </section>

      {/* FAQs */}
      <section className="max-w-4xl mx-auto px-6 space-y-16">
         <div className="text-center">
            <h2 className="text-3xl font-black text-text-primary mb-4">Staking FAQ</h2>
            <div className="w-16 h-1 bg-primary mx-auto rounded-full" />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <FAQItem q="How is the yield generate?" a="Yield is verified on-chain and distributed according to the parameters set in the Soroban smart contract at the time of staking." />
            <FAQItem q="Is there an emergency exit?" a="Yes, you can withdraw anytime. However, if you withdraw before maturity, a 10% penalty is applied to your principal." />
            <FAQItem q="Do I keep custody of my keys?" a="Absolutely. StakeVault is non-custodial. Your funds are locked in the smart contract, and only your wallet can authorize withdrawals." />
            <FAQItem q="Which wallets are supported?" a="Initially, we support Freighter for signing transactions. Support for Ledger and Albedo is coming soon." />
         </div>
      </section>
    </div>
  );
}

function ComparisonRow({ label, short, balanced, long }: any) {
  return (
    <tr className="hover:bg-primary/5 transition-colors">
       <td className="px-8 py-5 text-text-secondary font-medium">{label}</td>
       <td className="px-8 py-5 text-text-primary font-bold">{short}</td>
       <td className="px-8 py-5 text-text-primary font-bold">{balanced}</td>
       <td className="px-8 py-5 text-text-primary font-bold">{long}</td>
    </tr>
  );
}

function FAQItem({ q, a }: any) {
  return (
    <div className="space-y-3">
       <div className="flex items-center gap-2 text-primary font-bold">
          <HelpCircle size={18} />
          <h4>{q}</h4>
       </div>
       <p className="text-text-secondary text-sm leading-relaxed">{a}</p>
    </div>
  );
}
