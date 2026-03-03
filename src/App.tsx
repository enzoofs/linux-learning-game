import { useState, useEffect, useRef } from 'react';
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

function App() {
  const [view, setView] = useState<View>('terminal');
  const [activeModule, setActiveModule] = useState<Module | null>(cliBasicsModule);
  const { updateStreak, addPlayTime } = useGameStore();
  const sessionStart = useRef(Date.now());

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
    <Layout currentView={view} onViewChange={setView}>
      {view === 'terminal' && activeModule && (
        <ModulePlayer
          key={activeModule.id}
          module={activeModule}
          onModuleComplete={() => setView('map')}
        />
      )}
      {view === 'map' && (
        <SkillTree onSelectModule={(id) => {
          const mod = getModuleById(id);
          if (mod) {
            setActiveModule(mod);
            setView('terminal');
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
