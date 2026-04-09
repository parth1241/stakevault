'use client';

import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, Users, Wallet, Target, 
  ArrowUpRight, ArrowDownRight, Calendar, BarChart3 
} from 'lucide-react';
import { DashboardSkeleton } from '@/components/shared/Skeleton';

export const dynamic = 'force-dynamic';

const data = [
  { name: 'Jan', staked: 4000, yield: 240, stakers: 120 },
  { name: 'Feb', staked: 3000, yield: 198, stakers: 98 },
  { name: 'Mar', staked: 2000, yield: 980, stakers: 156 },
  { name: 'Apr', staked: 2780, yield: 390, stakers: 190 },
  { name: 'May', staked: 1890, yield: 480, stakers: 210 },
  { name: 'Jun', staked: 2390, yield: 380, stakers: 250 },
  { name: 'Jul', staked: 3490, yield: 430, stakers: 320 },
];

const COLORS = ['#8b5cf6', '#6366f1', '#d946ef', '#06b6d4'];

export default function AnalyticsPage() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-text-primary tracking-tight mb-2">Protocol Analytics</h1>
          <p className="text-text-secondary">Deep dive into staking patterns, yield distribution, and network growth.</p>
        </div>
        <div className="flex bg-high/50 p-1.5 rounded-2xl border border-border-subtle">
           <button className="px-6 py-2 rounded-xl text-xs font-bold bg-primary text-white shadow-lg">Last 30 Days</button>
           <button className="px-6 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary transition-all">Last 90 Days</button>
           <button className="px-6 py-2 rounded-xl text-xs font-bold text-text-muted hover:text-text-primary transition-all">Year to Date</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <KPICard label="TVL Growth" value="+24.8%" trend="up" icon={Wallet} color="text-primary" />
         <KPICard label="Staker Retention" value="92.4%" trend="up" icon={Users} color="text-accent-fuchsia" />
         <KPICard label="Avg. Yield Rate" value="8.2%" trend="down" icon={TrendingUp} color="text-accent-indigo" />
         <KPICard label="Target TVL" value="75.2%" trend="up" icon={Target} color="text-accent-cyan" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
         {/* TVL Over Time */}
         <div className="card-surface">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-lg text-text-primary">Total Value Locked (XLM)</h3>
               <BarChart3 className="text-primary" size={20} />
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                     <defs>
                        <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
                           <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                           <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                     </defs>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                     <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                        itemStyle={{ color: '#8b5cf6' }}
                     />
                     <Area type="monotone" dataKey="staked" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorStaked)" strokeWidth={4} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Distribution by Lock Period */}
         <div className="card-surface">
            <div className="flex items-center justify-between mb-8">
               <h3 className="font-bold text-lg text-text-primary">Yield Distribution</h3>
               <TrendingUp className="text-accent-fuchsia" size={20} />
            </div>
            <div className="h-[350px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                     <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{fill: 'rgba(217,70,239,0.05)'}}
                        contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                        itemStyle={{ color: '#d946ef' }}
                     />
                     <Bar dataKey="yield" fill="#d946ef" radius={[6, 6, 0, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
         <div className="lg:col-span-2 card-surface">
            <h3 className="font-bold text-lg text-text-primary mb-8">Staker Acquisition</h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1a0033" vertical={false} />
                     <XAxis dataKey="name" stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <YAxis stroke="#475569" fontSize={12} tickLine={false} axisLine={false} />
                     <Tooltip 
                        contentStyle={{ backgroundColor: '#0d0019', border: '1px solid #1a0033', borderRadius: '12px' }}
                        itemStyle={{ color: '#6366f1' }}
                     />
                     <Bar dataKey="stakers" fill="#6366f1" radius={[4, 4, 0, 0]} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         <div className="card-elevated bg-high/30 space-y-8">
            <h3 className="font-bold text-xs text-text-muted uppercase tracking-widest text-center">Portfolio Mix</h3>
             <div className="h-[200px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={[
                           { name: '7 Days', value: 400 },
                           { name: '30 Days', value: 300 },
                           { name: '90 Days', value: 300 },
                        ]}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                     >
                        {data.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                        ))}
                     </Pie>
                     <Tooltip />
                  </PieChart>
               </ResponsiveContainer>
            </div>
            <div className="space-y-3">
               <MixItem label="7 Days Lock" value="40%" color="bg-primary" />
               <MixItem label="30 Days Lock" value="30%" color="bg-accent-indigo" />
               <MixItem label="90 Days Lock" value="30%" color="bg-accent-fuchsia" />
            </div>
         </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, trend, icon: Icon, color }: any) {
  return (
    <div className="card-surface">
       <div className="flex items-center justify-between mb-4">
          <div className={`p-2 rounded-lg bg-surface border border-border-subtle ${color}`}>
             <Icon size={18} />
          </div>
          <div className={trend === 'up' ? 'text-primary' : 'text-accent-rose'}>
             {trend === 'up' ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          </div>
       </div>
       <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</p>
       <p className="text-2xl font-black text-text-primary">{value}</p>
    </div>
  );
}

function MixItem({ label, value, color }: any) {
  return (
    <div className="flex items-center justify-between">
       <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color}`} />
          <span className="text-xs text-text-secondary">{label}</span>
       </div>
       <span className="text-xs font-bold text-text-primary">{value}</span>
    </div>
  );
}
