import type { Module } from '../../types';

export const pipesStreamsModule: Module = {
  id: 'pipes-streams',
  title: 'Pipes e Redirecionamento',
  description: 'Conecte comandos entre si e redirecione o fluxo de dados como um profissional.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `No Linux, todo comando lê entrada e produz saída. A mágica acontece quando você conecta eles. Este módulo cobre 3 grandes ideias:\n\n` +
      `**1. Pipes (\`|\`)** — Envia a saída de um comando como entrada para o próximo.\n` +
      `Todo comando tem uma saída padrão (stdout). O pipe pega essa saída e alimenta como entrada padrão (stdin) para o próximo comando. Você pode encadear quantos quiser:\n` +
      `\`command1 | command2 | command3\`\n\n` +
      `**2. Redirect Sobrescrever (\`>\`)** — Envia a saída para um arquivo em vez da tela. CUIDADO: isso destrói o conteúdo anterior do arquivo!\n\n` +
      `**3. Redirect Append (\`>>\`)** — Adiciona a saída ao final de um arquivo sem apagar o que já está lá.\n\n` +
      `Comandos-chave para trabalhar com pipes e redirecionamento:\n` +
      `• **echo** — Imprime texto na tela (ou em um pipe/arquivo).\n` +
      `• **cat** — Lê um arquivo e imprime no stdout. Ótimo para iniciar um pipe.\n` +
      `• **wc** — Conta linhas (\`-l\`), palavras (\`-w\`) ou caracteres (\`-c\`).\n` +
      `• **grep** — Filtra linhas que correspondem a um padrão.\n` +
      `• **head / tail** — Mostra as primeiras ou últimas N linhas da saída.\n` +
      `• **sort** — Ordena linhas alfabeticamente ou numericamente.`,
    analogy:
      'Pipes são como canos de água — os dados fluem de um comando para o próximo. Cada comando é um filtro ou transformador ao longo do pipeline. Redirects (\`>\` e \`>>\`) são como torneiras que enviam o fluxo para um arquivo em vez da tela. \`>\` troca a água do balde, enquanto \`>>\` despeja mais água no mesmo balde.',
    syntax:
      'command1 | command2        # pipe output of command1 into command2\ncommand > file             # write output to file (overwrite)\ncommand >> file            # append output to file\necho "text"                # print text to stdout\ncat file                   # read file to stdout\nwc [-l|-w|-c] [file]       # count lines/words/chars\ngrep "pattern" [file]      # filter lines matching pattern\nhead -N file               # show first N lines\ntail -N file               # show last N lines',
    commandBreakdowns: [
      {
        title: 'Pipeline de filtragem',
        command: "cat access.log | grep 'ERROR' | cut -d' ' -f1,4 | sort | uniq -c",
        parts: [
          { text: 'cat access.log', label: 'Lê o conteúdo do arquivo e envia para stdout' },
          { text: '|', label: 'Pipe — conecta a saída de um comando à entrada do próximo' },
          { text: "grep 'ERROR'", label: 'Filtra apenas as linhas que contêm "ERROR"' },
          { text: "cut -d' ' -f1,4", label: 'Recorta campos: -d\' \' (delimitador = espaço), -f1,4 (campos 1 e 4)' },
          { text: 'sort', label: 'Ordena as linhas (necessário para uniq funcionar)' },
          { text: 'uniq -c', label: 'Remove duplicatas e conta ocorrências de cada linha' },
        ],
      },
      {
        title: 'Redirecionamento de saída e erro',
        command: "find / -name '*.conf' > resultados.txt 2> erros.txt",
        parts: [
          { text: "find / -name '*.conf'", label: 'Busca todos os arquivos .conf a partir da raiz' },
          { text: '> resultados.txt', label: 'Redireciona stdout (saída padrão) para o arquivo — sobrescreve' },
          { text: '2> erros.txt', label: 'Redireciona stderr (fd 2 = erros) para outro arquivo' },
        ],
      },
    ],
    examples: [
      { command: 'echo "Hello Linux"', output: 'Hello Linux', explanation: 'Imprime o texto no terminal. A forma mais simples de produzir saída.' },
      { command: 'echo "Hello Linux" > hello.txt', output: '', explanation: 'Escreve "Hello Linux" no hello.txt. Se o arquivo existir, ele é sobrescrito.' },
      { command: 'cat hello.txt', output: 'Hello Linux', explanation: 'Lê o arquivo e imprime seu conteúdo na tela.' },
      { command: 'ls | wc -l', output: '8', explanation: 'Lista arquivos e depois conta quantas linhas — te dando a contagem de arquivos.' },
      { command: 'cat /etc/passwd | grep bash', output: 'root:x:0:0:root:/root:/bin/bash\nenzo:x:1000:...:/bin/bash', explanation: 'Lê o arquivo passwd e filtra apenas linhas contendo "bash".' },
      { command: 'echo "log entry" >> server.log', output: '', explanation: 'Adiciona o texto ao server.log sem apagar o conteúdo existente.' },
      { command: 'cat access.log | grep ERROR | wc -l', output: '42', explanation: 'Encadeia 3 comandos: lê o log, filtra erros, conta. Esse é o poder dos pipes.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^echo\s+['"](.+?)['"]\s*$/, output: '$1', description: 'Print text to stdout' },
      { pattern: /^echo\s+['"](.+?)['"]\s*>\s*\S+/, output: '', description: 'Write text to a file (overwrite)' },
      { pattern: /^echo\s+['"](.+?)['"]\s*>>\s*\S+/, output: '', description: 'Append text to a file' },
      { pattern: /^cat\s+hello\.txt$/, output: 'Hello Linux', description: 'Read hello.txt' },
      { pattern: /^cat\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200', description: 'Read the access log' },
      { pattern: /^cat\s+\/etc\/passwd$/, output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nenzo:x:1000:1000:Enzo:/home/enzo:/bin/bash', description: 'Read the passwd file' },
      { pattern: /^ls\s*\|?\s*$/, output: 'Desktop  Documents  Downloads  Music  Pictures  access.log  hello.txt  scripts', description: 'List files' },
      { pattern: /^ls\s*\|\s*wc\s+-l$/, output: '8', description: 'Count files via pipe' },
      { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?$/, output: '2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:09 ERROR Request GET /api/config 502', description: 'Filter errors from log' },
      { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*\|\s*wc\s+-l$/, output: '4', description: 'Count error lines' },
      { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*\|\s*wc\s+-l$/, output: '4', description: 'Chain: read, filter, count' },
      { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>\s*errors\.txt$/, output: '', description: 'Save errors to file' },
      { pattern: /^wc\s+-l\s+\S+/, output: '10 access.log', description: 'Count lines in file' },
      { pattern: /^wc\s+-w\s+hello\.txt$/, output: '2 hello.txt', description: 'Count words in hello.txt' },
      { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-w$/, output: '2', description: 'Pipe file to word count' },
      { pattern: /^head\s+-\d+\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200', description: 'Show first lines of log' },
      { pattern: /^tail\s+-10\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200', description: 'Show last 10 lines of log' },
      { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+bash\s*\|\s*wc\s+-l$/, output: '2', description: 'Count bash users' },
      { pattern: /^sort\s+\S+/, output: '(sorted output)', description: 'Sort a file' },
    ],
    contextHints: [
      'Tente `echo "Hello Linux"` para imprimir texto na tela.',
      'Use `echo "text" > file.txt` para escrever texto em um arquivo.',
      'Use `cat file.txt` para ler um arquivo.',
      'Encadeie comandos com `|` — tente `ls | wc -l` para contar arquivos.',
      'Use `grep` para filtrar: `cat access.log | grep ERROR`',
      'Conte coisas com `wc`: `-l` para linhas, `-w` para palavras, `-c` para caracteres.',
      'Tente encadear 3 comandos: `cat access.log | grep ERROR | wc -l`',
      'Salve a saída em um arquivo: `grep ERROR access.log > errors.txt`',
    ],
  },

  drills: [
    {
      id: 'pipes-drill-1',
      prompt: 'Conte quantos arquivos e pastas existem no diretório atual. Use um pipe para conectar dois comandos.',
      difficulty: 'easy',
      check: (cmd) => /^ls\s*\|\s*wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '8',
      hints: [
        'Você precisa de dois comandos: um para listar arquivos, outro para contar linhas.',
        'Passe `ls` por pipe para `wc -l` para contar as linhas da saída.',
      ],
      feedbackRules: [
        { pattern: /^ls$/, message: 'Isso lista os arquivos, mas você precisa contá-los. Passe a saída por pipe para `wc -l`.' },
        { pattern: /^wc\s+-l$/, message: '`wc -l` conta linhas, mas precisa de entrada! Passe `ls` por pipe: `ls | wc -l`.' },
        { pattern: /^ls\s*\|\s*wc$/, message: 'Quase! `wc` sozinho mostra linhas, palavras e caracteres. Use `wc -l` para pegar só a contagem de linhas.' },
        { pattern: /^ls\s+-l\s*\|\s*wc\s+-l/, message: 'Funciona, mas inclui a linha "total". Para este drill, use apenas `ls | wc -l`.' },
      ],
      xp: 50,
    },
    {
      id: 'pipes-drill-2',
      prompt: 'Salve o texto "Hello Linux" em um arquivo chamado hello.txt usando echo e redirecionamento de saída.',
      difficulty: 'easy',
      check: (cmd) => /^echo\s+['"]Hello Linux['"]\s*>\s*hello\.txt$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Use `echo` para produzir o texto e `>` para enviá-lo a um arquivo.',
        'O comando é: `echo \'Hello Linux\' > hello.txt`',
      ],
      feedbackRules: [
        { pattern: /^echo\s+Hello Linux$/, message: 'Isso imprime na tela. Use `>` para redirecionar para um arquivo: `echo \'Hello Linux\' > hello.txt`.' },
        { pattern: /^echo\s+['"]Hello Linux['"]\s*$/, message: 'Bom echo! Agora redirecione para hello.txt com `>`.' },
        { pattern: /^echo\s+['"]Hello Linux['"]\s*>>\s*hello\.txt$/, message: '`>>` faz append. Para este drill, use `>` para escrever (sobrescrever) o arquivo.' },
        { pattern: /^cat\s+.*>\s*hello\.txt$/, message: 'Queremos escrever texto novo, não copiar um arquivo. Use `echo` em vez de `cat`.' },
        { pattern: /^echo\s+['"]hello linux['"]\s*>/i, message: 'Atenção à capitalização! Deve ser "Hello Linux" com H e L maiúsculos.' },
      ],
      xp: 50,
    },
    {
      id: 'pipes-drill-3',
      prompt: 'Leia o arquivo hello.txt e conte quantas palavras ele contém. Use um pipe para conectar os comandos.',
      difficulty: 'medium',
      check: (cmd) => /^cat\s+hello\.txt\s*\|\s*wc\s+-w$/.test(cmd.trim()),
      expectedOutput: '2',
      hints: [
        'Você precisa do `cat` para ler o arquivo e depois pipe para um comando de contagem.',
        'A flag para contar palavras é `-w`. Tente `cat hello.txt | wc -w`.',
      ],
      feedbackRules: [
        { pattern: /^cat\s+hello\.txt$/, message: 'Isso lê o arquivo mas não conta. Passe por pipe para `wc -w` para contar palavras.' },
        { pattern: /^wc\s+-w\s+hello\.txt$/, message: 'Isso funciona no Linux real! Mas este drill pede para praticar pipes. Use `cat hello.txt | wc -w`.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-l$/, message: 'Perto! `-l` conta linhas. Você quer `-w` para contagem de palavras.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-c$/, message: '`-c` conta caracteres. Você quer `-w` para contagem de palavras.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc$/, message: 'Quase! Adicione `-w` para pegar só a contagem de palavras: `cat hello.txt | wc -w`.' },
      ],
      xp: 75,
    },
    {
      id: 'pipes-drill-4',
      prompt: 'Encadeie 3 comandos: leia /etc/passwd, filtre as linhas que contêm "bash" e conte quantas são.',
      difficulty: 'hard',
      check: (cmd) => /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?\s*\|\s*wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '2',
      hints: [
        'Você precisa de 3 comandos conectados por 2 pipes: ler | filtrar | contar.',
        'Comece com `cat /etc/passwd`, pipe para `grep bash`, pipe para `wc -l`.',
      ],
      feedbackRules: [
        { pattern: /^cat\s+\/etc\/passwd$/, message: 'Bom começo! Agora passe por pipe para `grep bash` para filtrar, depois para `wc -l` para contar.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?$/, message: 'Dois comandos encadeados! Agora adicione mais um pipe para `wc -l` para contar as linhas correspondentes.' },
        { pattern: /^grep\s+['"]?bash['"]?\s+\/etc\/passwd\s*\|\s*wc\s+-l$/, message: 'Funciona na prática, mas este drill pede para encadear 3 comandos começando com `cat`.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*wc\s+-l$/, message: 'Você está contando TODAS as linhas. Insira `grep bash` entre cat e wc para filtrar primeiro.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?\s*\|\s*wc\s+-w$/, message: 'Quase perfeito! Use `-l` (linhas) em vez de `-w` (palavras) para contar linhas correspondentes.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'O Analisador de Logs',
    scenario: 'Seu servidor web está dando problema. Usuários estão reportando erros e seu chefe quer um relatório ASAP. Analise o access log para encontrar o problema e salve as evidências.',
    steps: [
      {
        id: 'boss-pipes-1',
        prompt: '> O access log está no diretório atual. Comece vendo as últimas 10 linhas para ter uma visão rápida da atividade recente.',
        check: (cmd) => /^tail\s+-10\s+access\.log$/.test(cmd.trim()),
        expectedOutput: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200',
        hints: ['Use `tail` com `-10` para mostrar as últimas 10 linhas de um arquivo.'],
        feedbackRules: [
          { pattern: /^cat\s+access\.log$/, message: 'Isso mostra o arquivo inteiro. Use `tail -10 access.log` para ver só as últimas 10 linhas.' },
          { pattern: /^head/, message: '`head` mostra o começo. Você quer `tail` para ver as entradas mais recentes.' },
          { pattern: /^tail\s+access\.log$/, message: 'Boa ideia! Mas especifique a quantidade: `tail -10 access.log`.' },
        ],
      },
      {
        id: 'boss-pipes-2',
        prompt: '> Dá pra ver entradas ERROR misturadas. Conte o total de linhas ERROR no log usando grep e wc.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+access\.log\s*\|\s*wc\s+-l$/.test(cmd.trim()),
        expectedOutput: '4',
        hints: [
          'Use `grep` para encontrar linhas ERROR, depois pipe para `wc -l` para contá-las.',
          'Tente: `grep ERROR access.log | wc -l`',
        ],
        feedbackRules: [
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log$/, message: 'Isso mostra os erros, mas seu chefe quer um número. Passe por pipe para `wc -l` para contar.' },
          { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*\|\s*wc\s+-l$/, message: 'Funciona, mas dá pra simplificar: `grep` lê arquivos diretamente. Tente `grep ERROR access.log | wc -l`.' },
          { pattern: /^wc\s+-l\s+access\.log$/, message: 'Isso conta TODAS as linhas. Filtre por ERROR primeiro com `grep`.' },
        ],
      },
      {
        id: 'boss-pipes-3',
        prompt: '> 4 erros! Salve todas as linhas ERROR em um arquivo chamado errors.txt para anexar ao seu relatório de incidente.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>\s*errors\.txt$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `grep` para encontrar as linhas e `>` para redirecioná-las para um arquivo.',
          'Tente: `grep ERROR access.log > errors.txt`',
        ],
        feedbackRules: [
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>>\s*errors\.txt$/, message: '`>>` faz append. Como é um arquivo novo, use `>` para escrever: `grep ERROR access.log > errors.txt`.' },
          { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*>\s*errors\.txt$/, message: 'Funciona! Mas dá pra simplificar — `grep` lê arquivos diretamente: `grep ERROR access.log > errors.txt`.' },
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log$/, message: 'Isso imprime os erros na tela. Redirecione para um arquivo com `>`: `grep ERROR access.log > errors.txt`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-log-analyzer',
  },

  achievements: ['pipe-master', 'boss-log-analyzer'],
};
