'use client';

import Link from 'next/link';
import { Wallet, Shield, Activity, Globe, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border-subtle pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent-fuchsia rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Wallet className="text-white" size={18} />
              </div>
              <span className="text-lg font-bold gradient-text tracking-tighter">StakeVault</span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              Decentralized XLM staking platform powered by Soroban smart contracts. Earn secure yield on-chain.
            </p>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-high rounded-lg text-text-muted hover:text-primary transition-colors"><Globe size={18} /></a>
              <a href="#" className="p-2 bg-high rounded-lg text-text-muted hover:text-primary transition-colors"><Activity size={18} /></a>
              <a href="#" className="p-2 bg-high rounded-lg text-text-muted hover:text-primary transition-colors"><Mail size={18} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-6 text-sm uppercase tracking-widest">Platform</h4>
            <ul className="space-y-4">
              <li><Link href="/signup" className="text-sm text-text-secondary hover:text-primary transition-colors">Stake XLM</Link></li>
              <li><Link href="/pool/main" className="text-sm text-text-secondary hover:text-primary transition-colors">Pool Stats</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-secondary hover:text-primary transition-colors">Yield Rates</Link></li>
              <li><Link href="/about" className="text-sm text-text-secondary hover:text-primary transition-colors">Protocol Vision</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-6 text-sm uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><Link href="/blog" className="text-sm text-text-secondary hover:text-primary transition-colors">Latest News</Link></li>
              <li><Link href="/about/team" className="text-sm text-text-secondary hover:text-primary transition-colors">Meet the Team</Link></li>
              <li><Link href="/contact" className="text-sm text-text-secondary hover:text-primary transition-colors">Contact Support</Link></li>
              <li><Link href="/pool/main" className="text-sm text-text-secondary hover:text-primary transition-colors">System Status</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-text-primary mb-6 text-sm uppercase tracking-widest">Legal</h4>
            <ul className="space-y-4">
              <li><Link href="/privacy" className="text-sm text-text-secondary hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-text-secondary hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link href="/pricing" className="text-sm text-text-secondary hover:text-primary transition-colors">Risk Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-10 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} StakeVault Protocol. Built for Stellar Soroban Hackathon.
          </p>
          <div className="flex items-center gap-2 text-xs text-text-muted bg-high/50 px-4 py-2 rounded-full border border-border-subtle">
            <Shield size={14} className="text-primary" />
            Audit Status: <span className="text-primary font-bold">SMART CONTRACT VERIFIED</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
