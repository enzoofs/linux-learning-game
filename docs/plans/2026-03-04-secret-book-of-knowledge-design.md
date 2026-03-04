# The Secret Book of Knowledge — Design Document

## Overview

When a player completes all 6 base CLI Quest modules, a surprise reveal unlocks "The Secret Book of Knowledge" — a second chapter with 18 new modules covering the full scope of the [trimstray/the-book-of-secret-knowledge](https://github.com/trimstray/the-book-of-secret-knowledge) repository.

## Reveal Mechanism

- **Trigger**: All 6 base module IDs present in `completedModules` (challenge mode completion)
- **Experience**: Special terminal animation sequence after final boss completion
- **State**: `secretBookUnlocked: boolean` added to GameState (default `false`)
- **Secrecy**: Zero UI traces before unlock — no locked icons, no hints, nothing

### Reveal Sequence (terminal output)
```
> Todos os modulos completados...
> Desbloqueando conhecimento oculto...
> ################## 100%
> THE SECRET BOOK OF KNOWLEDGE foi revelado!
> "Ha mais no CLI do que voce imagina, jovem aprendiz..."
```

## New Tiers

Continuation of existing progression (after Commander):

| Tier Name   | Display Name  | XP Min | Icon | Color   |
|-------------|---------------|--------|------|---------|
| Initiate    | Iniciado      | 1000   | book | #a78bfa |
| Adept       | Adepto        | 2500   | crystal_ball | #c084fc |
| Master      | Mestre        | 5000   | zap  | #f59e0b |
| GrandMaster | Grao-Mestre   | 10000  | eye  | #ef4444 |

TierName type updated: `'Recruit' | 'Operator' | 'Specialist' | 'Commander' | 'Initiate' | 'Adept' | 'Master' | 'GrandMaster'`

## Modules (18 total)

### Initiate Tier (4 modules)
| # | ID | Title | Topics |
|---|---|---|---|
| 7 | sb-shell-tricks | Truques do Shell | History, !!, !$, brace expansion, globbing |
| 8 | sb-shell-functions | Funcoes Shell | Bash functions, aliases, .bashrc, variables |
| 9 | sb-advanced-find | Find Avancado | find -exec, -name, -type, -mtime, xargs |
| 10 | sb-permissions | Permissoes & Seguranca | chmod, chown, umask, sudo, su |

### Adept Tier (5 modules)
| # | ID | Title | Topics |
|---|---|---|---|
| 11 | sb-vim | Vim Mastery | Modes, navigation, search, replace, macros |
| 12 | sb-tmux | Terminal Multiplexer | tmux, sessions, panes, splits, detach/attach |
| 13 | sb-curl | HTTP & curl | curl flags, headers, POST, download, APIs |
| 14 | sb-ssh | SSH & Acesso Remoto | ssh, scp, keys, config, tunnels |
| 15 | sb-disk | Disco & Armazenamento | df, du, mount, lsblk, fdisk |

### Master Tier (5 modules)
| # | ID | Title | Topics |
|---|---|---|---|
| 16 | sb-networking | Redes & Diagnostico | ip, ss, netstat, ping, traceroute, dig |
| 17 | sb-git | Git Avancado | rebase, cherry-pick, bisect, stash, reflog |
| 18 | sb-monitoring | Monitoramento | htop, vmstat, iostat, free, uptime |
| 19 | sb-cron | Automacao & Cron | crontab, at, systemd timers |
| 20 | sb-logs | Analise de Logs | journalctl, syslog, dmesg, logrotate |

### GrandMaster Tier (4 modules)
| # | ID | Title | Topics |
|---|---|---|---|
| 21 | sb-docker | Docker | docker run/build/compose, images, volumes |
| 22 | sb-packages | Gerenciamento de Pacotes | apt, yum/dnf, brew, snap, compile from source |
| 23 | sb-oneliners | One-Liners Epicos | Advanced pipe combos, awk+sed+grep chains |
| 24 | sb-hardening | Hardening & Seguranca | iptables, fail2ban, openssl, audit |

## Prerequisites Graph

```
All 6 base modules
    |
    v
sb-shell-tricks
    |---> sb-shell-functions ---> sb-vim
    |         |                   sb-tmux
    |         |                   sb-curl ---> sb-ssh
    |         |                   sb-git
    |         |                   sb-cron
    |
    |---> sb-advanced-find
    |
    |---> sb-permissions ---> sb-disk ---> sb-networking ---> sb-docker
              |                               |               sb-hardening
              |                               |
              sb-system-monitoring ---> sb-logs ---> sb-oneliners
              sb-packages
```

## Technical Changes

### Types (types/index.ts)
- Add new tier names to TierName union
- Add `secretBookUnlocked: boolean` to GameState

### Tiers (data/tiers.ts)
- Add 4 new tier entries with colors/icons

### Game Store (stores/gameStore.ts)
- Add `secretBookUnlocked: false` to initial state
- Add migration for existing saves
- Add unlock check logic

### Module Files (data/modules/sb-*.ts)
- 18 new files, each following existing Module interface
- Each has: briefing, sandbox, 4-5 drills, boss challenge
- Prefixed with `sb-` to distinguish from base modules

### Module Index (data/modules/index.ts)
- Register all 18 new modules in ALL_MODULES

### MissionMap (components/MissionMap/MissionMap.tsx)
- Check `secretBookUnlocked` from store
- If true: render Secret Book section with visual divider
- If false: render nothing extra

### ModulePlayer (components/ModulePlayer/ModulePlayer.tsx)
- After boss completion: check if all 6 base modules now complete
- If yes: set `secretBookUnlocked: true`, show reveal sequence
