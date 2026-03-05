import type { Module } from '../../types';

export const sbSshModule: Module = {
  id: 'sb-ssh',
  title: 'SSH & Acesso Remoto',
  description: 'Conecte-se a servidores remotos com seguranca via SSH.',
  tier: 'Adept',
  prerequisites: ['sb-curl'],
  isSideQuest: false,

  briefing: {
    concept:
      `O SSH (Secure Shell) é o protocolo padrão para acessar servidores remotos de forma segura. Toda comunicação é criptografada — senhas, comandos, arquivos. É a ferramenta que todo administrador de sistemas usa diariamente.\n\n` +
      `Comandos e conceitos essenciais:\n` +
      `• **ssh user@host** — Conecta-se a um servidor remoto.\n` +
      `• **ssh-keygen** — Gera um par de chaves (pública + privada) para autenticação sem senha.\n` +
      `• **ssh-copy-id** — Copia sua chave pública para o servidor remoto.\n` +
      `• **scp** — Copia arquivos entre máquinas via SSH.\n` +
      `• **~/.ssh/config** — Arquivo de atalhos para conexões frequentes.\n` +
      `• **-L** — Port forwarding: acesse serviços remotos como se fossem locais.\n` +
      `• **ssh-agent** — Gerencia suas chaves na memória para não digitar a senha toda hora.`,
    analogy:
      'Pense no SSH como um túnel blindado entre seu computador e o servidor. O `ssh-keygen` cria uma fechadura especial (chave pública no servidor) e uma chave única (chave privada no seu PC). Só quem tem a chave certa consegue entrar pelo túnel.',
    syntax:
      'ssh [user@]hostname\nssh-keygen -t ed25519 -C "email"\nssh-copy-id user@host\nscp origem user@host:destino\nssh -L porta_local:host:porta_remota user@host',
    commandBreakdowns: [
      {
        title: 'Gerando chaves SSH',
        command: "ssh-keygen -t ed25519 -C 'enzo@email.com'",
        parts: [
          { text: 'ssh-keygen', label: 'Gera par de chaves (pública + privada) para autenticação' },
          { text: '-t ed25519', label: 'Tipo do algoritmo: Ed25519 (moderno, seguro e rápido; alternativa: rsa)' },
          { text: "-C 'enzo@email.com'", label: 'Comentário anexado à chave (para identificação, não afeta segurança)' },
        ],
      },
      {
        title: 'SSH Port Forwarding (túnel)',
        command: 'ssh -L 8080:localhost:3000 enzo@servidor.com',
        parts: [
          { text: 'ssh', label: 'Cliente SSH — inicia conexão segura' },
          { text: '-L', label: 'Local port forwarding — cria um túnel da máquina local para a remota' },
          { text: '8080', label: 'Porta local que será aberta na sua máquina' },
          { text: 'localhost:3000', label: 'Host:porta no lado remoto (localhost = o próprio servidor)' },
          { text: 'enzo@servidor.com', label: 'Usuário e endereço do servidor remoto' },
        ],
      },
    ],
    examples: [
      { command: 'ssh enzo@servidor.com', output: 'Welcome to Ubuntu 22.04\nenzo@servidor:~$', explanation: 'Conecta ao servidor como o usuário "enzo".' },
      { command: 'ssh-keygen -t ed25519 -C "enzo@email.com"', output: 'Generating public/private ed25519 key pair.\nYour identification has been saved in /home/enzo/.ssh/id_ed25519', explanation: 'Gera um par de chaves Ed25519 — o algoritmo mais moderno e seguro.' },
      { command: 'ssh-copy-id enzo@servidor.com', output: 'Number of key(s) added: 1\nNow try logging into the machine', explanation: 'Copia sua chave pública para o servidor — agora você entra sem senha.' },
      { command: 'scp relatorio.pdf enzo@servidor.com:/home/enzo/docs/', output: 'relatorio.pdf                     100%  1024KB  512.0KB/s   00:02', explanation: 'Copia um arquivo local para o servidor remoto via SSH.' },
      { command: 'ssh -L 8080:localhost:3000 enzo@servidor.com', output: 'Forwarding port 8080 -> servidor.com:3000\nenzo@servidor:~$', explanation: 'Port forwarding: acesse localhost:8080 no seu PC para acessar a porta 3000 do servidor.' },
      { command: 'ssh -i ~/.ssh/chave_especial enzo@servidor.com', output: 'Welcome to Ubuntu 22.04\nenzo@servidor:~$', explanation: 'Usa uma chave privada específica para a conexão.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ssh\s+\w+@[\w.-]+$/, output: 'Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-91-generic x86_64)\n\n  System information as of Mar 04 2026\n\n  System load:  0.08\n  Memory usage: 34%\n  Disk usage:   42%\n\nLast login: Mon Mar  3 14:22:01 2026 from 189.10.20.30\nenzo@servidor:~$' },
      { pattern: /^ssh-keygen\s+-t\s+ed25519/, output: 'Generating public/private ed25519 key pair.\nEnter file in which to save the key (/home/enzo/.ssh/id_ed25519):\nEnter passphrase (empty for no passphrase):\nYour identification has been saved in /home/enzo/.ssh/id_ed25519\nYour public key has been saved in /home/enzo/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:a1b2c3d4e5f6g7h8i9j0 enzo@email.com' },
      { pattern: /^ssh-copy-id\s+/, output: '/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/enzo/.ssh/id_ed25519.pub"\nNumber of key(s) added: 1\n\nNow try logging into the machine, with: "ssh enzo@servidor.com"' },
      { pattern: /^scp\s+.+\s+\w+@[\w.-]+:/, output: 'relatorio.pdf                     100%  1024KB  512.0KB/s   00:02' },
      { pattern: /^scp\s+\w+@[\w.-]+:.+\s+/, output: 'dados.csv                         100%   256KB  256.0KB/s   00:01' },
      { pattern: /^ssh\s+-L\s+/, output: 'Binding to port 8080...\nForwarding localhost:8080 -> servidor.com:3000\nenzo@servidor:~$' },
      { pattern: /^ssh-agent/, output: 'Agent pid 12345' },
      { pattern: /^ssh-add/, output: 'Identity added: /home/enzo/.ssh/id_ed25519 (enzo@email.com)' },
      { pattern: /^cat\s+.*\.ssh\/config/, output: 'Host servidor\n  HostName servidor.com\n  User enzo\n  IdentityFile ~/.ssh/id_ed25519' },
      { pattern: /^ssh\s+/, output: 'Welcome to Ubuntu 22.04\nenzo@servidor:~$' },
    ],
    contextHints: [
      'Tente `ssh enzo@servidor.com` para conectar a um servidor remoto.',
      'Use `ssh-keygen -t ed25519` para gerar um par de chaves moderno.',
      'Copie sua chave para o servidor com `ssh-copy-id enzo@servidor.com`.',
      'Transfira arquivos com `scp arquivo.txt enzo@servidor.com:/home/enzo/`.',
      'Experimente port forwarding com `ssh -L 8080:localhost:3000 enzo@servidor.com`.',
    ],
  },

  drills: [
    {
      id: 'ssh-drill-1',
      prompt: 'Conecte-se ao servidor `prod.empresa.com` como o usuário `deploy`.',
      difficulty: 'easy',
      check: (cmd) => /^ssh\s+deploy@prod\.empresa\.com$/.test(cmd.trim()),
      expectedOutput: 'Welcome to Ubuntu 22.04.3 LTS\ndeploy@prod:~$',
      hints: [
        'O formato básico do SSH é: `ssh usuario@servidor`.',
        'O comando completo é: `ssh deploy@prod.empresa.com`.',
      ],
      feedbackRules: [
        { pattern: /^ssh\s+prod\.empresa\.com$/, message: 'Você precisa especificar o usuário! Use o formato `ssh user@host`.' },
        { pattern: /^telnet/i, message: '`telnet` não é seguro! Use `ssh` para conexões criptografadas.' },
      ],
      xp: 70,
    },
    {
      id: 'ssh-drill-2',
      prompt: 'Gere um par de chaves SSH usando o algoritmo Ed25519, com o comentário "deploy@empresa.com".',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^ssh-keygen\s+/.test(trimmed) &&
          /-t\s+ed25519/.test(trimmed) &&
          /-C\s+["']deploy@empresa\.com["']/.test(trimmed);
      },
      expectedOutput: 'Generating public/private ed25519 key pair.\nYour identification has been saved in /home/enzo/.ssh/id_ed25519\nYour public key has been saved in /home/enzo/.ssh/id_ed25519.pub',
      hints: [
        'Use `ssh-keygen` com `-t` para o tipo e `-C` para o comentário.',
        'O comando é: `ssh-keygen -t ed25519 -C "deploy@empresa.com"`.',
      ],
      feedbackRules: [
        { pattern: /-t\s+rsa/, message: 'RSA funciona, mas Ed25519 é mais moderno, rápido e seguro. Use `-t ed25519`.' },
        { pattern: /ssh-keygen$/, message: 'Isso gera uma chave RSA padrão. Especifique `-t ed25519` e `-C` para o comentário.' },
      ],
      xp: 70,
    },
    {
      id: 'ssh-drill-3',
      prompt: 'Copie o arquivo `backup.tar.gz` do diretório atual para o servidor `srv.empresa.com` no caminho `/opt/backups/`, usando o usuário `admin`.',
      difficulty: 'medium',
      check: (cmd) => /^scp\s+backup\.tar\.gz\s+admin@srv\.empresa\.com:\/opt\/backups\/$/.test(cmd.trim()),
      expectedOutput: 'backup.tar.gz                     100%  50MB  25.0MB/s   00:02',
      hints: [
        'O `scp` funciona como `cp`, mas entre máquinas: `scp origem user@host:destino`.',
        'O comando é: `scp backup.tar.gz admin@srv.empresa.com:/opt/backups/`.',
      ],
      feedbackRules: [
        { pattern: /^cp\s+/, message: '`cp` é para cópias locais. Para copiar entre servidores, use `scp`.' },
        { pattern: /scp.*srv\.empresa\.com(?!:)/, message: 'Faltou os dois pontos (`:`) entre o host e o caminho remoto!' },
      ],
      xp: 70,
    },
    {
      id: 'ssh-drill-4',
      prompt: 'Crie um atalho no arquivo SSH config: use `ssh meuservidor` para conectar como `enzo` em `app.exemplo.com` usando a chave `~/.ssh/id_ed25519`. Mostre o conteúdo que iria no arquivo `~/.ssh/config`.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        const hasHost = /Host\s+meuservidor/.test(trimmed);
        const hasHostName = /HostName\s+app\.exemplo\.com/.test(trimmed);
        const hasUser = /User\s+enzo/.test(trimmed);
        const hasKey = /IdentityFile\s+~\/\.ssh\/id_ed25519/.test(trimmed);
        return hasHost && hasHostName && hasUser && hasKey;
      },
      expectedOutput: 'Host meuservidor\n  HostName app.exemplo.com\n  User enzo\n  IdentityFile ~/.ssh/id_ed25519',
      hints: [
        'O arquivo `~/.ssh/config` usa blocos `Host` com propriedades indentadas: HostName, User, IdentityFile.',
        'Formato:\nHost meuservidor\n  HostName app.exemplo.com\n  User enzo\n  IdentityFile ~/.ssh/id_ed25519',
      ],
      feedbackRules: [
        { pattern: /^ssh\s+/, message: 'Não precisa do comando `ssh`. Mostre apenas o conteúdo do bloco de configuração que iria no `~/.ssh/config`.' },
        { pattern: /hostname/i, message: 'Atenção à capitalização: `HostName` (com N maiúsculo) é o formato correto no SSH config.' },
      ],
      xp: 70,
    },
    {
      id: 'ssh-drill-5',
      prompt: 'Configure um túnel SSH (port forwarding): redirecione a porta local `5432` para `localhost:5432` no servidor `db.empresa.com`, conectando como `dba`.',
      difficulty: 'hard',
      check: (cmd) => /^ssh\s+-L\s+5432:localhost:5432\s+dba@db\.empresa\.com$/.test(cmd.trim()),
      expectedOutput: 'Binding to port 5432...\nForwarding localhost:5432 -> db.empresa.com:5432\ndba@db:~$',
      hints: [
        'Port forwarding usa a flag `-L` com o formato: `porta_local:host_destino:porta_destino`.',
        'O comando completo: `ssh -L 5432:localhost:5432 dba@db.empresa.com`.',
      ],
      feedbackRules: [
        { pattern: /-R\s+/, message: '`-R` é port forwarding reverso (do servidor para o local). Use `-L` para forwarding local.' },
        { pattern: /-L\s+\d+:\d+/, message: 'O formato da flag `-L` precisa de 3 partes separadas por `:` — porta_local:host:porta_remota.' },
      ],
      xp: 70,
    },
  ],

  boss: {
    title: 'O Tuneleiro',
    scenario: 'O servidor de produção da empresa precisa de manutenção urgente. Você deve configurar acesso seguro, transferir arquivos de backup e criar um túnel para acessar o banco de dados — tudo via SSH.',
    steps: [
      {
        id: 'boss-ssh-1',
        prompt: '> Primeiro, gere um novo par de chaves Ed25519 com o comentário "ops@empresa.com" para autenticação segura.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^ssh-keygen\s+/.test(trimmed) &&
            /-t\s+ed25519/.test(trimmed) &&
            /-C\s+["']ops@empresa\.com["']/.test(trimmed);
        },
        expectedOutput: 'Generating public/private ed25519 key pair.\nYour identification has been saved in /home/enzo/.ssh/id_ed25519\nYour public key has been saved in /home/enzo/.ssh/id_ed25519.pub\nThe key fingerprint is:\nSHA256:xYz123AbC ops@empresa.com',
        hints: [
          'Use `ssh-keygen` com `-t ed25519` para o algoritmo e `-C` para o comentário.',
          'ssh-keygen -t ed25519 -C "ops@empresa.com"',
        ],
        feedbackRules: [
          { pattern: /-t\s+rsa/, message: 'Ed25519 é o padrão moderno. Use `-t ed25519` em vez de RSA.' },
        ],
      },
      {
        id: 'boss-ssh-2',
        prompt: '> Chave criada! Agora copie-a para o servidor `prod.empresa.com` usando o usuário `ops`.',
        check: (cmd) => /^ssh-copy-id\s+ops@prod\.empresa\.com$/.test(cmd.trim()),
        expectedOutput: '/usr/bin/ssh-copy-id: INFO: Source of key(s) to be installed: "/home/enzo/.ssh/id_ed25519.pub"\nNumber of key(s) added: 1\n\nNow try logging into the machine, with: "ssh ops@prod.empresa.com"',
        hints: [
          'O comando que copia a chave pública para o servidor é `ssh-copy-id`.',
          'ssh-copy-id ops@prod.empresa.com',
        ],
        feedbackRules: [
          { pattern: /^scp.*\.pub/, message: 'Tecnicamente funciona copiar a chave manualmente, mas `ssh-copy-id` faz isso automaticamente e com segurança.' },
        ],
      },
      {
        id: 'boss-ssh-3',
        prompt: '> Acesso configurado! Agora transfira o arquivo `db_backup.sql.gz` para o servidor em `/opt/backups/`, usando o usuário `ops`.',
        check: (cmd) => /^scp\s+db_backup\.sql\.gz\s+ops@prod\.empresa\.com:\/opt\/backups\/$/.test(cmd.trim()),
        expectedOutput: 'db_backup.sql.gz                  100%  150MB  75.0MB/s   00:02',
        hints: [
          'Use `scp` para copiar arquivos via SSH: `scp arquivo user@host:caminho`.',
          'scp db_backup.sql.gz ops@prod.empresa.com:/opt/backups/',
        ],
        feedbackRules: [
          { pattern: /^rsync/, message: '`rsync` é ótimo para sincronização, mas aqui `scp` é mais direto para uma cópia simples.' },
        ],
      },
      {
        id: 'boss-ssh-4',
        prompt: '> Backup transferido! Por último, crie um túnel SSH para acessar o PostgreSQL (porta 5432) do servidor `prod.empresa.com` pela sua porta local 15432, como `ops`.',
        check: (cmd) => /^ssh\s+-L\s+15432:localhost:5432\s+ops@prod\.empresa\.com$/.test(cmd.trim()),
        expectedOutput: 'Binding to port 15432...\nForwarding localhost:15432 -> prod.empresa.com:5432\nops@prod:~$\n\nAgora você pode conectar ao banco com: psql -h localhost -p 15432',
        hints: [
          'Use `-L porta_local:localhost:porta_remota` para criar o túnel.',
          'ssh -L 15432:localhost:5432 ops@prod.empresa.com',
        ],
        feedbackRules: [
          { pattern: /-L\s+5432/, message: 'A porta local deve ser 15432 (para não conflitar com um PostgreSQL local). Verifique o formato.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-tunneler',
  },

  achievements: ['remote-access', 'boss-tunneler'],
};
