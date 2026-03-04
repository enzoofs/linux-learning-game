import { useMemo } from 'react';
import { useGameStore } from '../../stores/gameStore';
import { getItemById } from '../../data/shopItems';

// Base character pixels: [x, y, color]
// 16x16 pixel art humanoid
const SKIN = '#fbbf24';
const EYES = '#1e293b';
const BODY = '#22d3ee';
const PANTS = '#3b82f6';
const SHOES = '#1e293b';
const HAIR = '#92400e';

const BASE_PIXELS: [number, number, string][] = [
  // --- Hair (y=1) ---
  [6, 1, HAIR], [7, 1, HAIR], [8, 1, HAIR], [9, 1, HAIR],

  // --- Head top (y=2) ---
  [5, 2, HAIR], [6, 2, SKIN], [7, 2, SKIN], [8, 2, SKIN], [9, 2, SKIN], [10, 2, HAIR],

  // --- Head middle (y=3) - with eyes ---
  [5, 3, SKIN], [6, 3, EYES], [7, 3, SKIN], [8, 3, SKIN], [9, 3, EYES], [10, 3, SKIN],

  // --- Head lower (y=4) - mouth ---
  [5, 4, SKIN], [6, 4, SKIN], [7, 4, SKIN], [8, 4, SKIN], [9, 4, SKIN], [10, 4, SKIN],

  // --- Neck (y=5) ---
  [7, 5, SKIN], [8, 5, SKIN],

  // --- Body top / shoulders (y=6) ---
  [4, 6, SKIN], [5, 6, BODY], [6, 6, BODY], [7, 6, BODY], [8, 6, BODY], [9, 6, BODY], [10, 6, BODY], [11, 6, SKIN],

  // --- Body middle (y=7) ---
  [4, 7, SKIN], [5, 7, BODY], [6, 7, BODY], [7, 7, BODY], [8, 7, BODY], [9, 7, BODY], [10, 7, BODY], [11, 7, SKIN],

  // --- Body lower (y=8) ---
  [4, 8, SKIN], [5, 8, BODY], [6, 8, BODY], [7, 8, BODY], [8, 8, BODY], [9, 8, BODY], [10, 8, BODY], [11, 8, SKIN],

  // --- Belt / waist (y=9) ---
  [5, 9, BODY], [6, 9, BODY], [7, 9, BODY], [8, 9, BODY], [9, 9, BODY], [10, 9, BODY],

  // --- Legs top (y=10) ---
  [6, 10, PANTS], [7, 10, PANTS], [8, 10, PANTS], [9, 10, PANTS],

  // --- Legs middle (y=11) ---
  [6, 11, PANTS], [7, 11, PANTS], [8, 11, PANTS], [9, 11, PANTS],

  // --- Legs lower (y=12) ---
  [6, 12, PANTS], [7, 12, PANTS], [8, 12, PANTS], [9, 12, PANTS],

  // --- Feet (y=13) ---
  [5, 13, SHOES], [6, 13, SHOES], [7, 13, SHOES], [9, 13, SHOES], [10, 13, SHOES], [11, 13, SHOES],
];

interface PixelAvatarProps {
  size?: number;
  className?: string;
}

export function PixelAvatar({ size = 4, className = '' }: PixelAvatarProps) {
  const equippedItems = useGameStore((s) => s.equippedItems);

  const boxShadow = useMemo(() => {
    const allPixels: [number, number, string][] = [...BASE_PIXELS];

    // Overlay equipped items
    for (const itemId of Object.values(equippedItems)) {
      const item = getItemById(itemId);
      if (item?.pixels) {
        allPixels.push(...item.pixels);
      }
    }

    return allPixels
      .map(([x, y, color]) => `${x * size}px ${y * size}px 0 0 ${color}`)
      .join(', ');
  }, [equippedItems, size]);

  return (
    <div
      className={className}
      style={{
        width: 16 * size,
        height: 16 * size,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: size,
          height: size,
          boxShadow,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      />
    </div>
  );
}
