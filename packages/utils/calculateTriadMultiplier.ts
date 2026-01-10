const rarities: { [key: string]: number } = {
  common: 2,
  uncommon: 2.5,
  rare: 3,
  epic: 4.5,
  legendary: 6,
  mythic: 12,
};

export const calculateTriadMultiplier = (raritiesbyUser: {
  [key: string]: boolean;
}): number => {
  return Object.keys(rarities).reduce((total, rarity) => {
    return raritiesbyUser[rarity] ? total + rarities[rarity] : total;
  }, 0);
};
