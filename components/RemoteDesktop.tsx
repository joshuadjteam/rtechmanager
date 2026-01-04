
import React, { useEffect, useRef, useState } from 'react';

export const RemoteDesktop: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<'connecting' | 'connected' | 'disconnected'>('connecting');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let rfb: any = null;

    const initVNC = async () => {
      try {
        // Dynamic import of noVNC
        const { default: RFB } = await import('https://esm.sh/@novnc/novnc/core/rfb.js');
        
        const host = window.location.hostname;
        const port = window.location.port || "1783";
        // The path /vnc is intercepted by server.js and proxied to Websockify
        const url = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${host}:${port}/vnc`;

        if (!containerRef.current) return;

        console.log(`Attempting VNC handshake with ${url}...`);

        rfb = new RFB(containerRef.current, url, {
          credentials: { password: '' } // Password handled via system auth or pre-shared VNC pass
        });

        rfb.addEventListener('connect', () => {
          console.log('VNC Connected Successfully');
          setStatus('connected');
        });

        rfb.addEventListener('disconnect', (e: any) => {
          setStatus('disconnected');
          if (!e.detail.clean) {
             setError("VNC Stream Interrupted. Verify TightVNC and Websockify are active on the server.");
          }
        });

        // Optimization settings
        rfb.scaleViewport = true;
        rfb.resizeSession = true;
        rfb.focusOnClick = true;
        rfb.qualityLevel = 6;
        rfb.compressionLevel = 2;

      } catch (err) {
        setError("VNC Driver initialization failed.");
        setStatus('disconnected');
      }
    };

    initVNC();

    return () => {
      if (rfb) {
        try { rfb.disconnect(); } catch(e) {}
      }
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-black overflow-hidden m-4 rounded-3xl border border-white/5 shadow-2xl">
      <div className="bg-zinc-900/90 backdrop-blur px-8 py-4 flex justify-between items-center border-b border-white/5 z-10">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${status === 'connected' ? 'bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">
                VNC SESSION :1
              </span>
              <span className="text-[9px] text-zinc-500 font-mono mt-1 uppercase">
                {status === 'connected' ? 'Encrypted Stream Active' : 'Waiting for Handshake...'}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="px-5 py-2 bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black rounded-xl transition text-zinc-300 uppercase tracking-widest border border-white/5">
            Settings
          </button>
          <button 
            onClick={() => window.location.reload()} 
            className="px-5 py-2 bg-green-600 hover:bg-green-500 text-[10px] font-black rounded-xl transition text-white uppercase tracking-widest shadow-lg shadow-green-900/20"
          >
            Re-Sync
          </button>
        </div>
      </div>
      
      <div className="flex-1 relative bg-[#020202] flex items-center justify-center overflow-hidden">
        {status === 'connecting' && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-10">
             <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
             <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.3em]">Initializing RFB Protocol</p>
          </div>
        )}

        {error && (
          <div className="absolute z-20 bg-zinc-900/95 p-10 rounded-3xl border border-red-500/20 text-center max-w-sm backdrop-blur-xl shadow-2xl">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <h3 className="text-white font-black text-lg mb-2 uppercase tracking-tight">Handshake Failed</h3>
            <p className="text-zinc-500 text-xs mb-8 leading-relaxed font-medium">{error}</p>
            <button onClick={() => window.location.reload()} className="w-full bg-white text-black text-[10px] font-black py-4 rounded-xl uppercase tracking-widest hover:bg-green-500 hover:text-white transition-all">
              Retry Protocol Initialization
            </button>
          </div>
        )}

        <div ref={containerRef} className="w-full h-full flex items-center justify-center shadow-inner no-vnc-canvas-container">
          {/* noVNC Canvas Injected Here */}
        </div>
      </div>
    </div>
  );
};
