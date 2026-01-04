
import React, { useEffect, useRef, useState } from 'react';

export const RemoteDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let rfb: any = null;

    const initVNC = async () => {
      try {
        const { default: RFB } = await import('https://esm.sh/@novnc/novnc/core/rfb.js');
        
        const host = window.location.hostname;
        const port = window.location.port || "1783";
        // Websockify usually expects a path like /vnc or just the root of a specific port
        const url = `ws://${host}:${port}/vnc`;

        if (!containerRef.current) return;

        rfb = new RFB(containerRef.current, url, {
          credentials: { password: '' } 
        });

        rfb.addEventListener('connect', () => setStatus('connected'));
        rfb.addEventListener('disconnect', (e: any) => {
          setStatus('disconnected');
          if (!e.detail.clean) setError("VNC Stream Interrupted. Ensure TightVNC is running on :5900.");
        });

        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        rfb.focusOnClick = true;

      } catch (err) {
        setError("VNC Driver could not be initialized.");
        setStatus('disconnected');
      }
    };

    initVNC();

    return () => {
      if (rfb) rfb.disconnect();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-black overflow-hidden m-4 rounded-2xl border border-white/5">
      <div className="bg-zinc-900/80 backdrop-blur px-6 py-3 flex justify-between items-center border-b border-white/5 z-10">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-2.5 h-2.5 rounded-full ${status === 'connected' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              localhost:5900 <span className="mx-2 text-zinc-700">|</span> {status}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-bold rounded-lg transition text-gray-300 uppercase">Input</button>
          <button onClick={() => window.location.reload()} className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-[10px] font-bold rounded-lg transition text-white uppercase">Reconnect</button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#050505] flex items-center justify-center p-4 overflow-auto">
        {error && (
          <div className="absolute z-20 bg-black/90 p-8 rounded-2xl border border-red-500/20 text-center max-w-sm backdrop-blur">
            <h3 className="text-white font-bold mb-2">VNC Failure</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">{error}</p>
            <button onClick={() => window.location.reload()} className="bg-white text-black text-xs font-bold px-6 py-2 rounded-lg">Retry Handshake</button>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full min-w-[800px] min-h-[600px] flex items-center justify-center shadow-2xl">
          {/* noVNC injects its canvas here */}
        </div>
      </div>
    </div>
  );
};
