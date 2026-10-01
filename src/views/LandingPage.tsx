/**
 * PeerCampus Landing Page
 * Futuristic education-tech landing page with ecosystem illustration and multi-college portal discovery
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Sparkles,
  Flame,
  CreditCard,
  Lock,
  Share2,
  Gamepad2,
  CheckCircle2,
  Search,
  Users,
  TrendingUp,
  Brain,
  Video,
  Award,
} from 'lucide-react';

interface LandingPageProps {
  onOpenRegisterCollege: () => void;
  onOpenStudentSignup: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenRegisterCollege,
  onOpenStudentSignup,
}) => {
  const { colleges, selectCollege, setActiveView } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredColleges = colleges.filter(
    c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.state.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-200/80 text-sky-800 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
          <span>Next-Generation Multi-College P2P Learning Hub</span>
          <span className="text-slate-300">|</span>
          <span className="font-mono text-emerald-600 font-bold">OWASP Top 10 &amp; E2EE</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
          Turn Every College Into a <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
            Connected Learning Ecosystem.
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
          Students learn from students, earn through knowledge, build skills, and help their college understand what the next generation is learning.
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onOpenRegisterCollege}
            className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
          >
            <Building2 className="w-4 h-4 text-sky-400" />
            Register Your College
          </button>
          <button
            onClick={onOpenStudentSignup}
            className="px-6 py-3.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-sky-600/20 transition-all flex items-center gap-2"
          >
            <GraduationCap className="w-4 h-4" />
            Join Your College (+50 Credits)
          </button>
          <button
            onClick={() => {
              selectCollege('rec-sonbhadra');
              setActiveView('college_home');
            }}
            className="px-5 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors"
          >
            Explore Live Demo (REC Sonbhadra) →
          </button>
        </div>

        {/* Animated Peer Learning Ecosystem Flow Illustration */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-radial from-sky-500/10 via-transparent to-transparent pointer-events-none" />

          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 pb-4 border-b border-slate-800 gap-4">
            <div className="text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                P2P Micro-Economy Architecture
              </span>
              <h2 className="text-lg font-bold text-white">How Knowledge &amp; Credits Flow</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Zero-Knowledge E2EE
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                70% Progression Lock
              </span>
            </div>
          </div>

          {/* Interactive Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4 text-left relative">
            {/* Step 1 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h3 className="text-xs font-bold text-white">Student A Uploads Video</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Aditya uploads 15-min practical Python or DSP derivation with encrypted revision notes.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h3 className="text-xs font-bold text-white">Student B Discovers</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Classmate searches semester subject or finds it recommended on REC Sonbhadra portal.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h3 className="text-xs font-bold text-white">Spends 5 Credits</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Unlocks content from starting 50 credits wallet. Transaction recorded in signed ledger.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h3 className="text-xs font-bold text-white">70% Progression Lock</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Controlled player prevents skipping. Reaching 70% threshold unlocks next units &amp; quiz.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold text-xs">
                5
              </div>
              <h3 className="text-xs font-bold text-white">Creator Earns 4 Credits</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Student A earns 4 credits royalty. 1 credit feeds the college ecosystem pool.
              </p>
            </div>

            {/* Step 6 */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2 hover:border-sky-500 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xs">
                6
              </div>
              <h3 className="text-xs font-bold text-white">Knowledge Graph Grows</h3>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Both students build verified profiles. College Admin sees realtime subject demand intelligence!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* College Directory Selector: "Find Your College" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Directory
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Find Your College Portal
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Every college has an independent branded portal, isolated student database, and verified credits.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search college name, city or state..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredColleges.map(col => (
              <div
                key={col.id}
                className="p-5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all space-y-3 bg-white flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      /college/{col.slug}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Isolated Tenant
                    </span>
                  </div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug">
                    {col.name}
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    {col.city}, {col.state} · {col.university}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="text-[11px] text-slate-600">
                    <strong>{col.stats.totalStudents}</strong> Students · <strong>{col.stats.totalVideos}</strong> Videos
                  </div>
                  <button
                    onClick={() => {
                      selectCollege(col.slug);
                      setActiveView('college_home');
                    }}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    Enter Hub <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <button
              onClick={onOpenRegisterCollege}
              className="text-xs font-bold text-sky-600 hover:text-sky-700 underline underline-offset-4"
            >
              Don't see your institution? Onboard your college workspace in 2 minutes →
            </button>
          </div>
        </div>
      </section>

      {/* For Students & For Colleges Dual Value Proposition */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Engineered For Higher Education
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Built for Students. Revered by Colleges.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Students */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">For Students: Learn, Teach &amp; Earn</h3>
              <p className="text-xs text-slate-500 mt-1">
                Break the cycle of passive lecture consumption. Become a recognized campus creator.
              </p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>50 Starting Credits:</strong> Unlock peer study modules, exam derivations, and code walkthroughs immediately.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Earn 4 Credits per Unlock:</strong> Upload 10-minute video explanations and earn royalties from peer viewers.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>70% Video Progression Lock:</strong> Real accountability. Skip-resistant player ensures genuine mastery before next lessons unlock.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>LinkedIn-Grade Profile &amp; Badges:</strong> Display Learning Score, Consistency Score, and campus mentorship rank.</span>
              </li>
            </ul>
            <button
              onClick={onOpenStudentSignup}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors"
            >
              Claim 50 Welcome Credits →
            </button>
          </div>

          {/* For Colleges */}
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-slate-900">For Colleges: Campus Learning Intelligence</h3>
              <p className="text-xs text-slate-500 mt-1">
                Deans and HODs receive actionable analytics on actual student learning behaviors.
              </p>
            </div>
            <ul className="space-y-3 text-xs text-slate-600">
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Subject Demand Intelligence:</strong> See which subjects have 42% student interest but low faculty course resources.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Department Learning Pulse:</strong> Compare active learning hours between CSE, ECE, EE, ME, and Civil.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Content Moderation Queue:</strong> Faculty review and approve student uploads before publication.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span><strong>Interactive Knowledge Map:</strong> Visually trace peer learning relationships across departments.</span>
              </li>
            </ul>
            <button
              onClick={() => {
                selectCollege('rec-sonbhadra');
                setActiveView('college_admin');
              }}
              className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-colors"
            >
              Open REC Sonbhadra Intelligence Dashboard →
            </button>
          </div>
        </div>
      </section>

      {/* Signature Feature Teaser: The Knowledge Network */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 p-8 sm:p-12 text-white border border-slate-700 relative overflow-hidden">
          <div className="max-w-xl space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Signature Visual Experience
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight">
              Interactive College Knowledge Map
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Explore the living peer-to-peer web of your campus. Center nodes reveal top student contributors, with animated connection lines tracing who taught whom, what subject was mastered, and cumulative watch hours.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveView('knowledge_map')}
                className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-900 font-extrabold text-xs tracking-wide transition-all flex items-center gap-2 shadow-lg"
              >
                <Share2 className="w-4 h-4" />
                Launch Full-Screen Knowledge Graph
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Credit Economy Explainer */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 space-y-8">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Internal Tokenomics
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900">
              The PeerCampus Credit Economy
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              "Credits are internal campus learning points and carry zero monetary cash value."
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="font-bold text-sky-600 text-sm">+50 Credits</div>
              <div className="font-bold text-slate-800">Student Onboarding</div>
              <p className="text-slate-500 text-[11px]">Given to every student upon college email &amp; identity activation.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="font-bold text-rose-600 text-sm">-5 Credits</div>
              <div className="font-bold text-slate-800">Unlock Peer Video</div>
              <p className="text-slate-500 text-[11px]">Learner pays 5 credits to unlock full course modules, code, and notes.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="font-bold text-emerald-600 text-sm">+4 Credits</div>
              <div className="font-bold text-slate-800">Creator Reward</div>
              <p className="text-slate-500 text-[11px]">80% of unlock credits go directly to the student instructor.</p>
            </div>
            <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2">
              <div className="font-bold text-amber-600 text-sm">+2 to +10 Credits</div>
              <div className="font-bold text-slate-800">Gamified Earning</div>
              <p className="text-slate-500 text-[11px]">Earn credits by completing quizzes, streaks, and Learning Arena games.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Best Practices Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>OWASP Top 10 Web Application Security Standards</span>
            </div>
            <h3 className="text-2xl font-extrabold text-white tracking-tight">
              Client-Side Zero-Knowledge End-to-End Encryption
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every student gets a 2048-bit RSA-OAEP public/private keypair. Sensitive study notes and private peer messages are encrypted with AES-256-GCM. Private keys never leave the browser unencrypted.
            </p>
          </div>
          <button
            onClick={() => setActiveView('security_center')}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 transition-colors flex items-center gap-2 shadow-md"
          >
            <Lock className="w-4 h-4 text-sky-600" />
            Inspect Security &amp; Crypto Center →
          </button>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-slate-900">
          Ready to Modernize Your Campus Learning?
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
          Join Rajkiya Engineering College Sonbhadra, Delhi Tech Institute, and leading campuses already connected.
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onOpenRegisterCollege}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors"
          >
            Register College Portal
          </button>
          <button
            onClick={onOpenStudentSignup}
            className="px-6 py-3 rounded-xl bg-sky-600 text-white font-bold text-xs hover:bg-sky-500 transition-colors"
          >
            Join as Student (+50 Credits)
          </button>
        </div>
      </section>
    </div>
  );
};
