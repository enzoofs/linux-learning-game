import type { Module } from '../../types';

export const systemAdminModule: Module = {
  id: 'system-admin',
  title: 'Admin do Sistema',
  description: 'Domine a administração de sistemas Linux: gerencie usuários, monitore recursos, controle serviços e configure o ambiente.',
  tier: 'Specialist',
  prerequisites: ['process-mgmt'],
  isSideQuest: false,

  briefing: {
    concept:
      `A administração de sistemas é a arte de manter um servidor Linux saudável e seguro. De gerenciar usuários a monitorar recursos, esses comandos são o kit de sobrevivência de todo sysadmin.\n\n` +
      `**Identidade e usuários:**\n` +
      `• **whoami** — Mostra o nome do usuário atual.\n` +
      `• **id** — Mostra UID, GID e todos os grupos do usuário.\n` +
      `• **useradd** — Cria um novo usuário no sistema (requer root).\n` +
      `• **usermod** — Modifica um usuário existente (ex: adicionar a um grupo).\n` +
      `• **passwd** — Altera a senha de um usuário.\n\n` +
      `**Informações do sistema:**\n` +
      `• **uname -a** — Mostra informações do kernel, hostname e arquitetura.\n` +
      `• **hostname** — Exibe o nome do host da máquina.\n` +
      `• **uptime** — Mostra há quanto tempo o sistema está ligado e a carga média.\n` +
      `• **free -h** — Exibe o uso de memória RAM e swap em formato legível.\n\n` +
      `**Disco e armazenamento:**\n` +
      `• **df -h** — Mostra o espaço em disco de todas as partições montadas.\n` +
      `• **du -sh dir** — Mostra o tamanho total de um diretório.\n\n` +
      `**Serviços (systemd):**\n` +
      `• **systemctl status serviço** — Verifica o estado de um serviço.\n` +
      `• **systemctl start/stop/restart serviço** — Controla um serviço.\n\n` +
      `**Variáveis de ambiente:**\n` +
      `• **env** — Lista todas as variáveis de ambiente.\n` +
      `• **echo $VAR** — Exibe o valor de uma variável específica.\n` +
      `• **export VAR=valor** — Define ou atualiza uma variável de ambiente.`,
    analogy:
      'Pense no sysadmin como o zelador de um prédio. `whoami` é seu crachá, `df` verifica quanto espaço tem nos armários, `free` monitora a energia disponível, `systemctl` liga e desliga os equipamentos, e `export` coloca avisos no mural para todos lerem.',
    syntax:
      'whoami                       # who am I?\nid                           # UID, GID and groups\nuseradd nome                 # create user (needs root)\nusermod -aG grupo usuario    # add user to group\npasswd usuario               # change password\nuname -a                     # kernel and system info\nhostname                     # show hostname\nuptime                       # uptime and load average\nfree -h                      # memory usage (human-readable)\ndf -h                        # disk space (human-readable)\ndu -sh dir                   # directory size\nsystemctl status service     # check service status\nsystemctl start service      # start a service\nsystemctl stop service       # stop a service\nsystemctl restart service    # restart a service\nenv                          # list environment variables\necho $VAR                    # print a variable\nexport VAR=value             # set environment variable',
    commandBreakdowns: [
      {
        title: 'Anatomia do systemctl',
        command: 'sudo systemctl restart nginx.service',
        parts: [
          { text: 'sudo', label: 'Executa como superusuário (necessário para gerenciar serviços)' },
          { text: 'systemctl', label: 'Controlador do systemd — gerencia serviços do sistema' },
          { text: 'restart', label: 'Ação: para e inicia o serviço (outras: start, stop, status, enable, disable)' },
          { text: 'nginx.service', label: 'Nome da unidade/serviço (o .service é opcional)' },
        ],
      },
      {
        title: 'Análise de uso de disco',
        command: 'du -sh /var/log/* | sort -rh | head -5',
        parts: [
          { text: 'du', label: 'Disk Usage — mostra o tamanho de arquivos/diretórios' },
          { text: '-s', label: 'Summary — mostra apenas o total de cada argumento (não lista subdiretórios)' },
          { text: '-h', label: 'Human-readable — mostra em KB, MB, GB em vez de bytes' },
          { text: '/var/log/*', label: 'Expande para todos os itens dentro de /var/log/' },
          { text: '| sort -rh', label: 'Ordena: -r = reverso (maior primeiro), -h = entende sufixos humanos (10G > 500M)' },
          { text: '| head -5', label: 'Mostra apenas os 5 maiores' },
        ],
      },
    ],
    examples: [
      { command: 'whoami', output: 'enzo', explanation: 'Mostra o nome do usuário logado no terminal.' },
      { command: 'id', output: 'uid=1000(enzo) gid=1000(enzo) groups=1000(enzo),27(sudo),999(docker)', explanation: 'Mostra o UID, GID e todos os grupos do usuário atual. Útil para verificar permissões.' },
      { command: 'df -h', output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\n/dev/sda2       200G  150G   40G  79% /home\ntmpfs           3.9G     0  3.9G   0% /dev/shm', explanation: 'Mostra o espaço em disco de cada partição. `-h` formata em GB/MB legíveis.' },
      { command: 'free -h', output: '              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       3.8Gi       1.2Gi       256Mi       2.7Gi       3.4Gi\nSwap:         2.0Gi       512Mi       1.5Gi', explanation: 'Mostra o uso de memória RAM e swap. `available` indica quanta memória está efetivamente disponível.' },
      { command: 'systemctl status nginx', output: '● nginx.service - A high performance web server\n     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n     Active: active (running) since Mon 2024-01-15 09:00:00 UTC; 3h ago\n   Main PID: 1234 (nginx)\n      Tasks: 3\n     Memory: 12.4M', explanation: 'Mostra o status do serviço nginx: se está ativo, desde quando, PID e uso de memória.' },
      { command: 'export EDITOR=vim', output: '', explanation: 'Define a variável de ambiente EDITOR como vim. Todos os programas na sessão verão essa variável.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^whoami$/, output: 'enzo', description: 'Show current user' },
      { pattern: /^id$/, output: 'uid=1000(enzo) gid=1000(enzo) groups=1000(enzo),27(sudo),999(docker)', description: 'Show UID, GID and groups' },
      { pattern: /^uname\s+-a$/, output: 'Linux linux-server 5.15.0-91-generic #101-Ubuntu SMP x86_64 GNU/Linux', description: 'Show system info' },
      { pattern: /^hostname$/, output: 'linux-server', description: 'Show hostname' },
      { pattern: /^uptime$/, output: ' 14:35:22 up 45 days,  3:12,  2 users,  load average: 0.52, 0.38, 0.41', description: 'Show uptime and load' },
      { pattern: /^free\s+-h$/, output: '              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       3.8Gi       1.2Gi       256Mi       2.7Gi       3.4Gi\nSwap:         2.0Gi       512Mi       1.5Gi', description: 'Show memory usage' },
      { pattern: /^df\s+-h$/, output: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\n/dev/sda2       200G  150G   40G  79% /home\ntmpfs           3.9G     0  3.9G   0% /dev/shm', description: 'Show disk space' },
      { pattern: /^du\s+-sh\s+\/var\/log\/?$/, output: '1.2G\t/var/log', description: 'Show /var/log size' },
      { pattern: /^systemctl\s+status\s+nginx$/, output: '● nginx.service - A high performance web server\n     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n     Active: active (running) since Mon 2024-01-15 09:00:00 UTC; 3h ago\n   Main PID: 1234 (nginx)\n      Tasks: 3\n     Memory: 12.4M', description: 'Check nginx status' },
      { pattern: /^systemctl\s+status\s+postgresql$/, output: '● postgresql.service - PostgreSQL RDBMS\n     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)\n     Active: inactive (dead)\n   Main PID: none', description: 'Check postgresql status' },
      { pattern: /^systemctl\s+start\s+postgresql$/, output: '', description: 'Start postgresql' },
      { pattern: /^systemctl\s+restart\s+nginx$/, output: '', description: 'Restart nginx' },
      { pattern: /^env$/, output: 'HOME=/home/enzo\nUSER=enzo\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin\nLANG=pt_BR.UTF-8\nEDITOR=nano\nTERM=xterm-256color', description: 'List environment variables' },
      { pattern: /^echo\s+\$HOME$/, output: '/home/enzo', description: 'Print HOME variable' },
      { pattern: /^echo\s+\$PATH$/, output: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin', description: 'Print PATH variable' },
      { pattern: /^echo\s+\$EDITOR$/, output: 'nano', description: 'Print EDITOR variable' },
      { pattern: /^export\s+\w+=.+$/, output: '', description: 'Set environment variable' },
    ],
    contextHints: [
      'Tente `whoami` para ver com qual usuário você está logado.',
      'Use `id` para ver seus grupos e permissões.',
      'Veja informações do sistema com `uname -a` ou `hostname`.',
      'Confira a memória com `free -h` e o disco com `df -h`.',
      'Verifique o status de um serviço: `systemctl status nginx`.',
      'Liste variáveis de ambiente com `env` ou veja uma específica com `echo $HOME`.',
      'Defina uma variável com `export MINHA_VAR=valor`.',
      'Use `uptime` para ver há quanto tempo o servidor está ligado.',
    ],
  },

  initialFS: {
    name: '/',
    type: 'directory',
    children: [
      {
        name: 'etc',
        type: 'directory',
        children: [
          { name: 'hostname', type: 'file', content: 'linux-server' },
          { name: 'passwd', type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nenzo:x:1000:1000:Enzo Ferraz:/home/enzo:/bin/bash\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\npostgres:x:112:120:PostgreSQL administrator:/var/lib/postgresql:/bin/bash' },
          { name: 'group', type: 'file', content: 'root:x:0:\nsudo:x:27:enzo\ndocker:x:999:enzo\nwww-data:x:33:' },
        ],
      },
      {
        name: 'home',
        type: 'directory',
        children: [
          {
            name: 'enzo',
            type: 'directory',
            children: [
              { name: 'server.log', type: 'file', content: '[2024-01-15 09:00] nginx started\n[2024-01-15 09:01] postgresql failed to start\n[2024-01-15 09:05] disk usage warning: /dev/sda2 at 79%\n[2024-01-15 10:30] new user devops created\n[2024-01-15 12:00] backup completed successfully' },
              { name: 'notas.txt', type: 'file', content: 'TODO: reiniciar postgresql\nTODO: verificar espaco em disco\nTODO: adicionar devops ao grupo docker' },
            ],
          },
        ],
      },
      {
        name: 'var',
        type: 'directory',
        children: [
          {
            name: 'log',
            type: 'directory',
            children: [
              { name: 'syslog', type: 'file', content: 'Jan 15 09:00:01 linux-server systemd[1]: Started nginx.\nJan 15 09:01:03 linux-server systemd[1]: postgresql.service: Failed.\nJan 15 10:30:00 linux-server useradd[4521]: new user: name=devops, UID=1001' },
            ],
          },
        ],
      },
    ],
  },

  drills: [
    {
      id: 'sysadmin-drill-1',
      prompt: 'Descubra com qual usuário você está logado no terminal.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'whoami',
      expectedOutput: 'enzo',
      hints: [
        'O comando pergunta literalmente "quem sou eu?" em inglês.',
        'Tente: `whoami`',
      ],
      feedbackRules: [
        { pattern: /^id$/, message: '`id` mostra mais detalhes (UID, GID, grupos). Para apenas o nome de usuário, use `whoami`.' },
        { pattern: /^who$/, message: '`who` mostra quem está logado no sistema. Para saber *seu* nome de usuário, use `whoami`.' },
        { pattern: /^echo\s+\$USER$/, message: '`echo $USER` funciona na prática! Mas o comando direto é `whoami`.' },
        { pattern: /^user/i, message: 'O comando é `whoami` — tudo junto, sem espaços.' },
      ],
      xp: 50,
    },
    {
      id: 'sysadmin-drill-2',
      prompt: 'Verifique o espaço em disco de todas as partições montadas, em formato legível para humanos (GB, MB).',
      difficulty: 'easy',
      check: (cmd) => /^df\s+-h$/.test(cmd.trim()),
      expectedOutput: 'Filesystem      Size  Used Avail Use% Mounted on\n/dev/sda1        50G   32G   16G  67% /\n/dev/sda2       200G  150G   40G  79% /home\ntmpfs           3.9G     0  3.9G   0% /dev/shm',
      hints: [
        'O comando para "disk free" mostra o espaço livre em disco. Adicione uma flag para formato "human-readable".',
        'Tente: `df -h`',
      ],
      feedbackRules: [
        { pattern: /^df$/, message: '`df` sem flags mostra os valores em blocos de 1K — difícil de ler. Adicione `-h` para formato humano: `df -h`.' },
        { pattern: /^du/, message: '`du` mostra o tamanho de diretórios/arquivos. Para ver o espaço das *partições*, use `df -h`.' },
        { pattern: /^free/, message: '`free` mostra a memória RAM, não o disco. Para espaço em disco, use `df -h`.' },
        { pattern: /^ls\s+-l/, message: '`ls -l` mostra arquivos. Para espaço em disco das partições, use `df -h`.' },
      ],
      xp: 50,
    },
    {
      id: 'sysadmin-drill-3',
      prompt: 'Verifique o uso de memória RAM e swap do sistema em formato legível.',
      difficulty: 'medium',
      check: (cmd) => /^free\s+-h$/.test(cmd.trim()),
      expectedOutput: '              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       3.8Gi       1.2Gi       256Mi       2.7Gi       3.4Gi\nSwap:         2.0Gi       512Mi       1.5Gi',
      hints: [
        'O comando para ver memória "livre" é... `free`! Assim como `df`, precisa de uma flag para formato legível.',
        'Use: `free -h`',
      ],
      feedbackRules: [
        { pattern: /^free$/, message: '`free` sem flags mostra valores em kibibytes. Adicione `-h` para ver em GB/MB: `free -h`.' },
        { pattern: /^df/, message: '`df` mostra espaço em *disco*. Para memória RAM, use `free -h`.' },
        { pattern: /^top$/, message: '`top` mostra processos e memória ao vivo. Para um snapshot rápido da memória, `free -h` é mais direto.' },
        { pattern: /^cat\s+\/proc\/meminfo/, message: 'Isso funciona, mas é muito detalhado. O comando `free -h` resume tudo de forma legível.' },
      ],
      xp: 75,
    },
    {
      id: 'sysadmin-drill-4',
      prompt: 'O serviço nginx pode estar com problemas. Verifique o status atual do serviço nginx usando systemctl.',
      difficulty: 'medium',
      check: (cmd) => /^systemctl\s+status\s+nginx$/.test(cmd.trim()),
      expectedOutput: '● nginx.service - A high performance web server\n     Loaded: loaded (/lib/systemd/system/nginx.service; enabled)\n     Active: active (running) since Mon 2024-01-15 09:00:00 UTC; 3h ago\n   Main PID: 1234 (nginx)\n      Tasks: 3\n     Memory: 12.4M',
      hints: [
        'O `systemctl` é a ferramenta para gerenciar serviços no systemd. Qual subcomando mostra o estado atual?',
        'Use: `systemctl status nginx`',
      ],
      feedbackRules: [
        { pattern: /^service\s+nginx\s+status$/, message: '`service` é o formato antigo (SysVinit). No systemd moderno, use `systemctl status nginx`.' },
        { pattern: /^systemctl\s+nginx$/, message: 'Falta o subcomando! Use `systemctl status nginx` para verificar o estado.' },
        { pattern: /^systemctl\s+start\s+nginx$/, message: '`start` *inicia* o serviço. Para apenas *verificar* o estado, use `systemctl status nginx`.' },
        { pattern: /^nginx\s+-t$/, message: '`nginx -t` testa a configuração. Para ver se o serviço está rodando, use `systemctl status nginx`.' },
        { pattern: /^ps\s+aux\s*\|\s*grep\s+nginx/, message: 'Isso mostra se o processo existe, mas `systemctl status nginx` dá muito mais detalhes (estado, PID, memória, logs).' },
      ],
      xp: 75,
    },
    {
      id: 'sysadmin-drill-5',
      prompt: 'O banco de dados PostgreSQL está parado e precisa ser iniciado. Use systemctl para iniciar o serviço postgresql.',
      difficulty: 'hard',
      check: (cmd) => /^systemctl\s+start\s+postgresql$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Você já sabe usar `systemctl status`. Qual subcomando *inicia* um serviço parado?',
        'Use: `systemctl start postgresql`',
      ],
      feedbackRules: [
        { pattern: /^systemctl\s+status\s+postgresql$/, message: '`status` apenas verifica — o serviço continua parado. Use `systemctl start postgresql` para iniciá-lo.' },
        { pattern: /^systemctl\s+restart\s+postgresql$/, message: '`restart` para e reinicia. Como o serviço já está parado, `start` é o mais adequado: `systemctl start postgresql`.' },
        { pattern: /^systemctl\s+enable\s+postgresql$/, message: '`enable` configura para iniciar no boot, mas não inicia agora. Use `systemctl start postgresql`.' },
        { pattern: /^service\s+postgresql\s+start$/, message: 'Formato antigo! No systemd, use `systemctl start postgresql`.' },
        { pattern: /^systemctl\s+start$/, message: 'Falta o nome do serviço! Use `systemctl start postgresql`.' },
        { pattern: /^postgresql\s+start/i, message: 'A sintaxe correta é: `systemctl start postgresql` — o systemctl vem primeiro.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'Servidor em Chamas',
    scenario: 'Alerta vermelho! O servidor de produção está com problemas: o banco de dados caiu, a memória está no limite e um novo desenvolvedor precisa de acesso. Resolva tudo antes que o chefe perceba!',
    steps: [
      {
        id: 'boss-sysadmin-1',
        prompt: '> O painel de monitoramento mostra alertas de memória! Primeiro, verifique o uso de memória RAM do servidor em formato legível para avaliar a gravidade da situação.',
        check: (cmd) => /^free\s+-h$/.test(cmd.trim()),
        expectedOutput: '              total        used        free      shared  buff/cache   available\nMem:          7.7Gi       3.8Gi       1.2Gi       256Mi       2.7Gi       3.4Gi\nSwap:         2.0Gi       512Mi       1.5Gi',
        hints: [
          'Você precisa ver a memória RAM e swap de forma legível. Qual comando mostra memória "livre"?',
          'Use `free -h` para ver a memória em formato humano.',
        ],
        feedbackRules: [
          { pattern: /^df/, message: '`df` mostra espaço em *disco*, não memória. Use `free -h` para ver a RAM.' },
          { pattern: /^top$/, message: '`top` mostra memória, mas `free -h` é mais direto para um diagnóstico rápido.' },
        ],
      },
      {
        id: 'boss-sysadmin-2',
        prompt: '> A memória está apertada mas estável. Agora, o time reportou que o banco de dados PostgreSQL caiu! Verifique o status do serviço postgresql para confirmar.',
        check: (cmd) => /^systemctl\s+status\s+postgresql$/.test(cmd.trim()),
        expectedOutput: '● postgresql.service - PostgreSQL RDBMS\n     Loaded: loaded (/lib/systemd/system/postgresql.service; enabled)\n     Active: inactive (dead)\n   Main PID: none',
        hints: [
          'Use o gerenciador de serviços do systemd para verificar o estado do postgresql.',
          'O comando é: `systemctl status postgresql`.',
        ],
        feedbackRules: [
          { pattern: /^systemctl\s+start\s+postgresql$/, message: 'Calma! Primeiro precisamos *confirmar* o problema. Use `systemctl status postgresql` antes de agir.' },
          { pattern: /^ps\s+aux\s*\|\s*grep\s+postgres/, message: 'Isso funciona, mas `systemctl status postgresql` dá informações mais completas sobre o serviço.' },
        ],
      },
      {
        id: 'boss-sysadmin-3',
        prompt: '> Confirmado: PostgreSQL está "inactive (dead)"! Inicie o serviço imediatamente para restaurar o banco de dados.',
        check: (cmd) => /^systemctl\s+start\s+postgresql$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'O serviço está parado. Qual subcomando do systemctl coloca um serviço para rodar?',
          'Use: `systemctl start postgresql`.',
        ],
        feedbackRules: [
          { pattern: /^systemctl\s+restart\s+postgresql$/, message: '`restart` funciona, mas como o serviço está morto, `start` é mais preciso: `systemctl start postgresql`.' },
          { pattern: /^systemctl\s+status\s+postgresql$/, message: 'Você já verificou o status. Agora *inicie*: `systemctl start postgresql`.' },
          { pattern: /^systemctl\s+enable\s+postgresql$/, message: '`enable` é para o boot. Para iniciar *agora*, use `systemctl start postgresql`.' },
        ],
      },
      {
        id: 'boss-sysadmin-4',
        prompt: '> PostgreSQL restaurado! Último problema: o novo dev "devops" precisa ser adicionado ao grupo "docker" para poder trabalhar com containers. Use usermod para adicioná-lo ao grupo.',
        check: (cmd) => /^(sudo\s+)?usermod\s+-aG\s+docker\s+devops$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'O comando `usermod` modifica usuários. As flags `-aG` significam "append to Group" — adicionar a um grupo sem remover dos grupos atuais.',
          'Use: `usermod -aG docker devops`.',
        ],
        feedbackRules: [
          { pattern: /^useradd/, message: '`useradd` *cria* um novo usuário. O usuário devops já existe — use `usermod` para *modificá-lo*.' },
          { pattern: /^usermod\s+-G\s+docker\s+devops$/, message: 'Cuidado! `-G` sem `-a` *substitui* todos os grupos do usuário. Use `-aG` para *adicionar*: `usermod -aG docker devops`.' },
          { pattern: /^usermod\s+-aG\s+devops\s+docker$/, message: 'A ordem importa: primeiro o grupo, depois o usuário. Use `usermod -aG docker devops`.' },
          { pattern: /^adduser\s+devops\s+docker$/, message: '`adduser` é um wrapper que existe em algumas distros. O comando padrão é `usermod -aG docker devops`.' },
          { pattern: /^gpasswd\s+-a\s+devops\s+docker$/, message: '`gpasswd -a` funciona também! Mas este drill pede `usermod`: `usermod -aG docker devops`.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-server-firefighter',
  },

  achievements: ['sysadmin-hero', 'boss-server-firefighter'],
};
