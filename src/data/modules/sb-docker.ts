import type { Module } from '../../types';

export const sbDockerModule: Module = {
  id: 'sb-docker',
  title: 'Docker',
  description: 'Crie e gerencie containers para isolar aplicacoes.',
  tier: 'GrandMaster',
  prerequisites: ['sb-networking'],
  isSideQuest: false,

  briefing: {
    concept:
      `Docker e a ferramenta que revolucionou a forma como empacotamos e executamos aplicacoes. Em vez de instalar dependencias diretamente no sistema, voce cria **containers** — ambientes isolados e reproduziveis que rodam em qualquer lugar.\n\n` +
      `Os conceitos fundamentais do Docker sao:\n\n` +
      `• **Imagem** — Um pacote imutavel com tudo que a aplicacao precisa (codigo, bibliotecas, configuracoes). E como uma "foto" do ambiente.\n` +
      `• **Container** — Uma instancia em execucao de uma imagem. E como um processo isolado com seu proprio filesystem.\n` +
      `• **Dockerfile** — A receita que define como construir uma imagem.\n` +
      `• **docker-compose** — Ferramenta para orquestrar multiplos containers que trabalham juntos.\n\n` +
      `Os comandos essenciais cobrem o ciclo de vida completo: criar, executar, inspecionar, parar e remover containers e imagens.`,
    analogy:
      'Pense em imagens Docker como receitas de bolo e containers como os bolos prontos. A receita (imagem) pode gerar quantos bolos (containers) voce quiser, todos identicos. O Dockerfile e o caderno de receitas, e o docker-compose e o planejamento de um banquete com varios pratos.',
    syntax:
      'docker run [opcoes] imagem [comando]    # Cria e inicia um container\ndocker ps                                # Lista containers em execucao\ndocker images                            # Lista imagens locais\ndocker exec -it container comando        # Executa comando em container ativo\ndocker logs container                    # Ve logs de um container\ndocker stop container                    # Para um container\ndocker rm container                      # Remove um container\ndocker build -t nome .                   # Constroi imagem a partir do Dockerfile\ndocker-compose up -d                     # Sobe servicos definidos no compose',
    commandBreakdowns: [
      {
        title: 'Anatomia do docker run',
        command: 'docker run -d --name web -p 8080:80 -v ./html:/usr/share/nginx/html nginx:latest',
        parts: [
          { text: 'docker run', label: 'Cria e inicia um novo container' },
          { text: '-d', label: 'Detached mode — roda em segundo plano (sem travar o terminal)' },
          { text: '--name web', label: 'Nomeia o container como "web" (sem isso, recebe nome aleatório)' },
          { text: '-p 8080:80', label: 'Mapeia porta: host:container (acesso via localhost:8080 → porta 80 dentro do container)' },
          { text: '-v ./html:/usr/share/nginx/html', label: 'Volume/bind mount: monta diretório local dentro do container' },
          { text: 'nginx:latest', label: 'A imagem a usar (nome:tag). "latest" é a tag padrão' },
        ],
      },
      {
        title: 'Acessando um container em execução',
        command: 'docker exec -it web bash',
        parts: [
          { text: 'docker exec', label: 'Executa um comando dentro de um container já rodando' },
          { text: '-i', label: 'Interactive — mantém stdin aberto (permite digitar)' },
          { text: '-t', label: 'TTY — aloca um pseudo-terminal (formata a saída corretamente)' },
          { text: 'web', label: 'Nome ou ID do container alvo' },
          { text: 'bash', label: 'O comando a executar (abre um shell interativo dentro do container)' },
        ],
      },
    ],
    examples: [
      { command: 'docker run -d --name web -p 8080:80 nginx', output: 'a1b2c3d4e5f6...', explanation: 'Inicia um container nginx em background (-d), com nome "web", mapeando a porta 8080 do host para a 80 do container.' },
      { command: 'docker ps', output: 'CONTAINER ID  IMAGE  COMMAND                 STATUS       PORTS                  NAMES\na1b2c3d4e5f6  nginx  "/docker-entrypoint..."  Up 2 min     0.0.0.0:8080->80/tcp   web', explanation: 'Lista todos os containers em execucao com seus detalhes.' },
      { command: 'docker exec -it web bash', output: 'root@a1b2c3d4e5f6:/#', explanation: 'Abre um shell interativo dentro do container "web". O `-it` combina interativo + terminal.' },
      { command: 'docker logs web', output: '172.17.0.1 - - [04/Mar/2024:17:45:00 +0000] "GET / HTTP/1.1" 200 615', explanation: 'Mostra os logs de saida do container "web".' },
      { command: 'docker build -t myapp:latest .', output: 'Step 1/5 : FROM node:18-alpine\nStep 2/5 : WORKDIR /app\n...\nSuccessfully tagged myapp:latest', explanation: 'Constroi uma imagem chamada "myapp" a partir do Dockerfile no diretorio atual.' },
      { command: 'docker-compose up -d', output: 'Creating network "project_default"\nCreating project_db_1    ... done\nCreating project_redis_1 ... done\nCreating project_web_1   ... done', explanation: 'Inicia todos os servicos definidos no docker-compose.yml em background.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^docker\s+run\s+.*nginx/, output: 'Unable to find image \'nginx:latest\' locally\nlatest: Pulling from library/nginx\nDigest: sha256:abc123...\nStatus: Downloaded newer image for nginx:latest\na1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef12345678' },
      { pattern: /^docker\s+ps$/, output: 'CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                  NAMES\na1b2c3d4e5f6   nginx     "/docker-entrypoint.."   5 minutes ago    Up 5 minutes    0.0.0.0:8080->80/tcp   web\nb2c3d4e5f6a7   redis     "docker-entrypoint.s.."  10 minutes ago   Up 10 minutes   0.0.0.0:6379->6379/tcp redis-cache\nc3d4e5f6a7b8   postgres  "docker-entrypoint.s.."  15 minutes ago   Up 15 minutes   0.0.0.0:5432->5432/tcp db' },
      { pattern: /^docker\s+ps\s+-a/, output: 'CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS                     PORTS                  NAMES\na1b2c3d4e5f6   nginx     "/docker-entrypoint.."   5 minutes ago    Up 5 minutes               0.0.0.0:8080->80/tcp   web\nb2c3d4e5f6a7   redis     "docker-entrypoint.s.."  10 minutes ago   Up 10 minutes              0.0.0.0:6379->6379/tcp redis-cache\nc3d4e5f6a7b8   postgres  "docker-entrypoint.s.."  15 minutes ago   Up 15 minutes              0.0.0.0:5432->5432/tcp db\nd4e5f6a7b8c9   node      "node index.js"          1 hour ago       Exited (0) 30 minutes ago                          old-app' },
      { pattern: /^docker\s+images/, output: 'REPOSITORY   TAG       IMAGE ID       CREATED        SIZE\nnginx        latest    a1b2c3d4e5f6   2 weeks ago    187MB\nredis        latest    b2c3d4e5f6a7   3 weeks ago    138MB\npostgres     15        c3d4e5f6a7b8   1 month ago    412MB\nnode         18        d4e5f6a7b8c9   2 weeks ago    995MB\nmyapp        latest    e5f6a7b8c9d0   1 hour ago     245MB' },
      { pattern: /^docker\s+exec\s+.*bash/, output: 'root@a1b2c3d4e5f6:/#' },
      { pattern: /^docker\s+exec\s+.*sh/, output: 'root@a1b2c3d4e5f6:/#' },
      { pattern: /^docker\s+logs\s+/, output: '172.17.0.1 - - [04/Mar/2024:17:45:00 +0000] "GET / HTTP/1.1" 200 615\n172.17.0.1 - - [04/Mar/2024:17:45:01 +0000] "GET /favicon.ico HTTP/1.1" 404 153\n172.17.0.1 - - [04/Mar/2024:17:46:00 +0000] "GET /api/health HTTP/1.1" 200 2' },
      { pattern: /^docker\s+stop\s+/, output: '' },
      { pattern: /^docker\s+rm\s+/, output: '' },
      { pattern: /^docker\s+build/, output: 'Step 1/5 : FROM node:18-alpine\n ---> d4e5f6a7b8c9\nStep 2/5 : WORKDIR /app\n ---> Running in f6a7b8c9d0e1\nStep 3/5 : COPY package*.json ./\nStep 4/5 : RUN npm install\nStep 5/5 : COPY . .\nSuccessfully built f7a8b9c0d1e2\nSuccessfully tagged myapp:latest' },
      { pattern: /^docker-compose\s+up/, output: 'Creating network "project_default" with the default driver\nCreating project_db_1    ... done\nCreating project_redis_1 ... done\nCreating project_web_1   ... done' },
    ],
    contextHints: [
      'Use `docker ps` para ver os containers em execucao.',
      'Tente `docker images` para listar as imagens disponiveis.',
      'Use `docker logs web` para ver os logs do container "web".',
      'Tente `docker exec -it web bash` para entrar no container.',
      'Use `docker-compose up -d` para subir servicos do compose.',
    ],
  },

  drills: [
    {
      id: 'docker-drill-1',
      prompt: 'Inicie um container nginx em background com o nome "web" e mapeie a porta 8080 do host para a porta 80 do container.',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^docker\s+run\s+/.test(trimmed) &&
          /-(d)/.test(trimmed) &&
          /--name\s+web/.test(trimmed) &&
          /-p\s+8080:80/.test(trimmed) &&
          /nginx$/.test(trimmed);
      },
      expectedOutput: 'a1b2c3d4e5f6...',
      hints: ['Voce precisa de `docker run` com flags para: background (-d), nome (--name), porta (-p) e a imagem ao final.', 'O comando completo e: `docker run -d --name web -p 8080:80 nginx`.'],
      feedbackRules: [
        { pattern: /^docker\s+run\s+nginx$/, message: 'Isso inicia o nginx, mas sem background, sem nome e sem mapeamento de porta. Adicione `-d --name web -p 8080:80`.' },
        { pattern: /docker\s+run.*-p\s+80:8080/, message: 'A ordem do mapeamento de porta e host:container. Deve ser `-p 8080:80`, nao `-p 80:8080`.' },
        { pattern: /docker\s+start/, message: '`docker start` reinicia um container existente. Para criar um novo, use `docker run`.' },
      ],
      xp: 100,
    },
    {
      id: 'docker-drill-2',
      prompt: 'Liste todos os containers em execucao.',
      difficulty: 'easy',
      check: (cmd) => /^docker\s+ps$/.test(cmd.trim()),
      expectedOutput: 'CONTAINER ID   IMAGE     COMMAND     CREATED     STATUS     PORTS     NAMES\na1b2c3d4e5f6   nginx     ...         5 min ago   Up 5 min   ...       web',
      hints: ['O Docker tem um subcomando para listar processos (containers)...', 'Use `docker ps` para ver containers em execucao.'],
      feedbackRules: [
        { pattern: /^docker\s+ps\s+-a/, message: '`-a` mostra todos os containers (incluindo parados). Sem `-a` mostra apenas os em execucao.' },
        { pattern: /^docker\s+list/, message: 'O subcomando correto e `ps` (process status), nao `list`: `docker ps`.' },
      ],
      xp: 100,
    },
    {
      id: 'docker-drill-3',
      prompt: 'Abra um terminal interativo dentro do container "web" executando bash.',
      difficulty: 'medium',
      check: (cmd) => /^docker\s+exec\s+-it\s+web\s+bash$/.test(cmd.trim()),
      expectedOutput: 'root@a1b2c3d4e5f6:/#',
      hints: ['Voce precisa executar um comando dentro de um container em execucao, de forma interativa...', 'Use `docker exec` com `-it` (interativo + terminal) seguido do nome do container e o comando: `docker exec -it web bash`.'],
      feedbackRules: [
        { pattern: /^docker\s+exec\s+web\s+bash$/, message: 'Quase! Faltam as flags `-it` para modo interativo com terminal: `docker exec -it web bash`.' },
        { pattern: /^docker\s+run.*bash/, message: '`docker run` cria um container novo. Para entrar em um existente, use `docker exec -it web bash`.' },
      ],
      xp: 100,
    },
    {
      id: 'docker-drill-4',
      prompt: 'Construa uma imagem Docker chamada "myapp" com a tag "latest" usando o Dockerfile do diretorio atual.',
      difficulty: 'hard',
      check: (cmd) => /^docker\s+build\s+-t\s+myapp(:latest)?\s+\.$/.test(cmd.trim()),
      expectedOutput: 'Successfully tagged myapp:latest',
      hints: ['O `docker build` constroi imagens. Voce precisa dar um nome/tag com `-t` e indicar o contexto (diretorio com o Dockerfile).', 'O comando e: `docker build -t myapp .` (o ponto indica o diretorio atual).'],
      feedbackRules: [
        { pattern: /^docker\s+build\s+\.$/, message: 'Isso constroi a imagem, mas sem nome! Adicione `-t myapp` para nomear.' },
        { pattern: /^docker\s+build\s+-t\s+myapp$/, message: 'Quase! Falta indicar o diretorio do Dockerfile. Adicione `.` (ponto) ao final para o diretorio atual.' },
      ],
      xp: 100,
    },
    {
      id: 'docker-drill-5',
      prompt: 'Suba todos os servicos definidos no docker-compose.yml em modo background (detached).',
      difficulty: 'medium',
      check: (cmd) => /^docker-compose\s+up\s+-d$|^docker\s+compose\s+up\s+-d$/.test(cmd.trim()),
      expectedOutput: 'Creating network "project_default" with the default driver\nCreating project_db_1    ... done\nCreating project_redis_1 ... done\nCreating project_web_1   ... done',
      hints: ['O docker-compose tem um subcomando para iniciar todos os servicos...', 'Use `docker-compose up -d` — o `-d` coloca em background (detached).'],
      feedbackRules: [
        { pattern: /^docker-compose\s+up$/, message: 'Isso funciona, mas roda em foreground (trava o terminal). Adicione `-d` para rodar em background.' },
        { pattern: /^docker-compose\s+start/, message: '`start` reinicia servicos parados. Para criar e iniciar, use `docker-compose up -d`.' },
      ],
      xp: 100,
    },
  ],

  boss: {
    title: 'O Capitao dos Containers',
    scenario: 'Voce precisa fazer o deploy de uma aplicacao web completa com 3 servicos: um servidor web nginx, um banco de dados PostgreSQL e um cache Redis. Monte a infraestrutura container por container e depois verifique que tudo esta funcionando.',
    steps: [
      {
        id: 'boss-docker-1',
        prompt: '> Primeiro, verifique quais containers ja estao rodando no sistema.',
        check: (cmd) => /^docker\s+ps$/.test(cmd.trim()),
        expectedOutput: 'CONTAINER ID   IMAGE     COMMAND                  CREATED          STATUS          PORTS                  NAMES\na1b2c3d4e5f6   nginx     "/docker-entrypoint.."   5 minutes ago    Up 5 minutes    0.0.0.0:8080->80/tcp   web\nb2c3d4e5f6a7   redis     "docker-entrypoint.s.."  10 minutes ago   Up 10 minutes   0.0.0.0:6379->6379/tcp redis-cache\nc3d4e5f6a7b8   postgres  "docker-entrypoint.s.."  15 minutes ago   Up 15 minutes   0.0.0.0:5432->5432/tcp db',
        hints: ['Use o Docker para listar os processos (containers) em execucao.', 'O comando e `docker ps`.'],
        feedbackRules: [
          { pattern: /^docker\s+ps\s+-a/, message: '`-a` mostra todos, incluindo parados. Para ver apenas os ativos, use `docker ps` sem flags.' },
        ],
      },
      {
        id: 'boss-docker-2',
        prompt: '> Os containers estao rodando. Agora verifique os logs do container "web" para garantir que o nginx esta respondendo.',
        check: (cmd) => /^docker\s+logs\s+web$/.test(cmd.trim()),
        expectedOutput: '172.17.0.1 - - [04/Mar/2024:17:45:00 +0000] "GET / HTTP/1.1" 200 615\n172.17.0.1 - - [04/Mar/2024:17:45:01 +0000] "GET /favicon.ico HTTP/1.1" 404 153\n172.17.0.1 - - [04/Mar/2024:17:46:00 +0000] "GET /api/health HTTP/1.1" 200 2',
        hints: ['O Docker tem um subcomando para visualizar logs de um container...', 'Use `docker logs web` para ver os logs do container chamado "web".'],
        feedbackRules: [
          { pattern: /^docker\s+log\s/, message: 'O subcomando e `logs` (com "s"): `docker logs web`.' },
        ],
      },
      {
        id: 'boss-docker-3',
        prompt: '> Precisamos investigar a configuracao do nginx. Entre no container "web" com um shell interativo.',
        check: (cmd) => /^docker\s+exec\s+-it\s+web\s+(bash|sh)$/.test(cmd.trim()),
        expectedOutput: 'root@a1b2c3d4e5f6:/#',
        hints: ['Voce precisa executar um shell dentro do container em execucao.', 'Use `docker exec -it web bash` para abrir um terminal interativo no container.'],
        feedbackRules: [
          { pattern: /^docker\s+exec\s+web/, message: 'Faltam as flags `-it` para modo interativo: `docker exec -it web bash`.' },
        ],
      },
      {
        id: 'boss-docker-4',
        prompt: '> Por fim, a equipe preparou um docker-compose.yml com a versao atualizada de todos os servicos. Suba tudo em background.',
        check: (cmd) => /^docker-compose\s+up\s+-d$|^docker\s+compose\s+up\s+-d$/.test(cmd.trim()),
        expectedOutput: 'Creating network "project_default" with the default driver\nCreating project_db_1    ... done\nCreating project_redis_1 ... done\nCreating project_web_1   ... done',
        hints: ['O docker-compose sobe todos os servicos definidos no YAML.', 'Use `docker-compose up -d` para subir em background.'],
        feedbackRules: [
          { pattern: /^docker-compose\s+up$/, message: 'Sem `-d`, o compose roda em foreground. Adicione `-d` para background.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-capitao-containers',
  },

  achievements: ['docker-master', 'boss-capitao-containers'],
};
