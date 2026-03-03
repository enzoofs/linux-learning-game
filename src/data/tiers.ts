import type { Tier } from '../types';

export const TIERS: Tier[] = [
  { name: 'Recruit', displayName: 'Recruta', color: '#6ee7b7', icon: '🔰', minXP: 0 },
  { name: 'Operator', displayName: 'Operador', color: '#60a5fa', icon: '⚡', minXP: 400 },
  { name: 'Specialist', displayName: 'Especialista', color: '#c084fc', icon: '🎯', minXP: 900 },
  { name: 'Commander', displayName: 'Comandante', color: '#f97316', icon: '🏆', minXP: 1600 },
];

export function getCurrentTier(xp: number): Tier {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    if (xp >= TIERS[i].minXP) return TIERS[i];
  }
  return TIERS[0];
}

export function getNextTier(xp: number): Tier | null {
  for (const tier of TIERS) {
    if (xp < tier.minXP) return tier;
  }
  return null;
}
