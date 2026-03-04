import type { ShopItem, ShopItemCategory, TerminalLineType } from '../types';

// === Sprite Sheet Info ===
// Characters: RPGCharacterSprites32x32.png — 384×672, 32×32 per sprite, 12 cols × 21 rows
//   Front-facing idle = column 1 (center of walk cycle)
// Icons: armours.png (144×240, 9c×15r), weapons.png (128×144, 8c×9r),
//   potions.png (336×240, 21c×15r), consumables.png (704×272, 44c×17r), books.png (224×192, 14c×12r)
// All 16×16 per icon

export const SPRITE_SHEETS = {
  characters: { file: 'RPGCharacterSprites32x32.png', cellW: 32, cellH: 32, cols: 12, rows: 21 },
  armours: { file: 'armours.png', cellW: 16, cellH: 16, cols: 9, rows: 15 },
  weapons: { file: 'weapons.png', cellW: 16, cellH: 16, cols: 8, rows: 9 },
  potions: { file: 'potions.png', cellW: 16, cellH: 16, cols: 21, rows: 15 },
  consumables: { file: 'consumables.png', cellW: 16, cellH: 16, cols: 44, rows: 17 },
  books: { file: 'books.png', cellW: 16, cellH: 16, cols: 14, rows: 12 },
} as const;

export type SpriteSheetName = keyof typeof SPRITE_SHEETS;

/** Build the CSS background-position for a sprite in a sheet */
export function getSpriteStyle(sheet: SpriteSheetName, col: number, row: number, displaySize: number) {
  const info = SPRITE_SHEETS[sheet];
  return {
    backgroundImage: `url(${import.meta.env.BASE_URL}sprites/${info.file})`,
    backgroundPosition: `-${col * displaySize}px -${row * displaySize}px`,
    backgroundSize: `${info.cols * displaySize}px ${info.rows * displaySize}px`,
    width: displaySize,
    height: displaySize,
    imageRendering: 'pixelated' as const,
  };
}

// === Shop Items ===

