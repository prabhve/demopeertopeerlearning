/**
 * PeerCampus Modern SaaS Header
 * Ultra-responsive, scroll-reactive glassmorphism header with scroll progress bar,
 * uncluttered navigation hierarchy, compact utility cluster, and polished mobile slide-over drawer.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useApp, ActiveView } from '../context/AppContext';
import {
  GraduationCap,
  Flame,
  CreditCard,
  ShieldCheck,
  Building2,
  ChevronDown,
  UserCheck,
  BookOpen,
  Share2,
  Gamepad2,
  Lock,
  Layers,
  Sparkles,
  Menu,
  X,
  MessageSquareLock,
  Compass,
  ArrowRight,
  Search,
} from 'lucide-react';

interface NavbarProps {
  onOpenRegisterCollege: () => void;
  onOpenStudentSignup: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenRegisterCollege,
  onOpenStudentSignup,
}) => {
  const {
    currentCollege,
    colleges,
    selectCollege,
    activeView,
    setActiveView,
    currentUser,
    users,
    switchUser,
    claimDailyStreak,
  } = useApp();

  // Menus state
  const [collegeMenuOpen, setCollegeMenuOpen] = useState(false);
  const [toolsMenuOpen, setToolsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Scroll animations and progress tracking
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Search in college dropdown
  const [collegeSearch, setCollegeSearch] = useState('');

  // Close menus on outside click
  const collegeRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = windowHeight > 0 ? (totalScroll / windowHeight) * 100 : 0;

      setScrollProgress(scroll);
      setIsScrolled(totalScroll > 12);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (collegeRef.current && !collegeRef.current.contains(e.target as Node)) {
        setCollegeMenuOpen(false);
      }
      if (toolsRef.current && !toolsRef.current.contains(e.target as Node)) {
        setToolsMenuOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter colleges for quick search
  const filteredColleges = colleges.filter(
    c =>
      c.name.toLowerCase().includes(collegeSearch.toLowerCase()) ||
      c.city.toLowerCase().includes(collegeSearch.toLowerCase()) ||
      c.slug.toLowerCase().includes(collegeSearch.toLowerCase())
  );

  // Primary navigation items (always visible on desktop)
  const primaryNavItems: { view: ActiveView; label: string; icon: React.ReactNode }[] = [
    { view: 'college_home', label: 'Campus Hub', icon: <Building2 className="w-3.5 h-3.5" /> },
    { view: 'dashboard', label: 'My Learning', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { view: 'knowledge_map', label: 'Knowledge Map', icon: <Share2 className="w-3.5 h-3.5" /> },
  ];

  // Secondary tools (in clean dropdown on desktop to prevent cramping)
  const toolNavItems: { view: ActiveView; label: string; desc: string; icon: React.ReactNode }[] = [
    {
      view: 'learning_arena',
      label: 'Learning Arena',
      desc: 'Mini-games, rapid MCQ & coding debug sprint',
      icon: <Gamepad2 className="w-4 h-4 text-indigo-500" />,
    },
    {
      view: 'teach_upload',
      label: 'Teach & Earn Studio',
      desc: 'Publish peer video modules & earn 4 Cr/unlock',
      icon: <Sparkles className="w-4 h-4 text-amber-500" />,
    },
    {
      view: 'e2ee_messenger',
      label: 'E2EE Study Notes',
      desc: 'Encrypted peer messenger & exam solutions',
      icon: <MessageSquareLock className="w-4 h-4 text-emerald-500" />,
    },
    {
      view: 'security_center',
      label: 'Security & OWASP Center',
      desc: 'Live cryptographic workbench & audit trail',
      icon: <Lock className="w-4 h-4 text-sky-500" />,
    },
    {
      view: 'landing',
      label: 'Platform Overview',
      desc: 'Explore multi-college network architecture',
      icon: <Layers className="w-4 h-4 text-slate-500" />,
    },
  ];

  if (currentUser.role === 'college_admin' || currentUser.role === 'super_admin') {
    toolNavItems.unshift({
      view: 'college_admin',
      label: 'Campus Intelligence',
      desc: 'Subject demand analytics & moderation queue',
      icon: <GraduationCap className="w-4 h-4 text-purple-600" />,
    });
  }

  if (currentUser.role === 'super_admin') {
    toolNavItems.unshift({
      view: 'super_admin',
      label: 'Super Admin Governance',
      desc: 'Global credit rules & multi-college oversight',
      icon: <ShieldCheck className="w-4 h-4 text-rose-600" />,
    });
  }

  const isMoreActive = toolNavItems.some(item => item.view === activeView);

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-xl border-b border-slate-200/90 shadow-sm shadow-slate-200/40'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      {/* Scroll Reading Progress Bar (Top 2px Gradient) */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent overflow-hidden pointer-events-none">
        <div
          className="h-full bg-gradient-to-r from-sky-500 via-indigo-500 to-amber-500 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          {/* LEFT: Brand Logo & College Selector */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Logo */}
            <button
              onClick={() => setActiveView('landing')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-xs group-hover:scale-105 transition-transform">
                <GraduationCap className="w-5 h-5 text-sky-400" />
              </div>
              <div className="hidden min-[420px]:block">
                <div className="flex items-center gap-1.5 leading-none">
                  <span className="font-extrabold text-slate-900 text-base tracking-tight">
                    PeerCampus
                  </span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200/80">
                    E2EE
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium truncate max-w-[120px] sm:max-w-[150px] mt-0.5">
                  {currentCollege.slug}
                </p>
              </div>
            </button>

            {/* College Portal Dropdown */}
            <div className="relative" ref={collegeRef}>
              <button
                onClick={() => setCollegeMenuOpen(!collegeMenuOpen)}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100/90 hover:bg-slate-200/80 px-2.5 py-1.5 rounded-xl border border-slate-200/80 transition-all"
                title={`Active College: ${currentCollege.name}`}
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="truncate max-w-[90px] sm:max-w-[130px] font-medium text-[11px] sm:text-xs">
                  {currentCollege.slug}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${collegeMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {collegeMenuOpen && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="relative mb-2">
                    <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search college name or city..."
                      value={collegeSearch}
                      onChange={e => setCollegeSearch(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                    Select Campus Portal
                  </div>

                  <div className="space-y-1 my-1 max-h-56 overflow-y-auto pr-1">
                    {filteredColleges.map(col => (
                      <button
                        key={col.id}
                        onClick={() => {
                          selectCollege(col.slug);
                          setCollegeMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors flex items-center justify-between ${
                          col.id === currentCollege.id
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="truncate font-semibold">{col.name}</p>
                          <p className="text-[10px] text-slate-400 truncate">
                            {col.city}, {col.state} · /college/{col.slug}
                          </p>
                        </div>
                        {col.id === currentCollege.id && (
                          <span className="w-2 h-2 rounded-full bg-sky-600 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="border-t border-slate-100 pt-2 mt-1">
                    <button
                      onClick={() => {
                        setCollegeMenuOpen(false);
                        onOpenRegisterCollege();
                      }}
                      className="w-full text-center text-xs font-bold text-sky-600 hover:text-sky-700 py-1.5 hover:bg-sky-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Building2 className="w-3.5 h-3.5" />
                      + Register New College Portal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CENTER: Clean Responsive Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 p-1 rounded-2xl border border-slate-200/70">
            {primaryNavItems.map(item => {
              const isActive = activeView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => setActiveView(item.view)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              );
            })}

            {/* Direct Teach & Earn tab on large screens */}
            <button
              onClick={() => setActiveView('teach_upload')}
              className={`hidden xl:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeView === 'teach_upload'
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80 font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Teach &amp; Earn</span>
            </button>

            {/* Clean Dropdown for Secondary Tools (Prevents horizontal crowding) */}
            <div className="relative" ref={toolsRef}>
              <button
                onClick={() => setToolsMenuOpen(!toolsMenuOpen)}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-200 whitespace-nowrap ${
                  isMoreActive
                    ? 'bg-white text-sky-800 shadow-xs border border-sky-200 font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>More</span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${toolsMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {toolsMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                    Campus Tools &amp; Features
                  </div>
                  <div className="space-y-1 my-1">
                    {toolNavItems.map(tool => (
                      <button
                        key={tool.view}
                        onClick={() => {
                          setActiveView(tool.view);
                          setToolsMenuOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                          activeView === tool.view
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="mt-0.5 shrink-0">{tool.icon}</div>
                        <div className="truncate">
                          <p className="text-xs font-bold leading-tight">{tool.label}</p>
                          <p className="text-[10px] text-slate-400 leading-tight truncate mt-0.5">
                            {tool.desc}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Compact Utility Badges & Identity Switcher */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            {/* E2EE Shield (Compact icon on mobile, badge on sm+) */}
            <button
              onClick={() => setActiveView('security_center')}
              title="Client-Side Zero-Knowledge Cryptographic Enclave (AES-256 / RSA-2048)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/80 hover:bg-emerald-100/70 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span className="hidden sm:inline font-mono text-[11px] font-bold">256-bit</span>
            </button>

            {/* Streak Counter */}
            <button
              onClick={claimDailyStreak}
              title="Click to claim daily learning streak (+3 Credits)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-amber-50 text-amber-900 border border-amber-200/80 hover:bg-amber-100 transition-colors group"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 group-hover:scale-110 transition-transform" />
              <span className="font-mono text-xs">{currentUser.streak}</span>
              <span className="text-[10px] text-amber-700 font-medium hidden sm:inline">d</span>
            </button>

            {/* Credit Wallet */}
            <button
              onClick={() => setActiveView('dashboard')}
              title="Campus Study Credits Wallet"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-extrabold bg-sky-50 text-sky-900 border border-sky-200/80 hover:bg-sky-100 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <span className="font-mono text-xs">{currentUser.credits}</span>
              <span className="text-[10px] text-sky-700 font-medium hidden md:inline">Cr</span>
            </button>

            {/* Profile Menu Dropdown */}
            <div className="relative" ref={userRef}>
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 p-1 sm:pl-1.5 sm:pr-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 transition-colors"
              >
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <span className="hidden lg:inline text-xs font-bold text-slate-800 truncate max-w-[80px]">
                  {currentUser.name.split(' ')[0]}
                </span>
                <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2.5 border-b border-slate-100">
                    <p className="text-xs font-extrabold text-slate-900">{currentUser.name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                    <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-600">
                      <span className="px-1.5 py-0.5 rounded bg-slate-100 font-bold uppercase text-slate-700">
                        {currentUser.role}
                      </span>
                      <span>·</span>
                      <span className="truncate">{currentUser.department}</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveView('profile');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-slate-500" />
                      View Student Profile &amp; Badges
                    </button>
                    <button
                      onClick={() => {
                        setActiveView('dashboard');
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-2"
                    >
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      My Learning Dashboard
                    </button>
                    <button
                      onClick={() => {
                        onOpenStudentSignup();
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 font-semibold transition-colors flex items-center gap-2"
                    >
                      <GraduationCap className="w-4 h-4 text-slate-500" />
                      Register New Student (+50 Credits)
                    </button>
                  </div>

                  <div className="border-t border-slate-100 pt-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                      Switch Active Identity:
                    </p>
                    <div className="space-y-1">
                      {users.map(u => (
                        <button
                          key={u.id}
                          onClick={() => {
                            switchUser(u.id);
                            setUserMenuOpen(false);
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-xl text-xs transition-colors flex items-center justify-between ${
                            u.id === currentUser.id
                              ? 'bg-sky-50 text-sky-900 font-bold'
                              : 'hover:bg-slate-50 text-slate-700'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <img
                              src={u.avatar}
                              alt={u.name}
                              className="w-5 h-5 rounded-full object-cover"
                            />
                            <div className="truncate">
                              <p className="truncate text-xs font-semibold leading-tight">{u.name}</p>
                              <span className="text-[9px] text-slate-400 font-normal">
                                {u.role === 'college_admin'
                                  ? 'College Admin'
                                  : u.role === 'super_admin'
                                  ? 'Super Admin'
                                  : `${u.department} (Sem ${u.semester})`}
                              </span>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE SLIDE-OVER DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl p-5 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            {/* Drawer Header */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-5 h-5 text-sky-400" />
                  </div>
                  <span className="font-extrabold text-sm text-slate-900">PeerCampus</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Active Student Info Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-10 h-10 rounded-xl object-cover"
                  />
                  <div className="truncate">
                    <p className="font-bold text-xs text-slate-900">{currentUser.name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{currentUser.department}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60 font-mono">
                  <span className="text-sky-700 font-bold">💳 {currentUser.credits} Credits</span>
                  <span className="text-amber-700 font-bold">🔥 {currentUser.streak}d Streak</span>
                  <span className="text-emerald-700 font-bold">🔒 E2EE</span>
                </div>
              </div>

              {/* Categorized Navigation Links */}
              <div className="space-y-4 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Campus Portals
                  </span>
                  <div className="space-y-1">
                    {[
                      { view: 'college_home', label: 'Campus Hub', icon: <Building2 className="w-4 h-4 text-sky-600" /> },
                      { view: 'dashboard', label: 'My Learning Dashboard', icon: <BookOpen className="w-4 h-4 text-indigo-600" /> },
                      { view: 'knowledge_map', label: 'Knowledge Map (Network Graph)', icon: <Share2 className="w-4 h-4 text-sky-600" /> },
                    ].map(link => (
                      <button
                        key={link.view}
                        onClick={() => {
                          setActiveView(link.view as ActiveView);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                          activeView === link.view
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Skills &amp; Creation
                  </span>
                  <div className="space-y-1">
                    {[
                      { view: 'learning_arena', label: 'Learning Arena (Mini-Games)', icon: <Gamepad2 className="w-4 h-4 text-purple-600" /> },
                      { view: 'teach_upload', label: 'Teach & Earn (Upload Video)', icon: <Sparkles className="w-4 h-4 text-amber-500" /> },
                      { view: 'e2ee_messenger', label: 'E2EE Study Notes Exchange', icon: <MessageSquareLock className="w-4 h-4 text-emerald-600" /> },
                      { view: 'profile', label: 'Skill Badges & Achievements', icon: <UserCheck className="w-4 h-4 text-sky-600" /> },
                    ].map(link => (
                      <button
                        key={link.view}
                        onClick={() => {
                          setActiveView(link.view as ActiveView);
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                          activeView === link.view
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {link.icon}
                        <span>{link.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
                    Security &amp; Governance
                  </span>
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setActiveView('security_center');
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                        activeView === 'security_center'
                          ? 'bg-sky-50 text-sky-950 font-bold'
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Lock className="w-4 h-4 text-emerald-600" />
                      <span>OWASP Security &amp; Crypto Center</span>
                    </button>

                    {(currentUser.role === 'college_admin' || currentUser.role === 'super_admin') && (
                      <button
                        onClick={() => {
                          setActiveView('college_admin');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                          activeView === 'college_admin'
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4 text-indigo-600" />
                        <span>Dean &amp; Faculty Intelligence</span>
                      </button>
                    )}

                    {currentUser.role === 'super_admin' && (
                      <button
                        onClick={() => {
                          setActiveView('super_admin');
                          setMobileMenuOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-xl font-semibold flex items-center gap-2.5 transition-colors ${
                          activeView === 'super_admin'
                            ? 'bg-sky-50 text-sky-950 font-bold'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-rose-600" />
                        <span>Super Admin Governance</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenStudentSignup();
                }}
                className="w-full py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
              >
                <GraduationCap className="w-4 h-4" />
                Join College (+50 Credits)
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenRegisterCollege();
                }}
                className="w-full py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs transition-colors"
              >
                Register New College Portal
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
