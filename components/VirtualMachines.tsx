
import React, { useState, useEffect } from 'react';
import { VirtualMachine } from '../types';

export const VirtualMachines: React.FC = () => {
  const [vms, setVms] = useState<VirtualMachine[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVms = async () => {
    try {
      const res = await fetch('/api/system/vms');
      const data = await res.json();
      setVms(data);
    } catch (e) {
      console.error("Failed to fetch VMs", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVms();
    const interval = setInterval(fetchVms, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Virtual Machines</h2>
          <p className="text-gray-500 mt-1">KVM/QEMU Infrastructure Management</p>
        </div>
        <button className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-green-900/20">
          Create VM
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
          <div className="text-center py-20 text-zinc-600 animate-pulse uppercase text-xs tracking-widest italic">Querying Libvirt Daemon...</div>
        ) : vms.length === 0 ? (
          <div className="bg-zinc-900/50 border border-dashed border-white/10 rounded-3xl p-20 text-center">
            <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">No Virtual Machines Detected</p>
            <p className="text-zinc-600 text-xs mt-2 italic">Ensure 'libvirtd' is running and active.</p>
          </div>
        ) : (
          vms.map((vm) => (
            <div key={vm.id} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-green-500/30 transition group">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${vm.state === 'running' ? 'bg-green-500/10 text-green-500' : 'bg-zinc-800 text-zinc-500'}`}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white">{vm.name}</h4>
                  <div className="flex gap-4 mt-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">ID: {vm.id || '---'}</span>
                    <span className={`text-[10px] font-mono uppercase font-bold ${vm.state === 'running' ? 'text-green-500' : 'text-zinc-600'}`}>
                      {vm.state}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                 <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition text-zinc-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/><path strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                 </button>
                 <button className="p-3 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition text-zinc-400 hover:text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                 </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
