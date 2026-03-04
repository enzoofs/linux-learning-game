# Avatar + Shop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add pixel art avatar, shop with cosmetics/themes/power-ups, and make XP a spendable currency.

**Architecture:** Split XP into lifetimeXP (tiers) and spendableXP (currency). Shop items defined as data. Avatar rendered via CSS box-shadow pixel art with layered equipment slots. Terminal themes applied via dynamic color map. Power-ups consumed in ModulePlayer.

**Tech Stack:** React, Zustand, TypeScript, CSS box-shadow pixel art, Tailwind CSS

---

### Task 1: Types & State — Add shop fields to GameState

**Files:**
- Modify: `src/types/index.ts:164-185`
- Modify: `src/stores/gameStore.ts:1-207`

**Step 1: Add shop-related types to types/index.ts**

After the `GameState` interface (line 183), add shop types. Also modify GameState to add new fields.

```typescript
// Add to GameState interface (after line 182, before closing brace):
  // Shop & Avatar
  lifetimeXP: number;
  spendableXP: number;
  ownedItems: string[];
  equippedItems: Record<string, string>;  // slot -> itemId
  activeTheme: string | null;
  powerUps: Record<string, number>;       // powerUpId -> quantity

// Update AppView (line 185):
export type AppView = 'terminal' | 'map' | 'shop' | 'journal' | 'achievements' | 'stats';

// Add new types after AppView:
export type ShopItemCategory = 'cosmetic' | 'theme' | 'powerup';
export type EquipmentSlot = 'hat' | 'shirt' | 'face' | 'cape';

export interface ShopItem {
  id: string;
  name: string;
  description: string;
  category: ShopItemCategory;
  price: number;
  minTier: TierName;
  slot?: EquipmentSlot;       // for cosmetics
  themeId?: string;           // for themes
  powerUpId?: string;         // for power-ups
  powerUpAmount?: number;     // quantity per purchase
  pixels?: [number, number, string][];  // pixel art data [x, y, color]
}
```

**Step 2: Update gameStore.ts — DEFAULT_STATE, addXP, new actions**

Add to DEFAULT_STATE:
```typescript
  lifetimeXP: 0,
  spendableXP: 0,
  ownedItems: [],
  equippedItems: {},
  activeTheme: null,
  powerUps: {},
```

Modify `addXP` action to increment both:
```typescript
  addXP: (amount) =>
    set((s) => {
      const multiplier = get().getXpMultiplier();
      const gained = Math.round(amount * multiplier);
      return {
        totalXP: s.totalXP + gained,         // keep for backward compat
        lifetimeXP: s.lifetimeXP + gained,
        spendableXP: s.spendableXP + gained,
      };
    }),
```

Modify `getCurrentTier` and `getNextTier` to use `lifetimeXP`:
```typescript
  getCurrentTier: () => getCurrentTier(get().lifetimeXP || get().totalXP),
  getNextTier: () => getNextTier(get().lifetimeXP || get().totalXP),
```

Add new actions to GameActions interface:
```typescript
  buyItem: (item: ShopItem) => boolean;
  equipItem: (slot: string, itemId: string) => void;
  unequipItem: (slot: string) => void;
  setTheme: (themeId: string | null) => void;
  usePowerUp: (powerUpId: string) => boolean;
```

Implement the actions:
```typescript
  buyItem: (item) => {
    const s = get();
    if (s.spendableXP < item.price) return false;
    if (item.category !== 'powerup' && s.ownedItems.includes(item.id)) return false;

    if (item.category === 'powerup' && item.powerUpId) {
      set({
        spendableXP: s.spendableXP - item.price,
        powerUps: {
          ...s.powerUps,
          [item.powerUpId]: (s.powerUps[item.powerUpId] || 0) + (item.powerUpAmount || 1),
        },
      });
    } else {
      set({
        spendableXP: s.spendableXP - item.price,
        ownedItems: [...s.ownedItems, item.id],
      });
    }
    return true;
  },

  equipItem: (slot, itemId) =>
    set((s) => ({ equippedItems: { ...s.equippedItems, [slot]: itemId } })),

  unequipItem: (slot) =>
    set((s) => {
      const { [slot]: _, ...rest } = s.equippedItems;
      return { equippedItems: rest };
    }),

  setTheme: (themeId) =>
    set({ activeTheme: themeId }),

  usePowerUp: (powerUpId) => {
    const s = get();
    const qty = s.powerUps[powerUpId] || 0;
    if (qty <= 0) return false;
    set({
      powerUps: { ...s.powerUps, [powerUpId]: qty - 1 },
    });
    return true;
  },
```

