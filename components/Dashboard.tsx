
import React, { useState, useEffect } from 'react';
import { Gauge } from './Gauge';
import { SERVER_INFO } from '../constants';
import { getServerInsights } from '../services/geminiService';

interface DashboardProps {
  onViewScreen: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewScreen }) => {
  const [insight, setInsight] = useState("Analyzing system performance...");
  const [stats, setStats] = useState({
    ramUsed: 14.2,
    ramTotal: 32,
    cpuUsage: 45,
    hddUsed: 0.8,
    hddTotal: 2.0
  });

  useEffect(() => {
    // In a real app, this would poll the /api/stats endpoint
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        cpuUsage: Math.floor(Math.random() * (60 - 30) + 30)
      }));
    }, 3000);

    const fetchInsight = async () => {
      const text = await getServerInsights(stats);
      setInsight(text || "Infrastructure stable.");
    };
    fetchInsight();
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-top-4 duration-700">
      
      {/* Top Hero Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge 
                percentage={(stats.ramUsed / stats.ramTotal) * 100} 
                label="RAM" 
                sublabelText={`${stats.ramUsed}GB / ${stats.ramTotal}GB`} 
              />
           </div>
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge 
                percentage={stats.cpuUsage} 
                label="CPU" 
                sublabelText={`${stats.cpuUsage}% LOAD`} 
              />
           </div>
           <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center">
              <Gauge 
                percentage={(stats.hddUsed / stats.hddTotal) * 100} 
                label="STORAGE" 
                sublabelText={`${stats.hddUsed}TB / ${stats.hddTotal}TB`} 
              />
           </div>
        </div>

        <button 
          onClick={onViewScreen}
          className="relative overflow-hidden bg-green-600 rounded-3xl group transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-green-900/20"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
            <svg className="w-12 h-12 mb-4 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span className="text-4xl font-black uppercase tracking-tighter leading-none">View<br/>Screen</span>
            <span className="text-[10px] mt-4 font-bold opacity-60 uppercase tracking-widest">Open VNC Relay</span>
          </div>
        </button>
      </div>

      {/* System Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-10 space-y-6">
           <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest mb-4">Hardware Specifications</h3>
           <div className="space-y-4 font-mono">
              <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-zinc-500">Device</span>
                 <span className="text-white">{SERVER_INFO.deviceName}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-zinc-500">Processor</span>
                 <span className="text-white text-right max-w-[200px] truncate">{SERVER_INFO.cpuModel}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                 <span className="text-zinc-500">Platform</span>
                 <span className="text-white">{SERVER_INFO.os}</span>
              </div>
              <div className="flex justify-between">
                 <span className="text-zinc-500">Disk Array</span>
                 <span className="text-white">{SERVER_INFO.hddModel}</span>
              </div>
           </div>
        </div>

        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-10 flex flex-col">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <h3 className="text-xs font-black text-zinc-500 uppercase tracking-widest">System Intelligence (Gemini)</h3>
           </div>
           <div className="flex-1 flex items-center justify-center italic text-lg text-zinc-300 leading-relaxed text-center px-4">
              "{insight}"
           </div>
           <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center text-[10px] font-bold text-zinc-600">
              <span>MODEL: gemini-3-flash</span>
              <span className="uppercase">Real-time Analysis</span>
           </div>
        </div>
      </div>
    </div>
  );
};
