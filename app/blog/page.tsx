'use client';

import { Calendar, User, ArrowRight, Tag, Search, TrendingUp, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
  const posts = [
    {
      title: "Introduction to Soroban: The Next Era of Smart Contracts",
      excerpt: "Learn how Soroban's Rust-based smart contracts are revolutionizing yield generation on the Stellar network.",
      date: "Oct 24, 2024",
      author: "Alex Rivera",
      category: "Education",
      image: "bg-primary/20",
      icon: Zap
    },
    {
      title: "StakeVault Security: How We Secure Your XLM",
      excerpt: "A deep dive into our non-custodial architecture and the automated safeguards built into our contract code.",
      date: "Oct 20, 2024",
      author: "Sarah Chen",
      category: "Security",
      image: "bg-accent-indigo/20",
      icon: Shield
    },
    {
      title: "Maximizing Your Staking Yield: A Strategy Guide",
      excerpt: "Comparison of lock-in periods and recovery strategies for long-term XLM holders.",
      date: "Oct 15, 2024",
      author: "Marcus Doe",
      category: "Strategy",
      image: "bg-accent-fuchsia/20",
      icon: TrendingUp
    }
  ];

  return (
    <div className="pt-20 pb-32 space-y-20">
      <section className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-6xl md:text-8xl font-black text-text-primary mb-8 tracking-tighter">
          Protocol <span className="gradient-text">Insights</span>
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Updates, education, and development logs from the StakeVault core team.
        </p>
      </section>

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-12">
           {posts.map((post, i) => (
             <article key={i} className="card-surface p-0 flex flex-col md:flex-row overflow-hidden group hover:border-primary/50 transition-all">
                <div className={`w-full md:w-72 h-64 md:h-auto ${post.image} flex items-center justify-center transition-all group-hover:scale-105`}>
                   <post.icon size={64} className="text-white opacity-40" />
                </div>
                <div className="flex-1 p-8 md:p-12 space-y-6">
                   <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em]">
                      <span className="text-primary">{post.category}</span>
                      <span className="text-text-muted">•</span>
                      <span className="text-text-muted">{post.date}</span>
                   </div>
                   <h2 className="text-3xl font-black text-text-primary group-hover:text-primary transition-colors leading-tight">
                      {post.title}
                   </h2>
                   <p className="text-text-secondary leading-relaxed">
                      {post.excerpt}
                   </p>
                   <div className="flex items-center justify-between pt-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 rounded-full bg-high flex items-center justify-center font-bold text-xs text-text-primary">
                            {post.author[0]}
                         </div>
                         <span className="text-xs font-bold text-text-secondary">{post.author}</span>
                      </div>
                      <Link href="#" className="flex items-center gap-2 text-sm font-black text-primary hover:underline group">
                         Read More <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                   </div>
                </div>
             </article>
           ))}
        </div>

        {/* Sidebar */}
        <aside className="space-y-10">
           <div className="relative">
              <input type="text" placeholder="Search articles..." className="input-field pl-10 text-sm py-3" />
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
           </div>

           <div className="card-surface">
              <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-6">Popular Tags</h3>
              <div className="flex flex-wrap gap-2">
                 {['Soroban', 'Security', 'Rust', 'Yield', 'XLM', 'Audit', 'Stellar'].map((tag) => (
                   <span key={tag} className="px-3 py-1.5 bg-high rounded-lg text-[10px] font-bold text-text-secondary hover:bg-primary/20 hover:text-primary cursor-pointer transition-all">
                      #{tag}
                   </span>
                 ))}
              </div>
           </div>

           <div className="card-elevated bg-primary/5 border-primary/20">
              <h3 className="text-xs font-black text-primary uppercase tracking-widest mb-4">Newsletter</h3>
              <p className="text-xs text-text-secondary mb-6 leading-relaxed">
                 Get the latest protocol updates and yield rates directly in your inbox.
              </p>
              <div className="space-y-3">
                 <input type="email" placeholder="email@example.com" className="input-field text-xs py-2.5" />
                 <button className="btn-primary w-full py-2.5 text-xs">Subscribe</button>
              </div>
           </div>
        </aside>
      </section>
    </div>
  );
}
