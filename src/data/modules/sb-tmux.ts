import type { Module } from '../../types';

export const sbTmuxModule: Module = {
  id: 'sb-tmux',
  title: 'Terminal Multiplexer',
  description: 'Divida seu terminal em paineis e sessoes como um profissional.',
  tier: 'Adept',
  prerequisites: ['sb-shell-functions'],
  isSideQuest: false,

  briefing: {
    concept:
      `O tmux (Terminal Multiplexer) permite que voce tenha multiplas sessoes, janelas e paineis dentro de um unico terminal. Ele e essencial para trabalhar em servidores remotos — se sua conexao cair, a sessao continua rodando!\n\n` +
      `Conceitos fundamentais:\n` +
      `• **Sessao** — Um workspace independente. Pode ter varias janelas. Persiste mesmo se voce desconectar.\n` +
      `• **Janela** — Uma aba dentro da sessao. Cada janela ocupa a tela inteira.\n` +
      `• **Painel** — Uma divisao dentro de uma janela. Voce pode ter varios paineis lado a lado.\n\n` +
      `Comandos essenciais:\n` +
      `• \`tmux new-session -s nome\` — Cria uma nova sessao com nome.\n` +
      `• \`tmux split-window -h\` — Divide o painel horizontalmente (lado a lado).\n` +
      `• \`tmux split-window -v\` — Divide o painel verticalmente (um em cima do outro).\n` +
      `• \`tmux list-sessions\` — Lista todas as sessoes ativas.\n` +
      `• \`tmux attach-session -t nome\` — Reconecta a uma sessao existente.\n` +
      `• \`Ctrl+b d\` — Desconecta (detach) da sessao sem fecha-la.`,
    analogy:
      'O tmux e como uma mesa de trabalho magica: voce pode dividir a mesa em areas (paineis), ter varias mesas empilhadas (janelas), e agrupar tudo em escritorios (sessoes). Mesmo se voce sair do escritorio, tudo continua exatamente onde estava.',
    syntax:
      'tmux new-session -s nome\ntmux split-window -h | -v\ntmux select-pane -U | -D | -L | -R\ntmux list-sessions\ntmux attach-session -t nome\ntmux detach (ou Ctrl+b d)\ntmux resize-pane -U|-D|-L|-R [n]',
    examples: [
      { command: 'tmux new-session -s dev', output: '(nova sessao "dev" criada)', explanation: 'Cria uma sessao chamada "dev". Nomear sessoes facilita a organizacao.' },
      { command: 'tmux split-window -h', output: '(painel dividido horizontalmente)', explanation: 'Divide o painel atual em dois, lado a lado.' },
      { command: 'tmux split-window -v', output: '(painel dividido verticalmente)', explanation: 'Divide o painel atual em dois, um em cima do outro.' },
      { command: 'tmux list-sessions', output: 'dev: 1 windows (created ...)\nserver: 2 windows (created ...)', explanation: 'Mostra todas as sessoes ativas com suas informacoes.' },
      { command: 'tmux attach-session -t dev', output: '(reconectado a sessao "dev")', explanation: 'Reconecta a uma sessao existente. Use `-t` para especificar o nome.' },
      { command: 'tmux resize-pane -R 10', output: '(painel redimensionado)', explanation: 'Aumenta o painel atual em 10 colunas para a direita.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^tmux\s+new-session\s+-s\s+\w+/, output: '(nova sessao criada)' },
      { pattern: /^tmux\s+new-session$/, output: '(nova sessao criada: 0)' },
      { pattern: /^tmux\s+split-window\s+-h/, output: '(painel dividido horizontalmente)' },
      { pattern: /^tmux\s+split-window\s+-v/, output: '(painel dividido verticalmente)' },
      { pattern: /^tmux\s+select-pane\s+-[UDLR]/, output: '(foco movido para outro painel)' },
      { pattern: /^tmux\s+list-sessions/, output: 'dev: 1 windows (created Mar 04 10:00)\nserver: 2 windows (created Mar 04 09:30)\nlogs: 1 windows (created Mar 04 08:00)' },
      { pattern: /^tmux\s+attach-session\s+-t\s+\w+/, output: '(reconectado a sessao)' },
      { pattern: /^tmux\s+attach$/, output: '(reconectado a ultima sessao)' },
      { pattern: /^tmux\s+detach/, output: '(desconectado da sessao)' },
      { pattern: /^tmux\s+resize-pane/, output: '(painel redimensionado)' },
    ],
    contextHints: [
      'Tente `tmux new-session -s dev` para criar uma sessao nomeada.',
      'Use `tmux split-window -h` para dividir o terminal lado a lado.',
      'Use `tmux list-sessions` para ver sessoes ativas.',
      'Reconecte a uma sessao com `tmux attach-session -t nome`.',
      'Divida verticalmente com `tmux split-window -v`.',
    ],
  },

  drills: [
    {
      id: 'tmux-drill-1',
      prompt: 'Crie uma nova sessao do tmux com o nome "projeto".',
      difficulty: 'easy',
      check: (cmd) => /^tmux\s+new-session\s+-s\s+projeto$/.test(cmd.trim()),
      expectedOutput: '(nova sessao "projeto" criada)',
      hints: [
        'O comando `tmux new-session` cria uma sessao. Para nomea-la, use a flag `-s`.',
        'O comando completo e `tmux new-session -s projeto`.',
      ],
      feedbackRules: [
        { pattern: /^tmux\s+new$/, message: '`tmux new` funciona como atalho, mas sem `-s nome` a sessao fica sem nome. Use `tmux new-session -s projeto`.' },
        { pattern: /^tmux\s+new-session$/, message: 'Voce criou uma sessao, mas sem nome! Adicione `-s projeto` para nomea-la.' },
      ],
      xp: 70,
    },
    {
      id: 'tmux-drill-2',
      prompt: 'Divida o painel atual horizontalmente (lado a lado).',
      difficulty: 'easy',
      check: (cmd) => /^tmux\s+split-window\s+-h$/.test(cmd.trim()),
      expectedOutput: '(painel dividido horizontalmente)',
      hints: [
        'A flag `-h` no `split-window` divide horizontalmente (cria paineis lado a lado).',
        'Use `tmux split-window -h`.',
      ],
      feedbackRules: [
        { pattern: /^tmux\s+split-window\s+-v$/, message: '`-v` divide verticalmente (um em cima do outro). Para lado a lado, use `-h`.' },
        { pattern: /^tmux\s+split-window$/, message: 'Sem flag, o padrao e divisao vertical. Adicione `-h` para horizontal.' },
      ],
      xp: 70,
    },
    {
      id: 'tmux-drill-3',
      prompt: 'Divida o painel atual verticalmente (um em cima do outro).',
      difficulty: 'easy',
      check: (cmd) => /^tmux\s+split-window\s+-v$/.test(cmd.trim()),
      expectedOutput: '(painel dividido verticalmente)',
      hints: [
        'A flag `-v` no `split-window` divide verticalmente.',
        'Use `tmux split-window -v`.',
      ],
      feedbackRules: [
        { pattern: /^tmux\s+split-window\s+-h$/, message: '`-h` divide horizontalmente. Para um em cima do outro, use `-v`.' },
        { pattern: /^tmux\s+split$/, message: 'O comando completo e `tmux split-window -v`. O tmux nao reconhece `split` sozinho.' },
      ],
      xp: 70,
    },
    {
      id: 'tmux-drill-4',
      prompt: 'Liste todas as sessoes ativas do tmux.',
      difficulty: 'medium',
      check: (cmd) => /^tmux\s+(list-sessions|ls)$/.test(cmd.trim()),
      expectedOutput: 'dev: 1 windows (created Mar 04 10:00)\nserver: 2 windows (created Mar 04 09:30)\nlogs: 1 windows (created Mar 04 08:00)',
      hints: [
        'Existe um subcomando do tmux que lista as sessoes ativas.',
        'Use `tmux list-sessions` (ou o atalho `tmux ls`).',
      ],
      feedbackRules: [
        { pattern: /^tmux\s+list$/, message: 'O subcomando correto e `list-sessions`, nao apenas `list`. Use `tmux list-sessions`.' },
        { pattern: /^tmux\s+sessions/, message: 'O subcomando correto e `list-sessions`. Use `tmux list-sessions`.' },
      ],
      xp: 70,
    },
    {
      id: 'tmux-drill-5',
      prompt: 'Reconecte a uma sessao existente chamada "server".',
      difficulty: 'medium',
      check: (cmd) => /^tmux\s+attach(-session)?\s+-t\s+server$/.test(cmd.trim()),
      expectedOutput: '(reconectado a sessao "server")',
      hints: [
        'O comando `attach-session` reconecta a uma sessao. Use `-t` para especificar o nome.',
        'Use `tmux attach-session -t server` (ou `tmux attach -t server`).',
      ],
      feedbackRules: [
        { pattern: /^tmux\s+attach$/, message: '`tmux attach` sem `-t` conecta a ultima sessao. Especifique `-t server` para a sessao "server".' },
        { pattern: /^tmux\s+connect/i, message: 'O subcomando correto e `attach-session` (ou `attach`), nao "connect".' },
      ],
      xp: 70,
    },
  ],

  boss: {
    title: 'O Multitarefa',
    scenario: 'Voce precisa configurar um workspace completo para monitorar um deploy: um painel para logs, outro para o servidor, e um terceiro para comandos. Monte tudo usando tmux!',
    steps: [
      {
        id: 'boss-tmux-1',
        prompt: '> Comece criando uma sessao do tmux chamada "deploy".',
        check: (cmd) => /^tmux\s+new-session\s+-s\s+deploy$/.test(cmd.trim()),
        expectedOutput: '(nova sessao "deploy" criada)',
        hints: [
          'Crie uma sessao nomeada com `tmux new-session -s`.',
          'O comando e `tmux new-session -s deploy`.',
        ],
        feedbackRules: [
          { pattern: /^tmux\s+new-session$/, message: 'Voce precisa nomear a sessao! Adicione `-s deploy`.' },
        ],
      },
      {
        id: 'boss-tmux-2',
        prompt: '> Divida o terminal horizontalmente para ter dois paineis lado a lado.',
        check: (cmd) => /^tmux\s+split-window\s+-h$/.test(cmd.trim()),
        expectedOutput: '(painel dividido — agora voce tem dois paineis lado a lado)',
        hints: [
          'Use `split-window` com a flag para divisao horizontal.',
          'O comando e `tmux split-window -h`.',
        ],
        feedbackRules: [
          { pattern: /^tmux\s+split-window\s+-v/, message: '`-v` divide verticalmente. Para lado a lado, use `-h`.' },
        ],
      },
      {
        id: 'boss-tmux-3',
        prompt: '> Agora divida um dos paineis verticalmente para ter tres areas de trabalho.',
        check: (cmd) => /^tmux\s+split-window\s+-v$/.test(cmd.trim()),
        expectedOutput: '(painel dividido — agora voce tem tres paineis)',
        hints: [
          'Divida verticalmente para criar um terceiro painel.',
          'Use `tmux split-window -v`.',
        ],
        feedbackRules: [
          { pattern: /^tmux\s+split-window\s+-h/, message: 'Voce ja tem dois lado a lado. Agora divida verticalmente com `-v` para criar o terceiro.' },
        ],
      },
      {
        id: 'boss-tmux-4',
        prompt: '> Workspace montado! Agora liste as sessoes para confirmar que "deploy" esta ativa.',
        check: (cmd) => /^tmux\s+(list-sessions|ls)$/.test(cmd.trim()),
        expectedOutput: 'deploy: 1 windows (created Mar 04 10:30) (attached)',
        hints: [
          'Use o subcomando que lista sessoes ativas.',
          'O comando e `tmux list-sessions` ou `tmux ls`.',
        ],
        feedbackRules: [
          { pattern: /^tmux\s+attach/, message: 'Voce ja esta na sessao! Use `tmux list-sessions` para listar as sessoes ativas.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-tmux-multitask',
  },

  achievements: ['tmux-basics', 'boss-tmux-multitask'],
};
