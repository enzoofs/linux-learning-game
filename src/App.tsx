import { useState, useEffect, useRef, useCallback, Suspense, lazy } from 'react';
import { Layout } from './components/Layout/Layout';
import { ModulePlayer } from './components/ModulePlayer/ModulePlayer';

const MissionMap = lazy(() => import('./components/MissionMap/MissionMap').then(m => ({ default: m.MissionMap })));
const Achievements = lazy(() => import('./components/Achievements/Achievements').then(m => ({ default: m.Achievements })));
const Stats = lazy(() => import('./components/Stats/Stats').then(m => ({ default: m.Stats })));
const Journal = lazy(() => import('./components/Journal/Journal').then(m => ({ default: m.Journal })));
const Shop = lazy(() => import('./components/Shop/Shop').then(m => ({ default: m.Shop })));
const Sandbox = lazy(() => import('./components/Sandbox/Sandbox').then(m => ({ default: m.Sandbox })));
const Chat = lazy(() => import('./components/Chat/Chat').then(m => ({ default: m.Chat })));
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
        console.log(`✅ Desbloqueados ${allModuleIds.length} módulos + Secret Book + 50k XP`);
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
        console.log('🔒 Tudo bloqueado, progresso resetado.');
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
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <MissionMap onSelectModule={(id) => {
              const mod = getModuleById(id);
              if (mod) {
                setActiveModule(mod);
                handleSetView('terminal');
              }
            }} />
          </Suspense>
        )}
        {view === 'sandbox' && (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <Sandbox />
          </Suspense>
        )}
        {view === 'shop' && (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <Shop />
          </Suspense>
        )}
        {view === 'journal' && (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <Journal />
          </Suspense>
        )}
        {view === 'achievements' && (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <Achievements />
          </Suspense>
        )}
        {view === 'stats' && (
          <Suspense fallback={<div className="flex items-center justify-center h-full text-slate-500">Carregando...</div>}>
            <Stats />
          </Suspense>
        )}
      </Layout>
      <Suspense fallback={null}>
        <Chat moduleContext={activeModule ? {
          title: activeModule.title,
          phase: useGameStore.getState().currentPhase || 'menu',
        } : undefined} />
      </Suspense>
    </>
  );
}

export default App;
