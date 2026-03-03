import { Module } from '../../types';

export const filesNavigationModule: Module = {
  id: 'files-nav',
  title: 'Files & Navigation',
  description: 'Master finding files, understanding file types, and navigating complex directory trees.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `You already know \`ls\` and \`cd\`. Now it's time to level up your file skills. This module teaches you how to find files anywhere, create and destroy them, copy and move them, and inspect what they are.\n\n` +
      `**Finding files:**\n` +
      `• **find** — The ultimate search tool. It walks through directories recursively to locate files by name, type, size, date, and more.\n` +
      `• **tree** — Visualize the directory structure as a tree diagram. Great for getting an overview.\n` +
      `• **file** — Tell you what type of file something is (text, binary, image, etc.).\n\n` +
      `**Managing files:**\n` +
      `• **touch** — Create an empty file, or update the timestamp of an existing one.\n` +
      `• **rm** — Remove (delete) files. Use \`-r\` for directories. **There is no trash can — deletion is permanent!**\n` +
      `• **cp** — Copy files or directories. Use \`-r\` for directories.\n` +
      `• **mv** — Move or rename files and directories.`,
    analogy:
      '`find` is like a search dog — you describe what you\'re looking for, and it sniffs through every directory to find it. `touch` is like tapping a file to say "I was here" (or bringing a new one into existence). `rm` is a paper shredder — once it\'s gone, it\'s gone. `cp` is a photocopier, and `mv` is picking something up and placing it somewhere else.',
    syntax:
      'find [path] [options]       # search for files\n  -name "pattern"            # match by name (supports wildcards)\n  -type f|d                  # f = file, d = directory\n  -mtime -N                  # modified in the last N days\n  -delete                    # delete matched files\ntree [path]                  # show directory tree\nfile <filename>              # identify file type\ntouch <filename>             # create file or update timestamp\nrm [-r] <file|dir>           # remove file (-r for directories)\ncp [-r] <source> <dest>      # copy file (-r for directories)\nmv <source> <dest>           # move or rename',
    examples: [
      { command: 'find . -name "*.txt"', output: './notes.txt\n./docs/readme.txt\n./backup/old.txt', explanation: 'Searches the current directory and all subdirectories for files ending in .txt.' },
      { command: 'find . -type d', output: './\n./docs\n./backup\n./src', explanation: 'Lists all directories. `-type d` means "directories only". Use `-type f` for files only.' },
      { command: 'find . -mtime -1', output: './notes.txt\n./src/app.js', explanation: 'Finds files modified in the last 24 hours. `-mtime -7` would mean the last 7 days.' },
      { command: 'touch notes.txt', output: '', explanation: 'Creates an empty file called notes.txt. If it already exists, updates its timestamp.' },
      { command: 'cp config.bak config.txt', output: '', explanation: 'Makes a copy of config.bak named config.txt.' },
      { command: 'mv old-name.txt new-name.txt', output: '', explanation: 'Renames old-name.txt to new-name.txt. Also used to move files between directories.' },
      { command: 'rm temp.txt', output: '', explanation: 'Permanently deletes temp.txt. No confirmation, no undo.' },
      { command: 'find . -name "*.tmp" -delete', output: '', explanation: 'Finds all .tmp files and deletes them in one shot. Powerful but dangerous — double check first!' },
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
      'Try `find . -name "*.txt"` to search for all text files.',
      'Use `tree` to visualize the directory structure.',
      'Create a new file with `touch myfile.txt`.',
      'Use `file notes.txt` to check what type of file it is.',
      'Copy a file with `cp source.txt destination.txt`.',
      'Move or rename with `mv old.txt new.txt`.',
      'Find recently modified files: `find . -mtime -1`',
      'Be careful with `rm` — there is no undo!',
      'Use `find . -name "*.tmp" -delete` to clean up temp files.',
    ],
  },

  drills: [
    {
      id: 'files-drill-1',
      prompt: 'Find all files that end with .txt in the current directory and its subdirectories.',
      difficulty: 'easy',
      check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.txt['"]$/.test(cmd.trim()),
      expectedOutput: './notes.txt\n./docs/readme.txt\n./backup/old.txt',
      hints: [
        'Use `find` starting from `.` (current directory).',
        'The flag for matching filenames is `-name`. Wrap the pattern in quotes: `"*.txt"`.',
      ],
      feedbackRules: [
        { pattern: /^ls\s+.*\.txt/, message: '`ls` only lists the current directory. Use `find` to search recursively through all subdirectories.' },
        { pattern: /^find\s+\.\s+\*\.txt$/, message: 'You need the `-name` flag: `find . -name "*.txt"`. The quotes prevent the shell from expanding `*`.' },
        { pattern: /^find\s+-name\s+['"][*]\.txt['"]$/, message: 'Almost! Specify where to search — add `.` for current directory: `find . -name "*.txt"`.' },
        { pattern: /^find\s+\.\s+-name\s+[*]\.txt$/, message: 'Put quotes around the pattern! Without them, the shell expands `*` before find sees it: `find . -name "*.txt"`.' },
        { pattern: /^grep\s/, message: '`grep` searches file contents. To find files by name, use `find . -name "*.txt"`.' },
      ],
      xp: 50,
    },
    {
      id: 'files-drill-2',
      prompt: 'Create an empty file called notes.txt using the touch command.',
      difficulty: 'easy',
      check: (cmd) => /^touch\s+notes\.txt$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'The command to create an empty file is `touch`.',
        'Just type: `touch notes.txt`',
      ],
      feedbackRules: [
        { pattern: /^echo\s+.*>\s*notes\.txt$/, message: 'That works but creates a file with content. `touch` creates a truly empty file: `touch notes.txt`.' },
        { pattern: /^cat\s+>\s*notes\.txt$/, message: 'That opens an interactive input. Use `touch notes.txt` for a clean empty file.' },
        { pattern: /^mkdir\s+notes\.txt$/, message: '`mkdir` creates directories, not files. Use `touch notes.txt` to create a file.' },
        { pattern: /^touch$/, message: 'You need to specify the filename: `touch notes.txt`.' },
        { pattern: /^nano\s+notes\.txt$/, message: '`nano` opens an editor. For just creating the file, use `touch notes.txt`.' },
        { pattern: /^vim\s+notes\.txt$/, message: '`vim` opens an editor. For just creating the file, use `touch notes.txt`.' },
      ],
      xp: 50,
    },
    {
      id: 'files-drill-3',
      prompt: 'Find all files that were modified in the last 24 hours (last 1 day).',
      difficulty: 'medium',
      check: (cmd) => /^find\s+\.\s+-mtime\s+-1$/.test(cmd.trim()),
      expectedOutput: './notes.txt\n./src/app.js\n./cache/session.tmp',
      hints: [
        'Use `find` with a time-based flag. The flag for modification time is `-mtime`.',
        'A negative number means "less than N days ago". Try `find . -mtime -1`.',
      ],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-mtime\s+1$/, message: 'Close! `-mtime 1` means exactly 1 day ago. Use `-mtime -1` (with a minus) for "within the last day".' },
        { pattern: /^find\s+\.\s+-mtime\s+-24$/, message: '`-mtime` counts in days, not hours. `-mtime -1` means "less than 1 day ago".' },
        { pattern: /^find\s+\.\s+-name\s/, message: '`-name` matches filenames. For modification time, use `-mtime` instead.' },
        { pattern: /^find\s+\.\s+-time\s/, message: 'The flag is `-mtime` (modification time), not `-time`.' },
        { pattern: /^ls\s+-lt/, message: '`ls -lt` sorts by time but doesn\'t filter by age. Use `find . -mtime -1` for files modified in the last day.' },
      ],
      xp: 75,
    },
    {
      id: 'files-drill-4',
      prompt: 'Find all .tmp files and delete them in a single command. Be precise!',
      difficulty: 'hard',
      check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-delete$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'Combine `find` with the `-delete` action.',
        'First think about finding them: `find . -name "*.tmp"`. Then add `-delete` at the end.',
      ],
      feedbackRules: [
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/, message: 'That finds them! Now add `-delete` at the end to remove them: `find . -name "*.tmp" -delete`.' },
        { pattern: /^rm\s+.*\.tmp/, message: '`rm *.tmp` only deletes in the current directory. `find . -name "*.tmp" -delete` searches recursively.' },
        { pattern: /^find\s+\.\s+-delete\s+-name/, message: 'Order matters! Put `-name "*.tmp"` before `-delete`, or you\'ll delete everything!' },
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s*\|\s*rm/, message: 'Piping to `rm` is complex and fragile. `find` has a built-in `-delete` action — just append it.' },
        { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-exec\s+rm/, message: '`-exec rm` works but `-delete` is simpler and safer: `find . -name "*.tmp" -delete`.' },
        { pattern: /^find\s+\.\s+-type\s+f\s+-name\s+['"][*]\.tmp['"]\s+-delete$/, message: 'That works and is actually more precise! For this drill, `find . -name "*.tmp" -delete` is sufficient.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Cleanup Crew',
    scenario: 'This project directory is a mess — temp files everywhere, a missing config, and nobody knows what\'s in half these directories. Time to survey the damage and clean it up.',
    steps: [
      {
        id: 'boss-files-1',
        prompt: '> First, let\'s survey the damage. Find all .tmp files in the project so we know what we\'re dealing with.',
        check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/.test(cmd.trim()),
        expectedOutput: './cache/session.tmp\n./cache/data.tmp\n./tmp/upload.tmp\n./old.tmp',
        hints: ['Use `find` with `-name` to locate all .tmp files.'],
        feedbackRules: [
          { pattern: /^ls\s+.*\.tmp/, message: '`ls` only looks in the current directory. Use `find . -name "*.tmp"` to search everywhere.' },
          { pattern: /^find\s+\.\s+-name\s+[*]\.tmp$/, message: 'Remember to quote the pattern! Use `find . -name "*.tmp"` with quotes around *.tmp.' },
        ],
      },
      {
        id: 'boss-files-2',
        prompt: '> 4 temp files found! Let\'s get rid of them all. Delete every .tmp file in one command.',
        check: (cmd) => /^find\s+\.\s+-name\s+['"][*]\.tmp['"]\s+-delete$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Add `-delete` to your find command.'],
        feedbackRules: [
          { pattern: /^rm\s/, message: '`rm` can\'t find files recursively. Use `find . -name "*.tmp" -delete`.' },
          { pattern: /^find\s+\.\s+-name\s+['"][*]\.tmp['"]$/, message: 'That finds them but doesn\'t delete them! Add `-delete` at the end.' },
        ],
      },
      {
        id: 'boss-files-3',
        prompt: '> Great, temp files are gone. Now the team needs the backup config restored. Copy config.bak to config.txt.',
        check: (cmd) => /^cp\s+config\.bak\s+config\.txt$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `cp` to copy: `cp source destination`.'],
        feedbackRules: [
          { pattern: /^mv\s+config\.bak\s+config\.txt$/, message: '`mv` would delete the backup! Use `cp` to make a copy and keep the original.' },
          { pattern: /^cp\s+config\.txt\s+config\.bak$/, message: 'That\'s backwards! You want to copy FROM config.bak TO config.txt.' },
          { pattern: /^cat\s+config\.bak\s*>\s*config\.txt$/, message: 'That works but `cp` is the right tool for copying files: `cp config.bak config.txt`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-cleanup-crew',
  },

  achievements: ['file-finder', 'boss-cleanup-crew'],
};
