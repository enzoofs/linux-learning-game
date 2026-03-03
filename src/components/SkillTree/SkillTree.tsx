import { useGameStore } from '../../stores/gameStore';
import { SKILL_TREE_NODES } from '../../data/skillTree';
import { getModuleById } from '../../data/modules';
import { TIERS } from '../../data/tiers';

const NODE_W = 200;
const NODE_H = 56;

interface SkillTreeProps {
  onSelectModule: (moduleId: string) => void;
}

export function SkillTree({ onSelectModule }: SkillTreeProps) {
  const { completedModules, isModuleUnlocked } = useGameStore();

  return (
    <div className="p-6 overflow-auto" style={{ minHeight: 300 }}>
      <div className="text-sm text-slate-500 mb-4 font-semibold tracking-wider">ÁRVORE DE SKILLS</div>

      <svg viewBox="0 0 900 580" className="w-full max-w-3xl mx-auto">
        {/* Connections */}
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
                y1={node.y + NODE_H / 2}
                x2={target.x}
                y2={target.y - NODE_H / 2}
                stroke={bothCompleted ? '#4ade80' : sourceCompleted ? '#475569' : '#1e293b'}
                strokeWidth={2}
                strokeDasharray={sourceCompleted ? undefined : '6 4'}
              />
            );
          })
        )}

        {/* Nodes */}
        {SKILL_TREE_NODES.map((node) => {
          const mod = getModuleById(node.moduleId);
          const isCompleted = completedModules.includes(node.moduleId);
          const prereqs = mod?.prerequisites || [];
          const isUnlocked = isModuleUnlocked(node.moduleId, prereqs);
          const hasContent = !!mod;
          const tierInfo = mod ? TIERS.find((t) => t.name === mod.tier) : null;
          const tierColor = tierInfo?.color || '#64748b';
          const clickable = isUnlocked && hasContent;

          const rx = node.x - NODE_W / 2;
          const ry = node.y - NODE_H / 2;

          return (
            <g
              key={node.moduleId}
              onClick={() => clickable && onSelectModule(node.moduleId)}
              style={{ cursor: clickable ? 'pointer' : 'default', opacity: isUnlocked ? 1 : 0.4 }}
            >
              <rect
                x={rx}
                y={ry}
                width={NODE_W}
                height={NODE_H}
                rx={10}
                fill={isCompleted ? 'rgba(74,222,128,0.08)' : isUnlocked ? 'rgba(30,41,59,0.9)' : 'rgba(15,23,42,0.6)'}
                stroke={isCompleted ? '#4ade80' : clickable ? tierColor : '#1e293b'}
                strokeWidth={isCompleted ? 2 : 1}
              />
              {/* Row 1: Icon + Title */}
              <text
                x={node.x}
                y={node.y - 4}
                textAnchor="middle"
                fontSize={12}
                fill={isCompleted ? '#4ade80' : isUnlocked ? '#e2e8f0' : '#475569'}
                fontWeight={600}
                fontFamily="monospace"
              >
                {isCompleted ? '✅ ' : isUnlocked && hasContent ? '▶ ' : '🔒 '}
                {mod?.title || node.moduleId}
              </text>
              {/* Row 2: Tier */}
              <text
                x={node.x}
                y={node.y + 16}
                textAnchor="middle"
                fontSize={10}
                fill={tierColor}
                fontFamily="monospace"
              >
                {tierInfo?.displayName || ''}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="flex justify-center gap-6 mt-4 text-xs text-slate-500">
        <span>✅ Concluído</span>
        <span>▶ Disponível</span>
        <span>🔒 Bloqueado</span>
      </div>
    </div>
  );
}
