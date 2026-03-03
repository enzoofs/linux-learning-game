import type { Module } from '../../types';

export const textProcessingModule: Module = {
  id: 'text-processing',
  title: 'Text Processing',
  description: 'Search, filter, and transform text with the power tools of the command line.',
  tier: 'Specialist',
  prerequisites: ['files-nav'],
  isSideQuest: false,

  briefing: {
    concept:
      `Linux was built by people who loved text. The command line gives you incredibly powerful tools for searching, filtering, and transforming text — often faster than any GUI editor.\n\n` +
      `**Searching text:**\n` +
      `• **grep "pattern" file** — Search for lines matching a pattern. The most-used text tool.\n` +
      `• **grep -i** — Case-insensitive search (ignores upper/lowercase).\n` +
      `• **grep -r** — Recursive search through all files in a directory tree.\n` +
      `• **grep -v** — Invert match: show lines that do NOT match the pattern.\n` +
      `• **grep -n** — Show line numbers alongside matching lines.\n` +
      `• **grep -c** — Count the number of matching lines instead of showing them.\n\n` +
      `**Inspecting text:**\n` +
      `• **head -N file** — Show the first N lines of a file.\n` +
      `• **tail -N file** — Show the last N lines of a file.\n` +
      `• **wc -l file** — Count lines in a file. Also: \`-w\` for words, \`-c\` for characters.\n\n` +
      `**Transforming text:**\n` +
      `• **sed 's/old/new/g' file** — Stream editor: find and replace text. The \`g\` means "global" (all occurrences per line).`,
    analogy:
      '`grep` is like a highlighter for text — it finds and shows only the lines that match your pattern. `sed` is like find-and-replace on steroids — it can edit text flowing through a pipe without ever opening a file in an editor. `head` and `tail` are like peeking at the top or bottom of a stack of papers.',
    syntax:
      'grep "pattern" file          # find lines matching pattern\ngrep -i "pattern" file       # case-insensitive search\ngrep -r "pattern" dir/       # recursive search in directory\ngrep -v "pattern" file       # show lines NOT matching\ngrep -n "pattern" file       # show line numbers\ngrep -c "pattern" file       # count matching lines\nhead -N file                 # show first N lines\ntail -N file                 # show last N lines\nwc -l file                   # count lines\nsed \'s/old/new/g\' file       # find and replace text',
    examples: [
      { command: "grep 'error' log.txt", output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', explanation: 'Finds all lines containing "error" in log.txt. Matching is case-sensitive by default.' },
      { command: "grep -i 'warning' log.txt", output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call', explanation: 'Case-insensitive search. Matches "WARNING", "Warning", "warning", etc.' },
      { command: "grep -r 'TODO' src/", output: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment', explanation: 'Searches through every file in the src/ directory and its subdirectories.' },
      { command: "grep -v 'INFO' log.txt", output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:03:11 WARNING: disk usage at 85%', explanation: 'Shows lines that do NOT contain "INFO" — useful for filtering out noise.' },
      { command: 'wc -l data.txt', output: '150 data.txt', explanation: 'Counts the number of lines. Useful for knowing how big a file is.' },
      { command: "sed 's/foo/bar/g' config.txt", output: '(contents of config.txt with all "foo" replaced by "bar")', explanation: 'Replaces every occurrence of "foo" with "bar". The `s` means substitute, `g` means global (all matches per line).' },
      { command: 'head -5 log.txt', output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused', explanation: 'Shows just the first 5 lines — great for previewing large files.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^cat\s+log\.txt$/, output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:08:15 INFO: request processed\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:15:00 INFO: cache cleared\n2024-03-01 10:20:33 Warning: deprecated API call\n2024-03-01 10:25:00 INFO: backup completed\n2024-03-01 10:30:18 error: disk full', description: 'View the full log file' },
      { pattern: /^cat\s+data\.txt$/, output: 'Alice\nBob\nCharlie\nDiana\nEve\nFrank\nGrace\nHenry\nIvy\nJack\nKaren\nLeo\nMia\nNick\nOlivia', description: 'View data.txt' },
      { pattern: /^cat\s+(app\.conf|config\.txt)$/, output: 'app_name=myapp\ndebug=true\nlog_level=info\nmax_connections=100\ndebug=true\nport=8080\ncache_enabled=false\ndebug=true\ntimeout=30', description: 'View app.conf / config.txt' },
      { pattern: /^grep\s+['"]?error['"]?\s+log\.txt$/, output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', description: 'Search for error in log.txt' },
      { pattern: /^grep\s+-i\s+['"]?error['"]?\s+log\.txt$/, output: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full', description: 'Case-insensitive search for error' },
      { pattern: /^grep\s+-i\s+['"]?warning['"]?\s+log\.txt$/, output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call', description: 'Case-insensitive search for warning' },
      { pattern: /^grep\s+-v\s+['"]?INFO['"]?\s+log\.txt$/, output: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:20:33 Warning: deprecated API call\n2024-03-01 10:30:18 error: disk full', description: 'Show non-INFO lines' },
      { pattern: /^grep\s+-n\s+['"]?error['"]?\s+log\.txt$/, output: '5:2024-03-01 10:05:02 error: connection refused\n7:2024-03-01 10:12:45 error: timeout exceeded\n11:2024-03-01 10:30:18 error: disk full', description: 'Search with line numbers' },
      { pattern: /^grep\s+-c\s+['"]?error['"]?\s+log\.txt$/, output: '3', description: 'Count error lines' },
      { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s+src\/$/, output: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment', description: 'Recursive search for TODO' },
      { pattern: /^grep\s+['"]?debug=true['"]?\s+(app\.conf|config\.txt)$/, output: 'debug=true\ndebug=true\ndebug=true', description: 'Find debug=true entries' },
      { pattern: /^sed\s+'s\/debug=true\/debug=false\/g'\s+(app\.conf|config\.txt)$/, output: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30', description: 'Replace debug=true with debug=false' },
      { pattern: /^sed\s+'s\/foo\/bar\/g'\s+\S+$/, output: '(file contents with foo replaced by bar)', description: 'Generic sed replace' },
      { pattern: /^grep\s+['"]?debug['"]?\s+(app\.conf|config\.txt)$/, output: 'debug=false\ndebug=false\ndebug=false', description: 'Verify debug settings' },
      { pattern: /^wc\s+-l\s+\S+$/, output: '150 data.txt', description: 'Count lines in a file' },
      { pattern: /^wc\s+-l\s+log\.txt$/, output: '11 log.txt', description: 'Count lines in log.txt' },
      { pattern: /^wc\s+-w\s+\S+$/, output: '15 data.txt', description: 'Count words in a file' },
      { pattern: /^head\s+-\d+\s+log\.txt$/, output: '2024-03-01 10:00:01 INFO: server started\n2024-03-01 10:00:02 INFO: listening on port 8080\n2024-03-01 10:00:05 INFO: connected to database\n2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:05:02 error: connection refused', description: 'Show first lines of log' },
      { pattern: /^tail\s+-\d+\s+log\.txt$/, output: '2024-03-01 10:25:00 INFO: backup completed\n2024-03-01 10:30:18 error: disk full', description: 'Show last lines of log' },
      { pattern: /^ls$/, output: 'app.conf  config.txt  data.txt  log.txt  src/', description: 'List files' },
    ],
    contextHints: [
      'Try `grep \'error\' log.txt` to find all error lines in the log.',
      'Use `grep -i` for case-insensitive searching: `grep -i \'warning\' log.txt`.',
      'Search recursively with `grep -r \'TODO\' src/` to find TODOs across all files.',
      'Use `grep -v \'INFO\' log.txt` to exclude INFO lines and focus on problems.',
      'Count lines with `wc -l data.txt`.',
      'Preview a file with `head -5 log.txt` or `tail -5 log.txt`.',
      'Use `sed \'s/old/new/g\' file` to find and replace text.',
      'Combine tools: `grep \'error\' log.txt | wc -l` counts error lines.',
      'View `cat log.txt` or `cat app.conf` to see the files you can work with.',
    ],
  },

  drills: [
    {
      id: 'text-drill-1',
      prompt: 'Search for the word \'error\' in log.txt and display all matching lines.',
      difficulty: 'easy',
      check: (cmd) => /^grep\s+['"]?error['"]?\s+log\.txt$/.test(cmd.trim()),
      expectedOutput: '2024-03-01 10:05:02 error: connection refused\n2024-03-01 10:12:45 error: timeout exceeded\n2024-03-01 10:30:18 error: disk full',
      hints: [
        'The command for searching text is `grep`. It takes a pattern and a filename.',
        'Try: `grep \'error\' log.txt`',
      ],
      feedbackRules: [
        { pattern: /^find\s/, message: '`find` searches for files by name. To search text *inside* a file, use `grep`.' },
        { pattern: /^search\s/i, message: '`search` is not a Linux command. The text search command is `grep \'error\' log.txt`.' },
        { pattern: /^grep\s+['"]?error['"]?\s*$/, message: 'You told grep what to search for, but not where! Add the filename: `grep \'error\' log.txt`.' },
        { pattern: /^cat\s+log\.txt\s*\|\s*grep\s+['"]?error['"]?$/, message: 'That works in practice! But `grep` can read files directly — try `grep \'error\' log.txt`.' },
        { pattern: /^grep\s+-i\s+['"]?error['"]?\s+log\.txt$/, message: 'Close! `-i` is for case-insensitive search. For this drill, plain `grep \'error\' log.txt` is what we need.' },
      ],
      xp: 50,
    },
    {
      id: 'text-drill-2',
      prompt: 'Count how many lines are in the file data.txt.',
      difficulty: 'easy',
      check: (cmd) => /^wc\s+-l\s+data\.txt$/.test(cmd.trim()),
      expectedOutput: '150 data.txt',
      hints: [
        'The `wc` command counts things. Which flag counts lines?',
        'Use `wc -l data.txt` — the `-l` flag counts lines.',
      ],
      feedbackRules: [
        { pattern: /^wc\s+data\.txt$/, message: 'Without a flag, `wc` shows lines, words, AND characters. Use `wc -l data.txt` for just the line count.' },
        { pattern: /^wc\s+-w\s+data\.txt$/, message: '`-w` counts words. For line count, use `-l`: `wc -l data.txt`.' },
        { pattern: /^wc\s+-c\s+data\.txt$/, message: '`-c` counts characters/bytes. For line count, use `-l`: `wc -l data.txt`.' },
        { pattern: /^cat\s+data\.txt\s*\|\s*wc\s+-l$/, message: 'That works! But `wc` can read files directly — simpler: `wc -l data.txt`.' },
        { pattern: /^wc\s+-l\s*$/, message: 'You need to specify which file to count: `wc -l data.txt`.' },
        { pattern: /^grep\s+-c/, message: '`grep -c` counts matching lines. For total line count, use `wc -l data.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'text-drill-3',
      prompt: 'Search for \'warning\' in log.txt, but make the search case-insensitive (match WARNING, Warning, warning, etc.).',
      difficulty: 'medium',
      check: (cmd) => /^grep\s+-i\s+['"]?warning['"]?\s+log\.txt$/.test(cmd.trim()),
      expectedOutput: '2024-03-01 10:03:11 WARNING: disk usage at 85%\n2024-03-01 10:20:33 Warning: deprecated API call',
      hints: [
        'You need `grep` with a flag that ignores case. The flag rhymes with "eye".',
        'Use `-i` for case-insensitive: `grep -i \'warning\' log.txt`.',
      ],
      feedbackRules: [
        { pattern: /^grep\s+['"]?warning['"]?\s+log\.txt$/, message: 'That only matches lowercase "warning". The log has "WARNING" and "Warning" too. Add `-i` for case-insensitive search.' },
        { pattern: /^grep\s+['"]?WARNING['"]?\s+log\.txt$/, message: 'That only matches uppercase "WARNING". To match all cases, use `grep -i \'warning\' log.txt`.' },
        { pattern: /^grep\s+-I\s+/, message: 'Almost! The flag is lowercase `-i`, not uppercase `-I`.' },
        { pattern: /^grep\s+['"]?\[Ww\]arning['"]?\s+log\.txt$/, message: 'Creative regex! But there\'s a simpler way — use `-i` for case-insensitive: `grep -i \'warning\' log.txt`.' },
      ],
      xp: 75,
    },
    {
      id: 'text-drill-4',
      prompt: 'Use sed to replace all occurrences of \'debug=true\' with \'debug=false\' in the file app.conf.',
      difficulty: 'medium',
      check: (cmd) => /^sed\s+'s\/debug=true\/debug=false\/g'\s+app\.conf$/.test(cmd.trim()),
      expectedOutput: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30',
      hints: [
        '`sed` uses the format: `sed \'s/old/new/g\' file`. The `s` means substitute, `g` means global.',
        'Try: `sed \'s/debug=true/debug=false/g\' app.conf`',
      ],
      feedbackRules: [
        { pattern: /^sed\s+'s\/debug=true\/debug=false\/'\s+app\.conf$/, message: 'Almost! Without the `g` flag, only the first match on each line is replaced. Add `g` for global: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^sed\s+s\/debug=true\/debug=false\/g\s+app\.conf$/, message: 'The sed expression needs quotes around it: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^grep\s/, message: '`grep` finds text but can\'t change it. Use `sed` to find and replace.' },
        { pattern: /^sed\s+'s\/true\/false\/g'\s+app\.conf$/, message: 'That replaces ALL "true" with "false" — too broad! Be specific: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
        { pattern: /^replace\s/i, message: '`replace` is not a standard command. Use `sed \'s/debug=true/debug=false/g\' app.conf`.' },
      ],
      xp: 75,
    },
    {
      id: 'text-drill-5',
      prompt: 'Search recursively through the src/ directory for all lines containing \'TODO\'.',
      difficulty: 'hard',
      check: (cmd) => /^grep\s+-r\s+['"]?TODO['"]?\s+src\/$/.test(cmd.trim()),
      expectedOutput: 'src/app.js:  // TODO: add error handling\nsrc/utils.js:  // TODO: refactor this function\nsrc/config.js:  // TODO: load from environment',
      hints: [
        'You need `grep` with a flag that searches through directories recursively.',
        'The flag for recursive search is `-r`. Try `grep -r \'TODO\' src/`.',
      ],
      feedbackRules: [
        { pattern: /^grep\s+['"]?TODO['"]?\s+src\/$/, message: '`grep` can\'t search directories without the `-r` (recursive) flag. Add it: `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s*$/, message: 'You need to specify which directory to search in. Add `src/` at the end: `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-r\s+['"]?TODO['"]?\s+\.$/, message: 'That searches the entire current directory. Narrow it down to just `src/`: `grep -r \'TODO\' src/`.' },
        { pattern: /^find\s+src\/\s+-name/, message: '`find` searches for files by name. To search file *contents*, use `grep -r \'TODO\' src/`.' },
        { pattern: /^grep\s+-R\s+['"]?TODO['"]?\s+src\/$/, message: 'Close! `-R` works in practice (it follows symlinks), but the standard flag is lowercase `-r`: `grep -r \'TODO\' src/`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Config Surgeon',
    scenario: 'A production config file has debug mode accidentally enabled in multiple places. You need to find every occurrence, fix them all, and verify the fix — without opening an editor.',
    steps: [
      {
        id: 'boss-text-1',
        prompt: '> The app is logging sensitive data because debug mode is on. First, find all lines in app.conf that have \'debug=true\'.',
        check: (cmd) => /^grep\s+['"]?debug=true['"]?\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'debug=true\ndebug=true\ndebug=true',
        hints: ['Use `grep` to search for the pattern in the config file.'],
        feedbackRules: [
          { pattern: /^cat\s+app\.conf$/, message: 'That shows the whole file. Use `grep \'debug=true\' app.conf` to find just the problem lines.' },
          { pattern: /^grep\s+['"]?debug['"]?\s+app\.conf$/, message: 'That matches any "debug" line. Be more specific: `grep \'debug=true\' app.conf`.' },
        ],
      },
      {
        id: 'boss-text-2',
        prompt: '> 3 occurrences of debug=true! Fix them all at once — replace every \'debug=true\' with \'debug=false\' using sed.',
        check: (cmd) => /^sed\s+'s\/debug=true\/debug=false\/g'\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'app_name=myapp\ndebug=false\nlog_level=info\nmax_connections=100\ndebug=false\nport=8080\ncache_enabled=false\ndebug=false\ntimeout=30',
        hints: ['Use `sed` with the substitute command: `sed \'s/old/new/g\' file`.'],
        feedbackRules: [
          { pattern: /^sed\s+'s\/debug=true\/debug=false\/'\s+app\.conf$/, message: 'Without the `g` flag, only one match per line is replaced. Add `g`: `sed \'s/debug=true/debug=false/g\' app.conf`.' },
          { pattern: /^grep/, message: '`grep` finds text but cannot replace it. Use `sed` for find-and-replace.' },
        ],
      },
      {
        id: 'boss-text-3',
        prompt: '> Now verify the fix. Search app.conf for any remaining \'debug\' lines to confirm they all say \'false\'.',
        check: (cmd) => /^grep\s+['"]?debug['"]?\s+app\.conf$/.test(cmd.trim()),
        expectedOutput: 'debug=false\ndebug=false\ndebug=false',
        hints: ['Search for "debug" in the config to see all debug-related settings.'],
        feedbackRules: [
          { pattern: /^cat\s+app\.conf$/, message: 'That shows the whole file. Use `grep \'debug\' app.conf` to see just the debug settings.' },
          { pattern: /^grep\s+['"]?debug=true['"]?\s+app\.conf$/, message: 'Searching for "debug=true" would show nothing if the fix worked. Search for just "debug" to see all debug lines.' },
          { pattern: /^grep\s+['"]?debug=false['"]?\s+app\.conf$/, message: 'That would confirm the fix, but searching for just "debug" is more thorough — it catches any value.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-config-surgeon',
  },

  achievements: ['text-ninja', 'boss-config-surgeon'],
};
