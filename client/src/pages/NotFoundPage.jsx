import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-fin-bg text-fin-text flex items-center justify-center p-4">
      <div className="text-center max-w-md space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-fin-accent/15 border border-fin-accent/30 flex items-center justify-center mx-auto text-fin-accent">
          <Compass className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-fin-text tracking-tight">404</h1>
        <h2 className="text-lg font-bold text-fin-text">Page Not Found</h2>
        <p className="text-xs text-fin-text-muted">
          The financial route or dashboard partition you are requesting does not exist.
        </p>
        <div className="pt-2">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-fin-accent to-fin-accent-secondary text-white font-semibold text-xs shadow-md shadow-fin-accent/25 hover:brightness-110"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
