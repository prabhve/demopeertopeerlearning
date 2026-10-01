/**
 * PeerCampus Clean Footer
 * Details Zero-Knowledge E2EE, OWASP compliance, and platform architecture
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, ShieldCheck, Lock, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-extrabold text-base tracking-tight">PeerCampus</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Decentralized multi-college peer learning and campus intelligence platform. Turn every college into a connected learning ecosystem.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>AES-256-GCM · RSA-2048 E2EE</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Learning Platform</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('landing')} className="hover:text-white transition-colors">
                  Platform Overview
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('college_home')} className="hover:text-white transition-colors">
                  College Portals
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('knowledge_map')} className="hover:text-white transition-colors">
                  Interactive Knowledge Graph
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('learning_arena')} className="hover:text-white transition-colors">
                  Learning Arena Mini-Games
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('teach_upload')} className="hover:text-white transition-colors">
                  Teach & Earn Marketplace
                </button>
              </li>
            </ul>
          </div>

          {/* Campus Administration */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Campus Intelligence</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('college_admin')} className="hover:text-white transition-colors">
                  Dean & HOD Analytics
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('college_admin')} className="hover:text-white transition-colors">
                  Subject Demand Intelligence
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('college_admin')} className="hover:text-white transition-colors">
                  Content Moderation Pipeline
                </button>
              </li>
              <li>
                <button onClick={() => setActiveView('super_admin')} className="hover:text-white transition-colors">
                  Super Admin Governance
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Cryptography */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Security & Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveView('security_center')} className="hover:text-white transition-colors flex items-center gap-1.5 text-sky-400">
                  <Lock className="w-3.5 h-3.5" />
                  OWASP Top 10 Security Center
                </button>
              </li>
              <li>
                <span className="text-slate-500">70% Cryptographic Video Progression Lock</span>
              </li>
              <li>
                <span className="text-slate-500">Tamper-Proof HMAC-SHA256 Credit Ledger</span>
              </li>
              <li>
                <span className="text-slate-500">Zero-Knowledge Browser Key Enclave</span>
              </li>
              <li>
                <span className="text-slate-500">Multi-Tenant Campus Data Isolation</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 PeerCampus Ecosystem. Peer-to-peer knowledge network for higher education.</p>
          <div className="flex items-center gap-3">
            <span>Built for Colleges, Driven by Students</span>
            <span aria-hidden="true">·</span>
            <span className="text-slate-400 font-mono">OWASP 2026 Ready</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
