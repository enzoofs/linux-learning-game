import type { ReactNode } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { PixelAvatar } from '../Avatar/PixelAvatar';
import type { AppView } from '../../types';

interface LayoutProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  children: ReactNode;
}

const NAV_TABS: { id: AppView; label: string }[] = [
  { id: 'terminal', label: '> Terminal' },
  { id: 'map', label: 'Árvore de Skills' },
  { id: 'shop', label: 'Loja' },
  { id: 'journal', label: 'Diário' },
  { id: 'achievements', label: 'Conquistas' },
  { id: 'stats', label: 'Estatísticas' },
];

export function Layout({ currentView, onViewChange, children }: LayoutProps) {
  const { totalXP, lifetimeXP, spendableXP, getCurrentTier, getNextTier, currentStreak } = useGameStore();
  const tier = getCurrentTier();
  const nextTier = getNextTier();
  const xp = lifetimeXP || totalXP;
  const progressToNext = nextTier
    ? ((xp - tier.minXP) / (nextTier.minXP - tier.minXP)) * 100
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
              APRENDA LINUX COMO UM JOGO
            </div>
          </div>
          <div className="flex items-center gap-4">
            {currentStreak > 0 && (
              <div className="text-sm text-orange-400 font-semibold">
                🔥 {currentStreak}d seguidos
              </div>
            )}
            <div className="text-right">
              <div className="flex items-center gap-1.5">
                <span className="text-lg">{tier.icon}</span>
                <span className="font-bold text-sm" style={{ color: tier.color }}>
                  {tier.displayName}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <PixelAvatar size={32} />
                <div>
                  <div className="text-amber-400 text-sm font-semibold">{lifetimeXP || totalXP} XP</div>
                  <div className="text-[10px] text-slate-500">{spendableXP ?? totalXP} disponível</div>
                </div>
              </div>
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
          <span className="text-[10px] text-slate-600">{tier.displayName}</span>
          <span className="text-[10px] text-slate-600">
            {nextTier ? `${nextTier.displayName} (${nextTier.minXP} XP)` : 'RANK MÁXIMO'}
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
