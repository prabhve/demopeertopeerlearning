/**
 * Teach & Earn Marketplace View
 * Step-by-Step Peer Video Upload Wizard, Moderation Status & Creator Impact Analytics
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Video,
  Clock,
  CreditCard,
  ShieldCheck,
  Eye,
  Award,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { CourseVideo } from '../types';

export const TeachAndEarnMarketplace: React.FC = () => {
  const {
    currentUser,
    currentCollege,
    videos,
    uploadVideo,
    setActiveVideoId,
    setActiveView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard'>('upload');

  // Upload Wizard Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    subject: 'Computer Science & Engineering',
    category: 'Academics',
    difficulty: 'Intermediate' as const,
    language: 'English / Hindi',
    durationMinutes: 15,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
    learningObjectives: 'Derive key exam formulas, Master step-by-step problem solving, Avoid common university errors',
    encryptedNotesText: 'EXAM TIPS: Always draw the block diagram with label markings before beginning algebraic reductions for partial credit.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // My uploaded courses
  const myUploadedVideos = videos.filter(v => v.creatorId === currentUser.id);

  // Total creator earnings
  const totalEarnedCredits = myUploadedVideos.reduce((acc, v) => acc + v.unlocksCount * 4, 0);
  const totalLearners = myUploadedVideos.reduce((acc, v) => acc + v.unlocksCount, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title) {
      showToast('Please provide a course title', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const objectives = form.learningObjectives.split(',').map(s => s.trim()).filter(Boolean);

      await uploadVideo({
        title: form.title,
        description: form.description || 'Comprehensive peer learning walkthrough.',
        subject: form.subject,
        category: form.category,
        difficulty: form.difficulty,
        language: form.language,
        durationSeconds: Number(form.durationMinutes) * 60,
        videoUrl: form.videoUrl,
        thumbnailUrl: form.thumbnailUrl,
        learningObjectives: objectives.length ? objectives : ['Master core concepts'],
        encryptedNotesText: form.encryptedNotesText,
      });

      // Reset form & switch to dashboard tab
      setForm({
        title: '',
        description: '',
        subject: 'Computer Science & Engineering',
        category: 'Academics',
        difficulty: 'Intermediate',
        language: 'English / Hindi',
        durationMinutes: 15,
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        thumbnailUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
        learningObjectives: 'Master concepts, Practical analysis',
        encryptedNotesText: '',
      });

      setActiveTab('dashboard');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
              Creator Marketplace
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              80% Creator Royalty (4 Credits/Unlock)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <Sparkles className="w-7 h-7 text-sky-600" />
            Teach &amp; Earn
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Every student can be a teacher. Upload concise 10–25 minute walkthroughs of tough topics, get faculty approved, and earn credits whenever classmates unlock your knowledge.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'upload'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Upload New Video
          </button>
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 rounded-xl transition-all ${
              activeTab === 'dashboard'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Creator Analytics ({myUploadedVideos.length})
          </button>
        </div>
      </div>

      {/* TAB 1: Step-by-Step Upload Wizard */}
      {activeTab === 'upload' && (
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-extrabold text-slate-900">
              Publish a Peer Learning Resource
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Target College: <strong>{currentCollege.name}</strong> · All uploads are protected with the 70% progression lock.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-800 mb-1">Video Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Digital Signal Processing: Fast Fourier Transform Explained"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                placeholder="e.g. Microprocessors or Python Algorithms"
                value={form.subject}
                onChange={e => setForm({ ...form, subject: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department / Branch</label>
              <select
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                {currentCollege.departments.map(d => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Difficulty Level</label>
              <select
                value={form.difficulty}
                onChange={e => setForm({ ...form, difficulty: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration (Minutes)</label>
              <input
                type="number"
                min={5}
                max={120}
                value={form.durationMinutes}
                onChange={e => setForm({ ...form, durationMinutes: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Video Resource Stream URL</label>
              <input
                type="url"
                required
                value={form.videoUrl}
                onChange={e => setForm({ ...form, videoUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                HTTPS video streams supported. Progression lock continuously monitors playback seconds.
              </span>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Learning Objectives (Comma separated)</label>
              <input
                type="text"
                value={form.learningObjectives}
                onChange={e => setForm({ ...form, learningObjectives: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">
                Encrypted Peer Revision Notes (Decrypted only after learner completes 70%)
              </label>
              <textarea
                rows={3}
                placeholder="Author formulas, exam cheat-sheets, or derivation secrets..."
                value={form.encryptedNotesText}
                onChange={e => setForm({ ...form, encryptedNotesText: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 font-mono text-[11px] focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Description &amp; Syllabus Context</label>
              <textarea
                rows={2}
                placeholder="Explain what specific exam questions or projects this module addresses..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Tokenomics Preview Callout */}
          <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200 text-xs text-slate-700 space-y-1">
            <div className="font-bold text-sky-950 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-sky-600" />
              Creator Credit Economics
            </div>
            <p className="text-[11px] leading-relaxed">
              When a peer unlocks this video for 5 Credits: <strong>4 Credits</strong> are automatically transferred to your wallet, and <strong>1 Credit</strong> fuels the college ecosystem challenge pool. You also receive <strong>+10 Contribution Credits</strong> immediately upon submission!
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>College Faculty Moderation Queue active</span>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs tracking-wide transition-all shadow-sm flex items-center gap-2"
            >
              <UploadCloud className="w-4 h-4 text-sky-400" />
              {isSubmitting ? 'Encrypting & Submitting...' : 'Submit Course (+10 Credits)'}
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Creator Analytics Dashboard */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          {/* Creator Impact Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Learners Reached</span>
              <div className="text-3xl font-black text-slate-900">{totalLearners}</div>
              <p className="text-[11px] text-slate-500">Students unlocked your modules</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Creator Royalty Earned</span>
              <div className="text-3xl font-black text-emerald-600">+{totalEarnedCredits} Cr</div>
              <p className="text-[11px] text-slate-500">From peer course unlocks</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Modules</span>
              <div className="text-3xl font-black text-sky-600">{myUploadedVideos.length}</div>
              <p className="text-[11px] text-slate-500">Approved on campus portal</p>
            </div>
          </div>

          {/* List of uploaded courses */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900">Your Published &amp; Pending Modules</h3>

            {myUploadedVideos.length > 0 ? (
              <div className="space-y-3">
                {myUploadedVideos.map(vid => (
                  <div
                    key={vid.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-sky-700 uppercase">
                          {vid.subject}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            vid.status === 'published'
                              ? 'bg-emerald-50 text-emerald-800'
                              : 'bg-amber-50 text-amber-800'
                          }`}
                        >
                          {vid.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{vid.title}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400">
                        <span>Duration: {Math.floor(vid.durationSeconds / 60)}m</span>
                        <span>·</span>
                        <span>{vid.unlocksCount} Learners</span>
                        <span>·</span>
                        <span className="text-emerald-700 font-semibold">
                          Earned: {vid.unlocksCount * 4} Cr
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:shrink-0">
                      <button
                        onClick={() => {
                          setActiveVideoId(vid.id);
                          setActiveView('video_player');
                        }}
                        className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
                      >
                        Preview Video
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs">
                You haven't uploaded any courses yet. Share your knowledge with campus peers!
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
