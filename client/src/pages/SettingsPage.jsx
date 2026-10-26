import React, { useState, useEffect } from 'react';
import {
  User,
  Sliders,
  DollarSign,
  Moon,
  Sun,
  Shield,
  CreditCard,
  Save,
  Check,
  Landmark,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import { settingsApi } from '../api/settingsApi.js';
import initialDemoData from '../data/demoData.js';
import { formatCurrency } from '../utils/currency.js';

export const SettingsPage = () => {
  const { user, currency, isDemoMode, updateUserProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [name, setName] = useState(user?.name || 'Rajiv Sharma');
  const [preferredCurrency, setPreferredCurrency] = useState(currency || 'INR');
  const [defaultDateRange, setDefaultDateRange] = useState('30d');
  const [accounts, setAccounts] = useState(initialDemoData.accounts);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isDemoMode) {
      settingsApi.getSettings().then((res) => {
        if (res.success && res.data) {
          if (res.data.user) {
            setName(res.data.user.name);
            setPreferredCurrency(res.data.user.preferredCurrency || 'INR');
            setDefaultDateRange(res.data.user.defaultDateRange || '30d');
          }
          if (res.data.accounts) {
            setAccounts(res.data.accounts);
          }
        }
      }).catch((e) => console.warn('Settings load error:', e));
    }
  }, [isDemoMode]);

  const handleSavePreferences = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (isDemoMode) {
        initialDemoData.user.name = name;
        initialDemoData.user.preferredCurrency = preferredCurrency;
        initialDemoData.user.defaultDateRange = defaultDateRange;
        updateUserProfile({ name, preferredCurrency, defaultDateRange });
      } else {
        await settingsApi.updateSettings({
          name,
          preferredCurrency,
          defaultDateRange,
          themePreference: theme,
        });
        updateUserProfile({ name, preferredCurrency, defaultDateRange });
      }

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      alert(err.message || 'Failed to update preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee (INR)' },
    { code: 'USD', symbol: '$', label: 'US Dollar (USD)' },
    { code: 'EUR', symbol: '€', label: 'Euro (EUR)' },
    { code: 'GBP', symbol: '£', label: 'British Pound (GBP)' },
    { code: 'CAD', symbol: 'C$', label: 'Canadian Dollar (CAD)' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar (SGD)' },
  ];

  return (
    <div className="space-y-6 lg:space-y-7 animate-in fade-in duration-300 max-w-4xl">
      {/* Title */}
      <div>
        <h1 className="text-xl lg:text-2xl font-extrabold text-fin-text tracking-tight">
          Wealth Settings & Preferences
        </h1>
        <p className="text-xs text-fin-text-muted mt-0.5">
          Customize currency representation, aesthetic appearance, and profile telemetry
        </p>
      </div>

      {savedSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
          <Check className="w-4 h-4" />
          <span>Preferences updated and persisted successfully!</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Card */}
        <div className="fin-glass-card rounded-3xl p-6 lg:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-fin-border">
            <User className="w-4 h-4 text-fin-accent" />
            <h2 className="text-sm font-bold text-fin-text uppercase tracking-wider">
              Profile Information
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Email Address (Read-only)
              </label>
              <input
                type="email"
                value={user?.email || 'rajiv@finflow.io'}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-fin-card-secondary/50 border border-fin-border text-xs text-fin-text-muted cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Currency & Appearance Card */}
        <div className="fin-glass-card rounded-3xl p-6 lg:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-fin-border">
            <Sliders className="w-4 h-4 text-fin-accent" />
            <h2 className="text-sm font-bold text-fin-text uppercase tracking-wider">
              Currency & Interface
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Primary Currency
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code} className="bg-fin-card">
                    {c.label} ({c.symbol})
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle in Settings */}
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1.5">
                Appearance Mode
              </label>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="flex-1 py-2 px-3 rounded-xl bg-fin-card-secondary border border-fin-border hover:border-fin-accent text-xs font-semibold text-fin-text flex items-center justify-center gap-2 transition-all"
                >
                  {theme === 'dark' ? (
                    <>
                      <Sun className="w-4 h-4 text-amber-400" />
                      <span>Dark Burgundy Active (Click for Light Cream)</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-4 h-4 text-fin-accent" />
                      <span>Light Cream Active (Click for Dark Burgundy)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Linked Accounts Overview */}
        <div className="fin-glass-card rounded-3xl p-6 lg:p-7 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-fin-border">
            <Landmark className="w-4 h-4 text-fin-accent" />
            <h2 className="text-sm font-bold text-fin-text uppercase tracking-wider">
              Connected Accounts & Instruments
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {accounts.map((acc) => (
              <div
                key={acc._id}
                className="p-4 rounded-2xl bg-fin-card-secondary/70 border border-fin-border space-y-1"
              >
                <div className="flex items-center justify-between text-xs text-fin-text-muted">
                  <span>{acc.name}</span>
                  <span className="capitalize text-[10px] bg-fin-card px-2 py-0.5 rounded-md border border-fin-border">
                    {acc.type}
                  </span>
                </div>
                <p className="text-base font-extrabold text-fin-text">
                  {formatCurrency(acc.balance, acc.currency || preferredCurrency)}
                </p>
                <p className="text-[10px] text-fin-text-muted">
                  {acc.institution} •• {acc.accountNumberLast4 || '8492'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving...' : 'Save Preferences'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default SettingsPage;
