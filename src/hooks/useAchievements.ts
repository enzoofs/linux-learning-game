import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { ACHIEVEMENTS } from '../data/achievements';

export function useAchievementDetection() {
  const state = useGameStore();

  useEffect(() => {
    for (const achievement of ACHIEVEMENTS) {
      if (state.unlockedAchievements.includes(achievement.id)) continue;
      if (achievement.check(state)) {
        state.unlockAchievement(achievement.id);
      }
    }
  }, [state.completedDrills, state.completedModules, state.completedBosses, state.drillAttempts, state.sandboxCommandsUsed, state.longestStreak]);
}
