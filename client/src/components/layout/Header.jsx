import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Plus,
  Bell,
  Search,
  Calendar,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';
import { getGreeting } from '../../utils/date.js';

export const Header = ({ onOpenAddTransaction, searchQuery, setSearchQuery }) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const notifications = [
    { id: 1, title: 'Salary Credited', desc: 'Tech Leadership ₹85,000 received', time: 'Yesterday' },
    { id: 2, title: 'Budget Status', desc: 'Food & Dining at 57% of monthly envelope', time: '2 days ago' },
    { id: 3, title: 'Vault Allocation', desc: 'Emergency Reserve is 65% funded', time: '3 days ago' },
  ];

  return (
    <header className="sticky top-0 z-20 h-20 bg-fin-bg/85 backdrop-blur-md border-b border-fin-border px-4 lg:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left: Greeting & Date */}
      <div>
        <div className="flex items-center gap-3">
          <h1 className="text-lg lg:text-xl font-bold tracking-tight text-fin-text">
            {getGreeting(user?.name)}
          </h1>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-fin-card border border-fin-border text-xs font-medium text-fin-text-secondary">
            <Calendar className="w-3.5 h-3.5 text-fin-accent" />
            <span>{formattedDate}</span>
          </div>
        </div>
        <p className="text-xs text-fin-text-muted hidden md:block">
          FinFlow Wealth Engine • Portfolio & Expense Velocity
        </p>
      </div>

      {/* Right Controls: Search, Theme Toggle, Notification, Add Record */}
      <div className="flex items-center gap-2.5 lg:gap-3.5">
        {/* Global Search Bar (Optional Header search) */}
        {setSearchQuery && (
          <div className="relative hidden xl:block w-52">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fin-text-muted" />
            <input
              type="text"
              placeholder="Quick search..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-fin-card border border-fin-border text-xs text-fin-text placeholder-fin-text-muted focus:border-fin-accent transition-all"
            />
          </div>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark and light theme"
          className="p-2.5 rounded-xl bg-fin-card border border-fin-border text-fin-text-secondary hover:text-fin-text hover:border-fin-accent/50 transition-all duration-200 shadow-sm"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
          ) : (
            <Moon className="w-4 h-4 text-fin-accent animate-in fade-in" />
          )}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2.5 rounded-xl bg-fin-card border border-fin-border text-fin-text-secondary hover:text-fin-text transition-all duration-200 shadow-sm"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fin-accent animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-fin-accent" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-fin-card border border-fin-border shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-fin-border">
                <span className="text-xs font-bold text-fin-text uppercase tracking-wider">
                  Notifications
                </span>
                <span className="text-[11px] text-fin-accent font-medium cursor-pointer">
                  Mark all read
                </span>
              </div>
              <div className="divide-y divide-fin-border/50 max-h-64 overflow-y-auto mt-2">
                {notifications.map((item) => (
                  <div key={item.id} className="py-2.5 px-1 hover:bg-fin-card-secondary/40 rounded-lg">
                    <p className="text-xs font-semibold text-fin-text">{item.title}</p>
                    <p className="text-[11px] text-fin-text-secondary">{item.desc}</p>
                    <span className="text-[10px] text-fin-text-muted mt-1 block">{item.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Add Record Primary CTA Button */}
        <button
          onClick={onOpenAddTransaction}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary hover:brightness-110 text-white font-semibold text-xs lg:text-sm shadow-md shadow-fin-accent/25 transition-all duration-150 active:scale-95"
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          <span>Add Record</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