Add new actions to the auto-save subscriber destructuring (line 186-202).

**Step 3: Handle migration for existing saves**

In `loadState` return in gameStore.ts, after `...loadState(DEFAULT_STATE)`, the spread already handles new fields with defaults. But we need to migrate `totalXP` to `lifetimeXP`/`spendableXP` for existing players. Add a migration check right after the store is created:

```typescript
// After the store creation, before the subscriber:
// Migrate existing saves: if lifetimeXP is 0 but totalXP exists, copy it
const initialState = useGameStore.getState();
if (initialState.lifetimeXP === 0 && initialState.totalXP > 0) {
  useGameStore.setState({
    lifetimeXP: initialState.totalXP,
    spendableXP: initialState.totalXP,
  });
}
```

**Step 4: Build and verify**

Run: `npm run build`
Expected: No TypeScript errors

**Step 5: Commit**

```bash
git add src/types/index.ts src/stores/gameStore.ts
git commit -m "feat: add shop state, XP economy, and item management actions"
```

---

### Task 2: Shop Items Data — Define all items with pixel art

**Files:**
- Create: `src/data/shopItems.ts`

**Step 1: Create the shop items data file**

Define all cosmetics, themes, and power-ups. Pixel art is defined as `[x, y, color]` arrays. Each pixel is relative to a 16x16 grid (we'll scale up in the renderer).

The file exports:
- `SHOP_ITEMS: ShopItem[]` — all items
- `TERMINAL_THEMES: Record<string, Record<TerminalLineType, string>>` — color maps for each theme
- Helper: `getItemsByCategory(category)`
- Helper: `getItemById(id)`

Include ~10 cosmetics, 4 themes, 3 power-ups as defined in the design doc.

For pixel art, define simple recognizable shapes:
- Hat items: pixels above y=0 line (head area)
- Shirt items: pixels on torso area
- Face items: pixels on face area
- Cape items: pixels behind character

Theme color maps override the `LINE_COLORS` in Terminal.tsx.

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/data/shopItems.ts
git commit -m "feat: add shop items data with pixel art and terminal themes"
```

---

### Task 3: Pixel Avatar Component

**Files:**
- Create: `src/components/Avatar/PixelAvatar.tsx`

**Step 1: Create the PixelAvatar component**

Props: `size?: number` (scale factor, default 4), `className?: string`

The component:
1. Reads `equippedItems` and `ownedItems` from the store
2. Has a base character pixel art (always rendered)
3. For each equipped slot, overlays that item's pixels on top
4. Renders via a single `<div>` with `box-shadow` containing all pixels

The box-shadow technique: each pixel becomes one shadow entry:
```
box-shadow: Xpx Ypx 0 0 color, Xpx Ypx 0 0 color, ...
```

Scale by multiplying X/Y by the `size` factor. The div itself is `size x size` px (one pixel unit).

Base character: simple 16x16 humanoid figure (head, body, arms, legs) in a neutral pose using cyan/slate colors to match the game's palette.

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/Avatar/PixelAvatar.tsx
git commit -m "feat: add PixelAvatar component with CSS box-shadow rendering"
```

---

### Task 4: Shop Component

**Files:**
- Create: `src/components/Shop/Shop.tsx`

**Step 1: Create the Shop view component**

Layout:
- Top: Avatar preview (large, centered) + spendableXP balance
- Below: 3 category tabs (Cosmeticos | Temas | Power-ups)
- Grid of item cards per category

Each item card shows:
- Item name and description
- Price in XP
- Status: "Comprar" button / "Equipar"/"Desequipar" / "Já possui" / "XP insuficiente" / "Tier insuficiente"
- For cosmetics: small pixel preview of the item

Item card interactions:
- Click "Comprar" → calls `buyItem()`, shows feedback
- Click "Equipar" → calls `equipItem(slot, id)`
- Click "Desequipar" → calls `unequipItem(slot)`
- For themes: "Ativar"/"Desativar" buttons calling `setTheme()`
- For power-ups: shows quantity owned, "Comprar mais" button

Use the same dark theme as the rest of the app (bg-slate-800, borders, cyan accents).

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/Shop/Shop.tsx
git commit -m "feat: add Shop component with item purchase and equip UI"
```

---

### Task 5: Navigation & Layout Integration

**Files:**
- Modify: `src/components/Layout/Layout.tsx:11-17,20,60`
- Modify: `src/App.tsx:4,68-76`

**Step 1: Add shop tab to Layout**

In `NAV_TABS` array (line 11-17), add after 'map':
```typescript
  { id: 'shop', label: 'Loja' },
```

In the header (line 60), replace the simple XP display with XP + small avatar:
```typescript
<div className="flex items-center gap-2">
  <PixelAvatar size={3} />
  <div>
    <div className="text-amber-400 text-sm font-semibold">{lifetimeXP || totalXP} XP</div>
    <div className="text-[10px] text-slate-500">{spendableXP ?? totalXP} disponível</div>
  </div>
</div>
```

Import PixelAvatar and read `lifetimeXP`, `spendableXP` from store.

**Step 2: Add shop view to App.tsx**

Import Shop component. Add to the view rendering:
```typescript
{view === 'shop' && <Shop />}
```

**Step 3: Update XP bar to use lifetimeXP**

In Layout.tsx, the progress bar uses `totalXP`. Update to use `lifetimeXP || totalXP` for backward compatibility.

**Step 4: Build and verify**

Run: `npm run build`

**Step 5: Commit**

```bash
git add src/components/Layout/Layout.tsx src/App.tsx
git commit -m "feat: add shop tab to navigation and avatar to header"
```

---

### Task 6: Terminal Theming

**Files:**
- Modify: `src/components/Terminal/Terminal.tsx:16-27`

**Step 1: Make Terminal colors dynamic**

Read `activeTheme` from the store. If a theme is active, use the theme's color map instead of the default `LINE_COLORS`.

```typescript
import { useGameStore } from '../../stores/gameStore';
import { TERMINAL_THEMES } from '../../data/shopItems';

// Inside the component:
const activeTheme = useGameStore((s) => s.activeTheme);
const colors = activeTheme && TERMINAL_THEMES[activeTheme]
  ? TERMINAL_THEMES[activeTheme]
  : LINE_COLORS;
```

Then use `colors[line.type]` instead of `LINE_COLORS[line.type]` in the render.

**Step 2: Build and verify**

Run: `npm run build`

**Step 3: Commit**

```bash
git add src/components/Terminal/Terminal.tsx
git commit -m "feat: add dynamic terminal theming from shop"
```

---

### Task 7: Power-up Integration in ModulePlayer

**Files:**
- Modify: `src/components/ModulePlayer/ModulePlayer.tsx`

**Step 1: Add XP Boost support**

Add state: `const [xpBoostActive, setXpBoostActive] = useState(false);`

In the mode selection (after briefing), add an option to activate XP Boost if the player owns one:
- Check `store.powerUps['xp-boost'] > 0`
- If active, wrap `addXP()` calls to double the amount

**Step 2: Add Hint Extra support**

In the drill `hint` handler, after exhausting all hints:
- Check `store.powerUps['hint-extra'] > 0`
- If available, show: "Seus hints acabaram. Você tem Hint Extra! Digite 'hint' de novo para usar."
- On next `hint`, consume 1 and show a generic helpful hint

**Step 3: Build and verify**

Run: `npm run build`

**Step 4: Commit**

```bash
git add src/components/ModulePlayer/ModulePlayer.tsx
git commit -m "feat: integrate XP boost and hint extra power-ups"
```

---

### Task 8: Final Build, Test & Push

**Step 1: Full build**

Run: `npm run build`
Fix any errors.

**Step 2: Run tests**

Run: `npm test`
Fix any failures.

**Step 3: Commit and push**

```bash
git add -A
git commit -m "feat: complete avatar + shop system with cosmetics, themes, power-ups"
git push origin master:main
```
