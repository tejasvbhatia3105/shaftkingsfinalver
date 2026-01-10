export function getImageByRank(pos: number) {
  let imageUrl = '';

  switch (pos) {
    case 0:
      imageUrl = '/assets/img/league-gold.webp';
      break;
    case 1:
      imageUrl = '/assets/img/league-silver.webp';
      break;
    case 2:
      imageUrl = '/assets/img/league-bronze.webp';
      break;
    case 3:
      imageUrl = '/assets/img/league-azure.webp';
      break;
    default:
      imageUrl = '/assets/img/league-azure.webp';
      break;
  }

  return imageUrl;
}
