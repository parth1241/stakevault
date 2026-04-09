'use client';

import { 
  Mail, MessageSquare, Globe, 
  MapPin, Send, Loader2, CheckCircle2,
  Activity, Shield, LifeBuoy
} from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/shared/Toast';

export default function ContactPage() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast("Message sent successfully!", "success");
    }, 1500);
  };

  return (
    <div className="pt-20 pb-32 space-y-20">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Technical issues? Partnership inquiries? The StakeVault team is here to help you navigate the protocol.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-20">
        <div className="space-y-12">
           <div className="card-surface p-10 space-y-8">
              <h2 className="text-3xl font-black text-text-primary tracking-tight">Support Channels</h2>
              <div className="space-y-6">
                 <ContactMethod 
                   icon={Mail} 
                   title="Email Support" 
                   value="support@stakevault.stellar" 
                   desc="For account-specific issues and general inquiries."
                 />
                 <ContactMethod 
                   icon={MessageSquare} 
                   title="Community Discord" 
                   value="discord.gg/stakevault" 
                   desc="Join our developers and stakers for real-time discussion."
                 />
                 <ContactMethod 
                   icon={LifeBuoy} 
                   title="Technical Docs" 
                   value="docs.stakevault.stellar" 
                   desc="View Soroban contract architecture and API references."
                 />
              </div>
           </div>

           <div className="flex gap-4">
              <a href="#" className="p-4 bg-high rounded-2xl text-text-muted hover:text-primary transition-colors border border-border-subtle"><Activity size={24} /></a>
              <a href="#" className="p-4 bg-high rounded-2xl text-text-muted hover:text-primary transition-colors border border-border-subtle"><Shield size={24} /></a>
              <a href="#" className="p-4 bg-high rounded-2xl text-text-muted hover:text-primary transition-colors border border-border-subtle"><Globe size={24} /></a>
           </div>
        </div>

        <div className="card-elevated border-primary/20 p-10">
           {sent ? (
             <div className="h-full flex flex-col items-center justify-center text-center py-20 px-6 animate-stakeConfirm">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center text-primary mb-8">
                   <CheckCircle2 size={48} />
                </div>
                <h3 className="text-3xl font-black text-text-primary mb-4">Message Received</h3>
                <p className="text-text-secondary leading-relaxed">
                   Thank you for reaching out. A protocol representative will contact you at the provided email address within 24 hours.
                </p>
                <button onClick={() => setSent(false)} className="mt-10 text-primary font-bold hover:underline">Send another message</button>
             </div>
           ) : (
             <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Full Name</label>
                      <input type="text" required className="input-field" placeholder="John Doe" />
                   </div>
                   <div>
                      <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Email Address</label>
                      <input type="email" required className="input-field" placeholder="john@example.com" />
                   </div>
                </div>
                <div>
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Subject</label>
                   <select className="input-field appearance-none bg-background cursor-pointer">
                      <option>Technical Support</option>
                      <option>Partnership Inquiry</option>
                      <option>Bug Report</option>
                      <option>Other</option>
                   </select>
                </div>
                <div>
                   <label className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-2 block">Message</label>
                   <textarea required rows={6} className="input-field resize-none p-4" placeholder="How can we help you?"></textarea>
                </div>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn-primary w-full py-5 flex items-center justify-center gap-2 text-lg"
                >
                  {loading ? <Loader2 className="animate-spin" size={24} /> : <><Send size={24} /> Send Message</>}
                </button>
             </form>
           )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6">
         <div className="card-surface p-0 overflow-hidden border-border-subtle h-[400px] relative">
            <div className="absolute inset-0 bg-[#0d0019] flex items-center justify-center">
               <div className="text-center space-y-4">
                  <MapPin className="text-primary mx-auto" size={48} />
                  <p className="text-text-muted font-mono text-sm tracking-widest">DECENTRALIZED PROTOCOL • NO FIXED OFFICE</p>
                  <p className="text-text-secondary">StakeVault is maintained by a globally distributed team of Stellar developers.</p>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}

function ContactMethod({ icon: Icon, title, value, desc }: any) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-background border border-border-subtle hover:border-primary/30 transition-all hover:bg-high/30 group">
       <div className="p-3 bg-high rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-all">
          <Icon size={20} />
       </div>
       <div>
          <h3 className="font-bold text-text-primary text-sm mb-1">{title}</h3>
          <p className="text-primary font-mono text-xs mb-2">{value}</p>
          <p className="text-[10px] text-text-muted leading-relaxed uppercase font-bold tracking-widest">{desc}</p>
       </div>
    </div>
  );
}
