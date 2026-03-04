import type { Module } from '../../types';

export const sbMonitoringModule: Module = {
  id: 'sb-monitoring',
  title: 'Monitoramento do Sistema',
  description: 'Monitore CPU, memoria, disco e processos em tempo real.',
  tier: 'Master',
  prerequisites: ['sb-permissions'],
  isSideQuest: false,

  briefing: {
    concept:
      `Quando um servidor fica lento, trava ou consome recursos demais, você precisa investigar. O Linux oferece um arsenal de ferramentas para monitorar CPU, memória, disco e processos — saber usá-las é a diferença entre resolver um problema em minutos ou em horas.\n\n` +
      `• **top / htop** — Monitores interativos de processos em tempo real.\n` +
      `• **free** — Mostra uso de memória RAM e swap.\n` +
      `• **uptime** — Há quanto tempo o sistema está ligado e a carga média (load average).\n` +
      `• **vmstat** — Estatísticas de memória virtual, CPU e I/O.\n` +
      `• **iostat** — Estatísticas de I/O de disco e utilização de CPU.\n` +
      `• **/proc/cpuinfo** — Informações detalhadas sobre o processador.\n` +
      `• **/proc/meminfo** — Informações detalhadas sobre a memória.\n` +
      `• **lscpu** — Resumo da arquitetura da CPU.\n` +
      `• **nproc** — Número de CPUs/cores disponíveis.`,
    analogy:
      'Pense no sistema como um corpo humano. `top` é o monitor cardíaco — mostra tudo em tempo real. `free` mede a "pressão arterial" da memória. `uptime` diz há quanto tempo o paciente está acordado e quão sobrecarregado está. `iostat` verifica o "fluxo sanguíneo" dos discos. `/proc/cpuinfo` é o raio-X do processador.',
    syntax:
      'top\nhtop\nfree [-h]\nuptime\nvmstat [interval] [count]\niostat [-x] [interval] [count]\ncat /proc/cpuinfo\ncat /proc/meminfo\nlscpu\nnproc',
    examples: [
      { command: 'free -h', output: '              total    used    free   shared  buff/cache  available\nMem:          15Gi    4.2Gi   8.1Gi   256Mi      3.1Gi      10Gi\nSwap:         2.0Gi      0B   2.0Gi', explanation: 'Mostra uso de memória em formato legível (-h = human readable).' },
      { command: 'uptime', output: ' 14:30:25 up 42 days, 3:15,  2 users,  load average: 0.52, 0.38, 0.31', explanation: 'Mostra tempo de atividade e load average dos últimos 1, 5 e 15 minutos.' },
      { command: 'vmstat 1 3', output: 'procs ----memory---- ---swap-- -----io---- -system-- ------cpu-----\n r b  swpd  free    si  so   bi   bo   in   cs  us sy id wa st\n 1 0     0 8388608  0   0    5   12  125  250  3  1 95  1  0\n 0 0     0 8388000  0   0    0    8  110  230  2  1 97  0  0\n 1 0     0 8387500  0   0    0   16  135  260  4  1 94  1  0', explanation: 'Coleta estatísticas a cada 1 segundo, 3 vezes. Mostra CPU, memória e I/O.' },
      { command: 'iostat -x 1 1', output: 'avg-cpu:  %user  %nice  %system  %iowait  %steal  %idle\n           3.25   0.00     1.12     0.50    0.00   95.13\n\nDevice  r/s    w/s    rkB/s   wkB/s  %util\nsda     5.20   12.40  128.00  256.00  2.30', explanation: 'Estatísticas estendidas de I/O de disco com detalhes de utilização.' },
      { command: 'lscpu', output: 'Architecture:        x86_64\nCPU(s):              8\nModel name:          Intel Core i7-10700\nCPU MHz:             2900.000\nCache L3:            16384K', explanation: 'Resumo completo da arquitetura e características da CPU.' },
      { command: 'nproc', output: '8', explanation: 'Mostra o número de unidades de processamento (cores) disponíveis.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^top$/, output: 'top - 14:30:25 up 42 days,  3:15,  2 users,  load average: 0.52, 0.38, 0.31\nTasks: 187 total,   1 running, 186 sleeping,   0 stopped,   0 zombie\n%Cpu(s):  3.2 us,  1.1 sy,  0.0 ni, 95.1 id,  0.5 wa,  0.0 hi,  0.1 si\nMiB Mem:  15872.0 total,   8388.0 free,   4300.0 used,   3184.0 buff/cache\nMiB Swap:  2048.0 total,   2048.0 free,      0.0 used.  10500.0 avail Mem\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1234 root      20   0  512340  45200  12340 S   2.3   0.3   5:42.10 nginx\n 5678 postgres  20   0  256780 128400  24560 S   1.5   0.8  12:18.45 postgres\n 9012 enzo      20   0   98760  34200   8900 S   0.7   0.2   1:05.30 node' },
      { pattern: /^htop$/, output: '(htop é um monitor interativo — use `top` no sandbox para uma simulação)\n\n  CPU[|||          12.5%]   Tasks: 187, 1 running\n  Mem[||||||||    4.3G/15.9G]   Load average: 0.52 0.38 0.31\n  Swp[             0K/2.0G]   Uptime: 42 days, 03:15\n\n  PID USER    PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command\n 1234 root     20   0  512M  45.2M 12.3M S  2.3  0.3  5:42.10 nginx\n 5678 postgres 20   0  256M   128M 24.5M S  1.5  0.8 12:18.45 postgres' },
      { pattern: /^free\s+-h$/, output: '              total        used        free      shared  buff/cache   available\nMem:           15Gi       4.2Gi       8.1Gi       256Mi       3.1Gi        10Gi\nSwap:         2.0Gi          0B       2.0Gi' },
      { pattern: /^free$/, output: '              total        used        free      shared  buff/cache   available\nMem:       16252928     4404224     8503296      262144     3345408    10752000\nSwap:       2097152           0     2097152' },
      { pattern: /^uptime$/, output: ' 14:30:25 up 42 days,  3:15,  2 users,  load average: 0.52, 0.38, 0.31' },
      { pattern: /^vmstat(\s+\d+)?(\s+\d+)?$/, output: 'procs -----------memory---------- ---swap-- -----io---- -system-- ------cpu-----\n r  b   swpd   free   buff  cache   si   so    bi    bo   in   cs us sy id wa st\n 1  0      0 8388608 524288 2621440  0    0     5    12  125  250  3  1 95  1  0' },
      { pattern: /^iostat(\s+-x)?(\s+\d+)?(\s+\d+)?$/, output: 'Linux 5.15.0 (linux-quest) \t03/03/2025 \t_x86_64_\n\navg-cpu:  %user   %nice %system %iowait  %steal   %idle\n           3.25    0.00    1.12    0.50    0.00   95.13\n\nDevice             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn\nsda              17.60       128.00       256.00    4653120    9306240' },
      { pattern: /^cat\s+\/proc\/cpuinfo/, output: 'processor\t: 0\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz\ncpu MHz\t\t: 2900.000\ncache size\t: 16384 KB\ncpu cores\t: 8\n\nprocessor\t: 1\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz\ncpu MHz\t\t: 2900.000' },
      { pattern: /^cat\s+\/proc\/meminfo/, output: 'MemTotal:       16252928 kB\nMemFree:         8503296 kB\nMemAvailable:   10752000 kB\nBuffers:          524288 kB\nCached:          2621440 kB\nSwapTotal:       2097152 kB\nSwapFree:        2097152 kB' },
      { pattern: /^lscpu$/, output: 'Architecture:            x86_64\nCPU op-mode(s):          32-bit, 64-bit\nCPU(s):                  8\nThread(s) per core:      2\nCore(s) per socket:      4\nSocket(s):               1\nModel name:              Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz\nCPU MHz:                 2900.000\nL1d cache:               256 KiB\nL1i cache:               256 KiB\nL2 cache:                2 MiB\nL3 cache:                16 MiB' },
      { pattern: /^nproc$/, output: '8' },
    ],
    contextHints: [
      'Tente `free -h` para ver o uso de memória em formato legível.',
      'Use `uptime` para ver há quanto tempo o sistema está ligado e a carga média.',
      'Experimente `lscpu` para ver informações detalhadas sobre o processador.',
      'Use `iostat -x 1 1` para ver estatísticas de I/O de disco.',
      'Tente `top` para ver os processos em execução em tempo real.',
    ],
  },

  drills: [
    {
      id: 'mon-drill-1',
      prompt: 'Verifique o uso atual de memória RAM e swap do sistema, mostrando os valores em formato legível para humanos.',
      difficulty: 'easy',
      check: (cmd) => /^free\s+-h$/.test(cmd.trim()),
      expectedOutput: '              total        used        free      shared  buff/cache   available\nMem:           15Gi       4.2Gi       8.1Gi       256Mi       3.1Gi        10Gi\nSwap:         2.0Gi          0B       2.0Gi',
      hints: ['Existe um comando dedicado para mostrar informações de memória. A flag `-h` formata os valores.', 'Use `free -h` — o `-h` significa "human readable" (legível para humanos).'],
      feedbackRules: [
        { pattern: /^free$/, message: 'Funciona, mas os valores em bytes são difíceis de ler. Adicione `-h` para formato legível!' },
        { pattern: /^cat\s+\/proc\/meminfo/, message: '`/proc/meminfo` mostra detalhes brutos. Para um resumo legível, use `free -h`.' },
      ],
      xp: 80,
    },
    {
      id: 'mon-drill-2',
      prompt: 'Mostre informações detalhadas sobre a arquitetura e modelo do processador deste sistema.',
      difficulty: 'easy',
      check: (cmd) => /^lscpu$/.test(cmd.trim()),
      expectedOutput: 'Architecture:            x86_64\nCPU(s):                  8\nModel name:              Intel(R) Core(TM) i7-10700 CPU @ 2.90GHz\nCPU MHz:                 2900.000\nL3 cache:                16 MiB',
      hints: ['Existe um comando que lista informações da CPU de forma organizada.', 'O comando `lscpu` mostra um resumo completo da arquitetura do processador.'],
      feedbackRules: [
        { pattern: /^cat\s+\/proc\/cpuinfo/, message: '`/proc/cpuinfo` funciona, mas `lscpu` organiza as informações de forma mais clara e resumida.' },
        { pattern: /^nproc$/, message: '`nproc` mostra apenas o número de cores. Para detalhes completos, use `lscpu`.' },
      ],
      xp: 80,
    },
    {
      id: 'mon-drill-3',
      prompt: 'Abra o monitor de processos em tempo real para ver quais processos estão consumindo mais CPU e memória.',
      difficulty: 'easy',
      check: (cmd) => /^(top|htop)$/.test(cmd.trim()),
      expectedOutput: 'top - 14:30:25 up 42 days,  3:15,  2 users,  load average: 0.52, 0.38, 0.31\nTasks: 187 total,   1 running, 186 sleeping\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 1234 root      20   0  512340  45200  12340 S   2.3   0.3   5:42.10 nginx',
      hints: ['Existe um comando clássico do Linux que mostra processos em tempo real, atualizado continuamente.', 'Use `top` (ou `htop` se disponível) para monitoramento interativo de processos.'],
      feedbackRules: [
        { pattern: /^ps\s+/, message: '`ps` mostra um snapshot estático. Para monitoramento em tempo real, use `top`.' },
        { pattern: /^free/, message: '`free` mostra apenas memória. Para ver processos individuais e CPU, use `top`.' },
      ],
      xp: 80,
    },
    {
      id: 'mon-drill-4',
      prompt: 'Verifique as estatísticas de I/O de disco com informações estendidas, coletando uma amostra por 1 segundo.',
      difficulty: 'medium',
      check: (cmd) => /^iostat\s+-x\s+1\s+1$/.test(cmd.trim()),
      expectedOutput: 'avg-cpu:  %user   %nice %system %iowait  %steal   %idle\n           3.25    0.00    1.12    0.50    0.00   95.13\n\nDevice             tps    kB_read/s    kB_wrtn/s    kB_read    kB_wrtn\nsda              17.60       128.00       256.00    4653120    9306240',
      hints: ['O `iostat` mostra estatísticas de I/O. A flag `-x` ativa informações estendidas.', 'Use `iostat -x 1 1` — `-x` para detalhes estendidos, `1 1` para uma coleta de 1 segundo.'],
      feedbackRules: [
        { pattern: /^iostat$/, message: 'Bom começo! Adicione `-x` para detalhes estendidos e `1 1` para uma amostra de 1 segundo.' },
        { pattern: /^iostat\s+-x$/, message: 'Faltou o intervalo e contagem! Use `iostat -x 1 1` para uma amostra de 1 segundo.' },
      ],
      xp: 80,
    },
    {
      id: 'mon-drill-5',
      prompt: 'Verifique há quanto tempo o sistema está ligado e qual é a carga média (load average).',
      difficulty: 'easy',
      check: (cmd) => /^uptime$/.test(cmd.trim()),
      expectedOutput: ' 14:30:25 up 42 days,  3:15,  2 users,  load average: 0.52, 0.38, 0.31',
      hints: ['Existe um comando simples que mostra o tempo de atividade e a carga do sistema.', 'O comando `uptime` mostra há quanto tempo o sistema está rodando e o load average.'],
      feedbackRules: [
        { pattern: /^top$/, message: '`top` mostra o uptime no cabeçalho, mas `uptime` é mais direto para essa informação.' },
        { pattern: /^cat\s+\/proc\/uptime/, message: '`/proc/uptime` mostra segundos brutos. O comando `uptime` formata a saída de forma legível.' },
      ],
      xp: 80,
    },
  ],

  boss: {
    title: 'O Vigilante do Sistema',
    scenario: 'O servidor de produção está respondendo lentamente. Os usuários reclamam de timeouts e lentidão. Você precisa investigar sistematicamente CPU, memória, disco e processos para encontrar o gargalo.',
    steps: [
      {
        id: 'boss-mon-1',
        prompt: '> Primeiro, verifique há quanto tempo o servidor está ligado e se a carga está alta. Qual é o load average?',
        check: (cmd) => /^uptime$/.test(cmd.trim()),
        expectedOutput: ' 14:30:25 up 42 days,  3:15,  2 users,  load average: 4.82, 3.95, 2.10',
        hints: ['Comece verificando o estado geral do sistema — tempo ligado e carga.', 'O comando `uptime` mostra tudo isso em uma única linha.'],
        feedbackRules: [
          { pattern: /^top$/, message: '`top` mostra muita informação. Para uma verificação rápida, use `uptime`.' },
        ],
      },
      {
        id: 'boss-mon-2',
        prompt: '> Load average alto! Verifique se o problema é memória — mostre o uso de RAM e swap em formato legível.',
        check: (cmd) => /^free\s+-h$/.test(cmd.trim()),
        expectedOutput: '              total        used        free      shared  buff/cache   available\nMem:           15Gi        14Gi       256Mi       512Mi       1.2Gi       768Mi\nSwap:         2.0Gi       1.8Gi       200Mi',
        hints: ['Verifique a memória com um comando que mostra valores legíveis para humanos.', 'Use `free -h` para ver RAM e swap em formato human-readable.'],
        feedbackRules: [
          { pattern: /^free$/, message: 'Quase! Adicione `-h` para ver os valores em GB/MB em vez de KB.' },
        ],
      },
      {
        id: 'boss-mon-3',
        prompt: '> Memória quase esgotada e swap em uso pesado! Abra o monitor de processos para identificar qual processo está consumindo tudo.',
        check: (cmd) => /^(top|htop)$/.test(cmd.trim()),
        expectedOutput: 'top - 14:30:25 up 42 days, load average: 4.82, 3.95, 2.10\nTasks: 195 total,   3 running, 192 sleeping\n%Cpu(s): 78.5 us, 12.3 sy,  0.0 ni,  5.2 id,  3.8 wa,  0.0 hi,  0.2 si\nMiB Mem:  15872.0 total,   256.0 free,  14336.0 used,   1280.0 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 3456 app       20   0 12.5g   11.2g   4096 R  65.3  72.4 142:30.50 java\n 7890 app       20   0  2.1g    1.8g   8192 R   8.7  11.6  28:15.20 python3\n 1234 root      20   0  512340  45200  12340 S   2.3   0.3   5:42.10 nginx',
        hints: ['Você precisa ver quais processos estão usando mais recursos em tempo real.', 'Use `top` para abrir o monitor interativo de processos.'],
        feedbackRules: [
          { pattern: /^ps\s+/, message: '`ps` mostra um snapshot. Para monitorar em tempo real, use `top`.' },
        ],
      },
      {
        id: 'boss-mon-4',
        prompt: '> O processo Java está usando 72% da RAM! Verifique se há gargalo de I/O no disco — mostre estatísticas estendidas de I/O.',
        check: (cmd) => /^iostat\s+-x(\s+\d+)?(\s+\d+)?$/.test(cmd.trim()),
        expectedOutput: 'avg-cpu:  %user   %nice %system %iowait  %steal   %idle\n          78.50    0.00   12.30    3.80    0.00    5.20\n\nDevice    r/s     w/s    rkB/s    wkB/s  await  %util\nsda     245.60  189.30  8192.00  12288.00  45.2  89.70',
        hints: ['Verifique as estatísticas de I/O de disco com informações detalhadas.', 'Use `iostat -x` para estatísticas estendidas de I/O de disco.'],
        feedbackRules: [
          { pattern: /^iostat$/, message: 'Adicione `-x` para ver informações estendidas como utilização e latência.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-system-vigilant',
  },

  achievements: ['system-monitoring', 'boss-system-vigilant'],
};
