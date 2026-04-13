'use client';

import React, { useEffect, useState } from 'react';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  BarChart3, Shield, Users, Settings, 
  LogOut, Wallet, ChevronRight, Activity,
  AlertTriangle, ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/shared/Skeleton";
import WalletStatusBar from '@/components/shared/WalletStatusBar';
import Level1StatusBadge from '@/components/shared/Level1StatusBadge';
import { Networks } from '@stellar/stellar-sdk';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [wrongNetwork, setWrongNetwork] = useState(false);

  useEffect(() => {
    async function checkNetwork() {
      if (typeof window === 'undefined') return
      try {
        const { getNetworkDetails } = await import('@stellar/freighter-api')
        const details = await getNetworkDetails()
        if (details.networkPassphrase !== Networks.TESTNET) {
          setWrongNetwork(true)
        } else {
          setWrongNetwork(false)
        }
      } catch {
        // Freighter not installed
      }
    }
    checkNetwork()
    const interval = setInterval(checkNetwork, 10000)
    return () => clearInterval(interval)
  }, [])

  if (status === "loading") return <DashboardSkeleton />;
  if (!session || session.user.role !== "admin") {
    if (typeof window !== 'undefined') router.push("/login");
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/admin/dashboard", icon: BarChart3, color: "text-accent-indigo" },
    { label: "Contract", href: "/admin/contract", icon: Shield, color: "text-primary" },
    { label: "Stakers", href: "/admin/stakers", icon: Users, color: "text-accent-fuchsia" },
    { label: "Analytics", href: "/admin/analytics", icon: Activity, color: "text-accent-amber" },
    { label: "Settings", href: "/admin/settings", icon: Settings, color: "text-slate-400" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-text-primary overflow-hidden relative">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0d0022] border-r border-indigo-500/10 flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-accent-indigo to-primary rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Shield className="text-white" size={24} />
            </div>
            <span className="text-xl font-bold gradient-text tracking-tighter">StakeVault</span>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                  active 
                    ? "bg-indigo-500/10 border border-indigo-500/20" 
                    : "hover:bg-high/50 text-text-secondary hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={active ? item.color : "text-text-muted"} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {active && <ChevronRight size={14} className="text-accent-indigo" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-high/50 rounded-2xl p-4 border border-indigo-500/10 mb-4">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-accent-indigo uppercase tracking-widest">Admin Control</span>
                <div className="w-2 h-2 rounded-full bg-accent-indigo animate-pulse" />
             </div>
             <p className="text-xs text-text-secondary leading-tight">Access restricted to platform administrators only.</p>
          </div>
          
          <div className="bg-elevated/50 rounded-2xl p-4 border border-border-subtle group">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: session.user.avatarColor || '#6366f1' }}
              >
                {session.user.name?.[0].toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{session.user.name}</p>
                <p className="text-[10px] text-text-muted truncate uppercase font-bold tracking-widest">SysAdmin Root</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-high hover:bg-high/80 text-text-secondary hover:text-accent-rose transition-colors text-xs font-bold uppercase tracking-widest border border-transparent hover:border-accent-rose/20"
            >
              <LogOut size={14} /> Purge Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pl-64">
        {wrongNetwork && (
          <div className="w-full bg-rose-600 text-white py-2 px-4 flex items-center justify-center gap-2 z-[100] animate-in slide-in-from-top duration-300">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-xs font-bold uppercase tracking-wider text-center">
              Wrong Network: Switch Freighter to Stellar Testnet to use StakeVault
            </span>
          </div>
        )}
        <WalletStatusBar />
        <main className="flex-1 min-h-screen py-10 px-10 relative overflow-y-auto">
           <div className="absolute inset-0 bg-dot-grid opacity-20 pointer-events-none" />
           {children}
        </main>
      </div>
      <Level1StatusBadge />
    </div>
  );
}
