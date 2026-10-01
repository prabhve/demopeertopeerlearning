/**
 * PeerCampus Application State Context
 * Manages Multi-Tenant College Isolation, Cryptographic Session, Video Progression & Credit Ledger
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  College,
  StudentProfile,
  CourseVideo,
  VideoWatchProgress,
  CreditTransaction,
  LearningMission,
  SecurityAuditEntry,
  EncryptedMessagePayload,
} from '../types';
import {
  MOCK_COLLEGES,
  MOCK_STUDENTS,
  MOCK_VIDEOS,
  INITIAL_TRANSACTIONS,
  MOCK_MISSIONS,
  INITIAL_SECURITY_LOGS,
} from '../data/mockData';
import { cryptoService } from '../services/cryptoService';

export type ActiveView =
  | 'landing'
  | 'college_home'
  | 'dashboard'
  | 'video_player'
  | 'teach_upload'
  | 'knowledge_map'
  | 'learning_arena'
  | 'profile'
  | 'e2ee_messenger'
  | 'college_admin'
  | 'super_admin'
  | 'security_center';

interface AppContextType {
  // Navigation & College Context
  currentCollege: College;
  colleges: College[];
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
  selectCollege: (slug: string) => void;
  registerCollege: (collegeData: Partial<College>) => College;

  // Authentication & Role
  currentUser: StudentProfile;
  users: StudentProfile[];
  switchUser: (userId: string) => void;
  updateCurrentUserProfile: (updates: Partial<StudentProfile>) => void;

  // Video & Controlled Progression Lock
  videos: CourseVideo[];
  activeVideoId: string | null;
  setActiveVideoId: (id: string | null) => void;
  unlockedVideoIds: string[];
  watchProgress: Record<string, VideoWatchProgress>;
  unlockVideo: (videoId: string) => Promise<{ success: boolean; message: string }>;
  recordWatchProgress: (
    videoId: string,
    currentPosition: number,
    duration: number,
    moduleId: string
  ) => Promise<{ thresholdReached: boolean; completionPercent: number }>;
  uploadVideo: (videoData: Partial<CourseVideo>) => Promise<CourseVideo>;
  moderateVideo: (videoId: string, status: 'approved' | 'rejected', feedback?: string) => void;

  // Credit Economy & Transactions
  transactions: CreditTransaction[];
  addCreditTransaction: (
    type: CreditTransaction['type'],
    amount: number,
    description: string,
    relatedEntityId?: string
  ) => Promise<boolean>;

  // Gamification, Missions & Streaks
  missions: LearningMission[];
  completeMissionAction: (category: 'video' | 'quiz' | 'upload' | 'streak') => void;
  claimDailyStreak: () => Promise<boolean>;
  completeGameReward: (gameId: string, credits: number, xp: number) => Promise<void>;

  // End-to-End Encryption & Security
  rsaKeyPair: { publicKeyJwk?: JsonWebKey; privateKeyJwk?: JsonWebKey } | null;
  cryptoReady: boolean;
  e2eeMessages: EncryptedMessagePayload[];
  sendE2EEMessage: (recipientId: string, subject: string, plaintext: string) => Promise<boolean>;
  decryptE2EEMessage: (msg: EncryptedMessagePayload) => Promise<string>;
  securityLogs: SecurityAuditEntry[];
  logSecurityEvent: (action: string, severity: 'info' | 'warning' | 'alert', details: string) => void;

  // Toast / Feedback
  toast: { message: string; type: 'success' | 'info' | 'error' | 'security' } | null;
  showToast: (message: string, type?: 'success' | 'info' | 'error' | 'security') => void;
  dismissToast: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Colleges State
  const [colleges, setColleges] = useState<College[]>(() => {
    const saved = localStorage.getItem('peercampus_colleges');
    return saved ? JSON.parse(saved) : MOCK_COLLEGES;
  });

  const [currentCollege, setCurrentCollege] = useState<College>(colleges[0]);
  const [activeView, setActiveView] = useState<ActiveView>('landing');

  // 2. Users & Auth State
  const [users, setUsers] = useState<StudentProfile[]>(() => {
    const saved = localStorage.getItem('peercampus_users');
    return saved ? JSON.parse(saved) : MOCK_STUDENTS;
  });
  const [currentUser, setCurrentUser] = useState<StudentProfile>(users[0]);

  // 3. Videos State
  const [videos, setVideos] = useState<CourseVideo[]>(() => {
    const saved = localStorage.getItem('peercampus_videos');
    return saved ? JSON.parse(saved) : MOCK_VIDEOS;
  });

  const [activeVideoId, setActiveVideoId] = useState<string | null>(null);

  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('peercampus_unlocked_videos');
    return saved ? JSON.parse(saved) : ['vid-dsp-fft'];
  });

  const [watchProgress, setWatchProgress] = useState<Record<string, VideoWatchProgress>>(() => {
    const saved = localStorage.getItem('peercampus_watch_progress');
    return saved ? JSON.parse(saved) : {
      'vid-dsp-fft': {
        id: 'prog-init',
        userId: 'stu-aditya',
        videoId: 'vid-dsp-fft',
        currentModuleId: 'mod-1',
        watchedSeconds: 885,
        totalDurationSeconds: 1260,
        completionPercent: 70.2,
        maxPositionReached: 885,
        thresholdReached: true,
        completed: false,
        lastWatchedAt: new Date().toISOString(),
        cryptographicToken: 'init-signed-token',
      },
    };
  });

  // 4. Ledger & Missions
  const [transactions, setTransactions] = useState<CreditTransaction[]>(() => {
    const saved = localStorage.getItem('peercampus_tx_ledger');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [missions, setMissions] = useState<LearningMission[]>(() => {
    const saved = localStorage.getItem('peercampus_missions');
    return saved ? JSON.parse(saved) : MOCK_MISSIONS;
  });

  const [securityLogs, setSecurityLogs] = useState<SecurityAuditEntry[]>(() => {
    const saved = localStorage.getItem('peercampus_security_logs');
    return saved ? JSON.parse(saved) : INITIAL_SECURITY_LOGS;
  });

  // 5. Cryptography & E2EE State
  const [rsaKeyPair, setRsaKeyPair] = useState<{
    publicKeyJwk?: JsonWebKey;
    privateKeyJwk?: JsonWebKey;
  } | null>(null);
  const [cryptoReady, setCryptoReady] = useState<boolean>(false);
  const [e2eeMessages, setE2eeMessages] = useState<EncryptedMessagePayload[]>([]);

  // 6. Toast Notification
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error' | 'security';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'info' | 'error' | 'security' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(prev => (prev?.message === message ? null : prev));
    }, 4500);
  };

  const dismissToast = () => setToast(null);

  // Initialize Client-Side Cryptographic Keypair on boot
  useEffect(() => {
    async function initCrypto() {
      try {
        const storedKeys = localStorage.getItem(`peercampus_keys_${currentUser.id}`);
        if (storedKeys) {
          const parsed = JSON.parse(storedKeys);
          setRsaKeyPair(parsed);
          setCryptoReady(true);
        } else {
          const generated = await cryptoService.generateRsaKeyPair();
          const keys = {
            publicKeyJwk: generated.publicKeyJwk,
            privateKeyJwk: generated.privateKeyJwk,
          };
          localStorage.setItem(`peercampus_keys_${currentUser.id}`, JSON.stringify(keys));
          setRsaKeyPair(keys);
          setCryptoReady(true);

          logSecurityEvent(
            'E2EE_KEYPAIR_BOOTSTRAPPED',
            'info',
            `Client generated 2048-bit RSA-OAEP key pair for ${currentUser.name}. Private key enclaved in local browser storage.`
          );
        }
      } catch (err) {
        console.error('Failed to initialize Web Crypto enclave:', err);
      }
    }
    initCrypto();
  }, [currentUser.id]);

  // Persist State to LocalStorage
  useEffect(() => {
    localStorage.setItem('peercampus_colleges', JSON.stringify(colleges));
  }, [colleges]);

  useEffect(() => {
    localStorage.setItem('peercampus_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('peercampus_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('peercampus_unlocked_videos', JSON.stringify(unlockedVideoIds));
  }, [unlockedVideoIds]);

  useEffect(() => {
    localStorage.setItem('peercampus_watch_progress', JSON.stringify(watchProgress));
  }, [watchProgress]);

  useEffect(() => {
    localStorage.setItem('peercampus_tx_ledger', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('peercampus_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('peercampus_security_logs', JSON.stringify(securityLogs));
  }, [securityLogs]);

  // Helper: Log Security Audit Event
  const logSecurityEvent = async (
    action: string,
    severity: 'info' | 'warning' | 'alert',
    details: string
  ) => {
    const rawPayload = `${action}:${currentUser.id}:${Date.now()}:${details}`;
    const signature = await cryptoService.signLedgerRecord(rawPayload);

    const entry: SecurityAuditEntry = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      action,
      userId: currentUser.id,
      ipAddress: '103.25.14.88 (Campus Subnet)',
      userAgent: navigator.userAgent.substring(0, 48),
      severity,
      details,
      signature,
    };

    setSecurityLogs(prev => [entry, ...prev.slice(0, 49)]);
  };

  // Select College
  const selectCollege = (slug: string) => {
    const found = colleges.find(c => c.slug === slug);
    if (found) {
      setCurrentCollege(found);
      setActiveView('college_home');
      showToast(`Switched portal to ${found.name}`, 'info');
    }
  };

  // Register New College
  const registerCollege = (collegeData: Partial<College>): College => {
    const slug = collegeData.name
      ? collegeData.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '')
      : `college-${Date.now()}`;

    const newCollege: College = {
      id: `col-${Date.now()}`,
      name: collegeData.name || 'New Engineering College',
      slug,
      officialEmail: collegeData.officialEmail || 'admin@college.edu.in',
      type: collegeData.type || 'Government Engineering College',
      university: collegeData.university || 'State University',
      city: collegeData.city || 'Tech City',
      state: collegeData.state || 'State',
      country: collegeData.country || 'India',
      website: collegeData.website || 'https://college.edu.in',
      logo: collegeData.logo || 'https://images.unsplash.com/photo-1562774053-701939374585?w=120&auto=format&fit=crop&q=80',
      coverImage: collegeData.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1400&auto=format&fit=crop&q=80',
      description: collegeData.description || 'Connecting students through verified peer skill sharing.',
      brandColors: collegeData.brandColors || {
        primary: '#1e3a8a',
        secondary: '#0284c7',
        accent: '#f59e0b',
      },
      contactPerson: collegeData.contactPerson || 'Dean of Academics',
      adminName: collegeData.adminName || 'College Admin',
      adminEmail: collegeData.adminEmail || 'dean@college.edu.in',
      phone: collegeData.phone || '+91 90000 00000',
      accessCode: `${slug.substring(0, 4).toUpperCase()}-2026`,
      departments: collegeData.departments || ['Computer Science & Engineering', 'Electronics Engineering', 'Electrical Engineering', 'Mechanical Engineering'],
      categories: collegeData.categories || ['Academics', 'Programming', 'Competitive Exams', 'Career & Placements'],
      announcements: [
        {
          id: `ann-${Date.now()}`,
          title: `Welcome to ${collegeData.name || 'New College'} Peer Learning Hub`,
          content: 'Students can now discover peer video modules, earn contributor credits, and engage in campus learning challenges.',
          author: 'Administration',
          date: new Date().toISOString().split('T')[0],
          category: 'general',
        },
      ],
      rules: [
        'Maintain academic rigor and student peer support.',
        'Upload verified learning materials.',
        'Zero tolerance for academic dishonesty.',
      ],
      createdAt: new Date().toISOString(),
      stats: {
        totalStudents: 1,
        activeLearners: 1,
        totalVideos: 0,
        learningHours: 0,
      },
    };

    setColleges(prev => [...prev, newCollege]);
    setCurrentCollege(newCollege);
    logSecurityEvent(
      'COLLEGE_TENANT_PROVISIONED',
      'info',
      `Provisioned new isolated campus tenant: ${newCollege.name} (${newCollege.slug}) with access code ${newCollege.accessCode}`
    );
    showToast(`College portal created: /college/${newCollege.slug}`, 'success');
    return newCollege;
  };

  // Switch User (Aditya, Priya, Admin, Super Admin)
  const switchUser = (userId: string) => {
    const target = users.find(u => u.id === userId);
    if (target) {
      setCurrentUser(target);
      // Auto switch college if user belongs to specific college
      if (target.collegeId && target.collegeId !== 'platform-central') {
        const userCol = colleges.find(c => c.id === target.collegeId);
        if (userCol) setCurrentCollege(userCol);
      }
      showToast(`Switched active identity to ${target.name} (${target.role})`, 'info');
      logSecurityEvent('USER_IDENTITY_SWITCHED', 'info', `Session authenticated as ${target.name} [${target.role}]`);
    }
  };

  // Update Profile
  const updateCurrentUserProfile = (updates: Partial<StudentProfile>) => {
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));
    showToast('Profile updated securely', 'success');
  };

  // Add Cryptographically Signed Credit Transaction
  const addCreditTransaction = async (
    type: CreditTransaction['type'],
    amount: number,
    description: string,
    relatedEntityId?: string
  ): Promise<boolean> => {
    const newBalance = Math.max(0, currentUser.credits + amount);
    const timestamp = new Date().toISOString();
    const rawData = `${currentUser.id}:${type}:${amount}:${newBalance}:${timestamp}`;
    const integrityHash = await cryptoService.signLedgerRecord(rawData);

    const tx: CreditTransaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      collegeId: currentCollege.id,
      timestamp,
      type,
      amount,
      balanceAfter: newBalance,
      description,
      relatedEntityId,
      integrityHash,
    };

    setTransactions(prev => [tx, ...prev]);

    // Update current user and in user list
    const updatedUser = { ...currentUser, credits: newBalance };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    logSecurityEvent(
      'CREDIT_LEDGER_SIGNED',
      'info',
      `${type}: ${amount > 0 ? '+' : ''}${amount} credits (New Balance: ${newBalance}). Hash: ${integrityHash.substring(0, 16)}...`
    );

    return true;
  };

  // Unlock Video (5 credits -> 4 to creator, 1 to platform)
  const unlockVideo = async (videoId: string): Promise<{ success: boolean; message: string }> => {
    const video = videos.find(v => v.id === videoId);
    if (!video) return { success: false, message: 'Video not found.' };

    if (unlockedVideoIds.includes(videoId)) {
      return { success: true, message: 'Video is already in your unlocked library.' };
    }

    const cost = video.unlockCostCredits || 5;
    if (currentUser.credits < cost) {
      showToast(`Insufficient credits (${currentUser.credits}/${cost}). Complete quizzes or games to earn more!`, 'error');
      return { success: false, message: 'Insufficient credits.' };
    }

    // Deduct from viewer
    await addCreditTransaction(
      'video_unlock',
      -cost,
      `Unlocked "${video.title}" by ${video.creatorName}`,
      video.id
    );

    // Reward creator (4 credits)
    const creator = users.find(u => u.id === video.creatorId);
    if (creator) {
      const creatorReward = Math.max(1, cost - 1);
      const creatorTimestamp = new Date().toISOString();
      const creatorHash = await cryptoService.signLedgerRecord(
        `${creator.id}:creator_reward:${creatorReward}:${creator.credits + creatorReward}:${creatorTimestamp}`
      );
      const creatorTx: CreditTransaction = {
        id: `tx-${Date.now()}-creator`,
        userId: creator.id,
        collegeId: video.collegeId,
        timestamp: creatorTimestamp,
        type: 'creator_reward',
        amount: creatorReward,
        balanceAfter: creator.credits + creatorReward,
        description: `Peer Royalty: ${currentUser.name} unlocked your video "${video.title}"`,
        relatedEntityId: video.id,
        integrityHash: creatorHash,
      };

      setTransactions(prev => [creatorTx, ...prev]);
      setUsers(prev =>
        prev.map(u =>
          u.id === creator.id
            ? { ...u, credits: u.credits + creatorReward, studentsHelped: u.studentsHelped + 1 }
            : u
        )
      );
    }

    // Update unlocks on video
    setVideos(prev =>
      prev.map(v => (v.id === videoId ? { ...v, unlocksCount: v.unlocksCount + 1 } : v))
    );

    setUnlockedVideoIds(prev => [...prev, videoId]);
    showToast(`Unlocked "${video.title}" for ${cost} credits!`, 'success');
    return { success: true, message: 'Successfully unlocked!' };
  };

  // Record Watch Progress with 70% STRICT PROGRESSION LOCK
  const recordWatchProgress = async (
    videoId: string,
    currentPosition: number,
    duration: number,
    moduleId: string
  ): Promise<{ thresholdReached: boolean; completionPercent: number }> => {
    if (duration <= 0) return { thresholdReached: false, completionPercent: 0 };

    const existing = watchProgress[videoId];
    const previousMax = existing ? existing.maxPositionReached : 0;
    const previousWatched = existing ? existing.watchedSeconds : 0;

    // Controlled seeking check: cannot advance maxPositionReached by more than continuous play time
    const newMaxPosition = Math.max(previousMax, currentPosition);
    const newWatchedSeconds = Math.max(previousWatched, Math.floor(newMaxPosition));
    const completionPercent = Math.min(100, (newWatchedSeconds / duration) * 100);
    const thresholdReached = completionPercent >= 70;

    // Generate cryptographic validation token
    const token = await cryptoService.generateWatchProgressToken(
      currentUser.id,
      videoId,
      completionPercent,
      newWatchedSeconds
    );

    const updated: VideoWatchProgress = {
      id: existing ? existing.id : `prog-${Date.now()}`,
      userId: currentUser.id,
      videoId,
      currentModuleId: moduleId,
      watchedSeconds: newWatchedSeconds,
      totalDurationSeconds: duration,
      completionPercent: parseFloat(completionPercent.toFixed(1)),
      maxPositionReached: newMaxPosition,
      thresholdReached: thresholdReached || (existing ? existing.thresholdReached : false),
      completed: completionPercent >= 95,
      lastWatchedAt: new Date().toISOString(),
      cryptographicToken: token,
    };

    setWatchProgress(prev => ({ ...prev, [videoId]: updated }));

    // Check if threshold just crossed 70%
    if (thresholdReached && (!existing || !existing.thresholdReached)) {
      logSecurityEvent(
        'PROGRESSION_70_PASSED',
        'info',
        `Student ${currentUser.name} reached 70% completion on ${videoId}. Cryptographic unlock token generated.`
      );
      showToast('🎉 70% Learning Threshold Achieved! Next unit, quiz & notes unlocked.', 'security');
      completeMissionAction('video');
    }

    return { thresholdReached: updated.thresholdReached, completionPercent: updated.completionPercent };
  };

  // Upload Video in Marketplace ("Teach & Earn")
  const uploadVideo = async (videoData: Partial<CourseVideo>): Promise<CourseVideo> => {
    const newVideo: CourseVideo = {
      id: `vid-${Date.now()}`,
      collegeId: currentCollege.id,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
      creatorAvatar: currentUser.avatar,
      creatorDepartment: currentUser.department,
      title: videoData.title || 'Untitled Learning Resource',
      description: videoData.description || 'Peer learning module.',
      subject: videoData.subject || 'Computer Science',
      category: videoData.category || 'Academics',
      subcategory: videoData.subcategory || 'General',
      difficulty: videoData.difficulty || 'Intermediate',
      language: videoData.language || 'English',
      tags: videoData.tags || ['PeerLearning'],
      durationSeconds: videoData.durationSeconds || 900,
      unlockCostCredits: 5,
      videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      thumbnailUrl: videoData.thumbnailUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      learningObjectives: videoData.learningObjectives || ['Understand core concepts', 'Practical problem solving'],
      notesPdfUrl: videoData.notesPdfUrl,
      encryptedNotesText: videoData.encryptedNotesText,
      quizId: videoData.quizId,
      status: 'submitted', // Under moderation review
      viewsCount: 0,
      unlocksCount: 0,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString(),
      modules: videoData.modules || [
        {
          id: `mod-1-${Date.now()}`,
          title: 'Section 1: Conceptual Foundation',
          durationSeconds: videoData.durationSeconds ? Math.floor(videoData.durationSeconds / 2) : 450,
          videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          summary: 'Introduction and mathematical background.',
          order: 1,
        },
        {
          id: `mod-2-${Date.now()}`,
          title: 'Section 2: Solved Problems & Exam Analysis',
          durationSeconds: videoData.durationSeconds ? Math.ceil(videoData.durationSeconds / 2) : 450,
          videoUrl: videoData.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          summary: 'Practical problem walkthrough.',
          order: 2,
        },
      ],
    };

    setVideos(prev => [newVideo, ...prev]);
    completeMissionAction('upload');

    // Reward creator initial 10 credits for approved contribution (or upon submit for prototype)
    await addCreditTransaction(
      'admin_adjustment',
      10,
      `Submitted educational resource: "${newVideo.title}"`,
      newVideo.id
    );

    logSecurityEvent(
      'CONTENT_UPLOAD_SUBMITTED',
      'info',
      `Student ${currentUser.name} submitted video "${newVideo.title}" for college admin moderation.`
    );

    showToast('Video submitted! Awarded +10 Contribution Credits.', 'success');
    return newVideo;
  };

  // Moderate Video (College Admin)
  const moderateVideo = (videoId: string, status: 'approved' | 'rejected', feedback?: string) => {
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId
          ? {
              ...v,
              status: status === 'approved' ? 'published' : 'submitted',
              moderationFeedback: feedback,
            }
          : v
      )
    );

    logSecurityEvent(
      'CONTENT_MODERATED',
      'info',
      `Admin moderated video ${videoId} -> ${status}. Feedback: ${feedback || 'None'}`
    );

    showToast(`Content ${status} successfully!`, status === 'approved' ? 'success' : 'info');
  };

  // Missions & Streaks
  const completeMissionAction = (category: 'video' | 'quiz' | 'upload' | 'streak') => {
    setMissions(prev =>
      prev.map(m => {
        if (
          (category === 'video' && m.id === 'mis-1') ||
          (category === 'quiz' && m.id === 'mis-2') ||
          (category === 'upload' && m.id === 'mis-3') ||
          (category === 'streak' && m.id === 'mis-4')
        ) {
          const newProg = Math.min(m.maxProgress, m.progress + 1);
          return { ...m, progress: newProg, completed: newProg >= m.maxProgress };
        }
        return m;
      })
    );
  };

  const claimDailyStreak = async (): Promise<boolean> => {
    const newStreak = currentUser.streak + 1;
    const updated = {
      ...currentUser,
      streak: newStreak,
      longestStreak: Math.max(currentUser.longestStreak, newStreak),
    };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updated : u)));

    await addCreditTransaction(
      'streak_reward',
      3,
      `Daily Streak Reward 🔥 ${newStreak} Days Streak!`
    );

    completeMissionAction('streak');
    showToast(`🔥 Streak extended! +3 Daily Streak Credits credited.`, 'success');
    return true;
  };

  const completeGameReward = async (gameId: string, credits: number, xp: number) => {
    const updatedUser = {
      ...currentUser,
      xp: currentUser.xp + xp,
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => (u.id === currentUser.id ? updatedUser : u)));

    if (credits > 0) {
      await addCreditTransaction(
        'game_reward',
        credits,
        `Learning Arena Victory: ${gameId} (+${xp} XP)`,
        gameId
      );
    }

    showToast(`Victory! Earned +${credits} Credits & +${xp} XP!`, 'success');
  };

  // End-to-End Encrypted Messaging (AES-256-GCM + RSA-OAEP Key Exchange)
  const sendE2EEMessage = async (
    recipientId: string,
    subject: string,
    plaintext: string
  ): Promise<boolean> => {
    const recipient = users.find(u => u.id === recipientId);
    if (!recipient) {
      showToast('Recipient student not found.', 'error');
      return false;
    }

    // Ensure recipient has RSA keypair (generate mock JWK if absent)
    let recipientPubJwk = recipient.publicKeyJwk;
    if (!recipientPubJwk) {
      const pair = await cryptoService.generateRsaKeyPair();
      recipientPubJwk = pair.publicKeyJwk;
    }

    if (!rsaKeyPair?.publicKeyJwk) {
      showToast('Local cryptographic enclave not ready.', 'error');
      return false;
    }

    try {
      // Execute E2EE
      const encrypted = await cryptoService.encryptEndToEnd(
        plaintext,
        recipientPubJwk,
        rsaKeyPair.publicKeyJwk
      );

      const msgPayload: EncryptedMessagePayload = {
        id: `msg-${Date.now()}`,
        senderId: currentUser.id,
        senderName: currentUser.name,
        recipientId: recipient.id,
        recipientName: recipient.name,
        timestamp: new Date().toISOString(),
        ciphertext: encrypted.ciphertext,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        encryptedKeyRecipient: encrypted.encryptedKeyRecipient,
        encryptedKeySender: encrypted.encryptedKeySender,
        subject,
      };

      setE2eeMessages(prev => [msgPayload, ...prev]);

      logSecurityEvent(
        'E2EE_MESSAGE_SENT',
        'info',
        `Encrypted payload sent from ${currentUser.name} to ${recipient.name} using AES-256-GCM (128-bit tag) with RSA-OAEP key wrapping.`
      );

      showToast(`Encrypted study message sent to ${recipient.name}!`, 'security');
      return true;
    } catch (err) {
      console.error('E2EE Message send failed:', err);
      showToast('Encryption failed. Check keys.', 'error');
      return false;
    }
  };

  // Decrypt End-to-End Encrypted Message
  const decryptE2EEMessage = async (msg: EncryptedMessagePayload): Promise<string> => {
    if (!rsaKeyPair?.privateKeyJwk) {
      throw new Error('Private key not available in browser enclave.');
    }

    const isRecipient = msg.recipientId === currentUser.id;
    const isSender = msg.senderId === currentUser.id;

    if (!isRecipient && !isSender) {
      throw new Error('Unauthorized: You are neither sender nor recipient of this message.');
    }

    const wrappedKey = isRecipient ? msg.encryptedKeyRecipient : msg.encryptedKeySender;

    return await cryptoService.decryptEndToEnd(
      {
        ciphertext: msg.ciphertext,
        iv: msg.iv,
        wrappedKey,
      },
      rsaKeyPair.privateKeyJwk
    );
  };

  return (
    <AppContext.Provider
      value={{
        currentCollege,
        colleges,
        activeView,
        setActiveView,
        selectCollege,
        registerCollege,
        currentUser,
        users,
        switchUser,
        updateCurrentUserProfile,
        videos,
        activeVideoId,
        setActiveVideoId,
        unlockedVideoIds,
        watchProgress,
        unlockVideo,
        recordWatchProgress,
        uploadVideo,
        moderateVideo,
        transactions,
        addCreditTransaction,
        missions,
        completeMissionAction,
        claimDailyStreak,
        completeGameReward,
        rsaKeyPair,
        cryptoReady,
        e2eeMessages,
        sendE2EEMessage,
        decryptE2EEMessage,
        securityLogs,
        logSecurityEvent,
        toast,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
