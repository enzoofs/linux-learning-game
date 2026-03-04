# Secret Book of Knowledge — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 18 new modules that unlock as a surprise "Chapter 2" when the player completes all 6 base modules.

**Architecture:** Extend existing tier/module system with 4 new tiers and 18 module files. Add `secretBookUnlocked` flag to GameState. MissionMap conditionally renders Secret Book section. ModulePlayer triggers reveal animation on final base module completion.

**Tech Stack:** React, TypeScript, Zustand, existing Module interface

---

### Task 1: Extend Tiers & Types

**Files:**
- Modify: `src/types/index.ts` (TierName, GameState)
- Modify: `src/data/tiers.ts` (TIERS array)

**Step 1: Update TierName type**

In `src/types/index.ts`, change:
```typescript
export type TierName = 'Recruit' | 'Operator' | 'Specialist' | 'Commander';
```
To:
```typescript
export type TierName = 'Recruit' | 'Operator' | 'Specialist' | 'Commander' | 'Initiate' | 'Adept' | 'Master' | 'GrandMaster';
```

**Step 2: Add secretBookUnlocked to GameState**

In `src/types/index.ts`, add to GameState interface after `powerUps`:
```typescript
secretBookUnlocked: boolean;
```

**Step 3: Add new tiers to TIERS array**

In `src/data/tiers.ts`, add after Commander:
```typescript
{ name: 'Initiate', displayName: 'Iniciado', color: '#a78bfa', icon: '📖', minXP: 2000 },
{ name: 'Adept', displayName: 'Adepto', color: '#c084fc', icon: '🔮', minXP: 3500 },
{ name: 'Master', displayName: 'Mestre', color: '#f59e0b', icon: '⚡', minXP: 6000 },
{ name: 'GrandMaster', displayName: 'Grao-Mestre', color: '#ef4444', icon: '👁️', minXP: 12000 },
```

**Step 4: Update game store initial state and migration**

In `src/stores/gameStore.ts`, add `secretBookUnlocked: false` to initial state and migration block.

**Step 5: Build and verify**

Run: `npm run build`
Expected: Clean build, no errors.

**Step 6: Commit**
```
feat: add Secret Book tiers and secretBookUnlocked state
```

---

### Task 2: Reveal Mechanism (ModulePlayer)

**Files:**
- Modify: `src/components/ModulePlayer/ModulePlayer.tsx`

**Step 1: Define BASE_MODULE_IDS constant**

At top of file (after imports):
```typescript
const BASE_MODULE_IDS = ['cli-basics', 'pipes-streams', 'files-nav', 'process-mgmt', 'text-processing', 'data-wrangling'];
```

**Step 2: Add reveal logic after boss completion**

In the boss completion block (after `completeModule(module.id)` around line 398), add:
```typescript
// Check if all base modules are now complete — trigger Secret Book reveal
const updatedCompleted = [...completedModules, module.id];
const allBaseComplete = BASE_MODULE_IDS.every(id => updatedCompleted.includes(id));
if (allBaseComplete && !store.secretBookUnlocked) {
  // Reveal animation
  setTimeout(() => {
    terminal.addLine({ type: 'system', text: '' });
    terminal.addLine({ type: 'system', text: '> Todos os modulos completados...' });
    setTimeout(() => {
      terminal.addLine({ type: 'system', text: '> Desbloqueando conhecimento oculto...' });
      setTimeout(() => {
        terminal.addLine({ type: 'system', text: '> ################## 100%' });
        setTimeout(() => {
          terminal.addLine({ type: 'levelup', text: '📖 THE SECRET BOOK OF KNOWLEDGE foi revelado!' });
          terminal.addLine({ type: 'learned', text: '"Ha mais no CLI do que voce imagina, jovem aprendiz..."' });
          terminal.addLine({ type: 'system', text: '' });
          terminal.addLine({ type: 'success', text: '18 novos modulos foram adicionados ao Mapa de Missoes!' });
          useGameStore.getState().unlockSecretBook();
        }, 800);
      }, 600);
    }, 600);
  }, 1500);
}
```

**Step 3: Add unlockSecretBook action to store**

In `src/stores/gameStore.ts`, add action:
```typescript
unlockSecretBook: () => set({ secretBookUnlocked: true }),
```

**Step 4: Build and verify**

Run: `npm run build`

**Step 5: Commit**
```
feat: add Secret Book reveal animation on base completion
```

---

