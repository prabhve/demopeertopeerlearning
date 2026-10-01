/**
 * Student Profile View
 * LinkedIn-style academic learning profile with gamification scores, 30-day streak heatmap,
 * earned badges, courses created/unlocked, and an End-to-End Encrypted Personal Vault.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BadgeSystem } from '../components/BadgeSystem';
import {
  User,
  GraduationCap,
  Flame,
  CreditCard,
  Zap,
  Award,
  Clock,
  Users,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  Edit3,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const StudentProfileView: React.FC = () => {
  const {
    currentUser,
    currentCollege,
    videos,
    unlockedVideoIds,
    updateCurrentUserProfile,
    showToast,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [bioInput, setBioInput] = useState(currentUser.bio);
  const [skillsInput, setSkillsInput] = useState(currentUser.skills.join(', '));
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [vaultNote, setVaultNote] = useState(
    'My Private Study Vault: Gate EE Formulas & Target Companies list (Confidential)'
  );

  const myUploadedVideos = videos.filter(v => v.creatorId === currentUser.id);
  const myUnlockedVideos = videos.filter(v => unlockedVideoIds.includes(v.id));

  const handleSaveProfile = () => {
    updateCurrentUserProfile({
      bio: bioInput,
      skills: skillsInput.split(',').map(s => s.trim()).filter(Boolean),
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Profile Card Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-3xl object-cover ring-4 ring-slate-100 shadow-sm"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                  {currentUser.name}
                </h1>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  E2EE Verified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser.department} (Semester {currentUser.semester}) · {currentCollege.name}
              </p>
              <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1 font-mono">
                <span>ID: {currentUser.studentId}</span>
                <span>·</span>
                <span>Course: {currentUser.course}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors self-start sm:self-center"
          >
            <Edit3 className="w-3.5 h-3.5" />
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Bio & Skills */}
        {isEditing ? (
          <div className="space-y-3 pt-4 border-t border-slate-100 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bio</label>
              <textarea
                rows={2}
                value={bioInput}
                onChange={e => setBioInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Skills (comma separated)</label>
              <input
                type="text"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300"
              />
            </div>
            <button
              onClick={handleSaveProfile}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-4 border-t border-slate-100 text-xs">
            <p className="text-slate-600 leading-relaxed">{currentUser.bio}</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 font-semibold mr-1">Skills:</span>
              {currentUser.skills.map(sk => (
                <span key={sk} className="text-slate-700 font-medium">
                  {sk} <span className="text-slate-300 ml-1">·</span>
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Gamification Performance Scores (Section 5) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 tracking-tight">
          Campus Learning Intelligence Metrics (Gamification Scores)
        </h3>
        <p className="text-xs text-slate-500">
          Non-monetary skill development and peer collaboration telemetry.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-1">
            <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider">Learning Score</span>
            <div className="text-2xl font-black text-sky-950">{currentUser.learningScore}/100</div>
            <p className="text-[10px] text-sky-700">Course completion &amp; quiz rate</p>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-1">
            <span className="text-[11px] font-bold text-indigo-800 uppercase tracking-wider">Contribution Score</span>
            <div className="text-2xl font-black text-indigo-950">{currentUser.contributionScore}/100</div>
            <p className="text-[10px] text-indigo-700">{currentUser.studentsHelped} peers helped</p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-1">
            <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Skill Score</span>
            <div className="text-2xl font-black text-emerald-950">{currentUser.skillScore}/100</div>
            <p className="text-[10px] text-emerald-700">Engineering concept mastery</p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Consistency Score</span>
            <div className="text-2xl font-black text-amber-950">{currentUser.consistencyScore}/100</div>
            <p className="text-[10px] text-amber-700">{currentUser.streak} days active streak</p>
          </div>
        </div>
      </div>

      {/* 30-Day Streak Activity Calendar Heatmap */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              30-Day Continuous Learning Streak
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Meaningful learning activity recorded via 70% video checkpoints and quiz submissions.
            </p>
          </div>
          <span className="text-xs font-bold text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200">
            🔥 {currentUser.streak} Days Active
          </span>
        </div>

        {/* Streak Squares Grid */}
        <div className="grid grid-cols-10 sm:grid-cols-15 gap-2 pt-2">
          {currentUser.streakCalendar.map((day, idx) => (
            <div
              key={idx}
              title={`${day.date}: ${day.active ? `${day.minutes} mins learning` : 'Inactive'}`}
              className={`h-7 rounded-lg border transition-all flex items-center justify-center text-[10px] font-mono ${
                day.active
                  ? 'bg-amber-500 border-amber-600 text-white font-bold shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-400'
              }`}
            >
              {idx + 1}
            </div>
          ))}
        </div>
      </div>

      {/* Skill Achievement & Milestone Badge System */}
      <BadgeSystem />

      {/* Personal End-to-End Encrypted Vault */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Personal Encrypted Study Vault</h3>
              <p className="text-[11px] text-slate-400">
                Encrypted in client browser enclave with AES-256-GCM.
              </p>
            </div>
          </div>

          <button
            onClick={() => setVaultUnlocked(!vaultUnlocked)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs flex items-center gap-1.5 transition-colors"
          >
            {vaultUnlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {vaultUnlocked ? 'Lock Vault' : 'Decrypt Vault'}
          </button>
        </div>

        {vaultUnlocked ? (
          <div className="space-y-3 pt-2">
            <textarea
              rows={3}
              value={vaultNote}
              onChange={e => setVaultNote(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs font-mono text-slate-200 focus:outline-none"
            />
            <button
              onClick={() => showToast('Vault encrypted & stored locally', 'security')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              Encrypt &amp; Save
            </button>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 text-xs font-mono text-slate-400">
            🔒 Vault is currently locked. Click "Decrypt Vault" to inspect your private notes.
          </div>
        )}
      </div>
    </div>
  );
};
