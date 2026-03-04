import { useCallback, useRef, useState } from 'react';
import { Terminal } from '../Terminal/Terminal';
import { useTerminal } from '../../hooks/useTerminal';
import { useGameStore } from '../../stores/gameStore';
import { getLearnedCommands, ALL_MODULES } from '../../data/modules';
import { VirtualFS } from '../../utils/virtualFS';

const WELCOME_LINES = [
  { type: 'system' as const, text: '═══ SANDBOX LIVRE ═══' },
  { type: 'brief' as const, text: 'Terminal livre para experimentar comandos. Sem certo ou errado.' },
  { type: 'hint' as const, text: "Digite 'help' para ver os comandos disponíveis." },
];

export function Sandbox() {
  const terminal = useTerminal(WELCOME_LINES);
  const vfsRef = useRef(new VirtualFS());
  const [cwdDisplay, setCwdDisplay] = useState('~');

  const updateCwd = useCallback(() => {
    const cwd = vfsRef.current.pwd();
    setCwdDisplay(cwd.replace('/home/enzo', '~') || '~');
  }, []);

  const handleSubmit = useCallback(() => {
    const cmd = terminal.inputValue.trim();
    if (!cmd) return;

    terminal.addLine({ type: 'input', text: cmd });

    if (cmd === 'help') {
      terminal.addLine({ type: 'system', text: 'Comandos disponíveis:' });
      terminal.addLine({ type: 'hint', text: '  help          — mostra esta ajuda' });
      terminal.addLine({ type: 'hint', text: '  clear         — limpa o terminal' });
      terminal.addLine({ type: 'hint', text: '  ls, cd, pwd   — navegação de arquivos' });
      terminal.addLine({ type: 'hint', text: '  cat, echo     — ler/escrever conteúdo' });
      terminal.addLine({ type: 'hint', text: '  mkdir, touch   — criar pastas/arquivos' });
      terminal.addLine({ type: 'hint', text: '  rm, cp, mv    — gerenciar arquivos' });
      terminal.addLine({ type: 'hint', text: '  + comandos aprendidos nos módulos completados' });
      terminal.setInputValue('');
      return;
    }

    if (cmd === 'clear') {
      terminal.resetWithLines([
        { type: 'system', text: '═══ SANDBOX LIVRE ═══' },
        { type: 'hint', text: "Digite 'help' para ver os comandos disponíveis." },
      ]);
      terminal.setInputValue('');
      return;
    }

    if (cmd === 'devunlock') {
      const allIds = ALL_MODULES.map(m => m.id);
      useGameStore.setState({
        completedModules: allIds,
        completedBosses: allIds,
        secretBookUnlocked: true,
        totalXP: 50000,
        lifetimeXP: 50000,
        spendableXP: 50000,
      });
      terminal.addLine({ type: 'success', text: `DEV: ${allIds.length} módulos desbloqueados + Secret Book + 50k XP` });
      terminal.setInputValue('');
      return;
    }

    if (cmd === 'devlock') {
      useGameStore.setState({
        completedModules: [],
        completedBosses: [],
        completedDrills: [],
        secretBookUnlocked: false,
        totalXP: 0,
        lifetimeXP: 0,
        spendableXP: 0,
      });
      terminal.addLine({ type: 'system', text: 'DEV: Progresso resetado.' });
      terminal.setInputValue('');
      return;
    }

    // Try VFS
    const vfsResult = vfsRef.current.executeCommand(cmd);
    if (vfsResult.handled) {
      if (vfsResult.output) {
        terminal.addLine({ type: vfsResult.isError ? 'error' : 'output', text: vfsResult.output });
      }
      updateCwd();
      terminal.setInputValue('');
      return;
    }

    // Try learned commands from completed modules
    const { completedModules } = useGameStore.getState();
    const learnedCommands = getLearnedCommands(completedModules);
    for (const learnedCmd of learnedCommands) {
      if (learnedCmd.pattern.test(cmd)) {
        if (learnedCmd.output) {
          terminal.addLine({ type: 'output', text: learnedCmd.output });
        }
        terminal.addLine({ type: 'learned', text: '(comando aprendido em módulo anterior)' });
        terminal.setInputValue('');
        return;
      }
    }

    terminal.addLine({ type: 'error', text: `${cmd}: comando não encontrado. Digite 'help' para ver os disponíveis.` });
    terminal.setInputValue('');
  }, [terminal, updateCwd]);

  return (
    <Terminal
      lines={terminal.lines}
      inputValue={terminal.inputValue}
      onInputChange={terminal.setInputValue}
      onSubmit={handleSubmit}
      inputRef={terminal.inputRef}
      endRef={terminal.endRef}
      prompt={`enzo@linux ${cwdDisplay} $`}
      placeholder="experimente à vontade..."
    />
  );
}
