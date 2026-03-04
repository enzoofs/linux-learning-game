import type { Module } from '../../types';

export const sbShellFunctionsModule: Module = {
  id: 'sb-shell-functions',
  title: 'Funcoes Shell',
  description: 'Crie suas proprias ferramentas com funcoes, aliases e variaveis.',
  tier: 'Initiate',
  prerequisites: ['sb-shell-tricks'],
  isSideQuest: false,

  briefing: {
    concept:
      `Ate agora voce usou comandos prontos. Mas o verdadeiro poder do shell e a capacidade de criar suas proprias ferramentas. Com funcoes, aliases e variaveis, voce transforma o terminal num ambiente totalmente personalizado.\n\n` +
      `Vamos dominar cinco pilares da customizacao:\n\n` +
      `• **alias** — Crie atalhos para comandos longos. `+"`"+`alias ll='ls -la'`+"`"+` transforma `+"`"+`ll`+"`"+` num super-ls.\n` +
      `• **Funcoes Bash** — Blocos de codigo reutilizaveis. Podem receber argumentos ($1, $2...) e conter logica.\n` +
      `• **Variaveis de Ambiente** — Valores globais como $HOME, $PATH, $USER que o sistema e seus programas usam.\n` +
      `• **export** — Torna uma variavel visivel para processos filhos.\n` +
      `• **source** — Recarrega um arquivo de configuracao (como .bashrc) sem precisar abrir um novo terminal.`,
    analogy:
      'O shell e como uma oficina de ferramentas. Aliases sao etiquetas nas ferramentas — voce cola o nome "martelo" num comando longo. Funcoes sao ferramentas customizadas que voce mesmo constroi. Variaveis de ambiente sao as configuracoes da oficina — iluminacao, temperatura, layout. E `source` e como apertar o botao de "atualizar" depois de mudar uma configuracao.',
    syntax:
      'alias nome=\'comando\'              # cria um alias\nunalias nome                        # remove um alias\nfunction nome() { comandos; }       # define uma funcao\nexport VAR=valor                    # exporta variavel\nsource ~/.bashrc                    # recarrega configuracao\necho $HOME $PATH $USER              # le variaveis de ambiente',
    examples: [
      { command: "alias ll='ls -la'", output: '', explanation: 'Cria o alias `ll` que executa `ls -la` quando chamado.' },
      { command: 'll', output: 'total 40\ndrwxr-xr-x 8 enzo enzo 4096 ...', explanation: 'Agora `ll` funciona como `ls -la` — muito mais rapido de digitar.' },
      { command: "greet() { echo \"Ola, $1!\"; }", output: '', explanation: 'Define a funcao `greet` que recebe um argumento e imprime uma saudacao.' },
      { command: 'greet Enzo', output: 'Ola, Enzo!', explanation: '`$1` foi substituido pelo primeiro argumento passado a funcao.' },
      { command: 'export PROJETO=cli-quest', output: '', explanation: 'Cria e exporta a variavel `PROJETO` — disponivel para qualquer subprocesso.' },
      { command: 'echo $HOME', output: '/home/enzo', explanation: '`$HOME` e uma variavel de ambiente padrao que aponta para seu diretorio home.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^alias\s+\w+='.+'$/, output: '' },
      { pattern: /^alias$/, output: "alias ll='ls -la'\nalias gs='git status'\nalias ..='cd ..'" },
      { pattern: /^unalias\s+\w+$/, output: '' },
      { pattern: /^export\s+\w+=.+$/, output: '' },
      { pattern: /^echo\s+\$HOME$/, output: '/home/enzo' },
      { pattern: /^echo\s+\$PATH$/, output: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin' },
      { pattern: /^echo\s+\$USER$/, output: 'enzo' },
      { pattern: /^source\s+/, output: '' },
      { pattern: /^type\s+\w+$/, output: '(mostra o tipo do comando)' },
      { pattern: /^env$/, output: 'HOME=/home/enzo\nPATH=/usr/local/bin:/usr/bin:/bin\nUSER=enzo\nSHELL=/bin/bash\nLANG=pt_BR.UTF-8' },
    ],
    contextHints: [
      "Tente criar um alias: `alias ll='ls -la'`.",
      'Use `echo $HOME` para ver o valor de uma variavel de ambiente.',
      'Experimente `env` para listar todas as variaveis de ambiente.',
      'Tente `export NOME=valor` para criar uma variavel exportada.',
      'Use `source ~/.bashrc` para recarregar suas configuracoes.',
    ],
  },

  drills: [
    {
      id: 'functions-drill-1',
      prompt: "Crie um alias chamado `gs` que execute `git status`.",
      difficulty: 'easy',
      check: (cmd) => /^alias\s+gs='git\s+status'$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['A sintaxe de alias e `alias nome=\'comando\'`.', "Use `alias gs='git status'` — nao esqueca as aspas simples!"],
      feedbackRules: [
        { pattern: /^alias\s+gs=git/, message: 'O valor do alias precisa estar entre aspas simples: `alias gs=\'git status\'`.' },
        { pattern: /^alias\s+gs="/, message: 'Prefira aspas simples para evitar expansao indesejada: `alias gs=\'git status\'`.' },
      ],
      xp: 60,
    },
    {
      id: 'functions-drill-2',
      prompt: 'Escreva uma funcao chamada `mkcd` que cria um diretorio e entra nele. Use a sintaxe: `mkcd() { mkdir -p $1 && cd $1; }`',
      difficulty: 'medium',
      check: (cmd) => /^mkcd\(\)\s*\{\s*mkdir\s+-p\s+\$1\s*&&\s*cd\s+\$1\s*;\s*\}$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Funcoes usam a sintaxe `nome() { comandos; }`.', 'O comando completo e `mkcd() { mkdir -p $1 && cd $1; }` — `$1` e o primeiro argumento.'],
      feedbackRules: [
        { pattern: /^function\s+mkcd/, message: 'A palavra `function` e opcional no bash. Use `mkcd() { mkdir -p $1 && cd $1; }`.' },
        { pattern: /^mkcd\(\).*mkdir(?!\s+-p)/, message: 'Use `mkdir -p` para criar diretorios pai automaticamente.' },
      ],
      xp: 60,
    },
    {
      id: 'functions-drill-3',
      prompt: 'Exporte uma variavel de ambiente chamada `EDITOR` com o valor `vim`.',
      difficulty: 'easy',
      check: (cmd) => /^export\s+EDITOR=vim$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Use `export` seguido de `NOME=valor`.', 'O comando e `export EDITOR=vim` — sem espacos ao redor do `=`.'],
      feedbackRules: [
        { pattern: /^EDITOR=vim$/, message: 'Isso cria a variavel, mas sem `export` ela nao sera visivel para subprocessos.' },
        { pattern: /^export\s+EDITOR\s*=\s*vim/, message: 'Nao coloque espacos ao redor do `=`. Use `export EDITOR=vim`.' },
      ],
      xp: 60,
    },
    {
      id: 'functions-drill-4',
      prompt: 'Recarregue o arquivo de configuracao `~/.bashrc` sem abrir um novo terminal.',
      difficulty: 'easy',
      check: (cmd) => /^source\s+~\/\.bashrc$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Existe um comando que "le e executa" um arquivo no shell atual...', 'Use `source ~/.bashrc` — isso recarrega todas as configuracoes.'],
      feedbackRules: [
        { pattern: /^bash\s+~\/\.bashrc/, message: '`bash ~/.bashrc` abre um novo subshell. Use `source` para aplicar no shell atual.' },
        { pattern: /^\.\s+~\/\.bashrc/, message: 'O `.` funciona como `source`, mas para este drill use `source ~/.bashrc` explicitamente.' },
      ],
      xp: 60,
    },
    {
      id: 'functions-drill-5',
      prompt: 'Mostre o valor da variavel de ambiente `$PATH` usando o comando `echo`.',
      difficulty: 'easy',
      check: (cmd) => /^echo\s+\$PATH$/.test(cmd.trim()),
      expectedOutput: '/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
      hints: ['Variaveis de ambiente sao acessadas com `$` na frente do nome.', 'Use `echo $PATH` para imprimir o valor da variavel PATH.'],
      feedbackRules: [
        { pattern: /^echo\s+PATH$/, message: 'Sem o `$`, voce imprime a palavra "PATH" literalmente. Use `echo $PATH`.' },
        { pattern: /^\$PATH$/, message: 'Voce precisa do `echo` antes: `echo $PATH`.' },
      ],
      xp: 60,
    },
  ],

  boss: {
    title: 'O Arquiteto do Shell',
    scenario: 'O Arquiteto do Shell precisa de um assistente. Ele quer que voce configure um ambiente de trabalho completo — aliases, funcoes e variaveis — para provar que sabe personalizar o terminal.',
    steps: [
      {
        id: 'boss-functions-1',
        prompt: '> O Arquiteto diz: "Primeiro, crie um alias `ll` para `ls -la`. Todo bom ambiente comeca com isso."',
        check: (cmd) => /^alias\s+ll='ls\s+-la'$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['A sintaxe e `alias nome=\'comando\'`.', "Use `alias ll='ls -la'`."],
        feedbackRules: [
          { pattern: /^alias\s+ll=ls/, message: 'O valor precisa estar entre aspas simples para preservar as flags.' },
        ],
      },
      {
        id: 'boss-functions-2',
        prompt: '> "Agora exporte a variavel `WORKSPACE` com o valor `/home/enzo/projects`."',
        check: (cmd) => /^export\s+WORKSPACE=\/home\/enzo\/projects$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `export` seguido de `NOME=valor`.', 'O comando e `export WORKSPACE=/home/enzo/projects`.'],
        feedbackRules: [
          { pattern: /^WORKSPACE=/, message: 'Sem `export`, a variavel nao sera visivel para outros processos. Adicione `export` no inicio.' },
        ],
      },
      {
        id: 'boss-functions-3',
        prompt: '> "Crie a funcao `mkcd` que cria um diretorio e entra nele: `mkcd() { mkdir -p $1 && cd $1; }`"',
        check: (cmd) => /^mkcd\(\)\s*\{\s*mkdir\s+-p\s+\$1\s*&&\s*cd\s+\$1\s*;\s*\}$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Funcoes usam `nome() { comandos; }`.', 'O comando completo e `mkcd() { mkdir -p $1 && cd $1; }`.'],
        feedbackRules: [
          { pattern: /^mkcd/, message: 'Verifique a sintaxe: `mkcd() { mkdir -p $1 && cd $1; }` — nao esqueca o `;` antes do `}`.' },
        ],
      },
      {
        id: 'boss-functions-4',
        prompt: '> "Por fim, recarregue o `.bashrc` para aplicar tudo. Use `source`."',
        check: (cmd) => /^source\s+~\/\.bashrc$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['O comando `source` le e executa um arquivo no shell atual.', 'Use `source ~/.bashrc`.'],
        feedbackRules: [
          { pattern: /^bash/, message: 'Rodar `bash` abre um novo shell. Use `source` para aplicar no shell atual.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-shell-functions',
  },

  achievements: ['shell-functions-mastery', 'boss-shell-functions'],
};
