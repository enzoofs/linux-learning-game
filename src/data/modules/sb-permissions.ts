import type { Module } from '../../types';

export const sbPermissionsModule: Module = {
  id: 'sb-permissions',
  title: 'Permissoes & Seguranca',
  description: 'Controle quem pode ler, escrever e executar cada arquivo.',
  tier: 'Initiate',
  prerequisites: ['sb-shell-tricks'],
  isSideQuest: false,

  briefing: {
    concept:
      `No Linux, cada arquivo e diretorio tem um dono, um grupo e permissoes que definem quem pode fazer o que. As permissoes sao divididas em tres categorias: leitura (r), escrita (w) e execucao (x), para tres niveis de acesso: usuario (u), grupo (g) e outros (o).\n\n` +
      `Existem duas formas de definir permissoes com o \`chmod\`:\n` +
      `• **Octal** — Cada digito (0-7) representa as permissoes de um nivel. Ex: 755 = rwxr-xr-x\n` +
      `• **Simbolica** — Usa letras e operadores. Ex: u+x adiciona execucao para o usuario.\n\n` +
      `Alem do \`chmod\`, voce precisa conhecer:\n` +
      `• **chown** — Muda o dono (e opcionalmente o grupo) de um arquivo.\n` +
      `• **chgrp** — Muda apenas o grupo de um arquivo.\n` +
      `• **umask** — Define as permissoes padrao para novos arquivos.\n` +
      `• **sudo** — Executa um comando como superusuario (root).\n` +
      `• **su** — Troca para outro usuario.`,
    analogy:
      'Pense nas permissoes como um predio com tres tipos de chave: a chave do morador (usuario), a chave do andar (grupo) e a chave do visitante (outros). O `chmod` troca as fechaduras, o `chown` muda o nome na porta, e o `sudo` e o cartao-mestre do zelador.',
    syntax:
      'chmod [octal|simbolico] arquivo\nchown usuario[:grupo] arquivo\nchgrp grupo arquivo\numask [mascara]\nsudo comando\nsu [usuario]',
    examples: [
      { command: 'chmod 755 script.sh', output: '', explanation: 'Define rwx para o dono, r-x para grupo e outros. Ideal para scripts executaveis.' },
      { command: 'chmod 644 config.txt', output: '', explanation: 'Define rw- para o dono, r-- para grupo e outros. Padrao para arquivos de texto.' },
      { command: 'chmod u+x deploy.sh', output: '', explanation: 'Adiciona permissao de execucao apenas para o usuario (dono).' },
      { command: 'chmod g-w relatorio.txt', output: '', explanation: 'Remove permissao de escrita do grupo.' },
      { command: 'chown enzo:devs projeto/', output: '', explanation: 'Muda o dono para "enzo" e o grupo para "devs".' },
      { command: 'sudo apt update', output: 'Reading package lists... Done', explanation: 'Executa o comando como root — necessario para tarefas administrativas.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ls\s+-l/, output: 'total 16\n-rw-r--r-- 1 enzo enzo  512 Mar 01 10:00 config.txt\n-rw-r--r-- 1 enzo enzo 1024 Mar 02 14:30 relatorio.txt\n-rw-r--r-- 1 enzo enzo  256 Mar 03 08:15 deploy.sh\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 10:00 projeto' },
      { pattern: /^chmod\s+755\s+\w+/, output: '' },
      { pattern: /^chmod\s+644\s+\w+/, output: '' },
      { pattern: /^chmod\s+[ugo][+-][rwx]\s+\w+/, output: '' },
      { pattern: /^chown\s+\w+[:]?\w*\s+\w+/, output: '' },
      { pattern: /^chgrp\s+\w+\s+\w+/, output: '' },
      { pattern: /^umask$/, output: '0022' },
      { pattern: /^umask\s+\d+/, output: '' },
      { pattern: /^sudo\s+.+/, output: '[sudo] senha para enzo: \ncomando executado com sucesso.' },
      { pattern: /^stat\s+\w+/, output: '  File: deploy.sh\n  Size: 256       \tBlocks: 8          IO Block: 4096   regular file\nAccess: (0644/-rw-r--r--)  Uid: ( 1000/   enzo)   Gid: ( 1000/   enzo)' },
    ],
    contextHints: [
      'Use `ls -l` para ver as permissoes atuais dos arquivos.',
      'Tente `chmod 755 deploy.sh` para tornar o script executavel.',
      'Use `chmod u+x deploy.sh` para a forma simbolica.',
      'Veja o umask atual com `umask` — ele define as permissoes padrao.',
      'Use `chown enzo:devs projeto/` para mudar o dono e o grupo.',
    ],
  },

  drills: [
    {
      id: 'perm-drill-1',
      prompt: 'Defina as permissoes do arquivo `deploy.sh` para 755 (rwxr-xr-x) usando notacao octal.',
      difficulty: 'easy',
      check: (cmd) => /^chmod\s+755\s+deploy\.sh$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'O comando `chmod` aceita numeros octais: 7=rwx, 5=r-x, 4=r--.',
        'Use `chmod 755 deploy.sh` — o primeiro digito e para o dono, o segundo para o grupo, o terceiro para outros.',
      ],
      feedbackRules: [
        { pattern: /^chmod\s+777/, message: '777 da permissao total para todos — isso e inseguro! Use 755 para scripts.' },
        { pattern: /^chmod\s+u\+x/, message: 'Voce usou a forma simbolica. Neste drill, use a notacao octal: `chmod 755 deploy.sh`.' },
      ],
      xp: 60,
    },
    {
      id: 'perm-drill-2',
      prompt: 'Adicione permissao de execucao para o usuario (dono) no arquivo `backup.sh` usando notacao simbolica.',
      difficulty: 'easy',
      check: (cmd) => /^chmod\s+u\+x\s+backup\.sh$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Na forma simbolica, `u` significa usuario (dono), `+` adiciona, e `x` e execucao.',
        'O comando e: `chmod u+x backup.sh`.',
      ],
      feedbackRules: [
        { pattern: /^chmod\s+\d+/, message: 'Voce usou a notacao octal. Neste drill, use a forma simbolica: `chmod u+x backup.sh`.' },
        { pattern: /^chmod\s+\+x/, message: 'Quase! Sem especificar `u`, voce altera todos os niveis. Use `u+x` para afetar apenas o dono.' },
      ],
      xp: 60,
    },
    {
      id: 'perm-drill-3',
      prompt: 'Mude o dono do diretorio `projeto/` para o usuario `admin` e o grupo `devs`.',
      difficulty: 'medium',
      check: (cmd) => /^chown\s+admin:devs\s+projeto\/?$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'O `chown` aceita o formato `usuario:grupo` para mudar ambos de uma vez.',
        'Use `chown admin:devs projeto/`.',
      ],
      feedbackRules: [
        { pattern: /^chown\s+admin\s+projeto/, message: 'Voce mudou apenas o dono. Para mudar o grupo tambem, use o formato `admin:devs`.' },
        { pattern: /^chgrp/, message: '`chgrp` muda apenas o grupo. Use `chown admin:devs` para mudar dono e grupo juntos.' },
      ],
      xp: 60,
    },
    {
      id: 'perm-drill-4',
      prompt: 'Exiba o valor atual do umask.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'umask',
      expectedOutput: '0022',
      hints: [
        'O comando que exibe a mascara de permissoes padrao tem 5 letras.',
        'Digite `umask` sem argumentos para ver o valor atual.',
      ],
      feedbackRules: [
        { pattern: /^umask\s+\d+/, message: 'Voce esta definindo um novo umask! Para apenas exibir o valor atual, use `umask` sem argumentos.' },
        { pattern: /^echo\s+\$UMASK/i, message: 'Nao existe variavel $UMASK. O comando correto e simplesmente `umask`.' },
      ],
      xp: 60,
    },
    {
      id: 'perm-drill-5',
      prompt: 'Execute o comando `apt update` como superusuario usando `sudo`.',
      difficulty: 'medium',
      check: (cmd) => /^sudo\s+apt\s+update$/.test(cmd.trim()),
      expectedOutput: '[sudo] senha para enzo: \nReading package lists... Done',
      hints: [
        'Para executar comandos como root, basta prefixar com `sudo`.',
        'O comando completo e: `sudo apt update`.',
      ],
      feedbackRules: [
        { pattern: /^apt\s+update$/, message: 'Sem `sudo`, voce nao tem permissao para atualizar os pacotes. Prefixe com `sudo`.' },
        { pattern: /^su\s/, message: '`su` troca de usuario inteiramente. Para executar um unico comando como root, use `sudo`.' },
      ],
      xp: 60,
    },
  ],

  boss: {
    title: 'O Guardiao das Permissoes',
    scenario: 'Voce encontrou um servidor com permissoes quebradas. Um script critico nao executa, arquivos de configuracao estao expostos para todos, e o diretorio do projeto pertence ao usuario errado. Corrija tudo antes que o sistema fique vulneravel!',
    steps: [
      {
        id: 'boss-perm-1',
        prompt: '> O script `critical.sh` precisa ser executavel pelo dono. Defina as permissoes para 755.',
        check: (cmd) => /^chmod\s+755\s+critical\.sh$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'O script precisa de permissao de execucao. Em octal, 7 = rwx para o dono.',
          'Use `chmod 755 critical.sh` para definir rwxr-xr-x.',
        ],
        feedbackRules: [
          { pattern: /^chmod\s+\+x/, message: 'Funciona, mas precisamos de permissoes exatas. Use a notacao octal 755.' },
        ],
      },
      {
        id: 'boss-perm-2',
        prompt: '> O arquivo `secrets.conf` esta com permissao 777 — qualquer um pode ler e escrever! Restrinja para que apenas o dono possa ler e escrever (644).',
        check: (cmd) => /^chmod\s+644\s+secrets\.conf$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          '644 significa rw- para o dono e r-- para grupo e outros.',
          'Use `chmod 644 secrets.conf`.',
        ],
        feedbackRules: [
          { pattern: /^chmod\s+600/, message: '600 e muito restritivo — o grupo e outros nao poderao nem ler. Use 644.' },
          { pattern: /^chmod\s+777/, message: 'As permissoes ja estao em 777 — isso e o problema! Use 644.' },
        ],
      },
      {
        id: 'boss-perm-3',
        prompt: '> O diretorio `webapp/` pertence ao usuario `nobody`. Transfira para o usuario `deploy` e grupo `www-data`.',
        check: (cmd) => /^chown\s+deploy:www-data\s+webapp\/?$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `chown` com o formato `usuario:grupo`.',
          'O comando completo e `chown deploy:www-data webapp/`.',
        ],
        feedbackRules: [
          { pattern: /^chgrp/, message: '`chgrp` muda apenas o grupo. Voce precisa mudar dono e grupo — use `chown deploy:www-data`.' },
        ],
      },
      {
        id: 'boss-perm-4',
        prompt: '> Por fim, reinicie o servico web com privilegios de superusuario: `sudo systemctl restart nginx`.',
        check: (cmd) => /^sudo\s+systemctl\s+restart\s+nginx$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Reiniciar servicos requer privilegios de root. Use `sudo`.',
          'O comando completo e `sudo systemctl restart nginx`.',
        ],
        feedbackRules: [
          { pattern: /^systemctl\s+restart/, message: 'Voce precisa de privilegios de root para reiniciar servicos. Prefixe com `sudo`.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-permissions-guardian',
  },

  achievements: ['permissions-basics', 'boss-permissions-guardian'],
};