export const SHOP_ITEMS: ShopItem[] = [
  // ── Skins: Different character sprites ─────────────────────────

  {
    id: 'skin-cavaleiro-vermelho',
    name: 'Cavaleiro Vermelho',
    description: 'Armadura vermelha de guerreiro',
    category: 'skin',
    price: 100,
    minTier: 'Recruit',
    characterRow: 2,
  },

  {
    id: 'skin-mago-azul',
    name: 'Mago Azul',
    description: 'Vestes arcanas de mago',
    category: 'skin',
    price: 100,
    minTier: 'Recruit',
    characterRow: 3,
  },

  {
    id: 'skin-paladino',
    name: 'Paladino',
    description: 'Armadura prateada reluzente',
    category: 'skin',
    price: 200,
    minTier: 'Operator',
    characterRow: 4,
  },

  {
    id: 'skin-ranger',
    name: 'Ranger',
    description: 'Couro leve de explorador',
    category: 'skin',
    price: 200,
    minTier: 'Operator',
    characterRow: 5,
  },

  {
    id: 'skin-assassino',
    name: 'Assassino',
    description: 'Manto sombrio de elite',
    category: 'skin',
    price: 350,
    minTier: 'Specialist',
    characterRow: 6,
  },

  {
    id: 'skin-clerigo',
    name: 'Clérigo',
    description: 'Vestes sagradas de cura',
    category: 'skin',
    price: 350,
    minTier: 'Specialist',
    characterRow: 7,
  },

  {
    id: 'skin-samurai',
    name: 'Samurai',
    description: 'Armadura oriental de mestre',
    category: 'skin',
    price: 500,
    minTier: 'Commander',
    characterRow: 16,
  },

  {
    id: 'skin-dragao',
    name: 'Cavaleiro Dragão',
    description: 'Armadura lendária dracônica',
    category: 'skin',
    price: 800,
    minTier: 'Commander',
    characterRow: 19,
  },

  // ── Equipment: Icons shown in slots around avatar ──────────────

  // Helmets (from armours.png)
  {
    id: 'helm-ferro',
    name: 'Elmo de Ferro',
    description: 'Proteção básica para a cabeça',
    category: 'cosmetic',
    price: 50,
    minTier: 'Recruit',
    slot: 'helmet',
    sprite: { sheet: 'armours', col: 0, row: 0 },
  },

  {
    id: 'helm-azul',
    name: 'Elmo Azul',
    description: 'Capacete azulado de cavaleiro',
    category: 'cosmetic',
    price: 100,
    minTier: 'Recruit',
    slot: 'helmet',
    sprite: { sheet: 'armours', col: 2, row: 0 },
  },

  {
    id: 'helm-dourado',
    name: 'Elmo Dourado',
    description: 'Capacete reluzente de comandante',
    category: 'cosmetic',
    price: 400,
    minTier: 'Specialist',
    slot: 'helmet',
    sprite: { sheet: 'armours', col: 6, row: 0 },
  },

  // Armor (from armours.png, lower rows = chest pieces)
  {
    id: 'armor-couro',
    name: 'Armadura de Couro',
    description: 'Proteção leve e flexível',
    category: 'cosmetic',
    price: 75,
    minTier: 'Recruit',
    slot: 'armor',
    sprite: { sheet: 'armours', col: 0, row: 6 },
  },

  {
    id: 'armor-ferro',
    name: 'Armadura de Ferro',
    description: 'Proteção sólida de metal',
    category: 'cosmetic',
    price: 200,
    minTier: 'Operator',
    slot: 'armor',
    sprite: { sheet: 'armours', col: 3, row: 6 },
  },

  {
    id: 'armor-ouro',
    name: 'Armadura Dourada',
    description: 'Proteção real para guerreiros',
    category: 'cosmetic',
    price: 500,
    minTier: 'Specialist',
    slot: 'armor',
    sprite: { sheet: 'armours', col: 6, row: 6 },
  },

  // Weapons (from weapons.png)
  {
    id: 'weapon-espada',
    name: 'Espada de Ferro',
    description: 'A fiel companheira do guerreiro',
    category: 'cosmetic',
    price: 75,
    minTier: 'Recruit',
    slot: 'weapon',
    sprite: { sheet: 'weapons', col: 0, row: 0 },
  },

  {
    id: 'weapon-espada-azul',
    name: 'Espada Arcana',
    description: 'Lâmina encantada com magia',
    category: 'cosmetic',
    price: 250,
    minTier: 'Operator',
    slot: 'weapon',
    sprite: { sheet: 'weapons', col: 2, row: 0 },
  },

  {
    id: 'weapon-espada-fogo',
    name: 'Espada de Fogo',
    description: 'Lâmina flamejante lendária',
    category: 'cosmetic',
    price: 600,
    minTier: 'Specialist',
    slot: 'weapon',
    sprite: { sheet: 'weapons', col: 4, row: 0 },
  },

  // Accessories (potions as talismans)
  {
    id: 'acc-pocao-vermelha',
    name: 'Poção de Vida',
    description: 'Talismã em forma de poção',
    category: 'cosmetic',
    price: 50,
    minTier: 'Recruit',
    slot: 'accessory',
    sprite: { sheet: 'potions', col: 0, row: 0 },
  },

  {
    id: 'acc-pocao-azul',
    name: 'Poção de Mana',
    description: 'Frasco mágico azul brilhante',
    category: 'cosmetic',
    price: 150,
    minTier: 'Operator',
    slot: 'accessory',
    sprite: { sheet: 'potions', col: 3, row: 0 },
  },

  {
    id: 'acc-grimorio',
    name: 'Grimório Arcano',
    description: 'Livro de encantamentos antigos',
    category: 'cosmetic',
    price: 350,
    minTier: 'Specialist',
    slot: 'accessory',
    sprite: { sheet: 'books', col: 0, row: 0 },
  },

  // ── Themes ───────────────────────────────────────────────────────

  {
    id: 'theme-matrix',
    name: 'Matrix',
    description: 'Terminal estilo Matrix - verde neon',
    category: 'theme',
    price: 150,
    minTier: 'Recruit',
    themeId: 'matrix',
  },

  {
    id: 'theme-dracula',
    name: 'Dracula',
    description: 'Tema roxo escuro classico',
    category: 'theme',
    price: 150,
    minTier: 'Recruit',
    themeId: 'dracula',
  },

  {
    id: 'theme-solarized',
    name: 'Solarized',
    description: 'Cores suaves para os olhos',
    category: 'theme',
    price: 200,
    minTier: 'Operator',
    themeId: 'solarized',
  },

  {
    id: 'theme-cyberpunk',
    name: 'Cyberpunk',
    description: 'Neon vibrante futurista',
    category: 'theme',
    price: 300,
    minTier: 'Specialist',
    themeId: 'cyberpunk',
  },

  // ── Power-ups ────────────────────────────────────────────────────

  {
    id: 'powerup-hint',
    name: 'Hint Extra',
    description: '3 dicas extras em qualquer exercicio',
    category: 'powerup',
    price: 50,
    minTier: 'Recruit',
    powerUpId: 'hint-extra',
    powerUpAmount: 3,
  },

  {
    id: 'powerup-skip',
    name: 'Token de Skip',
    description: 'Pule 1 exercicio sem penalidade',
    category: 'powerup',
    price: 100,
    minTier: 'Operator',
    powerUpId: 'skip-token',
    powerUpAmount: 1,
  },

  {
    id: 'powerup-xpboost',
    name: 'Boost de XP x2',
    description: 'XP em dobro por 1 modulo',
    category: 'powerup',
    price: 200,
    minTier: 'Specialist',
    powerUpId: 'xp-boost',
    powerUpAmount: 1,
  },
];

