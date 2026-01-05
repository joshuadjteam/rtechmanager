
import React, { useState, useEffect } from 'react';
import { Gauge } from './Gauge';
import { getServerInsights, getSearchResponse } from '../services/geminiService';
import { SystemStats, ServerInfo, GroundingChunk } from '../types';

interface DashboardProps {
  onViewScreen: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewScreen }) => {
  const [insight, setInsight] = useState("Analyzing system performance...");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState<{text: string, sources: any[]} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [stats, setStats] = useState<SystemStats>({
    ramUsed: 0, ramTotal: 0, cpuUsage: 0, hddUsed: 0, hddTotal: 0
  });
  const [info, setInfo] = useState<ServerInfo | null>(null);

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/system/stats');
      const data = await res.json();
      setStats(data);
    } catch (e) { console.error(e); }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const res = await getSearchResponse(searchQuery);
    setSearchResult(res);
    setIsSearching(false);
  };

  useEffect(() => {
    fetchStats();
    const fetchInfo = async () => {
      const res = await fetch('/api/system/info');
      setInfo(await res.json());
    };
    fetchInfo();
    const statsInterval = setInterval(fetchStats, 5000);
    return () => clearInterval(statsInterval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      
      {/* Heimdall Search Bar */}
      <div className="relative">
        <form onSubmit={handleSearch} className="relative group">
          <input 
            type="text"
            placeholder="Search documentation, web, or system help..."
            className="w-full bg-zinc-900/80 border border-white/10 rounded-2xl py-5 px-6 pl-14 text-lg focus:outline-none focus:border-green-500/50 transition-all backdrop-blur-md shadow-2xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="absolute left-5 top-1/2 -translate-y-1/2 text-zinc-500">
            {isSearching ? <div className="w-5 h-5 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div> : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            )}
          </div>
          <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 bg-zinc-800 text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest hover:bg-green-600 transition">Ground Search</button>
        </form>

        {searchResult && (
          <div className="mt-4 p-6 bg-zinc-900 border border-white/10 rounded-2xl animate-in slide-in-from-top-2">
            <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-green-500 uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded">Web Answer</span>
              <button onClick={() => setSearchResult(null)} className="text-zinc-500 hover:text-white"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 18L18 6M6 6l12 12" strokeWidth={2}/></svg></button>
            </div>
            <p className="text-sm leading-relaxed text-zinc-300">{searchResult.text}</p>
            {searchResult.sources.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchResult.sources.map((chunk: any, i: number) => (
                  chunk.web && (
                    <a key={i} href={chunk.web.uri} target="_blank" className="text-[10px] bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-white/5 transition flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2}/></svg>
                      {chunk.web.title || "Source"}
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge percentage={stats.ramTotal > 0 ? (stats.ramUsed / stats.ramTotal) * 100 : 0} label="RAM" sublabelText={`${stats.ramUsed.toFixed(1)}G/${stats.ramTotal.toFixed(1)}G`} />
           </div>
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge percentage={stats.cpuUsage} label="CPU" sublabelText={`${stats.cpuUsage.toFixed(1)}% LOAD`} />
           </div>
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge percentage={stats.hddTotal > 0 ? (stats.hddUsed / stats.hddTotal) * 100 : 0} label="STORAGE" sublabelText={`${stats.hddUsed.toFixed(1)}G/${stats.hddTotal.toFixed(1)}G`} />
           </div>
        </div>
        <button onClick={onViewScreen} className="bg-green-600 rounded-3xl p-8 flex flex-col items-center justify-center text-center hover:scale-[1.02] transition shadow-2xl shadow-green-900/20">
            <span className="text-4xl font-black uppercase tracking-tighter">View<br/>VNC</span>
        </button>
      </div>

      <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8">
        <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">System Intelligence</h3>
        <p className="text-xl italic text-zinc-300">"{insight}"</p>
      </div>
    </div>
  );
};
