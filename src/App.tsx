import { useState } from 'react';
import { Layout } from './components/Layout/Layout';

type View = 'terminal' | 'map' | 'journal' | 'achievements' | 'stats';

function App() {
  const [view, setView] = useState<View>('terminal');

  return (
    <Layout currentView={view} onViewChange={setView}>
      <div className="p-6 text-slate-400 text-center min-h-[300px] flex items-center justify-center">
        {view === 'terminal' && <p>Terminal — ModulePlayer coming in Task 9</p>}
        {view === 'map' && <p>Skill Tree — coming soon</p>}
        {view === 'journal' && <p>Journal — coming soon</p>}
        {view === 'achievements' && <p>Achievements — coming soon</p>}
        {view === 'stats' && <p>Stats — coming soon</p>}
      </div>
    </Layout>
  );
}

export default App;
