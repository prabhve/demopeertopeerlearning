/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';
import { CollegeOnboardingModal } from './components/CollegeOnboardingModal';
import { StudentRegistrationModal } from './components/StudentRegistrationModal';
import { LandingPage } from './views/LandingPage';
import { CollegePortalHome } from './views/CollegePortalHome';
import { StudentDashboard } from './views/StudentDashboard';
import { VideoPlayerView } from './views/VideoPlayerView';
import { TeachAndEarnMarketplace } from './views/TeachAndEarnMarketplace';
import { KnowledgeNetworkView } from './views/KnowledgeNetworkView';
import { LearningArenaView } from './views/LearningArenaView';
import { StudentProfileView } from './views/StudentProfileView';
import { E2EEMessengerView } from './views/E2EEMessengerView';
import { CollegeAdminDashboard } from './views/CollegeAdminDashboard';
import { SuperAdminDashboard } from './views/SuperAdminDashboard';
import { SecurityCenterView } from './views/SecurityCenterView';

const MainContent: React.FC = () => {
  const { activeView } = useApp();

  const [registerCollegeOpen, setRegisterCollegeOpen] = useState(false);
  const [studentSignupOpen, setStudentSignupOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-sky-500 selection:text-white">
      {/* Navigation Bar */}
      <Navbar
        onOpenRegisterCollege={() => setRegisterCollegeOpen(true)}
        onOpenStudentSignup={() => setStudentSignupOpen(true)}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeView === 'landing' && (
          <LandingPage
            onOpenRegisterCollege={() => setRegisterCollegeOpen(true)}
            onOpenStudentSignup={() => setStudentSignupOpen(true)}
          />
        )}
        {activeView === 'college_home' && (
          <CollegePortalHome
            onOpenStudentSignup={() => setStudentSignupOpen(true)}
          />
        )}
        {activeView === 'dashboard' && <StudentDashboard />}
        {activeView === 'video_player' && <VideoPlayerView />}
        {activeView === 'teach_upload' && <TeachAndEarnMarketplace />}
        {activeView === 'knowledge_map' && <KnowledgeNetworkView />}
        {activeView === 'learning_arena' && <LearningArenaView />}
        {activeView === 'profile' && <StudentProfileView />}
        {activeView === 'e2ee_messenger' && <E2EEMessengerView />}
        {activeView === 'college_admin' && <CollegeAdminDashboard />}
        {activeView === 'super_admin' && <SuperAdminDashboard />}
        {activeView === 'security_center' && <SecurityCenterView />}
      </main>

      {/* Modals */}
      <CollegeOnboardingModal
        isOpen={registerCollegeOpen}
        onClose={() => setRegisterCollegeOpen(false)}
      />
      <StudentRegistrationModal
        isOpen={studentSignupOpen}
        onClose={() => setStudentSignupOpen(false)}
      />

      {/* Footer & Global Notifications */}
      <Footer />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
