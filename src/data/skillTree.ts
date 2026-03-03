import type { SkillTreeNode } from '../types';

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  { moduleId: 'cli-basics', x: 400, y: 50, connections: ['files-nav', 'pipes-streams', 'process-mgmt'] },
  { moduleId: 'files-nav', x: 150, y: 200, connections: ['text-processing'] },
  { moduleId: 'pipes-streams', x: 400, y: 200, connections: ['data-wrangling'] },
  { moduleId: 'process-mgmt', x: 650, y: 200, connections: ['system-admin'] },
  { moduleId: 'text-processing', x: 150, y: 350, connections: ['one-liner-legend'] },
  { moduleId: 'data-wrangling', x: 400, y: 350, connections: ['one-liner-legend'] },
  { moduleId: 'system-admin', x: 650, y: 350, connections: ['one-liner-legend'] },
  { moduleId: 'one-liner-legend', x: 400, y: 500, connections: [] },
];
