import type { Briefing as BriefingData } from '../../types';

interface BriefingProps {
  title: string;
  briefing: BriefingData;
  /** Standard mode: show mode selection buttons */
  onStartTraining?: () => void;
  onStartChallenge?: () => void;
  /** Overlay mode: show a "back" button */
  isOverlay?: boolean;
  onClose?: () => void;
  /** Legacy single-button mode (fallback) */
  onContinue?: () => void;
}

export function Briefing({ title, briefing, onStartTraining, onStartChallenge, isOverlay, onClose, onContinue }: BriefingProps) {
  return (
    <div className={`p-6 ${isOverlay ? 'max-h-[60vh]' : 'max-h-[70vh]'} overflow-y-auto`}>
      <div className="text-lg font-bold text-cyan-400 mb-1 tracking-wide">
        📖 EXPLICAÇÃO: {title.toUpperCase()}
      </div>
      <div className="w-16 h-0.5 bg-cyan-400/30 mb-6" />

      <div className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
        {briefing.concept}
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="text-xs text-amber-400 font-semibold mb-1.5">💡 PENSE ASSIM</div>
        <div className="text-slate-300 text-sm">{briefing.analogy}</div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-slate-500 font-semibold mb-2">SINTAXE</div>
        <pre className="bg-[#0f172a] rounded-lg p-3 text-green-400 text-sm font-mono overflow-x-auto">
          {briefing.syntax}
        </pre>
      </div>

      <div className="mb-6">
        <div className="text-xs text-slate-500 font-semibold mb-3">EXEMPLOS</div>
        <div className="space-y-3">
          {briefing.examples.map((ex, i) => (
            <div key={i} className="bg-[#0f172a] rounded-lg p-3 border border-slate-700/50">
              <div className="flex items-start gap-2">
                <span className="text-green-400 text-sm">❯</span>
                <code className="text-cyan-300 text-sm">{ex.command}</code>
              </div>
              {ex.output && (
                <pre className="text-gray-400 text-xs mt-1 ml-5 whitespace-pre-wrap">{ex.output}</pre>
              )}
              <div className="text-slate-500 text-xs mt-2 ml-5 italic">{ex.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Overlay mode: back button */}
      {isOverlay && onClose && (
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-600 rounded-lg text-slate-300 font-semibold text-sm transition-all cursor-pointer"
        >
          Voltar ao exercício
        </button>
      )}

      {/* Mode selection buttons */}
      {!isOverlay && onStartTraining && onStartChallenge && (
        <div className="space-y-3">
          <button
            onClick={onStartTraining}
            className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
          >
            Modo Treino — com instruções disponíveis
          </button>
          <button
            onClick={onStartChallenge}
            className="w-full py-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg text-amber-400 font-semibold text-sm transition-all cursor-pointer"
          >
            Modo Desafio — sem instruções, libera próximo módulo
          </button>
          <p className="text-[11px] text-slate-500 text-center">
            No Modo Treino você pode digitar 'brief' a qualquer momento para consultar as instruções.
            No Modo Desafio, as instruções ficam bloqueadas mas completar desbloqueia o próximo módulo.
          </p>
        </div>
      )}

      {/* Legacy single button fallback */}
      {!isOverlay && !onStartTraining && onContinue && (
        <button
          onClick={onContinue}
          className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
        >
          Entendi! Quero tentar →
        </button>
      )}
    </div>
  );
}
