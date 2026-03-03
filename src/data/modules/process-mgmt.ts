import { Module } from '../../types';

export const processMgmtModule: Module = {
  id: 'process-mgmt',
  title: 'Process Management',
  description: 'Monitor, control, and manage running processes like a system administrator.',
  tier: 'Operator',
  prerequisites: ['cli-basics'],
  isSideQuest: false,

  briefing: {
    concept:
      `Every program you run on Linux becomes a **process** — an active instance with its own ID (PID), memory, and CPU usage. Understanding processes is essential for troubleshooting, performance tuning, and system administration.\n\n` +
      `**Viewing processes:**\n` +
      `• **ps** — Snapshot of your current shell's processes. Quick and simple.\n` +
      `• **ps aux** — Full system view: every process, every user, with CPU and memory usage.\n` +
      `• **top** — Real-time, live-updating dashboard of all processes sorted by resource usage.\n` +
      `• **pstree** — Shows processes as a tree, revealing parent-child relationships.\n\n` +
      `**Controlling processes:**\n` +
      `• **kill PID** — Sends the TERM signal to a process, politely asking it to stop.\n` +
      `• **kill -9 PID** — Sends the KILL signal, forcefully terminating the process. Use as a last resort.\n` +
      `• **Ctrl+Z** — Suspend (pause) a running foreground process.\n` +
      `• **bg** — Resume a suspended process in the background.\n` +
      `• **fg** — Bring a background process back to the foreground.\n` +
      `• **jobs** — List all background and suspended jobs in the current shell.`,
    analogy:
      'Processes are like workers in a factory. `ps` lets you see who\'s working, `kill` sends them home, and `top` is the factory floor manager watching everyone in real-time. `jobs` is your personal team roster, while `bg` and `fg` move workers between the back office and the front desk.',
    syntax:
      'ps                          # show your shell\'s processes\nps aux                       # show ALL processes with details\ntop                          # live process monitor (q to quit)\npstree                       # show process tree\nkill PID                     # send TERM signal (graceful stop)\nkill -9 PID                  # send KILL signal (force stop)\njobs                         # list background/suspended jobs\nbg [%job]                    # resume job in background\nfg [%job]                    # bring job to foreground',
    examples: [
      { command: 'ps', output: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps', explanation: 'Shows processes in your current terminal session. You always see at least your shell (bash) and the ps command itself.' },
      { command: 'ps aux', output: 'USER       PID %CPU %MEM    VSZ   RSS TTY  STAT START TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?   Ss   09:00 0:03 /sbin/init\nenzo      1234  0.0  0.0  21472  5204 pts/0 Ss 10:00 0:00 bash\nenzo      4523 99.0  5.2 312456 42000 ?    R  10:15 5:42 python train.py\n...', explanation: 'Shows ALL system processes. Note: `a` = all users, `u` = user-oriented format, `x` = include processes without a terminal.' },
      { command: 'kill 4523', output: '', explanation: 'Sends SIGTERM to PID 4523. The process gets a chance to clean up and exit gracefully.' },
      { command: 'kill -9 4523', output: '', explanation: 'Sends SIGKILL — instant death. The process cannot catch or ignore this signal. Use only if regular kill fails.' },
      { command: 'jobs', output: '[1]+  Stopped                 vim server.conf\n[2]-  Running                 python backup.py &', explanation: 'Lists jobs in your shell. Job 1 is stopped (Ctrl+Z\'d), Job 2 is running in the background.' },
      { command: 'fg %1', output: '(vim resumes in foreground)', explanation: 'Brings job 1 (vim) back to the foreground so you can interact with it.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^ps$/, output: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps', description: 'Show current shell processes' },
      { pattern: /^ps\s+aux$/, output: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\nroot        42  0.0  0.0  34568  2704 ?        Ss   09:00   0:00 /usr/sbin/cron\nwww-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      1234  0.0  0.0  21472  5204 pts/0    Ss   10:00   0:00 bash\nenzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nroot      3456  0.0  0.3  45672  2508 ?        Ss   09:00   0:01 /usr/sbin/sshd\nenzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5678  0.0  0.0  18340  1200 pts/0    R+   10:30   0:00 ps aux', description: 'Show all system processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/, output: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python', description: 'Find python processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?node['"]?$/, output: 'enzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep node', description: 'Find node processes' },
      { pattern: /^ps\s+aux\s*\|\s*grep\s+['"]?apache['"]?$/, output: 'www-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep apache', description: 'Find apache processes' },
      { pattern: /^top$/, output: 'top - 10:30:15 up 1:30, 1 user, load average: 2.50, 1.80, 0.95\nTasks: 128 total,   2 running, 126 sleeping,   0 stopped\n%Cpu(s): 52.3 us,  3.1 sy,  0.0 ni, 44.2 id,  0.4 wa\nMiB Mem :  7872.4 total,  2145.6 free,  3890.2 used,  1836.6 buff/cache\n\n  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND\n 4523 enzo      20   0  312456  42000  12340 R  99.0   5.2   5:42.13 python\n 2345 enzo      20   0  156432  17200   8400 S   0.5   2.1   0:30.45 node\n  110 www-data  20   0  298764  12340   5200 S   0.2   1.5   0:15.22 apache2\n    1 root      20   0  169316  11892   8456 S   0.0   0.1   0:03.12 init\n   42 root      20   0   34568   2704   2400 S   0.0   0.0   0:00.08 cron', description: 'Live process monitor' },
      { pattern: /^pstree$/, output: 'init─┬─cron\n     ├─sshd───bash───pstree\n     ├─apache2\n     └─bash─┬─node\n            └─python', description: 'Show process tree' },
      { pattern: /^kill\s+4523$/, output: '', description: 'Send TERM signal to PID 4523' },
      { pattern: /^kill\s+-9\s+4523$/, output: '', description: 'Force kill PID 4523' },
      { pattern: /^kill\s+\d+$/, output: '', description: 'Send TERM signal to a process' },
      { pattern: /^kill\s+-9\s+\d+$/, output: '', description: 'Force kill a process' },
      { pattern: /^jobs$/, output: '[1]+  Stopped                 vim server.conf\n[2]-  Running                 python backup.py &', description: 'List background jobs' },
      { pattern: /^fg\s+%?\d*$/, output: '(process resumed in foreground)', description: 'Bring job to foreground' },
      { pattern: /^bg\s+%?\d*$/, output: '[1]+ python backup.py &', description: 'Resume job in background' },
    ],
    contextHints: [
      'Try `ps` to see your current shell processes.',
      'Use `ps aux` to see ALL processes on the system — every user, every process.',
      'Use `top` for a live, real-time view of processes sorted by CPU usage.',
      'Find a specific process: `ps aux | grep python`.',
      'Kill a process with `kill PID` — use the PID from `ps` output.',
      'If a process won\'t die, use `kill -9 PID` to force it.',
      'Use `jobs` to see background/suspended processes in your shell.',
      'Use `pstree` to visualize process parent-child relationships.',
    ],
  },

  drills: [
    {
      id: 'process-drill-1',
      prompt: 'List the processes running in your current terminal session.',
      difficulty: 'easy',
      check: (cmd) => cmd.trim() === 'ps',
      expectedOutput: '  PID TTY          TIME CMD\n 1234 pts/0    00:00:00 bash\n 5678 pts/0    00:00:00 ps',
      hints: [
        'The command is just two letters. It stands for "process status".',
      ],
      feedbackRules: [
        { pattern: /^ps\s+aux/, message: 'That shows ALL system processes. For just your terminal\'s processes, plain `ps` is enough.' },
        { pattern: /^top$/, message: '`top` is a live monitor. For a simple snapshot, use `ps`.' },
        { pattern: /^processes/i, message: 'The command for listing processes is `ps` (process status).' },
        { pattern: /^ls$/, message: '`ls` lists files, not processes. Use `ps` to list processes.' },
      ],
      xp: 50,
    },
    {
      id: 'process-drill-2',
      prompt: 'Show ALL processes on the entire system, from every user, with full details (user, PID, CPU, memory).',
      difficulty: 'easy',
      check: (cmd) => /^ps\s+aux$/.test(cmd.trim()),
      expectedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\n...',
      hints: [
        'You need `ps` with three flags: `a` (all users), `u` (user format), `x` (include processes without a terminal).',
        'The command is: `ps aux`',
      ],
      feedbackRules: [
        { pattern: /^ps$/, message: 'Plain `ps` only shows your terminal\'s processes. Add `aux` to see everything: `ps aux`.' },
        { pattern: /^ps\s+-aux$/, message: 'Almost! The BSD-style flags don\'t use a dash: `ps aux` (not `ps -aux`).' },
        { pattern: /^ps\s+-ef$/, message: '`ps -ef` works too in practice! But this drill asks for the `aux` format: `ps aux`.' },
        { pattern: /^ps\s+a$/, message: 'You need all three flags: `a` (all users), `u` (user format), `x` (no-tty). Use `ps aux`.' },
      ],
      xp: 50,
    },
    {
      id: 'process-drill-3',
      prompt: 'A process with PID 1234 is misbehaving. Send it a termination signal to ask it to stop gracefully.',
      difficulty: 'medium',
      check: (cmd) => /^kill\s+1234$/.test(cmd.trim()),
      expectedOutput: '',
      hints: [
        'The command to stop a process is `kill` followed by the PID.',
        'For a graceful stop, just use `kill PID` — no extra flags needed.',
      ],
      feedbackRules: [
        { pattern: /^kill\s+-9\s+1234$/, message: '`kill -9` is a force kill — it doesn\'t give the process a chance to clean up. Try plain `kill 1234` first.' },
        { pattern: /^kill$/, message: 'You need to specify the PID: `kill 1234`.' },
        { pattern: /^stop\s+1234/i, message: '`stop` is not a standard command. Use `kill 1234` to send a termination signal.' },
        { pattern: /^kill\s+-SIGTERM\s+1234$/, message: 'That\'s technically correct! But `kill 1234` sends SIGTERM by default — no flag needed.' },
        { pattern: /^kill\s+-15\s+1234$/, message: 'Signal 15 is SIGTERM, which is the default. You can just use `kill 1234`.' },
      ],
      xp: 75,
    },
    {
      id: 'process-drill-4',
      prompt: 'Find all python processes running on the system. Use `ps aux` piped to a filter command.',
      difficulty: 'hard',
      check: (cmd) => /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/.test(cmd.trim()),
      expectedOutput: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python',
      hints: [
        'You need two commands connected by a pipe: one to list all processes, one to filter.',
        'Use `ps aux` to list processes, then pipe to `grep python` to filter.',
      ],
      feedbackRules: [
        { pattern: /^ps\s+aux$/, message: 'That shows all processes, but there are too many! Pipe to `grep python` to filter: `ps aux | grep python`.' },
        { pattern: /^grep\s+['"]?python['"]?\s*$/, message: '`grep` needs input. Pipe `ps aux` into it: `ps aux | grep python`.' },
        { pattern: /^ps\s+aux\s*\|\s*grep$/, message: 'You need to tell `grep` what to search for: `ps aux | grep python`.' },
        { pattern: /^ps\s*\|\s*grep\s+['"]?python['"]?$/, message: 'Plain `ps` only shows your terminal\'s processes. Use `ps aux` to search all processes: `ps aux | grep python`.' },
        { pattern: /^pgrep\s+python$/, message: '`pgrep` is a shortcut that exists in real Linux! But this drill asks you to practice pipes: `ps aux | grep python`.' },
      ],
      xp: 125,
    },
  ],

  boss: {
    title: 'The Runaway Process',
    scenario: 'A rogue process is eating 99% CPU and the server is grinding to a halt. Users are complaining. Find the runaway process and terminate it before the system becomes unresponsive!',
    steps: [
      {
        id: 'boss-process-1',
        prompt: '> Alarms are going off! The server is slow. First, get a full view of all running processes to see what\'s consuming resources.',
        check: (cmd) => /^ps\s+aux$/.test(cmd.trim()) || cmd.trim() === 'top',
        expectedOutput: 'USER       PID %CPU %MEM    VSZ   RSS TTY      STAT START   TIME COMMAND\nroot         1  0.0  0.1 169316 11892 ?        Ss   09:00   0:03 /sbin/init\nroot        42  0.0  0.0  34568  2704 ?        Ss   09:00   0:00 /usr/sbin/cron\nwww-data   110  0.2  1.5 298764 12340 ?        S    09:01   0:15 /usr/sbin/apache2\nenzo      1234  0.0  0.0  21472  5204 pts/0    Ss   10:00   0:00 bash\nenzo      2345  0.5  2.1 156432 17200 ?        S    10:05   0:30 node server.js\nroot      3456  0.0  0.3  45672  2508 ?        Ss   09:00   0:01 /usr/sbin/sshd\nenzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5678  0.0  0.0  18340  1200 pts/0    R+   10:30   0:00 ps aux',
        hints: ['Use `ps aux` or `top` to see all processes with resource usage.'],
        feedbackRules: [
          { pattern: /^ps$/, message: 'Plain `ps` only shows your terminal processes. Use `ps aux` to see ALL processes and their CPU usage.' },
          { pattern: /^ls/, message: '`ls` lists files. To see running processes, use `ps aux`.' },
        ],
      },
      {
        id: 'boss-process-2',
        prompt: '> You can see something using 99% CPU! It\'s a python process. Let\'s zoom in — filter the process list to show only python processes.',
        check: (cmd) => /^ps\s+aux\s*\|\s*grep\s+['"]?python['"]?$/.test(cmd.trim()),
        expectedOutput: 'enzo      4523 99.0  5.2 312456 42000 ?        R    10:15   5:42 python train.py\nenzo      5679  0.0  0.0  12340   540 pts/0    S+   10:30   0:00 grep python',
        hints: ['Pipe `ps aux` to `grep python` to isolate the python processes.'],
        feedbackRules: [
          { pattern: /^grep\s+['"]?python['"]?\s*$/, message: '`grep` needs input! Pipe from `ps aux`: `ps aux | grep python`.' },
          { pattern: /^ps\s+aux$/, message: 'That shows everything. Filter it: `ps aux | grep python`.' },
        ],
      },
      {
        id: 'boss-process-3',
        prompt: '> Found it! PID 4523 — `python train.py` — is the culprit at 99% CPU. Terminate it now!',
        check: (cmd) => /^kill\s+(-9\s+)?4523$/.test(cmd.trim()),
        expectedOutput: '',
        hints: ['Use `kill 4523` to send a termination signal. If it doesn\'t respond, use `kill -9 4523`.'],
        feedbackRules: [
          { pattern: /^kill\s+python/i, message: 'You need to kill by PID, not by name. The PID is 4523: `kill 4523`.' },
          { pattern: /^kill$/, message: 'Specify the PID! The rogue process is PID 4523: `kill 4523`.' },
          { pattern: /^kill\s+(?!(-9\s+)?4523)\d+$/, message: 'Check the PID! The rogue python process is PID 4523.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-runaway-process',
  },

  achievements: ['process-wrangler', 'boss-runaway-process'],
};
