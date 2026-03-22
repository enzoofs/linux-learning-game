import type { Module } from '../../types';

export const cliBasicsModule: Module = {
  id: 'cli-basics',
  title: 'Fundamentos do CLI',
  description: 'Seus primeiros passos no terminal — navegação, listagem e criação de diretórios.',
  tier: 'Recruit',
  prerequisites: [],
  isSideQuest: false,

  briefing: {
    concept:
      `O terminal é a sua janela para o sistema. Cada comando que você digita diz ao computador exatamente o que fazer — sem cliques, sem adivinhação. Vamos começar com os 4 comandos mais fundamentais:\n\n` +
      `• **pwd** — "Onde eu estou?" Mostra o diretório atual.\n` +
      `• **ls** — "O que tem aqui?" Lista arquivos e pastas.\n` +
      `• **cd** — "Me leva lá." Muda o diretório.\n` +
      `• **mkdir** — "Cria algo." Cria um novo diretório.`,
    analogy:
      'Pense no terminal como um prédio. `pwd` diz em qual sala você está. `ls` mostra o que tem na sala. `cd` te leva para outra sala. `mkdir` constrói uma sala nova.',
    syntax:
      'pwd\nls [options] [path]\ncd [directory]\nmkdir [-p] directory',
    examples: [
      { command: 'pwd', output: '/home/enzo', explanation: 'Mostra sua localização atual — o diretório home.' },
      { command: 'ls', output: 'Desktop  Documents  Downloads  Music', explanation: 'Lista tudo no diretório atual.' },
      { command: 'ls -l', output: 'drwxr-xr-x 2 enzo enzo 4096 Desktop\n...', explanation: 'Formato longo: mostra permissões, dono, tamanho e data.' },
      { command: 'cd Documents', output: '', explanation: 'Entra no diretório Documents. Use `cd` sozinho para voltar ao home.' },
      { command: 'mkdir projects', output: '', explanation: 'Cria um novo diretório chamado "projects".' },
      { command: 'mkdir -p a/b/c', output: '', explanation: 'Cria diretórios aninhados de uma vez com -p.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^pwd$/, output: '/home/enzo' },
      { pattern: /^ls$/, output: 'Desktop  Documents  Downloads  Music  Pictures  scripts  .bashrc  .profile' },
      { pattern: /^ls\s+-l/, output: 'total 32\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads\ndrwxr-xr-x 2 enzo enzo 4096 Feb 28 11:00 Music\ndrwxr-xr-x 3 enzo enzo 4096 Mar 01 16:45 Pictures\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 10:00 scripts\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\n-rw-r--r-- 1 enzo enzo  807 Jan 01 00:00 .profile' },
      { pattern: /^ls\s+-a/, output: '.  ..  .bashrc  .profile  .ssh  Desktop  Documents  Downloads  Music  Pictures  scripts' },
      { pattern: /^cd\s+\S+/, output: '' },
      { pattern: /^cd$/, output: '' },
      { pattern: /^mkdir\s+/, output: '' },
      { pattern: /^whoami$/, output: 'enzo' },
      { pattern: /^hostname$/, output: 'linux-quest' },
    ],
    contextHints: [
      'Tente digitar `pwd` para ver onde você está!',
      'Use `ls` para ver quais arquivos estão no diretório atual.',
      'Tente `ls -l` para ver informações detalhadas dos arquivos.',
      'Use `cd Documents` para navegar até uma pasta.',
      'Crie um diretório com `mkdir mydir`.',
    ],
  },

  drills: [
    {
      id: 'basics-drill-1',
      prompt: 'Onde você está agora? Mostre o diretório de trabalho atual.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'pwd',
      expectedOutput: '/home/enzo',
      hints: ['O comando tem 3 letras: p_d', 'Pense em "print working directory" — ele imprime o caminho completo de onde você está.'],
      feedbackRules: [
        { pattern: /^cwd$/i, message: '`cwd` não é um comando — tente `pwd` (print working directory).' },
        { pattern: /^where/i, message: 'No terminal, usamos `pwd` em vez de "where".' },
      ],
      xp: 50,
    },
    {
      id: 'basics-drill-2',
      prompt: 'Liste todos os arquivos, incluindo os ocultos (que começam com ponto).',
      difficulty: 'easy',
      check: (cmd) => /^ls\s+-a$/.test(cmd.trim()),
      expectedOutput: '.  ..  .bashrc  .profile  .ssh  Desktop  Documents  Downloads  Music  Pictures  scripts',
      hints: ['O comando `ls` aceita flags para mudar seu comportamento. Qual flag revela o que está escondido?', 'Arquivos ocultos começam com `.` — use a flag `-a` (all) junto com `ls`.'],
      feedbackRules: [
        { pattern: /^ls$/, message: 'Bom começo! Mas `ls` sozinho esconde dotfiles. Adicione `-a` para mostrar tudo.' },
        { pattern: /^ls\s+-l$/, message: '`-l` mostra o formato longo. Para ver arquivos ocultos, use `-a`.' },
        { pattern: /^ls\s+-la/, message: 'Isso funciona na prática! Mas para este drill, só `ls -a` é o que precisamos.' },
      ],
      xp: 50,
    },
    {
      id: 'basics-drill-3',
      prompt: 'Navegue até o diretório Documents.',
      difficulty: 'medium',
      check: (cmd) => /^cd\s+Documents\/?$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Use `cd` seguido do nome do diretório.', 'Atenção: no Linux, letras maiúsculas e minúsculas importam. O nome da pasta começa com "D".'],
      feedbackRules: [
        { pattern: /^cd\s+documents/i, message: 'Quase! O Linux diferencia maiúsculas e minúsculas. Use `Documents` com D maiúsculo.' },
        { pattern: /^cd$/, message: '`cd` sozinho vai para o diretório home. Especifique a pasta: `cd Documents`.' },
      ],
      xp: 75,
    },
    {
      id: 'basics-drill-4',
      prompt: 'Crie uma estrutura de diretórios aninhada: `projects/src/components` — tudo de uma vez, mesmo que os diretórios pai não existam.',
      difficulty: 'medium',
      check: (cmd) => /^mkdir\s+-p\s+projects\/src\/components$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['`mkdir` sozinho não cria diretórios aninhados. Você precisa de uma flag que cria os pais também...', 'A flag é `-p` (parents).'],
      feedbackRules: [
        { pattern: /^mkdir\s+projects\/src\/components$/, message: 'Isso falharia porque `projects/` ainda não existe! Use `-p` para criar os diretórios pai.' },
        { pattern: /^mkdir\s+-p\s+projects$/, message: 'Você está criando apenas `projects/`. O caminho completo é `projects/src/components`.' },
      ],
      xp: 100,
    },
    {
      id: 'basics-drill-5',
      prompt: 'Liste o conteúdo do diretório atual em formato longo, ordenado por data de modificação (mais recente por último), incluindo arquivos ocultos.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        if (!/^ls\s+-[latr]+$/.test(trimmed)) return false;
        const flags = trimmed.replace('ls -', '');
        return flags.includes('l') && flags.includes('a') && flags.includes('t') && flags.includes('r');
      },
      expectedOutput: '-rw-r--r-- 1 enzo enzo  807 Jan 01 00:00 .profile\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\ndrwxr-xr-x 2 enzo enzo 4096 Feb 28 11:00 Music\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 3 enzo enzo 4096 Mar 01 16:45 Pictures\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 10:00 scripts',
      hints: [
        'Você precisa de 4 flags: formato longo, todos os arquivos, ordenar por tempo, ordem reversa.',
        'As flags são: `-l` (long) `-a` (all) `-t` (time sort) `-r` (reverse).',
      ],
      feedbackRules: [
        { pattern: /^ls\s+-l$/, message: 'Isso é o formato longo. Agora adicione `-a` (all), `-t` (time), `-r` (reverse).' },
        { pattern: /^ls\s+-la$/, message: 'Bom, long + all! Adicione `-t` para ordenar por tempo e `-r` para inverter.' },
        { pattern: /^ls\s+-lat$/, message: 'Quase! Adicione `-r` para inverter a ordem (mais antigo primeiro, mais recente por último).' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'O Navegador',
    scenario: 'Você acabou de conectar via SSH em um novo servidor. Oriente-se: descubra onde você está, explore o sistema de arquivos e prepare seu workspace de projeto.',
    steps: [
      {
        id: 'boss-basics-1',
        prompt: '> Você acabou de conectar no servidor. Primeiro de tudo — onde você está?',
        check: (cmd) => cmd.trim() === 'pwd',
        expectedOutput: '/home/enzo',
        hints: ['Comece pelo básico. Mostre seu diretório de trabalho.', 'O comando que mostra onde você está tem a ver com "print" + "working directory".'],
        feedbackRules: [],
      },
      {
        id: 'boss-basics-2',
        prompt: '> Boa, você está no home. Agora olhe ao redor — quais arquivos e pastas estão aqui? Mostre TODOS, incluindo os ocultos, com detalhes completos.',
        check: (cmd) => /^ls\s+/.test(cmd.trim()) && cmd.includes('l') && cmd.includes('a'),
        expectedOutput: 'total 40\ndrwxr-xr-x 8 enzo enzo 4096 Mar 03 10:00 .\ndrwxr-xr-x 3 root root 4096 Jan 01 00:00 ..\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\ndrwx------ 2 enzo enzo 4096 Mar 01 08:00 .ssh\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads',
        hints: ['Você precisa de um comando que liste tudo com detalhes — incluindo o que está escondido.', 'Combine as flags `-l` (long) e `-a` (all) no comando `ls`.'],
        feedbackRules: [
          { pattern: /^ls$/, message: 'Você precisa de mais detalhes! Adicione `-la` para ver arquivos ocultos e permissões.' },
        ],
      },
      {
        id: 'boss-basics-3',
        prompt: '> Hora de montar seu workspace. Crie a estrutura de diretórios: `projects/cli-quest/src` — tudo de uma vez.',
        check: (cmd) => /^mkdir\s+-p\s+projects\/cli-quest\/src$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['O `mkdir` sozinho não consegue criar vários níveis de pastas. Existe uma flag que cria os diretórios intermediários automaticamente.', 'Use `mkdir` com a flag `-p` (parents) seguida do caminho completo `projects/cli-quest/src`.'],
        feedbackRules: [],
      },
      {
        id: 'boss-basics-4',
        prompt: '> Agora navegue até o seu novo diretório de projeto.',
        check: (cmd) => /^cd\s+projects\/cli-quest(\/src)?\/?$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `cd` para entrar no diretório que você acabou de criar.', 'O caminho começa em `projects/` — navegue até `projects/cli-quest` ou `projects/cli-quest/src`.'],
        feedbackRules: [],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-navigator',
  },

  achievements: ['first-steps', 'boss-navigator'],
};
