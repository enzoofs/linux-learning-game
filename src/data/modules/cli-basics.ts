import { Module } from '../../types';

export const cliBasicsModule: Module = {
  id: 'cli-basics',
  title: 'CLI Basics',
  description: 'Your first steps in the terminal — navigation, listing, and creating directories.',
  tier: 'Recruit',
  prerequisites: [],
  isSideQuest: false,

  briefing: {
    concept:
      `The terminal is your window into the system. Every command you type tells the computer exactly what to do — no clicking, no guessing. Let's start with the 4 most fundamental commands:\n\n` +
      `• **pwd** — "Where am I?" Prints your current directory.\n` +
      `• **ls** — "What's here?" Lists files and folders.\n` +
      `• **cd** — "Take me there." Changes your directory.\n` +
      `• **mkdir** — "Build something." Creates a new directory.`,
    analogy:
      'Think of the terminal as a building. `pwd` tells you which room you\'re in. `ls` shows you what\'s in the room. `cd` lets you walk to another room. `mkdir` builds a new room.',
    syntax:
      'pwd\nls [options] [path]\ncd [directory]\nmkdir [-p] directory',
    examples: [
      { command: 'pwd', output: '/home/enzo', explanation: 'Shows your current location — the home directory.' },
      { command: 'ls', output: 'Desktop  Documents  Downloads  Music', explanation: 'Lists everything in the current directory.' },
      { command: 'ls -l', output: 'drwxr-xr-x 2 enzo enzo 4096 Desktop\n...', explanation: 'Long format: shows permissions, owner, size, date.' },
      { command: 'cd Documents', output: '', explanation: 'Moves into the Documents directory. Use `cd` alone to go home.' },
      { command: 'mkdir projects', output: '', explanation: 'Creates a new directory called "projects".' },
      { command: 'mkdir -p a/b/c', output: '', explanation: 'Creates nested directories in one shot with -p.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^pwd$/, output: '/home/enzo' },
      { pattern: /^ls$/, output: 'Desktop  Documents  Downloads  Music  Pictures  scripts  .bashrc  .profile' },
      { pattern: /^ls\s+-l/, output: 'total 32\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads\ndrwxr-xr-x 2 enzo enzo 4096 Feb 28 11:00 Music\ndrwxr-xr-x 3 enzo enzo 4096 Mar 01 16:45 Pictures\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 10:00 scripts\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\n-rw-r--r-- 1 enzo enzo  807 Jan 01 00:00 .profile' },
      { pattern: /^ls\s+-a/, output: '.  ..  .bashrc  .profile  .ssh  Desktop  Documents  Downloads  Music  Pictures  scripts' },
      { pattern: /^cd\s+\w+/, output: '' },
      { pattern: /^cd$/, output: '' },
      { pattern: /^mkdir\s+/, output: '' },
      { pattern: /^whoami$/, output: 'enzo' },
      { pattern: /^hostname$/, output: 'linux-quest' },
    ],
    contextHints: [
      'Try typing `pwd` to see where you are!',
      'Use `ls` to see what files are in the current directory.',
      'Try `ls -l` to see detailed file information.',
      'Use `cd Documents` to navigate into a folder.',
      'Create a directory with `mkdir mydir`.',
    ],
  },

  drills: [
    {
      id: 'basics-drill-1',
      prompt: 'Where are you right now? Print your current working directory.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'pwd',
      expectedOutput: '/home/enzo',
      hints: ['The command is 3 letters: p_d'],
      feedbackRules: [
        { pattern: /^cwd$/i, message: '`cwd` is not a command — try `pwd` (print working directory).' },
        { pattern: /^where/i, message: 'In the terminal, we use `pwd` instead of "where".' },
      ],
      xp: 50,
    },
    {
      id: 'basics-drill-2',
      prompt: 'List all files including hidden ones (files starting with a dot).',
      difficulty: 'easy',
      check: (cmd) => /^ls\s+-a$/.test(cmd.trim()),
      expectedOutput: '.  ..  .bashrc  .profile  .ssh  Desktop  Documents  Downloads  Music  Pictures  scripts',
      hints: ['Use `ls` with a flag. Hidden files start with `.` — the flag is `-a` (all).'],
      feedbackRules: [
        { pattern: /^ls$/, message: 'Good start! But `ls` alone hides dotfiles. Add `-a` to show all.' },
        { pattern: /^ls\s+-l$/, message: '`-l` gives long format. To see hidden files, use `-a`.' },
        { pattern: /^ls\s+-la/, message: 'That works in practice! But for this drill, just `ls -a` is what we need.' },
      ],
      xp: 50,
    },
    {
      id: 'basics-drill-3',
      prompt: 'Navigate into the Documents directory.',
      difficulty: 'medium',
      check: (cmd) => /^cd\s+Documents\/?$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['Use `cd` followed by the directory name.'],
      feedbackRules: [
        { pattern: /^cd\s+documents/i, message: 'Almost! Linux is case-sensitive. Use `Documents` with a capital D.' },
        { pattern: /^cd$/, message: '`cd` alone goes to your home directory. Specify the folder: `cd Documents`.' },
      ],
      xp: 75,
    },
    {
      id: 'basics-drill-4',
      prompt: 'Create a nested directory structure: `projects/src/components` — all at once, even if parent dirs don\'t exist.',
      difficulty: 'medium',
      check: (cmd) => /^mkdir\s+-p\s+projects\/src\/components$/.test(cmd.trim()),
      expectedOutput: '',
      hints: ['`mkdir` alone can\'t create nested dirs. You need a flag that creates parents too...', 'The flag is `-p` (parents).'],
      feedbackRules: [
        { pattern: /^mkdir\s+projects\/src\/components$/, message: 'This would fail because `projects/` doesn\'t exist yet! Use `-p` to create parents.' },
        { pattern: /^mkdir\s+-p\s+projects$/, message: 'You\'re creating only `projects/`. The full path is `projects/src/components`.' },
      ],
      xp: 100,
    },
    {
      id: 'basics-drill-5',
      prompt: 'List the contents of the current directory in long format, sorted by modification time (newest last), including hidden files.',
      difficulty: 'hard',
      check: (cmd) => {
        const trimmed = cmd.trim();
        if (!/^ls\s+-[latr]+$/.test(trimmed)) return false;
        const flags = trimmed.replace('ls -', '');
        return flags.includes('l') && flags.includes('a') && flags.includes('t') && flags.includes('r');
      },
      expectedOutput: '-rw-r--r-- 1 enzo enzo  807 Jan 01 00:00 .profile\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\ndrwxr-xr-x 2 enzo enzo 4096 Feb 28 11:00 Music\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 3 enzo enzo 4096 Mar 01 16:45 Pictures\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 10:00 scripts',
      hints: [
        'You need 4 flags: long format, all files, sort by time, reverse order.',
        'The flags are: `-l` (long) `-a` (all) `-t` (time sort) `-r` (reverse).',
      ],
      feedbackRules: [
        { pattern: /^ls\s+-l$/, message: 'That\'s long format. Now add `-a` (all), `-t` (time), `-r` (reverse).' },
        { pattern: /^ls\s+-la$/, message: 'Good, long + all! Add `-t` for time sort and `-r` for reverse.' },
        { pattern: /^ls\s+-lat$/, message: 'Almost! Add `-r` to reverse the order (oldest first, newest last).' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Navigator',
    scenario: 'You\'ve just SSH\'d into a new server. Orient yourself: find where you are, explore the file system, and set up your project workspace.',
    steps: [
      {
        id: 'boss-basics-1',
        prompt: '> You\'ve just connected to the server. First things first — where are you?',
        check: (cmd) => cmd.trim() === 'pwd',
        expectedOutput: '/home/enzo',
        hints: ['Start with the basics. Print your working directory.'],
        feedbackRules: [],
      },
      {
        id: 'boss-basics-2',
        prompt: '> Good, you\'re home. Now look around — what files and folders are here? Show ALL of them, including hidden ones, with full details.',
        check: (cmd) => /^ls\s+/.test(cmd.trim()) && cmd.includes('l') && cmd.includes('a'),
        expectedOutput: 'total 40\ndrwxr-xr-x 8 enzo enzo 4096 Mar 03 10:00 .\ndrwxr-xr-x 3 root root 4096 Jan 01 00:00 ..\n-rw-r--r-- 1 enzo enzo  220 Jan 01 00:00 .bashrc\ndrwx------ 2 enzo enzo 4096 Mar 01 08:00 .ssh\ndrwxr-xr-x 2 enzo enzo 4096 Mar 01 09:00 Desktop\ndrwxr-xr-x 5 enzo enzo 4096 Mar 02 14:30 Documents\ndrwxr-xr-x 2 enzo enzo 4096 Mar 03 08:15 Downloads',
        hints: ['Combine `-l` (long) and `-a` (all) flags.'],
        feedbackRules: [
          { pattern: /^ls$/, message: 'You need more detail! Add `-la` to see hidden files and permissions.' },
        ],
      },
      {
        id: 'boss-basics-3',
        prompt: '> Time to set up your workspace. Create the directory structure: `projects/cli-quest/src` — all at once.',
        check: (cmd) => /^mkdir\s+-p\s+projects\/cli-quest\/src$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Remember `-p` for creating parent directories.'],
        feedbackRules: [],
      },
      {
        id: 'boss-basics-4',
        prompt: '> Now navigate into your new project directory.',
        check: (cmd) => /^cd\s+projects\/cli-quest(\/src)?\/?$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['`cd` into the directory you just created.'],
        feedbackRules: [],
      },
    ],
    xpReward: 200,
    achievementId: 'boss-navigator',
  },

  achievements: ['first-steps', 'boss-navigator'],
};
