import React, { useState } from 'react';
import { SkyBackground } from './components/layout/SkyBackground';
import { TopNavigation } from './components/layout/TopNavigation';
import { TimeGreeting } from './components/greeting/TimeGreeting';
import { StudentAffirmationCard } from './components/greeting/StudentAffirmationCard';
import { PomodoroTimer } from './components/study/PomodoroTimer';
import { AmbientSoundMixer } from './components/study/AmbientSoundMixer';
import { SmallWinsList } from './components/study/SmallWinsList';
import { StudyMascot } from './components/mascot/StudyMascot';
import { AnxietyShredder } from './components/stress-relief/AnxietyShredder';
import { BubblePopCanvas } from './components/stress-relief/BubblePopCanvas';
import { ChatModal } from './components/chat/ChatModal';
import { audioService } from './services/audioService';

export const App: React.FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isShredderOpen, setIsShredderOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [onlineCount] = useState(1428);

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
      {/* 1. Dynamic Pastel Sky & Cloud Backdrop */}
      <SkyBackground />

      {/* 2. Floating Clickable Stress-Relief Cloud Bubbles */}
      <BubblePopCanvas />

      {/* 3. Top Navigation with Brand & Live Counter */}
      <TopNavigation
        onOpenChat={() => setIsChatOpen(true)}
        onOpenShredder={() => setIsShredderOpen(true)}
        isMuted={isMuted}
        onToggleMute={toggleMute}
        activeOnlineCount={onlineCount}
      />

      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px' }}>
        {/* 4. Warm Time-based Greeting */}
        <TimeGreeting />

        {/* 5. Daily Student Affirmation Card */}
        <StudentAffirmationCard />

        {/* 6. Core Study Grid (Pomodoro, Mascot, Sound Mixer, Small Wins) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          alignItems: 'start',
          marginTop: '10px'
        }}>
          {/* Left Column: Pomodoro Focus Timer & Mascot */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <PomodoroTimer />
            <StudyMascot onOpenChat={() => setIsChatOpen(true)} />
          </div>

          {/* Right Column: Sound Mixer & Small Wins */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <AmbientSoundMixer />
            <SmallWinsList />
          </div>
        </div>
      </main>

      {/* 7. Modals: AI Chat Companion & Anxiety Shredder */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
      />

      <AnxietyShredder
        isOpen={isShredderOpen}
        onClose={() => setIsShredderOpen(false)}
      />
    </div>
  );
};

export default App;