### Task 3: MissionMap Secret Book Section

**Files:**
- Modify: `src/components/MissionMap/MissionMap.tsx`

**Step 1: Import ALL_MODULES and check secretBookUnlocked**

Add to component:
```typescript
const secretBookUnlocked = useGameStore((s) => s.secretBookUnlocked);
```

**Step 2: Filter Secret Book tiers conditionally**

The existing `tierGroups` logic already groups modules by tier using `TIERS`. Since the new tiers (Initiate, Adept, Master, GrandMaster) are in TIERS and the new modules use those tiers, they will automatically appear in the map IF their modules are registered.

Add after the existing `tierGroups` rendering, before the legend:
```typescript
{/* Secret Book divider — only shows when unlocked and SB modules exist */}
{secretBookUnlocked && tierGroups.some(g => ['Initiate', 'Adept', 'Master', 'GrandMaster'].includes(g.tier.name) && g.modules.length > 0) && (
  <div className="my-8 flex items-center gap-3">
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
    <span className="text-purple-400 text-xs font-bold tracking-widest uppercase whitespace-nowrap">
      📖 The Secret Book of Knowledge
    </span>
    <div className="flex-1 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
  </div>
)}
```

But we also need to HIDE Secret Book tiers when not unlocked. Modify the tierGroups rendering:
```typescript
{tierGroups.map(({ tier, modules }) => {
  if (modules.length === 0) return null;
  // Hide Secret Book tiers when not unlocked
  const isSecretBookTier = ['Initiate', 'Adept', 'Master', 'GrandMaster'].includes(tier.name);
  if (isSecretBookTier && !secretBookUnlocked) return null;
  // ... rest of rendering
```

Insert the divider just before the first Secret Book tier renders (check tier name in the map).

**Step 3: Build and verify**

Run: `npm run build`

**Step 4: Commit**
```
feat: add Secret Book section to MissionMap with unlock gate
```

---

### Task 4: Module — sb-shell-tricks (Truques do Shell)

**Files:**
- Create: `src/data/modules/sb-shell-tricks.ts`
- Modify: `src/data/modules/index.ts` (add import + register)

**Content requirements:**
- ID: `sb-shell-tricks`
- Tier: `Initiate`
- Prerequisites: all 6 base module IDs
- Topics: history (!!, !$, !n), brace expansion ({a,b,c}), globbing (*, ?, []), CTRL shortcuts (CTRL+R, CTRL+A/E, CTRL+K/U), command substitution $()
- Briefing: explain shell tricks as "atalhos secretos"
- Sandbox: ~10 commands covering history expansion, brace expansion, globbing
- Drills (5): use `!!`, use `!$`, brace expansion, globbing pattern, CTRL+R search
- Boss: "O Mago dos Atalhos" — multi-step scenario combining tricks

Follow exact structure of `cli-basics.ts`. All text in Portuguese. Min 2 hints per drill/boss step.

**Commit:** `feat: add sb-shell-tricks module`

---

### Task 5: Module — sb-shell-functions (Funcoes Shell)

**Files:**
- Create: `src/data/modules/sb-shell-functions.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-shell-functions`, Tier: `Initiate`, Prerequisites: `['sb-shell-tricks']`
- Topics: bash functions, aliases, environment variables, .bashrc/.bash_profile, export, source
- Drills (5): create alias, write function, export variable, source a file, use $PATH
- Boss: "O Arquiteto do Shell"

**Commit:** `feat: add sb-shell-functions module`

---

### Task 6: Module — sb-advanced-find (Find Avancado)

**Files:**
- Create: `src/data/modules/sb-advanced-find.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-advanced-find`, Tier: `Initiate`, Prerequisites: `['sb-shell-tricks']`
- Topics: find -name, -type, -size, -mtime, -exec, -delete, xargs, locate
- Drills (5): find by name, find by type+size, find -exec, find -mtime, xargs pipeline
- Boss: "O Rastreador de Arquivos"

**Commit:** `feat: add sb-advanced-find module`

---

### Task 7: Module — sb-permissions (Permissoes & Seguranca)

**Files:**
- Create: `src/data/modules/sb-permissions.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-permissions`, Tier: `Initiate`, Prerequisites: `['sb-shell-tricks']`
- Topics: chmod (octal+symbolic), chown, chgrp, umask, sudo, su, /etc/passwd, /etc/group
- Drills (5): chmod octal, chmod symbolic, chown, umask, sudo command
- Boss: "O Guardiao das Permissoes"

