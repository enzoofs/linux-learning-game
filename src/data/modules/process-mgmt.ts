import type { Module } from '../../types';

export const processMgmtModule: Module = {
  id: 'process-mgmt',
  title: 'Gerenciamento de Processos',
  description: 'Monitore, controle e gerencie processos em execução como um administrador de sistemas.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `Todo programa que você executa no Linux se torna um **processo** — uma instância ativa com seu próprio ID (PID), memória e uso de CPU. Entender processos é essencial para troubleshooting, ajuste de performance e administração de sistemas.\n\n` +
      `**Visualizando processos:**\n` +
      `• **ps** — Snapshot dos processos do seu shell atual. Rápido e simples.\n` +
      `• **ps aux** — Visão completa do sistema: cada processo, cada usuário, com uso de CPU e memória.\n` +
      `• **top** — Dashboard em tempo real, atualizado ao vivo, de todos os processos ordenados por uso de recursos.\n` +
      `• **pstree** — Mostra processos como uma árvore, revelando relações pai-filho.\n\n` +
      `**Controlando processos:**\n` +
      `• **kill PID** — Envia o sinal TERM para um processo, pedindo educadamente para parar.\n` +
      `• **kill -9 PID** — Envia o sinal KILL, terminando o processo à força. Use como último recurso.\n` +
      `• **Ctrl+Z** — Suspende (pausa) um processo em foreground.\n` +
      `• **bg** — Retoma um processo suspenso em background.\n` +
      `• **fg** — Traz um processo em background de volta para o foreground.\n` +
      `• **jobs** — Lista todos os jobs em background e suspensos no shell atual.`,
    analogy:
      'Processos são como trabalhadores em uma fábrica. `ps` mostra quem está trabalhando, `kill` manda embora, e `top` é o gerente de chão de fábrica observando todos em tempo real. `jobs` é a lista da sua equipe, enquanto `bg` e `fg` movem trabalhadores entre o escritório dos fundos e a recepção.',
    syntax:
      'ps                          # show your shell\'s processes\nps aux                       # show ALL processes with details\ntop                          # live process monitor (q to quit)\npstree                       # show process tree\nkill PID                     # send TERM signal (graceful stop)\nkill -9 PID                  # send KILL signal (force stop)\njobs                         # list background/suspended jobs\nbg [%job]                    # resume job in background\nfg [%job]                    # bring job to foreground',
    examples: [
      { command: 'ps', output: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps', explanation: 'Mostra processos na sua sessão de terminal atual. Você sempre vê pelo menos o shell (bash) e o próprio comando ps.' },
      { command: 'ps aux', output: 'USER       PID %CPU %MEM    VSZ   RSS TTY  STAT START TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?   Ss   09:00 0:03 /sbin/init\nenzo      1234  0.0  0.0  21472  5204 pts/0 Ss 10:00 0:00 bash\nenzo      4523 99.0  5.2 312456 42000 ?    R  10:15 5:42 python train.py\n...', explanation: 'Mostra TODOS os processos do sistema. Nota: `a` = todos os usuários, `u` = formato orientado ao usuário, `x` = inclui processos sem terminal.' },
      { command: 'kill 4523', output: '', explanation: 'Envia SIGTERM para o PID 4523. O processo tem a chance de limpar e sair graciosamente.' },
      { command: 'kill -9 4523', output: '', explanation: 'Envia SIGKILL — morte instantânea. O processo não pode capturar ou ignorar este sinal. Use apenas se o kill normal falhar.' },
      { command: 'jobs', output: '[1]+  Stopped                 vim server.conf\n[2]-  Running                 python backup.py &', explanation: 'Lista os jobs no seu shell. Job 1 está parado (Ctrl+Z), Job 2 está rodando em background.' },
      { command: 'fg %1', output: '(vim resumes in foreground)', explanation: 'Traz o job 1 (vim) de volta ao foreground para você interagir com ele.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ps$/, output: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps', description: 'Show current shell processes' },
      { pattern: /^ps\s+aux$/, output: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\nroot        42  0.0  0.0  34568  2704 ?        Ss   09:00   0:00 /usr/sbin/cron\nwww-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      1234  0.0  0.0  21472  5204 pts/0    Ss   10:00   0:00 bash\nenzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nroot      3456  0.0  0.3  45672  2508 ?        Ss   09:00   0:01 /usr/sbin/sshd\nenzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5678  0.0  0.0  18340  1200 pts/0    R+   10:30   0:00 ps aux', description: 'Show all system processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/, output: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python', description: 'Find python processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?node['"]?$/, output: 'enzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep node', description: 'Find node processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?apache['"]?$/, output: 'www-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep apache', description: 'Find apache processes' },
      { pattern: /^top$/, output: 'top - 10:30:15 up 1:30, 1 user, load average: 2.50, 1.80, 0.95\nTasks: 128 total,   2 running, 126 sleeping,   0 stopped\n%Cpu(s): 52.3 us,  3.1 sy,  0.0 ni, 44.2 id,  0.4 wa\nMiB Mem :  7872.4 total,  2145.6 free,  3890.2 used,  1836.6 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 4523 enzo      20   0  312456  42000  12340 R  99.0   5.2   5:42.13 python\n 2345 enzo      20   0  156432  17200   8400 S   0.5   2.1   0:30.45 node\n  110 www-data  20   0  298764  12340   5200 S   0.2   1.5   0:15.22 apache2\n    1 root      20   0  169316  11892   8456 S   0.0   0.1   0:03.12 init\n   42 root      20   0   34568   2704   2400 S   0.0   0.0   0:00.08 cron', description: 'Live process monitor' },
      { pattern: /^pstree$/, output: 'init─┬─cron\n     ├─sshd───bash───pstree\n     ├─apache2\n     └─bash─┬─node\n            └─python', description: 'Show process tree' },
      { pattern: /^kill\s+4523$/, output: '', description: 'Send TERM signal to PID 4523' },
      { pattern: /^kill\s+-9\s+4523$/, output: '', description: 'Force kill PID 4523' },
      { pattern: /^kill\s+\d+$/, output: '', description: 'Send TERM signal to a process' },
      { pattern: /^kill\s+-9\s+\d+$/, output: '', description: 'Force kill a process' },
      { pattern: /^jobs$/, output: '[1]+  Stopped                 vim server.conf\n[2]-  Running                 python backup.py &', description: 'List background jobs' },
      { pattern: /^fg\s+%?\d*$/, output: '(process resumed in foreground)', description: 'Bring job to foreground' },
      { pattern: /^bg\s+%?\d*$/, output: '[1]+ python backup.py &', description: 'Resume job in background' },
    ],
    contextHints: [
      'Tente `ps` para ver os processos do seu shell atual.',
      'Use `ps aux` para ver TODOS os processos no sistema — cada usuário, cada processo.',
      'Use `top` para uma visão ao vivo, em tempo real, dos processos ordenados por uso de CPU.',
      'Encontre um processo específico: `ps aux | grep python`.',
      'Mate um processo com `kill PID` — use o PID da saída do `ps`.',
      'Se um processo não morrer, use `kill -9 PID` para forçar.',
      'Use `jobs` para ver processos em background/suspensos no seu shell.',
      'Use `pstree` para visualizar relações pai-filho entre processos.',
    ],
  },

  drills: [
    {
      id: 'process-drill-1',
      prompt: 'Liste os processos rodando na sua sessão de terminal atual.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'ps',
      expectedOutput: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps',
      hints: [
        'O comando tem apenas duas letras. Significa "process status".',
      ],
      feedbackRules: [
        { pattern: /^ps\s+aux/, message: 'Isso mostra TODOS os processos do sistema. Para apenas os do seu terminal, `ps` sozinho basta.' },
        { pattern: /^top$/, message: '`top` é um monitor ao vivo. Para um snapshot simples, use `ps`.' },
        { pattern: /^processes/i, message: 'O comando para listar processos é `ps` (process status).' },
        { pattern: /^ls$/, message: '`ls` lista arquivos, não processos. Use `ps` para listar processos.' },
      ],
      xp: 50,
    },
    {
      id: 'process-drill-2',
      prompt: 'Mostre TODOS os processos de todo o sistema, de cada usuário, com detalhes completos (usuário, PID, CPU, memória).',
      difficulty: 'easy',
      check: (cmd) => /^ps\s+aux$/.test(cmd.trim()),
      expectedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\n...',
      hints: [
        'Você precisa de `ps` com três flags: `a` (todos os usuários), `u` (formato de usuário), `x` (inclui processos sem terminal).',
        'O comando é: `ps aux`',
      ],
      feedbackRules: [
        { pattern: /^ps$/, message: '`ps` sozinho só mostra os processos do seu terminal. Adicione `aux` para ver tudo: `ps aux`.' },
        { pattern: /^ps\s+-aux$/, message: 'Quase! As flags no estilo BSD não usam traço: `ps aux` (não `ps -aux`).' },
        { pattern: /^ps\s+-ef$/, message: '`ps -ef` funciona na prática! Mas este drill pede o formato `aux`: `ps aux`.' },
        { pattern: /^ps\s+a$/, message: 'Você precisa das três flags: `a` (todos os usuários), `u` (formato de usuário), `x` (sem tty). Use `ps aux`.' },
      ],
      xp: 50,
    },
    {
      id: 'process-drill-3',
      prompt: 'Um processo com PID 1234 está se comportando mal. Envie um sinal de terminação para pedir que ele pare graciosamente.',
      difficulty: 'medium',
      check: (cmd) => /^kill\s+1234$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'O comando para parar um processo é `kill` seguido do PID.',
        'Para uma parada graciosa, basta usar `kill PID` — sem flags extras.',
      ],
      feedbackRules: [
        { pattern: /^kill\s+-9\s+1234$/, message: '`kill -9` é um kill forçado — não dá chance ao processo de limpar. Tente `kill 1234` primeiro.' },
        { pattern: /^kill$/, message: 'Você precisa especificar o PID: `kill 1234`.' },
        { pattern: /^stop\s+1234/i, message: '`stop` não é um comando padrão. Use `kill 1234` para enviar um sinal de terminação.' },
        { pattern: /^kill\s+-SIGTERM\s+1234$/, message: 'Tecnicamente correto! Mas `kill 1234` envia SIGTERM por padrão — sem flag necessária.' },
        { pattern: /^kill\s+-15\s+1234$/, message: 'Sinal 15 é SIGTERM, que é o padrão. Você pode usar apenas `kill 1234`.' },
      ],
      xp: 75,
    },
    {
      id: 'process-drill-4',
      prompt: 'Encontre todos os processos python rodando no sistema. Use `ps aux` com pipe para um comando de filtro.',
      difficulty: 'hard',
      check: (cmd) => /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/.test(cmd.trim()),
      expectedOutput: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python',
      hints: [
        'Você precisa de dois comandos conectados por um pipe: um para listar todos os processos, outro para filtrar.',
        'Use `ps aux` para listar processos, depois pipe para `grep python` para filtrar.',
      ],
      feedbackRules: [
        { pattern: /^ps\s+aux$/, message: 'Isso mostra todos os processos, mas são muitos! Passe por pipe para `grep python` para filtrar: `ps aux | grep python`.' },
        { pattern: /^grep\s+['"]?python['"]?\s*$/, message: '`grep` precisa de entrada. Passe `ps aux` por pipe: `ps aux | grep python`.' },
        { pattern: /^ps\s+aux\s*\|\s*grep$/, message: 'Você precisa dizer ao `grep` o que buscar: `ps aux | grep python`.' },
        { pattern: /^ps\s*\|\s*grep\s+['"]?python['"]?$/, message: '`ps` sozinho só mostra os processos do seu terminal. Use `ps aux` para buscar todos: `ps aux | grep python`.' },
        { pattern: /^pgrep\s+python$/, message: '`pgrep` é um atalho que existe no Linux real! Mas este drill pede para praticar pipes: `ps aux | grep python`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'O Processo Descontrolado',
    scenario: 'Um processo descontrolado está consumindo 99% da CPU e o servidor está travando. Usuários estão reclamando. Encontre o processo fugitivo e termine-o antes que o sistema fique irresponsivo!',
    steps: [
      {
        id: 'boss-process-1',
        prompt: '> Os alarmes estão disparando! O servidor está lento. Primeiro, obtenha uma visão completa de todos os processos em execução para ver o que está consumindo recursos.',
        check: (cmd) => /^ps\s+aux$/.test(cmd.trim()) || cmd.trim() === 'top',
        expectedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\nroot        42  0.0  0.0  34568  2704 ?        Ss   09:00   0:00 /usr/sbin/cron\nwww-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      1234  0.0  0.0  21472  5204 pts/0    Ss   10:00   0:00 bash\nenzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nroot      3456  0.0  0.3  45672  2508 ?        Ss   09:00   0:01 /usr/sbin/sshd\nenzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5678  0.0  0.0  18340  1200 pts/0    R+   10:30   0:00 ps aux',
        hints: ['Use `ps aux` ou `top` para ver todos os processos com uso de recursos.'],
        feedbackRules: [
          { pattern: /^ps$/, message: '`ps` sozinho só mostra os processos do seu terminal. Use `ps aux` para ver TODOS os processos e o uso de CPU.' },
          { pattern: /^ls/, message: '`ls` lista arquivos. Para ver processos em execução, use `ps aux`.' },
        ],
      },
      {
        id: 'boss-process-2',
        prompt: '> Dá pra ver algo usando 99% de CPU! É um processo python. Vamos dar zoom — filtre a lista de processos para mostrar apenas os processos python.',
        check: (cmd) => /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/.test(cmd.trim()),
        expectedOutput: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python',
        hints: ['Passe `ps aux` por pipe para `grep python` para isolar os processos python.'],
        feedbackRules: [
          { pattern: /^grep\s+['"]?python['"]?\s*$/, message: '`grep` precisa de entrada! Passe por pipe do `ps aux`: `ps aux | grep python`.' },
          { pattern: /^ps\s+aux$/, message: 'Isso mostra tudo. Filtre: `ps aux | grep python`.' },
        ],
      },
      {
        id: 'boss-process-3',
        prompt: '> Encontrei! PID 4523 — `python train.py` — é o culpado com 99% de CPU. Termine-o agora!',
        check: (cmd) => /^kill\s+(-9\s+)?4523$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `kill 4523` para enviar um sinal de terminação. Se não responder, use `kill -9 4523`.'],
        feedbackRules: [
          { pattern: /^kill\s+python/i, message: 'Você precisa matar pelo PID, não pelo nome. O PID é 4523: `kill 4523`.' },
          { pattern: /^kill$/, message: 'Especifique o PID! O processo problemático é o PID 4523: `kill 4523`.' },
          { pattern: /^kill\s+(?!(-9\s+)?4523)\d+$/, message: 'Confira o PID! O processo python descontrolado é o PID 4523.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-runaway-process',
  },

  achievements: ['process-wrangler', 'boss-runaway-process'],
};
