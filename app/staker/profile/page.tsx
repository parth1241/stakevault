'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { 
  User, Mail, Wallet, Bell, 
  Shield, Check, Loader2, Palette 
} from 'lucide-react';
import WalletButton from '@/components/shared/WalletButton';
import { useToast } from '@/components/shared/Toast';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: session?.user?.name || '',
    avatarColor: session?.user?.avatarColor || '#8b5cf6',
    preferences: {
      emailOnYield: session?.user?.preferences?.emailOnYield ?? true,
      emailOnUnlock: session?.user?.preferences?.emailOnUnlock ?? true,
      securityAlerts: session?.user?.preferences?.securityAlerts ?? true,
    }
  });

  const avatarColors = [
    '#8b5cf6', // Violet
    '#6366f1', // Indigo
    '#d946ef', // Fuchsia
    '#06b6d4', // Cyan
    '#f59e0b', // Amber
    '#f43f5e', // Rose
  ];

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        toast("Profile updated successfully", "success");
        await update(); // Update NextAuth session
      } else {
        toast("Failed to update profile", "error");
      }
    } catch (err) {
      toast("An error occurred", "error");
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (key: string) => {
    setFormData({
      ...formData,
      preferences: {
        ...formData.preferences,
        [key]: !formData.preferences[key as keyof typeof formData.preferences]
      }
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div>
        <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Account Settings</h1>
        <p className="text-text-secondary">Manage your profile, wallet, and security preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <div className="card-surface space-y-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <User size={16} className="text-primary" /> Identity
            </h3>
            
            <div className="flex flex-col md:flex-row gap-10 items-start md:items-center">
               <div className="relative group">
                  <div 
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-2xl transition-all group-hover:rotate-6"
                    style={{ backgroundColor: formData.avatarColor }}
                  >
                    {formData.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div className="absolute -bottom-2 -right-2 p-1.5 bg-high rounded-lg border border-border-subtle text-primary">
                    <Palette size={14} />
                  </div>
               </div>
               
               <div className="flex-1 space-y-4 w-full">
                  <div>
                    <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Display Name</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                    />
                  </div>
                  <div className="grid grid-cols-6 gap-3">
                    {avatarColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setFormData({...formData, avatarColor: color})}
                        className={`w-full aspect-square rounded-xl border-2 transition-all ${formData.avatarColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
               </div>
            </div>

            <div className="pt-4 border-t border-border-subtle">
               <label className="text-[10px] font-bold text-text-muted uppercase tracking-widest mb-2 block">Email Address (Read Only)</label>
               <div className="relative">
                  <input 
                    type="email" 
                    value={session?.user?.email || ''} 
                    readOnly 
                    className="input-field bg-background/50 text-text-muted cursor-not-allowed pl-10"
                  />
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
               </div>
            </div>
          </div>

          {/* Preferences Section */}
          <div className="card-surface space-y-8">
            <h3 className="text-sm font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
              <Bell size={16} className="text-accent-fuchsia" /> Notifications
            </h3>
            
            <div className="space-y-4">
               <PreferenceToggle 
                 label="Yield Accrual Alerts" 
                 desc="Receive an email when yield exceeds 1.0 XLM." 
                 active={formData.preferences.emailOnYield}
                 onToggle={() => togglePreference('emailOnYield')}
               />
               <PreferenceToggle 
                 label="Unlock Reminders" 
                 desc="Automatic notification 24 hours before funds unlock." 
                 active={formData.preferences.emailOnUnlock}
                 onToggle={() => togglePreference('emailOnUnlock')}
               />
               <PreferenceToggle 
                 label="Security & Login Alerts" 
                 desc="Be notified of new login attempts or contract events." 
                 active={formData.preferences.securityAlerts}
                 onToggle={() => togglePreference('securityAlerts')}
               />
            </div>
          </div>

          <button 
            onClick={handleSave}
            disabled={loading}
            className="btn-primary w-full py-4 flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : <>Save Settings <Check size={18} /></>}
          </button>
        </div>

        <div className="space-y-8">
           <div className="card-elevated border-primary/20 bg-primary/5">
              <h3 className="text-xs font-bold text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                <Wallet size={16} /> Asset Wallet
              </h3>
              <p className="text-xs text-text-secondary leading-relaxed mb-6">
                Connected wallet receives all staking yield and principal withdrawals.
              </p>
              
              {session?.user?.linkedWallet ? (
                <div className="bg-background rounded-2xl p-4 border border-border-subtle mb-6 truncate font-mono text-xs text-text-primary">
                   {session.user.linkedWallet}
                </div>
              ) : (
                <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 mb-6 text-xs text-rose-400 font-bold text-center">
                   No wallet linked
                </div>
              )}
              
              <WalletButton onConnect={(addr) => setFormData({...formData})} className="w-full py-3" />
           </div>

           <div className="card-surface space-y-6">
              <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest flex items-center gap-2">
                <Shield size={16} className="text-accent-indigo" /> Security
              </h3>
              <button className="text-xs font-bold text-text-secondary border border-border-subtle rounded-xl py-3 px-4 w-full hover:bg-high/50 transition-colors">
                 Change Password
              </button>
              <button className="text-xs font-bold text-text-secondary border border-border-subtle rounded-xl py-3 px-4 w-full hover:bg-high/50 transition-colors">
                 Two-Factor Auth
              </button>
              
              <div className="pt-4 border-t border-border-subtle">
                 <button className="text-xs font-bold text-accent-rose hover:underline">
                    Delete Account
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

function PreferenceToggle({ label, desc, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-2xl border border-border-subtle transition-all hover:bg-high/30">
       <div>
          <p className="text-sm font-bold text-text-primary mb-1">{label}</p>
          <p className="text-xs text-text-muted">{desc}</p>
       </div>
       <button 
         onClick={onToggle}
         className={`w-12 h-6 rounded-full transition-all relative ${active ? 'bg-primary shadow-[0_0_10px_rgba(139,92,246,0.3)]' : 'bg-high'}`}
       >
         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${active ? 'left-7' : 'left-1'}`} />
       </button>
    </div>
  );
}
