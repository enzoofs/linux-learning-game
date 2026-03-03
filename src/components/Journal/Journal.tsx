import { useGameStore } from '../../stores/gameStore';
import { ALL_MODULES } from '../../data/modules';
import { TIERS } from '../../data/tiers';

export function Journal() {
  const { completedModules, completedDrills } = useGameStore();
  const completedModuleData = ALL_MODULES.filter((m) => completedModules.includes(m.id));

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <div className="text-sm text-slate-500 mb-1 font-semibold tracking-wider">DIÁRIO DE COMANDOS</div>
      <div className="text-xs text-slate-600 mb-6">
        {completedDrills.length} comandos praticados
      </div>

      {completedModuleData.length === 0 ? (
        <div className="text-slate-600 text-sm text-center py-12">
          Complete módulos para preencher seu diário!
        </div>
      ) : (
        completedModuleData.map((mod) => {
          const tierColor = TIERS.find((t) => t.name === mod.tier)?.color || '#fff';
          return (
            <div key={mod.id} className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 rounded" style={{ background: tierColor }} />
                <span className="text-sm font-semibold text-gray-200">{mod.title}</span>
                <span className="text-xs text-slate-500">{TIERS.find((t) => t.name === mod.tier)?.displayName || mod.tier}</span>
              </div>
              <pre className="bg-[#0f172a] rounded-lg p-3 text-green-400 text-xs mb-3 overflow-x-auto">
                {mod.briefing.syntax}
              </pre>
              <div className="space-y-1 ml-3">
                {mod.drills.map((drill) => {
                  const done = completedDrills.includes(drill.id);
                  return (
                    <div key={drill.id} className="flex items-center gap-2">
                      <span className={`text-xs ${done ? 'text-green-400' : 'text-slate-600'}`}>
                        {done ? '\u2713' : '\u25CB'}
                      </span>
                      <span className={`text-xs ${done ? 'text-slate-300' : 'text-slate-600'}`}>
                        {drill.prompt.slice(0, 60)}{drill.prompt.length > 60 ? '...' : ''}
                      </span>
                      <span className="text-xs" style={{ color: tierColor }}>
                        {drill.difficulty}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
