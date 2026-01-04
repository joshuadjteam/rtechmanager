
import React from 'react';

export const SERVER_INFO = {
  deviceName: 'Mint-Server-01',
  ram: '32GB DDR4',
  hddModel: 'Foxaing 2TB NVMe SSD',
  cpuModel: 'Intel Core i9-13900K @ 3.2GHz',
  os: 'Linux Mint 22.1 Xia (Cinnamon Edition)'
};

export const FolderIcon = () => (
  <svg className="w-10 h-10 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M10 4H4c-1.11 0-2 .89-2 2v12c0 1.1.89 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z" />
  </svg>
);

export const UserIcon = () => (
  <svg className="w-12 h-12 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

export const RootShieldIcon = () => (
  <svg className="w-5 h-5 text-rose-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 6h2v2h-2V7zm0 4h2v6h-2v-6z" />
  </svg>
);

export const UsersGroupIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);
