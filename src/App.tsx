import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from './components/Layout/Layout';
import { ModulePlayer } from './components/ModulePlayer/ModulePlayer';
import { SkillTree } from './components/SkillTree/SkillTree';
import { Achievements } from './components/Achievements/Achievements';
import { Stats } from './components/Stats/Stats';
import { Journal } from './components/Journal/Journal';
import { useAchievementDetection } from './hooks/useAchievements';
import { useGameStore } from './stores/gameStore';
import { cliBasicsModule } from './data/modules/cli-basics';
import { getModuleById } from './data/modules';
import type { Module } from './types';

type View = 'terminal' | 'map' | 'journal' | 'achievements' | 'stats';

const VALID_VIEWS: View[] = ['terminal', 'map', 'journal', 'achievements', 'stats'];

function resolveInitialView(): View {
  const saved = useGameStore.getState().currentView;
  return VALID_VIEWS.includes(saved as View) ? (saved as View) : 'terminal';
}

function resolveInitialModule(): Module | null {
  const savedId = useGameStore.getState().currentModuleId;
  if (savedId) {
    const mod = getModuleById(savedId);
    if (mod) return mod;
  }
  return cliBasicsModule;
}

function App() {
  const [view, setView] = useState<View>(resolveInitialView);
  const [activeModule, setActiveModule] = useState<Module | null>(resolveInitialModule);
  const { updateStreak, addPlayTime, setCurrentView } = useGameStore();
  const sessionStart = useRef(Date.now());

  const handleSetView = useCallback((v: View) => {
    setView(v);
    setCurrentView(v);
  }, [setCurrentView]);

  useAchievementDetection();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    updateStreak(today);

    const handleUnload = () => {
      addPlayTime(Date.now() - sessionStart.current);
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      handleUnload();
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, []);

  return (
    <Layout currentView={view} onViewChange={handleSetView}>
      {view === 'terminal' && activeModule && (
        <ModulePlayer
          key={activeModule.id}
          module={activeModule}
          onModuleComplete={() => handleSetView('map')}
        />
      )}
      {view === 'map' && (
        <SkillTree onSelectModule={(id) => {
          const mod = getModuleById(id);
          if (mod) {
            setActiveModule(mod);
            handleSetView('terminal');
          }
        }} />
      )}
      {view === 'journal' && <Journal />}
      {view === 'achievements' && <Achievements />}
      {view === 'stats' && <Stats />}
    </Layout>
  );
}

export default App;
