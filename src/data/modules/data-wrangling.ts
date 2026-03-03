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
        'The command to sort text is... `sort`! Just give it a filename.',
        'Try: `sort names.txt`',
      ],
      feedbackRules: [
        { pattern: /^cat\s+names\.txt$/, message: '`cat` shows the file as-is. Use `sort names.txt` to display it in alphabetical order.' },
        { pattern: /^sort\s+-r\s+names\.txt$/, message: '`-r` sorts in reverse (Z-A). For normal alphabetical (A-Z), just use `sort names.txt`.' },
        { pattern: /^sort\s+-n\s+names\.txt$/, message: '`-n` is for numeric sorting. For alphabetical names, plain `sort names.txt` is what you need.' },
        { pattern: /^sort$/, message: 'You need to tell `sort` which file to sort: `sort names.txt`.' },
        { pattern: /^ls\s/, message: '`ls` lists files. To sort the *contents* of a file, use `sort names.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'data-drill-2',
      prompt: 'Sort names.txt and then remove all duplicate lines. Use a pipe to connect the two commands.',
      difficulty: 'easy',
      check: (cmd) => /^sort\s+names\.txt\s*\|\s*uniq$/.test(cmd.trim()),
      expectedOutput: 'Alice\nBob\nCharlie\nDiana\nEve',
      hints: [
        '`uniq` removes duplicate lines, but they must be adjacent. What should you do first?',
        'Sort first, then pipe to uniq: `sort names.txt | uniq`.',
      ],
      feedbackRules: [
        { pattern: /^uniq\s+names\.txt$/, message: '`uniq` only removes *adjacent* duplicates. The file isn\'t sorted, so you\'ll miss some! Sort first: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+names\.txt$/, message: 'Good start — that sorts! Now pipe the output to `uniq` to remove duplicates: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+-u\s+names\.txt$/, message: '`sort -u` works in practice! But this drill asks you to practice pipes — use `sort names.txt | uniq`.' },
        { pattern: /^cat\s+names\.txt\s*\|\s*sort\s*\|\s*uniq$/, message: 'That works, but `sort` can read files directly. Simpler: `sort names.txt | uniq`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c$/, message: 'Close! `-c` adds counts. For just removing duplicates, use `sort names.txt | uniq` (no flags).' },
      ],
      xp: 50,
    },
    {
      id: 'data-drill-3',
      prompt: 'Extract just the 3rd column (prices) from the comma-separated file data.csv.',
      difficulty: 'medium',
      check: (cmd) => /^cut\s+-d['"],['"]?\s+-f3\s+data\.csv$/.test(cmd.trim()),
      expectedOutput: '29.99\n49.99\n9.99\n79.99\n19.99\n29.99\n9.99\n49.99\n79.99\n19.99',
      hints: [
        'Use `cut` with two flags: `-d` sets the delimiter (comma) and `-f` picks the field number.',
        'The command is: `cut -d\',\' -f3 data.csv`.',
      ],
      feedbackRules: [
        { pattern: /^cut\s+-f3\s+data\.csv$/, message: 'By default, `cut` uses tabs as delimiters. For a CSV, specify comma: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cut\s+-d['"],['"]?\s+-f\d+$/, message: 'You need to specify the file: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^awk\s/, message: '`awk` works too, but this drill asks you to use `cut`. Try `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cut\s+-d\s+,/, message: 'The delimiter needs to be quoted and attached to `-d`: `cut -d\',\' -f3 data.csv`.' },
        { pattern: /^cat\s+data\.csv$/, message: 'That shows the whole file. Use `cut -d\',\' -f3 data.csv` to extract just the price column.' },
        { pattern: /^cut\s+-d['"],['"]?\s+-f2\s+data\.csv$/, message: 'That extracts column 2 (categories). You want column 3 (prices): `cut -d\',\' -f3 data.csv`.' },
      ],
      xp: 75,
    },
    {
      id: 'data-drill-4',
      prompt: 'Generate a frequency ranking: sort names.txt, count how many times each name appears, then show the most frequent names first.',
      difficulty: 'hard',
      check: (cmd) => /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
      expectedOutput: '      3 Bob\n      2 Alice\n      2 Diana\n      2 Eve\n      1 Charlie',
      hints: [
        'This is a 3-command pipeline: sort | count duplicates | sort by count.',
        'Step 1: `sort names.txt`. Step 2: pipe to `uniq -c` (count). Step 3: pipe to `sort -rn` (reverse numeric).',
        'Full command: `sort names.txt | uniq -c | sort -rn`.',
      ],
      feedbackRules: [
        { pattern: /^sort\s+names\.txt$/, message: 'Good start! Now pipe to `uniq -c` to count, then to `sort -rn` to rank: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq$/, message: 'That removes duplicates but doesn\'t count them. Add `-c` to `uniq` and then sort by count: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c$/, message: 'Almost! You have the counts. Now pipe to `sort -rn` to show the most frequent first: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-n$/, message: 'Close! `-n` sorts numerically (lowest first). Add `-r` to reverse it: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^sort\s+names\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-r$/, message: 'Almost! `-r` alone sorts alphabetically in reverse. Add `-n` for numeric: `sort names.txt | uniq -c | sort -rn`.' },
        { pattern: /^uniq\s+-c\s+names\.txt\s*\|\s*sort\s+-rn$/, message: 'Remember: `uniq` needs sorted input to work correctly! Sort first: `sort names.txt | uniq -c | sort -rn`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Data Detective',
    scenario: 'Your company\'s sales data is a mess. The boss wants a quick report: which products are selling the most, what are the prices, and what\'s the total revenue. Wrangle the raw data into answers!',
    steps: [
      {
        id: 'boss-data-1',
        prompt: '> The sales team dumped product names into sales.txt with tons of duplicates. Sort it, count how many times each product appears, and show the top sellers first.',
        check: (cmd) => /^sort\s+sales\.txt\s*\|\s*uniq\s+-c\s*\|\s*sort\s+-rn$/.test(cmd.trim()),
        expectedOutput: '      5 Widget\n      4 Gadget\n      2 Cable\n      2 Plug\n      2 Screen',
        hints: ['This is the classic frequency count pattern: `sort | uniq -c | sort -rn`.'],
        feedbackRules: [
          { pattern: /^cat\s+sales\.txt$/, message: 'That shows the raw list. For a ranked frequency count: `sort sales.txt | uniq -c | sort -rn`.' },
          { pattern: /^sort\s+sales\.txt$/, message: 'Good start! Now pipe to `uniq -c | sort -rn` to count and rank.' },
          { pattern: /^sort\s+sales\.txt\s*\|\s*uniq$/, message: 'Add `-c` to count occurrences, then pipe to `sort -rn`: `sort sales.txt | uniq -c | sort -rn`.' },
        ],
      },
      {
        id: 'boss-data-2',
        prompt: '> Widget is the top seller! Now extract the price column (column 3) from the detailed data.csv to see the pricing.',
        check: (cmd) => /^cut\s+-d['"],['"]?\s+-f3\s+data\.csv$/.test(cmd.trim()),
        expectedOutput: '29.99\n49.99\n9.99\n79.99\n19.99\n29.99\n9.99\n49.99\n79.99\n19.99',
        hints: ['Use `cut` with a comma delimiter to extract the 3rd field: `cut -d\',\' -f3 data.csv`.'],
        feedbackRules: [
          { pattern: /^cat\s+data\.csv$/, message: 'That shows all columns. Use `cut -d\',\' -f3 data.csv` to extract just the prices.' },
          { pattern: /^awk\s/, message: 'awk works too! But try `cut -d\',\' -f3 data.csv` for this step.' },
        ],
      },
      {
        id: 'boss-data-3',
        prompt: '> Final step: calculate the total revenue. Use awk to sum all values in column 3 of data.csv.',
        check: (cmd) => /^awk\s+-F['"],['"]?\s+['"]\{\s*sum\s*\+=\s*\$3\s*\}\s*END\s*\{\s*print\s+sum\s*\}['"]\s+data\.csv$/.test(cmd.trim()),
        expectedOutput: '377.90',
        hints: [
          'Use `awk` with `-F\',\'` to set the comma delimiter, then accumulate `$3` and print at the end.',
          'The command is: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.',
        ],
        feedbackRules: [
          { pattern: /^cut\s/, message: '`cut` extracts columns but can\'t do math. Use `awk` to sum: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
          { pattern: /^awk\s+['"]\{\s*print\s+\$3\s*\}['"]\s+data\.csv$/, message: 'That prints the column, but doesn\'t sum it. Use: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
          { pattern: /^awk\s+['"]\{/, message: 'Don\'t forget to set the field separator! CSV uses commas: `awk -F\',\' \'{ sum += $3 } END { print sum }\' data.csv`.' },
        ],
      },
    ],
    xpReward: 300,
    achievementId: 'boss-data-detective',
  },

  achievements: ['data-wrangler', 'boss-data-detective'],
};
