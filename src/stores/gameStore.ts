import { create } from 'zustand';
import type { GameState, DrillAttempt, Tier, ModulePhase, AppView } from '../types';
import { getCurrentTier, getNextTier } from '../data/tiers';
import { saveState, loadState, clearState } from '../utils/persistence';

interface GameActions {
  addXP: (amount: number) => void;
  completeDrill: (attempt: DrillAttempt) => void;
  completeModule: (moduleId: string) => void;
  completeBoss: (moduleId: string) => void;
  unlockAchievement: (achievementId: string) => void;
  trackSandboxCommand: (command: string) => void;
  updateStreak: (todayDate: string) => void;
  addFreezeToken: () => void;
  addPlayTime: (ms: number) => void;
  isModuleUnlocked: (moduleId: string, prerequisites: string[]) => boolean;
  getCurrentTier: () => Tier;
  getNextTier: () => Tier | null;
  getXpMultiplier: () => number;
  setSession: (moduleId: string, phase: ModulePhase, drillIndex: number, bossStep: number) => void;
  setCurrentView: (view: AppView) => void;
  clearSession: () => void;
  reset: () => void;
}

const DEFAULT_STATE: GameState = {
  totalXP: 0,
  completedModules: [],
  completedDrills: [],
  completedBosses: [],
  unlockedAchievements: [],
  drillAttempts: [],
  sandboxCommandsUsed: {},
  currentStreak: 0,
  longestStreak: 0,
  lastPlayDate: null,
  freezeTokens: 0,
  totalPlayTimeMs: 0,
  // Session persistence
  currentModuleId: null,
  currentPhase: null,
  currentDrillIndex: 0,
  currentBossStep: 0,
  currentView: 'terminal',
};

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  ...loadState(DEFAULT_STATE),

  addXP: (amount) =>
    set((s) => {
      const multiplier = get().getXpMultiplier();
      return { totalXP: s.totalXP + Math.round(amount * multiplier) };
    }),

  completeDrill: (attempt) =>
    set((s) => ({
      completedDrills: s.completedDrills.includes(attempt.drillId)
        ? s.completedDrills
        : [...s.completedDrills, attempt.drillId],
      drillAttempts: [...s.drillAttempts, attempt],
    })),

  completeModule: (moduleId) =>
    set((s) => ({
      completedModules: s.completedModules.includes(moduleId)
        ? s.completedModules
        : [...s.completedModules, moduleId],
    })),

  completeBoss: (moduleId) =>
    set((s) => ({
      completedBosses: s.completedBosses.includes(moduleId)
        ? s.completedBosses
        : [...s.completedBosses, moduleId],
    })),

  unlockAchievement: (achievementId) =>
    set((s) => ({
      unlockedAchievements: s.unlockedAchievements.includes(achievementId)
        ? s.unlockedAchievements
        : [...s.unlockedAchievements, achievementId],
    })),

  trackSandboxCommand: (command) =>
    set((s) => ({
      sandboxCommandsUsed: {
        ...s.sandboxCommandsUsed,
        [command]: (s.sandboxCommandsUsed[command] || 0) + 1,
      },
    })),

  updateStreak: (todayDate) =>
    set((s) => {
      if (s.lastPlayDate === todayDate) return {};

      const lastDate = s.lastPlayDate ? new Date(s.lastPlayDate) : null;
      const today = new Date(todayDate);

      if (!lastDate) {
        return {
          currentStreak: 1,
          longestStreak: Math.max(1, s.longestStreak),
          lastPlayDate: todayDate,
        };
      }

      const diffDays = Math.floor(
        (today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (diffDays === 1) {
        const newStreak = s.currentStreak + 1;
        return {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, s.longestStreak),
          lastPlayDate: todayDate,
        };
      } else if (diffDays === 2 && s.freezeTokens > 0) {
        const newStreak = s.currentStreak + 1;
        return {
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, s.longestStreak),
          freezeTokens: s.freezeTokens - 1,
          lastPlayDate: todayDate,
        };
      } else {
        return { currentStreak: 1, lastPlayDate: todayDate };
      }
    }),

  addFreezeToken: () =>
    set((s) => ({ freezeTokens: s.freezeTokens + 1 })),

  addPlayTime: (ms) =>
    set((s) => ({ totalPlayTimeMs: s.totalPlayTimeMs + ms })),

  isModuleUnlocked: (_moduleId, prerequisites) => {
    const { completedModules } = get();
    return prerequisites.every((p) => completedModules.includes(p));
  },

  getCurrentTier: () => getCurrentTier(get().totalXP),

  getNextTier: () => getNextTier(get().totalXP),

  getXpMultiplier: () => {
    const streak = get().currentStreak;
    if (streak >= 30) return 2.0;
    if (streak >= 7) return 1.5;
    return 1.0;
  },

  setSession: (moduleId, phase, drillIndex, bossStep) =>
    set({
      currentModuleId: moduleId,
      currentPhase: phase,
      currentDrillIndex: drillIndex,
      currentBossStep: bossStep,
    }),

  setCurrentView: (view) =>
    set({ currentView: view }),

  clearSession: () =>
    set({
      currentModuleId: null,
      currentPhase: null,
      currentDrillIndex: 0,
      currentBossStep: 0,
      currentView: 'terminal',
    }),

  reset: () => {
    clearState();
    set(DEFAULT_STATE);
  },
}));

// Auto-save on state change (debounced)
let saveTimeout: ReturnType<typeof setTimeout>;
useGameStore.subscribe((state) => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    const {
      addXP,
      completeDrill,
      completeModule,
      completeBoss,
      unlockAchievement,
      trackSandboxCommand,
      updateStreak,
      addFreezeToken,
      addPlayTime,
      isModuleUnlocked,
      getCurrentTier,
      getNextTier,
      getXpMultiplier,
      setSession,
      setCurrentView,
      clearSession,
      reset,
      ...data
    } = state;
    saveState(data);
  }, 500);
});
