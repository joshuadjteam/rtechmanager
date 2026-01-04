
import React from 'react';
import { FolderIcon, FileIcon } from '../constants';

export const FileManager: React.FC = () => {
  const folders = [
    { name: 'Documents', size: '1.2 GB' },
    { name: 'Downloads', size: '4.5 GB' },
    { name: 'Pictures', size: '8.1 GB' },
    { name: 'Videos', size: '124 GB' },
    { name: 'Desktop', size: '256 MB' }
  ];

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Location Bar */}
      <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl mb-8 flex items-center gap-4">
        <div className="flex gap-2">
           <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg></button>
           <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 transition"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg></button>
        </div>
        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 flex items-center gap-2 text-sm">
           <span className="text-green-500 font-bold">/</span>
           <span className="text-zinc-500">home</span>
           <span className="text-green-500">/</span>
           <span className="text-white font-medium">user</span>
        </div>
        <button className="bg-green-600 hover:bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition">Upload</button>
      </div>

      {/* Main Grid */}
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {folders.map((folder) => (
            <div key={folder.name} className="group cursor-pointer">
               <div className="aspect-square bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-center mb-3 group-hover:bg-zinc-800 transition group-hover:border-green-500/30 shadow-sm overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FolderIcon />
               </div>
               <div className="text-center">
                  <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white">{folder.name}</p>
                  <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter mt-0.5">{folder.size}</p>
               </div>
            </div>
          ))}
          
          <div className="group cursor-pointer">
             <div className="aspect-square bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-center mb-3 group-hover:bg-zinc-800 transition shadow-sm">
                <FileIcon />
             </div>
             <div className="text-center">
                <p className="text-sm font-bold text-zinc-200 truncate group-hover:text-white">config.yaml</p>
                <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-tighter mt-0.5">12 KB</p>
             </div>
          </div>
        </div>
      </div>

      {/* Storage Footer */}
      <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center text-zinc-500">
         <div className="flex gap-10">
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Total Capacity</p>
               <p className="text-xl font-black text-white">2.0 TB <span className="text-xs font-normal text-zinc-500">SSD</span></p>
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Free Space</p>
               <p className="text-xl font-black text-green-500">1.2 TB <span className="text-xs font-normal text-zinc-500">(60%)</span></p>
            </div>
         </div>
         <div className="text-right">
            <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-700">SMB://10.92.10.1</p>
         </div>
      </div>
    </div>
  );
};
