'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Wallet, Shield, TrendingUp, Lock, Zap, ArrowRight, CheckCircle2, ChevronDown } from 'lucide-react';
import TransactionSuccessCard from '@/components/shared/TransactionSuccessCard';
import YieldCalculator from '@/components/shared/YieldCalculator';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function LandingPage() {
  const [showMockSuccess, setShowMockSuccess] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const headlines = [
    "Earn Yield on Your XLM",
    "Smart Contract Staking",
    "Up to 12% APY On-Chain",
    "Your Keys, Your Yield"
  ];

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setHeadlineIndex((prev) => (prev + 1) % headlines.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative overflow-hidden">
      {showMockSuccess && (
        <TransactionSuccessCard 
          title="Staking Successful" 
          subtitle="Your 500 XLM have been locked for 90 days."
          txHash="4e1d7a3b8c9f2e1d0a5b6c7d8e9f0a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q"
          amount="500.00"
          walletAddress="GDRW6YRRXCOZBB6KTMXNUP2S5ST6G4R5AARBDWCBVQ"
          walletBalance="1240.50"
          extraDetails={[
            { label: "Lock Period", value: "90 Days" },
            { label: "Estimated APY", value: "12%" }
          ]}
          onClose={() => setShowMockSuccess(false)}
        />
      )}
      {/* Canvas Particle Background - Custom Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center pt-20">
        <HeroCanvas />
        <div className="max-w-7xl mx-auto px-6 text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 animate-bob1 transition-colors hover:bg-primary/20">
            <Shield size={16} className="text-primary" />
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Powered by Soroban Smart Contracts</span>
          </div>
          
          <h1 className="text-3xl sm:text-5xl lg:text-7xl font-black mb-6 tracking-tighter leading-tight transition-all duration-500 italic">
            <span className="gradient-text block mb-2">{headlines[headlineIndex]}</span>
          </h1>
          
          <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Lock XLM in a Soroban smart contract. Earn yield automatically. 
            Withdraw when ready. No banks, no middlemen.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link href="/signup" className="btn-primary text-lg px-10 flex items-center gap-2 group">
              Start Staking <ArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link href="/pool/main" className="btn-secondary text-lg px-10">
              View Pool Stats
            </Link>
          </div>

          <div className="mt-20 flex flex-wrap justify-center gap-8">
            <StatBadge label="4,291 XLM Staked" color="border-primary" animation="animate-bob1" />
            <StatBadge label="12% Max APY" color="border-accent-fuchsia" animation="animate-bob2" />
            <StatBadge label="0 Contract Hacks" color="border-accent-indigo" animation="animate-bob3" />
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
          <ChevronDown />
        </div>
      </section>

      {/* Section 2 — Live Staking Ticker */}
      <div className="bg-surface/50 border-y border-border-subtle overflow-hidden py-4">
        <div className="flex animate-marquee whitespace-nowrap gap-12">
          {[1,2,3,4,5].map(i => (
            <div key={i} className="flex gap-12 text-sm font-mono items-center">
               {mounted && (
                 <>
                   <span className="text-text-muted">0x{Math.random().toString(16).slice(2, 6)}...{Math.random().toString(16).slice(2, 6)} staked 500 XLM for 90 days • <span className="text-primary">+12% APY</span></span>
                   <span className="text-text-muted">Yield claimed: 23.4 XLM • <span className="text-accent-fuchsia">Smart contract confirmed</span></span>
                   <span className="text-text-muted">Position unlocked: 1,000 XLM + 70 XLM yield withdrawn</span>
                 </>
               )}
            </div>
          ))}
        </div>
      </div>

      {/* Section 3 — APY Calculator */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Calculate Your Rewards</h2>
            <p className="text-text-secondary">See how much you can earn based on your lock period.</p>
          </div>
          <YieldCalculator onStake={() => {}} className="mx-auto" />
        </div>
      </section>

      {/* Section 4 — How It Works */}
      <section className="py-32 bg-surface/30 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold mb-4">How It Works</h2>
            <div className="w-24 h-1.5 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
             <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-primary/20 via-primary/50 to-primary/20 border-t border-dashed border-primary/30 z-0" />
             
             <Step icon={Wallet} title="Connect Wallet" label="1" color="bg-violet-500" />
             <Step icon={Lock} title="Choose Lock Period" label="2" color="bg-fuchsia-500" />
             <Step icon={Shield} title="Soroban Secure" label="3" color="bg-indigo-500" />
             <Step icon={TrendingUp} title="Claim Yield" label="4" color="bg-cyan-500" />
          </div>
        </div>
      </section>

      {/* Section 5 — Features Grid */}
      <section className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Feature title="Soroban Powered" desc="Rust smart contracts on Stellar ensure maximum security and speed." icon={Zap} color="text-violet-500" />
            <Feature title="Time-Locked Security" desc="Funds are locked on-chain until maturity, preventing impulse sales." icon={Lock} color="text-indigo-500" />
            <Feature title="Auto Yield" desc="Your yield accrual is verified by the network every Stellar ledger." icon={TrendingUp} color="text-fuchsia-500" />
            <Feature title="Emergency Exit" desc="Need liquidity? Withdraw early with a 10% principal penalty." icon={Shield} color="text-accent-amber" />
            <Feature title="Non-Custodial" desc="Only you hold the keys. Funds are locked in the contract, not a bank." icon={Wallet} color="text-accent-cyan" />
            <Feature title="Transparent Rates" desc="APY rates are hardcoded in the contract and visible to all." icon={CheckCircle2} color="text-accent-rose" />
          </div>
        </div>
      </section>
    </div>
  );
}

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: any[] = [];
    const colors = ['#8b5cf6', '#d946ef', '#6366f1'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
        
        particles.forEach(p2 => {
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 150) * 0.1;
            ctx.stroke();
          }
        });
      });
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none" />;
}

function StatBadge({ label, color, animation }: { label: string; color: string; animation: string }) {
  return (
    <div className={`px-6 py-3 rounded-2xl bg-surface border-2 ${color} ${animation} shadow-lg`}>
      <span className="text-sm font-bold text-text-primary">{label}</span>
    </div>
  );
}

function Step({ icon: Icon, title, label, color }: any) {
  return (
    <div className="flex flex-col items-center text-center z-10">
      <div className={`w-16 h-16 rounded-3xl ${color} flex items-center justify-center mb-6 shadow-2xl rotate-3 hover:rotate-0 transition-transform`}>
        <Icon className="text-white" size={32} />
      </div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <div className="w-8 h-8 rounded-full bg-high flex items-center justify-center font-bold text-sm text-primary border border-primary/20">
        {label}
      </div>
    </div>
  );
}

function Feature({ title, desc, icon: Icon, color }: any) {
  return (
    <div className="card-surface card-hover flex flex-col items-start text-left p-8">
      <div className={`p-3 rounded-2xl bg-surface mb-6 ${color} border border-border-default shadow-sm`}>
        <Icon size={28} />
      </div>
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <p className="text-text-secondary leading-relaxed">{desc}</p>
    </div>
  );
}
