# Avatar + Loja — Design Document

## Overview
Add a pixel art avatar system with a shop where players spend XP on cosmetics, terminal themes, and power-ups.

## Avatar System
- 32x32px pixel art rendered via CSS box-shadow technique
- Layered: Base > Roupa > Chapeu > Oculos > Capa
- Each item = array of `[x, y, color]` pixels overlaid on base
- Displayed in: Layout header (small), Shop (large preview), Stats (profile)

## Shop (new "Loja" tab)

### Cosmetics (equippable)
| Item | Slot | Price | Min Tier |
|------|------|-------|----------|
| Bone hacker | hat | 50 XP | Recruit |
| Cartola | hat | 150 XP | Operator |
| Coroa terminal | hat | 500 XP | Specialist |
| Camiseta Linux | shirt | 100 XP | Recruit |
| Jaqueta hacker | shirt | 300 XP | Operator |
| Armadura root | shirt | 800 XP | Commander |
| Oculos nerd | face | 75 XP | Recruit |
| Visor cyber | face | 200 XP | Operator |
| Capa sudo | cape | 400 XP | Specialist |
| Capa kernel | cape | 1000 XP | Commander |

### Terminal Themes
| Theme | Price |
|-------|-------|
| Matrix (green) | 150 XP |
| Dracula (purple) | 150 XP |
| Solarized | 200 XP |
| Cyberpunk neon | 300 XP |

### Power-ups (consumable)
| Power-up | Price | Effect |
|----------|-------|--------|
| Hint Extra x3 | 50 XP | 3 additional hints in any drill |
| Skip Token | 100 XP | Skip 1 drill without stat penalty |
| XP Boost x2 | 200 XP | Double XP for 1 full module |

## State Changes (GameState)
- `lifetimeXP: number` — total XP ever earned (used for tiers, never decreases)
- `spendableXP: number` — XP available to spend (lifetimeXP - total spent)
- `ownedItems: string[]` — IDs of purchased items
- `equippedItems: Record<string, string>` — slot -> itemId
- `activeTheme: string | null` — active terminal theme ID
- `powerUps: Record<string, number>` — powerUpId -> quantity

## XP Economy
- Current `totalXP` becomes `lifetimeXP` (migration on load)
- New `spendableXP` = lifetimeXP - sum of purchases
- Tiers based on `lifetimeXP` (buying items never regresses tier)
- `addXP()` increments both lifetimeXP and spendableXP

## New Components
- `src/components/Shop/Shop.tsx` — main shop view with tabs
- `src/components/Avatar/PixelAvatar.tsx` — renders layered pixel avatar
- `src/data/shopItems.ts` — all item definitions with pixel data

## Navigation
- Add `'shop'` to AppView type
- Tab order: Terminal | Mapa | Loja | Diario | Conquistas | Stats

## Power-up Integration (ModulePlayer)
- Hint Extra: when hints exhausted, offer to use from inventory
- Skip Token: skip drill without marking as "skipped" in stats
- XP Boost: activated at module start, doubles all XP in that module
