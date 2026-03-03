import { Briefing as BriefingData } from '../../types';

interface BriefingProps {
  title: string;
  briefing: BriefingData;
  onContinue: () => void;
}

export function Briefing({ title, briefing, onContinue }: BriefingProps) {
  return (
    <div className="p-6 max-h-[70vh] overflow-y-auto">
      <div className="text-lg font-bold text-cyan-400 mb-1 tracking-wide">
        📖 BRIEFING: {title.toUpperCase()}
      </div>
      <div className="w-16 h-0.5 bg-cyan-400/30 mb-6" />

      <div className="text-gray-300 text-sm leading-relaxed mb-6 whitespace-pre-line">
        {briefing.concept}
      </div>

      <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4 mb-6">
        <div className="text-xs text-amber-400 font-semibold mb-1.5">💡 THINK OF IT THIS WAY</div>
        <div className="text-slate-300 text-sm">{briefing.analogy}</div>
      </div>

      <div className="mb-6">
        <div className="text-xs text-slate-500 font-semibold mb-2">SYNTAX</div>
        <pre className="bg-[#0f172a] rounded-lg p-3 text-green-400 text-sm font-mono overflow-x-auto">
          {briefing.syntax}
        </pre>
      </div>

      <div className="mb-6">
        <div className="text-xs text-slate-500 font-semibold mb-3">EXAMPLES</div>
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

      <button
        onClick={onContinue}
        className="w-full py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
      >
        Got it! Let me try →
      </button>
    </div>
  );
}
