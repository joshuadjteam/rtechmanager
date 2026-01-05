
import React, { useState, useEffect } from 'react';
import { UserIcon } from '../constants';
import { RealUser } from '../types';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<RealUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/system/users');
        const data = await res.json();
        setUsers(data);
      } catch (e) {
        console.error("Failed to fetch users", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-gray-500 mt-1">Real-time system accounts (from /etc/passwd)</p>
        </div>
        <button className="bg-zinc-800 text-zinc-500 cursor-not-allowed px-6 py-2 rounded-xl font-bold text-sm transition">
          Creation Locked
        </button>
      </div>

      <div className="grid gap-4">
        {loading ? (
           <div className="text-center py-20 text-zinc-600 animate-pulse uppercase text-xs tracking-widest">Querying System Database...</div>
        ) : users.map((user) => (
          <div key={user.username} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-green-500/30 transition group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-green-500 transition">
                <UserIcon />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  {user.username}
                  {user.uid === 0 && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">System Root</span>
                  )}
                  {user.uid >= 1000 && (
                    <span className="text-[10px] bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">Login User</span>
                  )}
                </p>
                <p className="text-sm text-gray-500 font-mono">UID: {user.uid} | Shell: {user.shell}</p>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-12">
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Home Directory</p>
                <p className="text-sm text-white font-mono">{user.home}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition">View Info</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
