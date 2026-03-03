import { useGameStore } from '../../stores/gameStore';
import { ALL_MODULES } from '../../data/modules';
import { ACHIEVEMENTS } from '../../data/achievements';

export function Stats() {
  const {
    totalXP, completedModules, completedDrills, completedBosses,
    unlockedAchievements, drillAttempts, sandboxCommandsUsed,
    currentStreak, longestStreak, totalPlayTimeMs,
  } = useGameStore();

  const totalDrills = ALL_MODULES.reduce((acc, m) => acc + m.drills.length, 0);
  const successfulAttempts = drillAttempts.filter((a) => a.succeeded);
  const firstTryCount = successfulAttempts.filter((a) => a.attempts === 1 && !a.usedHint).length;
  const accuracy = successfulAttempts.length > 0
    ? Math.round((firstTryCount / successfulAttempts.length) * 100)
    : 0;

  const sortedCommands = Object.entries(sandboxCommandsUsed)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const formatTime = (ms: number) => {
    const mins = Math.floor(ms / 60000);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) return `${hrs}h ${mins % 60}m`;
    return `${mins}m`;
  };

  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <div className="text-sm text-slate-500 mb-6 font-semibold tracking-wider">YOUR STATS</div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {[
          { label: 'Total XP', value: totalXP.toLocaleString(), color: 'text-amber-400' },
          { label: 'Modules', value: `${completedModules.length}/${ALL_MODULES.length}`, color: 'text-cyan-400' },
          { label: 'Drills', value: `${completedDrills.length}/${totalDrills}`, color: 'text-green-400' },
          { label: 'Bosses', value: completedBosses.length.toString(), color: 'text-orange-400' },
          { label: 'Achievements', value: `${unlockedAchievements.length}/${ACHIEVEMENTS.length}`, color: 'text-purple-400' },
          { label: 'Accuracy', value: `${accuracy}%`, color: 'text-emerald-400' },
          { label: 'Current Streak', value: `${currentStreak}d`, color: 'text-red-400' },
          { label: 'Best Streak', value: `${longestStreak}d`, color: 'text-rose-400' },
          { label: 'Play Time', value: formatTime(totalPlayTimeMs), color: 'text-blue-400' },
        ].map((stat) => (
          <div key={stat.label} className="bg-slate-900/40 rounded-lg p-3 border border-slate-700/30">
            <div className={`text-lg font-bold ${stat.color}`}>{stat.value}</div>
            <div className="text-xs text-slate-500">{stat.label}</div>
          </div>
        ))}
      </div>

      {sortedCommands.length > 0 && (
        <div>
          <div className="text-xs text-slate-500 font-semibold mb-3">TOP SANDBOX COMMANDS</div>
          <div className="space-y-1">
            {sortedCommands.map(([cmd, count], i) => (
              <div key={cmd} className="flex items-center gap-3">
                <span className="text-xs text-slate-600 w-4">{i + 1}.</span>
                <code className="text-sm text-cyan-300">{cmd}</code>
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-cyan-500/30 rounded-full"
                    style={{ width: `${(count / sortedCommands[0][1]) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-slate-500">{count}x</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
