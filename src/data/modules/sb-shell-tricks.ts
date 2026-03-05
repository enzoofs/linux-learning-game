import type { Module } from '../../types';

export const sbShellTricksModule: Module = {
  id: 'sb-shell-tricks',
  title: 'Truques do Shell',
  description: 'Atalhos secretos e truques que transformam voce num mago do terminal.',
  tier: 'Initiate',
  prerequisites: ['cli-basics', 'pipes-streams', 'files-nav', 'process-mgmt', 'text-processing', 'data-wrangling'],
  isSideQuest: false,

  briefing: {
    concept:
      `O shell esconde poderes que a maioria dos usuarios nunca descobre. Quem domina esses truques trabalha duas, tres vezes mais rapido — e com muito menos digitacao.\n\n` +
      `Vamos explorar cinco categorias de magia do terminal:\n\n` +
      `• **Historico (!! e !$)** — Reutilize comandos e argumentos anteriores sem redigitar nada.\n` +
      `• **Brace Expansion ({a,b,c})** — Gere multiplas strings de uma vez so, expandindo padroes entre chaves.\n` +
      `• **Globbing (*, ?, [])** — Padroes curinga que casam com nomes de arquivos automaticamente.\n` +
      `• **Atalhos CTRL** — Combinacoes de teclas que controlam o terminal: CTRL+C cancela, CTRL+L limpa, CTRL+R busca no historico.\n` +
      `• **Substituicao de Comando $()** — Capture a saida de um comando e use-a dentro de outro.`,
    analogy:
      'Imagine que o terminal e um grimorio. Cada truque e um feitico que voce memoriza. `!!` e o feitico de repeticao — repete o ultimo encantamento. `$()` e o feitico de invocacao — captura o resultado de um feitico e o injeta em outro. Brace expansion e magia de multiplicacao — uma palavra vira varias.',
    syntax:
      '!!                    # repete o ultimo comando\n!$                    # ultimo argumento do comando anterior\necho {a,b,c}          # brace expansion\nls *.txt              # globbing com curinga\necho $(date)          # substituicao de comando\nCTRL+R                # busca reversa no historico',
    commandBreakdowns: [
      {
        title: 'Expansão de chaves (brace expansion)',
        command: 'cp config.yml{,.bak-$(date +%F)}',
        parts: [
          { text: 'cp', label: 'Copia arquivo' },
          { text: 'config.yml{,.bak-$(date +%F)}', label: 'Expande para DOIS argumentos: config.yml e config.yml.bak-2024-03-15' },
          { text: '{}', label: 'Chaves geram todas as combinações com o prefixo' },
          { text: ',', label: 'Separa as variantes (vazio = original, .bak-... = backup)' },
          { text: '$(date +%F)', label: 'Substituição: insere a data atual no nome do backup' },
        ],
      },
    ],
    examples: [
      { command: 'echo hello', output: 'hello', explanation: 'Comando simples para configurar o historico.' },
      { command: '!!', output: 'hello', explanation: '`!!` repete o ultimo comando executado — neste caso, `echo hello`.' },
      { command: 'cat /etc/hostname', output: 'linux-quest', explanation: 'Lemos um arquivo. O argumento `/etc/hostname` fica salvo como `!$`.' },
      { command: 'echo !$', output: '/etc/hostname', explanation: '`!$` expande para o ultimo argumento do comando anterior.' },
      { command: 'echo {red,green,blue}-pill', output: 'red-pill green-pill blue-pill', explanation: 'Brace expansion gera tres strings de uma vez.' },
      { command: 'echo $(whoami)', output: 'enzo', explanation: '`$(whoami)` executa o comando e substitui pelo resultado.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^echo\s+hello$/, output: 'hello' },
      { pattern: /^!!$/, output: 'hello' },
      { pattern: /^echo\s+!\$$/, output: 'hello' },
      { pattern: /^echo\s+\{.*,.*\}/, output: '(brace expansion aplicada)' },
      { pattern: /^echo\s+\$\(date\)$/, output: 'Ter Mar  4 10:30:00 BRT 2026' },
      { pattern: /^echo\s+\$\(whoami\)$/, output: 'enzo' },
      { pattern: /^ls\s+\*\.txt$/, output: 'notas.txt  readme.txt  todo.txt' },
      { pattern: /^ls\s+\*\.log$/, output: 'app.log  error.log  system.log' },
      { pattern: /^ls\s+\?\?\.txt$/, output: '' },
      { pattern: /^echo\s+\{1\.\.5\}$/, output: '1 2 3 4 5' },
    ],
    contextHints: [
      'Tente `echo hello` e depois `!!` para repetir o comando.',
      'Use `echo {a,b,c}` para ver brace expansion em acao.',
      'Teste `ls *.txt` para listar apenas arquivos .txt.',
      'Experimente `echo $(date)` para ver substituicao de comando.',
      'Tente `echo {1..5}` para gerar uma sequencia numerica.',
    ],
  },

  drills: [
    {
      id: 'tricks-drill-1',
      prompt: 'Voce acabou de rodar um comando longo e precisa repeti-lo. Use o atalho de historico que repete o ultimo comando inteiro.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === '!!',
      expectedOutput: '(repete o ultimo comando)',
      hints: ['Sao apenas dois caracteres identicos...', 'O atalho `!!` (bang bang) repete o ultimo comando executado.'],
      feedbackRules: [
        { pattern: /^!$/, message: 'Um `!` so nao funciona. Voce precisa de dois: `!!`.' },
        { pattern: /^history/, message: '`history` mostra o historico, mas nao repete. Use `!!` para repetir o ultimo comando.' },
      ],
      xp: 60,
    },
    {
      id: 'tricks-drill-2',
      prompt: 'Voce executou `mkdir /tmp/projeto`. Agora quer entrar nesse diretorio usando o atalho que referencia o ultimo argumento do comando anterior.',
      difficulty: 'easy',
      check: (cmd) => /^cd\s+!\$$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['O atalho para o ultimo argumento usa `!` seguido de um simbolo de dinheiro.', 'Use `cd !$` — o `!$` sera expandido para `/tmp/projeto`.'],
      feedbackRules: [
        { pattern: /^cd\s+\/tmp\/projeto/, message: 'Funciona, mas o objetivo e usar o atalho `!$` para nao precisar redigitar o caminho.' },
        { pattern: /^cd\s+!!/, message: '`!!` repete o comando inteiro. Para pegar so o ultimo argumento, use `!$`.' },
      ],
      xp: 60,
    },
    {
      id: 'tricks-drill-3',
      prompt: 'Use brace expansion para criar tres arquivos de uma vez: `file1.txt`, `file2.txt` e `file3.txt` com o comando `touch`.',
      difficulty: 'medium',
      check: (cmd) => /^touch\s+file\{1,2,3\}\.txt$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Brace expansion usa chaves `{}` com itens separados por virgula.', 'O comando e `touch file{1,2,3}.txt` — o shell expande para tres nomes.'],
      feedbackRules: [
        { pattern: /^touch\s+file1\.txt\s+file2\.txt\s+file3\.txt$/, message: 'Funciona, mas voce digitou tudo manualmente! Use brace expansion: `touch file{1,2,3}.txt`.' },
        { pattern: /^touch\s+\{file1,file2,file3\}/, message: 'A expansao deve envolver so a parte que muda. Tente `touch file{1,2,3}.txt`.' },
      ],
      xp: 60,
    },
    {
      id: 'tricks-drill-4',
      prompt: 'Liste apenas os arquivos com extensao `.txt` no diretorio atual usando globbing.',
      difficulty: 'easy',
      check: (cmd) => /^ls\s+\*\.txt$/.test(cmd.trim()),
      expectedOutput: 'notas.txt  readme.txt  todo.txt',
      hints: ['O curinga `*` casa com qualquer sequencia de caracteres.', 'Use `ls *.txt` — o `*` casa com qualquer nome, e `.txt` filtra a extensao.'],
      feedbackRules: [
        { pattern: /^ls$/, message: '`ls` sozinho mostra tudo. Adicione o padrao `*.txt` para filtrar.' },
        { pattern: /^find/, message: '`find` funciona, mas para este drill use globbing com `ls *.txt`.' },
      ],
      xp: 60,
    },
    {
      id: 'tricks-drill-5',
      prompt: 'Crie um diretorio cujo nome inclua a data de hoje usando substituicao de comando. Use: `mkdir backup-$(date +%F)`',
      difficulty: 'medium',
      check: (cmd) => /^mkdir\s+backup-\$\(date\s*\+%F\)$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['`$()` executa o comando dentro e substitui pelo resultado.', 'O comando completo e `mkdir backup-$(date +%F)` — o `%F` formata a data como YYYY-MM-DD.'],
      feedbackRules: [
        { pattern: /^mkdir\s+backup-date/, message: 'Voce escreveu a palavra "date" literalmente. Envolva em `$()` para executar o comando.' },
        { pattern: /^mkdir\s+\$\(date\)/, message: 'Quase! Mas o nome ficara so a data. Use `mkdir backup-$(date +%F)` para prefixar com "backup-".' },
      ],
      xp: 60,
    },
  ],

  boss: {
    title: 'O Mago dos Atalhos',
    scenario: 'Voce encontrou o laboratorio de um mago do terminal. Para provar que e digno, ele exige que voce resolva tarefas usando apenas truques e atalhos — nada de digitar tudo na mao!',
    steps: [
      {
        id: 'boss-tricks-1',
        prompt: '> O mago diz: "Crie os diretorios `spells`, `potions` e `scrolls` com um unico comando usando brace expansion."',
        check: (cmd) => /^mkdir\s+\{spells,potions,scrolls\}$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use chaves para agrupar os nomes: `{a,b,c}`.', 'O comando e `mkdir {spells,potions,scrolls}`.'],
        feedbackRules: [
          { pattern: /^mkdir\s+spells\s+potions\s+scrolls/, message: 'Funciona, mas o mago quer ver brace expansion! Use `mkdir {spells,potions,scrolls}`.' },
        ],
      },
      {
        id: 'boss-tricks-2',
        prompt: '> "Agora liste apenas os arquivos `.spell` usando globbing."',
        check: (cmd) => /^ls\s+\*\.spell$/.test(cmd.trim()),
        expectedOutput: 'fire.spell  ice.spell  lightning.spell',
        hints: ['Use o curinga `*` para casar qualquer nome antes da extensao.', '`ls *.spell` lista todos os arquivos que terminam em `.spell`.'],
        feedbackRules: [
          { pattern: /^ls$/, message: 'Sem filtro, voce ve tudo. Use `ls *.spell` para filtrar.' },
        ],
      },
      {
        id: 'boss-tricks-3',
        prompt: '> "Repita o ultimo comando, mas desta vez use o atalho magico de repeticao."',
        check: (cmd) => cmd.trim() === '!!',
        expectedOutput: 'fire.spell  ice.spell  lightning.spell',
        hints: ['O atalho de repeticao sao dois caracteres de exclamacao.', 'Digite `!!` para repetir o ultimo comando.'],
        feedbackRules: [
          { pattern: /^ls\s+\*\.spell$/, message: 'Voce digitou tudo de novo! O mago quer que use `!!`.' },
        ],
      },
      {
        id: 'boss-tricks-4',
        prompt: '> "Por fim, crie um grimorio com a data de hoje: `grimorio-$(date +%F).txt` usando substituicao de comando."',
        check: (cmd) => /^touch\s+grimorio-\$\(date\s*\+%F\)\.txt$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `$()` para capturar a saida do comando `date`.', 'O comando completo e `touch grimorio-$(date +%F).txt`.'],
        feedbackRules: [
          { pattern: /^touch\s+grimorio-/, message: 'Lembre-se de usar `$(date +%F)` para inserir a data dinamicamente.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-shell-tricks',
  },

  achievements: ['shell-tricks-mastery', 'boss-shell-tricks'],
};
