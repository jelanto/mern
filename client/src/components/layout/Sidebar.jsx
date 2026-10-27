import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  PiggyBank,
  ShieldCheck,
  Settings,
  LogOut,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export const Sidebar = () => {
  const { user, logout } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Budgets', path: '/budgets', icon: PiggyBank },
    { label: 'Vault Allocations', path: '/goals', icon: ShieldCheck },
    { label: 'Wealth Settings', path: '/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 z-30 bg-fin-sidebar border-r border-fin-border transition-colors duration-200">
      {/* Brand Header */}
      <div className="h-20 flex items-center px-6 gap-3.5 border-b border-fin-border">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-fin-accent to-fin-accent-secondary flex items-center justify-center shadow-lg shadow-fin-accent/20">
          <TrendingUp className="w-5 h-5 text-white" strokeWidth={2.5} />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-xl font-bold tracking-tight text-fin-text">FinFlow</span>
            <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-fin-accent/15 text-fin-accent border border-fin-accent/30">
              PRO
            </span>
          </div>
          <p className="text-xs text-fin-text-muted">Wealth Architecture</p>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-fin-text-muted uppercase">
          Menu
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 ${
                  isActive
                    ? 'bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white shadow-md shadow-fin-accent/25 font-semibold'
                    : 'text-fin-text-secondary hover:text-fin-text hover:bg-fin-card'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}

        {/* Financial Health Mini-Widget */}
        <div className="pt-6">
          <div className="p-4 rounded-2xl bg-fin-card border border-fin-border space-y-2">
            <div className="flex items-center justify-between text-xs font-medium">
              <span className="flex items-center gap-1.5 text-fin-text">
                <Sparkles className="w-3.5 h-3.5 text-fin-accent" />
                Vault Engine
              </span>
              <span className="font-bold text-emerald-400">Live</span>
            </div>
            <p className="text-[11px] text-fin-text-muted leading-tight">
              Real-time portfolio synchronized with MongoDB Cloud.
            </p>
          </div>
        </div>
      </div>

      {/* User Profile & Logout Footer */}
      <div className="p-4 border-t border-fin-border">
        <div className="flex items-center justify-between p-2 rounded-xl bg-fin-card/60 border border-fin-border/60">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-fin-accent/80 to-purple-600 flex items-center justify-center font-bold text-white text-sm shadow">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-fin-text truncate">{user?.name || 'FinFlow User'}</p>
              <p className="text-[11px] text-fin-text-muted truncate">{user?.email || 'user@finflow.io'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="p-1.5 rounded-lg text-fin-text-secondary hover:text-rose-400 hover:bg-fin-card-secondary transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
