'use client';

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, Wallet, Layers, History, 
  User, LogOut, Loader2, Sparkles, ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardSkeleton } from "@/components/shared/Skeleton";

export default function StakerLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  if (status === "loading") return <DashboardSkeleton />;
  if (!session || session.user.role !== "staker") {
    if (typeof window !== 'undefined') router.push("/login");
    return null;
  }

  const navItems = [
    { label: "Dashboard", href: "/staker/dashboard", icon: LayoutDashboard, color: "text-primary" },
    { label: "Stake XLM", href: "/staker/stake", icon: Sparkles, color: "text-accent-fuchsia" },
    { label: "My Positions", href: "/staker/positions", icon: Layers, color: "text-accent-indigo" },
    { label: "History", href: "/staker/history", icon: History, color: "text-accent-cyan" },
    { label: "Profile", href: "/staker/profile", icon: User, color: "text-slate-400" },
  ];

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-border-subtle flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent-fuchsia rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
              <Wallet className="text-white" size={24} />
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
                    ? "bg-primary/10 border border-primary/20" 
                    : "hover:bg-high/50 text-text-secondary hover:text-text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={active ? item.color : "text-text-muted"} />
                  <span className="text-sm font-semibold">{item.label}</span>
                </div>
                {active && <ChevronRight size={14} className="text-primary" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <div className="bg-elevated/50 rounded-2xl p-4 border border-border-subtle group">
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: session.user.avatarColor }}
              >
                {session.user.name?.[0].toUpperCase()}
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold truncate">{session.user.name}</p>
                <p className="text-[10px] text-text-muted truncate">{session.user.email}</p>
              </div>
            </div>
            <button
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-high hover:bg-high/80 text-text-secondary hover:text-accent-rose transition-colors text-xs font-bold"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-64">
        <div className="min-h-screen py-10 px-10 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
