
import React, { useState, useEffect } from 'react';
import { ViewMode } from './types';
import { Dashboard } from './components/Dashboard';
import { RemoteDesktop } from './components/RemoteDesktop';
import { FileManager } from './components/FileManager';
import { Login } from './components/Login';
import { Terminal } from './components/Terminal';
import { UserManagement } from './components/UserManagement';
import { Network } from './components/Network';
import { Logs } from './components/Logs';
import { VirtualMachines } from './components/VirtualMachines';
import { RootShieldIcon, UsersGroupIcon } from './constants';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isRoot, setIsRoot] = useState(false);
  const [currentView, setCurrentView] = useState<ViewMode>(ViewMode.DASHBOARD);

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
    localStorage.clear();
  };

  const NavItem = ({ mode, icon, label }: { mode: ViewMode, icon: React.ReactNode, label: string }) => (
    <button 
      onClick={() => setCurrentView(mode)}
      className={`flex flex-col md:flex-row items-center gap-2 p-3 md:p-4 rounded-2xl transition-all ${currentView === mode ? 'bg-green-600 text-white shadow-lg shadow-green-600/20' : 'text-zinc-500 hover:text-white hover:bg-white/5'}`}
    >
      {icon}
      <span className="text-[9px] md:text-xs font-bold uppercase tracking-widest hidden lg:block">{label}</span>
    </button>
  );

  if (!isAuthenticated) return <Login onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col md:flex-row">
      <nav className="w-full md:w-20 lg:w-64 bg-zinc-950 border-r border-white/5 flex md:flex-col items-center justify-around md:justify-start py-2 md:py-10 gap-0 md:gap-3 sticky top-0 h-16 md:h-screen z-50 order-2 md:order-1 overflow-y-auto">
        <div className="hidden md:flex w-12 h-12 bg-green-600 rounded-2xl items-center justify-center mb-8 italic font-black text-xl flex-shrink-0">rT</div>
        
        <NavItem mode={ViewMode.DASHBOARD} label="Stats" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>} />
        <NavItem mode={ViewMode.REMOTE_DESKTOP} label="VNC Desktop" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>} />
        <NavItem mode={ViewMode.TERMINAL} label="Terminal" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>} />
        <NavItem mode={ViewMode.VMS} label="VMs" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/></svg>} />
        <NavItem mode={ViewMode.NETWORK} label="Networking" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071a11 11 0 0115.556 0M2.121 8.828a17 17 0 0123.758 0" /></svg>} />
        <NavItem mode={ViewMode.LOGS} label="Logs" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>} />
        <NavItem mode={ViewMode.FILES} label="Explorer" icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/></svg>} />
        <NavItem mode={ViewMode.USERS} label="Users" icon={<UsersGroupIcon />} />
        
        <div className="hidden md:block mt-auto pb-6">
          <button onClick={handleLogout} className="p-4 text-zinc-600 hover:text-red-500 transition-colors"><svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg></button>
        </div>
      </nav>

      <main className="flex-1 min-h-screen order-1 md:order-2 overflow-y-auto">
        <header className="px-10 py-6 border-b border-white/5 bg-zinc-950/50 backdrop-blur sticky top-0 z-40 flex justify-between items-center">
          <h1 className="text-xl font-bold tracking-tight">rTech<span className="text-green-500">Manager</span></h1>
          <div className="flex items-center gap-6">
            {isRoot && <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-3 py-1.5 rounded-full"><RootShieldIcon /><span className="text-[10px] font-bold text-red-500 uppercase">Superuser</span></div>}
            <div className="text-right">
              <span className="text-xs font-bold block capitalize">{currentUser}</span>
              <span className="text-[9px] text-green-500 font-mono uppercase">Online Session</span>
            </div>
          </div>
        </header>
        <div className="p-8 pb-24 md:pb-8">
          {currentView === ViewMode.DASHBOARD && <Dashboard onViewScreen={() => setCurrentView(ViewMode.REMOTE_DESKTOP)} />}
          {currentView === ViewMode.REMOTE_DESKTOP && <RemoteDesktop />}
          {currentView === ViewMode.FILES && <FileManager />}
          {currentView === ViewMode.TERMINAL && <Terminal />}
          {currentView === ViewMode.USERS && <UserManagement />}
          {currentView === ViewMode.NETWORK && <Network />}
          {currentView === ViewMode.LOGS && <Logs />}
          {currentView === ViewMode.VMS && <VirtualMachines />}
        </div>
      </main>
    </div>
  );
};

export default App;
