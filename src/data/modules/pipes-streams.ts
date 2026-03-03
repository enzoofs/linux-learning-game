import { Module } from '../../types';

export const pipesStreamsModule: Module = {
  id: 'pipes-streams',
  title: 'Pipes & Streams',
  description: 'Connect commands together and redirect data flow like a pro.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `In Linux, every command reads input and produces output. The magic happens when you connect them together. This module covers 3 big ideas:\n\n` +
      `**1. Pipes (\`|\`)** — Send the output of one command as input to the next.\n` +
      `Every command has a standard output (stdout). The pipe takes that output and feeds it as standard input (stdin) to the next command. You can chain as many as you want:\n` +
      `\`command1 | command2 | command3\`\n\n` +
      `**2. Redirect Overwrite (\`>\`)** — Send output to a file instead of the screen. WARNING: this destroys the file's previous contents!\n\n` +
      `**3. Redirect Append (\`>>\`)** — Add output to the end of a file without erasing what's already there.\n\n` +
      `Key commands for working with pipes and streams:\n` +
      `• **echo** — Print text to the screen (or into a pipe/file).\n` +
      `• **cat** — Read a file and print it to stdout. Perfect pipe starter.\n` +
      `• **wc** — Count lines (\`-l\`), words (\`-w\`), or characters (\`-c\`).\n` +
      `• **grep** — Filter lines that match a pattern.\n` +
      `• **head / tail** — Show the first or last N lines of output.\n` +
      `• **sort** — Sort lines alphabetically or numerically.`,
    analogy:
      'Pipes are like water pipes — data flows from one command into the next. Each command is a filter or transformer along the pipeline. Redirects (\`>\` and \`>>\`) are like faucets that send the stream to a file instead of the screen. \`>\` replaces the bucket with fresh water, while \`>>\` pours more water into the same bucket.',
    syntax:
      'command1 | command2        # pipe output of command1 into command2\ncommand > file             # write output to file (overwrite)\ncommand >> file            # append output to file\necho "text"                # print text to stdout\ncat file                   # read file to stdout\nwc [-l|-w|-c] [file]       # count lines/words/chars\ngrep "pattern" [file]      # filter lines matching pattern\nhead -N file               # show first N lines\ntail -N file               # show last N lines',
    examples: [
      { command: 'echo "Hello Linux"', output: 'Hello Linux', explanation: 'Prints the text to the terminal. The simplest way to produce output.' },
      { command: 'echo "Hello Linux" > hello.txt', output: '', explanation: 'Writes "Hello Linux" into hello.txt. If the file exists, it is overwritten.' },
      { command: 'cat hello.txt', output: 'Hello Linux', explanation: 'Reads the file and prints its contents to the screen.' },
      { command: 'ls | wc -l', output: '8', explanation: 'Lists files, then counts how many lines — giving you a file count.' },
      { command: 'cat /etc/passwd | grep bash', output: 'root:x:0:0:root:/root:/bin/bash\nenzo:x:1000:...:/bin/bash', explanation: 'Reads the passwd file and filters only lines containing "bash".' },
      { command: 'echo "log entry" >> server.log', output: '', explanation: 'Appends the text to server.log without erasing existing content.' },
      { command: 'cat access.log | grep ERROR | wc -l', output: '42', explanation: 'Chains 3 commands: read the log, filter errors, count them. This is the power of pipes.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^echo\s+['"](.+?)['"]\s*$/, output: '$1', description: 'Print text to stdout' },
      { pattern: /^echo\s+['"](.+?)['"]\s*>\s*\S+/, output: '', description: 'Write text to a file (overwrite)' },
      { pattern: /^echo\s+['"](.+?)['"]\s*>>\s*\S+/, output: '', description: 'Append text to a file' },
      { pattern: /^cat\s+hello\.txt$/, output: 'Hello Linux', description: 'Read hello.txt' },
      { pattern: /^cat\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200', description: 'Read the access log' },
      { pattern: /^cat\s+\/etc\/passwd$/, output: 'root:x:0:0:root:/root:/bin/bash\ndaemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin\nbin:x:2:2:bin:/bin:/usr/sbin/nologin\nsys:x:3:3:sys:/dev:/usr/sbin/nologin\nwww-data:x:33:33:www-data:/var/www:/usr/sbin/nologin\nenzo:x:1000:1000:Enzo:/home/enzo:/bin/bash', description: 'Read the passwd file' },
      { pattern: /^ls\s*\|?\s*$/, output: 'Desktop  Documents  Downloads  Music  Pictures  access.log  hello.txt  scripts', description: 'List files' },
      { pattern: /^ls\s*\|\s*wc\s+-l$/, output: '8', description: 'Count files via pipe' },
      { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?$/, output: '2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:09 ERROR Request GET /api/config 502', description: 'Filter errors from log' },
      { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*\|\s*wc\s+-l$/, output: '4', description: 'Count error lines' },
      { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*\|\s*wc\s+-l$/, output: '4', description: 'Chain: read, filter, count' },
      { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>\s*errors\.txt$/, output: '', description: 'Save errors to file' },
      { pattern: /^wc\s+-l\s+\S+/, output: '10 access.log', description: 'Count lines in file' },
      { pattern: /^wc\s+-w\s+hello\.txt$/, output: '2 hello.txt', description: 'Count words in hello.txt' },
      { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-w$/, output: '2', description: 'Pipe file to word count' },
      { pattern: /^head\s+-\d+\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200', description: 'Show first lines of log' },
      { pattern: /^tail\s+-10\s+access\.log$/, output: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200', description: 'Show last 10 lines of log' },
      { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+bash\s*\|\s*wc\s+-l$/, output: '2', description: 'Count bash users' },
      { pattern: /^sort\s+\S+/, output: '(sorted output)', description: 'Sort a file' },
    ],
    contextHints: [
      'Try `echo "Hello Linux"` to print text to the screen.',
      'Use `echo "text" > file.txt` to write text to a file.',
      'Use `cat file.txt` to read a file.',
      'Chain commands with `|` — try `ls | wc -l` to count files.',
      'Use `grep` to filter: `cat access.log | grep ERROR`',
      'Count things with `wc`: `-l` for lines, `-w` for words, `-c` for characters.',
      'Try chaining 3 commands: `cat access.log | grep ERROR | wc -l`',
      'Save output to a file: `grep ERROR access.log > errors.txt`',
    ],
  },

  drills: [
    {
      id: 'pipes-drill-1',
      prompt: 'Count how many files and folders are in the current directory. Use a pipe to connect two commands.',
      difficulty: 'easy',
      check: (cmd) => /^ls\s*\|\s*wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '8',
      hints: [
        'You need two commands: one to list files, one to count lines.',
        'Pipe `ls` into `wc -l` to count the output lines.',
      ],
      feedbackRules: [
        { pattern: /^ls$/, message: 'That lists files, but you need to count them. Pipe the output to `wc -l`.' },
        { pattern: /^wc\s+-l$/, message: '`wc -l` counts lines, but it needs input! Pipe `ls` into it: `ls | wc -l`.' },
        { pattern: /^ls\s*\|\s*wc$/, message: 'Almost! `wc` alone shows lines, words, and chars. Use `wc -l` to get just the line count.' },
        { pattern: /^ls\s+-l\s*\|\s*wc\s+-l/, message: 'That works but includes a "total" line. For this drill, just use `ls | wc -l`.' },
      ],
      xp: 50,
    },
    {
      id: 'pipes-drill-2',
      prompt: 'Save the text "Hello Linux" to a file called hello.txt using echo and output redirection.',
      difficulty: 'easy',
      check: (cmd) => /^echo\s+['"]Hello Linux['"]\s*>\s*hello\.txt$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Use `echo` to produce the text and `>` to send it to a file.',
        'The command is: `echo \'Hello Linux\' > hello.txt`',
      ],
      feedbackRules: [
        { pattern: /^echo\s+Hello Linux$/, message: 'That prints to the screen. Use `>` to redirect into a file: `echo \'Hello Linux\' > hello.txt`.' },
        { pattern: /^echo\s+['"]Hello Linux['"]\s*$/, message: 'Good echo! Now redirect it to hello.txt with `>`.' },
        { pattern: /^echo\s+['"]Hello Linux['"]\s*>>\s*hello\.txt$/, message: '`>>` appends. For this drill, use `>` to write (overwrite) the file.' },
        { pattern: /^cat\s+.*>\s*hello\.txt$/, message: 'We want to write new text, not copy a file. Use `echo` instead of `cat`.' },
        { pattern: /^echo\s+['"]hello linux['"]\s*>/i, message: 'Watch the capitalization! It should be "Hello Linux" with capital H and L.' },
      ],
      xp: 50,
    },
    {
      id: 'pipes-drill-3',
      prompt: 'Read the file hello.txt and count how many words it contains. Use a pipe to connect the commands.',
      difficulty: 'medium',
      check: (cmd) => /^cat\s+hello\.txt\s*\|\s*wc\s+-w$/.test(cmd.trim()),
      expectedOutput: '2',
      hints: [
        'You need `cat` to read the file, then pipe to a counting command.',
        'The flag for word count is `-w`. Try `cat hello.txt | wc -w`.',
      ],
      feedbackRules: [
        { pattern: /^cat\s+hello\.txt$/, message: 'That reads the file but doesn\'t count. Pipe it to `wc -w` for word count.' },
        { pattern: /^wc\s+-w\s+hello\.txt$/, message: 'That works in real Linux! But this drill asks you to practice pipes. Use `cat hello.txt | wc -w`.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-l$/, message: 'Close! `-l` counts lines. You want `-w` for word count.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc\s+-c$/, message: '`-c` counts characters. You want `-w` for word count.' },
        { pattern: /^cat\s+hello\.txt\s*\|\s*wc$/, message: 'Almost! Add `-w` to get just the word count: `cat hello.txt | wc -w`.' },
      ],
      xp: 75,
    },
    {
      id: 'pipes-drill-4',
      prompt: 'Chain 3 commands together: read /etc/passwd, filter lines that contain "bash", and count how many there are.',
      difficulty: 'hard',
      check: (cmd) => /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?\s*\|\s*wc\s+-l$/.test(cmd.trim()),
      expectedOutput: '2',
      hints: [
        'You need 3 commands connected by 2 pipes: read | filter | count.',
        'Start with `cat /etc/passwd`, pipe to `grep bash`, pipe to `wc -l`.',
      ],
      feedbackRules: [
        { pattern: /^cat\s+\/etc\/passwd$/, message: 'Good start! Now pipe that to `grep bash` to filter, then to `wc -l` to count.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?$/, message: 'Two commands chained! Now add one more pipe to `wc -l` to count the matching lines.' },
        { pattern: /^grep\s+['"]?bash['"]?\s+\/etc\/passwd\s*\|\s*wc\s+-l$/, message: 'That works in practice, but this drill asks you to chain 3 commands starting with `cat`.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*wc\s+-l$/, message: 'You\'re counting ALL lines. Insert `grep bash` between cat and wc to filter first.' },
        { pattern: /^cat\s+\/etc\/passwd\s*\|\s*grep\s+['"]?bash['"]?\s*\|\s*wc\s+-w$/, message: 'Almost perfect! Use `-l` (lines) instead of `-w` (words) to count matching lines.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Log Analyzer',
    scenario: 'Your web server has been acting up. Users are reporting errors, and your boss wants a report ASAP. Analyze the access log to find the problem and save the evidence.',
    steps: [
      {
        id: 'boss-pipes-1',
        prompt: '> The access log is in the current directory. Start by viewing the last 10 lines to get a quick overview of recent activity.',
        check: (cmd) => /^tail\s+-10\s+access\.log$/.test(cmd.trim()),
        expectedOutput: '2024-03-01 10:00:01 INFO  Request GET /index.html 200\n2024-03-01 10:00:02 ERROR Request GET /api/users 500\n2024-03-01 10:00:03 INFO  Request POST /api/login 200\n2024-03-01 10:00:04 WARN  Request GET /old-page 301\n2024-03-01 10:00:05 ERROR Request GET /api/data 503\n2024-03-01 10:00:06 INFO  Request GET /about 200\n2024-03-01 10:00:07 ERROR Request POST /api/submit 500\n2024-03-01 10:00:08 INFO  Request GET /style.css 200\n2024-03-01 10:00:09 ERROR Request GET /api/config 502\n2024-03-01 10:00:10 INFO  Request GET /favicon.ico 200',
        hints: ['Use `tail` with `-10` to show the last 10 lines of a file.'],
        feedbackRules: [
          { pattern: /^cat\s+access\.log$/, message: 'That shows the whole file. Use `tail -10 access.log` to see just the last 10 lines.' },
          { pattern: /^head/, message: '`head` shows the beginning. You want `tail` to see the most recent entries.' },
          { pattern: /^tail\s+access\.log$/, message: 'Good idea! But specify the count: `tail -10 access.log`.' },
        ],
      },
      {
        id: 'boss-pipes-2',
        prompt: '> You can see ERROR entries mixed in. Count the total number of ERROR lines in the log using grep and wc.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+access\.log\s*\|\s*wc\s+-l$/.test(cmd.trim()),
        expectedOutput: '4',
        hints: [
          'Use `grep` to find ERROR lines, then pipe to `wc -l` to count them.',
          'Try: `grep ERROR access.log | wc -l`',
        ],
        feedbackRules: [
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log$/, message: 'That shows the errors, but your boss wants a number. Pipe to `wc -l` to count them.' },
          { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*\|\s*wc\s+-l$/, message: 'That works, but you can simplify: `grep` can read files directly. Try `grep ERROR access.log | wc -l`.' },
          { pattern: /^wc\s+-l\s+access\.log$/, message: 'That counts ALL lines. Filter for ERROR first with `grep`.' },
        ],
      },
      {
        id: 'boss-pipes-3',
        prompt: '> 4 errors! Save all ERROR lines to a file called errors.txt so you can attach it to your incident report.',
        check: (cmd) => /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>\s*errors\.txt$/.test(cmd.trim()),
        expectedOutput: '',
        hints: [
          'Use `grep` to find the lines and `>` to redirect them to a file.',
          'Try: `grep ERROR access.log > errors.txt`',
        ],
        feedbackRules: [
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log\s*>>\s*errors\.txt$/, message: '`>>` appends. Since this is a new file, use `>` to write: `grep ERROR access.log > errors.txt`.' },
          { pattern: /^cat\s+access\.log\s*\|\s*grep\s+['"]?ERROR['"]?\s*>\s*errors\.txt$/, message: 'That works! But you can simplify — `grep` reads files directly: `grep ERROR access.log > errors.txt`.' },
          { pattern: /^grep\s+['"]?ERROR['"]?\s+access\.log$/, message: 'That prints errors to screen. Redirect to a file with `>`: `grep ERROR access.log > errors.txt`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-log-analyzer',
  },

  achievements: ['pipe-master', 'boss-log-analyzer'],
};
