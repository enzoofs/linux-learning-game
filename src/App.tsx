import { useState } from 'react';
import { Layout } from './components/Layout/Layout';
import { ModulePlayer } from './components/ModulePlayer/ModulePlayer';
import { cliBasicsModule } from './data/modules/cli-basics';
import { Module } from './types';

type View = 'terminal' | 'map' | 'journal' | 'achievements' | 'stats';

function App() {
  const [view, setView] = useState<View>('terminal');
  const [activeModule, setActiveModule] = useState<Module | null>(cliBasicsModule);

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
        <div className="p-6 text-slate-400 text-center min-h-[300px] flex items-center justify-center">
          Skill Tree — coming in Task 10-11
        </div>
      )}
      {view === 'journal' && (
        <div className="p-6 text-slate-400 text-center min-h-[300px] flex items-center justify-center">
          Journal — coming soon
        </div>
      )}
      {view === 'achievements' && (
        <div className="p-6 text-slate-400 text-center min-h-[300px] flex items-center justify-center">
          Achievements — coming soon
        </div>
      )}
      {view === 'stats' && (
        <div className="p-6 text-slate-400 text-center min-h-[300px] flex items-center justify-center">
          Stats — coming soon
        </div>
      )}
    </Layout>
  );
}

export default App;
