
import React, { useState } from 'react';

interface LoginProps {
  onLogin: (user: string, isRoot: boolean) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('root');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        const data = await response.json();
        onLogin(data.username, data.isRoot);
      } else {
        const errData = await response.json();
        setError(errData.error || "Authentication failed. Check system logs.");
      }
    } catch (err) {
      setError("Network error: Is rTechManager backend running on port 1783?");
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#050505] z-[100]">
      <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>
      
      <div className="relative w-full max-w-sm p-1 bg-zinc-800 rounded-3xl shadow-2xl overflow-hidden group">
        <div className="bg-zinc-900 p-8 rounded-[22px]">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-green-900/50 transform -rotate-3 transition-transform group-hover:rotate-0">
               <span className="text-white font-black text-2xl italic">rT</span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight uppercase">rTech Manager</h2>
            <p className="text-zinc-500 text-[10px] font-bold mt-2 uppercase tracking-[0.2em]">System Auth Protocol</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border-l-4 border-red-500 text-red-500 text-[10px] font-bold uppercase tracking-wider">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Linux User</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-green-600 transition-colors placeholder-zinc-800"
                placeholder="root"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest ml-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-green-600 transition-colors placeholder-zinc-800"
                placeholder="••••••••"
                required
              />
            </div>
            <button 
              type="submit"
              disabled={isLoggingIn}
              className="w-full bg-white text-black font-black py-4 rounded-xl mt-4 transition-all hover:bg-green-500 hover:text-white disabled:opacity-50 uppercase text-xs tracking-widest"
            >
              {isLoggingIn ? "Syncing..." : "Initialize Session"}
            </button>
          </form>
          
          <div className="mt-12 text-center opacity-20">
             <div className="text-[8px] text-zinc-400 font-mono">SECURE BRIDGE v1.4.2 // Mint 22.1</div>
          </div>
        </div>
      </div>
    </div>
  );
};
