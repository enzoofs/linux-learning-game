import { create } from 'zustand';
import type { GameState, DrillAttempt, Tier, ModulePhase, AppView, ShopItem } from '../types';
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
  buyItem: (item: ShopItem) => boolean;
  equipItem: (slot: string, itemId: string) => void;
  unequipItem: (slot: string) => void;
  setTheme: (themeId: string | null) => void;
  usePowerUp: (powerUpId: string) => boolean;
  unlockSecretBook: () => void;
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
  // Shop & Avatar
  lifetimeXP: 0,
  spendableXP: 0,
  ownedItems: [],
  equippedItems: {},
  activeTheme: null,
  powerUps: {},
  secretBookUnlocked: false,
};

export const useGameStore = create<GameState & GameActions>()((set, get) => ({
  ...loadState(DEFAULT_STATE),

  addXP: (amount) =>
    set((s) => {
      const multiplier = get().getXpMultiplier();
      const gained = Math.round(amount * multiplier);
      return {
        totalXP: s.totalXP + gained,
        lifetimeXP: s.lifetimeXP + gained,
        spendableXP: s.spendableXP + gained,
      };
    }),

  completeDrill: (attempt) =>
    set((s) => {
      const MAX_STORED_ATTEMPTS = 500;
      const updatedAttempts = [...s.drillAttempts, attempt];
      return {
        completedDrills: s.completedDrills.includes(attempt.drillId)
          ? s.completedDrills
          : [...s.completedDrills, attempt.drillId],
        drillAttempts: updatedAttempts.length > MAX_STORED_ATTEMPTS
          ? updatedAttempts.slice(-MAX_STORED_ATTEMPTS)
          : updatedAttempts,
      };
    }),

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

  getCurrentTier: () => getCurrentTier(get().lifetimeXP || get().totalXP),

  getNextTier: () => getNextTier(get().lifetimeXP || get().totalXP),

  getXpMultiplier: () => {
    const STREAK_PLATINUM = 30;
    const STREAK_GOLD = 7;
    const streak = get().currentStreak;
    if (streak >= STREAK_PLATINUM) return 2.0;
    if (streak >= STREAK_GOLD) return 1.5;
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

  buyItem: (item) => {
    const state = get();
    if (state.spendableXP < item.price) return false;
    // Power-ups can be re-purchased; other items only once
    if (item.category !== 'powerup' && state.ownedItems.includes(item.id)) return false;

    if (item.category === 'powerup' && item.powerUpId) {
      set((s) => ({
        spendableXP: s.spendableXP - item.price,
        powerUps: {
          ...s.powerUps,
          [item.powerUpId!]: (s.powerUps[item.powerUpId!] || 0) + (item.powerUpAmount || 1),
        },
      }));
    } else {
      set((s) => ({
        spendableXP: s.spendableXP - item.price,
        ownedItems: [...s.ownedItems, item.id],
      }));
    }
    return true;
  },

  equipItem: (slot, itemId) =>
    set((s) => ({
      equippedItems: { ...s.equippedItems, [slot]: itemId },
    })),

  unequipItem: (slot) =>
    set((s) => {
      const { [slot]: _, ...rest } = s.equippedItems;
      return { equippedItems: rest };
    }),

  setTheme: (themeId) =>
    set({ activeTheme: themeId }),

  usePowerUp: (powerUpId) => {
    const state = get();
    if (!state.powerUps[powerUpId] || state.powerUps[powerUpId] <= 0) return false;
    set((s) => ({
      powerUps: {
        ...s.powerUps,
        [powerUpId]: s.powerUps[powerUpId] - 1,
      },
    }));
    return true;
  },

  unlockSecretBook: () => set({ secretBookUnlocked: true }),

  reset: () => {
    clearState();
    set(DEFAULT_STATE);
  },
}));

// Migration: backfill lifetimeXP/spendableXP from totalXP for existing saves
const initialState = useGameStore.getState();
if (initialState.lifetimeXP === 0 && initialState.totalXP > 0) {
  useGameStore.setState({
    lifetimeXP: initialState.totalXP,
    spendableXP: initialState.totalXP,
  });
}

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
      buyItem,
      equipItem,
      unequipItem,
      setTheme,
      usePowerUp,
      reset,
      ...data
    } = state;
    saveState(data);
  }, 500);
});
