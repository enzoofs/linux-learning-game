import { useGameStore } from '../../stores/gameStore';
import { getModuleById } from '../../data/modules';
import { SKILL_TREE_NODES } from '../../data/skillTree';
import { TIERS } from '../../data/tiers';
import type { TierName } from '../../types';

interface MissionMapProps {
  onSelectModule: (moduleId: string) => void;
}

// All modules in progression order, including not-yet-implemented ones
const MODULE_ORDER = SKILL_TREE_NODES.map((n) => n.moduleId);

function getModuleXP(moduleId: string): number {
  const mod = getModuleById(moduleId);
  if (!mod) return 0;
  const drillXP = mod.drills.reduce((sum, d) => sum + d.xp, 0);
  return drillXP + mod.boss.xpReward;
}

// Map moduleId to its tier (from module data or fallback from skill tree position)
function getModuleTier(moduleId: string): TierName {
  const mod = getModuleById(moduleId);
  if (mod) return mod.tier;
  // Fallback for unimplemented modules based on skill tree position
  const node = SKILL_TREE_NODES.find((n) => n.moduleId === moduleId);
  if (!node) return 'Recruit';
  if (node.y <= 100) return 'Recruit';
  if (node.y <= 250) return 'Operator';
  if (node.y <= 400) return 'Specialist';
  return 'Commander';
}

// Friendly names for unimplemented modules
const PLACEHOLDER_NAMES: Record<string, string> = {
  'system-admin': 'Admin do Sistema',
  'one-liner-legend': 'Lenda do One-Liner',
};

export function MissionMap({ onSelectModule }: MissionMapProps) {
  const { completedModules, isModuleUnlocked } = useGameStore();

  // Group modules by tier
  const tierGroups = TIERS.map((tier) => ({
    tier,
    modules: MODULE_ORDER.filter((id) => getModuleTier(id) === tier.name),
  }));

  return (
    <div className="p-6 overflow-auto">
      {tierGroups.map(({ tier, modules }) => {
        if (modules.length === 0) return null;
        return (
          <div key={tier.name} className="mb-6">
            {/* Tier header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg">{tier.icon}</span>
              <span
                className="text-sm font-bold tracking-widest uppercase"
                style={{ color: tier.color }}
              >
                {tier.displayName}
              </span>
              <span className="text-xs text-slate-500 ml-1">{tier.minXP}+ XP</span>
            </div>

            {/* Module grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {modules.map((moduleId) => {
                const mod = getModuleById(moduleId);
                const hasContent = !!mod;
                const isCompleted = completedModules.includes(moduleId);
                const prereqs = mod?.prerequisites || [];
                const isUnlocked = isModuleUnlocked(moduleId, prereqs);
                const clickable = isUnlocked && hasContent;
                const totalXP = getModuleXP(moduleId);

                // Global module number
                const globalIdx = MODULE_ORDER.indexOf(moduleId);
                const moduleNumber = `M${globalIdx + 1}`;

                const title = mod?.title || PLACEHOLDER_NAMES[moduleId] || moduleId;

                return (
                  <button
                    key={moduleId}
                    onClick={() => clickable && onSelectModule(moduleId)}
                    className="text-left rounded-lg border px-3 py-2.5 transition-all"
                    style={{
                      cursor: clickable ? 'pointer' : 'default',
                      opacity: isUnlocked ? 1 : 0.4,
                      backgroundColor: isCompleted
                        ? 'rgba(74,222,128,0.06)'
                        : 'rgba(15,23,42,0.6)',
                      borderColor: isCompleted
                        ? '#4ade80'
                        : clickable
                          ? tier.color
                          : '#1e293b',
                    }}
                    onMouseEnter={(e) => {
                      if (clickable) {
                        (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                          isCompleted ? 'rgba(74,222,128,0.12)' : 'rgba(30,41,59,0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        isCompleted ? 'rgba(74,222,128,0.06)' : 'rgba(15,23,42,0.6)';
                    }}
                  >
                    {/* Top row: status dot + module number + XP */}
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        {/* Status indicator */}
                        <span
                          className="inline-block w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isCompleted
                              ? '#4ade80'
                              : clickable
                                ? tier.color
                                : '#334155',
                          }}
                        />
                        <span
                          className="text-xs font-bold"
                          style={{
                            color: isCompleted
                              ? '#4ade80'
                              : clickable
                                ? tier.color
                                : '#475569',
                          }}
                        >
                          {moduleNumber}
                        </span>
                      </div>
                      {totalXP > 0 && (
                        <span className="text-[10px] font-semibold text-slate-400">
                          +{totalXP} XP
                        </span>
                      )}
                      {!hasContent && (
                        <span className="text-[10px] text-slate-600">Em breve</span>
                      )}
                    </div>
                    {/* Title */}
                    <div
                      className="text-xs font-medium truncate"
                      style={{
                        color: isCompleted ? '#d1fae5' : isUnlocked ? '#e2e8f0' : '#475569',
                      }}
                    >
                      {title}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* Legend */}
      <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-green-400" /> Concluído
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-blue-400" /> Disponível
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-2 h-2 rounded-full bg-slate-700" /> Bloqueado
        </span>
      </div>
    </div>
  );
}
