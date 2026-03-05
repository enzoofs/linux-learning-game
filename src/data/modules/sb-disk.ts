import type { Module } from '../../types';

export const sbDiskModule: Module = {
  id: 'sb-disk',
  title: 'Disco & Armazenamento',
  description: 'Gerencie espaco em disco, particoes e sistemas de arquivos.',
  tier: 'Adept',
  prerequisites: ['sb-permissions'],
  isSideQuest: false,

  briefing: {
    concept:
      `Gerenciar espaço em disco é uma habilidade essencial. Servidores lotados causam falhas, perda de dados e downtime. Com os comandos certos, você monitora o uso, encontra arquivos grandes, cria links simbólicos e empacota arquivos para backup ou transferência.\n\n` +
      `Ferramentas fundamentais de disco:\n` +
      `• **df** — Mostra o espaço livre/usado de cada sistema de arquivos montado.\n` +
      `• **du** — Mostra quanto espaço cada diretório/arquivo ocupa.\n` +
      `• **mount/umount** — Monta e desmonta sistemas de arquivos (pen drives, partições).\n` +
      `• **lsblk** — Lista todos os dispositivos de bloco (discos, partições, USBs).\n` +
      `• **ln -s** — Cria links simbólicos (atalhos que apontam para outro arquivo/diretório).\n` +
      `• **tar** — Empacota e comprime arquivos (create: czf / extract: xzf).`,
    analogy:
      'Pense no disco como um armário. `df` mostra quantas prateleiras estão cheias. `du` mostra quanto espaço cada caixa ocupa. `ln -s` cria etiquetas que apontam para caixas em outros armários. `tar` empacota várias caixas em uma só para transporte.',
    syntax:
      'df -h\ndu -sh diretorio\ndu --max-depth=1 -h /caminho\nlsblk\nln -s alvo nome_do_link\ntar czf arquivo.tar.gz diretorio/\ntar xzf arquivo.tar.gz',
    commandBreakdowns: [
      {
        title: 'Criando e extraindo arquivos tar',
        command: 'tar czf backup.tar.gz -C /home/user docs/ fotos/',
        parts: [
          { text: 'tar', label: 'Tape Archive — empacota múltiplos arquivos em um só' },
          { text: 'c', label: 'Create — cria um novo arquivo (x = extrair, t = listar)' },
          { text: 'z', label: 'Comprime com gzip (j = bzip2, J = xz)' },
          { text: 'f', label: 'File — o próximo argumento é o nome do arquivo' },
          { text: 'backup.tar.gz', label: 'Nome do arquivo de saída' },
          { text: '-C /home/user', label: 'Muda para este diretório antes de empacotar' },
          { text: 'docs/ fotos/', label: 'Os diretórios a incluir no arquivo' },
        ],
      },
    ],
    examples: [
      { command: 'df -h', output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\n/dev/sdb1       500G  200G  280G  42% /data', explanation: 'Mostra espaço em disco de todas as partições em formato legível (-h = human).' },
      { command: 'du -sh /var/log', output: '2.3G\t/var/log', explanation: 'Mostra o tamanho total de /var/log. `-s` resume, `-h` formata.' },
      { command: 'du --max-depth=1 -h /home/enzo', output: '500M\t/home/enzo/Documents\n1.2G\t/home/enzo/Downloads\n50M\t/home/enzo/scripts\n1.8G\t/home/enzo', explanation: 'Mostra o tamanho de cada subdiretório até 1 nível de profundidade.' },
      { command: 'lsblk', output: 'NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\nsda      8:0    0    50G  0 disk\n├─sda1   8:1    0    49G  0 part /\n└─sda2   8:2    0     1G  0 part [SWAP]\nsdb      8:16   0   500G  0 disk\n└─sdb1   8:17   0   500G  0 part /data', explanation: 'Lista todos os discos e partições do sistema.' },
      { command: 'ln -s /opt/app/config.yml ~/config-link.yml', output: '', explanation: 'Cria um link simbólico: ~/config-link.yml aponta para o arquivo original.' },
      { command: 'tar czf backup.tar.gz projeto/', output: '', explanation: 'Cria um arquivo comprimido (.tar.gz) com todo o conteúdo de projeto/.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^df\s+-h$/, output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\ntmpfs           3.9G     0  3.9G   0% /dev/shm\n/dev/sdb1       500G  200G  280G  42% /data\n/dev/sdc1        16G   12G  3.5G  78% /backup' },
      { pattern: /^du\s+-sh\s+/, output: '2.3G\t/var/log' },
      { pattern: /^du\s+--max-depth=\d+/, output: '500M\t./Documents\n1.2G\t./Downloads\n200M\t./Pictures\n50M\t./scripts\n2.0G\t.' },
      { pattern: /^lsblk/, output: 'NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT\nsda      8:0    0    50G  0 disk\n├─sda1   8:1    0    49G  0 part /\n└─sda2   8:2    0     1G  0 part [SWAP]\nsdb      8:16   0   500G  0 disk\n└─sdb1   8:17   0   500G  0 part /data\nsdc      8:32   0    16G  0 disk\n└─sdc1   8:33   0    16G  0 part /backup' },
      { pattern: /^ln\s+-s\s+/, output: '' },
      { pattern: /^tar\s+czf\s+/, output: '' },
      { pattern: /^tar\s+xzf\s+/, output: '' },
      { pattern: /^mount\s+/, output: '' },
      { pattern: /^umount\s+/, output: '' },
      { pattern: /^df$/, output: 'Filesystem     1K-blocks     Used Available Use% Mounted on\n/dev/sda1       51380224 33423360  15319040  69% /' },
    ],
    contextHints: [
      'Tente `df -h` para ver o espaço em disco de todas as partições.',
      'Use `du -sh /caminho` para ver o tamanho de um diretório específico.',
      'Experimente `lsblk` para listar todos os discos e partições.',
      'Crie um link simbólico com `ln -s /alvo /link`.',
      'Empacote arquivos com `tar czf arquivo.tar.gz pasta/`.',
    ],
  },

  drills: [
    {
      id: 'disk-drill-1',
      prompt: 'Verifique o espaço em disco de todas as partições montadas, em formato legível para humanos.',
      difficulty: 'easy',
      check: (cmd) => /^df\s+-h$/.test(cmd.trim()),
      expectedOutput: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\n/dev/sdb1       500G  200G  280G  42% /data',
      hints: [
        'O comando `df` mostra o espaço em disco. Qual flag torna os tamanhos legíveis?',
        'Use `df -h` — a flag `-h` formata os tamanhos (K, M, G) em vez de blocos.',
      ],
      feedbackRules: [
        { pattern: /^df$/, message: 'Funciona, mas os valores ficam em blocos de 1K. Adicione `-h` para formato legível (human-readable).' },
        { pattern: /^du/, message: '`du` mostra o tamanho de diretórios. Para ver partições, use `df`.' },
      ],
      xp: 70,
    },
    {
      id: 'disk-drill-2',
      prompt: 'Descubra quais subdiretórios de `/home/enzo` estão ocupando mais espaço. Mostre até 1 nível de profundidade, em formato legível.',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^du\s+/.test(trimmed) &&
          /--max-depth=1/.test(trimmed) &&
          /-h/.test(trimmed) &&
          /\/home\/enzo\/?$/.test(trimmed);
      },
      expectedOutput: '500M\t/home/enzo/Documents\n1.2G\t/home/enzo/Downloads\n200M\t/home/enzo/Pictures\n50M\t/home/enzo/scripts\n2.0G\t/home/enzo',
      hints: [
        'Use `du` com `--max-depth=1` para limitar a profundidade e `-h` para formato legível.',
        'O comando completo: `du --max-depth=1 -h /home/enzo`.',
      ],
      feedbackRules: [
        { pattern: /du\s+-sh\s+\/home\/enzo/, message: '`-s` mostra apenas o total. Use `--max-depth=1` para ver cada subdiretório.' },
        { pattern: /du\s+(?!.*--max-depth).*\/home\/enzo/, message: 'Sem `--max-depth=1`, o `du` vai listar TODOS os subdiretórios recursivamente. Limite a profundidade!' },
      ],
      xp: 70,
    },
    {
      id: 'disk-drill-3',
      prompt: 'Crie um link simbólico chamado `logs` no diretório atual que aponte para `/var/log`.',
      difficulty: 'easy',
      check: (cmd) => /^ln\s+-s\s+\/var\/log\s+logs$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Links simbólicos são criados com `ln -s`. O formato é: `ln -s alvo nome_do_link`.',
        'O comando é: `ln -s /var/log logs`.',
      ],
      feedbackRules: [
        { pattern: /^ln\s+(?!-s)/, message: 'Sem a flag `-s`, o `ln` cria um hard link. Use `-s` para criar um link simbólico.' },
        { pattern: /^ln\s+-s\s+logs\s+\/var\/log/, message: 'A ordem está invertida! Primeiro o alvo, depois o nome do link: `ln -s /var/log logs`.' },
      ],
      xp: 70,
    },
    {
      id: 'disk-drill-4',
      prompt: 'Crie um arquivo comprimido `backup.tar.gz` contendo todo o diretório `projeto/`.',
      difficulty: 'medium',
      check: (cmd) => /^tar\s+czf\s+backup\.tar\.gz\s+projeto\/$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'O `tar` usa flags combinadas: `c` (create), `z` (gzip), `f` (file). Depois vem o nome do arquivo e a pasta.',
        'O comando é: `tar czf backup.tar.gz projeto/`.',
      ],
      feedbackRules: [
        { pattern: /tar\s+xzf/, message: '`x` é para extrair! Para criar, use `c` (create): `tar czf`.' },
        { pattern: /tar\s+cf\s+/, message: 'Isso cria um .tar sem compressão. Adicione `z` para comprimir com gzip: `tar czf`.' },
        { pattern: /zip\s+/, message: '`zip` funciona, mas `tar` é o padrão no Linux. Use `tar czf arquivo.tar.gz pasta/`.' },
      ],
      xp: 70,
    },
    {
      id: 'disk-drill-5',
      prompt: 'Extraia o conteúdo do arquivo `dados.tar.gz` no diretório atual.',
      difficulty: 'easy',
      check: (cmd) => /^tar\s+xzf\s+dados\.tar\.gz$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Para extrair, troque o `c` (create) por `x` (extract) nas flags do tar.',
        'O comando é: `tar xzf dados.tar.gz`.',
      ],
      feedbackRules: [
        { pattern: /tar\s+czf\s+dados/, message: '`c` é para criar! Para extrair, use `x`: `tar xzf dados.tar.gz`.' },
        { pattern: /unzip/, message: '`unzip` é para arquivos .zip. Para .tar.gz, use `tar xzf`.' },
      ],
      xp: 70,
    },
  ],

  boss: {
    title: 'O Administrador de Disco',
    scenario: 'O servidor de produção está com 92% do disco ocupado e quase parando. Você precisa investigar o que está consumindo espaço, fazer backup dos dados importantes, limpar o que for possível e organizar o armazenamento.',
    steps: [
      {
        id: 'boss-disk-1',
        prompt: '> ALERTA: Disco quase cheio! Primeiro, verifique o estado de todas as partições em formato legível.',
        check: (cmd) => /^df\s+-h$/.test(cmd.trim()),
        expectedOutput: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   46G  2.5G  95% /\n/dev/sdb1       500G  200G  280G  42% /data\n/dev/sdc1        16G   12G  3.5G  78% /backup',
        hints: [
          'Use `df` com `-h` para ver o espaço em todas as partições.',
          'df -h',
        ],
        feedbackRules: [
          { pattern: /^du/, message: '`du` mostra tamanho de diretórios. Para ver o estado das partições, use `df -h`.' },
        ],
      },
      {
        id: 'boss-disk-2',
        prompt: '> A partição raiz (`/`) está com 95%! Investigue quais diretórios do `/var` estão ocupando mais espaço. Mostre 1 nível de profundidade, formato legível.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^du\s+/.test(trimmed) &&
            /--max-depth=1/.test(trimmed) &&
            /-h/.test(trimmed) &&
            /\/var\/?$/.test(trimmed);
        },
        expectedOutput: '8.5G\t/var/log\n2.1G\t/var/cache\n500M\t/var/lib\n100M\t/var/tmp\n11.2G\t/var',
        hints: [
          'Use `du` com `--max-depth=1` e `-h` para ver quanto cada subdiretório ocupa.',
          'du --max-depth=1 -h /var',
        ],
        feedbackRules: [
          { pattern: /du\s+-sh\s+\/var/, message: '`-s` mostra só o total. Use `--max-depth=1` para ver cada subdiretório.' },
        ],
      },
      {
        id: 'boss-disk-3',
        prompt: '> Encontrado! `/var/log` tem 8.5G de logs antigos. Antes de limpar, faça um backup: crie o arquivo comprimido `/backup/logs_antigos.tar.gz` contendo `/var/log/`.',
        check: (cmd) => /^tar\s+czf\s+\/backup\/logs_antigos\.tar\.gz\s+\/var\/log\/$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `tar czf` para criar um arquivo comprimido.',
          'tar czf /backup/logs_antigos.tar.gz /var/log/',
        ],
        feedbackRules: [
          { pattern: /tar\s+czf\s+logs_antigos/, message: 'O destino deve ser `/backup/logs_antigos.tar.gz` (na partição de backup).' },
        ],
      },
      {
        id: 'boss-disk-4',
        prompt: '> Backup feito! Agora crie um link simbólico chamado `/var/log-backup` que aponte para `/backup/logs_antigos.tar.gz`, para referência rápida.',
        check: (cmd) => /^ln\s+-s\s+\/backup\/logs_antigos\.tar\.gz\s+\/var\/log-backup$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `ln -s alvo nome_do_link` para criar o link simbólico.',
          'ln -s /backup/logs_antigos.tar.gz /var/log-backup',
        ],
        feedbackRules: [
          { pattern: /ln\s+(?!-s)/, message: 'Sem `-s` você cria um hard link. Use `ln -s` para um link simbólico.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-disk-admin',
  },

  achievements: ['disk-management', 'boss-disk-admin'],
};
