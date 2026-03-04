import { useEffect, useState } from 'react';
import type { TerminalLine, TerminalLineType } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { TERMINAL_THEMES } from '../../data/shopItems';

interface TerminalProps {
  lines: TerminalLine[];
  inputValue: string;
  onInputChange: (value: string) => void;
  onSubmit: () => void;
  inputRef: React.RefObject<HTMLInputElement | null>;
  endRef: React.RefObject<HTMLDivElement | null>;
  prompt?: string;
  placeholder?: string;
  disabled?: boolean;
}

const LINE_COLORS: Record<TerminalLineType, string> = {
  system: '#94a3b8',
  input: '#22d3ee',
  output: '#e2e8f0',
  success: '#4ade80',
  error: '#f87171',
  hint: '#fbbf24',
  brief: '#a78bfa',
  learned: '#67e8f9',
  levelup: '#f59e0b',
  feedback: '#fb923c',
};

export function Terminal({
  lines,
  inputValue,
  onInputChange,
  onSubmit,
  inputRef,
  endRef,
  prompt = 'enzo@linux ~ $',
  placeholder = "digite um comando... (tente 'help')",
  disabled = false,
}: TerminalProps) {
  const activeTheme = useGameStore((s) => s.activeTheme);
  const colors = activeTheme && TERMINAL_THEMES[activeTheme]
    ? TERMINAL_THEMES[activeTheme]
    : LINE_COLORS;

  const [shakeInput, setShakeInput] = useState(false);
  const [celebration, setCelebration] = useState(false);

  useEffect(() => {
    if (lines.length === 0) return;
    const lastLine = lines[lines.length - 1];
    if (lastLine.type === 'error' || lastLine.type === 'feedback') {
      setShakeInput(true);
      setTimeout(() => setShakeInput(false), 500);
    }
    if (lastLine.type === 'success' || lastLine.type === 'levelup') {
      setCelebration(true);
      setTimeout(() => setCelebration(false), 1500);
    }
  }, [lines]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines, endRef]);

  return (
    <div className="relative">
      {celebration && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(74,222,128,0.1) 0%, transparent 70%)',
            animation: 'fadeOut 1.5s forwards',
          }}
        />
      )}

      <div className="bg-[#0f172a] px-4 py-2 flex items-center gap-2 border-b border-slate-700">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="text-slate-500 text-xs ml-2">{prompt}</span>
      </div>

      <div
        className="p-4 min-h-[300px] max-h-[50vh] overflow-y-auto text-[13px] leading-7 cursor-text"
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            style={{ color: colors[line.type] }}
            className={`whitespace-pre-wrap break-words ${
              line.type === 'system' || line.type === 'levelup' ? 'font-bold' : ''
            } ${line.type === 'levelup' ? 'text-[15px]' : 'text-[13px]'} ${
              line.type === 'brief' ? 'py-1 pb-2' : 'py-px'
            }`}
          >
            {line.type === 'input' && <span className="text-green-400">❯ </span>}
            {line.text}
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <div
        className={`flex items-center px-4 py-3 border-t border-slate-700 bg-[#0f172a] ${
          shakeInput ? 'animate-shake' : ''
        }`}
      >
        <span className="text-green-400 mr-2 font-bold">❯</span>
        <input
          ref={inputRef}
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') onSubmit();
          }}
          placeholder={placeholder}
          autoFocus
          disabled={disabled}
          className="flex-1 bg-transparent border-none outline-none text-gray-200 font-mono text-sm placeholder:text-slate-600"
          style={{ caretColor: '#22d3ee' }}
        />
      </div>

      <style>{`
        @keyframes fadeOut {
          from { opacity: 1; } to { opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-shake { animation: shake 0.3s; }
      `}</style>
    </div>
  );
}
