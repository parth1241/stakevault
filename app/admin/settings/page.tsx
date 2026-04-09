'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  Settings, Key, Shield, User, 
  Mail, Bell, Globe, Save, 
  Database, RefreshCcw, Loader2 
} from 'lucide-react';
import { useToast } from '@/components/shared/Toast';

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast("Admin settings saved", "success");
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Platform Settings</h1>
        <p className="text-text-secondary">Configure administrative access, API integrations, and global protocol parameters.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
           {/* Admin Identity */}
           <div className="card-surface space-y-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                 <User size={16} className="text-accent-indigo" /> Registrar Admin
              </h3>
              <div className="flex items-center gap-6 p-6 bg-high/30 rounded-2xl border border-border-subtle">
                 <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-accent-indigo to-primary flex items-center justify-center text-white text-2xl font-black">
                    {session?.user?.name?.[0] || 'A'}
                 </div>
                 <div>
                    <p className="text-xl font-bold text-text-primary">{session?.user?.name}</p>
                    <p className="text-sm text-text-secondary">{session?.user?.email}</p>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-indigo/10 border border-accent-indigo/20 mt-2">
                       <Shield size={12} className="text-accent-indigo" />
                       <span className="text-[10px] font-bold text-accent-indigo uppercase">Master Authority</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* API & Integration */}
           <div className="card-surface space-y-8">
              <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                 <Globe size={16} className="text-primary" /> Network Configuration
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Soroban RPC Endpoint</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         defaultValue="https://soroban-testnet.stellar.org" 
                         className="input-field pl-10"
                       />
                       <Database size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                 </div>
                 <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Horizon Provider</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         defaultValue="https://horizon-testnet.stellar.org" 
                         className="input-field pl-10"
                       />
                       <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                    </div>
                 </div>
              </div>
           </div>

           {/* API Keys */}
           <div className="card-surface space-y-8">
              <div className="flex items-center justify-between">
                 <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                    <Key size={16} className="text-accent-fuchsia" /> API Management
                 </h3>
                 <button className="text-[10px] font-bold text-accent-fuchsia border border-accent-fuchsia/30 px-3 py-1.5 rounded-lg hover:bg-accent-fuchsia/10">
                    Regenerate Key
                 </button>
              </div>
              
              <div className="space-y-4">
                 <div className="p-4 bg-background rounded-2xl border border-border-subtle flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-text-primary">Production API Key</p>
                       <p className="text-[10px] font-mono text-text-muted">sv_live_••••••••••••••••••••</p>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline">Reveal Key</button>
                 </div>
                 <div className="p-4 bg-background rounded-2xl border border-border-subtle flex items-center justify-between">
                    <div>
                       <p className="text-xs font-bold text-text-primary">Webhook Secret</p>
                       <p className="text-[10px] font-mono text-text-muted">wh_sec_••••••••••••••••••••</p>
                    </div>
                    <button className="text-[10px] font-bold text-primary hover:underline">Reveal Key</button>
                 </div>
              </div>
           </div>

           <button 
             onClick={handleSave}
             className="btn-primary w-full py-4 flex items-center justify-center gap-2 shadow-2xl"
           >
             {loading ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Update Admin Profile</>}
           </button>
        </div>

        <div className="space-y-8">
           <div className="card-elevated border-accent-rose/20 bg-accent-rose/5">
              <h3 className="text-xs font-bold text-accent-rose uppercase tracking-widest mb-6 flex items-center gap-2">
                 <Shield className="text-accent-rose" /> Danger Zone
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                 Resetting protocol stats or rotating the master admin key cannot be undone. Always verify contract state on-chain before proceeding.
              </p>
              <button className="w-full py-3 rounded-xl border border-accent-rose/30 text-accent-rose text-xs font-bold hover:bg-accent-rose hover:text-white transition-all mb-3">
                 Flush Analytics Cache
              </button>
              <button className="w-full py-3 rounded-xl border border-accent-rose/30 text-accent-rose text-xs font-bold hover:bg-accent-rose hover:text-white transition-all">
                 Rotate Master Keys
              </button>
           </div>

           <div className="card-surface space-y-6">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                 <Bell size={16} /> Admin Alerts
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">System Health Alerts</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">New Staker Notifications</span>
                    <div className="w-10 h-5 bg-high rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-text-secondary">Major Yield Event</span>
                    <div className="w-10 h-5 bg-primary rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" /></div>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
