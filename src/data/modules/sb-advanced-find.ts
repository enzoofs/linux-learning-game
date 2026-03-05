import type { Module } from '../../types';

export const sbAdvancedFindModule: Module = {
  id: 'sb-advanced-find',
  title: 'Find Avancado',
  description: 'Domine o comando find e nunca mais perca um arquivo.',
  tier: 'Initiate',
  prerequisites: ['sb-shell-tricks'],
  isSideQuest: false,

  briefing: {
    concept:
      `O comando \`find\` e o detetive do sistema de arquivos. Ele vasculha diretorios recursivamente, aplicando filtros poderosos para localizar exatamente o que voce precisa.\n\n` +
      `Vamos explorar os principais poderes do \`find\`:\n\n` +
      `• **-name** — Busca por nome (aceita globbing). \`find . -name "*.log"\` encontra todos os arquivos .log.\n` +
      `• **-type** — Filtra por tipo: \`f\` para arquivos, \`d\` para diretorios.\n` +
      `• **-size** — Filtra por tamanho: \`+100M\` (maior que 100MB), \`-1k\` (menor que 1KB).\n` +
      `• **-mtime** — Filtra por data de modificacao: \`-7\` (ultimos 7 dias), \`+30\` (mais de 30 dias).\n` +
      `• **-exec** — Executa um comando em cada arquivo encontrado. O \`{}\` representa o arquivo.\n` +
      `• **xargs** — Alternativa ao \`-exec\`, recebe a lista de arquivos via pipe e passa como argumentos.`,
    analogy:
      'O `find` e como um rastreador profissional. Voce descreve as caracteristicas do alvo — nome, tipo, tamanho, idade — e ele vasculha cada canto do sistema ate encontrar. O `-exec` e como dar uma ordem: "quando encontrar, faca isso". E o `xargs` e o assistente que pega a lista de resultados e entrega para outro comando processar.',
    syntax:
      'find [caminho] [filtros] [acao]\nfind . -name "*.txt"              # busca por nome\nfind . -type f -size +10M         # arquivos maiores que 10MB\nfind . -mtime -7                  # modificados nos ultimos 7 dias\nfind . -name "*.tmp" -delete      # encontra e deleta\nfind . -name "*.sh" -exec chmod +x {} \\;  # executa comando\nfind . -name "*.log" | xargs wc -l        # conta linhas via xargs',
    commandBreakdowns: [
      {
        title: 'find com múltiplos filtros + ação',
        command: "find /var/log -name '*.log' -size +100M -mtime +30 -exec gzip {} \\;",
        parts: [
          { text: 'find /var/log', label: 'Busca recursiva a partir de /var/log' },
          { text: "-name '*.log'", label: 'Filtro: nome termina em .log' },
          { text: '-size +100M', label: 'Filtro: tamanho maior que 100 megabytes' },
          { text: '-mtime +30', label: 'Filtro: modificado há mais de 30 dias' },
          { text: '-exec gzip {}', label: 'Ação: comprime cada arquivo encontrado. {} = placeholder' },
          { text: '\\;', label: 'Termina o -exec (precisa escapar o ; para o shell não interpretar)' },
        ],
      },
    ],
    examples: [
      { command: 'find . -name "*.txt"', output: './notas.txt\n./docs/readme.txt\n./todo.txt', explanation: 'Busca recursivamente todos os arquivos .txt a partir do diretorio atual.' },
      { command: 'find /tmp -type d', output: '/tmp\n/tmp/cache\n/tmp/session', explanation: 'Lista apenas diretorios (-type d) dentro de /tmp.' },
      { command: 'find . -type f -size +1M', output: './video.mp4\n./backup.tar.gz', explanation: 'Encontra arquivos (nao diretorios) maiores que 1 megabyte.' },
      { command: 'find . -mtime -7', output: './projeto/main.py\n./notas.txt', explanation: 'Arquivos modificados nos ultimos 7 dias.' },
      { command: 'find . -name "*.log" -exec rm {} \\;', output: '', explanation: 'Encontra todos os .log e remove cada um com `rm`. O `{}` e substituido pelo caminho do arquivo.' },
      { command: 'find . -name "*.py" | xargs grep "import"', output: './app.py:import os\n./utils.py:import sys', explanation: '`xargs` passa os arquivos encontrados como argumentos para `grep`.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^find\s+\.\s+-name\s+"?\*\.txt"?$/, output: './notas.txt\n./docs/readme.txt\n./todo.txt' },
      { pattern: /^find\s+\.\s+-name\s+"?\*\.log"?$/, output: './app.log\n./logs/error.log\n./logs/system.log' },
      { pattern: /^find\s+\.\s+-type\s+d$/, output: '.\n./docs\n./logs\n./scripts\n./backup' },
      { pattern: /^find\s+\.\s+-type\s+f$/, output: './notas.txt\n./todo.txt\n./app.log\n./script.sh\n./docs/readme.txt' },
      { pattern: /^find\s+\.\s+-type\s+f\s+-size\s+\+\d+/, output: './backup/archive.tar.gz\n./video.mp4' },
      { pattern: /^find\s+\.\s+-mtime\s+-\d+/, output: './notas.txt\n./app.log\n./scripts/deploy.sh' },
      { pattern: /^find\s+\.\s+-name\s+"?\*\.\w+"?\s+-exec\s+/, output: '(comando executado em cada arquivo encontrado)' },
      { pattern: /^find\s+\.\s+-name\s+"?\*\.\w+"?\s+-delete$/, output: '' },
      { pattern: /^find\s+.*\|\s*xargs\s+/, output: '(xargs processando lista de arquivos)' },
      { pattern: /^locate\s+\w+/, output: '/usr/share/doc/readme\n/home/enzo/notas.txt' },
    ],
    contextHints: [
      'Tente `find . -name "*.txt"` para buscar arquivos por nome.',
      'Use `find . -type d` para listar apenas diretorios.',
      'Experimente `find . -type f -size +1M` para achar arquivos grandes.',
      'Teste `find . -mtime -7` para ver arquivos modificados recentemente.',
      'Combine `find` com `xargs`: `find . -name "*.log" | xargs wc -l`.',
    ],
  },

  drills: [
    {
      id: 'find-drill-1',
      prompt: 'Encontre todos os arquivos com extensao `.conf` a partir do diretorio atual.',
      difficulty: 'easy',
      check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.conf"?$/.test(cmd.trim()),
      expectedOutput: './etc/app.conf\n./config/db.conf\n./nginx.conf',
      hints: ['Use `find` com a opcao `-name` e um padrao com curinga.', 'O comando e `find . -name "*.conf"` — as aspas protegem o `*` do shell.'],
      feedbackRules: [
        { pattern: /^ls\s+\*\.conf/, message: '`ls` so lista no diretorio atual. Use `find .` para buscar recursivamente.' },
        { pattern: /^find\s+\.\s+\*\.conf/, message: 'Voce esqueceu o `-name` antes do padrao. Use `find . -name "*.conf"`.' },
      ],
      xp: 60,
    },
    {
      id: 'find-drill-2',
      prompt: 'Encontre todos os arquivos (nao diretorios) maiores que 10 megabytes a partir do diretorio atual.',
      difficulty: 'medium',
      check: (cmd) => /^find\s+\.\s+-type\s+f\s+-size\s+\+10M$/.test(cmd.trim()),
      expectedOutput: './backup/archive.tar.gz\n./video.mp4',
      hints: ['Combine `-type f` (apenas arquivos) com `-size` (filtro de tamanho).', 'O comando e `find . -type f -size +10M` — o `+` significa "maior que" e `M` e megabytes.'],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-size\s+\+10M$/, message: 'Quase! Mas sem `-type f`, voce pode incluir diretorios. Adicione `-type f`.' },
        { pattern: /^find\s+\.\s+-type\s+f\s+-size\s+10M$/, message: 'Faltou o `+` antes de `10M`. Use `+10M` para "maior que 10MB".' },
      ],
      xp: 60,
    },
    {
      id: 'find-drill-3',
      prompt: 'Encontre todos os arquivos `.sh` e torne-os executaveis com `-exec chmod +x`.',
      difficulty: 'hard',
      check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.sh"?\s+-exec\s+chmod\s+\+x\s+\{\}\s*\\;$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['`-exec` executa um comando para cada resultado. Use `{}` como placeholder para o arquivo.', 'O comando completo e `find . -name "*.sh" -exec chmod +x {} \\;` — o `\\;` encerra o `-exec`.'],
      feedbackRules: [
        { pattern: /^find.*-exec.*chmod.*\{\}$/, message: 'Faltou o `\\;` no final para encerrar o `-exec`.' },
        { pattern: /^chmod\s+\+x/, message: 'Use `find` com `-exec` para aplicar o `chmod` em todos os arquivos encontrados.' },
      ],
      xp: 60,
    },
    {
      id: 'find-drill-4',
      prompt: 'Encontre arquivos modificados nos ultimos 3 dias a partir do diretorio atual.',
      difficulty: 'easy',
      check: (cmd) => /^find\s+\.\s+-mtime\s+-3$/.test(cmd.trim()),
      expectedOutput: './notas.txt\n./app.log\n./scripts/deploy.sh',
      hints: ['A opcao `-mtime` filtra por tempo de modificacao em dias.', 'Use `find . -mtime -3` — o `-3` significa "menos de 3 dias atras".'],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-mtime\s+3$/, message: 'Sem o `-` antes do numero, voce busca arquivos modificados EXATAMENTE 3 dias atras. Use `-3`.' },
        { pattern: /^find\s+\.\s+-time/, message: 'A opcao correta e `-mtime` (modification time), nao `-time`.' },
      ],
      xp: 60,
    },
    {
      id: 'find-drill-5',
      prompt: 'Encontre todos os arquivos `.log` e conte o numero total de linhas usando `xargs` e `wc -l`.',
      difficulty: 'medium',
      check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.log"?\s*\|\s*xargs\s+wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '  142 ./app.log\n  89 ./logs/error.log\n  231 total',
      hints: ['Use pipe `|` para enviar a saida do `find` para o `xargs`.', 'O comando e `find . -name "*.log" | xargs wc -l` — o `xargs` passa os arquivos como argumentos para `wc -l`.'],
      feedbackRules: [
        { pattern: /^find.*\|\s*wc\s+-l$/, message: 'Sem `xargs`, o `wc -l` conta linhas da saida do find (nomes de arquivo), nao o conteudo. Use `xargs wc -l`.' },
        { pattern: /^find.*-exec\s+wc/, message: 'O `-exec` funciona, mas o drill pede que voce use `xargs`. Tente com pipe: `find ... | xargs wc -l`.' },
      ],
      xp: 60,
    },
  ],

  boss: {
    title: 'O Rastreador de Arquivos',
    scenario: 'O servidor esta uma bagunca. Arquivos temporarios, logs enormes e scripts sem permissao estao espalhados por todo o sistema. O Rastreador precisa da sua ajuda para limpar e organizar tudo usando o `find`.',
    steps: [
      {
        id: 'boss-find-1',
        prompt: '> O Rastreador diz: "Primeiro, encontre todos os arquivos `.tmp` no diretorio atual. Precisamos saber o tamanho do problema."',
        check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.tmp"?$/.test(cmd.trim()),
        expectedOutput: './cache/session.tmp\n./tmp/data.tmp\n./upload/file.tmp',
        hints: ['Use `find` com `-name` para buscar por extensao.', 'O comando e `find . -name "*.tmp"`.'],
        feedbackRules: [
          { pattern: /^ls\s+\*\.tmp/, message: '`ls` so ve o diretorio atual. Use `find .` para buscar recursivamente.' },
        ],
      },
      {
        id: 'boss-find-2',
        prompt: '> "Agora encontre os arquivos de log maiores que 50 megabytes. Esses sao os que estao comendo nosso disco."',
        check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.log"?\s+-size\s+\+50M$/.test(cmd.trim()) || /^find\s+\.\s+-type\s+f\s+-name\s+"?\*\.log"?\s+-size\s+\+50M$/.test(cmd.trim()),
        expectedOutput: './logs/access.log\n./logs/debug.log',
        hints: ['Combine `-name "*.log"` com `-size +50M`.', 'Use `find . -name "*.log" -size +50M`.'],
        feedbackRules: [
          { pattern: /^find.*-size\s+50M/, message: 'Sem o `+`, voce busca arquivos de EXATAMENTE 50MB. Use `+50M` para "maior que".' },
        ],
      },
      {
        id: 'boss-find-3',
        prompt: '> "Encontre todos os scripts `.sh` e torne-os executaveis com `-exec chmod +x`."',
        check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.sh"?\s+-exec\s+chmod\s+\+x\s+\{\}\s*\\;$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `-exec` para rodar um comando em cada arquivo encontrado.', 'O comando completo e `find . -name "*.sh" -exec chmod +x {} \\;`.'],
        feedbackRules: [
          { pattern: /^find.*-exec.*\{\}$/, message: 'Faltou o `\\;` para encerrar o `-exec`.' },
        ],
      },
      {
        id: 'boss-find-4',
        prompt: '> "Por fim, encontre e delete todos os arquivos `.tmp` de uma vez usando a opcao `-delete`."',
        check: (cmd) => /^find\s+\.\s+-name\s+"?\*\.tmp"?\s+-delete$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['O `find` tem uma opcao embutida para deletar: `-delete`.', 'Use `find . -name "*.tmp" -delete` — simples e direto.'],
        feedbackRules: [
          { pattern: /^find.*-exec\s+rm/, message: '`-exec rm` funciona, mas o `-delete` e mais eficiente. Use `find . -name "*.tmp" -delete`.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-advanced-find',
  },

  achievements: ['advanced-find-mastery', 'boss-advanced-find'],
};
