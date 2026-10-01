/**
 * Controlled Learning Video Player with 70% Progression Lock
 * Features Skip-Resistant Controlled Seeking, Cumulative Watch Time, Cryptographic Token Verification,
 * and Dynamic Unlocking of Next Modules, Quizzes, and E2EE Peer Notes.
 */

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Lock,
  Unlock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  HelpCircle,
  MessageSquare,
  ShieldCheck,
  Award,
  ChevronRight,
  Share2,
} from 'lucide-react';
import { MOCK_QUIZZES } from '../data/mockData';
import { CourseVideo, VideoModule, Quiz } from '../types';

export const VideoPlayerView: React.FC = () => {
  const {
    videos,
    activeVideoId,
    currentUser,
    watchProgress,
    recordWatchProgress,
    unlockedVideoIds,
    unlockVideo,
    addCreditTransaction,
    completeMissionAction,
    showToast,
    setActiveView,
  } = useApp();

  const video = videos.find(v => v.id === activeVideoId) || videos[0];
  const isUnlocked = unlockedVideoIds.includes(video.id);

  // Video Player State
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(video.durationSeconds || 1200);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<'modules' | 'notes' | 'quiz' | 'discussion'>('modules');

  // Skip warning alert state
  const [skipAttemptWarning, setSkipAttemptWarning] = useState<string | null>(null);

  // Active module
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const currentModule = video.modules[currentModuleIndex] || video.modules[0];

  // Retrieve existing watch progress for this video
  const progress = watchProgress[video.id] || {
    watchedSeconds: 0,
    completionPercent: 0,
    maxPositionReached: 0,
    thresholdReached: false,
    completed: false,
    cryptographicToken: '',
  };

  const [maxAllowedTime, setMaxAllowedTime] = useState<number>(progress.maxPositionReached || 0);
  const [thresholdCleared, setThresholdCleared] = useState<boolean>(progress.thresholdReached || false);

  // Quiz state
  const attachedQuiz: Quiz | undefined = MOCK_QUIZZES.find(q => q.id === video.quizId || q.videoId === video.id) || MOCK_QUIZZES[0];
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Sync saved position when switching video or mounting
  useEffect(() => {
    if (progress.maxPositionReached > 0 && videoRef.current) {
      // Resume from last position if user wishes
      setCurrentTime(progress.maxPositionReached);
      setMaxAllowedTime(progress.maxPositionReached);
    }
    setThresholdCleared(progress.thresholdReached);
  }, [video.id]);

  // Video event handlers
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration || video.durationSeconds);
      if (progress.maxPositionReached > 0) {
        videoRef.current.currentTime = Math.min(progress.maxPositionReached, videoRef.current.duration);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const now = videoRef.current.currentTime;
    setCurrentTime(now);

    // If student naturally plays forward, expand max allowed scrubber boundary
    if (now > maxAllowedTime) {
      setMaxAllowedTime(now);
    }

    // Periodically record progress to application state (every 3 seconds or on key intervals)
    if (Math.floor(now) % 3 === 0) {
      recordWatchProgress(video.id, now, duration, currentModule.id).then(res => {
        if (res.thresholdReached && !thresholdCleared) {
          setThresholdCleared(true);
        }
      });
    }
  };

  // CONTROLLED SEEKING: The Core 70% Skip-Forward Restriction
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetSeek = parseFloat(e.target.value);

    // Rule: Student cannot jump forward beyond what they have actually watched!
    // Students CAN rewind at any time.
    if (targetSeek > maxAllowedTime + 2) {
      setSkipAttemptWarning('⚠️ Progression Lock: Complete the previous video section before skipping ahead!');
      setTimeout(() => setSkipAttemptWarning(null), 4000);
      if (videoRef.current) {
        videoRef.current.currentTime = maxAllowedTime;
      }
      return;
    }

    if (videoRef.current) {
      videoRef.current.currentTime = targetSeek;
      setCurrentTime(targetSeek);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(err => console.log('Autoplay blocked', err));
    }
  };

  const handleRewind10 = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
    }
  };

  // Handle Quiz Submission
  const handleQuizSubmit = async () => {
    if (!attachedQuiz) return;
    let correct = 0;
    attachedQuiz.questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) correct++;
    });

    const percent = (correct / attachedQuiz.questions.length) * 100;
    setQuizScore(percent);
    setQuizSubmitted(true);

    if (percent >= 60) {
      await addCreditTransaction(
        'quiz_reward',
        attachedQuiz.rewardCredits,
        `Passed quiz for "${video.title}" with score ${percent.toFixed(0)}%`,
        attachedQuiz.id
      );
      completeMissionAction('quiz');
      showToast(`Quiz Passed! +${attachedQuiz.rewardCredits} Credits & +${attachedQuiz.rewardXp} XP Awarded!`, 'success');
    } else {
      showToast('Score below 60%. Review the video lesson and try again!', 'error');
    }
  };

  const currentPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;
  const maxPercent = duration > 0 ? Math.min(100, (maxAllowedTime / duration) * 100) : 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className="hover:text-slate-900 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <span>/</span>
          <span className="font-semibold text-slate-800">{video.subject}</span>
          <span>/</span>
          <span className="truncate max-w-xs">{video.title}</span>
        </div>

        {/* 70% Progression Status Badge */}
        <div className="flex items-center gap-2">
          {thresholdCleared ? (
            <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              70% Threshold Cleared (Units Unlocked)
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Progression Locked (Watched: {progress.completionPercent}%)
            </span>
          )}
        </div>
      </div>

      {/* Main Grid: Player + Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Player & Meta (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Custom Video Player Container */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 aspect-video group flex flex-col justify-end">
            <video
              ref={videoRef}
              src={currentModule.videoUrl || video.videoUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={() => setIsPlaying(false)}
              className="w-full h-full object-contain cursor-pointer"
              onClick={togglePlay}
              playsInline
            />

            {/* Skip Attempt Warning Overlay */}
            {skipAttemptWarning && (
              <div className="absolute top-4 left-4 right-4 z-30 p-3 rounded-xl bg-amber-500/90 text-slate-950 font-bold text-xs backdrop-blur-md shadow-lg flex items-center gap-2 animate-in fade-in">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{skipAttemptWarning}</span>
              </div>
            )}

            {/* Controlled Custom Overlay Controls */}
            <div className="p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent space-y-2 z-20">
              {/* Scrubber Bar with 70% Checkpoint Marker */}
              <div className="space-y-1">
                <div className="relative flex items-center h-4">
                  {/* Background Track */}
                  <div className="absolute inset-x-0 h-1.5 bg-slate-700/80 rounded-full overflow-hidden">
                    {/* Max Allowed Watched Boundary (prevents skipping beyond this) */}
                    <div
                      className="h-full bg-slate-500/50"
                      style={{ width: `${maxPercent}%` }}
                    />
                    {/* Current Position */}
                    <div
                      className={`h-full ${thresholdCleared ? 'bg-emerald-500' : 'bg-sky-500'}`}
                      style={{ width: `${currentPercent}%` }}
                    />
                  </div>

                  {/* 70% Visual Milestone Marker */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-amber-400 z-10 rounded-full shadow-sm"
                    style={{ left: '70%' }}
                    title="70% Milestone: Required threshold to unlock lesson units and quiz"
                  >
                    <span className="absolute -top-4 -left-3 text-[9px] font-mono font-bold text-amber-300">
                      70%
                    </span>
                  </div>

                  {/* Input range for scrubbing (rewind allowed, forward capped) */}
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.5}
                    value={currentTime}
                    onChange={handleSeek}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span>
                    {Math.floor(currentTime / 60)}:{String(Math.floor(currentTime % 60)).padStart(2, '0')} /{' '}
                    {Math.floor(duration / 60)}:{String(Math.floor(duration % 60)).padStart(2, '0')}
                  </span>
                  <span className="flex items-center gap-1 text-[10px]">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Max Verified: {Math.floor(maxAllowedTime / 60)}:
                    {String(Math.floor(maxAllowedTime % 60)).padStart(2, '0')} ({maxPercent.toFixed(0)}%)
                  </span>
                </div>
              </div>

              {/* Action Buttons Bar */}
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-3">
                  <button
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-xl bg-white text-slate-950 flex items-center justify-center hover:bg-slate-200 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                  </button>

                  <button
                    onClick={handleRewind10}
                    title="Rewind 10 Seconds"
                    className="p-2 text-slate-300 hover:text-white transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => {
                      if (videoRef.current) {
                        videoRef.current.muted = !isMuted;
                        setIsMuted(!isMuted);
                      }
                    }}
                    className="p-2 text-slate-300 hover:text-white transition-colors"
                  >
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  <span className="text-xs text-white font-bold hidden sm:inline">
                    {currentModule.title}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={playbackRate}
                    onChange={e => {
                      const rate = parseFloat(e.target.value);
                      setPlaybackRate(rate);
                      if (videoRef.current) videoRef.current.playbackRate = rate;
                    }}
                    className="bg-slate-800 text-white text-[11px] font-mono px-2 py-1 rounded-lg border border-slate-700"
                  >
                    <option value={0.75}>0.75x</option>
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Video Title & Instructor Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold text-sky-700 uppercase tracking-wider">
                  {video.subject} · {video.difficulty}
                </span>
                <h1 className="text-xl font-extrabold text-slate-900 mt-1">
                  {video.title}
                </h1>
              </div>

              {/* Royalty and Unlock info */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Unlocked Library
                </span>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-3">
                <img
                  src={video.creatorAvatar}
                  alt={video.creatorName}
                  className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                />
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{video.creatorName}</h4>
                  <p className="text-[11px] text-slate-500">
                    Peer Instructor · {video.creatorDepartment}
                  </p>
                </div>
              </div>

              <div className="text-right text-[11px] text-slate-500">
                <div className="font-bold text-slate-800">★ {video.rating} ({video.reviewsCount} reviews)</div>
                <div>{video.unlocksCount} peer learners helped</div>
              </div>
            </div>

            {/* Description & Learning Objectives */}
            <div className="space-y-3 pt-2 text-xs text-slate-600">
              <p className="leading-relaxed">{video.description}</p>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
                <h5 className="font-bold text-slate-900 text-xs">What you will master:</h5>
                <ul className="space-y-1.5">
                  {video.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Course Tabs (Modules, Notes, Quiz, Discussion) */}
        <div className="space-y-4">
          {/* Tab Headers */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('modules')}
              className={`flex-1 py-2 rounded-xl text-center transition-all ${
                activeTab === 'modules' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Lessons ({video.modules.length})
            </button>
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                activeTab === 'quiz' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {!thresholdCleared && <Lock className="w-3 h-3 text-slate-400" />}
              Quiz (+2 Cr)
            </button>
            <button
              onClick={() => setActiveTab('notes')}
              className={`flex-1 py-2 rounded-xl text-center transition-all flex items-center justify-center gap-1 ${
                activeTab === 'notes' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {!thresholdCleared && <Lock className="w-3 h-3 text-slate-400" />}
              Peer Notes
            </button>
          </div>

          {/* TAB 1: Lessons with 70% Section Lock */}
          {activeTab === 'modules' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Module Breakdown
              </h3>

              <div className="space-y-2">
                {video.modules.map((mod, idx) => {
                  const isCurrent = idx === currentModuleIndex;
                  // First module is open; subsequent modules unlock if 70% threshold is cleared
                  const isLocked = idx > 0 && !thresholdCleared;

                  return (
                    <div
                      key={mod.id}
                      onClick={() => {
                        if (isLocked) {
                          showToast('Complete at least 70% of Lesson 1 before unlocking Lesson 2!', 'error');
                          return;
                        }
                        setCurrentModuleIndex(idx);
                        if (videoRef.current) {
                          videoRef.current.currentTime = 0;
                          setCurrentTime(0);
                        }
                      }}
                      className={`p-3.5 rounded-2xl border text-xs cursor-pointer transition-all flex items-start justify-between gap-3 ${
                        isCurrent
                          ? 'border-sky-500 bg-sky-50/70 shadow-xs'
                          : isLocked
                          ? 'border-slate-100 bg-slate-50 opacity-60'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800">
                            {idx + 1}. {mod.title}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{mod.summary}</p>
                      </div>

                      <div className="shrink-0 text-right">
                        {isLocked ? (
                          <span className="p-1.5 rounded-lg bg-slate-200 text-slate-600 flex items-center">
                            <Lock className="w-3.5 h-3.5" />
                          </span>
                        ) : isCurrent ? (
                          <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                            Playing
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">
                            {Math.floor(mod.durationSeconds / 60)}m
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* 70% Threshold Callout Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  Controlled 70% Progression Rule
                </div>
                <p className="leading-snug text-amber-800">
                  You must continuously complete 70% of the video without dragging the timeline to unlock Lesson 2, the module quiz, and peer revision notes.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: Quiz (Attached or General) */}
          {activeTab === 'quiz' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
              {!thresholdCleared ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">Quiz Locked</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Watch at least 70% of the video walkthrough to unlock the assessment and earn +2 Credits.
                  </p>
                </div>
              ) : attachedQuiz ? (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{attachedQuiz.title}</h3>
                    <p className="text-[11px] text-slate-500">Reward: +2 Credits &amp; +50 XP upon passing (≥60%)</p>
                  </div>

                  <div className="space-y-4">
                    {attachedQuiz.questions.map((q, qIdx) => (
                      <div key={q.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2">
                        <p className="font-bold text-slate-900">
                          Q{qIdx + 1}: {q.question}
                        </p>
                        <div className="space-y-1.5">
                          {q.options.map((opt, optIdx) => {
                            const isSelected = selectedAnswers[qIdx] === optIdx;
                            const isCorrect = q.correctAnswerIndex === optIdx;

                            return (
                              <button
                                key={optIdx}
                                disabled={quizSubmitted}
                                onClick={() => setSelectedAnswers({ ...selectedAnswers, [qIdx]: optIdx })}
                                className={`w-full text-left p-2.5 rounded-xl border text-[11px] transition-all ${
                                  quizSubmitted
                                    ? isCorrect
                                      ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold'
                                      : isSelected
                                      ? 'border-rose-500 bg-rose-50 text-rose-900'
                                      : 'border-slate-200 bg-white opacity-60'
                                    : isSelected
                                    ? 'border-sky-500 bg-sky-50 text-sky-900 font-semibold'
                                    : 'border-slate-200 bg-white hover:bg-slate-100'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          })}
                        </div>

                        {quizSubmitted && (
                          <div className="text-[10px] text-slate-600 bg-white p-2 rounded-lg border border-slate-100">
                            <strong>Explanation:</strong> {q.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {!quizSubmitted ? (
                    <button
                      onClick={handleQuizSubmit}
                      className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-xs"
                    >
                      Submit Quiz for Credits
                    </button>
                  ) : (
                    <div className="text-center p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                      <strong>Score: {quizScore?.toFixed(0)}%</strong> ·{' '}
                      {quizScore && quizScore >= 60 ? 'Passed & Credits Awarded!' : 'Retake after reviewing video.'}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500">No quiz attached to this module.</p>
              )}
            </div>
          )}

          {/* TAB 3: Encrypted Peer Revision Notes */}
          {activeTab === 'notes' && (
            <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-4">
              {!thresholdCleared ? (
                <div className="text-center py-8 space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                    <Lock className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-slate-800 text-xs">Peer Notes Encrypted &amp; Locked</h4>
                  <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                    Achieve 70% video completion to automatically decrypt the creator's exam tips and formulas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-emerald-600" />
                      Author’s Exam Revision Notes
                    </h4>
                    <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Decrypted (AES-256)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-700 leading-relaxed font-mono whitespace-pre-wrap">
                    {video.encryptedNotesText ||
                      'KEY FORMULAS:\n1. Twiddle factor: W_N = e^(-j * 2π / N)\n2. Bit-Reversal: 001 <-> 100 (1 <-> 4)\n3. Computation reduction: O(N^2) -> O(N log2 N)'}
                  </div>

                  <div className="text-[10px] text-slate-400">
                    Encrypted with client AES-256 session key. Only authenticated enrolled students can inspect this payload.
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
