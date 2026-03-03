import { useState, useCallback, useEffect, useRef } from 'react';
import type { Module, ModulePhase } from '../../types';
import { Terminal } from '../Terminal/Terminal';
import { Briefing } from '../Briefing/Briefing';
import { useTerminal } from '../../hooks/useTerminal';
import { useGameStore } from '../../stores/gameStore';
import { analyzeCommand } from '../../utils/commandParser';
import { getLearnedCommands } from '../../data/modules';
import { VirtualFS } from '../../utils/virtualFS';

const DIFFICULTY_LABELS: Record<string, string> = {
  easy: 'FÁCIL',
  medium: 'MÉDIO',
  hard: 'DIFÍCIL',
};

interface ModulePlayerProps {
  module: Module;
  onModuleComplete: () => void;
}

export function ModulePlayer({ module, onModuleComplete }: ModulePlayerProps) {
  const store = useGameStore();
  const {
    addXP, completeDrill, completeModule, completeBoss, trackSandboxCommand,
    addFreezeToken, setSession, clearSession,
  } = store;

  const [phase, setPhase] = useState<ModulePhase>(() => {
    const s = useGameStore.getState();
    return s.currentModuleId === module.id && s.currentPhase ? s.currentPhase : 'briefing';
  });
  const [currentDrillIndex, setCurrentDrillIndex] = useState(() => {
    const s = useGameStore.getState();
    if (s.currentModuleId !== module.id) return 0;
    return s.currentDrillIndex < module.drills.length ? s.currentDrillIndex : 0;
  });
  const [currentBossStep, setCurrentBossStep] = useState(() => {
    const s = useGameStore.getState();
    if (s.currentModuleId !== module.id) return 0;
    return s.currentBossStep < module.boss.steps.length ? s.currentBossStep : 0;
  });
  const [drillStartTime, setDrillStartTime] = useState(0);
  const [drillAttempts, setDrillAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);

  const terminal = useTerminal();

  // Virtual filesystem for sandbox/drill/boss modes
  const vfsRef = useRef(new VirtualFS(module.initialFS));
  const [cwdDisplay, setCwdDisplay] = useState('~');

  const updateCwd = useCallback(() => {
    const cwd = vfsRef.current.pwd();
    setCwdDisplay(cwd.replace('/home/enzo', '~') || '~');
  }, []);

  // Sync session state to store on every phase/drill/boss change
  useEffect(() => {
    setSession(module.id, phase, currentDrillIndex, currentBossStep);
  }, [module.id, phase, currentDrillIndex, currentBossStep, setSession]);

  const currentDrill = module.drills[currentDrillIndex];
  const currentBoss = module.boss.steps[currentBossStep];

  // Initialize phase messages (guard against duplicate fires)
  const lastInitRef = useRef('');

  useEffect(() => {
    const key = `${phase}-${currentDrillIndex}-${currentBossStep}`;
    if (key === lastInitRef.current) return;
    lastInitRef.current = key;

    if (phase === 'sandbox') {
      terminal.resetWithLines([
        { type: 'system', text: '═══ MODO SANDBOX ═══' },
        { type: 'brief', text: 'Experimente à vontade! Digite qualquer comando relacionado ao tema. Sem certo ou errado aqui.' },
        { type: 'hint', text: "Digite 'done' quando estiver pronto para os desafios, ou 'brief' para revisar a explicação." },
      ]);
    } else if (phase === 'drill' && currentDrill) {
      setDrillStartTime(Date.now());
      setDrillAttempts(0);
      setUsedHint(false);
      terminal.resetWithLines([
        { type: 'system', text: `═══ EXERCÍCIO ${currentDrillIndex + 1}/${module.drills.length}: ${DIFFICULTY_LABELS[currentDrill.difficulty] || currentDrill.difficulty.toUpperCase()} ═══` },
        { type: 'brief', text: currentDrill.prompt },
      ]);
    } else if (phase === 'boss') {
      terminal.resetWithLines([
        { type: 'system', text: `═══ 🏆 DESAFIO BOSS: ${module.boss.title.toUpperCase()} ═══` },
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
      terminal.addLine({ type: 'system', text: "Comandos: done (iniciar exercícios), brief (revisar explicação), help, clear" });
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'clear') {
      terminal.resetWithLines([
        { type: 'system', text: '═══ MODO SANDBOX ═══' },
        { type: 'hint', text: "Digite 'done' quando estiver pronto." },
      ]);
      terminal.setInputValue('');
      return;
    }

    // Check sandbox commands
    const baseCmd = cmd.split(/\s+/)[0];

    // Try VFS first
    const vfsResult = vfsRef.current.executeCommand(cmd);
    if (vfsResult.handled) {
      if (vfsResult.output) {
        terminal.addLine({ type: vfsResult.isError ? 'error' : 'output', text: vfsResult.output });
      }
      updateCwd();
      trackSandboxCommand(baseCmd);
      terminal.setInputValue('');
      return;
    }

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
      // Check learned commands from completed modules
      const { completedModules } = useGameStore.getState();
      const learnedCommands = getLearnedCommands(completedModules);
      for (const learnedCmd of learnedCommands) {
        if (learnedCmd.pattern.test(cmd)) {
          if (learnedCmd.output) {
            terminal.addLine({ type: 'output', text: learnedCmd.output });
          }
          terminal.addLine({ type: 'learned', text: '(comando aprendido em módulo anterior)' });
          matched = true;
          break;
        }
      }
    }

    if (!matched) {
      terminal.addLine({ type: 'system', text: `${cmd}: comando simulado — tente comandos relacionados ao tema deste módulo!` });
    }

    terminal.setInputValue('');
  }, [terminal, module.sandbox.commands, trackSandboxCommand, updateCwd]);

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
      terminal.addLine({ type: 'system', text: "Comandos: hint (pedir dica), skip (pular exercício), help" });
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
      // Execute against VFS to update filesystem state
      vfsRef.current.executeCommand(cmd);
      updateCwd();

      if (currentDrill.expectedOutput) {
        terminal.addLine({ type: 'output', text: currentDrill.expectedOutput });
      }
      terminal.addLine({ type: 'success', text: `CORRETO! +${currentDrill.xp} XP` });

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
        terminal.addLine({ type: 'levelup', text: 'BÔNUS DE PRIMEIRA! +25 XP' });
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
      // Try VFS first
      const vfsResult = vfsRef.current.executeCommand(cmd);
      if (vfsResult.handled) {
        if (vfsResult.output) {
          terminal.addLine({ type: 'output', text: vfsResult.output });
        }
        terminal.addLine({ type: 'learned', text: 'Comando reconhecido, mas não é a resposta para este exercício.' });
        updateCwd();
      } else {
        // Then check learned commands before showing generic error
        const { completedModules } = useGameStore.getState();
        const learnedCommands = getLearnedCommands(completedModules);
        let isLearned = false;
        for (const learnedCmd of learnedCommands) {
          if (learnedCmd.pattern.test(cmd)) {
            if (learnedCmd.output) {
              terminal.addLine({ type: 'output', text: learnedCmd.output });
            }
            terminal.addLine({ type: 'learned', text: 'Comando reconhecido, mas não é a resposta para este exercício.' });
            isLearned = true;
            break;
          }
        }
        if (!isLearned) {
          terminal.addLine({ type: 'error', text: result.message });
        }
      }
    }

    terminal.setInputValue('');
  }, [terminal, currentDrill, currentDrillIndex, drillAttempts, drillStartTime, usedHint, module, addXP, completeDrill, updateCwd]);

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
      // Execute against VFS to update filesystem state
      vfsRef.current.executeCommand(cmd);
      updateCwd();

      if (currentBoss.expectedOutput) {
        terminal.addLine({ type: 'output', text: currentBoss.expectedOutput });
      }
      terminal.addLine({ type: 'success', text: 'Etapa concluída!' });

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
        clearSession();
        terminal.addLine({ type: 'system', text: '' });
        terminal.addLine({ type: 'levelup', text: `BOSS DERROTADO: ${module.boss.title}! +${module.boss.xpReward} XP` });
        terminal.addLine({ type: 'success', text: 'Ganhou 1 Token de Proteção de Streak!' });
        terminal.addLine({ type: 'levelup', text: `MÓDULO COMPLETO: ${module.title}` });

        setTimeout(() => {
          setPhase('completed');
          onModuleComplete();
        }, 3000);
      }
    } else if (result.type === 'feedback') {
      terminal.addLine({ type: 'feedback', text: result.message });
    } else {
      // Try VFS first
      const vfsResult = vfsRef.current.executeCommand(cmd);
      if (vfsResult.handled) {
        if (vfsResult.output) {
          terminal.addLine({ type: 'output', text: vfsResult.output });
        }
        terminal.addLine({ type: 'learned', text: 'Comando reconhecido, mas não é a resposta para este exercício.' });
        updateCwd();
      } else {
        // Then check learned commands before showing generic error
        const { completedModules } = useGameStore.getState();
        const learnedCommands = getLearnedCommands(completedModules);
        let isLearned = false;
        for (const learnedCmd of learnedCommands) {
          if (learnedCmd.pattern.test(cmd)) {
            if (learnedCmd.output) {
              terminal.addLine({ type: 'output', text: learnedCmd.output });
            }
            terminal.addLine({ type: 'learned', text: 'Comando reconhecido, mas não é a resposta para este exercício.' });
            isLearned = true;
            break;
          }
        }
        if (!isLearned) {
          terminal.addLine({ type: 'error', text: result.message });
        }
      }
    }

    terminal.setInputValue('');
  }, [terminal, currentBoss, currentBossStep, module, addXP, completeBoss, completeModule, addFreezeToken, clearSession, onModuleComplete, updateCwd]);

  const handleSubmit = useCallback(() => {
    if (phase === 'sandbox') handleSandboxSubmit();
    else if (phase === 'drill') handleDrillSubmit();
    else if (phase === 'boss') handleBossSubmit();
  }, [phase, handleSandboxSubmit, handleDrillSubmit, handleBossSubmit]);

  const phaseLabels: Record<ModulePhase, string> = {
    briefing: '📖 Explicação',
    sandbox: '🧪 Sandbox',
    drill: `⚔️ Exercício ${currentDrillIndex + 1}/${module.drills.length}`,
    boss: '🏆 Desafio Boss',
    completed: '✅ Concluído',
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
          prompt={`enzo@linux ${cwdDisplay} $`}
          placeholder={
            phase === 'sandbox' ? "experimente à vontade... ('done' para continuar)"
            : phase === 'boss' ? "resolva o desafio... ('hint' para ajuda)"
            : "digite sua resposta... ('hint' para ajuda)"
          }
        />
      )}

      {phase === 'completed' && (
        <div className="p-12 text-center">
          <div className="text-4xl mb-4">&#127881;</div>
          <div className="text-xl font-bold text-green-400 mb-2">Módulo Concluído!</div>
          <div className="text-slate-400 text-sm mb-6">{module.title} — todos os exercícios e boss derrotados.</div>
          <button
            onClick={onModuleComplete}
            className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 font-semibold text-sm transition-all cursor-pointer"
          >
            Continuar para a Árvore de Skills →
          </button>
        </div>
      )}
    </div>
  );
}
