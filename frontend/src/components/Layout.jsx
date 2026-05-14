import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Car, Wrench, Users, LogOut, Settings } from 'lucide-react';
import { useLang } from '../context/LanguageContext';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLang();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!localStorage.getItem('user')) navigate('/');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const navItems = [
    { icon: LayoutDashboard, label: t.dashboard, path: '/dashboard' },
    { icon: Car,             label: t.cars,      path: '/makinat'  },
    { icon: Wrench,          label: t.services,  path: '/serviset' },
    { icon: Users,           label: t.staff,     path: '/stafi'    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-slate-900 text-slate-100 font-sans selection:bg-blue-500/30">
      {/* SIDEBAR */}
      <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shadow-xl shrink-0">
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-700">
          <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-600/20">
            <Wrench size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
            MechanicFlow
          </h2>
        </div>

        {/* Nav links */}
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {navItems.map(({ icon: Icon, label, path }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive(path)
                  ? 'bg-blue-600/10 text-blue-400 shadow-sm'
                  : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
              }`}
            >
              <Icon size={20} /> <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Bottom: profile mini + settings + logout */}
        <div className="p-4 border-t border-slate-700 space-y-1">
          {/* User mini card */}
          <div className="flex items-center gap-3 px-4 py-3 mb-1">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold shrink-0">
              {user.name?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-200 truncate">{user.name}</p>
              <p className="text-xs text-slate-500 truncate">{user.email}</p>
            </div>
          </div>

          <button
            onClick={() => navigate('/settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
              isActive('/settings')
                ? 'bg-blue-600/10 text-blue-400'
                : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
            }`}
          >
            <Settings size={20} /> <span>{t.settings}</span>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all duration-200 group"
          >
            <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">{t.logout}</span>
          </button>
        </div>
      </aside>

      {/* PAGE CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
