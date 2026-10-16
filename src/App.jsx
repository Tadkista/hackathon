import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import VotesScreen from './components/VotesScreen.jsx';
import TicketsScreen from './components/TicketsScreen.jsx';
import ExploreScreen from './components/ExploreScreen.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import NotificationsModal from './components/NotificationsModal.jsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const handleNavigate = (tab) => {
    setCurrentTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerVoteModal = () => {
    setCurrentTab('votes');
    setIsVoteModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-surface text-on-surface font-body-md antialiased flex flex-col min-h-screen">
      {/* Top Fixed Header */}
      <Header
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Content View with proper padding for fixed header and bottom nav */}
      <main className="flex-1 w-full pt-16 pb-20 bg-surface flex flex-col relative">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onTriggerVoteModal={handleTriggerVoteModal}
          />
        )}
        {currentTab === 'votes' && (
          <VotesScreen
            isVoteModalOpen={isVoteModalOpen}
            setIsVoteModalOpen={setIsVoteModalOpen}
          />
        )}
        {currentTab === 'tickets' && (
          <TicketsScreen />
        )}
        {currentTab === 'explore' && (
          <ExploreScreen />
        )}
        {currentTab === 'profile' && (
          <ProfileScreen
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* Notifications Drawer Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Bottom Fixed Navigation Bar */}
      <BottomNav
        currentTab={currentTab}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
