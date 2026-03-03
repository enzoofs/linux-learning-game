import { ReactNode } from 'react';
import { useGameStore } from '../../stores/gameStore';

type View = 'terminal' | 'map' | 'journal' | 'achievements' | 'stats';

interface LayoutProps {
  currentView: View;
  onViewChange: (view: View) => void;
  children: ReactNode;
}

const NAV_TABS: { id: View; label: string }[] = [
  { id: 'terminal', label: '> Terminal' },
  { id: 'map', label: 'Skill Tree' },
  { id: 'journal', label: 'Journal' },
  { id: 'achievements', label: 'Achievements' },
  { id: 'stats', label: 'Stats' },
];

export function Layout({ currentView, onViewChange, children }: LayoutProps) {
  const { totalXP, getCurrentTier, getNextTier, currentStreak } = useGameStore();
  const tier = getCurrentTier();
  const nextTier = getNextTier();
  const progressToNext = nextTier
    ? ((totalXP - tier.minXP) / (nextTier.minXP - tier.minXP)) * 100
    : 100;

  return (
    <div className="min-h-screen bg-[#0c0f1a] font-mono text-gray-200 p-5 flex flex-col items-center"
      style={{
        backgroundImage: `
          radial-gradient(ellipse at 20% 50%, rgba(139,92,246,0.06) 0%, transparent 50%),
          radial-gradient(ellipse at 80% 20%, rgba(34,211,238,0.04) 0%, transparent 50%)
        `,
      }}
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-xl font-extrabold tracking-widest bg-gradient-to-r from-cyan-400 via-purple-400 to-orange-500 bg-clip-text text-transparent">
              ART OF CLI QUEST
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5 tracking-wider">
              LEARN LINUX LIKE A GAME
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentStreak > 0 && (
              <div className="text-sm text-orange-400 font-semibold">
                🔥 {currentStreak}d streak
              </div>
            )}
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{tier.icon}</span>
                <span className="font-bold text-sm" style={{ color: tier.color }}>
                  {tier.name}
                </span>
              </div>
              <div className="text-amber-400 text-sm font-semibold">{totalXP} XP</div>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-3 bg-slate-800 rounded-md h-2 overflow-hidden relative">
          <div
            className="h-full rounded-md transition-all duration-700 ease-out"
            style={{
              width: `${progressToNext}%`,
              background: `linear-gradient(90deg, ${tier.color}, ${nextTier?.color || tier.color})`,
              boxShadow: `0 0 12px ${tier.color}40`,
            }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[10px] text-slate-600">{tier.name}</span>
          <span className="text-[10px] text-slate-600">
            {nextTier ? `${nextTier.name} (${nextTier.minXP} XP)` : 'MAX RANK'}
          </span>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-1 mt-4">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onViewChange(tab.id)}
              className={`px-4 py-2 rounded-t-lg text-xs font-semibold transition-all cursor-pointer border ${
                currentView === tab.id
                  ? 'bg-slate-800 border-slate-700 border-b-slate-800 text-gray-200'
                  : 'bg-transparent border-transparent border-b-slate-700 text-slate-500 hover:text-slate-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Panel */}
      <div className="w-full max-w-4xl bg-slate-800 border border-slate-700 rounded-b-xl rounded-tr-lg overflow-hidden shadow-2xl">
        {children}
      </div>
    </div>
  );
}
