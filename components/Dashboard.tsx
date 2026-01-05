
import React, { useState, useEffect } from 'react';
import { Gauge } from './Gauge';
import { SystemStats } from '../types';

interface DashboardProps {
  onViewScreen: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewScreen }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<SystemStats>({
    ramUsed: 0, ramTotal: 0, cpuUsage: 0, hddUsed: 0, hddTotal: 0
  });

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/system/stats');
      if (res.ok) {
        setStats(await res.json());
      }
    } catch (e) { 
      console.error("Stats fetch failed", e); 
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    window.open(`https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    setSearchQuery("");
  };

  useEffect(() => {
    fetchStats();
    const statsInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(statsInterval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* Heimdall Style Search Bar (Direct Google Search, NO AI) */}
      <div className="relative z-10">
        <form onSubmit={handleSearch} className="relative group">
          <div className="absolute inset-0 bg-green-500/5 blur-3xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
          <input 
            type="text"
            placeholder="Search Google..."
            className="w-full bg-zinc-900/60 border border-white/10 rounded-[2rem] py-6 px-8 pl-16 text-xl focus:outline-none focus:border-green-500/40 transition-all backdrop-blur-2xl shadow-2xl placeholder-zinc-700"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <button 
            type="submit" 
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-white text-black text-[10px] font-black px-6 py-3 rounded-2xl uppercase tracking-widest hover:bg-green-500 hover:text-white transition shadow-xl"
          >
            Google Search
          </button>
        </form>
      </div>

      {/* Cockpit Style Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center backdrop-blur-sm">
              <Gauge 
                percentage={stats.ramTotal > 0 ? (stats.ramUsed / stats.ramTotal) * 100 : 0} 
                label="MEMORY" 
                sublabelText={`${stats.ramUsed.toFixed(1)}GB / ${stats.ramTotal.toFixed(1)}GB`} 
              />
           </div>
           <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center backdrop-blur-sm">
              <Gauge 
                percentage={stats.cpuUsage} 
                label="PROCESSOR" 
                sublabelText={`${stats.cpuUsage.toFixed(1)}% LOAD`} 
              />
           </div>
           <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center justify-center backdrop-blur-sm">
              <Gauge 
                percentage={stats.hddTotal > 0 ? (stats.hddUsed / stats.hddTotal) * 100 : 0} 
                label="STORAGE" 
                sublabelText={`${stats.hddUsed.toFixed(1)}GB / ${stats.hddTotal.toFixed(1)}GB`} 
              />
           </div>
        </div>

        <button 
          onClick={onViewScreen}
          className="relative overflow-hidden bg-green-600 rounded-[2.5rem] group transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-green-900/30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <svg className="w-14 h-14 mb-4 transform group-hover:-translate-y-2 transition-transform duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span className="text-4xl font-black uppercase tracking-tighter leading-none italic">View<br/>Remote</span>
          </div>
        </button>
      </div>

      {/* Simple Status Footer */}
      <div className="bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 flex justify-between items-center backdrop-blur-sm px-10">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">System Monitor Active</span>
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">
          rTechManager v1.4.2 // Pure Hardware Mode
        </div>
      </div>
    </div>
  );
};
