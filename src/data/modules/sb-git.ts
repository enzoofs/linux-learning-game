import type { Module } from '../../types';

export const sbGitModule: Module = {
  id: 'sb-git',
  title: 'Git Avancado',
  description: 'Tecnicas avancadas de Git para controle total do historico.',
  tier: 'Master',
  prerequisites: ['sb-shell-functions'],
  isSideQuest: false,

  briefing: {
    concept:
      `Você já sabe fazer commit, push e pull. Agora é hora de dominar o Git de verdade — reescrever histórico, recuperar trabalho perdido e investigar bugs com precisão cirúrgica. Essas técnicas separam o iniciante do profissional.\n\n` +
      `• **git rebase -i** — Reescrita interativa do histórico: reordene, combine ou edite commits.\n` +
      `• **git cherry-pick** — Copia um commit específico de outra branch para a atual.\n` +
      `• **git bisect** — Busca binária automatizada para encontrar o commit que introduziu um bug.\n` +
      `• **git stash** — Salva alterações temporariamente sem fazer commit.\n` +
      `• **git reflog** — O "diário secreto" do Git: registra TUDO que aconteceu, mesmo após reset.\n` +
      `• **git blame** — Mostra quem alterou cada linha de um arquivo e quando.\n` +
      `• **git log --graph --oneline** — Visualização compacta e gráfica do histórico de branches.`,
    analogy:
      'Pense no histórico do Git como uma linha do tempo. `rebase -i` permite viajar no tempo e reorganizar eventos. `cherry-pick` é copiar um evento específico de uma timeline alternativa. `bisect` é um detetive que usa eliminação para encontrar onde algo deu errado. `stash` é uma gaveta onde você guarda trabalho inacabado. `reflog` é a caixa-preta que registra tudo — mesmo o que você tentou apagar.',
    syntax:
      'git stash [push -m "msg" | pop | list]\ngit rebase -i HEAD~N\ngit cherry-pick <commit-hash>\ngit bisect start / good / bad\ngit reflog\ngit blame <file>\ngit log --graph --oneline --all',
    examples: [
      { command: 'git stash push -m "wip: feature login"', output: 'Saved working directory and index state On main: wip: feature login', explanation: 'Salva as alterações atuais no stash com uma mensagem descritiva.' },
      { command: 'git stash list', output: 'stash@{0}: On main: wip: feature login\nstash@{1}: On main: debug temp', explanation: 'Lista todos os stashes salvos, do mais recente ao mais antigo.' },
      { command: 'git stash pop', output: 'On branch main\nChanges not staged for commit:\n  modified: src/login.ts\nDropped refs/stash@{0}', explanation: 'Restaura o stash mais recente e o remove da lista.' },
      { command: 'git rebase -i HEAD~3', output: 'pick a1b2c3d Add login page\npick e4f5g6h Fix typo\npick i7j8k9l Add tests\n# Rebase onto abc123', explanation: 'Abre editor interativo para reescrever os últimos 3 commits.' },
      { command: 'git cherry-pick a1b2c3d', output: '[main f9e8d7c] Add login validation\n 1 file changed, 15 insertions(+)', explanation: 'Copia o commit a1b2c3d para a branch atual, criando um novo commit.' },
      { command: 'git reflog', output: 'f9e8d7c HEAD@{0}: cherry-pick: Add login validation\na1b2c3d HEAD@{1}: checkout: moving from feature to main\n8k7j6i5 HEAD@{2}: commit: WIP save', explanation: 'Mostra o histórico completo de movimentações do HEAD.' },
    ],
  },

  sandbox: {
    commands: [
      { pattern: /^git\s+stash\s+push(\s+-m\s+.+)?$/, output: 'Saved working directory and index state On main: WIP changes' },
      { pattern: /^git\s+stash\s+list$/, output: 'stash@{0}: On main: WIP changes\nstash@{1}: On feature: debug session\nstash@{2}: On main: experiment with API' },
      { pattern: /^git\s+stash\s+pop$/, output: 'On branch main\nChanges not staged for commit:\n  modified:   src/app.ts\n  modified:   src/utils.ts\nDropped refs/stash@{0} (a1b2c3d4e5f6)' },
      { pattern: /^git\s+rebase\s+-i\s+HEAD~\d+$/, output: 'pick a1b2c3d feat: add user authentication\npick e4f5g6h fix: correct password validation\npick i7j8k9l test: add auth unit tests\n\n# Rebase abc1234..i7j8k9l onto abc1234 (3 commands)\n# p, pick = use commit\n# r, reword = use commit, but edit the commit message\n# s, squash = use commit, but meld into previous commit' },
      { pattern: /^git\s+cherry-pick\s+\S+$/, output: '[main c3d4e5f] feat: add user authentication\n Date: Mon Mar 3 14:30:00 2025 -0300\n 2 files changed, 45 insertions(+), 3 deletions(-)' },
      { pattern: /^git\s+bisect\s+start$/, output: 'status: waiting for both good and bad commits' },
      { pattern: /^git\s+bisect\s+(good|bad)(\s+\S+)?$/, output: 'Bisecting: 5 revisions left to test after this (roughly 3 steps)\n[d4e5f6a] refactor: extract validation logic' },
      { pattern: /^git\s+reflog$/, output: 'c3d4e5f HEAD@{0}: cherry-pick: feat: add user authentication\na1b2c3d HEAD@{1}: rebase -i (finish): returning to refs/heads/main\ne4f5g6h HEAD@{2}: rebase -i (squash): feat: add auth with tests\ni7j8k9l HEAD@{3}: commit: test: add auth unit tests\n8a9b0c1 HEAD@{4}: commit: fix: correct password validation\nf1e2d3c HEAD@{5}: commit: feat: add user authentication' },
      { pattern: /^git\s+blame\s+\S+$/, output: 'a1b2c3d4 (Enzo  2025-03-01 09:00:00 -0300  1) import express from \'express\';\ne4f5g6h8 (Maria 2025-03-02 14:30:00 -0300  2) import { authMiddleware } from \'./auth\';\ni7j8k9l0 (Enzo  2025-03-03 10:15:00 -0300  3) import { validateInput } from \'./utils\';' },
      { pattern: /^git\s+log\s+--graph\s+--oneline(\s+--all)?$/, output: '* c3d4e5f (HEAD -> main) feat: add user authentication\n| * f9e8d7c (feature/login) wip: login page\n|/\n* a1b2c3d refactor: extract validation logic\n* 8a9b0c1 fix: correct password validation\n* f1e2d3c initial commit' },
    ],
    contextHints: [
      'Tente `git stash list` para ver os stashes salvos.',
      'Use `git reflog` para ver o histórico completo de movimentações do HEAD.',
      'Teste `git log --graph --oneline --all` para uma visão gráfica das branches.',
      'Use `git blame src/app.ts` para ver quem alterou cada linha.',
      'Experimente `git rebase -i HEAD~3` para ver como funciona o rebase interativo.',
    ],
  },

  drills: [
    {
      id: 'git-drill-1',
      prompt: 'Você tem alterações não commitadas que precisa guardar temporariamente. Salve-as no stash com a mensagem "wip: refatoracao do modulo auth".',
      difficulty: 'easy',
      check: (cmd) => /^git\s+stash\s+push\s+-m\s+["']wip: refatoracao do modulo auth["']$/.test(cmd.trim()),
      expectedOutput: 'Saved working directory and index state On main: wip: refatoracao do modulo auth',
      hints: ['O `git stash` salva alterações temporariamente. Para adicionar uma mensagem, use `push -m`.', 'O comando completo é `git stash push -m "mensagem"`.'],
      feedbackRules: [
        { pattern: /^git\s+stash$/, message: '`git stash` sozinho funciona, mas este drill pede uma mensagem descritiva. Use `git stash push -m "..."`.'},
        { pattern: /^git\s+stash\s+save/, message: '`git stash save` é legado! Use `git stash push -m "..."` — é a forma moderna.' },
      ],
      xp: 80,
    },
    {
      id: 'git-drill-2',
      prompt: 'Você quer reescrever os últimos 4 commits da branch atual. Inicie um rebase interativo.',
      difficulty: 'medium',
      check: (cmd) => /^git\s+rebase\s+-i\s+HEAD~4$/.test(cmd.trim()),
      expectedOutput: 'pick a1b2c3d feat: add user authentication\npick e4f5g6h fix: correct password validation\npick i7j8k9l test: add auth unit tests\npick m1n2o3p docs: update README\n\n# Rebase onto abc1234 (4 commands)',
      hints: ['O rebase interativo usa a flag `-i` e precisa de uma referência de onde começar.', 'Para os últimos 4 commits, use `HEAD~4` como referência: `git rebase -i HEAD~4`.'],
      feedbackRules: [
        { pattern: /^git\s+rebase\s+HEAD/, message: 'Faltou a flag `-i` para ativar o modo interativo!' },
        { pattern: /^git\s+rebase\s+-i$/, message: 'Você precisa especificar quantos commits quer editar. Use `HEAD~4` para os últimos 4.' },
      ],
      xp: 80,
    },
    {
      id: 'git-drill-3',
      prompt: 'Existe um commit na branch `feature` com o hash `a3f7b2e` que você quer trazer para a branch atual. Copie esse commit.',
      difficulty: 'medium',
      check: (cmd) => /^git\s+cherry-pick\s+a3f7b2e$/.test(cmd.trim()),
      expectedOutput: '[main d8c9e0f] feat: add input validation\n 1 file changed, 12 insertions(+)',
      hints: ['Existe um comando que copia um commit específico de qualquer branch para a branch atual.', 'Use `git cherry-pick` seguido do hash do commit que deseja copiar.'],
      feedbackRules: [
        { pattern: /^git\s+merge/, message: '`merge` traz todos os commits de uma branch. Para um commit específico, use `cherry-pick`.' },
        { pattern: /^git\s+cherry-pick$/, message: 'Você precisa especificar o hash do commit! Use `git cherry-pick a3f7b2e`.' },
      ],
      xp: 80,
    },
    {
      id: 'git-drill-4',
      prompt: 'Você fez um `git reset --hard` por engano e perdeu commits! Mostre o registro de todas as movimentações do HEAD para encontrar o commit perdido.',
      difficulty: 'easy',
      check: (cmd) => /^git\s+reflog$/.test(cmd.trim()),
      expectedOutput: 'c3d4e5f HEAD@{0}: reset: moving to HEAD~3\nf9e8d7c HEAD@{1}: commit: feat: implement payment gateway\na1b2c3d HEAD@{2}: commit: feat: add cart functionality\ne4f5g6h HEAD@{3}: commit: feat: add product listing',
      hints: ['O Git mantém um log secreto de todas as operações. Esse log sobrevive até a resets.', 'O comando `git reflog` mostra o histórico completo de onde o HEAD esteve.'],
      feedbackRules: [
        { pattern: /^git\s+log/, message: '`git log` mostra o histórico de commits, mas após um reset os commits somem dele. Use `git reflog`!' },
        { pattern: /^git\s+show/, message: '`git show` mostra detalhes de um commit, mas você precisa encontrá-lo primeiro. Use `git reflog`.' },
      ],
      xp: 80,
    },
    {
      id: 'git-drill-5',
      prompt: 'Um bug apareceu em algum commit recente. Inicie o processo de busca binária do Git para encontrar o commit culpado.',
      difficulty: 'hard',
      check: (cmd) => /^git\s+bisect\s+start$/.test(cmd.trim()),
      expectedOutput: 'status: waiting for both good and bad commits',
      hints: ['O Git tem uma ferramenta de busca binária que testa commits automaticamente para encontrar onde um bug foi introduzido.', 'O processo começa com `git bisect start`. Depois, você marcaria commits como `good` ou `bad`.'],
      feedbackRules: [
        { pattern: /^git\s+bisect\s+good/, message: 'Antes de marcar commits, você precisa iniciar o bisect com `git bisect start`.' },
        { pattern: /^git\s+log.*--grep/, message: 'Buscar no log por mensagens é útil, mas `git bisect` faz uma busca binária automatizada nos commits.' },
      ],
      xp: 80,
    },
  ],

  boss: {
    title: 'O Historiador do Codigo',
    scenario: 'O repositório do projeto está uma bagunça: commits misturados, trabalho perdido após um reset acidental, e um bug misterioso introduzido em algum ponto do histórico. Você precisa usar suas habilidades avançadas de Git para colocar tudo em ordem.',
    steps: [
      {
        id: 'boss-git-1',
        prompt: '> Antes de mexer em qualquer coisa, salve suas alterações atuais no stash. Use a mensagem "backup: antes da limpeza".',
        check: (cmd) => /^git\s+stash\s+push\s+-m\s+["']backup: antes da limpeza["']$/.test(cmd.trim()),
        expectedOutput: 'Saved working directory and index state On main: backup: antes da limpeza',
        hints: ['Salve o trabalho atual antes de mexer no histórico. Use `git stash push -m`.', 'O comando é `git stash push -m "backup: antes da limpeza"`.'],
        feedbackRules: [
          { pattern: /^git\s+stash$/, message: 'Adicione uma mensagem descritiva com `push -m "backup: antes da limpeza"`.' },
        ],
      },
      {
        id: 'boss-git-2',
        prompt: '> Alguém fez um `reset --hard` e perdeu 3 commits importantes. Use o registro de movimentações do HEAD para encontrar o que foi perdido.',
        check: (cmd) => /^git\s+reflog$/.test(cmd.trim()),
        expectedOutput: 'a1b2c3d HEAD@{0}: reset: moving to HEAD~3\nf9e8d7c HEAD@{1}: commit: feat: implement checkout flow\nc4d5e6f HEAD@{2}: commit: feat: add shopping cart\nb7a8c9d HEAD@{3}: commit: feat: add product catalog',
        hints: ['O Git registra todas as operações, mesmo resets. Qual comando mostra esse histórico?', 'Use `git reflog` para ver todas as movimentações do HEAD.'],
        feedbackRules: [
          { pattern: /^git\s+log/, message: 'O `git log` não mostra commits perdidos após reset. Use `git reflog`!' },
        ],
      },
      {
        id: 'boss-git-3',
        prompt: '> Encontramos o commit perdido `f9e8d7c`. Traga-o de volta para a branch atual.',
        check: (cmd) => /^git\s+cherry-pick\s+f9e8d7c$/.test(cmd.trim()),
        expectedOutput: '[main g1h2i3j] feat: implement checkout flow\n 3 files changed, 87 insertions(+), 12 deletions(-)',
        hints: ['Você precisa copiar um commit específico para a branch atual.', 'Use `git cherry-pick f9e8d7c` para recuperar o commit perdido.'],
        feedbackRules: [
          { pattern: /^git\s+reset/, message: 'Cuidado com reset! Use `cherry-pick` para trazer o commit de volta com segurança.' },
        ],
      },
      {
        id: 'boss-git-4',
        prompt: '> Agora restaure suas alterações que estavam salvas no stash.',
        check: (cmd) => /^git\s+stash\s+pop$/.test(cmd.trim()),
        expectedOutput: 'On branch main\nChanges not staged for commit:\n  modified:   src/app.ts\n  modified:   src/utils.ts\nDropped refs/stash@{0} (a1b2c3d4e5f6)',
        hints: ['Você salvou alterações no stash no início. Agora precisa restaurá-las.', 'Use `git stash pop` para restaurar e remover o stash mais recente.'],
        feedbackRules: [
          { pattern: /^git\s+stash\s+apply/, message: '`apply` funciona, mas `pop` também remove o stash da lista. Use `git stash pop`.' },
        ],
      },
    ],
    xpReward: 250,
    achievementId: 'boss-code-historian',
  },

  achievements: ['git-advanced', 'boss-code-historian'],
};
