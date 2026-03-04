import type { Module } from '../../types';

export const sbPackagesModule: Module = {
  id: 'sb-packages',
  title: 'Gerenciamento de Pacotes',
  description: 'Instale, remova e gerencie software no Linux.',
  tier: 'GrandMaster',
  prerequisites: ['sb-permissions'],
  isSideQuest: false,

  briefing: {
    concept:
      `O gerenciamento de pacotes e o coracao do ecossistema Linux. Cada software que voce instala, atualiza ou remove passa por um gerenciador de pacotes — uma ferramenta que resolve dependencias, verifica integridade e mantem tudo organizado.\n\n` +
      `No Debian/Ubuntu, o sistema principal e o **APT** (Advanced Package Tool), que trabalha em conjunto com o **dpkg** (o instalador de baixo nivel). Juntos, eles formam uma dupla poderosa:\n\n` +
      `• **apt update** — Atualiza a lista de pacotes disponiveis nos repositorios.\n` +
      `• **apt install** — Instala um pacote (e suas dependencias automaticamente).\n` +
      `• **apt remove** — Remove um pacote do sistema.\n` +
      `• **apt search** — Procura pacotes pelo nome ou descricao.\n` +
      `• **apt list --installed** — Lista todos os pacotes instalados.\n` +
      `• **dpkg -l** — Lista pacotes com detalhes de baixo nivel.\n` +
      `• **dpkg -i** — Instala um pacote .deb diretamente.\n` +
      `• **apt-cache show** — Mostra informacoes detalhadas de um pacote.\n` +
      `• **apt autoremove** — Remove dependencias orfas que nao sao mais necessarias.\n` +
      `• **/etc/apt/sources.list** — Arquivo de configuracao dos repositorios.`,
    analogy:
      'Pense no APT como um supermercado inteligente. `apt update` atualiza o catalogo de produtos. `apt install` coloca o produto no carrinho e cuida de trazer todos os ingredientes necessarios. `apt remove` devolve o produto. `apt autoremove` limpa a dispensa de coisas que ninguem mais usa.',
    syntax:
      'sudo apt update\nsudo apt install <pacote>\nsudo apt remove <pacote>\napt search <termo>\napt list --installed\ndpkg -l [padrao]\ndpkg -i <arquivo.deb>\napt-cache show <pacote>\nsudo apt autoremove',
    examples: [
      { command: 'sudo apt update', output: 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nFetched 1,234 kB in 2s\nReading package lists... Done', explanation: 'Atualiza o indice de pacotes dos repositorios configurados.' },
      { command: 'sudo apt install htop', output: 'Reading package lists... Done\nThe following NEW packages will be installed:\n  htop\n0 upgraded, 1 newly installed, 0 to remove.\nSetting up htop (3.2.1-1) ...', explanation: 'Instala o pacote htop e todas as suas dependencias.' },
      { command: 'apt search nginx', output: 'Sorting... Done\nnginx/jammy 1.18.0-6ubuntu14 amd64\n  small, powerful, scalable web/proxy server', explanation: 'Busca pacotes que contenham "nginx" no nome ou descricao.' },
      { command: 'sudo apt remove htop', output: 'Removing htop (3.2.1-1) ...', explanation: 'Remove o pacote htop do sistema (mantem arquivos de configuracao).' },
      { command: 'dpkg -l | head -5', output: 'Desired=Unknown/Install/Remove\n| Status=Not/Inst/Conf-files\n||/ Name           Version      Architecture Description\n+++-==============-============-============-===================\nii  adduser        3.118ubuntu5 all          add and remove users', explanation: 'Lista pacotes instalados com status detalhado via dpkg.' },
      { command: 'apt-cache show curl', output: 'Package: curl\nVersion: 7.81.0-1ubuntu1\nDepends: libc6, libcurl4, zlib1g\nDescription: command line tool for transferring data', explanation: 'Exibe metadados completos de um pacote — versao, dependencias, descricao.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^sudo\s+apt\s+update$/, output: 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nHit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease\nFetched 1,234 kB in 2s (617 kB/s)\nReading package lists... Done\nBuilding dependency tree... Done\n12 packages can be upgraded. Run \'apt list --upgradable\' to see them.' },
      { pattern: /^sudo\s+apt\s+install\s+\w+/, output: 'Reading package lists... Done\nBuilding dependency tree... Done\nThe following NEW packages will be installed:\n  <pacote>\n0 upgraded, 1 newly installed, 0 to remove, 0 not upgraded.\nSetting up <pacote> ... Done.' },
      { pattern: /^sudo\s+apt\s+remove\s+\w+/, output: 'Reading package lists... Done\nThe following packages will be REMOVED:\n  <pacote>\n0 upgraded, 0 newly installed, 1 to remove, 0 not upgraded.\nRemoving <pacote> ... Done.' },
      { pattern: /^apt\s+search\s+\w+/, output: 'Sorting... Done\nFull Text Search... Done\nnginx/jammy 1.18.0-6ubuntu14 amd64\n  small, powerful, scalable web/proxy server\nnginx-common/jammy 1.18.0-6ubuntu14 all\n  small, powerful, scalable web/proxy server - common files' },
      { pattern: /^apt\s+list\s+--installed/, output: 'Listing... Done\nadduser/jammy,now 3.118ubuntu5 all [installed]\napt/jammy,now 2.4.8 amd64 [installed]\nbash/jammy,now 5.1-6ubuntu1 amd64 [installed]\ncoreutils/jammy,now 8.32-4.1ubuntu1 amd64 [installed]\ncurl/jammy,now 7.81.0-1ubuntu1 amd64 [installed]\ngit/jammy,now 1:2.34.1-1ubuntu1 amd64 [installed]\nhtop/jammy,now 3.2.1-1 amd64 [installed]\nvim/jammy,now 2:8.2.3995-1ubuntu2 amd64 [installed]' },
      { pattern: /^dpkg\s+-l/, output: 'Desired=Unknown/Install/Remove/Purge/Hold\n| Status=Not/Inst/Conf-files/Unpacked/halF-conf/Half-inst/trig-aWait/Trig-pend\n||/ Name           Version         Architecture Description\n+++-==============-===============-============-=================================\nii  adduser        3.118ubuntu5    all          add and remove users and groups\nii  apt            2.4.8           amd64        commandline package manager\nii  bash           5.1-6ubuntu1    amd64        GNU Bourne Again SHell\nii  curl           7.81.0-1ubuntu1 amd64        command line tool for transferring data' },
      { pattern: /^apt-cache\s+show\s+\w+/, output: 'Package: curl\nVersion: 7.81.0-1ubuntu1\nPriority: optional\nSection: web\nMaintainer: Ubuntu Developers\nDepends: libc6 (>= 2.34), libcurl4 (= 7.81.0-1ubuntu1), zlib1g (>= 1:1.1.4)\nDescription-en: command line tool for transferring data with URL syntax\n curl is a command line tool for transferring data with URL syntax.' },
      { pattern: /^sudo\s+apt\s+autoremove$/, output: 'Reading package lists... Done\nBuilding dependency tree... Done\nThe following packages will be REMOVED:\n  libfoo1 libbar2\n0 upgraded, 0 newly installed, 2 to remove, 0 not upgraded.\nRemoving libfoo1 ... Done.\nRemoving libbar2 ... Done.' },
      { pattern: /^cat\s+\/etc\/apt\/sources\.list/, output: 'deb http://archive.ubuntu.com/ubuntu jammy main restricted\ndeb http://archive.ubuntu.com/ubuntu jammy-updates main restricted\ndeb http://security.ubuntu.com/ubuntu jammy-security main restricted\n# deb http://archive.ubuntu.com/ubuntu jammy universe' },
      { pattern: /^dpkg\s+-i\s+\S+/, output: 'Selecting previously unselected package.\n(Reading database ... 120000 files and directories currently installed.)\nPreparing to unpack <arquivo.deb> ...\nUnpacking <pacote> ...\nSetting up <pacote> ...' },
    ],
    contextHints: [
      'Comece com `sudo apt update` para atualizar a lista de pacotes.',
      'Use `apt search <termo>` para procurar pacotes disponiveis.',
      'Tente `apt list --installed` para ver o que ja esta instalado.',
      'Use `apt-cache show <pacote>` para ver detalhes de um pacote.',
      'Experimente `dpkg -l` para listar pacotes com informacoes de baixo nivel.',
    ],
  },

  drills: [
    {
      id: 'packages-drill-1',
      prompt: 'Atualize a lista de pacotes disponiveis nos repositorios.',
      difficulty: 'easy',
      check: (cmd) => /^sudo\s+apt\s+update$/.test(cmd.trim()),
      expectedOutput: 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nFetched 1,234 kB in 2s\nReading package lists... Done',
      hints: ['O comando usa `apt` com uma acao que significa "atualizar".', 'Voce precisa de privilegios de root. Use `sudo apt update`.'],
      feedbackRules: [
        { pattern: /^apt\s+update$/, message: 'Quase! Atualizar pacotes requer privilegios de administrador. Adicione `sudo` no inicio.' },
        { pattern: /^sudo\s+apt\s+upgrade$/, message: '`upgrade` atualiza os pacotes instalados. Para atualizar a *lista* de pacotes, use `update`.' },
        { pattern: /^sudo\s+apt-get\s+update$/, message: 'Funciona, mas preferimos o `apt` moderno em vez de `apt-get`. Use `sudo apt update`.' },
      ],
      xp: 100,
    },
    {
      id: 'packages-drill-2',
      prompt: 'Instale o pacote `nginx` no sistema.',
      difficulty: 'easy',
      check: (cmd) => /^sudo\s+apt\s+install\s+nginx$/.test(cmd.trim()),
      expectedOutput: 'Reading package lists... Done\nThe following NEW packages will be installed:\n  nginx\nSetting up nginx ... Done.',
      hints: ['Para instalar software, use `apt install` seguido do nome do pacote.', 'Lembre-se: instalar pacotes exige `sudo`.'],
      feedbackRules: [
        { pattern: /^apt\s+install\s+nginx$/, message: 'Instalar pacotes requer privilegios de root. Adicione `sudo` no inicio.' },
        { pattern: /^sudo\s+apt\s+install$/, message: 'Voce esqueceu de especificar o pacote! Adicione `nginx` no final.' },
      ],
      xp: 100,
    },
    {
      id: 'packages-drill-3',
      prompt: 'Pesquise nos repositorios por pacotes relacionados a "docker".',
      difficulty: 'medium',
      check: (cmd) => /^apt\s+search\s+docker$/.test(cmd.trim()),
      expectedOutput: 'Sorting... Done\ndocker.io/jammy 20.10.12-0ubuntu4 amd64\n  Linux container runtime\ndocker-compose/jammy 1.29.2-1 all\n  multi-container orchestration',
      hints: ['O subcomando `search` do apt nao precisa de `sudo`.', 'Use `apt search` seguido do termo de busca.'],
      feedbackRules: [
        { pattern: /^sudo\s+apt\s+search\s+docker$/, message: '`apt search` nao precisa de `sudo` — e uma operacao de leitura. Remova o `sudo`.' },
        { pattern: /^apt-cache\s+search\s+docker$/, message: 'Funciona, mas o `apt search` moderno e mais legivel. Tente `apt search docker`.' },
      ],
      xp: 100,
    },
    {
      id: 'packages-drill-4',
      prompt: 'Remova o pacote `nginx` do sistema.',
      difficulty: 'medium',
      check: (cmd) => /^sudo\s+apt\s+remove\s+nginx$/.test(cmd.trim()),
      expectedOutput: 'Reading package lists... Done\nThe following packages will be REMOVED:\n  nginx\nRemoving nginx ... Done.',
      hints: ['O subcomando para remover e intuitivo — pense no ingles.', 'Use `sudo apt remove nginx`.'],
      feedbackRules: [
        { pattern: /^apt\s+remove\s+nginx$/, message: 'Remover pacotes exige privilegios de root. Adicione `sudo`.' },
        { pattern: /^sudo\s+apt\s+purge\s+nginx$/, message: '`purge` tambem remove arquivos de configuracao. Para este exercicio, use `remove` em vez de `purge`.' },
        { pattern: /^sudo\s+apt\s+uninstall/, message: 'O APT usa `remove` em vez de `uninstall`. Tente `sudo apt remove nginx`.' },
      ],
      xp: 100,
    },
    {
      id: 'packages-drill-5',
      prompt: 'Liste todos os pacotes atualmente instalados no sistema.',
      difficulty: 'medium',
      check: (cmd) => /^apt\s+list\s+--installed$/.test(cmd.trim()),
      expectedOutput: 'Listing... Done\nadduser/jammy,now 3.118ubuntu5 all [installed]\napt/jammy,now 2.4.8 amd64 [installed]\nbash/jammy,now 5.1-6ubuntu1 amd64 [installed]',
      hints: ['O `apt list` aceita uma flag para filtrar apenas pacotes instalados.', 'Use `apt list --installed` — dois tracos antes de "installed".'],
      feedbackRules: [
        { pattern: /^dpkg\s+-l$/, message: '`dpkg -l` tambem lista pacotes, mas para este exercicio use a forma moderna: `apt list --installed`.' },
        { pattern: /^apt\s+list$/, message: 'Isso lista *todos* os pacotes disponiveis. Adicione `--installed` para filtrar apenas os instalados.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'O Curador de Pacotes',
    scenario: 'Um servidor de producao esta com problemas! Pacotes estao desatualizados, ha dependencias orfas consumindo espaco e um servico critico precisa ser instalado. Voce precisa colocar tudo em ordem antes que o sistema fique instavel.',
    steps: [
      {
        id: 'boss-packages-1',
        prompt: '> O servidor nao atualiza seus repositorios ha meses. Comece sincronizando a lista de pacotes com os repositorios.',
        check: (cmd) => /^sudo\s+apt\s+update$/.test(cmd.trim()),
        expectedOutput: 'Hit:1 http://archive.ubuntu.com/ubuntu jammy InRelease\nHit:2 http://security.ubuntu.com/ubuntu jammy-security InRelease\nFetched 3,456 kB in 4s\nReading package lists... Done\n47 packages can be upgraded.',
        hints: ['Primeiro passo de qualquer manutencao: atualizar o indice de pacotes.', 'Use `sudo apt update` para sincronizar com os repositorios.'],
        feedbackRules: [
          { pattern: /^sudo\s+apt\s+upgrade/, message: 'Antes de fazer upgrade, voce precisa atualizar a lista de pacotes com `sudo apt update`.' },
        ],
      },
      {
        id: 'boss-packages-2',
        prompt: '> Otimo. Agora, o time de DevOps precisa urgentemente que o `fail2ban` esteja instalado para proteger o servidor. Instale-o.',
        check: (cmd) => /^sudo\s+apt\s+install\s+fail2ban$/.test(cmd.trim()),
        expectedOutput: 'Reading package lists... Done\nThe following NEW packages will be installed:\n  fail2ban python3-pyinotify whois\n0 upgraded, 3 newly installed, 0 to remove.\nSetting up fail2ban (0.11.2-6) ...',
        hints: ['Use o comando de instalacao de pacotes do APT.', 'Nao esqueca o `sudo` — instalar pacotes exige privilegios de root.'],
        feedbackRules: [
          { pattern: /^apt\s+install/, message: 'Instalar pacotes requer `sudo`. Tente `sudo apt install fail2ban`.' },
        ],
      },
      {
        id: 'boss-packages-3',
        prompt: '> Boa! Agora, antes de verificar dependencias orfas, confira as informacoes do pacote `fail2ban` para garantir que a versao correta foi instalada.',
        check: (cmd) => /^apt-cache\s+show\s+fail2ban$/.test(cmd.trim()),
        expectedOutput: 'Package: fail2ban\nVersion: 0.11.2-6\nPriority: optional\nSection: net\nDepends: python3, python3-pyinotify\nDescription-en: ban hosts that cause multiple authentication errors\n Fail2Ban scans log files and bans IPs with too many password failures.',
        hints: ['Existe um subcomando do apt-cache que exibe todas as informacoes de um pacote.', 'Use `apt-cache show fail2ban` para ver os metadados completos.'],
        feedbackRules: [
          { pattern: /^apt\s+show/, message: 'Use `apt-cache show` em vez de `apt show` para este exercicio.' },
          { pattern: /^dpkg\s+-l\s+fail2ban/, message: '`dpkg -l` mostra o status, mas queremos os metadados completos. Use `apt-cache show fail2ban`.' },
        ],
      },
      {
        id: 'boss-packages-4',
        prompt: '> Perfeito. Por ultimo, limpe o sistema removendo dependencias orfas que nao sao mais necessarias.',
        check: (cmd) => /^sudo\s+apt\s+autoremove$/.test(cmd.trim()),
        expectedOutput: 'Reading package lists... Done\nThe following packages will be REMOVED:\n  libunused1 liborphan2 old-dependency3\n0 upgraded, 0 newly installed, 3 to remove.\nRemoving libunused1 ... Done.\nRemoving liborphan2 ... Done.\nRemoving old-dependency3 ... Done.',
        hints: ['Existe um subcomando do apt que remove automaticamente pacotes que nao sao mais necessarios.', 'Use `sudo apt autoremove` para limpar dependencias orfas.'],
        feedbackRules: [
          { pattern: /^apt\s+autoremove$/, message: 'Remover pacotes exige `sudo`. Use `sudo apt autoremove`.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-curador-pacotes',
  },

  achievements: ['package-manager', 'boss-curador-pacotes'],
};
