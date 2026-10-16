import React, { useState } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import VotesScreen from './components/VotesScreen.jsx';
import TicketsScreen from './components/TicketsScreen.jsx';
import ParkingScreen from './components/ParkingScreen.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import NotificationsModal from './components/NotificationsModal.jsx';

export default function App() {
  const [currentTab, setCurrentTab] = useState('home');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);

  const handleNavigate = (tab) => {
    // Map legacy 'explore' tab to 'parking'
    const target = tab === 'explore' ? 'parking' : tab;
    setCurrentTab(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerVoteModal = () => {
    setCurrentTab('votes');
    setIsVoteModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="desktop-layout bg-surface text-on-surface font-body-md antialiased min-h-screen">
      {/* Desktop Sidebar – hidden on mobile via CSS */}
      <Sidebar
        currentTab={currentTab}
        onNavigate={handleNavigate}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Top Fixed Header – hidden on desktop via CSS */}
      <div className="desktop-header">
        <Header
          currentTab={currentTab}
          onNavigate={handleNavigate}
          onOpenNotifications={() => setIsNotificationsOpen(true)}
        />
      </div>

      {/* Main Content View */}
      <main className="desktop-main flex-1 w-full pt-16 pb-20 bg-surface flex flex-col relative">
        {currentTab === 'home' && (
          <HomeScreen
            onNavigate={handleNavigate}
            onTriggerVoteModal={handleTriggerVoteModal}
          />
        )}
        {currentTab === 'parking' && (
          <ParkingScreen />
        )}
        {currentTab === 'tickets' && (
          <TicketsScreen />
        )}
        {currentTab === 'votes' && (
          <VotesScreen
            isVoteModalOpen={isVoteModalOpen}
            setIsVoteModalOpen={setIsVoteModalOpen}
          />
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

      {/* Bottom Fixed Navigation Bar – hidden on desktop via CSS */}
      <div className="mobile-bottom-nav">
        <BottomNav
          currentTab={currentTab}
          onNavigate={handleNavigate}
        />
      </div>
    </div>
  );
}
