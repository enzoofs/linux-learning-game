import { useState, useEffect, useRef, useCallback } from 'react';
import { Layout } from './components/Layout/Layout';
import { ModulePlayer } from './components/ModulePlayer/ModulePlayer';
import { MissionMap } from './components/MissionMap/MissionMap';
import { Achievements } from './components/Achievements/Achievements';
import { Stats } from './components/Stats/Stats';
import { Journal } from './components/Journal/Journal';
import { Chat } from './components/Chat/Chat';
import { Shop } from './components/Shop/Shop';
import { Sandbox } from './components/Sandbox/Sandbox';
import { useAchievementDetection } from './hooks/useAchievements';
import { useGameStore } from './stores/gameStore';
import { cliBasicsModule } from './data/modules/cli-basics';
import { getModuleById, ALL_MODULES } from './data/modules';
import type { Module, AppView } from './types';

const VALID_VIEWS: AppView[] = ['terminal', 'sandbox', 'map', 'shop', 'journal', 'achievements', 'stats'];

function resolveInitialView(): AppView {
  const saved = useGameStore.getState().currentView;
  return VALID_VIEWS.includes(saved) ? saved : 'terminal';
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
  const [view, setView] = useState<AppView>(resolveInitialView);
  const [activeModule, setActiveModule] = useState<Module | null>(resolveInitialModule);
  const { updateStreak, addPlayTime, setCurrentView } = useGameStore();
  const sessionStart = useRef(Date.now());

  const handleSetView = useCallback((v: AppView) => {
    setView(v);
    setCurrentView(v);
  }, [setCurrentView]);

  useAchievementDetection();

  // Dev helper: window.__dev.unlockAll() / lockAll() from browser console
  useEffect(() => {
    const allModuleIds = ALL_MODULES.map(m => m.id);
    (window as unknown as Record<string, unknown>).__dev = {
      unlockAll: () => {
        useGameStore.setState({
          completedModules: allModuleIds,
          completedBosses: allModuleIds,
          secretBookUnlocked: true,
          totalXP: 50000,
          lifetimeXP: 50000,
          spendableXP: 50000,
        });
        if (import.meta.env.DEV) console.log(`Desbloqueados ${allModuleIds.length} modulos + Secret Book + 50k XP`);
      },
      lockAll: () => {
        useGameStore.setState({
          completedModules: [],
          completedBosses: [],
          completedDrills: [],
          secretBookUnlocked: false,
          totalXP: 0,
          lifetimeXP: 0,
          spendableXP: 0,
        });
        if (import.meta.env.DEV) console.log('Tudo bloqueado, progresso resetado.');
      },
    };
  }, []);

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
    <>
      <Layout currentView={view} onViewChange={handleSetView}>
        {view === 'terminal' && activeModule && (
          <ModulePlayer
            key={activeModule.id}
            module={activeModule}
            onModuleComplete={() => handleSetView('map')}
          />
        )}
        {view === 'map' && (
          <MissionMap onSelectModule={(id) => {
            const mod = getModuleById(id);
            if (mod) {
              setActiveModule(mod);
              handleSetView('terminal');
            }
          }} />
        )}
        {view === 'sandbox' && <Sandbox />}
        {view === 'shop' && <Shop />}
        {view === 'journal' && <Journal />}
        {view === 'achievements' && <Achievements />}
        {view === 'stats' && <Stats />}
      </Layout>
      <Chat moduleContext={activeModule ? {
        title: activeModule.title,
        phase: useGameStore.getState().currentPhase || 'menu',
      } : undefined} />
    </>
  );
}

export default App;
