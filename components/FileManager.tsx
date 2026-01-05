import React, { useState, useEffect } from 'react';
import { FolderIcon, FileIcon } from '../constants';

export const FileManager: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/home');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFiles = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/fs/list?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setItems(data.items || []);
      setCurrentPath(data.currentPath);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles(currentPath);
  }, []);

  const navigate = (name: string) => {
    const newPath = currentPath === '/' ? `/${name}` : `${currentPath}/${name}`;
    fetchFiles(newPath);
  };

  const goBack = () => {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    const newPath = '/' + parts.join('/');
    fetchFiles(newPath);
  };

  return (
    <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      <div className="bg-zinc-900/50 border border-white/5 p-4 rounded-2xl mb-4 md:mb-8 flex items-center gap-4">
        <button onClick={goBack} className="p-2 hover:bg-white/5 rounded-lg text-zinc-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeWidth={2}/></svg></button>
        <div className="flex-1 bg-black/40 border border-white/5 rounded-xl px-4 py-2 text-xs md:text-sm font-mono truncate">
          <span className="text-green-500">root@mint</span>:<span className="text-white">{currentPath}</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {loading ? (
          <div className="h-40 flex items-center justify-center text-zinc-600 animate-pulse">Syncing I/O...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {items.map((item) => (
              <div 
                key={item.name} 
                onClick={() => item.type === 'folder' && navigate(item.name)}
                className="group cursor-pointer text-center"
              >
                <div className="aspect-square bg-zinc-900/30 border border-white/5 rounded-3xl flex items-center justify-center mb-2 group-hover:bg-zinc-800 transition overflow-hidden relative">
                  {item.type === 'folder' ? <FolderIcon /> : <FileIcon />}
                </div>
                <p className="text-xs font-bold text-zinc-200 truncate group-hover:text-white px-1">{item.name}</p>
                <p className="text-[9px] font-mono text-zinc-600 uppercase mt-0.5">{item.size}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
