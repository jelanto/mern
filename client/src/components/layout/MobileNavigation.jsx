import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ArrowLeftRight,
  BarChart3,
  PiggyBank,
  ShieldCheck,
  Settings,
  Menu,
  X,
  TrendingUp,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export const MobileNavigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Transactions', path: '/transactions', icon: ArrowLeftRight },
    { label: 'Analytics', path: '/analytics', icon: BarChart3 },
    { label: 'Budgets', path: '/budgets', icon: PiggyBank },
    { label: 'Vault', path: '/goals', icon: ShieldCheck },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-fin-sidebar border-b border-fin-border sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fin-accent to-fin-accent-secondary flex items-center justify-center shadow">
            <TrendingUp className="w-4 h-4 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold text-fin-text">FinFlow</span>
        </div>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 rounded-lg bg-fin-card text-fin-text-secondary"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Slide-out Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 bg-fin-sidebar border-r border-fin-border p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-fin-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-fin-accent to-fin-accent-secondary flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-fin-text text-lg">FinFlow</span>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-fin-text-secondary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="py-6 space-y-1.5">
                {[...navItems, { label: 'Settings', path: '/settings', icon: Settings }].map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-2.5 rounded-xl font-medium text-sm ${
                          isActive
                            ? 'bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold'
                            : 'text-fin-text-secondary hover:text-fin-text hover:bg-fin-card'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>

            <div className="pt-6 border-t border-fin-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-fin-text">{user?.name}</p>
                  <p className="text-xs text-fin-text-muted">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="p-2 text-fin-text-secondary hover:text-rose-400"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-fin-sidebar/95 backdrop-blur-lg border-t border-fin-border px-3 py-2 flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                  isActive ? 'text-fin-accent font-bold' : 'text-fin-text-muted'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span className="text-[10px]">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </>
  );
};

export default MobileNavigation;
