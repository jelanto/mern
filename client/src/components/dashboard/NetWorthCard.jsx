import React from 'react';
import { TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck, Wallet, Landmark } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

export const NetWorthCard = ({ summary, currency }) => {
  const netWorth = summary?.netWorth || 0;
  const assets = summary?.assets || 0;
  const liabilities = summary?.liabilities || 0;
  const delta = summary?.deltas?.netWorth || 4.8;
  const isPositive = delta >= 0;

  return (
    <div className="fin-glass-card rounded-3xl p-6 lg:p-7 relative overflow-hidden group">
      {/* Background Ambient Glow */}
      <div className="absolute -right-16 -top-16 w-56 h-56 rounded-full bg-fin-accent/10 blur-3xl pointer-events-none group-hover:bg-fin-accent/20 transition-all duration-500" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
        {/* Left: Net Worth Heading & Big Number */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-fin-text-muted">
              Total Net Worth
            </span>
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                isPositive
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {Math.abs(delta)}%
            </span>
          </div>

          <div className="text-3xl lg:text-4xl font-extrabold tracking-tight text-fin-text">
            {formatCurrency(netWorth, currency)}
          </div>

          <p className="text-xs text-fin-text-secondary flex items-center gap-1.5 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-fin-accent" />
            <span>Liquid reserve & investments aggregated across all accounts</span>
          </p>
        </div>

        {/* Right: Assets & Liabilities Pill Badges */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 shrink-0">
          <div className="p-3.5 rounded-2xl bg-fin-card-secondary/70 border border-fin-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0">
              <Landmark className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-fin-text-muted uppercase tracking-wider">
                Total Assets
              </p>
              <p className="text-sm sm:text-base font-bold text-fin-text">
                {formatCurrency(assets, currency)}
              </p>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-fin-card-secondary/70 border border-fin-border flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
              <Wallet className="w-5 h-5 text-rose-400" />
            </div>
            <div>
              <p className="text-[11px] font-semibold text-fin-text-muted uppercase tracking-wider">
                Liabilities
              </p>
              <p className="text-sm sm:text-base font-bold text-rose-400">
                {formatCurrency(liabilities, currency)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NetWorthCard;
