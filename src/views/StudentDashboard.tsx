/**
 * Student Dashboard View
 * Duolingo/LinkedIn hybrid: Streaks, Credit Balance, Progression Status, Missions & Personalized Recommendations
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Flame,
  CreditCard,
  Zap,
  Play,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  Award,
  Sparkles,
  Gamepad2,
  Clock,
  History,
  TrendingUp,
} from 'lucide-react';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    currentCollege,
    videos,
    unlockedVideoIds,
    watchProgress,
    setActiveVideoId,
    setActiveView,
    missions,
    transactions,
    claimDailyStreak,
    cryptoReady,
  } = useApp();

  const [txModalOpen, setTxModalOpen] = useState(false);

  // Unlocked courses
  const myUnlockedVideos = videos.filter(v => unlockedVideoIds.includes(v.id));

  // Recommended courses based on user department
  const recommendedVideos = videos.filter(
    v => v.collegeId === currentCollege.id && !unlockedVideoIds.includes(v.id)
  );

  return (
    <div className="space-y-8 pb-20">
      {/* Top Greeting & Metric Cards Banner */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
              <span>{currentCollege.name}</span>
              <span aria-hidden="true">·</span>
              <span>{currentUser.department} (Semester {currentUser.semester})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              Welcome back, {currentUser.name.split(' ')[0]} 👋
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('learning_arena')}
              className="px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <Gamepad2 className="w-4 h-4" />
              Learning Arena Mini-Games
            </button>
            <button
              onClick={() => setActiveView('teach_upload')}
              className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-sky-400" />
              Teach &amp; Earn Credits
            </button>
          </div>
        </div>

        {/* 4 Primary Student KPI Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Card 1: Streak */}
          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Streak</span>
              <Flame className="w-5 h-5 text-amber-500 fill-amber-500" />
            </div>
            <div className="text-2xl font-black text-amber-950">
              {currentUser.streak} <span className="text-xs font-medium text-amber-700">Days</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-amber-700">Longest: {currentUser.longestStreak}d</span>
              <button
                onClick={claimDailyStreak}
                className="font-bold text-amber-900 hover:underline"
              >
                +Claim Daily
              </button>
            </div>
          </div>

          {/* Card 2: Credit Wallet */}
          <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Credits</span>
              <CreditCard className="w-5 h-5 text-sky-600" />
            </div>
            <div className="text-2xl font-black text-sky-950">
              {currentUser.credits} <span className="text-xs font-medium text-sky-700">Pts</span>
            </div>
            <div className="flex items-center justify-between text-[11px] pt-1">
              <span className="text-sky-700 font-medium">5 pts / unlock</span>
              <button
                onClick={() => setTxModalOpen(true)}
                className="font-bold text-sky-800 hover:underline flex items-center gap-1"
              >
                <History className="w-3 h-3" /> Ledger
              </button>
            </div>
          </div>

          {/* Card 3: Experience & Gamification Score */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">Mastery XP</span>
              <Zap className="w-5 h-5 text-indigo-600 fill-indigo-600" />
            </div>
            <div className="text-2xl font-black text-indigo-950">
              {currentUser.xp} <span className="text-xs font-medium text-indigo-700">XP</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-indigo-700 pt-1">
              <span>Score: {currentUser.learningScore}/100</span>
              <span className="font-semibold text-indigo-900">Rank: Scholar</span>
            </div>
          </div>

          {/* Card 4: Impact & Security */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Campus Impact</span>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-emerald-950">
              {currentUser.studentsHelped} <span className="text-xs font-medium text-emerald-700">Learners</span>
            </div>
            <div className="flex items-center justify-between text-[11px] text-emerald-700 pt-1">
              <span>Helped by you</span>
              <span className="font-mono text-[10px] text-emerald-800 font-bold">E2EE: RSA-2048</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Grid: Continue Learning + Daily Missions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Continue Learning & Library (2 cols) */}
        <div className="lg:col-span-2 space-y-8">
          {/* Continue Learning Section */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                  Continue Learning ({myUnlockedVideos.length})
                </h2>
                <p className="text-xs text-slate-500">
                  Tracked with strict 70% progression lock and tamper-proof watch tokens.
                </p>
              </div>
              <button
                onClick={() => setActiveView('college_home')}
                className="text-xs font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1"
              >
                Browse All <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {myUnlockedVideos.length > 0 ? (
              <div className="space-y-3">
                {myUnlockedVideos.map(vid => {
                  const prog = watchProgress[vid.id] || {
                    completionPercent: 0,
                    watchedSeconds: 0,
                    thresholdReached: false,
                  };

                  return (
                    <div
                      key={vid.id}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          className="w-16 h-12 rounded-xl object-cover shrink-0"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-sky-700 uppercase">
                            {vid.subject}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-1">
                            {vid.title}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-slate-500">
                            <span>Instructor: {vid.creatorName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{Math.floor(vid.durationSeconds / 60)} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar & Watch Trigger */}
                      <div className="flex items-center gap-4 sm:shrink-0">
                        <div className="w-28 space-y-1">
                          <div className="flex justify-between text-[10px]">
                            <span className="text-slate-500">Progress</span>
                            <span className="font-bold text-slate-800">{prog.completionPercent}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden relative">
                            {/* 70% threshold tick marker */}
                            <div className="absolute left-[70%] top-0 bottom-0 w-0.5 bg-amber-500 z-10" />
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                prog.thresholdReached ? 'bg-emerald-500' : 'bg-sky-500'
                              }`}
                              style={{ width: `${prog.completionPercent}%` }}
                            />
                          </div>
                          <div className="text-[9px] text-slate-400 text-right">
                            {prog.thresholdReached ? '✓ 70% Cleared' : 'Needs 70% to unlock'}
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setActiveVideoId(vid.id);
                            setActiveView('video_player');
                          }}
                          className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" /> Resume
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <p className="text-xs text-slate-500 mb-2">You haven't unlocked any courses yet.</p>
                <button
                  onClick={() => setActiveView('college_home')}
                  className="px-4 py-2 rounded-xl bg-sky-600 text-white font-bold text-xs"
                >
                  Unlock Your First Course (5 Credits)
                </button>
              </div>
            )}
          </section>

          {/* Recommended for You */}
          <section className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
                Recommended For Your Semester
              </h2>
              <p className="text-xs text-slate-500">
                Trending among {currentUser.department} students at {currentCollege.name}.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {recommendedVideos.slice(0, 2).map(vid => (
                <div
                  key={vid.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all flex flex-col justify-between space-y-3 bg-white"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-sky-700">{vid.subject}</span>
                      <span className="font-mono text-slate-400">{Math.floor(vid.durationSeconds / 60)}m</span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {vid.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-600">Cost: 5 Credits</span>
                    <button
                      onClick={() => {
                        setActiveVideoId(vid.id);
                        setActiveView('video_player');
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs transition-colors"
                    >
                      Preview Course →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Daily Missions & Gamification (1 col) */}
        <div className="space-y-6">
          {/* Daily Missions Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" /> Daily Learning Missions
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800">
                Rewards Active
              </span>
            </div>

            <div className="space-y-3">
              {missions.map(m => (
                <div
                  key={m.id}
                  className={`p-3.5 rounded-xl border text-xs space-y-2 transition-all ${
                    m.completed
                      ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-950'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {m.completed && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                        <span>{m.title}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {m.description}
                      </p>
                    </div>
                    <span className="font-bold text-sky-700 shrink-0 text-[11px]">
                      +{m.rewardCredits} Cr
                    </span>
                  </div>

                  {/* Mission progress bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Progress</span>
                      <span>{m.progress}/{m.maxProgress}</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          m.completed ? 'bg-emerald-500' : 'bg-sky-500'
                        }`}
                        style={{ width: `${Math.min(100, (m.progress / m.maxProgress) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badges Preview Card */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-extrabold text-slate-900 tracking-tight flex items-center gap-1.5">
                <Award className="w-4 h-4 text-sky-600" /> Earned Badges ({currentUser.badges.length})
              </h3>
              <button
                onClick={() => setActiveView('profile')}
                className="text-[11px] font-bold text-sky-600 hover:underline"
              >
                View Profile
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {currentUser.badges.map(b => (
                <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                  <div className="font-bold text-slate-800 text-[11px] truncate">{b.name}</div>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                    {b.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Credit Ledger Drawer/Modal */}
      {txModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-sky-400" />
                <h3 className="font-bold text-sm">Auditable Credit Transaction Ledger</h3>
              </div>
              <button
                onClick={() => setTxModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-3">
              <p className="text-xs text-slate-500">
                Every credit transfer carries an HMAC-SHA256 integrity hash protecting against balance manipulation.
              </p>

              <div className="space-y-2">
                {transactions
                  .filter(t => t.userId === currentUser.id)
                  .map(tx => (
                    <div
                      key={tx.id}
                      className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-800">{tx.description}</span>
                        <span
                          className={`font-black text-sm ${
                            tx.amount > 0 ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {tx.amount > 0 ? `+${tx.amount}` : tx.amount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>{new Date(tx.timestamp).toLocaleString()}</span>
                        <span>Balance: {tx.balanceAfter} credits</span>
                      </div>
                      <div className="text-[9px] font-mono text-slate-400 truncate">
                        Hash: {tx.integrityHash}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
