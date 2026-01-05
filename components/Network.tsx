
import React, { useState, useEffect } from 'react';

export const Network: React.FC = () => {
  const [interfaces, setInterfaces] = useState<any[]>([]);

  useEffect(() => {
    const fetchNet = async () => {
      try {
        const res = await fetch('/api/system/network');
        setInterfaces(await res.json());
      } catch (e) { console.error(e); }
    };
    fetchNet();
    const interval = setInterval(fetchNet, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Network Interfaces</h2>
      <div className="grid gap-4">
        {interfaces.map((iface) => (
          <div key={iface.ifname} className="bg-zinc-900 border border-white/5 p-6 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`w-3 h-3 rounded-full ${iface.operstate === 'UP' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
              <div>
                <h4 className="font-mono text-lg font-bold">{iface.ifname}</h4>
                <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">{iface.link_type}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold">{iface.addr_info?.[0]?.local || 'No IP'}</p>
              <p className="text-[10px] text-zinc-600 font-mono">{iface.address || 'No MAC'}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
