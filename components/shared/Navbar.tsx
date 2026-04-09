'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Wallet, LogOut, LayoutDashboard, Settings, User } from 'lucide-react';
import WalletButton from './WalletButton';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/signup');
  const isDashboard = pathname.startsWith('/staker') || pathname.startsWith('/admin');

  if (isDashboard) return null; // Dashboards have their own sidebars

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-fuchsia rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
            <Wallet className="text-white" size={24} />
          </div>
          <span className="text-xl font-bold gradient-text tracking-tighter">StakeVault</span>
        </Link>

        {!isAuthPage && (
          <div className="hidden lg:flex items-center gap-6">
            <Link href="/pool/main" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Pool Stats</Link>
            <Link href="/pricing" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Pricing</Link>
            <Link href="/about" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">About</Link>
            <Link href="/blog" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Blog</Link>
            <Link href="/contact" className="text-sm font-semibold text-text-secondary hover:text-primary transition-colors">Contact</Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {session ? (
            <div className="flex items-center gap-3">
              <Link 
                href={session.user.role === 'admin' ? '/admin/dashboard' : '/staker/dashboard'}
                className="btn-secondary py-2 px-4 text-xs flex items-center gap-2"
              >
                <LayoutDashboard size={14} /> Dashboard
              </Link>
              <button 
                onClick={() => signOut()}
                className="p-2 text-text-muted hover:text-accent-rose transition-colors"
              >
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="text-sm font-bold text-text-secondary hover:text-white px-4">Login</Link>
              <Link href="/signup" className="btn-primary py-2.5 px-6 text-sm">Launch App</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
