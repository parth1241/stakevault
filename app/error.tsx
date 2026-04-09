'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background px-6 text-center">
      <div className="w-20 h-20 bg-accent-rose/10 rounded-3xl flex items-center justify-center text-accent-rose mb-8 animate-shake">
        <AlertCircle size={40} />
      </div>
      <h2 className="text-4xl font-black text-text-primary mb-4 tracking-tighter">Something went wrong</h2>
      <p className="text-text-secondary max-w-md mb-12 leading-relaxed">
        We encountered a smart contract communication error or a connection issue. Please try again.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="btn-primary flex items-center gap-2 px-8"
        >
          <RotateCcw size={18} /> Try Again
        </button>
        <Link href="/" className="btn-secondary flex items-center gap-2 px-8">
          <Home size={18} /> Back Home
        </Link>
      </div>
      
      {error.digest && (
        <p className="mt-12 text-[10px] font-mono text-text-muted uppercase tracking-widest">
          Error ID: {error.digest}
        </p>
      )}
    </main>
  );
}