// === Terminal Themes ===

export const TERMINAL_THEMES: Record<string, Record<TerminalLineType, string>> = {
  matrix: {
    system: '#00ff41',
    input: '#39ff14',
    output: '#00ff41',
    success: '#7cff00',
    error: '#ff0040',
    hint: '#b3ff00',
    brief: '#00ff80',
    learned: '#00ffbf',
    levelup: '#ffff00',
    feedback: '#80ff00',
  },

  dracula: {
    system: '#6272a4',
    input: '#8be9fd',
    output: '#f8f8f2',
    success: '#50fa7b',
    error: '#ff5555',
    hint: '#f1fa8c',
    brief: '#bd93f9',
    learned: '#8be9fd',
    levelup: '#ffb86c',
    feedback: '#ff79c6',
  },

  solarized: {
    system: '#839496',
    input: '#268bd2',
    output: '#93a1a1',
    success: '#859900',
    error: '#dc322f',
    hint: '#b58900',
    brief: '#6c71c4',
    learned: '#2aa198',
    levelup: '#cb4b16',
    feedback: '#d33682',
  },

  cyberpunk: {
    system: '#ff00ff',
    input: '#00ffff',
    output: '#ff69b4',
    success: '#39ff14',
    error: '#ff0000',
    hint: '#ffff00',
    brief: '#ff00ff',
    learned: '#00ffff',
    levelup: '#ff6600',
    feedback: '#ff1493',
  },
};

// === Helper Functions ===

export function getItemsByCategory(category: ShopItemCategory): ShopItem[] {
  return SHOP_ITEMS.filter(item => item.category === category);
}

export function getItemById(id: string): ShopItem | undefined {
  return SHOP_ITEMS.find(item => item.id === id);
}

/** Default character row (row 1 = basic colored character) */
export const DEFAULT_CHARACTER_ROW = 1;
