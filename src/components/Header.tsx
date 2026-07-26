import React from 'react';
import { User } from '../types';
import { GraduationCap, Code, Play, LogOut, UserCheck, Shield, BookOpen } from 'lucide-react';

interface HeaderProps {
  activeTab: 'simulasi' | 'gascode' | 'guide';
  setActiveTab: (tab: 'simulasi' | 'gascode' | 'guide') => void;
  currentUser: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onLogout,
  onOpenLogin,
}) => {
  const getRoleBadge = (role?: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-600 text-white';
      case 'TIM TATIB':
        return 'bg-amber-500 text-white';
      case 'GURU':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-slate-500 text-white';
    }
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-white tracking-wide">SITATIB</span>
                <span className="text-[10px] bg-blue-500/20 text-blue-300 font-mono px-2 py-0.5 rounded border border-blue-500/30">
                  v1.0 GAS
                </span>
              </div>
              <p className="text-xs text-slate-400">SMAN 1 Yosowilangun</p>
            </div>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="hidden md:flex items-center p-1 bg-slate-800 rounded-lg border border-slate-700/60">
            <button
              onClick={() => setActiveTab('simulasi')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'simulasi'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>Simulasi Web App</span>
            </button>
            <button
              onClick={() => setActiveTab('gascode')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'gascode'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>API & Panduan</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                activeTab === 'guide'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Panduan Setup</span>
            </button>
          </div>

          {/* User Status / Login Logout */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-semibold text-slate-200">{currentUser.nama}</div>
                  <span
                    className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${getRoleBadge(
                      currentUser.role
                    )}`}
                  >
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm"
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Login User</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Submenu Tabs */}
        <div className="md:hidden flex items-center justify-around py-2 border-t border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('simulasi')}
            className={`flex items-center space-x-1 py-1 px-2 rounded ${
              activeTab === 'simulasi' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Play className="w-3 h-3" />
            <span>Simulasi App</span>
          </button>
          <button
            onClick={() => setActiveTab('gascode')}
            className={`flex items-center space-x-1 py-1 px-2 rounded ${
              activeTab === 'gascode' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>API & Panduan</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`flex items-center space-x-1 py-1 px-2 rounded ${
              activeTab === 'guide' ? 'text-blue-400 font-bold' : 'text-slate-400'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span>Panduan</span>
          </button>
        </div>
      </div>
    </header>
  );
};
