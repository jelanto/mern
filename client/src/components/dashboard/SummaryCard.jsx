import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { formatCurrency } from '../../utils/currency.js';

export const SummaryCard = ({
  label,
  amount,
  currency,
  delta,
  icon: Icon,
  trend = 'positive',
  subtext,
  isPercentage = false,
  progress = null,
}) => {
  const isPositive = delta >= 0;

  return (
    <div className="fin-glass-card rounded-3xl p-5 lg:p-6 relative group overflow-hidden transition-all duration-200 hover:-translate-y-1">
      {/* Subtle Card Accent Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-fin-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-semibold tracking-wider text-fin-text-muted uppercase">
          {label}
        </span>
        <div className="w-8 h-8 rounded-xl bg-fin-card-secondary border border-fin-border flex items-center justify-center text-fin-accent group-hover:bg-fin-accent group-hover:text-white transition-all duration-200">
          {Icon && <Icon className="w-4 h-4" />}
        </div>
      </div>

      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-2xl lg:text-3xl font-extrabold text-fin-text tracking-tight">
          {isPercentage ? `${amount}%` : formatCurrency(amount, currency)}
        </span>
      </div>

      {/* Progress Bar for Savings Rate / Goals */}
      {progress !== null && (
        <div className="w-full bg-fin-card-secondary h-1.5 rounded-full overflow-hidden my-2.5">
          <div
            className="bg-gradient-to-r from-fin-accent to-emerald-400 h-full rounded-full transition-all duration-500"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {/* Footer Trend or Subtext */}
      <div className="flex items-center justify-between text-[11px] pt-1">
        {delta !== undefined ? (
          <div className="flex items-center gap-1">
            <span
              className={`inline-flex items-center font-bold ${
                trend === 'positive'
                  ? isPositive
                    ? 'text-emerald-400'
                    : 'text-rose-400'
                  : isPositive
                  ? 'text-rose-400'
                  : 'text-emerald-400'
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              {Math.abs(delta)}%
            </span>
            <span className="text-fin-text-muted">vs last cycle</span>
          </div>
        ) : (
          <span className="text-fin-text-muted">{subtext}</span>
        )}
      </div>
    </div>
  );
};

export default SummaryCard;
