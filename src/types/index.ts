// === Tiers & Progression ===

export type TierName = 'Recruit' | 'Operator' | 'Specialist' | 'Commander';

export interface Tier {
  name: TierName;
  color: string;
  icon: string;
  minXP: number;
}

// === Learning Loop Phases ===

export type ModulePhase = 'briefing' | 'sandbox' | 'drill' | 'boss' | 'completed';

// === Briefing ===

export interface BriefingExample {
  command: string;
  output: string;
  explanation: string;
}

export interface Briefing {
  concept: string;
  analogy: string;
  syntax: string;
  examples: BriefingExample[];
}

// === Sandbox ===

export interface SandboxCommand {
  pattern: RegExp;
  output: string;
  description?: string;
}

export interface Sandbox {
  commands: SandboxCommand[];
  contextHints: string[];
}

// === Drills ===

export type DrillDifficulty = 'easy' | 'medium' | 'hard';

export interface DrillFeedbackRule {
  pattern: RegExp;
  message: string;
}

export interface Drill {
  id: string;
  prompt: string;
  difficulty: DrillDifficulty;
  check: (cmd: string) => boolean;
  expectedOutput: string;
  hints: string[];
  feedbackRules: DrillFeedbackRule[];
  xp: number;
}

// === Boss Challenges ===

export interface BossStep {
  id: string;
  prompt: string;
  check: (cmd: string) => boolean;
  expectedOutput: string;
  hints: string[];
  feedbackRules: DrillFeedbackRule[];
}

export interface BossChallenge {
  title: string;
  scenario: string;
  steps: BossStep[];
  xpReward: number;
  achievementId?: string;
}

// === Modules ===

export interface Module {
  id: string;
  title: string;
  description: string;
  tier: TierName;
  prerequisites: string[];
  isSideQuest: boolean;
  briefing: Briefing;
  sandbox: Sandbox;
  drills: Drill[];
  boss: BossChallenge;
  achievements: string[];
}

// === Skill Tree ===

export interface SkillTreeNode {
  moduleId: string;
  x: number;
  y: number;
  connections: string[];
}

// === Achievements ===

export type AchievementCategory =
  | 'mastery'
  | 'speed'
  | 'exploration'
  | 'persistence'
  | 'perfection'
  | 'secret'
  | 'streak'
  | 'completionist';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  icon: string;
  check: (state: GameState) => boolean;
}

// === Terminal ===

export type TerminalLineType =
  | 'system'
  | 'input'
  | 'output'
  | 'success'
  | 'error'
  | 'hint'
  | 'brief'
  | 'learned'
  | 'levelup'
  | 'feedback';

export interface TerminalLine {
  type: TerminalLineType;
  text: string;
}

// === Game State ===

export interface DrillAttempt {
  drillId: string;
  moduleId: string;
  succeeded: boolean;
  usedHint: boolean;
  attempts: number;
  timeMs: number;
  timestamp: number;
}

export interface GameState {
  totalXP: number;
  completedModules: string[];
  completedDrills: string[];
  completedBosses: string[];
  unlockedAchievements: string[];
  drillAttempts: DrillAttempt[];
  sandboxCommandsUsed: Record<string, number>;
  currentStreak: number;
  longestStreak: number;
  lastPlayDate: string | null;
  freezeTokens: number;
  totalPlayTimeMs: number;
}
