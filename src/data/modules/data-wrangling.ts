import type { Module } from '../../types';

export const dataWranglingModule: Module = {
  id: 'data-wrangling',
  title: 'Manipulação de Dados',
  description: 'Transforme, ordene e analise dados estruturados com awk, cut, sort e uniq.',
  tier: 'Specialist',
  prerequisites: ['pipes-streams'],
  isSideQuest: false,

  briefing: {
    concept:
      `Dados do mundo real são bagunçados. Arquivos de log, CSVs, exports de banco de dados — todos precisam de limpeza, ordenação e resumo. O Linux te dá um kit de ferramentas para manipular dados direto da linha de comando.\n\n` +
      `**Ordenando e deduplicando:**\n` +
      `• **sort** — Ordena linhas alfabeticamente. Adicione \`-n\` para ordenação numérica, \`-r\` para reverso.\n` +
      `• **uniq** — Remove linhas duplicadas *adjacentes* (por isso você quase sempre faz \`sort\` antes). Adicione \`-c\` para contar ocorrências.\n\n` +
      `**Extraindo colunas:**\n` +
      `• **cut** — Extrai colunas específicas de texto estruturado. Use \`-d\` para definir o delimitador e \`-f\` para escolher números de campo.\n` +
      `• **awk** — Uma linguagem poderosa de processamento de padrões. No mais simples, extrai e computa colunas: \`awk '{print $2}'\` imprime a 2a coluna.\n\n` +
      `**Transformando caracteres:**\n` +
      `• **tr** — Traduz ou deleta caracteres. Ótimo para mudar delimitadores, converter maiúsculas/minúsculas ou remover caracteres indesejados.\n\n` +
      `**Padrões comuns:**\n` +
      `• \`sort file | uniq\` — Ordena e depois deduplica.\n` +
      `• \`sort file | uniq -c | sort -rn\` — Conta ocorrências, mostra os mais frequentes primeiro.\n` +
      `• \`cut -d',' -f2 data.csv\` — Extrai a 2a coluna de um CSV.\n` +
      `• \`awk -F',' '{sum += $3} END {print sum}' data.csv\` — Soma uma coluna numérica.`,
    analogy:
      'Pense nos seus dados como uma planilha. `cut` seleciona colunas, `sort` ordena linhas, `uniq` remove duplicatas, e `awk` é o motor de fórmulas que pode fazer qualquer coisa. `tr` é como buscar-e-substituir para caracteres individuais — trocando cada vírgula por tab, ou cada letra minúscula por maiúscula.',
    syntax:
      'sort [options] file          # sort lines\n  -n                          # numeric sort (10 after 9, not after 1)\n  -r                          # reverse order\n  -k N                        # sort by column N\nuniq [options]                # remove adjacent duplicates\n  -c                          # prefix lines with occurrence count\ncut -d DELIM -f FIELDS file   # extract columns\n  -d\',\'                       # use comma as delimiter\n  -f3                         # extract field 3\n  -f1,3                       # extract fields 1 and 3\nawk \'pattern {action}\' file   # pattern scanning and processing\n  -F\',\'                       # set field separator to comma\n  {print $2}                  # print 2nd column\n  {sum += $3} END {print sum} # sum a column\ntr SET1 SET2                  # translate characters\n  tr \',\' \'\\t\'                 # commas to tabs\n  tr \'[:lower:]\' \'[:upper:]\'  # lowercase to uppercase',
    examples: [
      { command: 'sort names.txt', output: 'Alice\nBob\nCharlie\nDiana\nEve', explanation: 'Ordena linhas alfabeticamente (A-Z). Esse é o comportamento padrão.' },
      { command: 'sort names.txt | uniq', output: 'Alice\nBob\nCharlie\nDiana\nEve', explanation: 'Ordena e depois remove linhas duplicadas. `uniq` só remove duplicatas *adjacentes*, então sempre ordene antes.' },
      { command: 'sort names.txt | uniq -c | sort -rn', output: '      3 Bob\n      2 Alice\n      2 Eve\n      1 Charlie\n      1 Diana', explanation: 'A clássica contagem de frequência: ordena, conta duplicatas, depois ordena numericamente em reverso para ver os mais comuns primeiro.' },
      { command: "cut -d',' -f3 data.csv", output: '29.99\n49.99\n9.99\n79.99\n19.99', explanation: 'Extrai o 3o campo de um arquivo separado por vírgulas. `-d\',\'` define vírgula como delimitador, `-f3` pega o campo 3.' },
      { command: "awk -F',' '{ sum += $3 } END { print sum }' data.csv", output: '189.95', explanation: 'Define vírgula como separador de campo, acumula a 3a coluna em `sum` e depois imprime o total no final.' },
      { command: "awk -F',' '{ print $1, $3 }' data.csv", output: 'Widget 29.99\nGadget 49.99\nPlug 9.99\nScreen 79.99\nCable 19.99', explanation: 'Imprime a 1a e 3a colunas do CSV. `awk` divide automaticamente cada linha em campos.' },
      { command: "echo 'hello world' | tr '[:lower:]' '[:upper:]'", output: 'HELLO WORLD', explanation: 'Converte cada caractere minúsculo para maiúsculo.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^cat\s+names\.txt$/, output: 'Eve\nBob\nAlice\nBob\nCharlie\nAlice\nDiana\nBob\nEve\nDiana', description: 'View names.txt (unsorted, with duplicates)' },
      { pattern: /^cat\s+data\.csv$/, output: 'Widget,Electronics,29.99\nGadget,Electronics,49.99\nPlug,Hardware,9.99\nScreen,Electronics,79.99\nCable,Hardware,19.99\nWidget,Electronics,29.99\nPlug,Hardware,9.99\nGadget,Electronics,49.99\nScreen,Electronics,79.99\nCable,Hardware,19.99', description: 'View data.csv' },
      { pattern: /^cat\s+sales\.txt$/, output: 'Widget\nGadget\nWidget\nPlug\nScreen\nWidget\nGadget\nCable\nWidget\nPlug\nScreen\nGadget\nWidget\nCable\nGadget', description: 'View sales.txt' },
      { pattern: /^sort\s+names\.txt$/, output: 'Alice\nAlice\nBob\nBob\nBob\nCharlie\nDiana\nDiana\nEve\nEve', description: 'Sort names alphabetically' },
      { pattern: /^sort\s+names\.txt\s*\|\s*uniq$/, output: 'Alice\nBob\nCharlie\nDiana\nEve', description: 'Sort and remove duplicates' },
      { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c$/, output: '      2 Alice\n      3 Bob\n      1 Charlie\n      2 Diana\n      2 Eve', description: 'Sort and count duplicates' },
      { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/, output: '      3 Bob\n      2 Alice\n      2 Diana\n      2 Eve\n      1 Charlie', description: 'Frequency count, most common first' },
      { pattern: /^sort\s+sales\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/, output: '      5 Widget\n      4 Gadget\n      2 Cable\n      2 Plug\n      2 Screen', description: 'Sales frequency count' },
      { pattern: /^sort\s+sales\.txt$/, output: 'Cable\nCable\nGadget\nGadget\nGadget\nGadget\nPlug\nPlug\nScreen\nScreen\nWidget\nWidget\nWidget\nWidget\nWidget', description: 'Sort sales alphabetically' },
      { pattern: /^sort\s+sales\.txt\s*\|\s*uniq$/, output: 'Cable\nGadget\nPlug\nScreen\nWidget', description: 'Unique product names' },
      { pattern: /^cut\s+-d['"],?['"]\s+-f\d+\s+data\.csv$/, output: '(extracted column)', description: 'Extract a column from CSV' },
      { pattern: /^cut\s+-d['"]?,?['"]\s+-f1\s+data\.csv$/, output: 'Widget\nGadget\nPlug\nScreen\nCable\nWidget\nPlug\nGadget\nScreen\nCable', description: 'Extract product names (column 1)' },
      { pattern: /^cut\s+-d['"]?,?['"]\s+-f2\s+data\.csv$/, output: 'Electronics\nElectronics\nHardware\nElectronics\nHardware\nElectronics\nHardware\nElectronics\nElectronics\nHardware', description: 'Extract categories (column 2)' },
      { pattern: /^cut\s+-d['"]?,?['"]\s+-f3\s+data\.csv$/, output: '29.99\n49.99\n9.99\n79.99\n19.99\n29.99\n9.99\n49.99\n79.99\n19.99', description: 'Extract prices (column 3)' },
      { pattern: /^awk\s+-F['"]?,?['"]\s+['"]\{\s*sum\s*\+=\s*\$3\s*\}\s*END\s*\{\s*print\s+sum\s*\}['"]\s+data\.csv$/, output: '377.90', description: 'Sum prices with awk' },
      { pattern: /^awk\s+-F['"]?,?['"]\s+['"]\{\s*print\s+\$1[,\s]+\$3\s*\}['"]\s+data\.csv$/, output: 'Widget 29.99\nGadget 49.99\nPlug 9.99\nScreen 79.99\nCable 19.99\nWidget 29.99\nPlug 9.99\nGadget 49.99\nScreen 79.99\nCable 19.99', description: 'Print columns 1 and 3' },
      { pattern: /^echo\s+['"].*['"]\s*\|\s*tr\s+/, output: '(transformed text)', description: 'Transform text with tr' },
      { pattern: /^sort\s+-r\s+names\.txt$/, output: 'Eve\nEve\nDiana\nDiana\nCharlie\nBob\nBob\nBob\nAlice\nAlice', description: 'Reverse sort names' },
      { pattern: /^sort\s+-n\s+/, output: '(numerically sorted output)', description: 'Numeric sort' },
      { pattern: /^ls$/, output: 'data.csv  names.txt  sales.txt', description: 'List files' },
    ],
    contextHints: [
      'Tente `sort names.txt` para ordenar os nomes alfabeticamente.',
      'Use `sort names.txt | uniq` para remover duplicatas após a ordenação.',
      'Conte duplicatas com `sort names.txt | uniq -c`.',
      'Obtenha um ranking de frequência: `sort names.txt | uniq -c | sort -rn`.',
      'Extraia uma coluna do CSV: `cut -d\',\' -f3 data.csv` (pega os preços).',
      'Some uma coluna com awk: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.',
      'Veja os dados brutos primeiro: `cat names.txt`, `cat data.csv`, `cat sales.txt`.',
      'Transforme caracteres com `tr`: tente `echo \'hello\' | tr \'[:lower:]\' \'[:upper:]\'`.',
    ],
  },

  drills: [
    {
      id: 'data-drill-1',
      prompt: 'Ordene o arquivo names.txt em ordem alfabética.',
      difficulty: 'easy',
      check: (cmd) => /^sort\s+names\.txt$/.test(cmd.trim()),
      expectedOutput: 'Alice\nAlice\nBob\nBob\nBob\nCharlie\nDiana\nDiana\nEve\nEve',
      hints: [
        'O comando para ordenar texto é... `sort`! Basta dar o nome do arquivo.',
        'Tente: `sort names.txt`',
      ],
      feedbackRules: [
        { pattern: /^cat\s+names\.txt$/, message: '`cat` mostra o arquivo como está. Use `sort names.txt` para exibi-lo em ordem alfabética.' },
        { pattern: /^sort\s+-r\s+names\.txt$/, message: '`-r` ordena em reverso (Z-A). Para ordem alfabética normal (A-Z), use apenas `sort names.txt`.' },
        { pattern: /^sort\s+-n\s+names\.txt$/, message: '`-n` é para ordenação numérica. Para nomes em ordem alfabética, `sort names.txt` é o que você precisa.' },
        { pattern: /^sort$/, message: 'Você precisa dizer ao `sort` qual arquivo ordenar: `sort names.txt`.' },
        { pattern: /^ls\s/, message: '`ls` lista arquivos. Para ordenar o *conteúdo* de um arquivo, use `sort names.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'data-drill-2',
      prompt: 'Ordene names.txt e depois remova todas as linhas duplicadas. Use um pipe para conectar os dois comandos.',
      difficulty: 'easy',
      check: (cmd) => /^sort\s+names\.txt\s*\|\s*uniq$/.test(cmd.trim()),
      expectedOutput: 'Alice\nBob\nCharlie\nDiana\nEve',
      hints: [
        '`uniq` remove linhas duplicadas, mas elas precisam ser adjacentes. O que você deve fazer primeiro?',
        'Ordene primeiro, depois passe por pipe para uniq: `sort names.txt | uniq`.',
      ],
      feedbackRules: [
        { pattern: /^uniq\s+names\.txt$/, message: '`uniq` só remove duplicatas *adjacentes*. O arquivo não está ordenado, então vai perder algumas! Ordene primeiro: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+names\.txt$/, message: 'Bom começo — isso ordena! Agora passe a saída por pipe para `uniq` para remover duplicatas: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+-u\s+names\.txt$/, message: '`sort -u` funciona na prática! Mas este drill pede para praticar pipes — use `sort names.txt | uniq`.' },
        { pattern: /^cat\s+names\.txt\s*\|\s*sort\s*\|\s*uniq$/, message: 'Funciona, mas `sort` lê arquivos diretamente. Mais simples: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c$/, message: 'Perto! `-c` adiciona contagens. Para apenas remover duplicatas, use `sort names.txt | uniq` (sem flags).' },
      ],
      xp: 50,
    },
    {
      id: 'data-drill-3',
      prompt: 'Extraia apenas a 3a coluna (preços) do arquivo separado por vírgulas data.csv.',
      difficulty: 'medium',
      check: (cmd) => /^cut\s+-d['"],['"]?\s+-f3\s+data\.csv$/.test(cmd.trim()),
      expectedOutput: '29.99\n49.99\n9.99\n79.99\n19.99\n29.99\n9.99\n49.99\n79.99\n19.99',
      hints: [
        'Use `cut` com duas flags: `-d` define o delimitador (vírgula) e `-f` escolhe o número do campo.',
        'O comando é: `cut -d\',\' -f3 data.csv`.',
      ],
      feedbackRules: [
        { pattern: /^cut\s+-f3\s+data\.csv$/, message: 'Por padrão, `cut` usa tabs como delimitadores. Para um CSV, especifique vírgula: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cut\s+-d['"],['"]?\s+-f\d+$/, message: 'Você precisa especificar o arquivo: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^awk\s/, message: '`awk` funciona também, mas este drill pede para usar `cut`. Tente `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cut\s+-d\s+,/, message: 'O delimitador precisa estar entre aspas e junto ao `-d`: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cat\s+data\.csv$/, message: 'Isso mostra o arquivo inteiro. Use `cut -d\',\' -f3 data.csv` para extrair apenas a coluna de preços.' },
        { pattern: /^cut\s+-d['"],['"]?\s+-f2\s+data\.csv$/, message: 'Isso extrai a coluna 2 (categorias). Você quer a coluna 3 (preços): `cut -d\',\' -f3 data.csv`.' },
      ],
      xp: 75,
    },
    {
      id: 'data-drill-4',
      prompt: 'Gere um ranking de frequência: ordene names.txt, conte quantas vezes cada nome aparece e depois mostre os nomes mais frequentes primeiro.',
      difficulty: 'hard',
      check: (cmd) => /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
      expectedOutput: '      3 Bob\n      2 Alice\n      2 Diana\n      2 Eve\n      1 Charlie',
      hints: [
        'Este é um pipeline de 3 comandos: ordenar | contar duplicatas | ordenar por contagem.',
        'Passo 1: `sort names.txt`. Passo 2: pipe para `uniq -c` (contar). Passo 3: pipe para `sort -rn` (numérico reverso).',
        'Comando completo: `sort names.txt | uniq -c | sort -rn`.',
      ],
      feedbackRules: [
        { pattern: /^sort\s+names\.txt$/, message: 'Bom começo! Agora passe por pipe para `uniq -c` para contar, depois para `sort -rn` para ranquear: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq$/, message: 'Isso remove duplicatas mas não conta. Adicione `-c` ao `uniq` e depois ordene por contagem: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c$/, message: 'Quase! Você tem as contagens. Agora passe por pipe para `sort -rn` para mostrar os mais frequentes primeiro: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-n$/, message: 'Perto! `-n` ordena numericamente (menor primeiro). Adicione `-r` para inverter: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-r$/, message: 'Quase! `-r` sozinho ordena alfabeticamente em reverso. Adicione `-n` para numérico: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^uniq\s+-c\s+names\.txt\s*\|\s*sort\s+-rn$/, message: 'Lembre: `uniq` precisa de entrada ordenada para funcionar corretamente! Ordene primeiro: `sort names.txt | uniq -c | sort -rn`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'O Detetive de Dados',
    scenario: 'Os dados de vendas da empresa estão uma bagunça. O chefe quer um relatório rápido: quais produtos estão vendendo mais, quais são os preços e qual é a receita total. Transforme os dados brutos em respostas!',
    steps: [
      {
        id: 'boss-data-1',
        prompt: '> O time de vendas despejou nomes de produtos em sales.txt com toneladas de duplicatas. Ordene, conte quantas vezes cada produto aparece e mostre os mais vendidos primeiro.',
        check: (cmd) => /^sort\s+sales\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
        expectedOutput: '      5 Widget\n      4 Gadget\n      2 Cable\n      2 Plug\n      2 Screen',
        hints: [
          'Este é o clássico padrão de contagem de frequência: `sort | uniq -c | sort -rn`.',
          'São 3 passos em um pipeline: primeiro ordene o arquivo, depois conte as duplicatas com `uniq -c`, e por fim ordene numericamente em ordem decrescente.',
        ],
        feedbackRules: [
          { pattern: /^cat\s+sales\.txt$/, message: 'Isso mostra a lista bruta. Para uma contagem de frequência ranqueada: `sort sales.txt | uniq -c | sort -rn`.' },
          { pattern: /^sort\s+sales\.txt$/, message: 'Bom começo! Agora passe por pipe para `uniq -c | sort -rn` para contar e ranquear.' },
          { pattern: /^sort\s+sales\.txt\s*\|\s*uniq$/, message: 'Adicione `-c` para contar ocorrências, depois pipe para `sort -rn`: `sort sales.txt | uniq -c | sort -rn`.' },
        ],
      },
      {
        id: 'boss-data-2',
        prompt: '> Widget é o mais vendido! Agora extraia a coluna de preços (coluna 3) do data.csv detalhado para ver a precificação.',
        check: (cmd) => /^cut\s+-d['"],['"]?\s+-f3\s+data\.csv$/.test(cmd.trim()),
        expectedOutput: '29.99\n49.99\n9.99\n79.99\n19.99\n29.99\n9.99\n49.99\n79.99\n19.99',
        hints: [
          'Use `cut` com vírgula como delimitador para extrair o 3o campo: `cut -d\',\' -f3 data.csv`.',
          'O `cut` precisa de duas flags: `-d` para definir o separador de colunas (vírgula) e `-f` para indicar qual campo extrair (o terceiro).',
        ],
        feedbackRules: [
          { pattern: /^cat\s+data\.csv$/, message: 'Isso mostra todas as colunas. Use `cut -d\',\' -f3 data.csv` para extrair apenas os preços.' },
          { pattern: /^awk\s/, message: 'awk funciona também! Mas tente `cut -d\',\' -f3 data.csv` para este passo.' },
        ],
      },
      {
        id: 'boss-data-3',
        prompt: '> Último passo: calcule a receita total. Use awk para somar todos os valores na coluna 3 do data.csv.',
        check: (cmd) => /^awk\s+-F['"],['"]?\s+['"]\{\s*sum\s*\+=\s*\$3\s*\}\s*END\s*\{\s*print\s+sum\s*\}['"]\s+data\.csv$/.test(cmd.trim()),
        expectedOutput: '377.90',
        hints: [
          'Use `awk` com `-F\',\'` para definir vírgula como delimitador, depois acumule `$3` e imprima no final.',
          'O comando é: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.',
        ],
        feedbackRules: [
          { pattern: /^cut\s/, message: '`cut` extrai colunas mas não faz cálculos. Use `awk` para somar: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
          { pattern: /^awk\s+['"]\{\s*print\s+\$3\s*\}['"]\s+data\.csv$/, message: 'Isso imprime a coluna, mas não soma. Use: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
          { pattern: /^awk\s+['"]\{/, message: 'Não esqueça de definir o separador de campo! CSV usa vírgulas: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-data-detective',
  },

  achievements: ['data-wrangler', 'boss-data-detective'],
};