**Commit:** `feat: add sb-permissions module`

---

### Task 8: Module — sb-vim (Vim Mastery)

**Files:**
- Create: `src/data/modules/sb-vim.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-vim`, Tier: `Adept`, Prerequisites: `['sb-shell-functions']`
- Topics: modes (normal/insert/visual/command), navigation (hjkl, w/b/e, gg/G), editing (dd, yy, p, u), search (/pattern, n/N), substitute (:%s), macros (q)
- Drills (5): enter insert mode, delete line, search pattern, substitute, save and quit
- Boss: "O Mestre do Editor"

**Commit:** `feat: add sb-vim module`

---

### Task 9: Module — sb-tmux (Terminal Multiplexer)

**Files:**
- Create: `src/data/modules/sb-tmux.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-tmux`, Tier: `Adept`, Prerequisites: `['sb-shell-functions']`
- Topics: tmux new-session, split-window (-h/-v), select-pane, list-sessions, attach, detach, resize-pane, copy-mode
- Drills (5): create session, split horizontal, split vertical, detach, list+attach
- Boss: "O Multitarefa"

**Commit:** `feat: add sb-tmux module`

---

### Task 10: Module — sb-curl (HTTP & curl)

**Files:**
- Create: `src/data/modules/sb-curl.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-curl`, Tier: `Adept`, Prerequisites: `['sb-shell-functions']`
- Topics: curl GET, POST (-X POST -d), headers (-H), follow redirects (-L), download (-o/-O), verbose (-v), silent (-s), jq piping
- Drills (5): basic GET, POST with data, custom header, download file, pipe to jq
- Boss: "O Explorador de APIs"

**Commit:** `feat: add sb-curl module`

---

### Task 11: Module — sb-ssh (SSH & Acesso Remoto)

**Files:**
- Create: `src/data/modules/sb-ssh.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-ssh`, Tier: `Adept`, Prerequisites: `['sb-curl']`
- Topics: ssh user@host, ssh-keygen, ssh-copy-id, scp, ssh config (~/.ssh/config), port forwarding (-L/-R), ssh-agent
- Drills (5): connect to host, generate key pair, copy file with scp, config shortcut, port forward
- Boss: "O Tuneleiro"

**Commit:** `feat: add sb-ssh module`

---

### Task 12: Module — sb-disk (Disco & Armazenamento)

**Files:**
- Create: `src/data/modules/sb-disk.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-disk`, Tier: `Adept`, Prerequisites: `['sb-permissions']`
- Topics: df (-h), du (-sh, --max-depth), mount, umount, lsblk, fdisk -l, ln (symlinks), tar (create/extract)
- Drills (5): check disk space, find large dirs, create symlink, create tar archive, extract tar
- Boss: "O Administrador de Disco"

**Commit:** `feat: add sb-disk module`

---

### Task 13: Module — sb-networking (Redes & Diagnostico)

**Files:**
- Create: `src/data/modules/sb-networking.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-networking`, Tier: `Master`, Prerequisites: `['sb-curl', 'sb-disk']`
- Topics: ip addr, ip route, ss (-tulnp), ping, traceroute, dig, nslookup, host, netcat (nc), /etc/hosts, /etc/resolv.conf
- Drills (5): show IP, list listening ports, ping host, DNS lookup with dig, traceroute
- Boss: "O Diagnosticador de Redes"

**Commit:** `feat: add sb-networking module`

---

### Task 14: Module — sb-git (Git Avancado)

**Files:**
- Create: `src/data/modules/sb-git.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-git`, Tier: `Master`, Prerequisites: `['sb-shell-functions']`
- Topics: git rebase (-i), cherry-pick, bisect, stash (push/pop/list), reflog, blame, log --graph, diff --staged, reset (--soft/--mixed/--hard)
- Drills (5): interactive rebase, cherry-pick commit, stash changes, use reflog, git bisect
- Boss: "O Historiador do Codigo"

**Commit:** `feat: add sb-git module`

---

### Task 15: Module — sb-monitoring (Monitoramento)

**Files:**
- Create: `src/data/modules/sb-monitoring.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-monitoring`, Tier: `Master`, Prerequisites: `['sb-permissions']`
- Topics: top/htop, free (-h), uptime, vmstat, iostat, sar, /proc/cpuinfo, /proc/meminfo, lscpu, nproc
- Drills (5): check memory usage, check CPU info, monitor processes, check disk I/O, check uptime/load
- Boss: "O Vigilante do Sistema"

