/**
 * College Admin & Campus Intelligence Dashboard
 * Sections: Overview, "What Are Our Students Learning?", Visual Analytics,
 * Content Moderation Queue, and Student Learning Journey Inspector.
 */

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  GraduationCap,
  Users,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  BarChart3,
  TrendingUp,
  Download,
  ShieldAlert,
  Search,
  BookOpen,
  Filter,
} from 'lucide-react';
import { StudentProfile } from '../types';

export const CollegeAdminDashboard: React.FC = () => {
  const {
    currentCollege,
    videos,
    users,
    moderateVideo,
    setActiveVideoId,
    setActiveView,
    showToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'intelligence' | 'moderation' | 'students'>('overview');
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile>(users[0]);
  const [moderationNotes, setModerationNotes] = useState('');

  // Videos under review for this college
  const pendingVideos = videos.filter(
    v => v.collegeId === currentCollege.id && v.status === 'submitted'
  );

  const collegeStudents = users.filter(u => u.collegeId === currentCollege.id && u.role === 'student');

  const handleApprove = (videoId: string) => {
    moderateVideo(videoId, 'approved', moderationNotes);
    setModerationNotes('');
  };

  const handleReject = (videoId: string) => {
    moderateVideo(videoId, 'rejected', moderationNotes || 'Content does not meet academic criteria.');
    setModerationNotes('');
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider">
              {currentCollege.name}
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 border border-indigo-200">
              Campus Intelligence Portal
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            <GraduationCap className="w-7 h-7 text-indigo-700" />
            Dean &amp; Faculty Intelligence Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Real-time telemetry on student learning habits, departmental content demand, peer knowledge flow, and upload moderation.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'overview' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('intelligence')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'intelligence' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Subject Demand
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'moderation' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Moderation Queue
            {pendingVideos.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {pendingVideos.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('students')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'students' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Student Roadmaps
          </button>
        </div>
      </div>

      {/* TAB 1: Overview KPIs & Charts */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Top 4 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Enrolled</span>
              <div className="text-2xl font-black text-slate-900">{currentCollege.stats.totalStudents}</div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-sky-600" /> Active Campus Directory
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weekly Active Learners</span>
              <div className="text-2xl font-black text-emerald-600">{currentCollege.stats.activeLearners}</div>
              <p className="text-[11px] text-emerald-700 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +14% vs last month
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Learning Hours</span>
              <div className="text-2xl font-black text-indigo-600">{currentCollege.stats.learningHours} hrs</div>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-600" /> Verified 70% threshold
              </p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Credits Circulated</span>
              <div className="text-2xl font-black text-amber-600">9,240 Cr</div>
              <p className="text-[11px] text-slate-500">Internal study points</p>
            </div>
          </div>

          {/* Department Learning Consumption Breakdown */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">
                  Department Engagement Breakdown
                </h3>
                <p className="text-xs text-slate-500">
                  Relative share of verified peer learning hours consumed across academic branches.
                </p>
              </div>
              <button
                onClick={() => showToast('Exported Department Learning Report (CSV)', 'success')}
                className="px-3.5 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 transition-colors self-start"
              >
                <Download className="w-3.5 h-3.5" /> Export Report (CSV)
              </button>
            </div>

            {/* Visual Bar Progression */}
            <div className="space-y-4">
              {[
                { name: 'Computer Science & Engineering', percent: 42, hours: '1,029h', color: 'bg-sky-600' },
                { name: 'Electronics Engineering', percent: 28, hours: '686h', color: 'bg-indigo-600' },
                { name: 'Electrical Engineering', percent: 15, hours: '367h', color: 'bg-amber-500' },
                { name: 'Mechanical Engineering', percent: 10, hours: '245h', color: 'bg-emerald-500' },
                { name: 'Civil Engineering', percent: 5, hours: '123h', color: 'bg-slate-500' },
              ].map(dept => (
                <div key={dept.name} className="space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{dept.name}</span>
                    <span className="font-mono text-slate-500">
                      <strong>{dept.percent}%</strong> ({dept.hours})
                    </span>
                  </div>
                  <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${dept.color}`}
                      style={{ width: `${dept.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Subject Demand Intelligence ("What Are Our Students Learning?") */}
      {activeTab === 'intelligence' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
                Predictive Analytics
              </span>
              <h2 className="text-xl font-extrabold text-slate-900 mt-1">
                What Are Our Students Learning? (Campus Pulse)
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Aggregated student interest telemetry highlighting emerging subject demand and resource shortages.
              </p>
            </div>

            {/* Subject Distribution Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Top Studied Topics</h4>

                <div className="space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Artificial Intelligence &amp; Data Structures</span>
                      <span className="text-sky-700">42% Demand</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-sky-600 rounded-full" style={{ width: '42%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Microprocessors &amp; Embedded Systems (8086)</span>
                      <span className="text-indigo-700">35% Demand</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full" style={{ width: '35%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Digital Signal Processing &amp; Spectral Analysis</span>
                      <span className="text-emerald-700">28% Demand</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: '28%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold mb-1">
                      <span>Power System Load Flow &amp; Newton-Raphson</span>
                      <span className="text-amber-700">19% Demand</span>
                    </div>
                    <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '19%' }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* AI-Assisted Curricular Observations */}
              <div className="p-5 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-3 text-xs text-slate-700">
                <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-700" />
                  Key Academic Recommendations
                </div>
                <ul className="space-y-2 text-[11px] leading-relaxed">
                  <li className="p-2.5 rounded-xl bg-white border border-indigo-100">
                    💡 <strong>High Demand / Low Resource Gap:</strong> Embedded C and ARM architectures show 24% search interest among 3rd year students, but only 2 peer video modules currently exist.
                  </li>
                  <li className="p-2.5 rounded-xl bg-white border border-indigo-100">
                    💡 <strong>Peer Knowledge Acceleration:</strong> Students who completed Priya Sharma’s FFT module achieved a 22% higher average in end-semester internal exams.
                  </li>
                  <li className="p-2.5 rounded-xl bg-white border border-indigo-100">
                    💡 <strong>Placement Sprint Readiness:</strong> Graph Algorithms and Python OOP are experiencing peak weekend watch surges between 8:00 PM and 11:30 PM.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Content Moderation Queue */}
      {activeTab === 'moderation' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-slate-900">
                Content Moderation Queue ({pendingVideos.length} Pending)
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Faculty reviews ensure academic accuracy, anti-plagiarism compliance, and syllabus relevance.
              </p>
            </div>
          </div>

          {pendingVideos.length > 0 ? (
            <div className="space-y-4">
              {pendingVideos.map(vid => (
                <div
                  key={vid.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="font-bold text-sky-700 uppercase text-[10px]">
                        {vid.subject} · {vid.difficulty}
                      </span>
                      <h4 className="font-extrabold text-slate-900 text-sm mt-0.5">{vid.title}</h4>
                      <p className="text-[11px] text-slate-500">
                        Submitted by: {vid.creatorName} ({vid.creatorDepartment}) · {Math.floor(vid.durationSeconds / 60)} mins
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setActiveVideoId(vid.id);
                        setActiveView('video_player');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-100 flex items-center gap-1 self-start"
                    >
                      <Eye className="w-3.5 h-3.5" /> Preview Video
                    </button>
                  </div>

                  <p className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
                    {vid.description}
                  </p>

                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 border-t border-slate-200/60">
                    <input
                      type="text"
                      placeholder="Optional feedback for student instructor..."
                      value={moderationNotes}
                      onChange={e => setModerationNotes(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-xl border border-slate-300 text-xs bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleApprove(vid.id)}
                        className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve &amp; Publish
                      </button>
                      <button
                        onClick={() => handleReject(vid.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Request Revisions
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="font-bold text-slate-800 text-xs">Moderation Queue Clear!</h4>
              <p className="text-[11px] text-slate-500">
                All submitted peer learning resources have been reviewed and published.
              </p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Student Learning Journey Inspector */}
      {activeTab === 'students' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Student list (1 col) */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Enrolled Students ({collegeStudents.length})
            </h3>
            <div className="space-y-1.5 max-h-96 overflow-y-auto">
              {collegeStudents.map(stu => (
                <button
                  key={stu.id}
                  onClick={() => setSelectedStudent(stu)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center gap-3 ${
                    stu.id === selectedStudent.id
                      ? 'border-sky-500 bg-sky-50 font-bold text-sky-950'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <img src={stu.avatar} alt={stu.name} className="w-8 h-8 rounded-full object-cover" />
                  <div className="truncate">
                    <p className="truncate">{stu.name}</p>
                    <p className="text-[10px] text-slate-400 font-normal">{stu.department}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Student Detailed Roadmap (2 cols) */}
          <div className="md:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-base">{selectedStudent.name}</h3>
                  <p className="text-xs text-slate-500">
                    ID: {selectedStudent.studentId} · {selectedStudent.department} (Semester {selectedStudent.semester})
                  </p>
                </div>
              </div>

              <div className="text-right text-xs">
                <div className="font-black text-emerald-600 text-sm">
                  {selectedStudent.learningHours} Hours Verified
                </div>
                <div className="text-slate-400 text-[10px]">
                  Learning Score: {selectedStudent.learningScore}/100
                </div>
              </div>
            </div>

            {/* Interactive Learning Journey Roadmap Timeline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Academic Journey Roadmap
              </h4>

              <div className="space-y-3 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                <div className="relative pl-7 text-xs space-y-1">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">Fourier Transform (FFT) Decimation in Time</div>
                  <p className="text-[11px] text-slate-500">
                    Completed 100% · Quiz Passed (100%) · Taught by Priya Sharma
                  </p>
                </div>

                <div className="relative pl-7 text-xs space-y-1">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">Python OOP &amp; System Architecture</div>
                  <p className="text-[11px] text-slate-500">
                    Completed 100% · Author &amp; Creator Module · Helped 42 classmates
                  </p>
                </div>

                <div className="relative pl-7 text-xs space-y-1">
                  <div className="absolute left-1.5 top-1 w-3.5 h-3.5 rounded-full bg-sky-500 ring-4 ring-white" />
                  <div className="font-bold text-slate-900">Graph Algorithms: BFS, DFS &amp; Topological Sort</div>
                  <p className="text-[11px] text-slate-500">
                    In Progress · 70% Cleared · Final Quiz Pending
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
