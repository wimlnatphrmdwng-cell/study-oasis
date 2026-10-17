import React, { useState, useEffect } from 'react';
import type { PageRoute } from './types/navigation.types';
import { SkyBackground } from './components/layout/SkyBackground';
import { TopNavigation } from './components/layout/TopNavigation';
import { BubblePopCanvas } from './components/stress-relief/BubblePopCanvas';
import { HomePage } from './pages/HomePage';
import { StudyPage } from './pages/StudyPage';
import { ChatPage } from './pages/ChatPage';
import { RelaxPage } from './pages/RelaxPage';
import { JournalPage } from './pages/JournalPage';
import { audioService } from './services/audioService';

export const App: React.FC = () => {
  // Sync state with URL hash (e.g. #/study, #/chat)
  const getRouteFromHash = (): PageRoute => {
    const hash = window.location.hash.replace('#/', '').replace('#', '');
    if (['home', 'study', 'chat', 'relax', 'journal'].includes(hash)) {
      return hash as PageRoute;
    }
    return 'home';
  };

  const [currentRoute, setCurrentRoute] = useState<PageRoute>(getRouteFromHash());
  const [isMuted, setIsMuted] = useState(false);
  const [onlineCount] = useState(1428);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(getRouteFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (route: PageRoute) => {
    window.location.hash = `#/${route}`;
    setCurrentRoute(route);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    audioService.isMuted = nextMute;
    if (nextMute) {
      audioService.stopAll();
    }
  };

  return (
    <div style={{ minHeight: '100vh', position: 'relative', paddingBottom: '40px' }}>
      {/* 1. Global Pastel Sky Background */}
      <SkyBackground />

      {/* 2. Floating Clickable Stress-Relief Cloud Bubbles */}
      <BubblePopCanvas />

      {/* 3. Global Glassmorphism Top Navigation */}
      <TopNavigation
        currentRoute={currentRoute}
        onNavigate={navigate}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        activeOnlineCount={onlineCount}
      />

      {/* 4. Active Page Content */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '10px 20px 48px' }}>
        {currentRoute === 'home' && <HomePage onNavigate={navigate} />}
        {currentRoute === 'study' && <StudyPage />}
        {currentRoute === 'chat' && <ChatPage />}
        {currentRoute === 'relax' && <RelaxPage />}
        {currentRoute === 'journal' && <JournalPage />}
      </main>
    </div>
  );
};

export default App;
