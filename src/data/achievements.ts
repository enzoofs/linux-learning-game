import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'First Steps',
    description: 'Complete your first drill.',
    category: 'mastery',
    icon: '🐣',
    check: (s) => s.completedDrills.length >= 1,
  },
  {
    id: 'pipe-wizard',
    title: 'Pipe Wizard',
    description: 'Complete all pipe drills without hints.',
    category: 'mastery',
    icon: '🔮',
    check: (s) => {
      const pipeDrills = s.drillAttempts.filter((a) => a.moduleId === 'pipes-streams' && a.succeeded);
      return pipeDrills.length >= 3 && pipeDrills.every((a) => !a.usedHint);
    },
  },
  {
    id: 'speed-demon',
    title: 'Speed Demon',
    description: 'Complete a drill in under 5 seconds.',
    category: 'speed',
    icon: '⚡',
    check: (s) => s.drillAttempts.some((a) => a.succeeded && a.timeMs < 5000),
  },
  {
    id: 'curious-cat',
    title: 'Curious Cat',
    description: 'Use 10+ different commands in sandbox mode.',
    category: 'exploration',
    icon: '🐱',
    check: (s) => Object.keys(s.sandboxCommandsUsed).length >= 10,
  },
  {
    id: 'never-give-up',
    title: 'Never Give Up',
    description: 'Fail 5 times on a drill and still complete it.',
    category: 'persistence',
    icon: '💪',
    check: (s) => s.drillAttempts.some((a) => a.succeeded && a.attempts > 5),
  },
  {
    id: 'first-try',
    title: 'First Try',
    description: 'Complete a boss challenge without wrong answers.',
    category: 'perfection',
    icon: '🎯',
    check: (s) => s.completedBosses.length >= 1,
  },
  {
    id: 'on-fire',
    title: 'On Fire',
    description: 'Maintain a 7-day practice streak.',
    category: 'streak',
    icon: '🔥',
    check: (s) => s.longestStreak >= 7,
  },
  {
    id: 'dedicated',
    title: 'Dedicated',
    description: 'Maintain a 30-day practice streak.',
    category: 'streak',
    icon: '💎',
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: 'recruit-complete',
    title: 'Recruit Graduate',
    description: 'Complete all Recruit tier modules.',
    category: 'completionist',
    icon: '🎓',
    check: (s) => s.completedModules.includes('cli-basics'),
  },
  {
    id: 'easter-egg',
    title: 'Nice Try',
    description: 'Try sudo rm -rf / in the sandbox.',
    category: 'secret',
    icon: '🥚',
    check: () => false, // Triggered manually
  },
];
