import React, { useEffect, useState } from 'react';
import Header from './components/Header.jsx';
import BottomNav from './components/BottomNav.jsx';
import Sidebar from './components/Sidebar.jsx';
import HomeScreen from './components/HomeScreen.jsx';
import VotesScreen from './components/VotesScreen.jsx';
import TicketsScreen from './components/TicketsScreen.jsx';
import ParkingScreen from './components/ParkingScreen.jsx';
import ProfileScreen from './components/ProfileScreen.jsx';
import NotificationsModal from './components/NotificationsModal.jsx';
import LoginScreen from './components/LoginScreen.jsx';
import FuelScreen from './components/FuelScreen.jsx';
import DisruptionsScreen from './components/DisruptionsScreen.jsx';
import EventsScreen from './components/EventsScreen.jsx';
import GuidesScreen from './components/GuidesScreen.jsx';
import TimetableScreen from './components/TimetableScreen.jsx';
import { useAuth } from './AuthContext.jsx';
import { ROLE_DEFAULT_TAB, allowedTabsFor } from './navConfig.js';

export default function App() {
  const { session, role } = useAuth();
  const [currentTab, setCurrentTab] = useState('home');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isVoteModalOpen, setIsVoteModalOpen] = useState(false);
  const [qrRequested, setQrRequested] = useState(false);
  const [pendingAnchor, setPendingAnchor] = useState(null);

  // start on the role's landing page after every login
  useEffect(() => {
    if (role) { setCurrentTab(ROLE_DEFAULT_TAB[role] || 'home'); setIsNotificationsOpen(false); }
  }, [role, session?.createdAt]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // newest first; skip overlays rendered by the shared Modal (they own their Escape handling)
      const overlays = [...document.querySelectorAll('div.fixed.inset-0')].filter((el) => !el.hasAttribute('data-shared-modal'));
      const top = overlays[overlays.length - 1];
      if (top) { e.preventDefault(); top.click(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!pendingAnchor) return undefined;
    const t = setTimeout(() => {
      document.getElementById(pendingAnchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setPendingAnchor(null);
    }, 80);
    return () => clearTimeout(t);
  }, [pendingAnchor, currentTab]);

  if (!session) return <LoginScreen />;

  const allowed = allowedTabsFor(role);
  const handleNavigate = (tabWithAnchor) => {
    const [tab, anchor] = String(tabWithAnchor).split('#');
    const target = tab === 'explore' ? 'parking' : tab;
    setCurrentTab(allowed.includes(target) ? target : ROLE_DEFAULT_TAB[role] || 'home');
    if (anchor && allowed.includes(target)) { setPendingAnchor(anchor); return; }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenQr = () => {
    if (!allowed.includes('tickets')) return;
    setCurrentTab('tickets');
    setQrRequested(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTriggerVoteModal = () => {
    if (!allowed.includes('votes')) return;
    setCurrentTab('votes');
    setIsVoteModalOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // never render a screen the role may not see (e.g. stale tab after switching accounts)
  const tab = allowed.includes(currentTab) ? currentTab : ROLE_DEFAULT_TAB[role] || 'home';

  return (
    <div className="desktop-layout bg-surface text-on-surface font-body-md antialiased min-h-screen">
      <Sidebar currentTab={tab} onNavigate={handleNavigate} onOpenNotifications={() => setIsNotificationsOpen(true)} />

      <div className="desktop-header">
        <Header currentTab={tab} onNavigate={handleNavigate} onOpenNotifications={() => setIsNotificationsOpen(true)} />
      </div>

      <main className="desktop-main flex-1 w-full pt-16 pb-20 bg-surface flex flex-col relative">
        {tab === 'home' && <HomeScreen onNavigate={handleNavigate} onTriggerVoteModal={handleTriggerVoteModal} onOpenQr={handleOpenQr} />}
        {tab === 'parking' && <ParkingScreen />}
        {tab === 'tickets' && <TicketsScreen openQrRequested={qrRequested} onQrHandled={() => setQrRequested(false)} />}
        {tab === 'timetable' && <TimetableScreen />}
        {tab === 'fuel' && <FuelScreen />}
        {tab === 'disruptions' && <DisruptionsScreen />}
        {tab === 'events' && <EventsScreen />}
        {tab === 'guides' && <GuidesScreen />}
        {tab === 'votes' && <VotesScreen isVoteModalOpen={isVoteModalOpen} setIsVoteModalOpen={setIsVoteModalOpen} />}
        {tab === 'profile' && <ProfileScreen onNavigate={handleNavigate} />}
      </main>

      <NotificationsModal isOpen={isNotificationsOpen} onClose={() => setIsNotificationsOpen(false)} onNavigate={handleNavigate} />

      <div className="mobile-bottom-nav">
        <BottomNav currentTab={tab} onNavigate={handleNavigate} />
      </div>
    </div>
  );
}
