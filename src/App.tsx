import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { ModulePlayer } from './components/ModulePlayer/ModulePlayer';
import { SkillTree } from './components/SkillTree/SkillTree';
import { Achievements } from './components/Achievements/Achievements';
import { Stats } from './components/Stats/Stats';
import { Journal } from './components/Journal/Journal';
import { useAchievementDetection } from './hooks/useAchievements';
import { cliBasicsModule } from './data/modules/cli-basics';
import { getModuleById } from './data/modules';
import { Module } from './types';

type View = 'terminal' | 'map' | 'journal' | 'achievements' | 'stats';

function App() {
  const [view, setView] = useState<View>('terminal');
  const [activeModule, setActiveModule] = useState<Module | null>(cliBasicsModule);

  useAchievementDetection();

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
