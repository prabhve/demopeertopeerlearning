/**
 * College Registration & Onboarding Modal
 * Provisions an isolated campus tenant portal with custom branding and access code
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, X, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { College } from '../types';

interface CollegeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CollegeOnboardingModal: React.FC<CollegeOnboardingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { registerCollege, selectCollege } = useApp();

  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState({
    name: '',
    officialEmail: '',
    type: 'Government Engineering College',
    university: '',
    city: '',
    state: '',
    country: 'India',
    website: '',
    description: '',
    contactPerson: '',
    adminName: '',
    adminEmail: '',
    phone: '',
    accessCode: '',
    primaryColor: '#1e3a8a',
    departments: 'Computer Science & Engineering, Electronics Engineering, Electrical Engineering, Mechanical Engineering, Civil Engineering',
  });

  const [createdCollege, setCreatedCollege] = useState<College | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const depts = formData.departments.split(',').map(d => d.trim()).filter(Boolean);

    const newCol = registerCollege({
      name: formData.name,
      officialEmail: formData.officialEmail || 'admin@college.edu.in',
      type: formData.type,
      university: formData.university || 'State Technical University',
      city: formData.city || 'Campus City',
      state: formData.state || 'State',
      country: formData.country,
      website: formData.website || 'https://college.edu.in',
      description: formData.description || `${formData.name} Peer Learning and Skill Sharing Portal.`,
      contactPerson: formData.contactPerson || formData.adminName,
      adminName: formData.adminName || 'Dean of Academics',
      adminEmail: formData.adminEmail || formData.officialEmail,
      phone: formData.phone || '+91 98000 00000',
      accessCode: formData.accessCode || `${formData.name.substring(0, 3).toUpperCase()}-2026`,
      departments: depts.length ? depts : ['Computer Science', 'Electronics', 'Mechanical'],
      brandColors: {
        primary: formData.primaryColor,
        secondary: '#0284c7',
        accent: '#f59e0b',
      },
    });

    setCreatedCollege(newCol);
    setStep(2);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Register Your College Portal</h3>
              <p className="text-[11px] text-slate-400">Launch an isolated peer-to-peer campus ecosystem</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    College Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rajkiya Engineering College Sonbhadra"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Official College Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. academic@recsonbhadra.ac.in"
                    value={formData.officialEmail}
                    onChange={e => setFormData({ ...formData, officialEmail: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Affiliated University
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. AKTU, Lucknow"
                    value={formData.university}
                    onChange={e => setFormData({ ...formData, university: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Sonbhadra"
                    value={formData.city}
                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Uttar Pradesh"
                    value={formData.state}
                    onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Admin / Dean Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Ramesh Chand"
                    value={formData.adminName}
                    onChange={e => setFormData({ ...formData, adminName: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    College Access Code (for students)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. REC-SON-2026"
                    value={formData.accessCode}
                    onChange={e => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 font-mono focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Departments (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.departments}
                    onChange={e => setFormData({ ...formData, departments: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Campus Description
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Brief mission statement or college overview..."
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full text-xs px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Isolated tenant database &amp; cryptographic rules enabled</span>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Provision College Portal
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  {createdCollege?.name} Portal Successfully Provisioned!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Your customized campus peer learning workspace is now active under its dedicated URL slug.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Portal URL:</span>
                  <span className="font-mono font-bold text-sky-700">/college/{createdCollege?.slug}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">College Access Code:</span>
                  <span className="font-mono font-bold text-slate-900">{createdCollege?.accessCode}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Admin Email:</span>
                  <span className="text-slate-800">{createdCollege?.adminEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Security Isolation:</span>
                  <span className="text-emerald-700 font-semibold">Active (RBAC &amp; Tenant Guard)</span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-center gap-3">
                <button
                  onClick={() => {
                    if (createdCollege) selectCollege(createdCollege.slug);
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs transition-colors"
                >
                  Enter Campus Portal Now
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
