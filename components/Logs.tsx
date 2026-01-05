
import React, { useState, useEffect, useRef } from 'react';

export const Logs: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/system/logs');
        const data = await res.json();
        setLogs(data);
      } catch (e) { console.error(e); }
    };
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [logs]);

  const getSeverityColor = (line: string) => {
    if (line.toLowerCase().includes('err') || line.toLowerCase().includes('fail')) return 'text-red-400';
    if (line.toLowerCase().includes('warn')) return 'text-yellow-400';
    return 'text-zinc-400';
  };

  return (
    <div className="max-w-6xl mx-auto bg-black border border-white/5 rounded-3xl h-[70vh] flex flex-col overflow-hidden font-mono shadow-2xl">
      <div className="bg-zinc-900/50 p-4 border-b border-white/5 flex justify-between items-center">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Journalctl Output (-n 100)</span>
        <button onClick={() => setLogs([])} className="text-xs font-bold text-zinc-500 hover:text-white uppercase">Clear View</button>
      </div>
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto text-[11px] space-y-1">
        {logs.map((line, i) => (
          <div key={i} className={`whitespace-pre-wrap ${getSeverityColor(line)}`}>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};
