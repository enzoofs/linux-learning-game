import type { SkillTreeNode } from '../types';

export const SKILL_TREE_NODES: SkillTreeNode[] = [
  // Base modules (Recruit → Commander)
  { moduleId: 'cli-basics', x: 450, y: 50, connections: ['files-nav', 'pipes-streams', 'process-mgmt'] },
  { moduleId: 'files-nav', x: 150, y: 190, connections: ['text-processing'] },
  { moduleId: 'pipes-streams', x: 450, y: 190, connections: ['data-wrangling'] },
  { moduleId: 'process-mgmt', x: 750, y: 190, connections: ['system-admin'] },
  { moduleId: 'text-processing', x: 150, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'data-wrangling', x: 450, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'system-admin', x: 750, y: 340, connections: ['one-liner-legend'] },
  { moduleId: 'one-liner-legend', x: 450, y: 490, connections: [] },

  // Secret Book — Initiate tier
  { moduleId: 'sb-shell-tricks', x: 300, y: 600, connections: ['sb-shell-functions', 'sb-advanced-find', 'sb-permissions'] },
  { moduleId: 'sb-shell-functions', x: 100, y: 740, connections: ['sb-vim', 'sb-tmux', 'sb-curl'] },
  { moduleId: 'sb-advanced-find', x: 450, y: 740, connections: [] },
  { moduleId: 'sb-permissions', x: 700, y: 740, connections: ['sb-disk'] },

  // Secret Book — Adept tier
  { moduleId: 'sb-vim', x: 100, y: 880, connections: [] },
  { moduleId: 'sb-tmux', x: 300, y: 880, connections: [] },
  { moduleId: 'sb-curl', x: 500, y: 880, connections: ['sb-ssh', 'sb-networking'] },
  { moduleId: 'sb-ssh', x: 300, y: 1020, connections: [] },
  { moduleId: 'sb-disk', x: 700, y: 880, connections: ['sb-networking'] },

  // Secret Book — Master tier
  { moduleId: 'sb-networking', x: 600, y: 1020, connections: ['sb-docker', 'sb-hardening'] },
  { moduleId: 'sb-git', x: 100, y: 1020, connections: ['sb-oneliners'] },
  { moduleId: 'sb-monitoring', x: 400, y: 1020, connections: ['sb-logs'] },
  { moduleId: 'sb-cron', x: 200, y: 1160, connections: [] },
  { moduleId: 'sb-logs', x: 400, y: 1160, connections: ['sb-oneliners', 'sb-hardening'] },

  // Secret Book — GrandMaster tier
  { moduleId: 'sb-docker', x: 600, y: 1160, connections: [] },
  { moduleId: 'sb-packages', x: 100, y: 1300, connections: [] },
  { moduleId: 'sb-oneliners', x: 300, y: 1300, connections: [] },
  { moduleId: 'sb-hardening', x: 600, y: 1300, connections: [] },
];
