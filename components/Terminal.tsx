import React, { useEffect, useRef, useState } from 'react';

export const Terminal: React.FC = () => {
  const [history, setHistory] = useState<string[]>(['[rTech Terminal v1.3]', 'Type "help" for server commands...', '']);
  const [input, setInput] = useState('');
  const wsRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${protocol}://${window.location.host}/terminal`);
    
    ws.onmessage = (event) => {
      setHistory(prev => [...prev, event.data]);
    };
    
    ws.onclose = () => setHistory(prev => [...prev, '--- Connection Closed ---']);
    wsRef.current = ws;

    return () => ws.close();
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [history]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !wsRef.current) return;
    wsRef.current.send(input + '\n');
    setInput('');
  };

  return (
    <div className="bg-zinc-950 border border-white/5 rounded-3xl h-[calc(100vh-160px)] flex flex-col overflow-hidden font-mono shadow-2xl">
      <div className="bg-zinc-900/50 p-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Interactive Bash Session</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 p-6 overflow-y-auto text-sm text-green-500/90 space-y-1">
        {history.map((line, i) => (
          <div key={i} className="whitespace-pre-wrap leading-relaxed">{line}</div>
        ))}
      </div>
      <form onSubmit={handleSend} className="p-4 bg-black/50 border-t border-white/5 flex gap-3">
        <span className="text-zinc-500">$</span>
        <input 
          type="text" 
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-transparent outline-none text-white border-none p-0 focus:ring-0"
          placeholder="Enter command..."
        />
      </form>
    </div>
  );
};
