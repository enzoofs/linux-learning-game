import type { Module } from '../../types';

export const sbCurlModule: Module = {
  id: 'sb-curl',
  title: 'HTTP & curl',
  description: 'Faca requisicoes HTTP direto do terminal — APIs, downloads e mais.',
  tier: 'Adept',
  prerequisites: ['sb-shell-functions'],
  isSideQuest: false,

  briefing: {
    concept:
      `O \`curl\` (Client URL) é a ferramenta universal do terminal para transferir dados pela rede. Com ele, você faz requisições HTTP, consome APIs REST, baixa arquivos e muito mais — tudo sem sair da linha de comando.\n\n` +
      `Os métodos HTTP mais comuns que você vai usar:\n` +
      `• **GET** — Busca dados. É o padrão do curl.\n` +
      `• **POST** — Envia dados para o servidor (formulários, JSON, etc.).\n` +
      `• **PUT/PATCH** — Atualiza recursos existentes.\n` +
      `• **DELETE** — Remove recursos.\n\n` +
      `Flags essenciais do curl:\n` +
      `• **-X** — Define o método HTTP (POST, PUT, DELETE...).\n` +
      `• **-d** — Envia dados no corpo da requisição.\n` +
      `• **-H** — Adiciona headers personalizados.\n` +
      `• **-o / -O** — Salva a resposta em um arquivo.\n` +
      `• **-L** — Segue redirecionamentos (301, 302).\n` +
      `• **-v** — Modo verboso (mostra headers de ida e volta).\n` +
      `• **-s** — Modo silencioso (sem barra de progresso).`,
    analogy:
      'Pense no `curl` como um carteiro digital. Você escreve uma carta (requisição), coloca o endereço (URL), pode adicionar instruções especiais no envelope (headers), e o carteiro entrega e traz a resposta de volta para o seu terminal.',
    syntax:
      'curl [options] URL\ncurl -X POST -d \'data\' URL\ncurl -H \'Header: value\' URL\ncurl -o arquivo URL\ncurl -sL URL | jq .',
    commandBreakdowns: [
      {
        title: 'curl POST com JSON',
        command: "curl -X POST -d '{\"name\":\"enzo\"}' -H 'Content-Type: application/json' https://api.exemplo.com/users",
        parts: [
          { text: 'curl', label: 'Ferramenta de transferência de dados via URL' },
          { text: '-X POST', label: 'Define o método HTTP (GET é o padrão, aqui forçamos POST)' },
          { text: '-d \'{"name":"enzo"}\'', label: 'Data/body da requisição — o conteúdo enviado ao servidor' },
          { text: '-H \'Content-Type: application/json\'', label: 'Header HTTP — informa que o body está em JSON' },
          { text: 'https://api.exemplo.com/users', label: 'A URL de destino (endpoint da API)' },
        ],
      },
      {
        title: 'Pipeline curl + jq',
        command: "curl -s https://api.github.com/users/torvalds | jq '.name, .bio'",
        parts: [
          { text: 'curl', label: 'Faz a requisição HTTP' },
          { text: '-s', label: 'Silent mode — suprime barra de progresso e mensagens de status' },
          { text: 'https://api.github.com/users/torvalds', label: 'URL da API do GitHub' },
          { text: '|', label: 'Pipe — envia a resposta JSON para o próximo comando' },
          { text: 'jq', label: 'Processador de JSON na linha de comando' },
          { text: "'.name, .bio'", label: 'Filtro jq — extrai os campos "name" e "bio" do JSON' },
        ],
      },
    ],
    examples: [
      { command: 'curl https://api.github.com', output: '{"current_user_url":"https://api.github.com/user",...}', explanation: 'GET simples — busca dados de uma API e mostra no terminal.' },
      { command: 'curl -X POST -d \'{"name":"enzo"}\' -H \'Content-Type: application/json\' https://httpbin.org/post', output: '{"json":{"name":"enzo"},...}', explanation: 'POST com corpo JSON e header Content-Type.' },
      { command: 'curl -H \'Authorization: Bearer TOKEN\' https://api.exemplo.com/dados', output: '{"dados":[...]}', explanation: 'Requisição com header de autenticação.' },
      { command: 'curl -L http://bit.ly/exemplo', output: '<html>...página final...</html>', explanation: 'Segue redirecionamentos até chegar na URL final.' },
      { command: 'curl -o relatorio.pdf https://exemplo.com/relatorio.pdf', output: '  % Total    % Received\n 100  1024k  100  1024k    0     0   512k      0  0:00:02', explanation: 'Baixa o arquivo e salva como relatorio.pdf.' },
      { command: 'curl -s https://api.github.com/users/torvalds | jq .name', output: '"Linus Torvalds"', explanation: 'Modo silencioso + pipe para jq para extrair campos do JSON.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^curl\s+https?:\/\/api\.github\.com\/?$/, output: '{\n  "current_user_url": "https://api.github.com/user",\n  "repos_url": "https://api.github.com/users/{user}/repos",\n  "gists_url": "https://api.github.com/gists{/gist_id}"\n}' },
      { pattern: /^curl\s+-s\s+https?:\/\/api\.github\.com\/users\/\w+\s*\|\s*jq\s+\.name$/, output: '"Linus Torvalds"' },
      { pattern: /^curl\s+-X\s+POST\s+-d\s+/, output: '{\n  "args": {},\n  "data": "...",\n  "json": { "name": "enzo" },\n  "method": "POST",\n  "origin": "189.10.20.30"\n}' },
      { pattern: /^curl\s+-[vV]\s+/, output: '* Trying 140.82.121.6:443...\n* Connected to api.github.com\n> GET / HTTP/2\n> Host: api.github.com\n> User-Agent: curl/8.4.0\n< HTTP/2 200\n< content-type: application/json\n{"current_user_url":"https://api.github.com/user"}' },
      { pattern: /^curl\s+-[oO]\s+\S+\s+/, output: '  % Total    % Received  % Xferd  Average Speed\n 100  2048k  100  2048k    0     0   1024k      0  0:00:02  0:00:02' },
      { pattern: /^curl\s+-L\s+/, output: 'HTTP/1.1 301 Moved Permanently\nLocation: https://exemplo.com/final\n\n<html><body>Pagina final apos redirecionamento.</body></html>' },
      { pattern: /^curl\s+-s\s+/, output: '{"status":"ok","data":[1,2,3]}' },
      { pattern: /^curl\s+-H\s+/, output: '{\n  "headers": {\n    "Authorization": "Bearer TOKEN",\n    "Host": "httpbin.org"\n  }\n}' },
      { pattern: /^curl\s+/, output: '{\n  "message": "Resposta da API",\n  "status": 200\n}' },
      { pattern: /^jq\s+/, output: '{\n  "name": "Linus Torvalds"\n}' },
    ],
    contextHints: [
      'Tente `curl https://api.github.com` para fazer uma requisição GET simples.',
      'Use `curl -v` para ver os headers da requisição e resposta.',
      'Experimente `curl -X POST -d \'{"key":"value"}\' URL` para enviar dados.',
      'Combine `curl -s URL | jq .campo` para extrair campos de um JSON.',
      'Use `curl -o arquivo.txt URL` para salvar a resposta em um arquivo.',
    ],
  },

  drills: [
    {
      id: 'curl-drill-1',
      prompt: 'Faça uma requisição GET simples para a URL https://api.github.com — apenas busque os dados.',
      difficulty: 'easy',
      check: (cmd) => /^curl\s+https:\/\/api\.github\.com\/?$/.test(cmd.trim()),
      expectedOutput: '{\n  "current_user_url": "https://api.github.com/user",\n  "repos_url": "https://api.github.com/users/{user}/repos"\n}',
      hints: ['O `curl` faz GET por padrão — basta passar a URL.', 'O comando é simplesmente `curl` seguido da URL completa.'],
      feedbackRules: [
        { pattern: /^curl\s+-X\s+GET/i, message: 'Funciona, mas o `-X GET` é desnecessário — GET já é o padrão do curl.' },
        { pattern: /^wget/i, message: '`wget` é para downloads. Para requisições HTTP, use `curl`.' },
      ],
      xp: 70,
    },
    {
      id: 'curl-drill-2',
      prompt: 'Envie um POST para https://httpbin.org/post com o corpo JSON `{"nome":"quest"}` e o header Content-Type adequado.',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^curl\s+/.test(trimmed) &&
          /-(X|--request)\s+POST/.test(trimmed) &&
          /-d\s+/.test(trimmed) &&
          /\{"nome":\s*"quest"\}/.test(trimmed) &&
          /-H\s+['"]Content-Type:\s*application\/json['"]/.test(trimmed);
      },
      expectedOutput: '{\n  "json": { "nome": "quest" },\n  "method": "POST"\n}',
      hints: [
        'Você precisa de 3 flags: `-X POST` para o método, `-d` para os dados, e `-H` para o header.',
        'O header correto é: `-H \'Content-Type: application/json\'`.',
      ],
      feedbackRules: [
        { pattern: /POST.*-d.*(?!-H)/, message: 'Você está enviando dados mas esqueceu o header Content-Type! Adicione `-H \'Content-Type: application/json\'`.' },
        { pattern: /-d.*(?!-X).*POST/, message: 'Não esqueça de especificar o método com `-X POST`.' },
        { pattern: /--data/, message: '`--data` funciona igual a `-d`. Ambos estão corretos!' },
      ],
      xp: 70,
    },
    {
      id: 'curl-drill-3',
      prompt: 'Faça uma requisição GET para https://api.exemplo.com/dados com um header de autenticação: `Authorization: Bearer meutoken123`.',
      difficulty: 'medium',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^curl\s+/.test(trimmed) &&
          /-H\s+['"]Authorization:\s*Bearer\s+meutoken123['"]/.test(trimmed) &&
          /https:\/\/api\.exemplo\.com\/dados/.test(trimmed);
      },
      expectedOutput: '{\n  "dados": [{"id": 1, "valor": "secreto"}]\n}',
      hints: [
        'Use a flag `-H` para adicionar um header personalizado.',
        'O formato é: `curl -H \'Authorization: Bearer meutoken123\' URL`.',
      ],
      feedbackRules: [
        { pattern: /Bearer(?!\s+meutoken123)/, message: 'Verifique o token — deve ser exatamente `meutoken123`.' },
        { pattern: /-u\s+/, message: '`-u` é para autenticação básica (user:pass). Para Bearer token, use `-H \'Authorization: Bearer ...\'`.' },
      ],
      xp: 70,
    },
    {
      id: 'curl-drill-4',
      prompt: 'Baixe o arquivo https://exemplo.com/dados.csv e salve-o localmente como `relatorio.csv`.',
      difficulty: 'easy',
      check: (cmd) => /^curl\s+-o\s+relatorio\.csv\s+https:\/\/exemplo\.com\/dados\.csv$/.test(cmd.trim()),
      expectedOutput: '  % Total    % Received  % Xferd  Average Speed\n 100  512k   100  512k    0     0   256k      0  0:00:02',
      hints: [
        'A flag `-o` (minúscula) permite especificar o nome do arquivo de saída.',
        'Formato: `curl -o nome_local URL_remota`.',
      ],
      feedbackRules: [
        { pattern: /-O/, message: '`-O` (maiúscula) mantém o nome original. Use `-o relatorio.csv` para renomear.' },
        { pattern: />\s*relatorio/, message: 'Redirecionar com `>` funciona, mas a flag `-o` é a forma idiomática do curl.' },
      ],
      xp: 70,
    },
    {
      id: 'curl-drill-5',
      prompt: 'Busque os dados de https://api.github.com/users/torvalds em modo silencioso e use `jq` para extrair apenas o campo `.name`.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        return /^curl\s+-s\s+https:\/\/api\.github\.com\/users\/torvalds\s*\|\s*jq\s+['"]?\.name['"]?$/.test(trimmed);
      },
      expectedOutput: '"Linus Torvalds"',
      hints: [
        'Combine `curl -s` (silencioso, sem barra de progresso) com pipe `|` para `jq`.',
        'O comando completo é: `curl -s URL | jq .name`.',
      ],
      feedbackRules: [
        { pattern: /curl\s+(?!.*-s).*\|\s*jq/, message: 'Funciona, mas sem `-s` a barra de progresso vai poluir a saída. Adicione `-s` para modo silencioso.' },
        { pattern: /jq\s+name/, message: 'No `jq`, campos são acessados com ponto: `.name`, não `name`.' },
        { pattern: /grep/, message: '`grep` funciona para texto, mas para JSON estruturado, `jq` é a ferramenta certa.' },
      ],
      xp: 70,
    },
  ],

  boss: {
    title: 'O Explorador de APIs',
    scenario: 'Você foi contratado para integrar o sistema da empresa com uma API REST externa. Precisa testar os endpoints, autenticar, enviar dados e processar as respostas — tudo pelo terminal.',
    steps: [
      {
        id: 'boss-curl-1',
        prompt: '> Primeiro, vamos verificar se a API está acessível. Faça um GET em https://api.empresa.com/status em modo verboso para ver os headers.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^curl\s+/.test(trimmed) &&
            /-v/.test(trimmed) &&
            /https:\/\/api\.empresa\.com\/status/.test(trimmed);
        },
        expectedOutput: '* Trying 10.0.1.50:443...\n* Connected to api.empresa.com\n> GET /status HTTP/2\n> Host: api.empresa.com\n< HTTP/2 200\n< content-type: application/json\n{"status":"online","version":"2.1.0"}',
        hints: [
          'Combine a flag `-v` (verbose) com a URL para ver headers completos.',
          'O comando é: `curl -v https://api.empresa.com/status`.',
        ],
        feedbackRules: [
          { pattern: /^curl\s+https/, message: 'Requisição OK, mas precisamos ver os headers! Adicione a flag `-v` para modo verboso.' },
        ],
      },
      {
        id: 'boss-curl-2',
        prompt: '> A API está online. Agora autentique-se: faça um POST para https://api.empresa.com/auth com o corpo `{"user":"admin","pass":"s3cret"}` e o header Content-Type correto.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^curl\s+/.test(trimmed) &&
            /-X\s+POST/.test(trimmed) &&
            /-d\s+/.test(trimmed) &&
            /\{"user":\s*"admin",\s*"pass":\s*"s3cret"\}/.test(trimmed) &&
            /-H\s+['"]Content-Type:\s*application\/json['"]/.test(trimmed) &&
            /https:\/\/api\.empresa\.com\/auth/.test(trimmed);
        },
        expectedOutput: '{\n  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123",\n  "expires_in": 3600\n}',
        hints: [
          'Você precisa de `-X POST`, `-d` com o JSON e `-H` com Content-Type.',
          'curl -X POST -d \'{"user":"admin","pass":"s3cret"}\' -H \'Content-Type: application/json\' URL',
        ],
        feedbackRules: [
          { pattern: /GET/, message: 'Autenticação geralmente usa POST, não GET. Use `-X POST`.' },
          { pattern: /-d.*(?!.*-H)/, message: 'Está faltando o header Content-Type! Adicione `-H \'Content-Type: application/json\'`.' },
        ],
      },
      {
        id: 'boss-curl-3',
        prompt: '> Ótimo, você recebeu o token! Agora busque os dados protegidos em https://api.empresa.com/dados usando o header `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.abc123`, em modo silencioso, e extraia o campo `.resultados` com jq.',
        check: (cmd) => {
          const trimmed = cmd.trim();
          return /^curl\s+/.test(trimmed) &&
            /-s/.test(trimmed) &&
            /-H\s+['"]Authorization:\s*Bearer\s+eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9\.abc123['"]/.test(trimmed) &&
            /https:\/\/api\.empresa\.com\/dados/.test(trimmed) &&
            /\|\s*jq\s+['"]?\.resultados['"]?$/.test(trimmed);
        },
        expectedOutput: '[\n  {"id": 1, "nome": "Projeto Alpha", "status": "ativo"},\n  {"id": 2, "nome": "Projeto Beta", "status": "concluido"}\n]',
        hints: [
          'Combine `-s` (silencioso), `-H` (header de auth) e pipe para `jq .resultados`.',
          'curl -s -H \'Authorization: Bearer TOKEN\' URL | jq .resultados',
        ],
        feedbackRules: [
          { pattern: /curl\s+(?!.*-s)/, message: 'Adicione `-s` para modo silencioso — queremos apenas o JSON limpo.' },
          { pattern: /jq\s+resultados/, message: 'No jq, use ponto antes do campo: `.resultados`.' },
        ],
      },
      {
        id: 'boss-curl-4',
        prompt: '> Por fim, baixe o relatório completo de https://api.empresa.com/relatorio.pdf e salve como `relatorio_final.pdf`.',
        check: (cmd) => /^curl\s+-o\s+relatorio_final\.pdf\s+https:\/\/api\.empresa\.com\/relatorio\.pdf$/.test(cmd.trim()),
        expectedOutput: '  % Total    % Received  % Xferd  Average Speed\n 100  4096k  100  4096k    0     0   2048k      0  0:00:02\nArquivo salvo: relatorio_final.pdf',
        hints: [
          'Use `-o` para especificar o nome do arquivo de saída.',
          'curl -o relatorio_final.pdf https://api.empresa.com/relatorio.pdf',
        ],
        feedbackRules: [
          { pattern: /-O/, message: '`-O` mantém o nome original. Use `-o relatorio_final.pdf` para renomear o arquivo.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-api-explorer',
  },

  achievements: ['api-explorer', 'boss-api-explorer'],
};