**Commit:** `feat: add sb-monitoring module`

---

### Task 16: Module — sb-cron (Automacao & Cron)

**Files:**
- Create: `src/data/modules/sb-cron.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-cron`, Tier: `Master`, Prerequisites: `['sb-shell-functions']`
- Topics: crontab (-e, -l, -r), cron syntax (* * * * *), at, batch, systemd timers, /etc/cron.d/, anacron
- Drills (5): list crontab, add daily job, add specific time job, use at for one-time, cron every 5 minutes
- Boss: "O Relojoeiro"

**Commit:** `feat: add sb-cron module`

---

### Task 17: Module — sb-logs (Analise de Logs)

**Files:**
- Create: `src/data/modules/sb-logs.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-logs`, Tier: `Master`, Prerequisites: `['sb-monitoring']`
- Topics: journalctl (-u, -f, --since, --until), /var/log/, syslog, dmesg, logrotate, tail -f, last, lastlog
- Drills (5): view recent logs, follow service logs, filter by time, check kernel messages, view login history
- Boss: "O Detetive de Logs"

**Commit:** `feat: add sb-logs module`

---

### Task 18: Module — sb-docker (Docker)

**Files:**
- Create: `src/data/modules/sb-docker.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-docker`, Tier: `GrandMaster`, Prerequisites: `['sb-networking']`
- Topics: docker run, docker build, docker ps, docker images, docker exec, docker logs, docker-compose up/down, Dockerfile basics, volumes (-v), port mapping (-p)
- Drills (5): run container, list running containers, exec into container, build from Dockerfile, docker-compose up
- Boss: "O Capitao dos Containers"

**Commit:** `feat: add sb-docker module`

---

### Task 19: Module — sb-packages (Gerenciamento de Pacotes)

**Files:**
- Create: `src/data/modules/sb-packages.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-packages`, Tier: `GrandMaster`, Prerequisites: `['sb-permissions']`
- Topics: apt (update, install, remove, search, list), dpkg, yum/dnf, rpm, snap, flatpak, brew, ./configure && make && make install
- Drills (5): update package list, install package, search for package, remove package, compile from source
- Boss: "O Curador de Pacotes"

**Commit:** `feat: add sb-packages module`

---

### Task 20: Module — sb-oneliners (One-Liners Epicos)

**Files:**
- Create: `src/data/modules/sb-oneliners.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-oneliners`, Tier: `GrandMaster`, Prerequisites: `['sb-logs', 'sb-git']`
- Topics: complex pipe chains, awk+sed+grep combos, process substitution <(), while read loops, parallel execution (&, wait, xargs -P), command grouping ({})
- Drills (5): multi-pipe analysis, awk field extraction + sort + uniq, sed multi-replace, while read loop, xargs parallel
- Boss: "O Lendario One-Liner"

**Commit:** `feat: add sb-oneliners module`

---

### Task 21: Module — sb-hardening (Hardening & Seguranca)

**Files:**
- Create: `src/data/modules/sb-hardening.ts`
- Modify: `src/data/modules/index.ts`

**Content:**
- ID: `sb-hardening`, Tier: `GrandMaster`, Prerequisites: `['sb-networking', 'sb-logs']`
- Topics: iptables/nftables basics, ufw, fail2ban, openssl (certificates, encryption), auditd, SELinux/AppArmor basics, passwd/shadow, PAM
- Drills (5): list firewall rules, add iptables rule, generate SSL cert, check audit logs, lock user account
- Boss: "O Sentinela"

**Commit:** `feat: add sb-hardening module`

---

### Task 22: Register All Modules & Final Build

**Files:**
- Modify: `src/data/modules/index.ts`
- Modify: `src/data/skillTree.ts`

**Step 1: Add all 18 imports and register in ALL_MODULES**

Add imports for all `sb-*.ts` files and add them to ALL_MODULES array (after the 6 base modules).

**Step 2: Add Secret Book modules to SKILL_TREE_NODES**

Add entries for all 18 sb-* modules with appropriate connections matching the prerequisite graph from the design doc. These are needed for MissionMap's MODULE_ORDER.

**Step 3: Build and run tests**

Run: `npm run build && npm test`
Expected: Clean build, all tests pass.

**Step 4: Commit and push**
```
feat: register all 18 Secret Book modules
```
Then push: `git push origin master:main`
