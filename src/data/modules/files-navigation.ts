import type { Module } from '../../types';

export const filesNavigationModule: Module = {
  id: 'files-nav',
  title: 'Arquivos e Navegação',
  description: 'Domine a busca de arquivos, tipos de arquivo e navegação em árvores de diretórios complexas.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `Você já conhece \`ls\` e \`cd\`. Agora é hora de subir de nível nas suas habilidades com arquivos. Este módulo ensina como encontrar arquivos em qualquer lugar, criar e destruí-los, copiar e mover, e inspecionar o que eles são.\n\n` +
      `**Encontrando arquivos:**\n` +
      `• **find** — A ferramenta de busca definitiva. Percorre diretórios recursivamente para localizar arquivos por nome, tipo, tamanho, data e mais.\n` +
      `• **tree** — Visualiza a estrutura de diretórios como um diagrama em árvore. Ótimo para ter uma visão geral.\n` +
      `• **file** — Diz qual é o tipo de um arquivo (texto, binário, imagem, etc.).\n\n` +
      `**Gerenciando arquivos:**\n` +
      `• **touch** — Cria um arquivo vazio, ou atualiza o timestamp de um existente.\n` +
      `• **rm** — Remove (deleta) arquivos. Use \`-r\` para diretórios. **Não tem lixeira — a exclusão é permanente!**\n` +
      `• **cp** — Copia arquivos ou diretórios. Use \`-r\` para diretórios.\n` +
      `• **mv** — Move ou renomeia arquivos e diretórios.`,
    analogy:
      '`find` é como um cão farejador — você descreve o que procura e ele fareja cada diretório para encontrar. `touch` é como tocar em um arquivo dizendo "estive aqui" (ou trazendo um novo à existência). `rm` é um triturador de papel — uma vez que foi, já era. `cp` é uma fotocopiadora, e `mv` é pegar algo e colocar em outro lugar.',
    syntax:
      'find [path] [options]       # search for files\n  -name "pattern"            # match by name (supports wildcards)\n  -type f|d                  # f = file, d = directory\n  -mtime -N                  # modified in the last N days\n  -delete                    # delete matched files\ntree [path]                  # show directory tree\nfile <filename>              # identify file type\ntouch <filename>             # create file or update timestamp\nrm [-r] <file|dir>           # remove file (-r for directories)\ncp [-r] <source> <dest>      # copy file (-r for directories)\nmv <source> <dest>           # move or rename',
    examples: [
      { command: 'find . -name "*.txt"', output: './notes.txt\n./docs/readme.txt\n./backup/old.txt', explanation: 'Busca no diretório atual e em todos os subdiretórios por arquivos terminando em .txt.' },
      { command: 'find . -type d', output: './\n./docs\n./backup\n./src', explanation: 'Lista todos os diretórios. `-type d` significa "somente diretórios". Use `-type f` para somente arquivos.' },
      { command: 'find . -mtime -1', output: './notes.txt\n./src/app.js', explanation: 'Encontra arquivos modificados nas últimas 24 horas. `-mtime -7` significaria nos últimos 7 dias.' },
      { command: 'touch notes.txt', output: '', explanation: 'Cria um arquivo vazio chamado notes.txt. Se já existir, atualiza o timestamp.' },
      { command: 'cp config.bak config.txt', output: '', explanation: 'Faz uma cópia de config.bak com o nome config.txt.' },
      { command: 'mv old-name.txt new-name.txt', output: '', explanation: 'Renomeia old-name.txt para new-name.txt. Também serve para mover arquivos entre diretórios.' },
      { command: 'rm temp.txt', output: '', explanation: 'Deleta permanentemente temp.txt. Sem confirmação, sem desfazer.' },
      { command: 'find . -name "*.tmp" -delete', output: '', explanation: 'Encontra todos os arquivos .tmp e deleta de uma vez. Poderoso mas perigoso — confira duas vezes!' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^find\s+\.\s+-name\s+['"]\*\.txt['"]$/, output: './notes.txt\n./docs/readme.txt\n./backup/old.txt', description: 'Find all .txt files' },
      { pattern: /^find\s+\.\s+-name\s+['"]\*\.tmp['"]$/, output: './cache/session.tmp\n./cache/data.tmp\n./tmp/upload.tmp\n./old.tmp', description: 'Find all .tmp files' },
      { pattern: /^find\s+\.\s+-name\s+['"]\*\.tmp['"]\s+-delete$/, output: '', description: 'Find and delete all .tmp files' },
      { pattern: /^find\s+\.\s+-type\s+f$/, output: './notes.txt\n./config.bak\n./config.txt\n./docs/readme.txt\n./src/app.js\n./cache/session.tmp\n./cache/data.tmp\n./tmp/upload.tmp\n./old.tmp', description: 'Find all files' },
      { pattern: /^find\s+\.\s+-type\s+d$/, output: './\n./docs\n./backup\n./src\n./cache\n./tmp', description: 'Find all directories' },
      { pattern: /^find\s+\.\s+-mtime\s+-1$/, output: './notes.txt\n./src/app.js\n./cache/session.tmp', description: 'Find files modified in last 24h' },
      { pattern: /^find\s+\.\s+-mtime\s+-7$/, output: './notes.txt\n./config.bak\n./src/app.js\n./docs/readme.txt\n./cache/session.tmp\n./cache/data.tmp', description: 'Find files modified in last 7 days' },
      { pattern: /^tree$/, output: '.\n├── backup\n│   └── old.txt\n├── cache\n│   ├── data.tmp\n│   └── session.tmp\n├── config.bak\n├── config.txt\n├── docs\n│   └── readme.txt\n├── notes.txt\n├── old.tmp\n├── src\n│   └── app.js\n└── tmp\n    └── upload.tmp\n\n5 directories, 9 files', description: 'Show directory tree' },
      { pattern: /^tree\s+\S+/, output: '(tree output for directory)', description: 'Show tree of specific directory' },
      { pattern: /^file\s+notes\.txt$/, output: 'notes.txt: ASCII text', description: 'Identify file type of notes.txt' },
      { pattern: /^file\s+src\/app\.js$/, output: 'src/app.js: JavaScript source, ASCII text', description: 'Identify file type of app.js' },
      { pattern: /^file\s+\S+/, output: 'ASCII text', description: 'Identify file type' },
      { pattern: /^touch\s+\S+/, output: '', description: 'Create a file or update timestamp' },
      { pattern: /^rm\s+-r\s+\S+/, output: '', description: 'Remove directory recursively' },
      { pattern: /^rm\s+\S+/, output: '', description: 'Remove a file' },
      { pattern: /^cp\s+-r\s+\S+\s+\S+/, output: '', description: 'Copy directory recursively' },
      { pattern: /^cp\s+\S+\s+\S+/, output: '', description: 'Copy a file' },
      { pattern: /^mv\s+\S+\s+\S+/, output: '', description: 'Move or rename a file' },
      { pattern: /^ls$/, output: 'backup  cache  config.bak  config.txt  docs  notes.txt  old.tmp  src  tmp', description: 'List files' },
      { pattern: /^ls\s+-la?/, output: 'total 36\ndrwxr-xr-x 7 enzo enzo 4096 Mar 03 10:00 .\ndrwxr-xr-x 3 enzo enzo 4096 Mar 01 08:00 ..\ndrwxr-xr-x 2 enzo enzo 4096 Feb 20 09:00 backup\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 09:30 cache\n-rw-r--r-- 1 enzo enzo  512 Mar 01 14:00 config.bak\n-rw-r--r-- 1 enzo enzo  512 Mar 02 11:00 config.txt\ndrwxr-xr-x 2 enzo enzo 4096 Mar 02 16:00 docs\n-rw-r--r-- 1 enzo enzo  128 Mar 03 08:00 notes.txt\n-rw-r--r-- 1 enzo enzo    0 Feb 15 12:00 old.tmp\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 07:00 src\ndrwxr-xr-x 2 enzo enzo 4096 Feb 25 10:00 tmp', description: 'List files with details' },
    ],
    contextHints: [
      'Tente `find . -name "*.txt"` para buscar todos os arquivos de texto.',
      'Use `tree` para visualizar a estrutura de diretórios.',
      'Crie um novo arquivo com `touch myfile.txt`.',
      'Use `file notes.txt` para verificar o tipo do arquivo.',
      'Copie um arquivo com `cp source.txt destination.txt`.',
      'Mova ou renomeie com `mv old.txt new.txt`.',
      'Encontre arquivos modificados recentemente: `find . -mtime -1`',
      'Cuidado com `rm` — não tem como desfazer!',
      'Use `find . -name "*.tmp" -delete` para limpar arquivos temporários.',
    ],
  },

  drills: [
    {
      id: 'files-drill-1',
      prompt: 'Encontre todos os arquivos que terminam com .txt no diretório atual e seus subdiretórios.',
      difficulty: 'easy',
      check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.txt['"]$/.test(cmd.trim()),
      expectedOutput: './notes.txt\n./docs/readme.txt\n./backup/old.txt',
      hints: [
        'Use `find` começando de `.` (diretório atual).',
        'A flag para buscar por nome é `-name`. Coloque o padrão entre aspas: `"*.txt"`.',
      ],
      feedbackRules: [
        { pattern: /^ls\s+.*\.txt/, message: '`ls` só lista o diretório atual. Use `find` para buscar recursivamente em todos os subdiretórios.' },
        { pattern: /^find\s+\.\s+\*\.txt$/, message: 'Você precisa da flag `-name`: `find . -name "*.txt"`. As aspas evitam que o shell expanda o `*`.' },
        { pattern: /^find\s+-name\s+['"][*]\.txt['"]$/, message: 'Quase! Especifique onde buscar — adicione `.` para o diretório atual: `find . -name "*.txt"`.' },
        { pattern: /^find\s+\.\s+-name\s+[*]\.txt$/, message: 'Coloque aspas no padrão! Sem elas, o shell expande o `*` antes do find ver: `find . -name "*.txt"`.' },
        { pattern: /^grep\s/, message: '`grep` busca conteúdo de arquivos. Para encontrar arquivos por nome, use `find . -name "*.txt"`.' },
      ],
      xp: 50,
    },
    {
      id: 'files-drill-2',
      prompt: 'Crie um arquivo vazio chamado notes.txt usando o comando touch.',
      difficulty: 'easy',
      check: (cmd) => /^touch\s+notes\.txt$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'O comando para criar um arquivo vazio é `touch`.',
        'Basta digitar: `touch notes.txt`',
      ],
      feedbackRules: [
        { pattern: /^echo\s+.*>\s*notes\.txt$/, message: 'Funciona, mas cria um arquivo com conteúdo. `touch` cria um arquivo realmente vazio: `touch notes.txt`.' },
        { pattern: /^cat\s+>\s*notes\.txt$/, message: 'Isso abre uma entrada interativa. Use `touch notes.txt` para criar um arquivo vazio limpo.' },
        { pattern: /^mkdir\s+notes\.txt$/, message: '`mkdir` cria diretórios, não arquivos. Use `touch notes.txt` para criar um arquivo.' },
        { pattern: /^touch$/, message: 'Você precisa especificar o nome do arquivo: `touch notes.txt`.' },
        { pattern: /^nano\s+notes\.txt$/, message: '`nano` abre um editor. Para apenas criar o arquivo, use `touch notes.txt`.' },
        { pattern: /^vim\s+notes\.txt$/, message: '`vim` abre um editor. Para apenas criar o arquivo, use `touch notes.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'files-drill-3',
      prompt: 'Encontre todos os arquivos que foram modificados nas últimas 24 horas (último 1 dia).',
      difficulty: 'medium',
      check: (cmd) => /^find\s+\.\s+-mtime\s+-1$/.test(cmd.trim()),
      expectedOutput: './notes.txt\n./src/app.js\n./cache/session.tmp',
      hints: [
        'Use `find` com uma flag baseada em tempo. A flag para tempo de modificação é `-mtime`.',
        'Um número negativo significa "há menos de N dias". Tente `find . -mtime -1`.',
      ],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-mtime\s+1$/, message: 'Perto! `-mtime 1` significa exatamente 1 dia atrás. Use `-mtime -1` (com sinal de menos) para "dentro do último dia".' },
        { pattern: /^find\s+\.\s+-mtime\s+-24$/, message: '`-mtime` conta em dias, não horas. `-mtime -1` significa "há menos de 1 dia".' },
        { pattern: /^find\s+\.\s+-name\s/, message: '`-name` busca por nome de arquivo. Para tempo de modificação, use `-mtime`.' },
        { pattern: /^find\s+\.\s+-time\s/, message: 'A flag é `-mtime` (modification time), não `-time`.' },
        { pattern: /^ls\s+-lt/, message: '`ls -lt` ordena por tempo mas não filtra por idade. Use `find . -mtime -1` para arquivos modificados no último dia.' },
      ],
      xp: 75,
    },
    {
      id: 'files-drill-4',
      prompt: 'Encontre todos os arquivos .tmp e delete-os em um único comando. Seja preciso!',
      difficulty: 'hard',
      check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-delete$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Combine `find` com a ação `-delete`.',
        'Primeiro pense em encontrá-los: `find . -name "*.tmp"`. Depois adicione `-delete` no final.',
      ],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/, message: 'Isso encontra eles! Agora adicione `-delete` no final para removê-los: `find . -name "*.tmp" -delete`.' },
        { pattern: /^rm\s+.*\.tmp/, message: '`rm *.tmp` só deleta no diretório atual. `find . -name "*.tmp" -delete` busca recursivamente.' },
        { pattern: /^find\s+\.\s+-delete\s+-name/, message: 'A ordem importa! Coloque `-name "*.tmp"` antes de `-delete`, ou você vai deletar tudo!' },
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s*\|\s*rm/, message: 'Pipe para `rm` é complexo e frágil. `find` tem a ação `-delete` embutida — basta adicioná-la.' },
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-exec\s+rm/, message: '`-exec rm` funciona, mas `-delete` é mais simples e seguro: `find . -name "*.tmp" -delete`.' },
        { pattern: /^find\s+\.\s+-type\s+f\s+-name\s+['"][*]\.tmp['"]\s+-delete$/, message: 'Funciona e é até mais preciso! Para este drill, `find . -name "*.tmp" -delete` é suficiente.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'A Equipe de Limpeza',
    scenario: 'O diretório do projeto está uma bagunça — arquivos temporários por todo lado, um config faltando, e ninguém sabe o que tem na metade desses diretórios. Hora de avaliar o estrago e limpar tudo.',
    steps: [
      {
        id: 'boss-files-1',
        prompt: '> Primeiro, vamos avaliar o estrago. Encontre todos os arquivos .tmp no projeto para saber com o que estamos lidando.',
        check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/.test(cmd.trim()),
        expectedOutput: './cache/session.tmp\n./cache/data.tmp\n./tmp/upload.tmp\n./old.tmp',
        hints: [
          'Use `find` com `-name` para localizar todos os arquivos .tmp.',
          'Comece a busca a partir do diretório atual (`.`) e use um padrão com wildcard entre aspas para capturar a extensão desejada.',
        ],
        feedbackRules: [
          { pattern: /^ls\s+.*\.tmp/, message: '`ls` só olha no diretório atual. Use `find . -name "*.tmp"` para buscar em todo lugar.' },
          { pattern: /^find\s+\.\s+-name\s+[*]\.tmp$/, message: 'Lembre de colocar aspas no padrão! Use `find . -name "*.tmp"` com aspas em *.tmp.' },
        ],
      },
      {
        id: 'boss-files-2',
        prompt: '> 4 arquivos temporários encontrados! Vamos nos livrar de todos. Delete todos os arquivos .tmp em um único comando.',
        check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-delete$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Adicione `-delete` ao seu comando find.',
          'O `find` aceita ações no final do comando. Monte primeiro a busca por nome e depois encadeie a ação de remoção como último argumento.',
        ],
        feedbackRules: [
          { pattern: /^rm\s/, message: '`rm` não consegue encontrar arquivos recursivamente. Use `find . -name "*.tmp" -delete`.' },
          { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/, message: 'Isso encontra eles mas não deleta! Adicione `-delete` no final.' },
        ],
      },
      {
        id: 'boss-files-3',
        prompt: '> Ótimo, os temporários foram embora. Agora o time precisa restaurar o config de backup. Copie config.bak para config.txt.',
        check: (cmd) => /^cp\s+config\.bak\s+config\.txt$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `cp` para copiar: `cp origem destino`.',
          'A ordem dos argumentos importa: o primeiro é o arquivo de origem (o backup) e o segundo é o destino onde será criada a cópia.',
        ],
        feedbackRules: [
          { pattern: /^mv\s+config\.bak\s+config\.txt$/, message: '`mv` apagaria o backup! Use `cp` para fazer uma cópia e manter o original.' },
          { pattern: /^cp\s+config\.txt\s+config\.bak$/, message: 'Está invertido! Você quer copiar DE config.bak PARA config.txt.' },
          { pattern: /^cat\s+config\.bak\s*>\s*config\.txt$/, message: 'Funciona, mas `cp` é a ferramenta certa para copiar arquivos: `cp config.bak config.txt`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-cleanup-crew',
  },

  achievements: ['file-finder', 'boss-cleanup-crew'],
};
