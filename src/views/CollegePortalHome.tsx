/**
 * College Portal Homepage View (/college/:slug)
 * Displays institution-specific branding, stats, trending courses, announcements & top student creators
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Building2,
  Users,
  Video,
  Clock,
  Play,
  Flame,
  Award,
  BookOpen,
  ArrowRight,
  Filter,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface CollegePortalHomeProps {
  onOpenStudentSignup: () => void;
}

export const CollegePortalHome: React.FC<CollegePortalHomeProps> = ({
  onOpenStudentSignup,
}) => {
  const { currentCollege, videos, setActiveVideoId, setActiveView, unlockVideo, currentUser, unlockedVideoIds } = useApp();

  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Filter videos by college (Tenant isolation!)
  const collegeVideos = videos.filter(v => v.collegeId === currentCollege.id && v.status === 'published');

  const filteredVideos = collegeVideos.filter(v => {
    const matchesDept = selectedDept === 'All' || v.creatorDepartment === selectedDept;
    const matchesCat = selectedCategory === 'All' || v.category === selectedCategory;
    return matchesDept && matchesCat;
  });

  return (
    <div className="space-y-10 pb-20">
      {/* College Branded Hero Header */}
      <section className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 text-white shadow-lg">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={currentCollege.coverImage}
            alt={currentCollege.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-10 p-6 sm:p-10 max-w-5xl space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-md bg-white/10 text-sky-300 backdrop-blur-md border border-white/10">
              /college/{currentCollege.slug}
            </span>
            <span className="text-[11px] font-semibold text-slate-300">
              {currentCollege.city}, {currentCollege.state} · {currentCollege.university}
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Code: {currentCollege.accessCode}
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {currentCollege.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
              {currentCollege.description}
            </p>
          </div>

          {/* College Stats Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-white">{currentCollege.stats.totalStudents}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Users className="w-3.5 h-3.5 text-sky-400" /> Total Students
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-emerald-400">{currentCollege.stats.activeLearners}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Flame className="w-3.5 h-3.5 text-emerald-400" /> Active Learners
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-sky-400">{collegeVideos.length}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Video className="w-3.5 h-3.5 text-sky-400" /> Peer Videos
              </div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="text-xl sm:text-2xl font-black text-amber-400">{currentCollege.stats.learningHours}h</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Learning Hours
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => setActiveView('dashboard')}
              className="px-5 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs transition-colors flex items-center gap-1.5"
            >
              <BookOpen className="w-4 h-4" /> Open Learning Dashboard
            </button>
            <button
              onClick={onOpenStudentSignup}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-colors"
            >
              Join College as Student (+50 Credits)
            </button>
            <button
              onClick={() => setActiveView('teach_upload')}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" /> Teach &amp; Earn Credits
            </button>
          </div>
        </div>
      </section>

      {/* College Announcements */}
      {currentCollege.announcements && currentCollege.announcements.length > 0 && (
        <section className="bg-sky-50/70 border border-sky-200/80 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-sky-950 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-600 animate-ping" />
              Campus Announcements &amp; Sprints
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentCollege.announcements.map(ann => (
              <div key={ann.id} className="bg-white p-4 rounded-xl border border-sky-100 shadow-xs space-y-1">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-semibold text-sky-800">{ann.author}</span>
                  <span>{ann.date}</span>
                </div>
                <h3 className="text-xs font-bold text-slate-900">{ann.title}</h3>
                <p className="text-[11px] text-slate-600 leading-relaxed">{ann.content}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Course Discovery & Filters */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Peer Learning Video Modules ({filteredVideos.length})
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Verified peer video walkthroughs with 70% progression lock and downloadable study notes.
            </p>
          </div>

          {/* Department Filter Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs">
            <button
              onClick={() => setSelectedDept('All')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                selectedDept === 'All' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Departments
            </button>
            {currentCollege.departments.map(dept => (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  selectedDept === dept ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {dept.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        {filteredVideos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map(vid => {
              const isUnlocked = unlockedVideoIds.includes(vid.id);

              return (
                <div
                  key={vid.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail with overlay duration and unlock badge */}
                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                      <img
                        src={vid.thumbnailUrl}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

                      <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900/80 text-white backdrop-blur-md">
                          {vid.difficulty}
                        </span>
                      </div>

                      <div className="absolute top-3 right-3">
                        {isUnlocked ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500 text-white flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3 h-3" /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-500 text-white flex items-center gap-1 shadow-sm">
                            5 Credits
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-3 right-3 text-[11px] font-mono text-white bg-slate-900/90 px-2 py-0.5 rounded">
                        {Math.floor(vid.durationSeconds / 60)}:
                        {String(vid.durationSeconds % 60).padStart(2, '0')}
                      </div>
                    </div>

                    {/* Metadata & Title */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500">
                        <span className="font-semibold text-sky-700">{vid.subject}</span>
                        <span aria-hidden="true">·</span>
                        <span>{vid.creatorDepartment}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                        {vid.title}
                      </h3>

                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                        {vid.description}
                      </p>

                      {/* Instructor attribution */}
                      <div className="flex items-center gap-2.5 pt-2 border-t border-slate-100">
                        <img
                          src={vid.creatorAvatar}
                          alt={vid.creatorName}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div className="text-[11px] truncate">
                          <span className="font-bold text-slate-800">{vid.creatorName}</span>
                          <span className="text-slate-400 ml-1.5">★ {vid.rating} ({vid.unlocksCount} learners)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div className="px-5 pb-5 pt-0">
                    {isUnlocked ? (
                      <button
                        onClick={() => {
                          setActiveVideoId(vid.id);
                          setActiveView('video_player');
                        }}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" /> Watch Lesson (70% Lock)
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          const res = await unlockVideo(vid.id);
                          if (res.success) {
                            setActiveVideoId(vid.id);
                            setActiveView('video_player');
                          }
                        }}
                        className="w-full py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        Unlock for 5 Credits
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
            <BookOpen className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-slate-800 text-sm">No courses found in this category</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Be the first student from {currentCollege.name} to upload a peer learning resource in this department!
            </p>
            <button
              onClick={() => setActiveView('teach_upload')}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white text-xs font-bold"
            >
              Upload Course Now (+10 Credits)
            </button>
          </div>
        )}
      </section>

      {/* College Rules & Philosophy */}
      <section className="bg-white rounded-2xl p-6 border border-slate-200 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Campus Peer Learning Guidelines
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
          {currentCollege.rules.map((rule, idx) => (
            <li key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <span className="font-bold text-sky-600">{idx + 1}.</span>
              <span>{rule}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};
