import type { Module } from '../../types';

export const sbOnelinersModule: Module = {
  id: 'sb-oneliners',
  title: 'One-Liners Epicos',
  description: 'Combine comandos em linhas unicas poderosas que fazem magica.',
  tier: 'GrandMaster',
  prerequisites: ['sb-logs', 'sb-git'],
  isSideQuest: false,

  briefing: {
    concept:
      `One-liners sao o auge do poder no terminal. Sao comandos que combinam multiplas ferramentas em uma unica linha, resolvendo problemas complexos de forma elegante e eficiente. Um bom one-liner pode substituir dezenas de linhas de script.\n\n` +
      `As tecnicas fundamentais para construir one-liners poderosos:\n\n` +
      `• **Pipes encadeados** — Conectar 3, 4, 5+ comandos com \`|\` para transformar dados em etapas.\n` +
      `• **awk + sed + grep** — A trindade sagrada do processamento de texto, combinados para extrair, transformar e filtrar.\n` +
      `• **while read** — Loop que processa entrada linha por linha, perfeito para automacao.\n` +
      `• **Substituicao de processo <()** — Trata a saida de um comando como se fosse um arquivo.\n` +
      `• **Agrupamento de comandos {}** — Executa multiplos comandos como um bloco unico.\n` +
      `• **xargs -P** — Executa comandos em paralelo para acelerar processamento massivo.`,
    analogy:
      'Pense em one-liners como receitas de cozinha relampago. Cada comando e um ingrediente, o pipe `|` e a esteira da cozinha industrial, e o resultado final e um prato gourmet — tudo preparado em uma unica linha de montagem sem pausas.',
    syntax:
      'comando1 | comando2 | comando3\ncomando | awk \'{print $N}\' | sort | uniq -c\ncomando | sed \'s/antigo/novo/g\'\nwhile read line; do comando "$line"; done < arquivo\ndiff <(comando1) <(comando2)\n{ cmd1; cmd2; } | cmd3\ncomando | xargs -P 4 -I {} cmd {}',
    examples: [
      { command: 'ps aux | awk \'{print $11}\' | sort | uniq -c | sort -rn | head -5', output: '   42 /usr/bin/python3\n   15 /usr/sbin/apache2\n   8 /usr/bin/node\n   3 /usr/sbin/sshd\n   2 /usr/bin/bash', explanation: 'Conta os processos mais comuns no sistema — pipe de 5 comandos.' },
      { command: 'cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -3', output: '  1523 192.168.1.100\n   847 10.0.0.50\n   234 172.16.0.1', explanation: 'Extrai os IPs mais frequentes de um log de acesso.' },
      { command: 'find . -name "*.log" | xargs -P 4 grep -l "ERROR"', output: './app/error.log\n./system/kern.log', explanation: 'Busca "ERROR" em todos os .log em paralelo com 4 processos simultaneos.' },
      { command: 'diff <(ls dir1) <(ls dir2)', output: '2a3\n> arquivo_extra.txt', explanation: 'Compara o conteudo de dois diretorios usando substituicao de processo.' },
      { command: 'cat urls.txt | while read url; do curl -sI "$url" | head -1; done', output: 'HTTP/1.1 200 OK\nHTTP/1.1 301 Moved Permanently\nHTTP/1.1 404 Not Found', explanation: 'Verifica o status HTTP de cada URL em um arquivo, linha por linha.' },
      { command: 'cat data.csv | sed \'1d\' | awk -F, \'{sum+=$3} END {print "Total:", sum}\'', output: 'Total: 15780', explanation: 'Remove o cabecalho do CSV e soma os valores da terceira coluna.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ps\s+aux\s*\|\s*awk/, output: '   42 /usr/bin/python3\n   15 /usr/sbin/apache2\n   8 /usr/bin/node\n   3 /usr/sbin/sshd\n   2 /usr/bin/bash' },
      { pattern: /^cat\s+\S+\s*\|\s*awk\s.*\|\s*sort\s*\|\s*uniq/, output: '  1523 192.168.1.100\n   847 10.0.0.50\n   234 172.16.0.1\n    56 192.168.1.200\n    12 10.0.0.1' },
      { pattern: /^find\s.*xargs/, output: './app/error.log\n./system/kern.log\n./web/access_error.log' },
      { pattern: /^diff\s+<\(/, output: '2a3\n> arquivo_extra.txt\n5d5\n< temp.bak' },
      { pattern: /while\s+read/, output: 'HTTP/1.1 200 OK\nHTTP/1.1 301 Moved Permanently\nHTTP/1.1 404 Not Found' },
      { pattern: /^cat\s+\S+\s*\|\s*sed.*awk/, output: 'Total: 15780' },
      { pattern: /xargs\s+-P/, output: 'resultado1.txt: processado\nresultado2.txt: processado\nresultado3.txt: processado\nresultado4.txt: processado' },
      { pattern: /\{\s*\w+.*;\s*\w+.*;\s*\}/, output: 'Bloco executado com sucesso.\nArquivo processado.\nLog atualizado.' },
      { pattern: /^cat\s+\S+\s*\|\s*grep/, output: '2024-01-15 ERROR: Connection timeout\n2024-01-15 ERROR: Database unreachable\n2024-01-16 ERROR: Out of memory' },
      { pattern: /^echo\s+.*\|\s*sed/, output: 'texto transformado com sucesso' },
    ],
    contextHints: [
      'Tente combinar `ps aux` com `awk`, `sort` e `uniq` para analisar processos.',
      'Use `cat arquivo | awk \'{print $1}\' | sort | uniq -c | sort -rn` para contar ocorrencias.',
      'Experimente `find . -name "*.log" | xargs -P 4 grep -l "ERROR"` para busca paralela.',
      'Use `diff <(cmd1) <(cmd2)` para comparar saidas de dois comandos.',
      'Tente um loop: `while read line; do echo "$line"; done < arquivo.txt`.',
    ],
  },

  drills: [
    {
      id: 'oneliners-drill-1',
      prompt: 'Conte quantas vezes cada IP aparece no arquivo `access.log`, mostrando os 10 mais frequentes. O IP esta na primeira coluna. (Use: awk para extrair, sort, uniq -c, sort -rn e head)',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /cat\s+access\.log\s*\|\s*awk\s+'\{print \$1\}'\s*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn\s*\|\s*head(-\s*10|\s+-10)?$/.test(trimmed);
      },
      expectedOutput: '  1523 192.168.1.100\n   847 10.0.0.50\n   234 172.16.0.1\n    56 192.168.1.200\n    45 10.0.0.25\n    33 172.16.0.5\n    21 192.168.1.50\n    18 10.0.0.100\n    12 172.16.0.10\n     8 192.168.1.1',
      hints: ['Comece com `cat access.log | awk \'{print $1}\'` para extrair os IPs. Depois encadeie `sort | uniq -c | sort -rn | head`.', 'O pipeline completo e: `cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head`.'],
      feedbackRules: [
        { pattern: /awk.*\$1.*sort.*uniq/, message: 'Bom caminho! Verifique se voce tem `sort -rn` (numerico reverso) antes do `head`.' },
        { pattern: /grep.*access/, message: 'Nao precisa de grep aqui. Use `cat access.log | awk` para comecar o pipeline.' },
      ],
      xp: 100,
    },
    {
      id: 'oneliners-drill-2',
      prompt: 'Extraia a segunda coluna do arquivo `dados.csv` (separador: virgula), ordene e remova duplicatas. (Use: awk com -F, sort e uniq)',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /cat\s+dados\.csv\s*\|\s*awk\s+-F,?\s*'\{print \$2\}'\s*\|\s*sort\s*\|\s*uniq$/.test(trimmed);
      },
      expectedOutput: 'Alice\nBob\nCarlos\nDiana\nEduardo',
      hints: ['Use `awk -F, \'{print $2}\'` para extrair a segunda coluna de um CSV.', 'O pipeline completo e: `cat dados.csv | awk -F, \'{print $2}\' | sort | uniq`.'],
      feedbackRules: [
        { pattern: /cut\s+-d/, message: '`cut` funciona, mas este exercicio pede `awk`. Use `awk -F, \'{print $2}\'`.' },
        { pattern: /awk.*print \$2.*sort/, message: 'Quase! Certifique-se de usar `-F,` no awk para definir a virgula como separador.' },
      ],
      xp: 100,
    },
    {
      id: 'oneliners-drill-3',
      prompt: 'No arquivo `config.txt`, substitua todas as ocorrencias de "localhost" por "production.server.com" e de "8080" por "443", tudo em um unico comando sed.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^sed\s+(-e\s+'s\/localhost\/production\.server\.com\/g'\s+-e\s+'s\/8080\/443\/g'|'s\/localhost\/production\.server\.com\/g;\s*s\/8080\/443\/g')\s+config\.txt$/.test(trimmed);
      },
      expectedOutput: 'host=production.server.com\nport=443\nbackend=production.server.com:443',
      hints: ['O `sed` pode fazer multiplas substituicoes com `-e` para cada expressao, ou separando com `;` dentro das aspas.', 'Tente: `sed \'s/localhost/production.server.com/g; s/8080/443/g\' config.txt`.'],
      feedbackRules: [
        { pattern: /sed.*localhost.*8080/, message: 'Voce tem os dois padroes! Verifique a sintaxe: use `-e` para cada substituicao ou `;` para separar.' },
        { pattern: /sed.*-i/, message: 'Nao use `-i` neste exercicio — queremos ver a saida no terminal, nao editar o arquivo in-place.' },
      ],
      xp: 100,
    },
    {
      id: 'oneliners-drill-4',
      prompt: 'Leia cada linha do arquivo `servidores.txt` e execute `ping -c 1` para cada servidor usando um loop while read.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /while\s+read\s+\w+;\s*do\s+ping\s+-c\s+1\s+"\$\w+";\s*done\s*<\s*servidores\.txt$/.test(trimmed);
      },
      expectedOutput: 'PING server1.local (192.168.1.10): 1 data bytes\n64 bytes from 192.168.1.10: icmp_seq=0 ttl=64 time=0.5 ms\nPING server2.local (192.168.1.20): 1 data bytes\n64 bytes from 192.168.1.20: icmp_seq=0 ttl=64 time=1.2 ms',
      hints: ['A estrutura e: `while read var; do comando "$var"; done < arquivo`.', 'Tente: `while read host; do ping -c 1 "$host"; done < servidores.txt`.'],
      feedbackRules: [
        { pattern: /for\s+\w+\s+in/, message: 'Um loop `for` funciona, mas este exercicio pede `while read`. Ele e mais seguro para processar arquivos linha por linha.' },
        { pattern: /while\s+read.*ping/, message: 'Boa estrutura! Verifique se voce tem `< servidores.txt` no final para redirecionar a entrada.' },
      ],
      xp: 100,
    },
    {
      id: 'oneliners-drill-5',
      prompt: 'Encontre todos os arquivos `.log` no diretorio atual e busque a palavra "CRITICAL" em paralelo com 4 processos usando xargs.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^find\s+\.\s+-name\s+"\*\.log"\s*\|\s*xargs\s+-P\s+4\s+grep\s+(-l\s+)?"CRITICAL"$/.test(trimmed);
      },
      expectedOutput: './app/error.log:2024-01-15 CRITICAL: Database connection lost\n./system/kern.log:2024-01-16 CRITICAL: Disk failure imminent\n./web/access.log:2024-01-16 CRITICAL: SSL certificate expired',
      hints: ['Comece com `find . -name "*.log"` para localizar os arquivos. Depois encadeie com `xargs`.', 'Use `xargs -P 4` para paralelizar. O comando completo e: `find . -name "*.log" | xargs -P 4 grep "CRITICAL"`.'],
      feedbackRules: [
        { pattern: /find.*xargs.*grep/, message: 'Estrutura correta! Verifique se voce tem `-P 4` no xargs para paralelizar.' },
        { pattern: /grep\s+-r/, message: '`grep -r` funciona, mas nao e paralelo. Use `find | xargs -P 4 grep` para executar em paralelo.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'O Lendario One-Liner',
    scenario: 'O servidor de analytics caiu e voce so tem acesso via terminal. Milhoes de linhas de logs precisam ser analisados rapidamente para identificar o problema. Seu desafio: resolver tudo usando one-liners poderosos, sem scripts, sem editores — apenas a linha de comando pura.',
    steps: [
      {
        id: 'boss-oneliners-1',
        prompt: '> Os logs de acesso estao gigantes. Primeiro, descubra os 5 IPs que mais fizeram requisicoes. O IP esta na primeira coluna do arquivo `access.log`.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /cat\s+access\.log\s*\|\s*awk\s+'\{print \$1\}'\s*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn\s*\|\s*head\s+-5$/.test(trimmed);
        },
        expectedOutput: '  5847 192.168.1.100\n  3201 10.0.0.50\n  1456 172.16.0.1\n   892 192.168.1.200\n   445 10.0.0.25',
        hints: ['Extraia a primeira coluna com awk, conte com sort+uniq, ordene numericamente e pegue o topo.', 'Use: `cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -5`.'],
        feedbackRules: [
          { pattern: /awk.*sort.*uniq/, message: 'Bom pipeline! Verifique se tem `sort -rn` (numerico reverso) e `head -5` no final.' },
        ],
      },
      {
        id: 'boss-oneliners-2',
        prompt: '> O IP 192.168.1.100 e suspeito. Agora, no arquivo `error.log`, substitua todos os IPs "192.168.1.100" por "[BLOCKED]" e todas as ocorrencias de "WARNING" por "ALERT" em um unico comando.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^sed\s+(-e\s+'s\/192\.168\.1\.100\/\[BLOCKED\]\/g'\s+-e\s+'s\/WARNING\/ALERT\/g'|'s\/192\.168\.1\.100\/\[BLOCKED\]\/g;\s*s\/WARNING\/ALERT\/g')\s+error\.log$/.test(trimmed);
        },
        expectedOutput: '2024-01-15 10:23:45 [BLOCKED] ALERT: Too many connections\n2024-01-15 10:24:01 [BLOCKED] ALERT: Rate limit exceeded\n2024-01-15 10:25:00 10.0.0.50 ALERT: Slow query detected',
        hints: ['Use sed com multiplas substituicoes: `-e` para cada padrao ou `;` para separar.', 'Tente: `sed \'s/192.168.1.100/[BLOCKED]/g; s/WARNING/ALERT/g\' error.log`.'],
        feedbackRules: [
          { pattern: /sed.*192\.168/, message: 'Voce encontrou o IP! Agora adicione a segunda substituicao para WARNING -> ALERT.' },
        ],
      },
      {
        id: 'boss-oneliners-3',
        prompt: '> Precisamos verificar rapidamente se todos os servidores do arquivo `nodes.txt` estao respondendo. Faca um ping unico (-c 1) em cada servidor usando while read.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /while\s+read\s+\w+;\s*do\s+ping\s+-c\s+1\s+"\$\w+";\s*done\s*<\s*nodes\.txt$/.test(trimmed);
        },
        expectedOutput: 'PING node1.cluster (10.0.1.1): 1 data bytes\n64 bytes from 10.0.1.1: icmp_seq=0 ttl=64 time=0.3 ms\nPING node2.cluster (10.0.1.2): 1 data bytes\n64 bytes from 10.0.1.2: icmp_seq=0 ttl=64 time=0.5 ms\nPING node3.cluster (10.0.1.3): 1 data bytes\nRequest timeout for icmp_seq 0',
        hints: ['Use `while read` para iterar sobre cada linha do arquivo.', 'Tente: `while read host; do ping -c 1 "$host"; done < nodes.txt`.'],
        feedbackRules: [
          { pattern: /for\s+\w+/, message: 'Use `while read` em vez de `for` — e mais seguro para processar arquivos.' },
        ],
      },
      {
        id: 'boss-oneliners-4',
        prompt: '> Ultimo desafio: encontre todos os arquivos `.log` no diretorio `/var/log` e busque "CRITICAL" em paralelo com 4 processos. Velocidade e essencial!',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^find\s+\/var\/log\s+-name\s+"\*\.log"\s*\|\s*xargs\s+-P\s+4\s+grep\s+"CRITICAL"$/.test(trimmed);
        },
        expectedOutput: '/var/log/app/error.log:2024-01-15 CRITICAL: Database connection pool exhausted\n/var/log/system/kern.log:2024-01-16 CRITICAL: Memory allocation failure\n/var/log/web/nginx.log:2024-01-16 CRITICAL: Upstream connection refused',
        hints: ['Combine `find` com `xargs -P 4` para paralelizar a busca.', 'Use: `find /var/log -name "*.log" | xargs -P 4 grep "CRITICAL"`.'],
        feedbackRules: [
          { pattern: /find.*xargs/, message: 'Boa combinacao! Nao esqueca o `-P 4` no xargs para executar 4 processos em paralelo.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-lendario-oneliner',
  },

  achievements: ['oneliner-master', 'boss-lendario-oneliner'],
};
