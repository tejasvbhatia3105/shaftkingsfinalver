import Silver from '@/assets/img/silver_place.webp';
import Gold from '@/assets/img/gold_place.webp';
import Bronze from '@/assets/img/bronze_place.webp';

export const rankingMapIcon = (rank: number | undefined): string => {
  switch (rank) {
    case 1:
      return Gold.src;
    case 2:
      return Silver.src;
    case 3:
      return Bronze.src;
    default:
      return '';
  }
};
