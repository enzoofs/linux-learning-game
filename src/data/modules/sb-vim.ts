import type { Module } from '../../types';

export const sbVimModule: Module = {
  id: 'sb-vim',
  title: 'Vim Mastery',
  description: 'O editor que vive no terminal — domine seus modos e atalhos.',
  tier: 'Adept',
  prerequisites: ['sb-shell-functions'],
  isSideQuest: false,

  briefing: {
    concept:
      `O Vim e um dos editores de texto mais poderosos do mundo Unix. Ele esta instalado em praticamente todo servidor Linux e, uma vez dominado, permite editar texto na velocidade do pensamento.\n\n` +
      `O segredo do Vim sao seus **modos**:\n` +
      `• **Normal** — O modo padrao. Voce navega e manipula texto com teclas. Nao digita texto diretamente.\n` +
      `• **Insert** — Modo de insercao. Voce digita texto normalmente. Entre com \`i\`, saia com \`Esc\`.\n` +
      `• **Visual** — Seleciona blocos de texto. Entre com \`v\`.\n` +
      `• **Command** — Executa comandos com \`:\`. Ex: \`:w\` salva, \`:q\` sai.\n\n` +
      `Navegacao essencial no modo Normal:\n` +
      `• \`h j k l\` — esquerda, baixo, cima, direita\n` +
      `• \`w / b\` — pula para a proxima / anterior palavra\n` +
      `• \`gg / G\` — vai para o inicio / fim do arquivo\n\n` +
      `Edicao no modo Normal:\n` +
      `• \`dd\` — deleta a linha inteira | \`yy\` — copia a linha | \`p\` — cola\n` +
      `• \`u\` — desfaz | \`x\` — deleta o caractere sob o cursor\n\n` +
      `Busca e substituicao:\n` +
      `• \`/padrao\` — busca para frente | \`:%s/antigo/novo/g\` — substitui em todo o arquivo`,
    analogy:
      'O Vim e como um instrumento musical: no inicio parece impossivel, mas cada tecla e uma nota. O modo Normal e quando voce posiciona os dedos. O modo Insert e quando voce toca. Com pratica, voce compoe sinfonias de texto sem tirar as maos do teclado.',
    syntax:
      'vim arquivo\ni (insert) | Esc (normal) | v (visual)\n:w (salvar) | :q (sair) | :wq (salvar e sair) | :q! (sair sem salvar)\ndd (deletar linha) | yy (copiar) | p (colar) | u (desfazer)\n/padrao (buscar) | :%s/old/new/g (substituir tudo)',
    commandBreakdowns: [
      {
        title: 'Busca e substituição no Vim',
        command: ':%s/http/https/g',
        parts: [
          { text: ':', label: 'Entra no modo Comando (executa comandos ex)' },
          { text: '%', label: 'Escopo: todas as linhas do arquivo (sem %, só a linha atual)' },
          { text: 's', label: 'Comando de substituição (substitute)' },
          { text: '/http/', label: 'O padrão a buscar' },
          { text: '/https/', label: 'O texto de substituição' },
          { text: 'g', label: 'Flag global — substitui todas as ocorrências na linha (sem g, só a primeira)' },
        ],
      },
      {
        title: 'Combinando movimentos no Vim',
        command: 'd3w',
        parts: [
          { text: 'd', label: 'Operador: delete (deletar). Outros: y (copiar), c (mudar)' },
          { text: '3', label: 'Multiplicador: repete o movimento 3 vezes' },
          { text: 'w', label: 'Movimento: word (próxima palavra). Resultado: deleta as 3 próximas palavras' },
        ],
      },
    ],
    examples: [
      { command: 'vim config.yml', output: '(abre o arquivo no Vim)', explanation: 'Abre o arquivo config.yml no editor Vim.' },
      { command: 'i', output: '-- INSERT --', explanation: 'Entra no modo de insercao. Agora voce pode digitar texto normalmente.' },
      { command: 'dd', output: '(linha deletada)', explanation: 'No modo Normal, deleta a linha inteira onde o cursor esta.' },
      { command: '/error', output: '/error', explanation: 'Busca a palavra "error" no arquivo. Use `n` para ir para a proxima ocorrencia.' },
      { command: ':%s/http/https/g', output: '5 substituicoes em 3 linhas', explanation: 'Substitui todas as ocorrencias de "http" por "https" no arquivo inteiro.' },
      { command: ':wq', output: '(arquivo salvo e Vim fechado)', explanation: 'Salva o arquivo e sai do Vim. O atalho equivalente e `ZZ`.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^vim\s+\w+/, output: '(abrindo arquivo no Vim...)' },
      { pattern: /^i$/, output: '-- INSERT --' },
      { pattern: /^Esc$/, output: '(modo Normal)' },
      { pattern: /^dd$/, output: '(linha deletada)' },
      { pattern: /^yy$/, output: '(linha copiada)' },
      { pattern: /^p$/, output: '(texto colado)' },
      { pattern: /^u$/, output: '(acao desfeita)' },
      { pattern: /^\/\w+/, output: '(buscando...)' },
      { pattern: /^:%s\/.*\/.*\/g$/, output: 'substituicoes realizadas' },
      { pattern: /^:wq?!?$/, output: '(Vim fechado)' },
    ],
    contextHints: [
      'Tente `vim config.yml` para abrir um arquivo.',
      'Pressione `i` para entrar no modo Insert e poder digitar.',
      'No modo Normal, use `dd` para deletar uma linha inteira.',
      'Use `/palavra` para buscar texto dentro do arquivo.',
      'Para salvar e sair, digite `:wq` no modo Command.',
    ],
  },

  drills: [
    {
      id: 'vim-drill-1',
      prompt: 'Voce esta no modo Normal do Vim. Entre no modo de insercao para comecar a digitar.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'i',
      expectedOutput: '-- INSERT --',
      hints: [
        'Existe uma tecla unica que ativa o modo de insercao no Vim.',
        'A tecla e `i` (de "insert").',
      ],
      feedbackRules: [
        { pattern: /^a$/, message: '`a` tambem entra no modo Insert, mas apos o cursor. O padrao classico e `i` (antes do cursor).' },
        { pattern: /^insert/i, message: 'No Vim, nao digitamos a palavra "insert". A tecla e simplesmente `i`.' },
      ],
      xp: 70,
    },
    {
      id: 'vim-drill-2',
      prompt: 'No modo Normal, delete a linha inteira onde o cursor esta.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'dd',
      expectedOutput: '(linha deletada)',
      hints: [
        'O comando para deletar uma linha no Vim usa a mesma tecla duas vezes.',
        'A tecla e `d` — e `dd` deleta a linha inteira.',
      ],
      feedbackRules: [
        { pattern: /^d$/, message: 'Um unico `d` espera um movimento (ex: `dw` deleta uma palavra). Para a linha inteira, use `dd`.' },
        { pattern: /^x$/, message: '`x` deleta apenas o caractere sob o cursor. Para a linha inteira, use `dd`.' },
      ],
      xp: 70,
    },
    {
      id: 'vim-drill-3',
      prompt: 'Busque a palavra "TODO" no arquivo atual usando a busca do Vim.',
      difficulty: 'medium',
      check: (cmd) => /^\/TODO$/.test(cmd.trim()),
      expectedOutput: '/TODO',
      hints: [
        'No modo Normal, a busca comeca com um caractere especial seguido do termo.',
        'Use `/TODO` — a barra inicia a busca para frente.',
      ],
      feedbackRules: [
        { pattern: /^grep/i, message: 'Voce esta dentro do Vim! A busca interna usa `/padrao`, nao `grep`.' },
        { pattern: /^\?TODO/, message: '`?` busca para tras. O padrao e usar `/` para buscar para frente.' },
      ],
      xp: 70,
    },
    {
      id: 'vim-drill-4',
      prompt: 'Substitua todas as ocorrencias de "foo" por "bar" no arquivo inteiro.',
      difficulty: 'hard',
      check: (cmd) => /^:%s\/foo\/bar\/g$/.test(cmd.trim()),
      expectedOutput: '8 substituicoes em 5 linhas',
      hints: [
        'O comando de substituicao no Vim segue o formato `:%s/antigo/novo/g`.',
        'O `%` significa "arquivo inteiro" e o `g` significa "todas as ocorrencias na linha".',
      ],
      feedbackRules: [
        { pattern: /^:s\//, message: 'Sem `%`, voce substitui apenas na linha atual. Use `:%s/foo/bar/g` para o arquivo inteiro.' },
        { pattern: /^:%s\/foo\/bar$/, message: 'Quase! Sem o `g` no final, apenas a primeira ocorrencia de cada linha sera substituida.' },
        { pattern: /^sed\s/, message: 'Voce esta dentro do Vim! Use o comando interno `:%s/foo/bar/g`.' },
      ],
      xp: 70,
    },
    {
      id: 'vim-drill-5',
      prompt: 'Salve o arquivo e saia do Vim.',
      difficulty: 'easy',
      check: (cmd) => /^:wq$/.test(cmd.trim()),
      expectedOutput: '(arquivo salvo e Vim fechado)',
      hints: [
        'Existe um comando no modo Command que combina "write" e "quit".',
        'Use `:wq` — `:w` salva e `:q` sai.',
      ],
      feedbackRules: [
        { pattern: /^:w$/, message: '`:w` salva mas nao sai. Combine com `:q` usando `:wq`.' },
        { pattern: /^:q!$/, message: '`:q!` sai sem salvar! Para salvar e sair, use `:wq`.' },
      ],
      xp: 70,
    },
  ],

  boss: {
    title: 'O Mestre do Editor',
    scenario: 'Voce precisa editar um arquivo de configuracao critico do servidor. O arquivo tem erros que precisam ser corrigidos usando o Vim — sem editor grafico disponivel!',
    steps: [
      {
        id: 'boss-vim-1',
        prompt: '> Abra o arquivo de configuracao `nginx.conf` no Vim.',
        check: (cmd) => /^vim\s+nginx\.conf$/.test(cmd.trim()),
        expectedOutput: '(abrindo nginx.conf no Vim...)',
        hints: [
          'Para abrir um arquivo no Vim, use `vim` seguido do nome do arquivo.',
          'O comando e `vim nginx.conf`.',
        ],
        feedbackRules: [
          { pattern: /^nano\s/, message: 'Nano e outro editor, mas este desafio exige o Vim! Use `vim nginx.conf`.' },
        ],
      },
      {
        id: 'boss-vim-2',
        prompt: '> O arquivo tem a porta errada. Busque a palavra "listen" para encontrar a linha de configuracao da porta.',
        check: (cmd) => /^\/listen$/.test(cmd.trim()),
        expectedOutput: '  listen 8080;',
        hints: [
          'Use a busca do Vim para encontrar o texto.',
          'Digite `/listen` no modo Normal.',
        ],
        feedbackRules: [
          { pattern: /^:\/listen/, message: 'A busca nao precisa de `:` antes. Use apenas `/listen`.' },
        ],
      },
      {
        id: 'boss-vim-3',
        prompt: '> Agora substitua todas as ocorrencias de "8080" por "443" no arquivo inteiro.',
        check: (cmd) => /^:%s\/8080\/443\/g$/.test(cmd.trim()),
        expectedOutput: '3 substituicoes em 2 linhas',
        hints: [
          'Use o comando de substituicao global do Vim.',
          'O formato e `:%s/8080/443/g`.',
        ],
        feedbackRules: [
          { pattern: /^:%s\/8080\/443$/, message: 'Sem o `g`, apenas a primeira ocorrencia de cada linha sera alterada. Adicione `/g` no final.' },
        ],
      },
      {
        id: 'boss-vim-4',
        prompt: '> Perfeito! Agora salve as alteracoes e saia do Vim.',
        check: (cmd) => /^:wq$/.test(cmd.trim()),
        expectedOutput: '"nginx.conf" escrito, 42 linhas',
        hints: [
          'Combine o comando de salvar com o de sair.',
          'Use `:wq` para salvar (write) e sair (quit).',
        ],
        feedbackRules: [
          { pattern: /^:q!/, message: 'Cuidado! `:q!` descarta suas alteracoes. Use `:wq` para salvar e sair.' },
        ],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-vim-master',
  },

  achievements: ['vim-basics', 'boss-vim-master'],
};
