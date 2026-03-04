import { useState, useCallback, useEffect, useRef } from 'react';
import type { Module, ModulePhase, TerminalLine } from '../../types';
import { Terminal } from '../Terminal/Terminal';
import { Briefing } from '../Briefing/Briefing';
import { useTerminal } from '../../hooks/useTerminal';
import { useGameStore } from '../../stores/gameStore';
import { analyzeCommand } from '../../utils/commandParser';
import { getLearnedCommands } from '../../data/modules';
import { VirtualFS } from '../../utils/virtualFS';

type GameMode = 'training' | 'challenge';

// Bob Ross encouragement quotes — shown after repeated failures
const BOB_ROSS_QUOTES = [
  '"Não existem erros, apenas pequenos acidentes felizes." — Bob Ross',
  '"Talento é um interesse cultivado. Qualquer coisa que você praticar, você consegue fazer." — Bob Ross',
  '"O segredo de fazer qualquer coisa é acreditar que você consegue." — Bob Ross',
  '"Acredite que você pode fazer isso, porque você pode." — Bob Ross',
  '"É o contraste entre luz e sombra que dá significado a cada um." — Bob Ross',
  '"Qualquer coisa que não gostarmos, transformamos numa arvorezinha feliz." — Bob Ross',
  '"São as imperfeições que tornam algo bonito." — Bob Ross',
  '"Basta uma pequena mudança de perspectiva e você começa a ver um mundo totalmente novo." — Bob Ross',
  '"Colocamos um pouco de escuridão, só para a nossa luz aparecer." — Bob Ross',
  '"Não há nada no mundo que gere mais sucesso do que o próprio sucesso." — Bob Ross',
  '"Cada um vê o mundo do seu jeito. É isso que o torna tão especial." — Bob Ross',
  '"Na vida você precisa de cores." — Bob Ross',
  '"Já cometeu erros na vida? Vamos transformá-los em pássaros. É, agora são pássaros." — Bob Ross',
  '"Vamos ficar um pouco loucos aqui." — Bob Ross',
  '"Você tem poder ilimitado nesta tela — pode literalmente mover montanhas." — Bob Ross',
];

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
    addFreezeToken, setSession, clearSession, completedModules,
  } = store;

  const isAlreadyCompleted = completedModules.includes(module.id);

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
  const [bossAttempts, setBossAttempts] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [xpBoostActive, setXpBoostActive] = useState(false);

  // Hint Extra: track whether the offer has been shown so next 'hint' consumes the power-up
  const hintExtraOfferedRef = useRef(false);

  // Guard against duplicate Secret Book reveal & cleanup timeouts on unmount
  const secretBookRevealingRef = useRef(false);
  const activeTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Game mode: training (can see brief) vs challenge (no brief, unlocks next module)
  const [gameMode, setGameMode] = useState<GameMode>('training');
  const [showBriefingOverlay, setShowBriefingOverlay] = useState(false);

  const terminal = useTerminal();

  // Virtual filesystem for sandbox/drill/boss modes
  const vfsRef = useRef(new VirtualFS(module.initialFS));
  const [cwdDisplay, setCwdDisplay] = useState('~');

  const updateCwd = useCallback(() => {
    const cwd = vfsRef.current.pwd();
    setCwdDisplay(cwd.replace('/home/enzo', '~') || '~');
  }, []);

  // Cleanup all tracked timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(clearTimeout);
      activeTimeoutsRef.current = [];
    };
  }, []);

  const scheduleTimeout = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    activeTimeoutsRef.current.push(id);
    return id;
  }, []);

  // Sync session state to store on every phase/drill/boss change
  useEffect(() => {
    setSession(module.id, phase, currentDrillIndex, currentBossStep);
  }, [module.id, phase, currentDrillIndex, currentBossStep, setSession]);

  const currentDrill = module.drills[currentDrillIndex];
  const currentBoss = module.boss.steps[currentBossStep];

  // Start in a specific mode
  const handleStartMode = useCallback((mode: GameMode) => {
    setGameMode(mode);
    setPhase('sandbox');
  }, []);

  // Initialize phase messages (guard against duplicate fires)
  const lastInitRef = useRef('');

  useEffect(() => {
    const key = `${phase}-${currentDrillIndex}-${currentBossStep}`;
    if (key === lastInitRef.current) return;
    lastInitRef.current = key;

    if (phase === 'sandbox') {
      const briefHint = gameMode === 'training'
        ? "Digite 'done' quando estiver pronto para os desafios, ou 'brief' para revisar a explicação."
        : "Digite 'done' quando estiver pronto para os desafios.";
      terminal.resetWithLines([
        { type: 'system', text: `═══ MODO SANDBOX ${gameMode === 'challenge' ? '(DESAFIO)' : '(TREINO)'} ═══` },
        { type: 'brief', text: 'Experimente à vontade! Digite qualquer comando relacionado ao tema. Sem certo ou errado aqui.' },
        { type: 'hint', text: briefHint },
      ]);
    } else if (phase === 'drill' && currentDrill) {
      setDrillStartTime(Date.now());
      setDrillAttempts(0);
      setUsedHint(false);
      hintExtraOfferedRef.current = false;
      const lines: TerminalLine[] = [
        { type: 'system', text: `═══ EXERCÍCIO ${currentDrillIndex + 1}/${module.drills.length}: ${DIFFICULTY_LABELS[currentDrill.difficulty] || currentDrill.difficulty.toUpperCase()} ═══` },
        { type: 'brief', text: currentDrill.prompt },
      ];
      if (gameMode === 'training') {
        lines.push({ type: 'hint', text: "Dica: digite 'brief' para consultar as instruções." });
      }
      terminal.resetWithLines(lines);
    } else if (phase === 'boss') {
      setBossAttempts(0);
      terminal.resetWithLines([
        { type: 'system', text: `═══ 🏆 DESAFIO BOSS: ${module.boss.title.toUpperCase()} ═══` },
        { type: 'brief', text: module.boss.scenario },
        { type: 'system', text: '' },
        { type: 'brief', text: currentBoss?.prompt || '' },
      ]);
    }
  }, [phase, currentDrillIndex, currentBossStep]);

  // Handle 'brief' command across all phases
  const handleBriefCommand = useCallback((): boolean => {
    if (gameMode === 'challenge') {
      terminal.addLine({ type: 'system', text: 'Modo Desafio: instruções desativadas.' });
      return true;
    }
    setShowBriefingOverlay(true);
    return true;
  }, [gameMode, terminal]);

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
      if (gameMode === 'training') {
        setPhase('briefing');
      } else {
        terminal.addLine({ type: 'system', text: 'Modo Desafio: instruções desativadas.' });
      }
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'help') {
      const helpText = gameMode === 'training'
        ? "Comandos: done (iniciar exercícios), brief (revisar explicação), help, clear"
        : "Comandos: done (iniciar exercícios), help, clear";
      terminal.addLine({ type: 'system', text: helpText });
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'clear') {
      terminal.resetWithLines([
        { type: 'system', text: `═══ MODO SANDBOX ${gameMode === 'challenge' ? '(DESAFIO)' : '(TREINO)'} ═══` },
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
  }, [terminal, module.sandbox.commands, trackSandboxCommand, updateCwd, gameMode]);

  const handleDrillSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'brief') {
      handleBriefCommand();
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'hint') {
      setUsedHint(true);
      if (drillAttempts < currentDrill.hints.length) {
        // Normal hints still available
        const hintIndex = Math.min(drillAttempts, currentDrill.hints.length - 1);
        terminal.addLine({ type: 'hint', text: `Hint: ${currentDrill.hints[hintIndex]}` });
      } else if (hintExtraOfferedRef.current) {
        // Player already saw the offer — consume the power-up
        const ok = useGameStore.getState().usePowerUp('hint-extra');
        if (ok) {
          terminal.addLine({ type: 'hint', text: 'Hint Extra: Releia o prompt com atenção. O comando que você precisa foi explicado no briefing.' });
        } else {
          terminal.addLine({ type: 'system', text: 'Você não tem mais Hint Extra disponível.' });
        }
        hintExtraOfferedRef.current = false;
      } else if (useGameStore.getState().powerUps['hint-extra'] > 0) {
        // All normal hints used, offer Hint Extra
        terminal.addLine({ type: 'hint', text: `Hint: ${currentDrill.hints[currentDrill.hints.length - 1]}` });
        terminal.addLine({ type: 'system', text: "Suas dicas acabaram. Você tem Hint Extra! Digite 'hint' novamente para usar." });
        hintExtraOfferedRef.current = true;
      } else {
        // No hints left, no power-up
        terminal.addLine({ type: 'hint', text: `Hint: ${currentDrill.hints[currentDrill.hints.length - 1]}` });
      }
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'help') {
      const helpText = gameMode === 'training'
        ? "Comandos: hint (pedir dica), brief (ver instruções), skip (pular exercício), help"
        : "Comandos: hint (pedir dica), skip (pular exercício), help";
      terminal.addLine({ type: 'system', text: helpText });
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

    const attemptNum = drillAttempts + 1;
    setDrillAttempts(attemptNum);
    const result = analyzeCommand(cmd, currentDrill.check, currentDrill.feedbackRules);

    if (result.type === 'success') {
      // Execute against VFS to update filesystem state
      vfsRef.current.executeCommand(cmd);
      updateCwd();

      if (currentDrill.expectedOutput) {
        terminal.addLine({ type: 'output', text: currentDrill.expectedOutput });
      }
      const drillXpAmount = xpBoostActive ? currentDrill.xp * 2 : currentDrill.xp;
      terminal.addLine({ type: 'success', text: `CORRETO! +${drillXpAmount} XP${xpBoostActive ? ' (Boost x2!)' : ''}` });

      addXP(drillXpAmount);
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
        const bonusXp = xpBoostActive ? 50 : 25;
        terminal.addLine({ type: 'levelup', text: `BÔNUS DE PRIMEIRA! +${bonusXp} XP${xpBoostActive ? ' (Boost x2!)' : ''}` });
        addXP(bonusXp);
      }

      // Move to next drill or boss
      scheduleTimeout(() => {
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

    // Bob Ross encouragement after 3+ failed attempts (every 2 attempts)
    if (result.type !== 'success' && attemptNum >= 3 && attemptNum % 2 === 1) {
      const quote = BOB_ROSS_QUOTES[Math.floor(Math.random() * BOB_ROSS_QUOTES.length)];
      terminal.addLine({ type: 'system', text: '' });
      terminal.addLine({ type: 'hint', text: `🎨 ${quote}` });
    }

    terminal.setInputValue('');
  }, [terminal, currentDrill, currentDrillIndex, drillAttempts, drillStartTime, usedHint, module, addXP, completeDrill, updateCwd, handleBriefCommand, gameMode, xpBoostActive, scheduleTimeout]);

  const handleBossSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd || !currentBoss) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'brief') {
      handleBriefCommand();
      terminal.setInputValue('');
      return;
    }
    if (cmd === 'hint') {
      const hintIndex = 0;
      terminal.addLine({ type: 'hint', text: `Hint: ${currentBoss.hints[hintIndex]}` });
      terminal.setInputValue('');
      return;
    }

    const bossAttemptNum = bossAttempts + 1;
    setBossAttempts(bossAttemptNum);
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
      } else {
        // Boss complete!
        const bossXpAmount = xpBoostActive ? module.boss.xpReward * 2 : module.boss.xpReward;
        addXP(bossXpAmount);
        completeBoss(module.id);

        // Only unlock next module in challenge mode (or if already completed)
        if (gameMode === 'challenge' || isAlreadyCompleted) {
          completeModule(module.id);
        }

        addFreezeToken();
        clearSession();
        terminal.addLine({ type: 'system', text: '' });
        terminal.addLine({ type: 'levelup', text: `BOSS DERROTADO: ${module.boss.title}! +${bossXpAmount} XP${xpBoostActive ? ' (Boost x2!)' : ''}` });
        terminal.addLine({ type: 'success', text: 'Ganhou 1 Token de Proteção de Streak!' });

        if (gameMode === 'challenge' || isAlreadyCompleted) {
          terminal.addLine({ type: 'levelup', text: `MÓDULO COMPLETO: ${module.title}` });
        } else {
          terminal.addLine({ type: 'levelup', text: `MÓDULO CONCLUÍDO (TREINO): ${module.title}` });
          terminal.addLine({ type: 'hint', text: 'Complete no Modo Desafio para desbloquear o próximo módulo!' });
        }

        // Check if all base modules are now complete — trigger Secret Book reveal
        const BASE_MODULE_IDS = ['cli-basics', 'pipes-streams', 'files-nav', 'process-mgmt', 'text-processing', 'data-wrangling'];
        const storeState = useGameStore.getState();
        const updatedCompleted = [...storeState.completedModules, module.id];
        const allBaseComplete = BASE_MODULE_IDS.every(id => updatedCompleted.includes(id));

        if (allBaseComplete && !storeState.secretBookUnlocked && !secretBookRevealingRef.current) {
          secretBookRevealingRef.current = true;
          scheduleTimeout(() => {
            terminal.addLine({ type: 'system', text: '' });
            terminal.addLine({ type: 'system', text: '> Todos os modulos completados...' });
          }, 4000);
          scheduleTimeout(() => {
            terminal.addLine({ type: 'system', text: '> Desbloqueando conhecimento oculto...' });
          }, 4600);
          scheduleTimeout(() => {
            terminal.addLine({ type: 'system', text: '> ################## 100%' });
          }, 5200);
          scheduleTimeout(() => {
            terminal.addLine({ type: 'levelup', text: 'THE SECRET BOOK OF KNOWLEDGE foi revelado!' });
            terminal.addLine({ type: 'learned', text: '"Ha mais no CLI do que voce imagina, jovem aprendiz..."' });
            terminal.addLine({ type: 'system', text: '' });
            terminal.addLine({ type: 'success', text: '18 novos modulos foram adicionados ao Mapa de Missoes!' });
            useGameStore.getState().unlockSecretBook();
          }, 6000);
          scheduleTimeout(() => {
            setPhase('completed');
            onModuleComplete();
          }, 8000);
        } else {
          scheduleTimeout(() => {
            setPhase('completed');
            onModuleComplete();
          }, 3000);
        }
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

    // Bob Ross encouragement after 3+ failed attempts on boss (every 2 attempts)
    if (result.type !== 'success' && bossAttemptNum >= 3 && bossAttemptNum % 2 === 1) {
      const quote = BOB_ROSS_QUOTES[Math.floor(Math.random() * BOB_ROSS_QUOTES.length)];
      terminal.addLine({ type: 'system', text: '' });
      terminal.addLine({ type: 'hint', text: `🎨 ${quote}` });
    }

    terminal.setInputValue('');
  }, [terminal, currentBoss, currentBossStep, module, addXP, completeBoss, completeModule, addFreezeToken, clearSession, onModuleComplete, updateCwd, handleBriefCommand, gameMode, isAlreadyCompleted, xpBoostActive, scheduleTimeout, completedModules, bossAttempts]);

  const handleSubmit = useCallback(() => {
    if (phase === 'sandbox') handleSandboxSubmit();
    else if (phase === 'drill') handleDrillSubmit();
    else if (phase === 'boss') handleBossSubmit();
  }, [phase, handleSandboxSubmit, handleDrillSubmit, handleBossSubmit]);

  const modeLabel = gameMode === 'challenge' ? ' (Desafio)' : ' (Treino)';
  const phaseLabels: Record<ModulePhase, string> = {
    briefing: '📖 Explicação',
    sandbox: `🧪 Sandbox${modeLabel}`,
    drill: `⚔️ Exercício ${currentDrillIndex + 1}/${module.drills.length}${modeLabel}`,
    boss: `🏆 Desafio Boss${modeLabel}`,
    completed: '✅ Concluído',
  };

  return (
    <div>
      <div className="bg-[#0f172a] px-4 py-2 flex items-center justify-between border-b border-slate-700">
        <span className="text-sm text-slate-400 font-semibold">{module.title}</span>
        <span className="text-xs text-cyan-400">{phaseLabels[phase]}</span>
      </div>

      {phase === 'briefing' && (
        <>
          <Briefing
            title={module.title}
            briefing={module.briefing}
            onStartTraining={() => handleStartMode('training')}
            onStartChallenge={() => handleStartMode('challenge')}
          />
          {/* XP Boost power-up activation */}
          {(() => {
            const boostCount = useGameStore.getState().powerUps['xp-boost'] ?? 0;
            if (xpBoostActive) {
              return (
                <div className="mx-4 mb-4 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg text-center">
                  <span className="text-amber-400 text-sm font-semibold">Boost x2 XP ativo!</span>
                </div>
              );
            }
            if (boostCount > 0) {
              return (
                <div className="mx-4 mb-4 px-3 py-2 bg-purple-500/10 border border-purple-500/30 rounded-lg text-center">
                  <span className="text-purple-300 text-xs">Você tem {boostCount} XP Boost</span>
                  <button
                    onClick={() => {
                      const ok = useGameStore.getState().usePowerUp('xp-boost');
                      if (ok) setXpBoostActive(true);
                    }}
                    className="ml-3 px-3 py-1 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 rounded text-amber-400 text-xs font-semibold cursor-pointer transition-all"
                  >
                    Ativar Boost x2
                  </button>
                </div>
              );
            }
            return null;
          })()}
        </>
      )}

      {(phase === 'sandbox' || phase === 'drill' || phase === 'boss') && (
        <>
          {/* Briefing overlay for training mode */}
          {showBriefingOverlay && (
            <div className="absolute inset-0 z-40 bg-[#0a0f1e]/95 overflow-y-auto">
              <Briefing
                title={module.title}
                briefing={module.briefing}
                isOverlay
                onClose={() => setShowBriefingOverlay(false)}
              />
            </div>
          )}

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
        </>
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
            Continuar para o Mapa de Missões →
          </button>
        </div>
      )}
    </div>
  );
}
