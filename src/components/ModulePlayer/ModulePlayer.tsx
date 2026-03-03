import { useState, useCallback, useEffect } from 'react';
import type { Module, ModulePhase } from '../../types';
import { Terminal } from '../Terminal/Terminal';
import { Briefing } from '../Briefing/Briefing';
import { useTerminal } from '../../hooks/useTerminal';
import { useGameStore } from '../../stores/gameStore';
import { analyzeCommand } from '../../utils/commandParser';

interface ModulePlayerProps {
  module: Module;
  onModuleComplete: () => void;
}

export function ModulePlayer({ module, onModuleComplete }: ModulePlayerProps) {
  const [phase, setPhase] = useState<ModulePhase>('briefing');
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [currentBossStep, setCurrentBossStep] = useState(0);
  const [drillStartTime, setDrillStartTime] = useState(0);
  const [drillAttempts, setDrillAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);

  const terminal = useTerminal();
  const { addXP, completeDrill, completeModule, completeBoss, trackSandboxCommand, addFreezeToken } = useGameStore();

  const currentDrill = module.drills[currentDrillIndex];
  const currentBoss = module.boss.steps[currentBossStep];

  // Initialize phase messages
  useEffect(() => {
    if (phase === 'sandbox') {
      terminal.resetWithLines([
        { type: 'system', text: '═══ SANDBOX MODE ═══' },
        { type: 'brief', text: 'Experiment freely! Type any commands related to this topic. No right or wrong answers here.' },
        { type: 'hint', text: "Type 'done' when you're ready for the challenges, or 'brief' to review the briefing." },
      ]);
    } else if (phase === 'drill' && currentDrill) {
      setDrillStartTime(Date.now());
      setDrillAttempts(0);
      setUsedHint(false);
      terminal.resetWithLines([
        { type: 'system', text: `═══ DRILL ${currentDrillIndex + 1}/${module.drills.length}: ${currentDrill.difficulty.toUpperCase()} ═══` },
        { type: 'brief', text: currentDrill.prompt },
      ]);
    } else if (phase === 'boss') {
      terminal.resetWithLines([
        { type: 'system', text: `═══ BOSS CHALLENGE: ${module.boss.title.toUpperCase()} ═══` },
        { type: 'brief', text: module.boss.scenario },
        { type: 'system', text: '' },
        { type: 'brief', text: currentBoss?.prompt || '' },
      ]);
    }
  }, [phase, currentDrillIndex, currentBossStep]);

  const handleSandboxSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'done') {
      setPhase('drill');
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'brief') {
      setPhase('briefing');
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'help') {
      terminal.addLine({ type: 'system', text: "Commands: done (start drills), brief (review briefing), help, clear" });
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'clear') {
      terminal.resetWithLines([
        { type: 'system', text: '═══ SANDBOX MODE ═══' },
        { type: 'hint', text: "Type 'done' when ready for challenges." },
      ]);
      terminal.setInputValue('');
      return;
    }

    // Check sandbox commands
    const baseCmd = cmd.split(/\s+/)[0];
    trackSandboxCommand(baseCmd);

    let matched = false;
    for (const sandboxCmd of module.sandbox.commands) {
      if (sandboxCmd.pattern.test(cmd)) {
        const output = sandboxCmd.output;
        if (output) {
          terminal.addLine({ type: 'output', text: output });
        }
        matched = true;
        break;
      }
    }

    if (!matched) {
      terminal.addLine({ type: 'system', text: `${cmd}: command simulated — try commands related to this module's topic!` });
    }

    terminal.setInputValue('');
  }, [terminal, module.sandbox.commands, trackSandboxCommand]);

  const handleDrillSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'hint') {
      setUsedHint(true);
      const hintIndex = Math.min(drillAttempts, currentDrill.hints.length - 1);
      terminal.addLine({ type: 'hint', text: `Hint: ${currentDrill.hints[hintIndex]}` });
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'help') {
      terminal.addLine({ type: 'system', text: "Commands: hint (get a clue), skip (skip this drill), help" });
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'skip') {
      const next = currentDrillIndex + 1;
      if (next < module.drills.length) {
        setCurrentDrillIndex(next);
      } else {
        setPhase('boss');
      }
      terminal.setInputValue('');
      return;
    }

    setDrillAttempts((a) => a + 1);
    const result = analyzeCommand(cmd, currentDrill.check, currentDrill.feedbackRules);

    if (result.type === 'success') {
      if (currentDrill.expectedOutput) {
        terminal.addLine({ type: 'output', text: currentDrill.expectedOutput });
      }
      terminal.addLine({ type: 'success', text: `CORRECT! +${currentDrill.xp} XP` });

      addXP(currentDrill.xp);
      completeDrill({
        drillId: currentDrill.id,
        moduleId: module.id,
        succeeded: true,
        usedHint,
        attempts: drillAttempts + 1,
        timeMs: Date.now() - drillStartTime,
        timestamp: Date.now(),
      });

      if (!usedHint && drillAttempts === 0) {
        terminal.addLine({ type: 'levelup', text: 'FIRST TRY BONUS! +25 XP' });
        addXP(25);
      }

      // Move to next drill or boss
      setTimeout(() => {
        const next = currentDrillIndex + 1;
        if (next < module.drills.length) {
          setCurrentDrillIndex(next);
        } else {
          setPhase('boss');
        }
      }, 1500);
    } else if (result.type === 'feedback') {
      terminal.addLine({ type: 'feedback', text: result.message });
    } else if (result.type === 'typo') {
      terminal.addLine({ type: 'feedback', text: result.message });
    } else {
      terminal.addLine({ type: 'error', text: result.message });
    }

    terminal.setInputValue('');
  }, [terminal, currentDrill, currentDrillIndex, drillAttempts, drillStartTime, usedHint, module, addXP, completeDrill]);

  const handleBossSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd || !currentBoss) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'hint') {
      const hintIndex = 0;
      terminal.addLine({ type: 'hint', text: `Hint: ${currentBoss.hints[hintIndex]}` });
      terminal.setInputValue('');
      return;
    }

    const result = analyzeCommand(cmd, currentBoss.check, currentBoss.feedbackRules);

    if (result.type === 'success') {
      if (currentBoss.expectedOutput) {
        terminal.addLine({ type: 'output', text: currentBoss.expectedOutput });
      }
      terminal.addLine({ type: 'success', text: 'Step complete!' });

      const nextStep = currentBossStep + 1;
      if (nextStep < module.boss.steps.length) {
        setCurrentBossStep(nextStep);
        setTimeout(() => {
          terminal.addLine({ type: 'system', text: '' });
          terminal.addLine({ type: 'brief', text: module.boss.steps[nextStep].prompt });
        }, 1000);
      } else {
        // Boss complete!
        addXP(module.boss.xpReward);
        completeBoss(module.id);
        completeModule(module.id);
        addFreezeToken();
        terminal.addLine({ type: 'system', text: '' });
        terminal.addLine({ type: 'levelup', text: `BOSS DEFEATED: ${module.boss.title}! +${module.boss.xpReward} XP` });
        terminal.addLine({ type: 'success', text: 'Earned 1 Streak Freeze Token!' });
        terminal.addLine({ type: 'levelup', text: `MODULE COMPLETE: ${module.title}` });

        setTimeout(() => {
          setPhase('completed');
          onModuleComplete();
        }, 3000);
      }
    } else if (result.type === 'feedback') {
      terminal.addLine({ type: 'feedback', text: result.message });
    } else {
      terminal.addLine({ type: 'error', text: result.message });
    }

    terminal.setInputValue('');
  }, [terminal, currentBoss, currentBossStep, module, addXP, completeBoss, completeModule, addFreezeToken, onModuleComplete]);

  const handleSubmit = useCallback(() => {
    if (phase === 'sandbox') handleSandboxSubmit();
    else if (phase === 'drill') handleDrillSubmit();
    else if (phase === 'boss') handleBossSubmit();
  }, [phase, handleSandboxSubmit, handleDrillSubmit, handleBossSubmit]);

  const phaseLabels: Record<ModulePhase, string> = {
    briefing: 'Briefing',
    sandbox: 'Sandbox',
    drill: `Drill ${currentDrillIndex + 1}/${module.drills.length}`,
    boss: 'Boss Challenge',
    completed: 'Completed',
  };

  return (
    <div>
      <div className="bg-[#0f172a] px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <span className="text-sm text-slate-400 font-semibold">{module.title}</span>
        <span className="text-xs text-cyan-400">{phaseLabels[phase]}</span>
      </div>

      {phase === 'briefing' && (
        <Briefing
          title={module.title}
          briefing={module.briefing}
          onContinue={() => setPhase('sandbox')}
        />
      )}

      {(phase === 'sandbox' || phase === 'drill' || phase === 'boss') && (
        <Terminal
          lines={terminal.lines}
          inputValue={terminal.inputValue}
          onInputChange={terminal.setInputValue}
          onSubmit={handleSubmit}
          inputRef={terminal.inputRef}
          endRef={terminal.endRef}
          prompt={`enzo@linux ~/${module.id} $`}
          placeholder={
            phase === 'sandbox' ? "experiment freely... ('done' to continue)"
            : phase === 'boss' ? "solve the challenge... ('hint' for help)"
            : "type your answer... ('hint' for help)"
          }
        />
      )}

      {phase === 'completed' && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-4">&#127881;</div>
          <div className="text-xl font-bold text-green-400 mb-2">Module Complete!</div>
          <div className="text-slate-400 text-sm mb-6">{module.title} — all drills and boss defeated.</div>
          <button
            onClick={onModuleComplete}
            className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
          >
            Continue to Skill Tree
          </button>
        </div>
      )}
    </div>
  );
}
