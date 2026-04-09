'use client';

import { FileText, ShieldAlert, Gavel, Cpu, AlertTriangle } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="pt-20 pb-32 space-y-20">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-amber/10 border border-accent-amber/20 rounded-full mb-8 text-accent-amber font-bold text-xs uppercase tracking-widest">
           Terms of Protocol
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Terms of <span className="gradient-text">Use</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          By interacting with the StakeVault protocol, you acknowledge the decentralized nature of our smart contracts.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-6">
        <div className="card-surface p-12 space-y-12 leading-relaxed border-accent-amber/10">
          <div className="bg-accent-amber/5 border border-accent-amber/20 p-6 rounded-2xl flex gap-4 items-start">
             <AlertTriangle className="text-accent-amber shrink-0" size={24} />
             <div className="text-sm text-accent-amber font-medium">
                <strong>WARNING:</strong> Staking involves financial risk. Smart contracts are code and can contain bugs. Only stake what you can afford to lose.
             </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <Cpu className="text-primary" /> 1. Protocol Interaction
            </h2>
            <p className="text-text-secondary">
              StakeVault is a decentralized application (dApp) that provides a user interface for managing assets on the Stellar network. When you initiate a stake, you are interacting directly with Soroban smart contracts. 
            </p>
            <p className="text-text-secondary">
              The StakeVault team does not hold, manage, or have access to your funds at any time. All yields are calculated and distributed by the software itself.
            </p>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <ShieldAlert className="text-accent-rose" /> 2. Risk Disclosure
            </h2>
            <ul className="list-disc pl-6 space-y-3 text-text-secondary">
              <li><strong>Smart Contract Risk:</strong> While audited, the code may contain vulnerabilities.</li>
              <li><strong>Liquidity Risk:</strong> Assets are time-locked. Early withdrawal incurs a 10% principal penalty.</li>
              <li><strong>Market Risk:</strong> The value of XLM may fluctuate significantly during the staking period.</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h2 className="text-2xl font-bold flex items-center gap-3 text-text-primary">
              <Gavel className="text-accent-indigo" /> 3. Governing Law
            </h2>
            <p className="text-text-secondary">
               As a decentralized protocol, "the code is the law." There is no central authority to reverse transactions or freeze accounts. Users are responsible for complying with the laws of their local jurisdiction regarding digital assets and staking yield.
            </p>
          </div>

          <div className="pt-10 border-t border-border-subtle text-center">
            <p className="text-text-muted text-sm">
              Last Updated: October 24, 2024
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
