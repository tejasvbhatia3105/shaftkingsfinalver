import { useMarket } from '@/context/Market';
import Banner from './Banner';

const CarouselBanners = () => {
  const { currentMarketType } = useMarket();

  if (currentMarketType !== 'explore') {
    return null;
  }
  return (
    <div className="group relative mx-3 mt-2 md:mx-4 lg:mt-0">
      <div className="carousel-container">
        {Array.from({ length: 1 }).map((_, key) => {
          // if (false) {
          //   return <LoadingBanner key={key} />;
          // }
          return <Banner key={key} />;
        })}
      </div>
    </div>
  );
};

export default CarouselBanners;
