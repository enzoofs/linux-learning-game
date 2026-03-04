import { useState, useCallback } from 'react';
import type { ShopItem, ShopItemCategory } from '../../types';
import { useGameStore } from '../../stores/gameStore';
import { getItemsByCategory, getSpriteStyle, SPRITE_SHEETS } from '../../data/shopItems';
import { TIERS } from '../../data/tiers';
import { PixelAvatar } from '../Avatar/PixelAvatar';

type TabKey = ShopItemCategory;

const TABS: { key: TabKey; label: string }[] = [
  { key: 'skin', label: 'Skins' },
  { key: 'cosmetic', label: 'Equipamento' },
  { key: 'theme', label: 'Temas' },
  { key: 'powerup', label: 'Power-ups' },
];

function getTierIndex(tierName: string): number {
  return TIERS.findIndex((t) => t.name === tierName);
}

/** Preview for character skins */
function SkinPreview({ row, displaySize = 48 }: { row: number; displaySize?: number }) {
  const info = SPRITE_SHEETS.characters;
  return (
    <div
      style={{
        backgroundImage: `url(${import.meta.env.BASE_URL}sprites/${info.file})`,
        backgroundPosition: `-${1 * displaySize}px -${row * displaySize}px`,
        backgroundSize: `${info.cols * displaySize}px ${info.rows * displaySize}px`,
        width: displaySize,
        height: displaySize,
        imageRendering: 'pixelated',
      }}
      className="mx-auto"
    />
  );
}

/** Preview for equipment items (icons) */
function ItemSpritePreview({ item, displaySize = 32 }: { item: ShopItem; displaySize?: number }) {
  if (!item.sprite) return null;
  return (
    <div
      style={getSpriteStyle(item.sprite.sheet, item.sprite.col, item.sprite.row, displaySize)}
      className="mx-auto"
    />
  );
}

