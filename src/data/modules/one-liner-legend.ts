import type { Module } from '../../types';

export const oneLinerLegendModule: Module = {
  id: 'one-liner-legend',
  title: 'Lenda do One-Liner',
  description: 'O desafio supremo: combine tudo que aprendeu em one-liners devastadores que resolvem problemas reais.',
  tier: 'Commander',
  prerequisites: ['text-processing', 'data-wrangling', 'process-mgmt'],
  isSideQuest: false,

  briefing: {
    concept:
      `Voce chegou ao topo. Ate aqui, dominou pipes, grep, sed, awk, sort, uniq, cut, find e muito mais — cada um como uma ferramenta individual. Agora e hora de **combinar tudo** em one-liners que resolvem problemas complexos do mundo real em uma unica linha de comando.\n\n` +
      `**Encadeamento de comandos:**\n` +
      `- \`cmd1 && cmd2\` — Executa cmd2 somente se cmd1 teve sucesso.\n` +
      `- \`cmd1 || cmd2\` — Executa cmd2 somente se cmd1 falhou.\n` +
      `- \`cmd1 ; cmd2\` — Executa cmd2 independente do resultado de cmd1.\n\n` +
      `**Substituicao de comando:**\n` +
      `- \`$(comando)\` — Captura a saida de um comando e usa como argumento de outro.\n` +
      `- Exemplo: \`echo "Hoje e $(date +%F)"\` insere a data atual na string.\n\n` +
      `**Pipelines complexos:**\n` +
      `- Combine grep, awk, sed, sort, uniq, wc, cut, head e tail em sequencias longas.\n` +
      `- Cada comando transforma a saida do anterior — como uma linha de montagem industrial.\n\n` +
      `**xargs — o conector universal:**\n` +
      `- Converte saida de um comando em argumentos para outro.\n` +
      `- \`find . -name "*.tmp" | xargs rm\` — Encontra e remove todos os .tmp.\n` +
      `- \`-I {}\` permite posicionar o argumento: \`echo a b | xargs -I {} echo "Item: {}"\`.\n\n` +
      `**Redirecionamento avancado:**\n` +
      `- \`2>&1\` — Redireciona stderr para stdout (combina as duas saidas).\n` +
      `- \`> /dev/null 2>&1\` — Silencia toda saida (stdout e stderr).\n\n` +
      `**Loops em uma linha:**\n` +
      `- \`for f in *.txt; do wc -l "$f"; done\` — Executa um comando para cada arquivo.\n\n` +
      `**find com -exec:**\n` +
      `- \`find . -name "*.log" -exec grep "ERROR" {} \\;\` — Busca dentro de cada arquivo encontrado.\n` +
      `- \`{}\` representa o arquivo atual, \`\\;\` encerra o -exec.`,
    analogy:
      'Imagine que voce e um maestro de orquestra. Ate agora, aprendeu a tocar cada instrumento individualmente — grep e o violino, awk e o piano, sed e o saxofone. Agora voce sobe ao podio e rege todos juntos em uma sinfonia. Um one-liner bem construido e como uma partitura: cada instrumento entra no momento certo, a saida de um alimenta o proximo, e o resultado final e pura harmonia.',
    syntax:
      'cmd1 && cmd2                    # run cmd2 only if cmd1 succeeds\ncmd1 || cmd2                    # run cmd2 only if cmd1 fails\ncmd1 ; cmd2                     # run both regardless\n$(command)                      # command substitution\ncmd | xargs other_cmd           # pipe as arguments\nxargs -I {} cmd {}              # place argument with {}\nfind . -exec cmd {} \\;          # run cmd on each found file\nfor f in *.ext; do cmd; done    # one-line loop\n2>&1                            # redirect stderr to stdout\n> /dev/null 2>&1                # silence all output',
    commandBreakdowns: [
      {
        title: 'Encadeamento condicional',
        command: "mkdir backup && cp *.log backup/ && echo 'Backup OK' || echo 'Falhou!'",
        parts: [
          { text: 'mkdir backup', label: 'Cria o diretório backup' },
          { text: '&&', label: 'E-lógico: só executa o próximo se o anterior teve sucesso (exit code 0)' },
          { text: 'cp *.log backup/', label: 'Copia todos os .log para backup/' },
          { text: "&& echo 'Backup OK'", label: 'Só imprime se mkdir E cp funcionaram' },
          { text: '||', label: 'OU-lógico: executa o próximo se o anterior FALHOU (exit code ≠ 0)' },
          { text: "echo 'Falhou!'", label: 'Executado apenas se algum comando anterior falhou' },
        ],
      },
      {
        title: 'Substituição de comando — $(...)',
        command: 'tar czf backup-$(date +%Y%m%d).tar.gz /var/log/',
        parts: [
          { text: 'tar czf', label: 'c = criar, z = comprimir com gzip, f = nome do arquivo' },
          { text: 'backup-', label: 'Prefixo fixo do nome do arquivo' },
          { text: '$(date +%Y%m%d)', label: 'Substituição: executa date e insere o resultado (ex: 20240315)' },
          { text: '.tar.gz', label: 'Extensão do arquivo comprimido' },
          { text: '/var/log/', label: 'Diretório a ser comprimido' },
        ],
      },
      {
        title: 'find com -exec',
        command: "find . -name '*.tmp' -mtime +7 -exec rm {} \\;",
        parts: [
          { text: 'find .', label: 'Busca a partir do diretório atual' },
          { text: "-name '*.tmp'", label: 'Filtro: apenas arquivos com extensão .tmp' },
          { text: '-mtime +7', label: 'Filtro: modificados há mais de 7 dias' },
          { text: '-exec rm {}', label: 'Executa rm para cada arquivo encontrado. {} = placeholder do arquivo' },
          { text: '\\;', label: 'Marca o fim do comando -exec (precisa do \\\\ para escapar o ;)' },
        ],
      },
    ],
    examples: [
      { command: "grep -c 'ERROR' server.log && echo 'Erros encontrados!'", output: '17\nErros encontrados!', explanation: 'Conta erros e, se houver algum (exit code 0), exibe a mensagem de confirmacao.' },
      { command: "echo \"Arquivos: $(ls *.csv | wc -l)\"", output: 'Arquivos: 3', explanation: 'Substituicao de comando: `$(...)` executa o comando interno e insere o resultado na string.' },
      { command: "cat access.log | awk '{print $1}' | sort | uniq -c | sort -rn | head -5", output: '  2847 192.168.1.50\n  1523 10.0.0.100\n   892 172.16.0.1\n   445 192.168.1.200\n   234 10.0.0.25', explanation: 'Pipeline de 6 comandos: extrai IPs, ordena, conta ocorrencias, ordena por frequencia, mostra os 5 mais ativos.' },
      { command: "find /var/log -name '*.log' -exec grep -l 'CRITICAL' {} \\;", output: '/var/log/syslog.log\n/var/log/app/error.log\n/var/log/auth.log', explanation: '`find -exec` executa grep em cada arquivo .log encontrado. `-l` mostra apenas nomes de arquivos com match.' },
      { command: 'for f in *.txt; do echo "$f: $(wc -l < "$f") linhas"; done', output: 'dados.txt: 150 linhas\nlog.txt: 2340 linhas\nnotas.txt: 42 linhas', explanation: 'Loop one-liner que conta linhas de cada arquivo .txt, combinando `for`, substituicao de comando e `wc`.' },
      { command: "cat urls.txt | xargs -I {} curl -sI {} | grep 'HTTP/'", output: 'HTTP/1.1 200 OK\nHTTP/1.1 301 Moved Permanently\nHTTP/1.1 404 Not Found', explanation: '`xargs -I {}` pega cada URL do arquivo e executa curl nela. O grep filtra apenas as linhas de status HTTP.' },
      { command: "find . -name '*.tmp' -exec rm {} \\; && echo 'Limpeza concluida'", output: 'Limpeza concluida', explanation: 'Encontra e remove todos os arquivos .tmp, depois confirma o sucesso com `&&`.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ls$/, output: 'access.log  erros.csv  metrics.txt  relatorio.csv  servidores.txt  deploy.log  usuarios.txt  config.ini', description: 'Listar arquivos' },
      { pattern: /^cat\s+access\.log$/, output: '192.168.1.50 GET /api/users 200 45ms\n10.0.0.100 POST /api/login 401 12ms\n192.168.1.50 GET /api/users 200 38ms\n172.16.0.1 GET /index.html 200 5ms\n10.0.0.100 POST /api/login 200 15ms\n192.168.1.50 GET /api/data 500 120ms\n192.168.1.200 DELETE /api/users/5 403 8ms\n172.16.0.1 GET /style.css 200 3ms\n10.0.0.100 GET /api/reports 200 89ms\n192.168.1.50 PUT /api/config 200 23ms\n10.0.0.100 POST /api/login 401 11ms\n192.168.1.50 GET /api/users 200 41ms', description: 'Ver log de acesso' },
      { pattern: /^cat\s+erros\.csv$/, output: 'timestamp,nivel,modulo,mensagem\n2024-03-01 10:05,ERROR,auth,falha de login\n2024-03-01 10:12,WARN,db,conexao lenta\n2024-03-01 10:15,ERROR,api,timeout na requisicao\n2024-03-01 10:20,ERROR,auth,token expirado\n2024-03-01 10:25,WARN,cache,cache miss\n2024-03-01 10:30,ERROR,db,deadlock detectado\n2024-03-01 10:35,WARN,api,rate limit proximo\n2024-03-01 10:40,ERROR,auth,falha de login', description: 'Ver CSV de erros' },
      { pattern: /^cat\s+relatorio\.csv$/, output: 'produto,categoria,preco,quantidade\nWidget,Eletronicos,29.99,150\nGadget,Eletronicos,49.99,85\nPlug,Hardware,9.99,300\nScreen,Eletronicos,79.99,45\nCable,Hardware,19.99,200\nSensor,IoT,14.99,175\nRouter,Rede,89.99,30', description: 'Ver relatorio de vendas' },
      { pattern: /^cat\s+servidores\.txt$/, output: 'web-01.prod\nweb-02.prod\ndb-01.prod\ndb-02.prod\ncache-01.prod', description: 'Ver lista de servidores' },
      { pattern: /^cat\s+deploy\.log$/, output: '[2024-03-01 08:00] INFO: Deploy iniciado v2.5.1\n[2024-03-01 08:02] INFO: Build concluido\n[2024-03-01 08:03] WARN: Teste de integracao lento\n[2024-03-01 08:05] ERROR: Falha no healthcheck do servico auth\n[2024-03-01 08:06] ERROR: Rollback iniciado\n[2024-03-01 08:08] INFO: Rollback concluido\n[2024-03-01 08:10] INFO: Deploy iniciado v2.5.2\n[2024-03-01 08:12] INFO: Build concluido\n[2024-03-01 08:13] INFO: Todos os testes passaram\n[2024-03-01 08:15] INFO: Deploy concluido com sucesso', description: 'Ver log de deploy' },
      { pattern: /^cat\s+access\.log\s*\|\s*awk\s+.*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn/, output: '      5 192.168.1.50\n      3 10.0.0.100\n      2 172.16.0.1\n      1 192.168.1.200', description: 'Ranking de IPs' },
      { pattern: /^grep\s+.*access\.log\s*\|\s*wc\s+-l$/, output: '3', description: 'Contar linhas filtradas' },
      { pattern: /^for\s+f\s+in\s+\*\.\w+;\s*do\s.*done/, output: 'access.log: 12 linhas\nerros.csv: 9 linhas\nmetrics.txt: 5 linhas', description: 'Loop em arquivos' },
      { pattern: /^find\s+.*-exec\s+grep/, output: './access.log:192.168.1.50 GET /api/data 500 120ms\n./deploy.log:[2024-03-01 08:05] ERROR: Falha no healthcheck do servico auth', description: 'find com -exec grep' },
      { pattern: /^cat\s+erros\.csv\s*\|\s*grep\s+.*ERROR/, output: '2024-03-01 10:05,ERROR,auth,falha de login\n2024-03-01 10:15,ERROR,api,timeout na requisicao\n2024-03-01 10:20,ERROR,auth,token expirado\n2024-03-01 10:30,ERROR,db,deadlock detectado\n2024-03-01 10:40,ERROR,auth,falha de login', description: 'Filtrar erros do CSV' },
      { pattern: /xargs/, output: 'access.log: processado\ndeploy.log: processado\nerros.csv: processado', description: 'Comando com xargs' },
    ],
    contextHints: [
      'Veja os arquivos disponiveis com `ls`. Explore com `cat` antes de construir seus one-liners.',
      'Tente `cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn` para ver os IPs mais ativos.',
      'Use `grep \'ERROR\' erros.csv | wc -l` para contar quantos erros existem.',
      'Experimente um loop: `for f in *.csv; do echo "$f: $(wc -l < "$f") linhas"; done`.',
      'Combine `find` com `-exec`: `find . -name "*.log" -exec grep -l "ERROR" {} \\;`.',
      'Use `cat erros.csv | awk -F, \'{print $3}\' | sort | uniq -c | sort -rn` para ver modulos com mais erros.',
      'Tente encadear com `&&`: `grep -q "ERROR" deploy.log && echo "Erros encontrados no deploy!"`.',
    ],
  },

  initialFS: {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'home',
        type: 'directory',
        children: [
          {
            name: 'enzo',
            type: 'directory',
            children: [
              {
                name: 'access.log',
                type: 'file',
                content:
                  '192.168.1.50 GET /api/users 200 45ms\n10.0.0.100 POST /api/login 401 12ms\n192.168.1.50 GET /api/users 200 38ms\n172.16.0.1 GET /index.html 200 5ms\n10.0.0.100 POST /api/login 200 15ms\n192.168.1.50 GET /api/data 500 120ms\n192.168.1.200 DELETE /api/users/5 403 8ms\n172.16.0.1 GET /style.css 200 3ms\n10.0.0.100 GET /api/reports 200 89ms\n192.168.1.50 PUT /api/config 200 23ms\n10.0.0.100 POST /api/login 401 11ms\n192.168.1.50 GET /api/users 200 41ms',
              },
              {
                name: 'erros.csv',
                type: 'file',
                content:
                  'timestamp,nivel,modulo,mensagem\n2024-03-01 10:05,ERROR,auth,falha de login\n2024-03-01 10:12,WARN,db,conexao lenta\n2024-03-01 10:15,ERROR,api,timeout na requisicao\n2024-03-01 10:20,ERROR,auth,token expirado\n2024-03-01 10:25,WARN,cache,cache miss\n2024-03-01 10:30,ERROR,db,deadlock detectado\n2024-03-01 10:35,WARN,api,rate limit proximo\n2024-03-01 10:40,ERROR,auth,falha de login',
              },
              {
                name: 'relatorio.csv',
                type: 'file',
                content:
                  'produto,categoria,preco,quantidade\nWidget,Eletronicos,29.99,150\nGadget,Eletronicos,49.99,85\nScreen,Eletronicos,79.99,45\nPlug,Hardware,9.99,300\nCable,Hardware,19.99,200\nSensor,IoT,14.99,175\nRouter,Rede,89.99,30',
              },
              {
                name: 'deploy.log',
                type: 'file',
                content:
                  '[2024-03-01 08:00] INFO: Deploy iniciado v2.5.1\n[2024-03-01 08:02] INFO: Build concluido\n[2024-03-01 08:03] WARN: Teste de integracao lento\n[2024-03-01 08:05] ERROR: Falha no healthcheck do servico auth\n[2024-03-01 08:06] ERROR: Rollback iniciado\n[2024-03-01 08:08] INFO: Rollback concluido\n[2024-03-01 08:10] INFO: Deploy iniciado v2.5.2\n[2024-03-01 08:12] INFO: Build concluido\n[2024-03-01 08:13] INFO: Todos os testes passaram\n[2024-03-01 08:15] INFO: Deploy concluido com sucesso',
              },
              {
                name: 'servidores.txt',
                type: 'file',
                content: 'web-01.prod\nweb-02.prod\ndb-01.prod\ndb-02.prod\ncache-01.prod',
              },
              {
                name: 'usuarios.txt',
                type: 'file',
                content: 'admin\ncarlos\nana\nbia\ncarlos\nadmin\njoao\nbia\ncarlos\nmaria\nana\nadmin',
              },
              {
                name: 'config.ini',
                type: 'file',
                content: 'host=localhost\nport=8080\ndebug=true\nlog_level=info\nmax_conn=100\ntimeout=30\nhost=localhost\nport=8080',
              },
              {
                name: 'metrics.txt',
                type: 'file',
                content: 'cpu_usage 45.2\nmem_usage 78.1\ndisk_io 12.5\nnet_in 156.3\nnet_out 89.7',
              },
            ],
          },
        ],
      },
    ],
  },

  drills: [
    {
      id: 'legend-drill-1',
      prompt: 'Conte quantas linhas com "ERROR" existem no arquivo erros.csv. Use grep para filtrar e wc para contar.',
      difficulty: 'easy',
      check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+erros\.csv\s*\|\s*wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '5',
      hints: [
        'Use `grep` para filtrar as linhas com ERROR e passe o resultado por pipe para `wc -l`.',
        'O comando e: `grep \'ERROR\' erros.csv | wc -l`.',
      ],
      feedbackRules: [
        { pattern: /^grep\s+-c\s+['"]?ERROR['"]?\s+erros\.csv$/, message: '`grep -c` tambem funciona para contar! Mas este exercicio pede o padrao com pipe: `grep \'ERROR\' erros.csv | wc -l`.' },
        { pattern: /^grep\s+['"]?ERROR['"]?\s+erros\.csv$/, message: 'Bom comeco! Voce encontrou as linhas. Agora passe por pipe para `wc -l` para contar: `grep \'ERROR\' erros.csv | wc -l`.' },
        { pattern: /^wc\s+-l\s+erros\.csv$/, message: 'Isso conta TODAS as linhas. Filtre primeiro com grep: `grep \'ERROR\' erros.csv | wc -l`.' },
        { pattern: /^cat\s+erros\.csv\s*\|\s*grep\s+['"]?ERROR['"]?\s*\|\s*wc\s+-l$/, message: 'Funciona, mas `grep` le arquivos diretamente. Mais limpo: `grep \'ERROR\' erros.csv | wc -l`.' },
      ],
      xp: 50,
    },
    {
      id: 'legend-drill-2',
      prompt: 'No arquivo access.log, encontre todas as requisicoes com status 500 (erro do servidor). O status esta na 4a coluna.',
      difficulty: 'easy',
      check: (cmd) => /^awk\s+['"]?\$4\s*==\s*500['"]?\s+access\.log$/.test(cmd.trim()) || /^grep\s+['"]?\b500\b['"]?\s+access\.log$/.test(cmd.trim()) || /^awk\s+['"]\$4\s*==\s*"?500"?['"]?\s+access\.log$/.test(cmd.trim()),
      expectedOutput: '192.168.1.50 GET /api/data 500 120ms',
      hints: [
        'Voce pode usar `awk \'$4 == 500\' access.log` para filtrar pela 4a coluna.',
        'Outra opcao: `grep \'500\' access.log` — mas awk e mais preciso para colunas.',
      ],
      feedbackRules: [
        { pattern: /^cat\s+access\.log$/, message: 'Isso mostra tudo. Filtre pela 4a coluna: `awk \'$4 == 500\' access.log`.' },
        { pattern: /^grep\s+['"]?200['"]?\s+access\.log$/, message: 'Status 200 e sucesso. Voce quer os erros — status 500: `awk \'$4 == 500\' access.log`.' },
      ],
      xp: 50,
    },
    {
      id: 'legend-drill-3',
      prompt: 'Descubra qual modulo (3a coluna) gera mais erros no erros.csv. Filtre apenas linhas ERROR, extraia o modulo com awk, ordene, conte e ranqueie.',
      difficulty: 'medium',
      check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+erros\.csv\s*\|\s*awk\s+-F,?\s*['"]?\{print \$3\}['"]?\s*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
      expectedOutput: '      3 auth\n      1 api\n      1 db',
      hints: [
        'Primeiro filtre com grep, depois extraia a coluna com awk, e faca o ranking com sort | uniq -c | sort -rn.',
        'O pipeline completo e: `grep \'ERROR\' erros.csv | awk -F, \'{print $3}\' | sort | uniq -c | sort -rn`.',
      ],
      feedbackRules: [
        { pattern: /grep.*ERROR.*awk.*sort/, message: 'Otima estrutura! Verifique se usou `-F,` no awk para separar por virgula e `sort -rn` no final.' },
        { pattern: /^awk.*erros\.csv\s*\|\s*sort/, message: 'Voce precisa filtrar primeiro com `grep \'ERROR\'` antes de extrair a coluna com awk.' },
        { pattern: /grep.*ERROR.*cut/, message: '`cut` funciona para colunas, mas este exercicio pede `awk`. Use `awk -F, \'{print $3}\'`.' },
      ],
      xp: 75,
    },
    {
      id: 'legend-drill-4',
      prompt: 'Use um loop for para contar as linhas de cada arquivo .csv no diretorio. Formato: `for f in *.csv; do echo "$f: $(wc -l < "$f") linhas"; done`',
      difficulty: 'medium',
      check: (cmd) => /^for\s+f\s+in\s+\*\.csv;\s*do\s+echo\s+"\$f:\s*\$\(wc\s+-l\s*<\s*"\$f"\)\s*linhas";\s*done$/.test(cmd.trim()),
      expectedOutput: 'erros.csv: 9 linhas\nrelatorio.csv: 8 linhas',
      hints: [
        'A estrutura do loop e: `for f in *.csv; do ...; done`. Dentro, use `$(wc -l < "$f")` para contar linhas.',
        'Comando completo: `for f in *.csv; do echo "$f: $(wc -l < "$f") linhas"; done`.',
      ],
      feedbackRules: [
        { pattern: /^for\s+f\s+in\s+\*\.csv/, message: 'Bom comeco com o loop! Verifique a sintaxe dentro do `do ... done` e a substituicao de comando `$(...)`.' },
        { pattern: /^wc\s+-l\s+\*\.csv$/, message: '`wc -l *.csv` funciona, mas o exercicio pede um loop `for` para praticar one-liners com iteracao.' },
        { pattern: /while\s+read/, message: 'Um loop `while read` e para processar linhas de um arquivo. Para iterar sobre arquivos, use `for f in *.csv`.' },
      ],
      xp: 75,
    },
    {
      id: 'legend-drill-5',
      prompt: 'Desafio final: encontre todos os arquivos .log no diretorio atual, busque "ERROR" em cada um com find -exec, e encadeie com && para exibir "Analise concluida" ao final.',
      difficulty: 'hard',
      check: (cmd) => /^find\s+\.\s+-name\s+["']\*\.log["']\s+-exec\s+grep\s+["']?ERROR["']?\s+\{\}\s+\\;\s*&&\s*echo\s+["']Analise concluida["']$/.test(cmd.trim()),
      expectedOutput: 'access.log:[nenhuma linha com ERROR no access.log padrao]\ndeploy.log:[2024-03-01 08:05] ERROR: Falha no healthcheck do servico auth\ndeploy.log:[2024-03-01 08:06] ERROR: Rollback iniciado\nAnalise concluida',
      hints: [
        'Use `find . -name "*.log" -exec grep "ERROR" {} \\;` para buscar em cada .log encontrado.',
        'Adicione `&& echo "Analise concluida"` ao final para exibir a mensagem de sucesso.',
        'Comando completo: `find . -name "*.log" -exec grep "ERROR" {} \\; && echo "Analise concluida"`.',
      ],
      feedbackRules: [
        { pattern: /find\s+\.\s+-name.*-exec\s+grep/, message: 'Otima base! Nao esqueca de encadear com `&& echo "Analise concluida"` ao final.' },
        { pattern: /find.*\|\s*xargs\s+grep/, message: 'xargs tambem funciona, mas este exercicio pede `find -exec`. Use `find . -name "*.log" -exec grep "ERROR" {} \\;`.' },
        { pattern: /grep\s+-r\s+.*ERROR/, message: '`grep -r` e mais simples, mas o exercicio quer `find -exec` para praticar composicao de comandos.' },
        { pattern: /find.*-exec.*grep.*&&/, message: 'Quase! Verifique se o `\\;` esta antes do `&&` e se a mensagem esta entre aspas.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'O Incidente de Producao',
    scenario: 'ALERTA CRITICO: O sistema de producao esta instavel. Os dashboards cairam e voce so tem acesso via SSH ao terminal. Milhares de linhas de logs, CSVs de metricas e configs espalhados pelo servidor. Sua missao: investigar a causa raiz, identificar os culpados e gerar um relatorio — tudo usando one-liners. Sem scripts, sem editores. Apenas voce e a linha de comando. Este e o teste supremo.',
    steps: [
      {
        id: 'boss-legend-1',
        prompt: '> O sistema esta lento. Primeiro, identifique os 3 IPs que mais acessaram o servidor. Extraia a 1a coluna do access.log, ordene, conte e mostre os 3 mais frequentes.',
        check: (cmd) => /^cat\s+access\.log\s*\|\s*awk\s+['"]?\{print \$1\}['"]?\s*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn\s*\|\s*head\s+-3$/.test(cmd.trim()),
        expectedOutput: '      5 192.168.1.50\n      4 10.0.0.100\n      2 172.16.0.1',
        hints: [
          'Extraia IPs com `awk \'{print $1}\'`, depois o pipeline classico: `sort | uniq -c | sort -rn | head -3`.',
          'Comando completo: `cat access.log | awk \'{print $1}\' | sort | uniq -c | sort -rn | head -3`.',
        ],
        feedbackRules: [
          { pattern: /awk.*\$1.*sort.*uniq/, message: 'Bom pipeline! Verifique se termina com `sort -rn | head -3` para pegar os 3 mais frequentes.' },
          { pattern: /^cut\s/, message: '`cut` funciona para colunas com delimitador fixo. Com espacos, `awk \'{print $1}\'` e mais pratico.' },
          { pattern: /head\s+-5/, message: 'Quase! O enunciado pede os 3 mais frequentes, nao 5. Use `head -3`.' },
        ],
      },
      {
        id: 'boss-legend-2',
        prompt: '> O IP 192.168.1.50 e suspeito — 5 requisicoes e uma deu erro 500. Agora descubra qual modulo esta causando mais problemas. No erros.csv, filtre linhas com ERROR, extraia o modulo (3a coluna, separador virgula) e faca um ranking.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+erros\.csv\s*\|\s*awk\s+-F,?\s*['"]?\{print \$3\}['"]?\s*\|\s*sort\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
        expectedOutput: '      3 auth\n      1 api\n      1 db',
        hints: [
          'Filtre primeiro: `grep \'ERROR\' erros.csv`. Depois extraia a 3a coluna com `awk -F, \'{print $3}\'`.',
          'Complete o ranking com `| sort | uniq -c | sort -rn`.',
        ],
        feedbackRules: [
          { pattern: /grep.*ERROR.*erros\.csv/, message: 'Boa filtragem! Agora encadeie: `| awk -F, \'{print $3}\' | sort | uniq -c | sort -rn`.' },
          { pattern: /awk.*erros\.csv.*grep/, message: 'A ordem importa: filtre com grep PRIMEIRO, depois extraia a coluna com awk.' },
          { pattern: /cut\s+-d/, message: '`cut` funciona, mas use `awk -F,` para este desafio — e mais poderoso e flexivel.' },
        ],
      },
      {
        id: 'boss-legend-3',
        prompt: '> O modulo "auth" e o vilao com 3 erros! Verifique no deploy.log se houve algum problema durante o deploy. Use grep para encontrar linhas com "ERROR" no deploy.log e conte quantas sao com wc -l.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+deploy\.log\s*\|\s*wc\s+-l$/.test(cmd.trim()),
        expectedOutput: '2',
        hints: [
          'Use `grep \'ERROR\' deploy.log | wc -l` para contar erros no log de deploy.',
          'Sao dois comandos conectados por pipe: grep filtra, wc conta.',
        ],
        feedbackRules: [
          { pattern: /^grep\s+['"]?ERROR['"]?\s+deploy\.log$/, message: 'Isso mostra as linhas de erro. Agora passe por pipe para `wc -l` para contar: `grep \'ERROR\' deploy.log | wc -l`.' },
          { pattern: /^grep\s+-c\s+['"]?ERROR['"]?\s+deploy\.log$/, message: '`grep -c` tambem conta, mas o exercicio pede o padrao com pipe `| wc -l` para praticar composicao.' },
          { pattern: /^wc\s+-l\s+deploy\.log$/, message: 'Isso conta TODAS as linhas. Filtre primeiro: `grep \'ERROR\' deploy.log | wc -l`.' },
        ],
      },
      {
        id: 'boss-legend-4',
        prompt: '> Causa raiz identificada: o deploy v2.5.1 quebrou o servico auth! Agora, gere o relatorio final. Use find para localizar todos os .log, busque "ERROR" em cada um com -exec, e confirme com && echo "Investigacao concluida".',
        check: (cmd) => /^find\s+\.\s+-name\s+["']\*\.log["']\s+-exec\s+grep\s+["']?ERROR["']?\s+\{\}\s+\\;\s*&&\s*echo\s+["']Investigacao concluida["']$/.test(cmd.trim()),
        expectedOutput: '[2024-03-01 08:05] ERROR: Falha no healthcheck do servico auth\n[2024-03-01 08:06] ERROR: Rollback iniciado\nInvestigacao concluida',
        hints: [
          'Use `find . -name "*.log" -exec grep "ERROR" {} \\;` para buscar erros em todos os logs.',
          'Encadeie com `&& echo "Investigacao concluida"` para a mensagem final.',
          'Comando completo: `find . -name "*.log" -exec grep "ERROR" {} \\; && echo "Investigacao concluida"`.',
        ],
        feedbackRules: [
          { pattern: /find\s+\.\s+-name.*-exec/, message: 'Boa estrutura! Verifique se tem `grep "ERROR" {} \\;` e `&& echo "Investigacao concluida"` no final.' },
          { pattern: /find.*\|\s*xargs/, message: 'xargs e valido, mas o desafio pede `find -exec`. Use `-exec grep "ERROR" {} \\;`.' },
          { pattern: /grep\s+-r/, message: '`grep -r` simplifica, mas o desafio final exige `find -exec` — a composicao suprema!' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-one-liner-legend',
  },

  achievements: ['one-liner-legend', 'boss-one-liner-legend'],
};
