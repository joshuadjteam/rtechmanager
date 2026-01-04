
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { Dashboard } from './components/Dashboard';
import { RemoteDesktop } from './components/RemoteDesktop';
import { FileManager } from './components/FileManager';
import { Login } from './components/Login';
import { UserManagement } from './components/UserManagement';
import { RootShieldIcon, UsersGroupIcon } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isRoot, setIsRoot] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode | 'USERS'>(ViewMode.DASHBOARD);

  useEffect(() => {
    const savedUser = localStorage.getItem('rTech_user');
    const rootStatus = localStorage.getItem('rTech_isRoot') === 'true';
    if (savedUser) {
      setCurrentUser(savedUser);
      setIsRoot(rootStatus);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (user: string, root: boolean) => {
    setCurrentUser(user);
    setIsRoot(root);
    setIsAuthenticated(true);
    localStorage.setItem('rTech_user', user);
    localStorage.setItem('rTech_isRoot', String(root));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsRoot(false);
    localStorage.clear();
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewMode.DASHBOARD:
        return <Dashboard onViewScreen={() => setCurrentView(ViewMode.REMOTE_DESKTOP)} />;
      case ViewMode.REMOTE_DESKTOP:
        return <RemoteDesktop />;
      case ViewMode.FILES:
        return <FileManager />;
      case 'USERS':
        return <UserManagement />;
      default:
        return <Dashboard onViewScreen={() => setCurrentView(ViewMode.REMOTE_DESKTOP)} />;
    }
  };

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-green-500/30 flex">
      <nav className="w-20 bg-zinc-950 flex flex-col items-center py-10 gap-8 border-r border-white/5 h-screen sticky top-0 shrink-0 z-50">
        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-900/40 mb-4 transition hover:rotate-6 cursor-pointer">
           <span className="font-black text-xl italic">rT</span>
        </div>

        <button 
          onClick={() => setCurrentView(ViewMode.DASHBOARD)}
          className={`p-4 rounded-2xl transition-all ${currentView === ViewMode.DASHBOARD ? 'bg-green-600 shadow-xl' : 'text-gray-600 hover:text-gray-300'}`}
          title="Dashboard"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
        </button>

        <button 
          onClick={() => setCurrentView(ViewMode.REMOTE_DESKTOP)}
          className={`p-4 rounded-2xl transition-all ${currentView === ViewMode.REMOTE_DESKTOP ? 'bg-green-600 shadow-xl' : 'text-gray-600 hover:text-gray-300'}`}
          title="Remote Desktop"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
        </button>

        <button 
          onClick={() => setCurrentView(ViewMode.FILES)}
          className={`p-4 rounded-2xl transition-all ${currentView === ViewMode.FILES ? 'bg-green-600 shadow-xl' : 'text-gray-600 hover:text-gray-300'}`}
          title="File Manager"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" /></svg>
        </button>

        {isRoot && (
          <button 
            onClick={() => setCurrentView('USERS')}
            className={`p-4 rounded-2xl transition-all ${currentView === 'USERS' ? 'bg-green-600 shadow-xl' : 'text-gray-600 hover:text-gray-300'}`}
            title="User Management"
          >
            <UsersGroupIcon />
          </button>
        )}

        <div className="mt-auto space-y-6 pb-6">
          <button onClick={handleLogout} className="p-4 text-red-500/50 hover:text-red-500 transition-colors" title="Logout">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </nav>

      <main className="flex-1 min-h-screen">
        <header className="px-10 py-6 border-b border-white/5 bg-zinc-950/50 backdrop-blur sticky top-0 z-40 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">rTech<span className="text-green-500">Manager</span></h1>
            <div className="flex items-center gap-2 mt-0.5">
               <span className="text-[10px] text-gray-500 font-mono tracking-widest uppercase">Linux Mint Console @ Port 1783</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
             {isRoot && (
               <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full">
                  <RootShieldIcon />
                  <span className="text-[10px] font-bold text-red-500 uppercase">Root Privileges Active</span>
               </div>
             )}
             <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-white">{currentUser}</span>
                <span className="text-[9px] text-green-500 font-mono uppercase tracking-tighter">System Session</span>
             </div>
             <div className="w-11 h-11 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden ring-2 ring-white/5">
                <img src={`https://ui-avatars.com/api/?name=${currentUser}&background=059669&color=fff&bold=true`} alt="User" />
             </div>
          </div>
        </header>
        
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default App;
