import { useGameStore } from '../../stores/gameStore';
import { ACHIEVEMENTS } from '../../data/achievements';
import type { AchievementCategory } from '../../types';

const CATEGORY_LABELS: Record<AchievementCategory, string> = {
  mastery: '🏅 Mastery',
  speed: '⚡ Speed',
  exploration: '🔍 Exploration',
  persistence: '💪 Persistence',
  perfection: '🎯 Perfection',
  secret: '🥚 Secret',
  streak: '🔥 Streak',
  completionist: '📦 Completionist',
};

export function Achievements() {
  const { unlockedAchievements } = useGameStore();
  const categories = [...new Set(ACHIEVEMENTS.map((a) => a.category))];

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <div className="text-sm text-slate-500 mb-1 font-semibold tracking-wider">ACHIEVEMENTS</div>
      <div className="text-xs text-slate-600 mb-6">
        {unlockedAchievements.length} / {ACHIEVEMENTS.length} unlocked
      </div>

      {categories.map((cat) => {
        const catAchievements = ACHIEVEMENTS.filter((a) => a.category === cat);
        return (
          <div key={cat} className="mb-6">
            <div className="text-xs text-slate-400 font-semibold mb-3">{CATEGORY_LABELS[cat]}</div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {catAchievements.map((ach) => {
                const unlocked = unlockedAchievements.includes(ach.id);
                return (
                  <div
                    key={ach.id}
                    className={`rounded-lg p-3 border transition-all ${
                      unlocked
                        ? 'bg-green-500/5 border-green-500/20'
                        : 'bg-slate-900/30 border-slate-700/30 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{unlocked ? ach.icon : '❓'}</span>
                      <div>
                        <div className={`text-sm font-semibold ${unlocked ? 'text-gray-200' : 'text-slate-500'}`}>
                          {unlocked ? ach.title : '???'}
                        </div>
                        <div className="text-xs text-slate-500">{ach.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
