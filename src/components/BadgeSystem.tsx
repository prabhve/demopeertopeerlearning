/**
 * Badge System Component
 * Displays unlocked skills as visual achievements on the student profile.
 * Features Tailwind CSS styling, dynamic state tracking for milestone completion,
 * rarity tier aesthetics (Common, Rare, Epic, Legendary), and interactive milestone inspection.
 */

import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { SkillMilestoneBadge } from '../types';
import { INITIAL_SKILL_BADGES } from '../data/badgeMilestonesData';
import {
  Award,
  Sparkles,
  Lock,
  Unlock,
  CheckCircle2,
  Code2,
  Cpu,
  Zap,
  Flame,
  ShieldCheck,
  Trophy,
  BookOpen,
  Terminal,
  Clock,
  ArrowRight,
  Filter,
  Check,
  X,
  Share2,
} from 'lucide-react';

interface BadgeSystemProps {
  onNavigateToView?: (view: string) => void;
}

export const BadgeSystem: React.FC<BadgeSystemProps> = ({ onNavigateToView }) => {
  const {
    currentUser,
    addCreditTransaction,
    setActiveVideoId,
    setActiveView,
    showToast,
    logSecurityEvent,
  } = useApp();

  // Load badges with local state persistence
  const [badges, setBadges] = useState<SkillMilestoneBadge[]>(() => {
    const saved = localStorage.getItem(`peercampus_skill_badges_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_SKILL_BADGES;
      }
    }
    return INITIAL_SKILL_BADGES;
  });

  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'unlocked' | 'in_progress'>('all');
  const [selectedBadge, setSelectedBadge] = useState<SkillMilestoneBadge | null>(null);

  // Synchronize badge milestone progress with currentUser dynamic stats
  useEffect(() => {
    setBadges(prevBadges =>
      prevBadges.map(b => {
        let updatedProgress = b.currentProgress;

        // Dynamic tracking based on user real stats
        if (b.id === 'badge-streak-titan') {
          updatedProgress = currentUser.streak;
        } else if (b.id === 'badge-campus-mentor') {
          updatedProgress = currentUser.studentsHelped;
        }

        const isNowComplete = updatedProgress >= b.targetProgress;
        const isUnlocked = b.isUnlocked || isNowComplete;

        return {
          ...b,
          currentProgress: updatedProgress,
          isUnlocked,
          unlockedAt: b.unlockedAt || (isNowComplete ? new Date().toISOString().split('T')[0] : undefined),
        };
      })
    );
  }, [currentUser.streak, currentUser.studentsHelped]);

  // Save to localStorage whenever badges change
  useEffect(() => {
    localStorage.setItem(`peercampus_skill_badges_${currentUser.id}`, JSON.stringify(badges));
  }, [badges, currentUser.id]);

  // Handle claiming milestone reward
  const handleClaimReward = async (badge: SkillMilestoneBadge) => {
    if (badge.claimed || !badge.isUnlocked) return;

    // Award credits and XP
    await addCreditTransaction(
      'admin_adjustment',
      badge.rewardCredits,
      `Milestone Achievement Unlocked: ${badge.name}`,
      badge.id
    );

    // Update claimed status
    setBadges(prev =>
      prev.map(b => (b.id === badge.id ? { ...b, claimed: true } : b))
    );

    logSecurityEvent(
      'SKILL_BADGE_CLAIMED',
      'info',
      `Student ${currentUser.name} claimed ${badge.name} (+${badge.rewardCredits} Credits, +${badge.rewardXp} XP). Hash: ${badge.verificationHash?.substring(0, 16)}...`
    );

    showToast(`🏆 Milestone Claimed! +${badge.rewardCredits} Credits & +${badge.rewardXp} XP added to profile!`, 'success');

    if (selectedBadge?.id === badge.id) {
      setSelectedBadge({ ...badge, claimed: true });
    }
  };

  // Helper: map icon string to Lucide component
  const renderBadgeIcon = (iconName: string, className: string = 'w-6 h-6') => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className={className} />;
      case 'Code2':
        return <Code2 className={className} />;
      case 'Terminal':
        return <Terminal className={className} />;
      case 'Zap':
        return <Zap className={className} />;
      case 'Flame':
        return <Flame className={className} />;
      case 'ShieldCheck':
        return <ShieldCheck className={className} />;
      case 'Trophy':
        return <Trophy className={className} />;
      case 'Sparkles':
        return <Sparkles className={className} />;
      case 'BookOpen':
        return <BookOpen className={className} />;
      default:
        return <Award className={className} />;
    }
  };

  // Rarity theme styling config
  const rarityConfig = {
    common: {
      border: 'border-slate-200 hover:border-slate-300',
      bgGlow: 'bg-slate-50',
      tagText: 'text-slate-600',
      badgeBorder: 'border-slate-300',
      iconColor: 'text-slate-700',
      glowShadow: 'shadow-slate-200/50',
      accentBar: 'bg-slate-500',
      label: 'Common Skill',
    },
    rare: {
      border: 'border-sky-200 hover:border-sky-400',
      bgGlow: 'bg-sky-50/50',
      tagText: 'text-sky-700',
      badgeBorder: 'border-sky-400',
      iconColor: 'text-sky-600',
      glowShadow: 'shadow-sky-500/20',
      accentBar: 'bg-sky-500',
      label: 'Rare Skill',
    },
    epic: {
      border: 'border-indigo-200 hover:border-indigo-400',
      bgGlow: 'bg-indigo-50/40',
      tagText: 'text-indigo-700',
      badgeBorder: 'border-indigo-500',
      iconColor: 'text-indigo-600',
      glowShadow: 'shadow-indigo-500/25',
      accentBar: 'bg-indigo-600',
      label: 'Epic Milestone',
    },
    legendary: {
      border: 'border-amber-300 hover:border-amber-400',
      bgGlow: 'bg-amber-50/50',
      tagText: 'text-amber-800',
      badgeBorder: 'border-amber-500',
      iconColor: 'text-amber-600',
      glowShadow: 'shadow-amber-500/30',
      accentBar: 'bg-gradient-to-r from-amber-500 to-amber-600',
      label: 'Legendary Mastery',
    },
  };

  // Filtered list
  const filteredBadges = badges.filter(b => {
    const matchesCategory = filterCategory === 'all' || b.category === filterCategory;
    const matchesStatus =
      filterStatus === 'all' ||
      (filterStatus === 'unlocked' && b.isUnlocked) ||
      (filterStatus === 'in_progress' && !b.isUnlocked);
    return matchesCategory && matchesStatus;
  });

  const unlockedCount = badges.filter(b => b.isUnlocked).length;
  const totalCreditsAvailable = badges.reduce((acc, b) => acc + (b.isUnlocked ? b.rewardCredits : 0), 0);

  return (
    <div className="space-y-6">
      {/* Top Achievement Stats Bar */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">
                Skill Mastery Engine
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Verifiable Achievements
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Award className="w-6 h-6 text-sky-600" />
              Skill Badges &amp; Milestone System
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Visual achievements earned through genuine learning progression, code debugging, and campus knowledge sharing.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <span className="text-slate-400 block text-[10px] font-bold uppercase">Badges Unlocked</span>
              <span className="text-lg font-black text-slate-900">
                {unlockedCount} <span className="text-slate-400 text-xs font-medium">/ {badges.length}</span>
              </span>
            </div>

            <div className="px-4 py-2.5 rounded-2xl bg-sky-50 border border-sky-200 text-xs">
              <span className="text-sky-700 block text-[10px] font-bold uppercase">Reward Credits</span>
              <span className="text-lg font-black text-sky-950">+{totalCreditsAvailable} Cr</span>
            </div>
          </div>
        </div>

        {/* Global Level Progress Bar */}
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <div className="flex justify-between text-xs font-semibold">
            <span className="text-slate-600">Total Milestone Completion</span>
            <span className="text-slate-800 font-mono">
              {Math.round((unlockedCount / badges.length) * 100)}% Completed
            </span>
          </div>
          <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 rounded-full transition-all duration-500"
              style={{ width: `${(unlockedCount / badges.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Filter Controls (Zero-Pill Interactive Button Bar) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All Badges ({badges.length})
            </button>
            <button
              onClick={() => setFilterStatus('unlocked')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'unlocked'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Unlocked ({unlockedCount})
            </button>
            <button
              onClick={() => setFilterStatus('in_progress')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterStatus === 'in_progress'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              In Progress ({badges.length - unlockedCount})
            </button>
          </div>

          {/* Category Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">Skill Area:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
            >
              <option value="all">All Domains</option>
              <option value="programming">Programming &amp; Algorithms</option>
              <option value="electronics">Electronics &amp; Hardware</option>
              <option value="core_eng">Core Engineering</option>
              <option value="community">Campus Mentorship</option>
              <option value="consistency">Streak &amp; Consistency</option>
              <option value="security">Cryptography &amp; Security</option>
            </select>
          </div>
        </div>
      </div>

      {/* Badges Visual Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredBadges.map(badge => {
          const config = rarityConfig[badge.rarity];
          const progressPercent = Math.min(100, Math.round((badge.currentProgress / badge.targetProgress) * 100));
          const canClaim = badge.isUnlocked && !badge.claimed;

          return (
            <div
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`relative bg-white rounded-3xl p-6 border transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md flex flex-col justify-between group ${
                config.border
              } ${badge.isUnlocked ? '' : 'opacity-90'}`}
            >
              <div>
                {/* Header row: Rarity tag + Level stars */}
                <div className="flex items-center justify-between text-xs mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${config.tagText}`}>
                    {config.label}
                  </span>

                  <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
                    <span>Lvl {badge.level}/{badge.maxLevel}</span>
                  </div>
                </div>

                {/* Central Emblem & Title */}
                <div className="flex items-start gap-4">
                  {/* Distinctive Shield Emblem with Rarity-Specific Styling */}
                  <div
                    className={`relative w-16 h-16 rounded-2xl border-2 flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 shadow-sm ${
                      config.badgeBorder
                    } ${config.bgGlow} ${badge.isUnlocked ? '' : 'grayscale'}`}
                  >
                    {renderBadgeIcon(badge.iconName, `w-8 h-8 ${config.iconColor}`)}

                    {/* Glowing lock badge if locked */}
                    {!badge.isUnlocked && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-xs">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                    )}

                    {/* Unlocked checkmark */}
                    {badge.isUnlocked && (
                      <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <Check className="w-3.5 h-3.5 stroke-3" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {badge.skillName}
                    </span>
                    <h3 className="font-extrabold text-slate-900 text-sm leading-snug group-hover:text-sky-600 transition-colors">
                      {badge.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">
                      {badge.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* State Tracking: Milestone Progress Bar or Unlocked Details */}
              <div className="pt-5 mt-4 border-t border-slate-100 space-y-2.5">
                {badge.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {badge.unlockedAt ? `Unlocked · ${badge.unlockedAt}` : 'Milestone Achieved'}
                    </span>

                    {canClaim ? (
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          handleClaimReward(badge);
                        }}
                        className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs animate-bounce shadow-xs transition-colors flex items-center gap-1"
                      >
                        <Sparkles className="w-3 h-3" /> Claim +{badge.rewardCredits} Cr
                      </button>
                    ) : badge.claimed ? (
                      <span className="text-slate-400 font-medium">Claimed (+{badge.rewardCredits} Cr)</span>
                    ) : null}
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-500 font-medium">Milestone Progress</span>
                      <span className="font-bold font-mono text-slate-800">
                        {badge.currentProgress}/{badge.targetProgress} {badge.progressUnit} ({progressPercent}%)
                      </span>
                    </div>

                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${config.accentBar}`}
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Badge Details Modal */}
      {selectedBadge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-sky-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-300">
                  Skill Achievement Specification
                </span>
              </div>
              <button
                onClick={() => setSelectedBadge(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
              {/* Heraldry Artwork */}
              <div className="text-center space-y-3">
                <div
                  className={`w-24 h-24 rounded-3xl border-4 mx-auto flex items-center justify-center shadow-lg ${
                    rarityConfig[selectedBadge.rarity].badgeBorder
                  } ${rarityConfig[selectedBadge.rarity].bgGlow}`}
                >
                  {renderBadgeIcon(selectedBadge.iconName, `w-12 h-12 ${rarityConfig[selectedBadge.rarity].iconColor}`)}
                </div>

                <div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${rarityConfig[selectedBadge.rarity].tagText}`}>
                    {rarityConfig[selectedBadge.rarity].label} · Level {selectedBadge.level}/{selectedBadge.maxLevel}
                  </span>
                  <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                    {selectedBadge.name}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                    {selectedBadge.description}
                  </p>
                </div>
              </div>

              {/* Milestone Criteria Checklist */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 uppercase text-[10px] tracking-wider block">
                  Milestone Completion Requirement
                </span>
                <p className="text-slate-700 leading-relaxed">
                  {selectedBadge.milestoneCriteria}
                </p>
                <div className="pt-2 flex items-center justify-between font-mono text-[11px]">
                  <span className="text-slate-500">Current Status:</span>
                  <strong className="text-slate-900">
                    {selectedBadge.currentProgress} of {selectedBadge.targetProgress} {selectedBadge.progressUnit} ({Math.min(100, Math.round((selectedBadge.currentProgress / selectedBadge.targetProgress) * 100))}%)
                  </strong>
                </div>
              </div>

              {/* Rewards & Perks */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 space-y-1">
                  <span className="text-sky-700 text-[10px] font-bold uppercase block">Credit Reward</span>
                  <strong className="text-sky-950 text-base">+{selectedBadge.rewardCredits} Credits</strong>
                </div>

                <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 space-y-1">
                  <span className="text-indigo-700 text-[10px] font-bold uppercase block">Mastery XP</span>
                  <strong className="text-indigo-950 text-base">+{selectedBadge.rewardXp} XP</strong>
                </div>
              </div>

              {/* Next Perk */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 space-y-1">
                <strong className="font-bold text-[11px] block">Perk Unlocked:</strong>
                <p className="text-[11px] text-amber-800 leading-snug">{selectedBadge.nextPerk}</p>
              </div>

              {/* Cryptographic Verification Hash */}
              {selectedBadge.verificationHash && (
                <div className="p-3 rounded-xl bg-slate-900 text-slate-300 font-mono text-[10px] space-y-1 break-all">
                  <span className="text-slate-500 block">CRYPTOGRAPHIC AUDIT PROOF (SHA-256):</span>
                  {selectedBadge.verificationHash}
                </div>
              )}

              {/* Claim or Advance Actions */}
              <div className="pt-2 flex items-center justify-end gap-3">
                {selectedBadge.isUnlocked && !selectedBadge.claimed ? (
                  <button
                    onClick={() => handleClaimReward(selectedBadge)}
                    className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-colors flex items-center justify-center gap-2 shadow-md"
                  >
                    <Sparkles className="w-4 h-4" /> Claim Milestone Reward (+{selectedBadge.rewardCredits} Credits)
                  </button>
                ) : !selectedBadge.isUnlocked ? (
                  <button
                    onClick={() => {
                      setSelectedBadge(null);
                      if (selectedBadge.category === 'programming') {
                        setActiveView('learning_arena');
                      } else if (selectedBadge.category === 'community') {
                        setActiveView('teach_upload');
                      } else {
                        setActiveView('college_home');
                      }
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    Take Action to Complete Milestone <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                  >
                    Close Achievement Spec
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
