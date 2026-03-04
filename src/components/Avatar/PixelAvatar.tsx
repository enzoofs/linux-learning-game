import { useGameStore } from '../../stores/gameStore';
import { getItemById, getSpriteStyle, DEFAULT_CHARACTER_ROW, SPRITE_SHEETS } from '../../data/shopItems';
import type { SpriteRef } from '../../types';

interface PixelAvatarProps {
  size?: number; // display size of the character in px (default 64)
  className?: string;
  showSlots?: boolean; // show equipped item icons around avatar
}

const SLOT_LABELS: Record<string, string> = {
  helmet: '🪖',
  armor: '🛡️',
  weapon: '⚔️',
  accessory: '💎',
};

function SpriteIcon({ sprite, displaySize }: { sprite: SpriteRef; displaySize: number }) {
  return (
    <div
      style={getSpriteStyle(sprite.sheet, sprite.col, sprite.row, displaySize)}
      className="flex-shrink-0"
    />
  );
}

export function PixelAvatar({ size = 64, className = '', showSlots = false }: PixelAvatarProps) {
  const equippedItems = useGameStore((s) => s.equippedItems);

  // Determine active character skin
  const equippedSkin = equippedItems['skin'];
  const skinItem = equippedSkin ? getItemById(equippedSkin) : null;
  const charRow = skinItem?.characterRow ?? DEFAULT_CHARACTER_ROW;

  // Character sprite: column 1 (front idle) of the chosen row
  const charInfo = SPRITE_SHEETS.characters;
  const charStyle = {
    backgroundImage: `url(${import.meta.env.BASE_URL}sprites/${charInfo.file})`,
    backgroundPosition: `-${1 * size}px -${charRow * size}px`,
    backgroundSize: `${charInfo.cols * size}px ${charInfo.rows * size}px`,
    width: size,
    height: size,
    imageRendering: 'pixelated' as const,
  };

  // Collect equipped item sprites for slots
  const slotItems: { slot: string; sprite: SpriteRef }[] = [];
  for (const [slot, itemId] of Object.entries(equippedItems)) {
    if (slot === 'skin') continue;
    const item = getItemById(itemId);
    if (item?.sprite) {
      slotItems.push({ slot, sprite: item.sprite });
    }
  }

  const iconSize = Math.max(16, Math.round(size * 0.35));

  if (!showSlots) {
    // Compact mode: just the character
    return <div className={className} style={charStyle} />;
  }

  // Full mode: character + equipment slots
  return (
    <div className={`inline-flex flex-col items-center gap-1 ${className}`}>
      {/* Top slot: helmet */}
      <div className="flex justify-center" style={{ height: iconSize }}>
        {equippedItems['helmet'] ? (
          (() => {
            const item = getItemById(equippedItems['helmet']);
            return item?.sprite ? <SpriteIcon sprite={item.sprite} displaySize={iconSize} /> : null;
          })()
        ) : (
          <span className="text-slate-600 text-xs" style={{ fontSize: iconSize * 0.6 }}>{SLOT_LABELS.helmet}</span>
        )}
      </div>

      {/* Middle row: weapon - character - accessory */}
      <div className="flex items-center gap-1">
        <div className="flex justify-center items-center" style={{ width: iconSize, height: iconSize }}>
          {equippedItems['weapon'] ? (
            (() => {
              const item = getItemById(equippedItems['weapon']);
              return item?.sprite ? <SpriteIcon sprite={item.sprite} displaySize={iconSize} /> : null;
            })()
          ) : (
            <span className="text-slate-600" style={{ fontSize: iconSize * 0.6 }}>{SLOT_LABELS.weapon}</span>
          )}
        </div>

        <div style={charStyle} />

        <div className="flex justify-center items-center" style={{ width: iconSize, height: iconSize }}>
          {equippedItems['accessory'] ? (
            (() => {
              const item = getItemById(equippedItems['accessory']);
              return item?.sprite ? <SpriteIcon sprite={item.sprite} displaySize={iconSize} /> : null;
            })()
          ) : (
            <span className="text-slate-600" style={{ fontSize: iconSize * 0.6 }}>{SLOT_LABELS.accessory}</span>
          )}
        </div>
      </div>

      {/* Bottom slot: armor */}
      <div className="flex justify-center" style={{ height: iconSize }}>
        {equippedItems['armor'] ? (
          (() => {
            const item = getItemById(equippedItems['armor']);
            return item?.sprite ? <SpriteIcon sprite={item.sprite} displaySize={iconSize} /> : null;
          })()
        ) : (
          <span className="text-slate-600" style={{ fontSize: iconSize * 0.6 }}>{SLOT_LABELS.armor}</span>
        )}
      </div>
    </div>
  );
}
