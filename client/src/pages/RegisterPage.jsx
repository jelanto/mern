import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TrendingUp, Lock, Mail, User, ArrowRight, Sparkles, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { register, enterDemoMode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await register({
      name,
      email,
      password,
      preferredCurrency: currency,
    });
    setLoading(false);

    if (res.success) {
      navigate('/dashboard');
    } else {
      setError(res.message);
    }
  };

  const handleDemoLogin = () => {
    enterDemoMode();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-fin-bg text-fin-text flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-200">
      <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-fin-accent/15 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-fin-accent-secondary/15 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-fin-accent to-fin-accent-secondary flex items-center justify-center mx-auto shadow-lg shadow-fin-accent/25 mb-3">
            <TrendingUp className="w-6 h-6 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-fin-text">FinFlow</h1>
          <p className="text-xs text-fin-text-muted mt-1">
            Build your personal financial sovereignty
          </p>
        </div>

        <div className="fin-glass-card rounded-3xl p-7 lg:p-8 shadow-2xl space-y-5">
          <div>
            <h2 className="text-lg font-bold text-fin-text">Create Account</h2>
            <p className="text-xs text-fin-text-muted">Register to start managing your portfolios & budgets</p>
          </div>

          {error && (
            <div className="p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fin-text-muted" />
                <input
                  type="text"
                  placeholder="Rajiv Sharma"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-fin-text-muted" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-fin-text-muted" />
                  <input
                    type="password"
                    placeholder="Min 6 chars"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-fin-text-muted mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-fin-card-secondary border border-fin-border text-xs text-fin-text focus:border-fin-accent cursor-pointer"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative flex items-center justify-center my-3">
            <div className="border-t border-fin-border w-full" />
            <span className="bg-fin-card px-3 text-[11px] text-fin-text-muted uppercase tracking-wider relative">
              Or
            </span>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full py-2.5 rounded-xl bg-fin-card-secondary hover:bg-fin-card-hover border border-fin-border hover:border-fin-accent text-fin-text text-xs font-semibold transition-all flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Instant Sandbox Demo</span>
          </button>

          <p className="text-center text-xs text-fin-text-secondary pt-2">
            Already have an account?{' '}
            <Link to="/login" className="text-fin-accent font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
