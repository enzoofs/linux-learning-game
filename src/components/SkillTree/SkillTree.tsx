import { useGameStore } from '../../stores/gameStore';
import { SKILL_TREE_NODES } from '../../data/skillTree';
import { getModuleById } from '../../data/modules';
import { TIERS } from '../../data/tiers';

interface SkillTreeProps {
  onSelectModule: (moduleId: string) => void;
}

export function SkillTree({ onSelectModule }: SkillTreeProps) {
  const { completedModules, isModuleUnlocked } = useGameStore();

  return (
    <div className="p-6 overflow-auto" style={{ minHeight: 300 }}>
      <div className="text-sm text-slate-500 mb-4 font-semibold tracking-wider">ÁRVORE DE SKILLS</div>

      <svg viewBox="0 0 800 580" className="w-full max-w-2xl mx-auto">
        {/* Draw connections first (behind nodes) */}
        {SKILL_TREE_NODES.map((node) =>
          node.connections.map((targetId) => {
            const target = SKILL_TREE_NODES.find((n) => n.moduleId === targetId);
            if (!target) return null;
            const bothCompleted = completedModules.includes(node.moduleId) && completedModules.includes(targetId);
            const sourceCompleted = completedModules.includes(node.moduleId);
            return (
              <line
                key={`${node.moduleId}-${targetId}`}
                x1={node.x}
                y1={node.y + 25}
                x2={target.x}
                y2={target.y - 5}
                stroke={bothCompleted ? '#4ade80' : sourceCompleted ? '#334155' : '#1e293b'}
                strokeWidth={2}
                strokeDasharray={sourceCompleted ? undefined : '6 4'}
              />
            );
          })
        )}

        {/* Draw nodes */}
        {SKILL_TREE_NODES.map((node) => {
          const mod = getModuleById(node.moduleId);
          const isCompleted = completedModules.includes(node.moduleId);
          const prereqs = mod?.prerequisites || [];
          const isUnlocked = isModuleUnlocked(node.moduleId, prereqs);
          const hasContent = !!mod;
          const tierColor = mod ? TIERS.find((t) => t.name === mod.tier)?.color || '#64748b' : '#64748b';

          return (
            <g key={node.moduleId}>
              <rect
                x={node.x - 70}
                y={node.y - 20}
                width={140}
                height={50}
                rx={8}
                fill={isCompleted ? 'rgba(74,222,128,0.1)' : isUnlocked ? 'rgba(30,41,59,0.8)' : 'rgba(15,23,42,0.6)'}
                stroke={isCompleted ? '#4ade80' : isUnlocked && hasContent ? tierColor : '#1e293b'}
                strokeWidth={isCompleted ? 2 : 1}
                className={isUnlocked && hasContent && !isCompleted ? 'cursor-pointer' : ''}
                onClick={() => {
                  if (isUnlocked && hasContent && !isCompleted) {
                    onSelectModule(node.moduleId);
                  }
                }}
                style={{ opacity: isUnlocked ? 1 : 0.4 }}
              />
              <text x={node.x - 55} y={node.y + 5} fontSize={14} textAnchor="start">
                {isCompleted ? '✅' : isUnlocked && hasContent ? '▶️' : '🔒'}
              </text>
              <text
                x={node.x - 35}
                y={node.y + 4}
                fontSize={11}
                fill={isCompleted ? '#4ade80' : isUnlocked ? '#e2e8f0' : '#475569'}
                fontWeight={600}
                fontFamily="monospace"
              >
                {mod?.title || node.moduleId}
              </text>
              <text
                x={node.x + 65}
                y={node.y + 4}
                fontSize={9}
                fill={tierColor}
                textAnchor="end"
                fontFamily="monospace"
              >
                {mod ? TIERS.find((t) => t.name === mod.tier)?.displayName || mod.tier : ''}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
        <span>✅ Concluído</span>
        <span>▶️ Disponível</span>
        <span>🔒 Bloqueado</span>
      </div>
    </div>
  );
}
