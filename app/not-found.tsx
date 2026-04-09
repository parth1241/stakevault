'use client';

import Link from 'next/link';
import { Home, Search, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="relative mb-8">
        <h1 className="text-[12rem] font-black gradient-text opacity-10 leading-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
           <Ghost size={80} className="text-primary animate-bob1" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-text-primary mb-4 tracking-tight">This stake position doesn't exist</h2>
      <p className="text-text-secondary max-w-sm mb-12">
        The page you are looking for might have been moved, deleted, or never existed in the smart contract.
      </p>

      <Link href="/" className="btn-primary flex items-center gap-2 px-10">
        <Home size={18} /> Back to Safety
      </Link>

      <div className="mt-20 p-6 bg-surface/50 rounded-2xl border border-border-subtle max-w-xs w-full flex items-center gap-4 group">
        <div className="p-3 bg-high rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Search size={20} />
        </div>
        <div className="text-left">
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest block">Need help?</span>
          <Link href="/pool/main" className="text-xs font-bold text-text-secondary hover:text-primary transition-colors">Check Pool Stats →</Link>
        </div>
      </div>
    </main>
  );
}
