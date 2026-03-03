import type { Module } from '../../types';

export const textProcessingModule: Module = {
  id: 'text-processing',
  title: 'Processamento de Texto',
  description: 'Busque, filtre e transforme texto com as ferramentas poderosas da linha de comando.',
  tier: 'Specialist',
  prerequisites: ['files-nav'],
  isSideQuest: false,

  briefing: {
    concept:
      `O Linux foi construído por pessoas que amavam texto. A linha de comando te dá ferramentas incrivelmente poderosas para buscar, filtrar e transformar texto — geralmente mais rápido que qualquer editor com interface gráfica.\n\n` +
      `**Buscando texto:**\n` +
      `• **grep "pattern" file** — Busca linhas que correspondem a um padrão. A ferramenta de texto mais usada.\n` +
      `• **grep -i** — Busca case-insensitive (ignora maiúsculas/minúsculas).\n` +
      `• **grep -r** — Busca recursiva em todos os arquivos de uma árvore de diretórios.\n` +
      `• **grep -v** — Inverte a busca: mostra linhas que NÃO correspondem ao padrão.\n` +
      `• **grep -n** — Mostra números de linha junto às linhas encontradas.\n` +
      `• **grep -c** — Conta o número de linhas encontradas em vez de mostrá-las.\n\n` +
      `**Inspecionando texto:**\n` +
      `• **head -N file** — Mostra as primeiras N linhas de um arquivo.\n` +
      `• **tail -N file** — Mostra as últimas N linhas de um arquivo.\n` +
      `• **wc -l file** — Conta linhas em um arquivo. Também: \`-w\` para palavras, \`-c\` para caracteres.\n\n` +
      `**Transformando texto:**\n` +
      `• **sed 's/old/new/g' file** — Editor de fluxo: busca e substitui texto. O \`g\` significa "global" (todas as ocorrências por linha).`,
    analogy:
      '`grep` é como um marca-texto — encontra e mostra apenas as linhas que correspondem ao seu padrão. `sed` é como buscar-e-substituir turbinado — edita texto fluindo por um pipe sem nunca abrir um arquivo em um editor. `head` e `tail` são como espiar o topo ou o fundo de uma pilha de papéis.',
    syntax:
      'grep "pattern" file          # find lines matching pattern\ngrep -i "pattern" file       # case-insensitive search\ngrep -r "pattern" dir/       # recursive search in directory\ngrep -v "pattern" file       # show lines NOT matching\ngrep -n "pattern" file       # show line numbers\ngrep -c "pattern" file       # count matching lines\nhead -N file                 # show first N lines\ntail -N file                 # show last N lines\nwc -l file                   # count lines\nsed \'s/old/new/g\' file       # find and replace text',
    examples: [
      { command: "grep 'error' log.txt", output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', explanation: 'Encontra todas as linhas contendo "error" em log.txt. A busca é case-sensitive por padrão.' },
      { command: "grep -i 'warning' log.txt", output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call', explanation: 'Busca case-insensitive. Encontra "WARNING", "Warning", "warning", etc.' },
      { command: "grep -r 'TODO' src/", output: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment', explanation: 'Busca em cada arquivo no diretório src/ e seus subdiretórios.' },
      { command: "grep -v 'INFO' log.txt", output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:03:11 WARNING: disk usage at 85%', explanation: 'Mostra linhas que NÃO contêm "INFO" — útil para filtrar ruído.' },
      { command: 'wc -l data.txt', output: '150 data.txt', explanation: 'Conta o número de linhas. Útil para saber o tamanho de um arquivo.' },
      { command: "sed 's/foo/bar/g' config.txt", output: '(contents of config.txt with all "foo" replaced by "bar")', explanation: 'Substitui toda ocorrência de "foo" por "bar". O `s` significa substitute, `g` significa global (todas as ocorrências por linha).' },
      { command: 'head -5 log.txt', output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused', explanation: 'Mostra apenas as primeiras 5 linhas — ótimo para visualizar arquivos grandes.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^cat\s+log\.txt$/, output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:08:15 INFO: request processed\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:15:00 INFO: cache cleared\n2024-03-01 10:20:33 Warning: deprecated API call\n2024-03-01 10:25:00 INFO: backup completed\n2024-03-01 10:30:18 error: disk full', description: 'View the full log file' },
      { pattern: /^cat\s+data\.txt$/, output: 'Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry\nIvy\nJack\nKaren\nLeo\nMia\nNick\nOlivia', description: 'View data.txt' },
      { pattern: /^cat\s+(app\.conf|config\.txt)$/, output: 'app_name=myapp\ndebug=true\nlog_level=info\nmax_connections=100\ndebug=true\nport=8080\ncache_enabled=false\ndebug=true\ntimeout=30', description: 'View app.conf / config.txt' },
      { pattern: /^grep\s+['"]?error['"]?\s+log\.txt$/, output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', description: 'Search for error in log.txt' },
      { pattern: /^grep\s+-i\s+['"]?error['"]?\s+log\.txt$/, output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', description: 'Case-insensitive search for error' },
      { pattern: /^grep\s+-i\s+['"]?warning['"]?\s+log\.txt$/, output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call', description: 'Case-insensitive search for warning' },
      { pattern: /^grep\s+-v\s+['"]?INFO['"]?\s+log\.txt$/, output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:20:33 Warning: deprecated API call\n2024-03-01 10:30:18 error: disk full', description: 'Show non-INFO lines' },
      { pattern: /^grep\s+-n\s+['"]?error['"]?\s+log\.txt$/, output: '5:2024-03-01 10:05:02 error: connection refused\n7:2024-03-01 10:12:45 error: timeout exceeded\n11:2024-03-01 10:30:18 error: disk full', description: 'Search with line numbers' },
      { pattern: /^grep\s+-c\s+['"]?error['"]?\s+log\.txt$/, output: '3', description: 'Count error lines' },
      { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s+src\/$/, output: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment', description: 'Recursive search for TODO' },
      { pattern: /^grep\s+['"]?debug=true['"]?\s+(app\.conf|config\.txt)$/, output: 'debug=true\ndebug=true\ndebug=true', description: 'Find debug=true entries' },
      { pattern: /^sed\s+'s\/debug=true\/debug=false\/g'\s+(app\.conf|config\.txt)$/, output: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30', description: 'Replace debug=true with debug=false' },
      { pattern: /^sed\s+'s\/foo\/bar\/g'\s+\S+$/, output: '(file contents with foo replaced by bar)', description: 'Generic sed replace' },
      { pattern: /^grep\s+['"]?debug['"]?\s+(app\.conf|config\.txt)$/, output: 'debug=false\ndebug=false\ndebug=false', description: 'Verify debug settings' },
      { pattern: /^wc\s+-l\s+\S+$/, output: '150 data.txt', description: 'Count lines in a file' },
      { pattern: /^wc\s+-l\s+log\.txt$/, output: '11 log.txt', description: 'Count lines in log.txt' },
      { pattern: /^wc\s+-w\s+\S+$/, output: '15 data.txt', description: 'Count words in a file' },
      { pattern: /^head\s+-\d+\s+log\.txt$/, output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused', description: 'Show first lines of log' },
      { pattern: /^tail\s+-\d+\s+log\.txt$/, output: '2024-03-01 10:25:00 INFO: backup completed\n2024-03-01 10:30:18 error: disk full', description: 'Show last lines of log' },
      { pattern: /^ls$/, output: 'app.conf  config.txt  data.txt  log.txt  src/', description: 'List files' },
    ],
    contextHints: [
      'Tente `grep \'error\' log.txt` para encontrar todas as linhas de erro no log.',
      'Use `grep -i` para busca case-insensitive: `grep -i \'warning\' log.txt`.',
      'Busque recursivamente com `grep -r \'TODO\' src/` para encontrar TODOs em todos os arquivos.',
      'Use `grep -v \'INFO\' log.txt` para excluir linhas INFO e focar nos problemas.',
      'Conte linhas com `wc -l data.txt`.',
      'Visualize um arquivo com `head -5 log.txt` ou `tail -5 log.txt`.',
      'Use `sed \'s/old/new/g\' file` para buscar e substituir texto.',
      'Combine ferramentas: `grep \'error\' log.txt | wc -l` conta linhas de erro.',
      'Veja `cat log.txt` ou `cat app.conf` para ver os arquivos com que você pode trabalhar.',
    ],
  },

  drills: [
    {
      id: 'text-drill-1',
      prompt: 'Busque a palavra \'error\' em log.txt e mostre todas as linhas correspondentes.',
      difficulty: 'easy',
      check: (cmd) => /^grep\s+['"]?error['"]?\s+log\.txt$/.test(cmd.trim()),
      expectedOutput: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full',
      hints: [
        'O comando para buscar texto é `grep`. Ele recebe um padrão e um nome de arquivo.',
        'Tente: `grep \'error\' log.txt`',
      ],
      feedbackRules: [
        { pattern: /^find\s/, message: '`find` busca arquivos por nome. Para buscar texto *dentro* de um arquivo, use `grep`.' },
        { pattern: /^search\s/i, message: '`search` não é um comando Linux. O comando de busca de texto é `grep \'error\' log.txt`.' },
        { pattern: /^grep\s+['"]?error['"]?\s*$/, message: 'Você disse ao grep o que buscar, mas não onde! Adicione o nome do arquivo: `grep \'error\' log.txt`.' },
        { pattern: /^cat\s+log\.txt\s*\|\s*grep\s+['"]?error['"]?$/, message: 'Funciona na prática! Mas `grep` lê arquivos diretamente — tente `grep \'error\' log.txt`.' },
        { pattern: /^grep\s+-i\s+['"]?error['"]?\s+log\.txt$/, message: 'Perto! `-i` é para busca case-insensitive. Para este drill, `grep \'error\' log.txt` é o que precisamos.' },
      ],
      xp: 50,
    },
    {
      id: 'text-drill-2',
      prompt: 'Conte quantas linhas existem no arquivo data.txt.',
      difficulty: 'easy',
      check: (cmd) => /^wc\s+-l\s+data\.txt$/.test(cmd.trim()),
      expectedOutput: '150 data.txt',
      hints: [
        'O comando `wc` conta coisas. Qual flag conta linhas?',
        'Use `wc -l data.txt` — a flag `-l` conta linhas.',
      ],
      feedbackRules: [
        { pattern: /^wc\s+data\.txt$/, message: 'Sem flag, `wc` mostra linhas, palavras E caracteres. Use `wc -l data.txt` para só a contagem de linhas.' },
        { pattern: /^wc\s+-w\s+data\.txt$/, message: '`-w` conta palavras. Para contagem de linhas, use `-l`: `wc -l data.txt`.' },
        { pattern: /^wc\s+-c\s+data\.txt$/, message: '`-c` conta caracteres/bytes. Para contagem de linhas, use `-l`: `wc -l data.txt`.' },
        { pattern: /^cat\s+data\.txt\s*\|\s*wc\s+-l$/, message: 'Funciona! Mas `wc` lê arquivos diretamente — mais simples: `wc -l data.txt`.' },
        { pattern: /^wc\s+-l\s*$/, message: 'Você precisa especificar qual arquivo contar: `wc -l data.txt`.' },
        { pattern: /^grep\s+-c/, message: '`grep -c` conta linhas correspondentes. Para contagem total de linhas, use `wc -l data.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'text-drill-3',
      prompt: 'Busque \'warning\' em log.txt, mas faça a busca case-insensitive (encontre WARNING, Warning, warning, etc.).',
      difficulty: 'medium',
      check: (cmd) => /^grep\s+-i\s+['"]?warning['"]?\s+log\.txt$/.test(cmd.trim()),
      expectedOutput: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call',
      hints: [
        'Você precisa do `grep` com uma flag que ignora maiúsculas/minúsculas. A flag é `-i`.',
        'Use `-i` para case-insensitive: `grep -i \'warning\' log.txt`.',
      ],
      feedbackRules: [
        { pattern: /^grep\s+['"]?warning['"]?\s+log\.txt$/, message: 'Isso só encontra "warning" em minúsculas. O log tem "WARNING" e "Warning" também. Adicione `-i` para busca case-insensitive.' },
        { pattern: /^grep\s+['"]?WARNING['"]?\s+log\.txt$/, message: 'Isso só encontra "WARNING" em maiúsculas. Para encontrar todos os casos, use `grep -i \'warning\' log.txt`.' },
        { pattern: /^grep\s+-I\s+/, message: 'Quase! A flag é `-i` minúsculo, não `-I` maiúsculo.' },
        { pattern: /^grep\s+['"]?\[Ww\]arning['"]?\s+log\.txt$/, message: 'Regex criativo! Mas tem um jeito mais simples — use `-i` para case-insensitive: `grep -i \'warning\' log.txt`.' },
      ],
      xp: 75,
    },
    {
      id: 'text-drill-4',
      prompt: 'Use sed para substituir todas as ocorrências de \'debug=true\' por \'debug=false\' no arquivo app.conf.',
      difficulty: 'medium',
      check: (cmd) => /^sed\s+'s\/debug=true\/debug=false\/g'\s+app\.conf$/.test(cmd.trim()),
      expectedOutput: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30',
      hints: [
        '`sed` usa o formato: `sed \'s/old/new/g\' file`. O `s` significa substitute, `g` significa global.',
        'Tente: `sed \'s/debug=true/debug=false/g\' app.conf`',
      ],
      feedbackRules: [
        { pattern: /^sed\s+'s\/debug=true\/debug=false\/'\s+app\.conf$/, message: 'Quase! Sem a flag `g`, apenas a primeira ocorrência em cada linha é substituída. Adicione `g` para global: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^sed\s+s\/debug=true\/debug=false\/g\s+app\.conf$/, message: 'A expressão sed precisa de aspas: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^grep\s/, message: '`grep` encontra texto mas não consegue alterá-lo. Use `sed` para buscar e substituir.' },
        { pattern: /^sed\s+'s\/true\/false\/g'\s+app\.conf$/, message: 'Isso substitui TODO "true" por "false" — muito amplo! Seja específico: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^replace\s/i, message: '`replace` não é um comando padrão. Use `sed \'s/debug=true/debug=false/g\' app.conf`.' },
      ],
      xp: 75,
    },
    {
      id: 'text-drill-5',
      prompt: 'Busque recursivamente no diretório src/ por todas as linhas contendo \'TODO\'.',
      difficulty: 'hard',
      check: (cmd) => /^grep\s+-r\s+['"]?TODO['"]?\s+src\/$/.test(cmd.trim()),
      expectedOutput: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment',
      hints: [
        'Você precisa do `grep` com uma flag que busca recursivamente em diretórios.',
        'A flag para busca recursiva é `-r`. Tente `grep -r \'TODO\' src/`.',
      ],
      feedbackRules: [
        { pattern: /^grep\s+['"]?TODO['"]?\s+src\/$/, message: '`grep` não consegue buscar em diretórios sem a flag `-r` (recursive). Adicione: `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s*$/, message: 'Você precisa especificar em qual diretório buscar. Adicione `src/` no final: `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s+\.$/, message: 'Isso busca no diretório atual inteiro. Restrinja para apenas `src/`: `grep -r \'TODO\' src/`.' },
        { pattern: /^find\s+src\/\s+-name/, message: '`find` busca arquivos por nome. Para buscar o *conteúdo* dos arquivos, use `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-R\s+['"]?TODO['"]?\s+src\/$/, message: 'Perto! `-R` funciona na prática (segue symlinks), mas a flag padrão é `-r` minúsculo: `grep -r \'TODO\' src/`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'O Cirurgião de Config',
    scenario: 'Um arquivo de config de produção tem o modo debug habilitado acidentalmente em vários lugares. Você precisa encontrar cada ocorrência, corrigir todas e verificar a correção — sem abrir um editor.',
    steps: [
      {
        id: 'boss-text-1',
        prompt: '> O app está logando dados sensíveis porque o modo debug está ligado. Primeiro, encontre todas as linhas em app.conf que tenham \'debug=true\'.',
        check: (cmd) => /^grep\s+['"]?debug=true['"]?\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'debug=true\ndebug=true\ndebug=true',
        hints: ['Use `grep` para buscar o padrão no arquivo de config.'],
        feedbackRules: [
          { pattern: /^cat\s+app\.conf$/, message: 'Isso mostra o arquivo inteiro. Use `grep \'debug=true\' app.conf` para encontrar só as linhas problemáticas.' },
          { pattern: /^grep\s+['"]?debug['"]?\s+app\.conf$/, message: 'Isso encontra qualquer linha com "debug". Seja mais específico: `grep \'debug=true\' app.conf`.' },
        ],
      },
      {
        id: 'boss-text-2',
        prompt: '> 3 ocorrências de debug=true! Corrija todas de uma vez — substitua todo \'debug=true\' por \'debug=false\' usando sed.',
        check: (cmd) => /^sed\s+'s\/debug=true\/debug=false\/g'\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30',
        hints: ['Use `sed` com o comando substitute: `sed \'s/old/new/g\' file`.'],
        feedbackRules: [
          { pattern: /^sed\s+'s\/debug=true\/debug=false\/'\s+app\.conf$/, message: 'Sem a flag `g`, apenas uma ocorrência por linha é substituída. Adicione `g`: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
          { pattern: /^grep/, message: '`grep` encontra texto mas não consegue substituir. Use `sed` para buscar e substituir.' },
        ],
      },
      {
        id: 'boss-text-3',
        prompt: '> Agora verifique a correção. Busque em app.conf por linhas \'debug\' restantes para confirmar que todas dizem \'false\'.',
        check: (cmd) => /^grep\s+['"]?debug['"]?\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'debug=false\ndebug=false\ndebug=false',
        hints: ['Busque por "debug" no config para ver todas as configurações relacionadas a debug.'],
        feedbackRules: [
          { pattern: /^cat\s+app\.conf$/, message: 'Isso mostra o arquivo inteiro. Use `grep \'debug\' app.conf` para ver só as configurações de debug.' },
          { pattern: /^grep\s+['"]?debug=true['"]?\s+app\.conf$/, message: 'Buscar "debug=true" não mostraria nada se a correção funcionou. Busque apenas "debug" para ver todas as linhas de debug.' },
          { pattern: /^grep\s+['"]?debug=false['"]?\s+app\.conf$/, message: 'Isso confirmaria a correção, mas buscar só "debug" é mais completo — pega qualquer valor.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-config-surgeon',
  },

  achievements: ['text-ninja', 'boss-config-surgeon'],
};
