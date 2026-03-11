# Art of CLI Quest

Plataforma gamificada para aprender terminal Linux — skill trees, boss fights e drills, do básico ao Docker.

![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6)
![React](https://img.shields.io/badge/React-19-61DAFB)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF)

## Funcionalidades

- **24 módulos** — do `ls` ao Docker, organizados em 8 tiers (Recruit → GrandMaster)
- **Loop de aprendizado** — Briefing → Sandbox → Drills → Boss Challenge por módulo
- **Skill tree visual** — grafo SVG com dependências entre módulos
- **Sistema de XP** — multiplier por streak (1.5x em 7 dias, 2x em 30 dias)
- **Boss challenges** — cenários multi-step que testam tudo do módulo
- **Sandbox** — ambiente livre com 20+ comandos pré-configurados por módulo
- **Achievements** — 10+ conquistas desbloqueáveis
- **Shop** — skins, equipamentos e temas compráveis com XP
- **Avatar pixel art** — customização estilo RPG com sprite sheets
- **Assistente IA** — chat contextual com OpenAI (opcional)
- **Filesystem virtual** — simula estrutura Linux real para prática

## Módulos

### Base (Recruit → Commander)
`cli-basics` → `files-navigation` → `pipes-streams` → `process-mgmt` → `text-processing` → `data-wrangling` → `system-admin` → `one-liner-legend`

### Secret Book (Initiate → GrandMaster)
Shell tricks, functions, find avançado, permissões, Vim, tmux, curl, SSH, disco, networking, Git, monitoramento, cron, logs, Docker, hardening

## Stack

| Componente | Tecnologia |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7.3 |
| Estilo | Tailwind CSS 4.2 |
| Animações | Framer Motion |
| Estado | Zustand (persistido em localStorage) |
| Testes | Vitest + Testing Library |

## Setup

```bash
npm install
npm run dev      # Dev server com HMR
npm run build    # Build para produção
npm run test     # Rodar testes
```

## Como funciona

Cada módulo segue o loop:

1. **Briefing** — conceito explicado com analogia, sintaxe e exemplos
2. **Sandbox** — terminal livre para experimentar os comandos
3. **Drills** — exercícios progressivos (easy → hard) com hints
4. **Boss** — desafio final com cenário real e múltiplos passos

O progresso salva automaticamente no `localStorage`. Sem backend necessário.

## Estrutura

```
src/
├── components/
│   ├── ModulePlayer/    # Orquestrador do loop de aprendizado
│   ├── Terminal/        # Display do terminal
│   ├── SkillTree/       # Grafo visual de módulos
│   ├── Shop/            # Loja de itens
│   └── Achievements/    # Sistema de conquistas
├── data/
│   └── modules/         # 24 módulos com briefing, sandbox, drills e boss
├── stores/
│   └── gameStore.ts     # Estado central (XP, progresso, inventário)
└── utils/
    ├── commandParser.ts # Validação de comandos + detecção de typos
    └── virtualFS.ts     # Filesystem virtual simulado
```
