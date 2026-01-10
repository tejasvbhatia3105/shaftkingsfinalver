// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/ban-types */
export const RARITY_RANKS = {
  common: [999, 1663],
  uncommon: [583, 998],
  rare: [250, 582],
  epic: [84, 249],
  legendary: [18, 83],
  mythic: [1, 17],
};

type Rarity =
  | { common: {} }
  | { uncommon: {} }
  | { rare: {} }
  | { epic: {} }
  | { legendary: {} }
  | { mythic: {} };

export const getRarityNameByNft = (rarityRank: number): Rarity => {
  if (
    rarityRank >= RARITY_RANKS.mythic[0] &&
    rarityRank <= RARITY_RANKS.mythic[1]
  ) {
    return { mythic: {} };
  }

  if (
    rarityRank >= RARITY_RANKS.legendary[0] &&
    rarityRank <= RARITY_RANKS.legendary[1]
  ) {
    return { legendary: {} };
  }

  if (
    rarityRank >= RARITY_RANKS.epic[0] &&
    rarityRank <= RARITY_RANKS.epic[1]
  ) {
    return { epic: {} };
  }

  if (
    rarityRank >= RARITY_RANKS.rare[0] &&
    rarityRank <= RARITY_RANKS.rare[1]
  ) {
    return { rare: {} };
  }

  if (
    rarityRank >= RARITY_RANKS.uncommon[0] &&
    rarityRank <= RARITY_RANKS.uncommon[1]
  ) {
    return { uncommon: {} };
  }

  if (
    rarityRank >= RARITY_RANKS.common[0] &&
    rarityRank <= RARITY_RANKS.common[1]
  ) {
    return { common: {} };
  }

  return { common: {} };
};
