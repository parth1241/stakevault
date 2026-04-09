'use client';

import { Globe, MessageSquare, Mail, Terminal, Code2, ShieldCheck, Database } from 'lucide-react';

export default function TeamPage() {
  const members = [
    {
      name: "Parth Karan",
      role: "Lead Architect",
      bio: "Smart contract engineer specializing in Rust and Soroban. Builder of decentralized financial primitives.",
      icon: Terminal,
      color: "text-primary"
    },
    {
      name: "Alex Rivera",
      role: "Frontend Lead",
      bio: "UI/UX obsessed developer crafting the 'Electric Violet' visual language of StakeVault.",
      icon: Code2,
      color: "text-accent-fuchsia"
    },
    {
      name: "Sarah Chen",
      role: "Security Audit",
      bio: "Cybersecurity specialist focused on identifying and mitigating smart contract vulnerabilities.",
      icon: ShieldCheck,
      color: "text-accent-indigo"
    },
    {
      name: "Marcus Doe",
      role: "Backend Engineer",
      bio: "Data architecture lead managing the high-performance MongoDB protocol synchronization.",
      icon: Database,
      color: "text-accent-cyan"
    }
  ];

  return (
    <div className="pt-20 pb-32 space-y-20">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8 text-primary font-bold text-xs uppercase tracking-widest">
           Core Contributors
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Meet the <span className="gradient-text">Architects</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          The globally distributed team behind the StakeVault protocol. We are developers, 
          security researchers, and DeFi enthusiasts.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((m) => (
            <div key={m.name} className="card-surface p-8 group hover:border-primary/50 transition-all text-center">
              <div className={`w-20 h-20 bg-high rounded-3xl mx-auto flex items-center justify-center ${m.color} mb-6 group-hover:scale-110 transition-transform`}>
                 <m.icon size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{m.name}</h3>
              <p className="text-xs font-black uppercase tracking-widest text-primary mb-6">{m.role}</p>
              <p className="text-text-secondary text-sm leading-relaxed mb-8">
                {m.bio}
              </p>
              <div className="flex justify-center gap-4">
                 <SocialLink icon={Globe} />
                 <SocialLink icon={MessageSquare} />
                 <SocialLink icon={Mail} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Philosophy */}
      <section className="max-w-4xl mx-auto px-6 bg-surface/50 border border-border-subtle rounded-[3rem] p-16 text-center space-y-8">
         <h2 className="text-3xl font-black text-text-primary underline decoration-primary decoration-4 underline-offset-8">Our Philosophy</h2>
         <p className="text-lg text-text-secondary leading-relaxed">
            We believe in "Open Source First." Every line of code in StakeVault is public and verifiable. 
            By building in the open, we allow the community to audit, contribute, and trust 
            the systems they use for their financial future.
         </p>
      </section>
    </div>
  );
}

function SocialLink({ icon: Icon }: any) {
  return (
    <a href="#" className="p-2 bg-high rounded-lg text-text-muted hover:text-primary transition-colors border border-border-subtle">
       <Icon size={16} />
    </a>
  );
}
