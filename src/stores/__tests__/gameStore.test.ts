import { describe, it, expect, beforeEach } from 'vitest';
import { useGameStore } from '../gameStore';

describe('gameStore', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('starts with 0 XP and empty progress', () => {
    const state = useGameStore.getState();
    expect(state.totalXP).toBe(0);
    expect(state.completedModules).toEqual([]);
    expect(state.completedDrills).toEqual([]);
    expect(state.currentStreak).toBe(0);
  });

  it('adds XP correctly', () => {
    useGameStore.getState().addXP(100);
    expect(useGameStore.getState().totalXP).toBe(100);
    useGameStore.getState().addXP(50);
    expect(useGameStore.getState().totalXP).toBe(150);
  });

  it('completes a drill and records the attempt', () => {
    useGameStore.getState().completeDrill({
      drillId: 'basics-drill-1',
      moduleId: 'cli-basics',
      succeeded: true,
      usedHint: false,
      attempts: 1,
      timeMs: 3000,
      timestamp: Date.now(),
    });
    expect(useGameStore.getState().completedDrills).toContain('basics-drill-1');
    expect(useGameStore.getState().drillAttempts).toHaveLength(1);
  });

  it('completes a module', () => {
    useGameStore.getState().completeModule('cli-basics');
    expect(useGameStore.getState().completedModules).toContain('cli-basics');
  });

  it('does not duplicate completed modules', () => {
    useGameStore.getState().completeModule('cli-basics');
    useGameStore.getState().completeModule('cli-basics');
    expect(useGameStore.getState().completedModules).toEqual(['cli-basics']);
  });

  it('unlocks an achievement', () => {
    useGameStore.getState().unlockAchievement('first-try');
    expect(useGameStore.getState().unlockedAchievements).toContain('first-try');
  });

  it('tracks sandbox commands', () => {
    useGameStore.getState().trackSandboxCommand('ls');
    useGameStore.getState().trackSandboxCommand('ls');
    useGameStore.getState().trackSandboxCommand('pwd');
    expect(useGameStore.getState().sandboxCommandsUsed).toEqual({ ls: 2, pwd: 1 });
  });

  it('calculates current tier from XP', () => {
    expect(useGameStore.getState().getCurrentTier().name).toBe('Recruit');
    useGameStore.getState().addXP(400);
    expect(useGameStore.getState().getCurrentTier().name).toBe('Operator');
    useGameStore.getState().addXP(500);
    expect(useGameStore.getState().getCurrentTier().name).toBe('Specialist');
  });

  it('checks if a module is unlocked based on prerequisites', () => {
    expect(useGameStore.getState().isModuleUnlocked('cli-basics', [])).toBe(true);
    expect(useGameStore.getState().isModuleUnlocked('files-nav', ['cli-basics'])).toBe(false);
    useGameStore.getState().completeModule('cli-basics');
    expect(useGameStore.getState().isModuleUnlocked('files-nav', ['cli-basics'])).toBe(true);
  });

  it('updates streak correctly', () => {
    useGameStore.getState().updateStreak('2026-03-01');
    expect(useGameStore.getState().currentStreak).toBe(1);
    useGameStore.getState().updateStreak('2026-03-02');
    expect(useGameStore.getState().currentStreak).toBe(2);
    useGameStore.getState().updateStreak('2026-03-04');
    expect(useGameStore.getState().currentStreak).toBe(1);
  });

  it('uses freeze token to protect streak', () => {
    useGameStore.getState().addFreezeToken();
    useGameStore.getState().updateStreak('2026-03-01');
    useGameStore.getState().updateStreak('2026-03-02');
    expect(useGameStore.getState().currentStreak).toBe(2);
    useGameStore.getState().updateStreak('2026-03-04');
    expect(useGameStore.getState().currentStreak).toBe(3);
    expect(useGameStore.getState().freezeTokens).toBe(0);
  });

  // Session persistence tests

  it('starts with null/default session fields', () => {
    const state = useGameStore.getState();
    expect(state.currentModuleId).toBeNull();
    expect(state.currentPhase).toBeNull();
    expect(state.currentDrillIndex).toBe(0);
    expect(state.currentBossStep).toBe(0);
    expect(state.currentView).toBe('terminal');
  });

  it('setSession updates module, phase, drill index and boss step', () => {
    useGameStore.getState().setSession('cli-basics', 'drill', 2, 0);
    const state = useGameStore.getState();
    expect(state.currentModuleId).toBe('cli-basics');
    expect(state.currentPhase).toBe('drill');
    expect(state.currentDrillIndex).toBe(2);
    expect(state.currentBossStep).toBe(0);
  });

  it('setCurrentView updates the current view', () => {
    useGameStore.getState().setCurrentView('map');
    expect(useGameStore.getState().currentView).toBe('map');
    useGameStore.getState().setCurrentView('achievements');
    expect(useGameStore.getState().currentView).toBe('achievements');
  });

  it('clearSession resets session fields to defaults', () => {
    useGameStore.getState().setSession('cli-basics', 'boss', 3, 1);
    useGameStore.getState().setCurrentView('map');
    useGameStore.getState().clearSession();
    const state = useGameStore.getState();
    expect(state.currentModuleId).toBeNull();
    expect(state.currentPhase).toBeNull();
    expect(state.currentDrillIndex).toBe(0);
    expect(state.currentBossStep).toBe(0);
    expect(state.currentView).toBe('terminal');
  });

  it('clearSession does not affect game progress', () => {
    useGameStore.getState().addXP(100);
    useGameStore.getState().completeModule('cli-basics');
    useGameStore.getState().setSession('cli-basics', 'drill', 1, 0);
    useGameStore.getState().clearSession();
    const state = useGameStore.getState();
    expect(state.totalXP).toBe(100);
    expect(state.completedModules).toContain('cli-basics');
  });

  it('reset also clears session fields', () => {
    useGameStore.getState().setSession('cli-basics', 'boss', 2, 1);
    useGameStore.getState().setCurrentView('stats');
    useGameStore.getState().reset();
    const state = useGameStore.getState();
    expect(state.currentModuleId).toBeNull();
    expect(state.currentPhase).toBeNull();
    expect(state.currentDrillIndex).toBe(0);
    expect(state.currentBossStep).toBe(0);
    expect(state.currentView).toBe('terminal');
  });
});
