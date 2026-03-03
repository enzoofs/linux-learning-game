import type { SkillTreeNode } from '../types';

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  { moduleId: 'cli-basics', x: 450, y: 50, connections: ['files-nav', 'pipes-streams', 'process-mgmt'] },
  { moduleId: 'files-nav', x: 150, y: 190, connections: ['text-processing'] },
  { moduleId: 'pipes-streams', x: 450, y: 190, connections: ['data-wrangling'] },
  { moduleId: 'process-mgmt', x: 750, y: 190, connections: ['system-admin'] },
  { moduleId: 'text-processing', x: 150, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'data-wrangling', x: 450, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'system-admin', x: 750, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'one-liner-legend', x: 450, y: 490, connections: [] },
];
