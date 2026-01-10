'use client';

import { cn } from '@/utils/cn';
import { MontserratFont } from '@/utils/fonts';

export default function Banner() {
  return (
    <div className="relative w-full overflow-hidden shadow-xl lg:h-auto">
      {/* <div className="bg-banner-img absolute inset-0 bg-cover " /> */}
      <img
        src="/assets/img/home-bg.webp"
        alt="banner"
        className="hidden w-full lg:block"
      />
      <img
        src="/assets/img/mobile-banner.webp"
        alt="banner"
        className="block w-full object-cover lg:hidden"
      />

      <div className="absolute bottom-0 z-[5] flex size-full h-[200px] max-h-[400px] items-end justify-center bg-gradient-to-b from-transparent to-black pb-10 2xl:pb-[2.3vw]">
        <div
          className={cn(
            ' flex flex-col items-center justify-center w-fit mx-auto h-auto z-10',
            MontserratFont.className
          )}
        >
          <span className="min-w-[1920px]:text-6xl mt-2 text-3xl font-light leading-[37px] text-white 2xl:text-[2.3vw] 2xl:leading-[2.3vw]">
            THE WORLD&apos;S FIRST
          </span>
          <span className="min-w-[1920px]:text-6xl text-3xl font-semibold leading-[37px] text-white 2xl:text-[2.3vw] 2xl:leading-[2.5vw]">
            CRICKET PREDICTION MARKET
          </span>
          <span className="min-w-[1920px]:text-2xl text-base font-normal leading-[30px] text-white 2xl:text-[1.4vw] 2xl:leading-[1.4vw]">
            START PREDICTING NOW
          </span>
        </div>
      </div>
    </div>
  );
}
