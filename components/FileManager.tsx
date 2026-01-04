
import React from 'react';
import { FolderIcon } from '../constants';

export const FileManager: React.FC = () => {
  return (
    <div className="min-h-screen bg-black p-8 flex flex-col">
      {/* Top Navigation Bars */}
      <div className="flex gap-4 mb-16">
        <button className="bg-sky-500 text-black px-8 py-3 rounded-lg text-sm font-bold flex flex-col items-center min-w-[200px]">
          <span>/mnt/sda1/home</span>
          <span className="text-[10px] font-normal opacity-70">(Your on)</span>
        </button>
        <button className="bg-gray-200 text-black px-8 py-3 rounded-lg text-sm font-bold min-w-[200px] flex items-center justify-center">
          smb://10.92.10.1/
        </button>
      </div>

      {/* Directory Content */}
      <div className="flex flex-col gap-6 ml-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 bg-gray-300 p-2 pr-12 rounded-lg w-fit transition hover:bg-white cursor-pointer group">
            <div className="bg-gray-600 p-2 rounded shadow-inner">
               <FolderIcon />
            </div>
            <span className="text-black text-xl font-bold">User</span>
          </div>
        ))}
      </div>

      {/* Usage Statistics at Bottom */}
      <div className="mt-auto pt-16 space-y-4">
        <p className="text-7xl font-bold tracking-tight">1TB Used out of 2TB</p>
        <p className="text-7xl font-bold tracking-tight">500 GB Used in this Directory</p>
      </div>
    </div>
  );
};
