/**
 * PeerCampus Core Type Definitions
 * End-to-end encrypted multi-college peer learning ecosystem
 */

export type UserRole = 'student' | 'college_admin' | 'super_admin';

export interface College {
  id: string;
  name: string;
  slug: string;
  officialEmail: string;
  type: string; // e.g. 'Government Engineering College', 'State University', 'Autonomous'
  university: string;
  city: string;
  state: string;
  country: string;
  website: string;
  logo: string;
  coverImage: string;
  description: string;
  brandColors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  contactPerson: string;
  adminName: string;
  adminEmail: string;
  phone: string;
  accessCode: string;
  departments: string[];
  categories: string[];
  announcements: CollegeAnnouncement[];
  rules: string[];
  createdAt: string;
  stats: {
    totalStudents: number;
    activeLearners: number;
    totalVideos: number;
    learningHours: number;
  };
}

export interface CollegeAnnouncement {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'academic' | 'hackathon' | 'challenge' | 'general';
}

export interface StudentBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface SkillMilestoneBadge {
  id: string;
  skillName: string;
  category: 'programming' | 'electronics' | 'core_eng' | 'community' | 'consistency' | 'security';
  name: string;
  description: string;
  iconName: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  level: number;
  maxLevel: number;
  currentProgress: number;
  targetProgress: number;
  progressUnit: string;
  isUnlocked: boolean;
  unlockedAt?: string;
  rewardCredits: number;
  rewardXp: number;
  claimed: boolean;
  milestoneCriteria: string;
  nextPerk: string;
  verificationHash?: string;
}

export interface StudentProfile {
  id: string;
  collegeId: string;
  collegeName: string;
  collegeSlug: string;
  name: string;
  email: string;
  phone: string;
  studentId: string; // Enrollment ID
  department: string;
  course: string;
  year: number;
  semester: number;
  skills: string[];
  interests: string[];
  avatar: string;
  bio: string;
  role: UserRole;
  credits: number;
  xp: number;
  streak: number;
  longestStreak: number;
  streakCalendar: { date: string; active: boolean; minutes: number }[];
  learningHours: number;
  studentsHelped: number;
  studentsLearnedFrom: number;
  learningScore: number;
  contributionScore: number;
  skillScore: number;
  consistencyScore: number;
  badges: StudentBadge[];
  publicKeyJwk?: JsonWebKey;
  encryptedVault?: string; // Encrypted student private profile payload
  createdAt: string;
}

export interface VideoModule {
  id: string;
  title: string;
  durationSeconds: number;
  videoUrl: string;
  summary: string;
  order: number;
}

export interface CourseVideo {
  id: string;
  collegeId: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  creatorDepartment: string;
  title: string;
  description: string;
  subject: string;
  category: string;
  subcategory: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  language: string;
  tags: string[];
  durationSeconds: number;
  unlockCostCredits: number;
  videoUrl: string;
  thumbnailUrl: string;
  learningObjectives: string[];
  notesPdfUrl?: string;
  encryptedNotesText?: string; // E2EE encrypted creator study notes
  quizId?: string;
  status: 'draft' | 'submitted' | 'review' | 'approved' | 'published';
  moderationFeedback?: string;
  viewsCount: number;
  unlocksCount: number;
  rating: number;
  reviewsCount: number;
  createdAt: string;
  modules: VideoModule[];
}

export interface VideoWatchProgress {
  id: string;
  userId: string;
  videoId: string;
  currentModuleId: string;
  watchedSeconds: number;
  totalDurationSeconds: number;
  completionPercent: number;
  maxPositionReached: number; // Controlled seeking boundary
  thresholdReached: boolean; // 70% threshold reached
  completed: boolean;
  lastWatchedAt: string;
  cryptographicToken: string; // Cryptographic validation token to prevent front-end spoofing
}

export interface CreditTransaction {
  id: string;
  userId: string;
  collegeId: string;
  timestamp: string;
  type:
    | 'signup_bonus'
    | 'video_unlock'
    | 'creator_reward'
    | 'quiz_reward'
    | 'game_reward'
    | 'daily_learning'
    | 'streak_reward'
    | 'admin_adjustment';
  amount: number;
  balanceAfter: number;
  description: string;
  relatedEntityId?: string;
  integrityHash: string; // SHA-256 HMAC for tamper detection
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface Quiz {
  id: string;
  videoId?: string;
  title: string;
  subject: string;
  department: string;
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Hard';
  rewardCredits: number;
  rewardXp: number;
  questions: QuizQuestion[];
}

export interface LearningGame {
  id: string;
  title: string;
  type: 'concept_match' | 'rapid_mcq' | 'code_debug' | 'true_false' | 'fill_blank';
  subject: string;
  description: string;
  timeLimitSeconds: number;
  rewardCredits: number;
  rewardXp: number;
  data: any;
}

export interface KnowledgeNode {
  id: string;
  studentId: string;
  name: string;
  avatar: string;
  department: string;
  role: 'Creator' | 'Learner' | 'Top Contributor' | 'Mentor';
  uploadedCount: number;
  learnersCount: number;
  learningHours: number;
  contributionScore: number;
  topSubject: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
}

export interface KnowledgeEdge {
  id: string;
  source: string; // creator studentId
  target: string; // learner studentId
  subject: string;
  videoTitle: string;
  watchDate: string;
  watchDurationMinutes: number;
}

export interface EncryptedMessagePayload {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  timestamp: string;
  // E2EE fields:
  ciphertext: string; // Base64 AES-256-GCM encrypted message body
  iv: string; // Base64 96-bit initialization vector
  authTag: string; // Base64 GCM auth tag
  encryptedKeyRecipient: string; // AES key wrapped with recipient's RSA public key
  encryptedKeySender: string; // AES key wrapped with sender's RSA public key
  subject: string; // Plaintext routing metadata
}

export interface SecurityAuditEntry {
  id: string;
  timestamp: string;
  action: string;
  userId: string;
  ipAddress: string;
  userAgent: string;
  severity: 'info' | 'warning' | 'alert';
  details: string;
  signature: string;
}

export interface LearningMission {
  id: string;
  title: string;
  description: string;
  progress: number;
  maxProgress: number;
  rewardCredits: number;
  rewardXp: number;
  completed: boolean;
  category: 'daily' | 'weekly';
}
