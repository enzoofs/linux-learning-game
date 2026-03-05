import type { Module } from '../../types';

export const sbCronModule: Module = {
  id: 'sb-cron',
  title: 'Automacao & Cron',
  description: 'Agende tarefas automaticas com crontab e timers.',
  tier: 'Master',
  prerequisites: ['sb-shell-functions'],
  isSideQuest: false,

  briefing: {
    concept:
      `No mundo real, muitas tarefas precisam acontecer automaticamente — backups diarios, limpeza de logs, sincronizacao de dados. O **cron** e o agendador de tarefas do Linux, rodando silenciosamente em segundo plano e executando comandos nos horarios que voce definir.\n\n` +
      `O cron usa um arquivo chamado **crontab** (cron table) para armazenar os agendamentos. Cada linha do crontab define uma tarefa com 5 campos de tempo seguidos do comando:\n\n` +
      `• **minuto** (0-59) — Em qual minuto a tarefa executa.\n` +
      `• **hora** (0-23) — Em qual hora do dia.\n` +
      `• **dia do mes** (1-31) — Em qual dia do mes.\n` +
      `• **mes** (1-12) — Em qual mes do ano.\n` +
      `• **dia da semana** (0-7) — Em qual dia da semana (0 e 7 = domingo).\n\n` +
      `Alem da sintaxe numerica, existem atalhos especiais como \`@daily\`, \`@hourly\`, \`@reboot\` e \`@weekly\` que simplificam agendamentos comuns.`,
    analogy:
      'Pense no cron como um despertador inteligente. Voce programa os horarios e ele executa as tarefas automaticamente — sem voce precisar estar presente. O crontab e a lista de alarmes configurados.',
    syntax:
      'crontab -l                    # Lista tarefas agendadas\ncrontab -e                    # Edita o crontab\ncrontab -r                    # Remove o crontab\n* * * * * comando             # min hora dia mes dia_semana\n@daily /path/to/script.sh     # Atalho: executa todo dia a meia-noite\n@reboot /path/to/script.sh    # Executa ao iniciar o sistema',
    commandBreakdowns: [
      {
        title: 'Anatomia da expressão cron',
        command: '30 2 * * 1 /scripts/backup.sh >> /var/log/backup.log 2>&1',
        parts: [
          { text: '30', label: 'Minuto (0-59): executa no minuto 30' },
          { text: '2', label: 'Hora (0-23): às 2h da manhã' },
          { text: '*', label: 'Dia do mês (1-31): qualquer dia' },
          { text: '*', label: 'Mês (1-12): qualquer mês' },
          { text: '1', label: 'Dia da semana (0-7): segunda-feira (0 e 7 = domingo)' },
          { text: '/scripts/backup.sh', label: 'O comando/script a executar' },
          { text: '>> /var/log/backup.log', label: 'Redireciona saída (append) para arquivo de log' },
          { text: '2>&1', label: 'Redireciona stderr para o mesmo destino que stdout' },
        ],
      },
    ],
    examples: [
      { command: 'crontab -l', output: '0 2 * * * /usr/local/bin/backup.sh\n30 8 * * 1 /home/enzo/relatorio.sh', explanation: 'Lista todas as tarefas agendadas no crontab do usuario atual.' },
      { command: 'crontab -e', output: '# Abre o editor para modificar o crontab', explanation: 'Abre o crontab no editor padrao para adicionar ou editar tarefas.' },
      { command: 'echo "0 3 * * * /scripts/backup.sh" | crontab -', output: '', explanation: 'Define o crontab inteiro via pipe — cuidado, isso substitui todas as entradas anteriores.' },
      { command: '*/5 * * * * /scripts/check.sh', output: '(executa a cada 5 minutos)', explanation: 'O */5 no campo de minutos significa "a cada 5 minutos".' },
      { command: '@daily /scripts/cleanup.sh', output: '(executa todo dia a meia-noite)', explanation: 'O atalho @daily equivale a "0 0 * * *" — meia-noite todo dia.' },
      { command: '@reboot /scripts/startup.sh', output: '(executa ao ligar o sistema)', explanation: 'O @reboot executa o comando uma vez quando o sistema inicia.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^crontab\s+-l$/, output: '0 2 * * * /usr/local/bin/backup.sh\n30 8 * * 1 /home/enzo/relatorio.sh\n*/10 * * * * /scripts/health-check.sh' },
      { pattern: /^crontab\s+-e$/, output: '# Abrindo crontab no editor...\n# (No sandbox, o crontab nao pode ser editado interativamente)' },
      { pattern: /^crontab\s+-r$/, output: '# crontab removido com sucesso' },
      { pattern: /^cat\s+\/etc\/cron\.d\//, output: 'SHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n0 4 * * * root /usr/local/bin/logrotate.sh' },
      { pattern: /^ls\s+\/etc\/cron\.d/, output: 'logrotate  sysstat  e2scrub_all' },
      { pattern: /^ls\s+\/etc\/cron\./, output: 'anacron  apt  dpkg  logrotate  man-db  sysstat' },
      { pattern: /^systemctl\s+(status|list-timers)/, output: 'NEXT                        LEFT          LAST                        PASSED       UNIT                         ACTIVATES\nMon 2024-03-04 00:00:00 BRT 6h left       Sun 2024-03-03 00:00:00 BRT 17h ago      logrotate.timer              logrotate.service\nMon 2024-03-04 06:30:00 BRT 12h left      Sun 2024-03-03 06:30:00 BRT 11h ago      man-db.timer                 man-db.service' },
      { pattern: /^at\s+/, output: 'warning: commands will be executed using /bin/sh\njob 1 at Mon Mar  4 10:00:00 2024' },
      { pattern: /^atq$/, output: '1\tMon Mar  4 10:00:00 2024 a enzo' },
      { pattern: /^date$/, output: 'Mon Mar  4 17:45:00 BRT 2024' },
    ],
    contextHints: [
      'Use `crontab -l` para ver suas tarefas agendadas.',
      'Tente `ls /etc/cron.d/` para ver tarefas do sistema.',
      'O comando `systemctl list-timers` mostra os timers do systemd.',
      'Use `at` para agendar tarefas unicas (nao recorrentes).',
      'Tente `crontab -e` para ver como editar o crontab.',
    ],
  },

  drills: [
    {
      id: 'cron-drill-1',
      prompt: 'Liste todas as tarefas agendadas no seu crontab.',
      difficulty: 'easy',
      check: (cmd) => /^crontab\s+-l$/.test(cmd.trim()),
      expectedOutput: '0 2 * * * /usr/local/bin/backup.sh\n30 8 * * 1 /home/enzo/relatorio.sh\n*/10 * * * * /scripts/health-check.sh',
      hints: ['O crontab tem uma flag para listar (list) as tarefas...', 'Use `crontab` com a flag `-l` para listar.'],
      feedbackRules: [
        { pattern: /^cron$/, message: '`cron` e o daemon. Para ver suas tarefas, use `crontab -l`.' },
        { pattern: /^cat.*crontab/, message: 'Nao precisa usar `cat`. O proprio `crontab -l` lista as tarefas.' },
      ],
      xp: 80,
    },
    {
      id: 'cron-drill-2',
      prompt: 'Escreva a linha de crontab para executar `/scripts/backup.sh` todos os dias as 2 da manha.',
      difficulty: 'medium',
      check: (cmd) => /^0\s+2\s+\*\s+\*\s+\*\s+\/scripts\/backup\.sh$/.test(cmd.trim()),
      expectedOutput: '# Tarefa agendada: 0 2 * * * /scripts/backup.sh',
      hints: ['O formato e: minuto hora dia mes dia_semana comando. As 2h da manha, o minuto e 0 e a hora e 2.', 'Os campos dia, mes e dia da semana devem ser `*` (todos). Resultado: `0 2 * * * /scripts/backup.sh`.'],
      feedbackRules: [
        { pattern: /^2\s+0/, message: 'A ordem e minuto primeiro, depois hora. Inverta: `0 2 * * *`.' },
        { pattern: /@daily/, message: '`@daily` funciona, mas este drill pede a sintaxe numerica completa.' },
      ],
      xp: 80,
    },
    {
      id: 'cron-drill-3',
      prompt: 'Escreva a linha de crontab para executar `/scripts/report.sh` toda segunda-feira as 8:30.',
      difficulty: 'medium',
      check: (cmd) => /^30\s+8\s+\*\s+\*\s+1\s+\/scripts\/report\.sh$/.test(cmd.trim()),
      expectedOutput: '# Tarefa agendada: 30 8 * * 1 /scripts/report.sh',
      hints: ['8:30 significa minuto=30, hora=8. Segunda-feira e o dia 1 da semana.', 'A linha completa e: `30 8 * * 1 /scripts/report.sh`.'],
      feedbackRules: [
        { pattern: /\*\s+\*\s+\*\s+\*\s+\*/, message: 'Voce deixou todos os campos como `*`. O dia da semana precisa ser `1` (segunda).' },
        { pattern: /8\s+30/, message: 'Cuidado com a ordem! E minuto primeiro (30), depois hora (8).' },
      ],
      xp: 80,
    },
    {
      id: 'cron-drill-4',
      prompt: 'Escreva a linha de crontab para executar `/scripts/startup.sh` toda vez que o sistema reiniciar, usando um atalho especial.',
      difficulty: 'easy',
      check: (cmd) => /^@reboot\s+\/scripts\/startup\.sh$/.test(cmd.trim()),
      expectedOutput: '# Tarefa agendada: @reboot /scripts/startup.sh',
      hints: ['Existe um atalho especial do cron para executar ao iniciar o sistema...', 'O atalho e `@reboot` seguido do comando.'],
      feedbackRules: [
        { pattern: /^0\s+0/, message: 'Isso agendaria para meia-noite, nao para o boot. Use o atalho `@reboot`.' },
        { pattern: /@boot/, message: 'Quase! O atalho correto e `@reboot`, nao `@boot`.' },
      ],
      xp: 80,
    },
    {
      id: 'cron-drill-5',
      prompt: 'Escreva a linha de crontab para executar `/scripts/check.sh` a cada 5 minutos.',
      difficulty: 'hard',
      check: (cmd) => /^\*\/5\s+\*\s+\*\s+\*\s+\*\s+\/scripts\/check\.sh$/.test(cmd.trim()),
      expectedOutput: '# Tarefa agendada: */5 * * * * /scripts/check.sh',
      hints: ['Para "a cada N minutos", usa-se a notacao `*/N` no campo de minutos.', 'A linha completa e: `*/5 * * * * /scripts/check.sh`.'],
      feedbackRules: [
        { pattern: /^5\s+\*/, message: '`5 * * * *` executa no minuto 5 de cada hora, nao a cada 5 minutos. Use `*/5`.' },
        { pattern: /^\*\s+5/, message: 'O `5` esta no campo de horas. O campo de minutos e o primeiro: `*/5 * * * *`.' },
      ],
      xp: 80,
    },
  ],

  boss: {
    title: 'O Relojoeiro',
    scenario: 'O servidor de producao precisa de uma rotina automatizada de backups. Voce foi encarregado de configurar o agendamento completo: backup diario, verificacao de saude a cada 5 minutos, relatorio semanal e um script de inicializacao.',
    steps: [
      {
        id: 'boss-cron-1',
        prompt: '> Primeiro, verifique se ja existe alguma tarefa agendada no crontab.',
        check: (cmd) => /^crontab\s+-l$/.test(cmd.trim()),
        expectedOutput: '0 2 * * * /usr/local/bin/backup.sh\n30 8 * * 1 /home/enzo/relatorio.sh\n*/10 * * * * /scripts/health-check.sh',
        hints: ['Use o crontab para listar as tarefas existentes.', 'O comando e `crontab -l`.'],
        feedbackRules: [
          { pattern: /^cat/, message: 'Use `crontab -l` para listar as tarefas do usuario atual.' },
        ],
      },
      {
        id: 'boss-cron-2',
        prompt: '> Agora, escreva a entrada cron para fazer backup toda noite as 3 da manha: `0 3 * * * /usr/local/bin/backup.sh`',
        check: (cmd) => /^0\s+3\s+\*\s+\*\s+\*\s+\/usr\/local\/bin\/backup\.sh$/.test(cmd.trim()),
        expectedOutput: '# Backup diario agendado para 03:00',
        hints: ['O formato e: minuto hora dia mes dia_semana comando.', 'As 3h da manha: minuto=0, hora=3. Os demais campos ficam `*`.'],
        feedbackRules: [
          { pattern: /^3\s+0/, message: 'Ordem invertida! Minuto vem antes da hora: `0 3 * * *`.' },
        ],
      },
      {
        id: 'boss-cron-3',
        prompt: '> Excelente! Agora agende a verificacao de saude para rodar a cada 5 minutos: `*/5 * * * * /scripts/health-check.sh`',
        check: (cmd) => /^\*\/5\s+\*\s+\*\s+\*\s+\*\s+\/scripts\/health-check\.sh$/.test(cmd.trim()),
        expectedOutput: '# Health check agendado a cada 5 minutos',
        hints: ['Para "a cada N minutos", use `*/N` no campo de minutos.', 'A linha e: `*/5 * * * * /scripts/health-check.sh`.'],
        feedbackRules: [
          { pattern: /^5\s/, message: '`5` executaria apenas no minuto 5. Para "a cada 5 minutos", use `*/5`.' },
        ],
      },
      {
        id: 'boss-cron-4',
        prompt: '> Por fim, garanta que o servico de monitoramento inicie automaticamente ao ligar o servidor: `@reboot /scripts/monitor-start.sh`',
        check: (cmd) => /^@reboot\s+\/scripts\/monitor-start\.sh$/.test(cmd.trim()),
        expectedOutput: '# Script de inicializacao configurado com @reboot',
        hints: ['Use o atalho especial do cron para executar na inicializacao do sistema.', 'O atalho e `@reboot` seguido do caminho do script.'],
        feedbackRules: [
          { pattern: /^0\s+0/, message: 'Isso agendaria para meia-noite, nao para o boot. Use `@reboot`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-relojoeiro',
  },

  achievements: ['cron-master', 'boss-relojoeiro'],
};
