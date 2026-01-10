'use client';

import { useMarket } from '@/context/Market';

const OutcomeImage: React.FC = () => {
  const { selectedMarket } = useMarket();

  let imageSrc = '';
  let altText = '';

  switch (selectedMarket?.winningDirection) {
    case 'Hype':
      imageSrc = '/assets/img/outcome-hype.png';
      altText = 'Hype-outcome';
      break;
    case 'Flop':
      imageSrc = '/assets/img/outcome-flop.png';
      altText = 'flop-outcome';
      break;
    case 'Draw':
      imageSrc = '/assets/img/Draw.png';
      altText = 'draw-outcome';
      break;
    default:
      imageSrc = '';
      altText = '';
  }

  return (
    <div className="top-20 flex h-fit lg:fixed lg:w-auto">
      <img
        width={330}
        height={330}
        className="h-auto w-full min-w-[340px] max-w-[340px] object-cover"
        src={imageSrc}
        alt={altText}
      />
    </div>
  );
};

export default OutcomeImage;
