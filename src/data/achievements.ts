import type { Achievement } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-steps',
    title: 'Primeiros Passos',
    description: 'Complete seu primeiro exercício.',
    category: 'mastery',
    icon: '🐣',
    check: (s) => s.completedDrills.length >= 1,
  },
  {
    id: 'pipe-wizard',
    title: 'Mago dos Pipes',
    description: 'Complete todos os exercícios de pipes sem dicas.',
    category: 'mastery',
    icon: '🔮',
    check: (s) => {
      const pipeDrills = s.drillAttempts.filter((a) => a.moduleId === 'pipes-streams' && a.succeeded);
      return pipeDrills.length >= 3 && pipeDrills.every((a) => !a.usedHint);
    },
  },
  {
    id: 'speed-demon',
    title: 'Velocista',
    description: 'Complete um exercício em menos de 5 segundos.',
    category: 'speed',
    icon: '⚡',
    check: (s) => s.drillAttempts.some((a) => a.succeeded && a.timeMs < 5000),
  },
  {
    id: 'curious-cat',
    title: 'Gato Curioso',
    description: 'Use 10+ comandos diferentes no sandbox.',
    category: 'exploration',
    icon: '🐱',
    check: (s) => Object.keys(s.sandboxCommandsUsed).length >= 10,
  },
  {
    id: 'never-give-up',
    title: 'Nunca Desista',
    description: 'Erre 5 vezes num exercício e complete mesmo assim.',
    category: 'persistence',
    icon: '💪',
    check: (s) => s.drillAttempts.some((a) => a.succeeded && a.attempts > 5),
  },
  {
    id: 'first-try',
    title: 'De Primeira',
    description: 'Complete um desafio boss sem respostas erradas.',
    category: 'perfection',
    icon: '🎯',
    check: (s) => s.completedBosses.length >= 1,
  },
  {
    id: 'on-fire',
    title: 'Em Chamas',
    description: 'Mantenha uma sequência de 7 dias de prática.',
    category: 'streak',
    icon: '🔥',
    check: (s) => s.longestStreak >= 7,
  },
  {
    id: 'dedicated',
    title: 'Dedicado',
    description: 'Mantenha uma sequência de 30 dias de prática.',
    category: 'streak',
    icon: '💎',
    check: (s) => s.longestStreak >= 30,
  },
  {
    id: 'recruit-complete',
    title: 'Graduado Recruta',
    description: 'Complete todos os módulos do tier Recruta.',
    category: 'completionist',
    icon: '🎓',
    check: (s) => s.completedModules.includes('cli-basics'),
  },
  {
    id: 'easter-egg',
    title: 'Boa Tentativa',
    description: 'Digite sudo rm -rf / no sandbox.',
    category: 'secret',
    icon: '🥚',
    check: () => false, // Triggered manually
  },
];