export function Shop() {
  const [activeTab, setActiveTab] = useState<TabKey>('skin');
  const [flashId, setFlashId] = useState<string | null>(null);

  const spendableXP = useGameStore((s) => s.spendableXP);
  const ownedItems = useGameStore((s) => s.ownedItems);
  const equippedItems = useGameStore((s) => s.equippedItems);
  const activeTheme = useGameStore((s) => s.activeTheme);
  const powerUps = useGameStore((s) => s.powerUps);
  const getCurrentTier = useGameStore((s) => s.getCurrentTier);
  const buyItem = useGameStore((s) => s.buyItem);
  const equipItem = useGameStore((s) => s.equipItem);
  const unequipItem = useGameStore((s) => s.unequipItem);
  const setTheme = useGameStore((s) => s.setTheme);

  const currentTier = getCurrentTier();
  const currentTierIndex = getTierIndex(currentTier.name);

  const items = getItemsByCategory(activeTab);

  const handleBuy = useCallback(
    (item: ShopItem) => {
      const success = buyItem(item);
      if (success) {
        setFlashId(item.id);
        setTimeout(() => setFlashId(null), 600);
      }
    },
    [buyItem],
  );

  const handleAction = useCallback(
    (item: ShopItem) => {
      const owned = ownedItems.includes(item.id);

      if (!owned) {
        handleBuy(item);
        return;
      }

      // Skins use the 'skin' slot
      if (item.category === 'skin') {
        const isEquipped = equippedItems['skin'] === item.id;
        if (isEquipped) {
          unequipItem('skin');
        } else {
          equipItem('skin', item.id);
        }
        return;
      }

      if (item.category === 'cosmetic' && item.slot) {
        const isEquipped = equippedItems[item.slot] === item.id;
        if (isEquipped) {
          unequipItem(item.slot);
        } else {
          equipItem(item.slot, item.id);
        }
      }

      if (item.category === 'theme' && item.themeId) {
        if (activeTheme === item.themeId) {
          setTheme(null);
        } else {
          setTheme(item.themeId);
        }
      }

      if (item.category === 'powerup') {
        handleBuy(item);
      }
    },
    [ownedItems, equippedItems, activeTheme, handleBuy, equipItem, unequipItem, setTheme],
  );

  function getButtonInfo(item: ShopItem): {
    label: string;
    className: string;
    disabled: boolean;
  } {
    const owned = ownedItems.includes(item.id);
    const itemTierIndex = getTierIndex(item.minTier);
    const tierLocked = itemTierIndex > currentTierIndex;
    const cantAfford = spendableXP < item.price;

    if (tierLocked) {
      const tierDisplay = TIERS[itemTierIndex]?.displayName ?? item.minTier;
      return {
        label: `Requer ${tierDisplay}`,
        className: 'bg-slate-700 text-slate-500 cursor-not-allowed',
        disabled: true,
      };
    }

    if (item.category === 'powerup') {
      return {
        label: 'Comprar',
        className: cantAfford
          ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
          : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer',
        disabled: cantAfford,
      };
    }

    if (item.category === 'theme') {
      if (owned && activeTheme === item.themeId) {
        return { label: 'Desativar', className: 'bg-slate-600 hover:bg-slate-500 text-slate-200 cursor-pointer', disabled: false };
      }
      if (owned) {
        return { label: 'Ativar', className: 'bg-green-600 hover:bg-green-500 text-white cursor-pointer', disabled: false };
      }
      return {
        label: 'Comprar',
        className: cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer',
        disabled: cantAfford,
      };
    }

    // Skin or cosmetic
    if (owned) {
      const slot = item.category === 'skin' ? 'skin' : item.slot;
      const isEquipped = slot ? equippedItems[slot] === item.id : false;
      if (isEquipped) {
        return { label: 'Desequipar', className: 'bg-slate-600 hover:bg-slate-500 text-slate-200 cursor-pointer', disabled: false };
      }
      return { label: 'Equipar', className: 'bg-green-600 hover:bg-green-500 text-white cursor-pointer', disabled: false };
    }

    return {
      label: 'Comprar',
      className: cantAfford ? 'bg-slate-700 text-slate-500 cursor-not-allowed' : 'bg-cyan-600 hover:bg-cyan-500 text-white cursor-pointer',
      disabled: cantAfford,
    };
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 max-w-4xl mx-auto">
      {/* Avatar + XP balance */}
      <div className="flex flex-col items-center gap-3">
        <PixelAvatar size={80} showSlots />
        <div className="flex items-center gap-2 text-lg font-bold text-amber-400">
          <span className="text-xl">🪙</span>
          <span>{spendableXP} XP</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1 bg-slate-900 rounded-lg p-1 border border-slate-700">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
              activeTab === tab.key
                ? 'bg-cyan-600 text-white'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Item grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {items.map((item) => {
          const btn = getButtonInfo(item);
          const owned = ownedItems.includes(item.id);
          const cantAfford = spendableXP < item.price;
          const isFlashing = flashId === item.id;

          return (
            <div
              key={item.id}
              className={`relative flex flex-col gap-2 p-4 rounded-lg border transition-all ${
                owned
                  ? 'bg-slate-800/80 border-cyan-800/50'
                  : 'bg-slate-800 border-slate-700'
              } ${isFlashing ? 'ring-2 ring-cyan-400 animate-pulse' : ''}`}
            >
              {/* Owned badge */}
              {owned && item.category !== 'powerup' && (
                <span className="absolute top-2 right-2 text-xs bg-cyan-900/60 text-cyan-300 px-2 py-0.5 rounded-full">
                  Adquirido
                </span>
              )}

              {/* Sprite preview */}
              <div className="flex justify-center py-2">
                {item.category === 'skin' && item.characterRow != null && (
                  <SkinPreview row={item.characterRow} displaySize={48} />
                )}
                {item.category === 'cosmetic' && item.sprite && (
                  <ItemSpritePreview item={item} displaySize={32} />
                )}
                {item.category === 'theme' && (
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-2xl">
                    🎨
                  </div>
                )}
                {item.category === 'powerup' && (
                  <div className="w-12 h-12 rounded-lg bg-slate-900 flex items-center justify-center text-2xl">
                    ⚡
                  </div>
                )}
              </div>

              {/* Name & description */}
              <h3 className="text-gray-200 font-semibold text-sm text-center">{item.name}</h3>
              <p className="text-slate-400 text-xs leading-relaxed text-center">{item.description}</p>

              {/* Power-up quantity */}
              {item.category === 'powerup' && item.powerUpId && (
                <p className="text-xs text-amber-400 text-center">
                  Quantidade: {powerUps[item.powerUpId] ?? 0}
                </p>
              )}

              {/* Price */}
              <div className="flex items-center justify-center gap-1 mt-auto">
                <span className="text-sm">🪙</span>
                <span
                  className={`text-sm font-mono font-bold ${
                    !owned && cantAfford ? 'text-red-400' : 'text-amber-400'
                  }`}
                >
                  {item.price} XP
                </span>
              </div>

              {/* Action button */}
              <button
                onClick={() => handleAction(item)}
                disabled={btn.disabled}
                className={`mt-1 w-full py-1.5 rounded-md text-sm font-medium transition-colors ${btn.className}`}
              >
                {btn.label}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
