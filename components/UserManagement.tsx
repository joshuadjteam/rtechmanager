
import React from 'react';
import { UserIcon } from '../constants';

export const UserManagement: React.FC = () => {
  const users = [
    { username: 'root', lastLogin: 'Just now', privileges: 'Superuser', status: 'Active' },
    { username: 'mint-user', lastLogin: '2 hours ago', privileges: 'Standard', status: 'Active' },
    { username: 'guest-1', lastLogin: 'Yesterday', privileges: 'Restricted', status: 'Inactive' },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
          <p className="text-gray-500 mt-1">Manage system accounts and access privileges</p>
        </div>
        <button className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded-xl font-bold text-sm transition shadow-lg shadow-green-900/20">
          Create New User
        </button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.username} className="bg-zinc-900 border border-white/5 rounded-2xl p-6 flex items-center justify-between hover:border-green-500/30 transition group">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-500 group-hover:text-green-500 transition">
                <UserIcon />
              </div>
              <div>
                <p className="text-xl font-bold text-white flex items-center gap-2">
                  {user.username}
                  {user.username === 'root' && (
                    <span className="text-[10px] bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full uppercase tracking-widest font-mono">System</span>
                  )}
                </p>
                <p className="text-sm text-gray-500">Privileges: {user.privileges}</p>
              </div>
            </div>
            
            <div className="text-right flex items-center gap-12">
              <div className="hidden md:block">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Last Activity</p>
                <p className="text-sm text-white">{user.lastLogin}</p>
              </div>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg text-xs font-bold transition">Settings</button>
                {user.username !== 'root' && (
                  <button className="px-4 py-2 bg-red-900/20 hover:bg-red-900/40 text-red-500 rounded-lg text-xs font-bold transition">Delete</button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
