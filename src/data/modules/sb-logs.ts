import type { Module } from '../../types';

export const sbLogsModule: Module = {
  id: 'sb-logs',
  title: 'Analise de Logs',
  description: 'Investigue problemas do sistema atraves dos logs.',
  tier: 'Master',
  prerequisites: ['sb-monitoring'],
  isSideQuest: false,

  briefing: {
    concept:
      `Logs sao o diario do sistema — registram tudo o que acontece, desde o boot ate cada servico que inicia ou falha. Quando algo da errado, os logs sao a primeira pista para descobrir o que aconteceu.\n\n` +
      `No Linux moderno, o **journalctl** e a ferramenta principal para consultar logs do systemd. Ele permite filtrar por servico, prioridade, data e muito mais:\n\n` +
      `• **journalctl** — Mostra todos os logs do journal.\n` +
      `• **journalctl -u** — Filtra logs de um servico especifico.\n` +
      `• **journalctl -f** — Acompanha logs em tempo real (como tail -f).\n` +
      `• **journalctl --since/--until** — Filtra por intervalo de tempo.\n` +
      `• **journalctl -p** — Filtra por prioridade (err, warning, info...).\n\n` +
      `Alem do journalctl, existem logs tradicionais em \`/var/log/\` e ferramentas como \`dmesg\` para mensagens do kernel, \`last\` para historico de login e \`logger\` para escrever nos logs.`,
    analogy:
      'Pense nos logs como cameras de seguranca do sistema. O `journalctl` e a sala de monitoramento onde voce pode assistir as gravacoes, filtrar por camera (servico), voltar no tempo e ver ao vivo. O `dmesg` e a camera especial do kernel.',
    syntax:
      'journalctl                         # Todos os logs\njournalctl -u servico               # Logs de um servico\njournalctl -f                        # Acompanhar em tempo real\njournalctl --since "2024-03-01"      # Desde uma data\njournalctl -p err                    # Apenas erros\ndmesg                                # Mensagens do kernel\nlast                                 # Historico de logins\nlogger "mensagem"                    # Escreve no log',
    commandBreakdowns: [
      {
        title: 'Filtrando logs com journalctl',
        command: "journalctl -u nginx --since '1 hour ago' -p err -f",
        parts: [
          { text: 'journalctl', label: 'Consulta logs do systemd journal' },
          { text: '-u nginx', label: 'Filtra por unidade/serviço (apenas logs do nginx)' },
          { text: "--since '1 hour ago'", label: 'Apenas logs da última hora (aceita datas absolutas também)' },
          { text: '-p err', label: 'Prioridade mínima: error (outras: debug, info, warning, crit, alert, emerg)' },
          { text: '-f', label: 'Follow — acompanha novos logs em tempo real (como tail -f)' },
        ],
      },
    ],
    examples: [
      { command: 'journalctl -u ssh', output: 'Mar 04 10:00:01 server sshd[1234]: Accepted publickey for enzo\nMar 04 10:00:01 server sshd[1234]: pam_unix(sshd:session): session opened', explanation: 'Mostra apenas os logs do servico SSH.' },
      { command: 'journalctl -f', output: '(acompanha novos logs em tempo real — Ctrl+C para sair)', explanation: 'Segue os logs ao vivo, util para monitorar eventos enquanto acontecem.' },
      { command: 'journalctl --since "1 hour ago"', output: '-- Logs begin at ... --\nMar 04 16:45:00 server systemd[1]: Started backup.service', explanation: 'Filtra logs da ultima hora. Aceita datas absolutas e relativas.' },
      { command: 'journalctl -p err', output: 'Mar 04 14:22:10 server nginx[5678]: [error] open() failed\nMar 04 15:01:33 server kernel: Out of memory: Killed process 9012', explanation: 'Filtra apenas mensagens de erro ou mais graves.' },
      { command: 'dmesg | tail -5', output: '[12345.678] usb 2-1: new device found\n[12345.890] usb 2-1: Product: USB Flash Drive', explanation: 'Mostra as ultimas 5 mensagens do kernel — util para ver hardware e drivers.' },
      { command: 'last -5', output: 'enzo  pts/0  192.168.1.10  Mon Mar  4 10:00   still logged in\nenzo  pts/0  192.168.1.10  Sun Mar  3 14:30 - 18:45 (04:15)', explanation: 'Mostra os 5 ultimos logins no sistema.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^journalctl$/, output: '-- Logs begin at Sun 2024-02-25 00:00:00 BRT, end at Mon 2024-03-04 17:45:00 BRT. --\nFeb 25 00:00:01 server systemd[1]: Starting Daily apt activities...\nFeb 25 00:00:05 server systemd[1]: Started Daily apt activities.\n...\nMar 04 17:44:59 server sshd[4521]: Accepted publickey for enzo\nMar 04 17:45:00 server systemd[1]: Started backup.service' },
      { pattern: /^journalctl\s+-u\s+ssh/, output: 'Mar 04 10:00:01 server sshd[1234]: Accepted publickey for enzo from 192.168.1.10\nMar 04 10:00:01 server sshd[1234]: pam_unix(sshd:session): session opened for user enzo\nMar 04 14:30:22 server sshd[2345]: Failed password for root from 10.0.0.99\nMar 04 14:30:25 server sshd[2345]: Connection closed by 10.0.0.99' },
      { pattern: /^journalctl\s+-u\s+nginx/, output: 'Mar 04 08:00:00 server systemd[1]: Starting nginx.service - A high performance web server...\nMar 04 08:00:01 server nginx[5678]: nginx/1.24.0\nMar 04 14:22:10 server nginx[5678]: [error] 5678#0: *123 open() "/var/www/html/missing.html" failed' },
      { pattern: /^journalctl\s+-f/, output: '(acompanhando logs em tempo real... Ctrl+C para sair)\nMar 04 17:45:01 server CRON[9999]: (enzo) CMD (/scripts/check.sh)\nMar 04 17:45:02 server systemd[1]: Started session-42.scope' },
      { pattern: /^journalctl\s+--since/, output: 'Mar 04 16:00:00 server systemd[1]: Started backup.service\nMar 04 16:00:05 server backup[7890]: Backup completed successfully\nMar 04 16:30:00 server nginx[5678]: [notice] signal process started\nMar 04 17:00:00 server CRON[8888]: (root) CMD (/usr/local/bin/logrotate.sh)' },
      { pattern: /^journalctl\s+-p\s+(err|3)/, output: 'Mar 04 14:22:10 server nginx[5678]: [error] 5678#0: *123 open() "/var/www/html/missing.html" failed (2: No such file or directory)\nMar 04 15:01:33 server kernel: Out of memory: Killed process 9012 (java) total-vm:2048000kB' },
      { pattern: /^dmesg/, output: '[    0.000000] Linux version 6.1.0-18-amd64\n[    0.523456] ACPI: Core revision 20220331\n[    1.234567] EXT4-fs (sda1): mounted filesystem\n[12345.678901] usb 2-1: new high-speed USB device\n[12345.890123] usb 2-1: Product: USB Flash Drive' },
      { pattern: /^last/, output: 'enzo     pts/0        192.168.1.10     Mon Mar  4 10:00   still logged in\nenzo     pts/0        192.168.1.10     Sun Mar  3 14:30 - 18:45  (04:15)\nroot     tty1                          Sat Mar  2 09:00 - 09:15  (00:15)\nreboot   system boot  6.1.0-18-amd64   Sat Mar  2 08:55         still running\nenzo     pts/0        192.168.1.10     Fri Mar  1 16:00 - 20:30  (04:30)' },
      { pattern: /^tail\s+-f\s+\/var\/log\/syslog/, output: '(acompanhando /var/log/syslog em tempo real...)\nMar  4 17:45:00 server systemd[1]: Started session-42.scope\nMar  4 17:45:01 server CRON[9999]: (enzo) CMD (/scripts/check.sh)' },
      { pattern: /^cat\s+\/var\/log\//, output: 'Mar  4 10:00:01 server sshd[1234]: Accepted publickey for enzo\nMar  4 14:22:10 server nginx[5678]: [error] open() failed\nMar  4 15:01:33 server kernel: Out of memory: Killed process 9012' },
    ],
    contextHints: [
      'Use `journalctl` para ver todos os logs do sistema.',
      'Tente `journalctl -u ssh` para ver logs do servico SSH.',
      'Use `journalctl -p err` para filtrar apenas erros.',
      'O comando `dmesg` mostra mensagens do kernel.',
      'Tente `last` para ver o historico de logins.',
    ],
  },

  drills: [
    {
      id: 'logs-drill-1',
      prompt: 'Veja os logs recentes do journal do sistema (todos os logs).',
      difficulty: 'easy',
      check: (cmd) => /^journalctl$/.test(cmd.trim()),
      expectedOutput: '-- Logs begin at Sun 2024-02-25 00:00:00 BRT, end at Mon 2024-03-04 17:45:00 BRT. --\n...',
      hints: ['O comando principal para ver logs no systemd e o `journalctl`.', 'Apenas digite `journalctl` sem argumentos para ver todos os logs.'],
      feedbackRules: [
        { pattern: /^cat\s+\/var\/log/, message: 'Isso funciona para logs tradicionais, mas o drill pede o journal do systemd. Use `journalctl`.' },
        { pattern: /^log/, message: 'O comando para consultar o journal e `journalctl`, nao `log`.' },
      ],
      xp: 80,
    },
    {
      id: 'logs-drill-2',
      prompt: 'Acompanhe os logs do servico nginx em tempo real.',
      difficulty: 'medium',
      check: (cmd) => /^journalctl\s+-f\s+-u\s+nginx$|^journalctl\s+-u\s+nginx\s+-f$/.test(cmd.trim()),
      expectedOutput: '(acompanhando logs do nginx em tempo real...)',
      hints: ['Voce precisa de duas flags: uma para seguir em tempo real e outra para filtrar por servico.', 'Combine `-f` (follow) com `-u nginx` (unit nginx): `journalctl -f -u nginx` ou `journalctl -u nginx -f`.'],
      feedbackRules: [
        { pattern: /^journalctl\s+-f$/, message: 'Isso segue todos os logs. Adicione `-u nginx` para filtrar apenas o nginx.' },
        { pattern: /^tail\s+-f/, message: '`tail -f` funciona para arquivos, mas para o journal use `journalctl -f -u nginx`.' },
      ],
      xp: 80,
    },
    {
      id: 'logs-drill-3',
      prompt: 'Filtre os logs do journal para mostrar apenas os da ultima hora.',
      difficulty: 'medium',
      check: (cmd) => /^journalctl\s+--since\s+"1 hour ago"$/.test(cmd.trim()),
      expectedOutput: 'Mar 04 16:45:00 server systemd[1]: Started backup.service\n...',
      hints: ['O journalctl tem uma opcao para filtrar por data de inicio...', 'Use `journalctl --since "1 hour ago"` para ver logs da ultima hora.'],
      feedbackRules: [
        { pattern: /--since\s+1h/, message: 'O formato correto e `--since "1 hour ago"` (com aspas).' },
        { pattern: /--from/, message: 'A flag correta e `--since`, nao `--from`.' },
      ],
      xp: 80,
    },
    {
      id: 'logs-drill-4',
      prompt: 'Veja as mensagens do kernel usando o comando apropriado.',
      difficulty: 'easy',
      check: (cmd) => /^dmesg$/.test(cmd.trim()),
      expectedOutput: '[    0.000000] Linux version 6.1.0-18-amd64\n[    0.523456] ACPI: Core revision 20220331\n...',
      hints: ['Existe um comando especifico para mensagens do kernel, com 5 letras...', 'O comando e `dmesg` (display message).'],
      feedbackRules: [
        { pattern: /^journalctl\s+-k/, message: '`journalctl -k` tambem funciona, mas o drill pede o comando classico: `dmesg`.' },
        { pattern: /^kernel/, message: 'O comando para mensagens do kernel e `dmesg`, nao `kernel`.' },
      ],
      xp: 80,
    },
    {
      id: 'logs-drill-5',
      prompt: 'Veja o historico de logins no sistema.',
      difficulty: 'easy',
      check: (cmd) => /^last$/.test(cmd.trim()),
      expectedOutput: 'enzo     pts/0        192.168.1.10     Mon Mar  4 10:00   still logged in\n...',
      hints: ['Existe um comando que mostra quem fez login recentemente...', 'O comando e `last` — ele le o arquivo /var/log/wtmp.'],
      feedbackRules: [
        { pattern: /^who/, message: '`who` mostra quem esta logado agora. Para o historico, use `last`.' },
        { pattern: /^lastlog/, message: '`lastlog` mostra o ultimo login de cada usuario. Para o historico completo, use `last`.' },
      ],
      xp: 80,
    },
  ],

  boss: {
    title: 'O Detetive de Logs',
    scenario: 'O servidor de producao apresentou problemas durante a madrugada. Usuarios reclamam que o site ficou fora do ar. Voce precisa investigar os logs para descobrir o que aconteceu e montar um relatorio do incidente.',
    steps: [
      {
        id: 'boss-logs-1',
        prompt: '> O incidente aconteceu nas ultimas horas. Comece verificando os logs recentes — filtre os do journal desde 1 hora atras.',
        check: (cmd) => /^journalctl\s+--since\s+"1 hour ago"$/.test(cmd.trim()),
        expectedOutput: 'Mar 04 16:00:00 server systemd[1]: Started backup.service\nMar 04 16:00:05 server backup[7890]: Backup completed successfully\nMar 04 16:30:00 server nginx[5678]: [notice] signal process started\nMar 04 17:00:00 server CRON[8888]: (root) CMD (/usr/local/bin/logrotate.sh)',
        hints: ['Use `journalctl` com a opcao de filtrar por tempo.', 'O comando e `journalctl --since "1 hour ago"`.'],
        feedbackRules: [
          { pattern: /^journalctl$/, message: 'Isso mostra todos os logs. Filtre por tempo com `--since "1 hour ago"`.' },
        ],
      },
      {
        id: 'boss-logs-2',
        prompt: '> O nginx e o servidor web. Verifique os logs especificos do nginx para encontrar erros.',
        check: (cmd) => /^journalctl\s+-u\s+nginx$/.test(cmd.trim()),
        expectedOutput: 'Mar 04 08:00:00 server systemd[1]: Starting nginx.service - A high performance web server...\nMar 04 08:00:01 server nginx[5678]: nginx/1.24.0\nMar 04 14:22:10 server nginx[5678]: [error] 5678#0: *123 open() "/var/www/html/missing.html" failed',
        hints: ['Use `journalctl` com a flag que filtra por unidade (servico).', 'A flag e `-u` seguida do nome do servico: `journalctl -u nginx`.'],
        feedbackRules: [
          { pattern: /^cat.*nginx/, message: 'Para logs do journal, use `journalctl -u nginx` em vez de `cat`.' },
        ],
      },
      {
        id: 'boss-logs-3',
        prompt: '> Agora filtre apenas as mensagens de erro para ver o que deu errado de verdade.',
        check: (cmd) => /^journalctl\s+-p\s+err$/.test(cmd.trim()),
        expectedOutput: 'Mar 04 14:22:10 server nginx[5678]: [error] 5678#0: *123 open() "/var/www/html/missing.html" failed (2: No such file or directory)\nMar 04 15:01:33 server kernel: Out of memory: Killed process 9012 (java) total-vm:2048000kB',
        hints: ['O journalctl pode filtrar por prioridade/severidade da mensagem.', 'Use `journalctl -p err` para ver apenas mensagens de erro.'],
        feedbackRules: [
          { pattern: /^journalctl.*grep/, message: 'Nao precisa de grep! O journalctl tem filtro nativo: `journalctl -p err`.' },
        ],
      },
      {
        id: 'boss-logs-4',
        prompt: '> Para completar a investigacao, verifique se houve alguma reinicializacao recente — consulte o historico de logins.',
        check: (cmd) => /^last$/.test(cmd.trim()),
        expectedOutput: 'enzo     pts/0        192.168.1.10     Mon Mar  4 10:00   still logged in\nenzo     pts/0        192.168.1.10     Sun Mar  3 14:30 - 18:45  (04:15)\nroot     tty1                          Sat Mar  2 09:00 - 09:15  (00:15)\nreboot   system boot  6.1.0-18-amd64   Sat Mar  2 08:55         still running\nenzo     pts/0        192.168.1.10     Fri Mar  1 16:00 - 20:30  (04:30)',
        hints: ['Existe um comando que mostra o historico de logins e reboots.', 'O comando e `last` — ele inclui entradas de reboot tambem.'],
        feedbackRules: [
          { pattern: /^uptime/, message: '`uptime` mostra ha quanto tempo o sistema esta ligado, mas nao o historico. Use `last`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-detetive-logs',
  },

  achievements: ['logs-master', 'boss-detetive-logs'],
};
