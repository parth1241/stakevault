'use client';

import { Shield, Target, Users, Zap, Wallet, Lock, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="pt-20 pb-32 space-y-32">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 text-primary font-bold text-xs uppercase tracking-widest">
           About StakeVault
        </div>
        <h1 className="text-5xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter leading-tight">
          Democratizing <span className="gradient-text">On-Chain Yield</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed">
          StakeVault is a non-custodial staking protocol built on the Stellar network. 
          We use Soroban smart contracts to ensure your funds are always secure, 
          transparent, and earning at the best possible rates.
        </p>
      </section>

      {/* Mission */}
      <section className="bg-surface/50 border-y border-border-subtle py-32 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
           <div className="space-y-8">
              <h2 className="text-4xl font-black text-text-primary tracking-tight">Our Mission</h2>
              <p className="text-lg text-text-secondary leading-relaxed">
                 We believe that blockchain technology should make financial growth accessible to everyone. 
                 By removing intermediaries and automating yield distribution through audited code, 
                 we've created a platform where users truly own their assets and their earnings.
              </p>
              <div className="flex gap-4">
                 <div className="p-4 bg-primary/10 rounded-2xl border border-primary/20 flex flex-col items-center gap-2">
                    <span className="text-2xl font-black text-primary">0%</span>
                    <span className="text-[10px] uppercase font-bold text-text-muted">Protocol Fees</span>
                 </div>
                 <div className="p-4 bg-accent-fuchsia/10 rounded-2xl border border-accent-fuchsia/20 flex flex-col items-center gap-2">
                    <span className="text-2xl font-black text-accent-fuchsia">100%</span>
                    <span className="text-[10px] uppercase font-bold text-text-muted">Open Source</span>
                 </div>
              </div>
           </div>
           <div className="relative">
              <div className="w-full aspect-square bg-gradient-to-br from-primary/20 to-accent-indigo/20 rounded-full blur-3xl absolute inset-0" />
              <div className="relative card-surface p-10 border-primary/20 rotate-3 translate-x-10">
                 <Shield size={64} className="text-primary mb-6" />
                 <h3 className="text-2xl font-bold mb-4">Security First</h3>
                 <p className="text-text-secondary text-sm leading-relaxed">
                    Our Soroban contracts are written in Rust and undergo rigorous internal testing. 
                    The decentralized nature of Stellar ensures your funds are never dependent on a single company.
                 </p>
              </div>
           </div>
        </div>
      </section>

      {/* Values */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
           <h2 className="text-4xl font-black text-text-primary mb-4">The Values We Stake By</h2>
           <div className="w-20 h-1.5 bg-primary mx-auto rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
           <ValueItem icon={Zap} title="Instant Finality" desc="Stellar's consensus mechanism ensures your staking events are confirmed in under 5 seconds." />
           <ValueItem icon={Lock} title="Immutable Terms" desc="Once you lock your funds, the APY and duration are hardcoded. Even we cannot change them." />
           <ValueItem icon={Globe} title="Permissionless" desc="Anyone with a Stellar wallet can join. No credit checks, no country restrictions, just code." />
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-5xl mx-auto px-6">
         <div className="bg-gradient-to-r from-violet-600 to-indigo-700 rounded-[3rem] p-16 text-center text-white space-y-10 shadow-[0_20px_50px_rgba(139,92,246,0.3)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Ready to Start Staking?</h2>
            <p className="text-white/80 text-xl max-w-xl mx-auto">
               Join thousands of users earning decentralized yield on the Stellar network.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
               <Link href="/signup" className="bg-white text-primary px-10 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
                  Get Started Now
               </Link>
               <Link href="/pool/main" className="bg-white/10 border border-white/20 backdrop-blur-md text-white px-10 py-5 rounded-2xl font-black text-lg hover:bg-white/20 transition-all">
                  Check Pool Stats
               </Link>
            </div>
         </div>
      </section>
    </div>
  );
}

function ValueItem({ icon: Icon, title, desc }: any) {
  return (
    <div className="flex flex-col items-center text-center group">
       <div className="w-20 h-20 bg-surface border border-border-subtle rounded-3xl flex items-center justify-center text-primary mb-8 group-hover:bg-primary group-hover:text-white transition-all shadow-lg group-hover:-translate-y-2">
          <Icon size={32} />
       </div>
       <h3 className="text-xl font-bold mb-4">{title}</h3>
       <p className="text-text-secondary leading-relaxed text-sm">{desc}</p>
    </div>
  );
}
