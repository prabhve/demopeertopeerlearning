/**
 * Student Registration & Onboarding Modal
 * Features 3-step registration, automatic RSA-2048 keypair derivation, and +50 Welcome Credits reward
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GraduationCap, X, CheckCircle, ShieldCheck, Sparkles, CreditCard, ArrowRight } from 'lucide-react';
import { StudentProfile } from '../types';
import { MOCK_BADGES } from '../data/mockData';
import { cryptoService } from '../services/cryptoService';

interface StudentRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StudentRegistrationModal: React.FC<StudentRegistrationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { colleges, currentCollege, users, switchUser, addCreditTransaction, setActiveView, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedCollegeId, setSelectedCollegeId] = useState(currentCollege.id);
  const [studentForm, setStudentForm] = useState({
    name: '',
    email: '',
    phone: '',
    studentId: '',
    department: 'Computer Science & Engineering',
    course: 'B.Tech',
    year: 2,
    semester: 4,
    skills: 'Python, Data Structures, Web Development',
    interests: 'Competitive Coding, AI/ML',
    bio: '',
  });

  const [createdStudent, setCreatedStudent] = useState<StudentProfile | null>(null);
  const [isGeneratingKeys, setIsGeneratingKeys] = useState(false);

  if (!isOpen) return null;

  const targetCollege = colleges.find(c => c.id === selectedCollegeId) || currentCollege;

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForm.name || !studentForm.email) return;

    setIsGeneratingKeys(true);

    try {
      // 1. Generate client-side RSA-OAEP 2048-bit keypair
      const keyPair = await cryptoService.generateRsaKeyPair();

      const newStudent: StudentProfile = {
        id: `stu-${Date.now()}`,
        collegeId: targetCollege.id,
        collegeName: targetCollege.name,
        collegeSlug: targetCollege.slug,
        name: studentForm.name,
        email: studentForm.email,
        phone: studentForm.phone || '+91 98765 00000',
        studentId: studentForm.studentId || `ENR-${Math.floor(100000 + Math.random() * 900000)}`,
        department: studentForm.department,
        course: studentForm.course,
        year: Number(studentForm.year),
        semester: Number(studentForm.semester),
        skills: studentForm.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: studentForm.interests.split(',').map(s => s.trim()).filter(Boolean),
        avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
        bio: studentForm.bio || `Student at ${targetCollege.name}. Eager to collaborate and learn on PeerCampus.`,
        role: 'student',
        credits: 50, // 50 Starting credits
        xp: 100,
        streak: 1,
        longestStreak: 1,
        streakCalendar: [{ date: new Date().toISOString().split('T')[0], active: true, minutes: 15 }],
        learningHours: 0,
        studentsHelped: 0,
        studentsLearnedFrom: 0,
        learningScore: 75,
        contributionScore: 70,
        skillScore: 75,
        consistencyScore: 80,
        badges: [MOCK_BADGES[0]], // Genesis Learner badge
        publicKeyJwk: keyPair.publicKeyJwk,
        createdAt: new Date().toISOString(),
      };

      // Store private key securely in client localStorage
      localStorage.setItem(
        `peercampus_keys_${newStudent.id}`,
        JSON.stringify({
          publicKeyJwk: keyPair.publicKeyJwk,
          privateKeyJwk: keyPair.privateKeyJwk,
        })
      );

      // Save to application users list
      const updatedUsers = [...users, newStudent];
      localStorage.setItem('peercampus_users', JSON.stringify(updatedUsers));

      // Switch to this new student
      switchUser(newStudent.id);

      setCreatedStudent(newStudent);
      setStep(3);
    } catch (err) {
      console.error('Failed to create student account with cryptographic keys:', err);
      showToast('Key generation failed. Please try again.', 'error');
    } finally {
      setIsGeneratingKeys(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm tracking-tight">Student Campus Registration</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 3 · Zero-Knowledge Cryptographic Profile</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Select Your College</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Choose your affiliated institution to connect with peer classmates.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {colleges.map(col => (
                  <button
                    key={col.id}
                    onClick={() => setSelectedCollegeId(col.id)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      col.id === selectedCollegeId
                        ? 'border-sky-500 bg-sky-50/70 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <p className="font-bold text-slate-900">{col.name}</p>
                      <p className="text-slate-500 text-[11px]">
                        {col.city}, {col.state} · {col.type}
                      </p>
                    </div>
                    {col.id === selectedCollegeId && (
                      <span className="w-4 h-4 rounded-full bg-sky-600 text-white flex items-center justify-center text-[10px]">
                        ✓
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Selected: <strong className="text-slate-800">{targetCollege.name}</strong>
                </span>
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  Continue to Details <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleCreateStudent} className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Student Academic Details</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enrolling in {targetCollege.name}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suman Kulkarni"
                    value={studentForm.name}
                    onChange={e => setStudentForm({ ...studentForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">College Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. suman@recsonbhadra.ac.in"
                    value={studentForm.email}
                    onChange={e => setStudentForm({ ...studentForm, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student / Roll ID</label>
                  <input
                    type="text"
                    placeholder="e.g. 2401250100099"
                    value={studentForm.studentId}
                    onChange={e => setStudentForm({ ...studentForm, studentId: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Department</label>
                  <select
                    value={studentForm.department}
                    onChange={e => setStudentForm({ ...studentForm, department: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                  >
                    {targetCollege.departments.map(d => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Year</label>
                    <select
                      value={studentForm.year}
                      onChange={e => setStudentForm({ ...studentForm, year: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      <option value={1}>Year 1</option>
                      <option value={2}>Year 2</option>
                      <option value={3}>Year 3</option>
                      <option value={4}>Year 4</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                    <select
                      value={studentForm.semester}
                      onChange={e => setStudentForm({ ...studentForm, semester: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                        <option key={s} value={s}>
                          Sem {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Skills You Know (Comma separated)</label>
                  <input
                    type="text"
                    value={studentForm.skills}
                    onChange={e => setStudentForm({ ...studentForm, skills: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Short Bio</label>
                  <textarea
                    rows={2}
                    placeholder="What are you currently studying or hoping to share with peers?"
                    value={studentForm.bio}
                    onChange={e => setStudentForm({ ...studentForm, bio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-slate-500 hover:text-slate-800"
                >
                  ← Back to College
                </button>

                <button
                  type="submit"
                  disabled={isGeneratingKeys}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 disabled:bg-slate-400 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-sm"
                >
                  {isGeneratingKeys ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Generating E2EE Keypair...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      Activate Student Account (+50 Credits)
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-6 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 mx-auto flex items-center justify-center shadow-inner">
                <CreditCard className="w-8 h-8 text-amber-500" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wide uppercase mb-2">
                  Onboarding Complete
                </span>
                <h4 className="text-xl font-extrabold text-slate-900">
                  +50 Welcome Credits Awarded!
                </h4>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Welcome to <strong>{createdStudent?.collegeName}</strong>, {createdStudent?.name}! Your end-to-end encrypted peer identity is active.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-left max-w-sm mx-auto space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Starting Credit Wallet:</span>
                  <span className="font-extrabold text-emerald-600 text-sm">50 Credits</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">E2EE Cryptographic Key:</span>
                  <span className="font-mono text-[10px] text-slate-700 bg-slate-200 px-1.5 py-0.5 rounded">RSA-OAEP 2048</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-slate-800 font-medium">{createdStudent?.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Badge Earned:</span>
                  <span className="text-sky-700 font-semibold">✨ Genesis Learner</span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => {
                    setActiveView('dashboard');
                    onClose();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-md"
                >
                  Enter Your Student Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
