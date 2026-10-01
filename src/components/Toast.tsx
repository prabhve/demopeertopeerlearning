/**
 * PeerCampus Notification Toast
 * Displays cryptographic status, credit rewards, progression unlocks, and system alerts
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, ShieldCheck, Info, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toast, dismissToast } = useApp();

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
    error: <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />,
    info: <Info className="w-5 h-5 text-sky-500 shrink-0" />,
    security: <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-emerald-500/10',
    error: 'bg-white border-rose-200 text-slate-800 shadow-rose-500/10',
    info: 'bg-white border-sky-200 text-slate-800 shadow-sky-500/10',
    security: 'bg-slate-900 border-slate-700 text-white shadow-indigo-500/20',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-xl border shadow-xl ${
          bgStyles[toast.type]
        }`}
      >
        {icons[toast.type]}
        <div className="flex-1 text-xs leading-relaxed font-medium">
          {toast.message}
        </div>
        <button
          onClick={dismissToast}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
