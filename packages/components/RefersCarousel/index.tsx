'use client';

import { useMemo, useState } from 'react';

import type { Settings } from 'react-slick';
import Slider from 'react-slick';
import Avatar from '../Avatar';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import { truncateWallet } from '@/utils/truncateWallet';

interface ReferHistory {
  authority: string;
  amount: number;
}

const SliderTyped = Slider as unknown as React.ComponentClass<Settings>;

const MarketCard = ({ order }: { order: ReferHistory }) => {
  return (
    <div className="pr-2">
      <div className="flex h-[44px] min-w-[350px] items-center bg-white/[0.08] p-2">
        <Avatar size={28} seed={order.authority} />
        <div>
          <span className="ml-2.5 text-[#C0C0C0]">
            #{truncateWallet(order.authority, 12)}
          </span>
          <span className="ml-1 text-white">
            Received {order.amount.toFixed(2)} USDC
          </span>
        </div>
      </div>
    </div>
  );
};

const RefersCarousel = () => {
  const [loadingUsers, setLoadingUsers] = useState(false);
  const usersOrders = [
    {
      authority: 'F7pZQpCCjMeVNkGzvWVFZo1naU72HXHykgzqj4C8XM4X',
      amount: 5,
    },
    {
      authority: 'zz32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: 'xh32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: '10h32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: '7h32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: '5h32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: '2h32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
    {
      authority: '1h32fsXXG4WTPJbMyDY2J3fviSQDCzxbPv9suUaHGre9',
      amount: 7,
    },
  ] as ReferHistory[];

  const filteredOrders = useMemo(() => {
    return usersOrders;
  }, [usersOrders]);

  const settings = useMemo(() => {
    const slidesToShow = Math.min(filteredOrders.length, 4);
    return {
      dots: false,
      arrows: false,
      infinite: filteredOrders.length > slidesToShow,
      speed: 500,
      slidesToShow,
      slidesToScroll: 1,
      autoplay: filteredOrders.length > 1,
      autoplaySpeed: 2000,
      cssEase: 'linear',
      centerMode: filteredOrders.length > 1,
      variableWidth: filteredOrders.length > 1,
      responsive: [
        {
          breakpoint: 1920,
          settings: {
            slidesToShow: Math.min(filteredOrders.length, 3),
          },
        },
        {
          breakpoint: 1600,
          settings: {
            slidesToShow: Math.min(filteredOrders.length, 3),
          },
        },
        {
          breakpoint: 1280,
          settings: {
            slidesToShow: Math.min(filteredOrders.length, 2),
          },
        },
        {
          breakpoint: 768,
          settings: {
            centerMode: false,
            slidesToShow: 1,
          },
        },
      ],
    };
  }, [filteredOrders]);

  return (
    <div className="mt-16 w-full">
      <div className="max-w-[100vw]">
        {loadingUsers ? (
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, key) => (
              <div
                className="animate-loading h-[170px] w-full rounded-md lg:w-[430px]"
                key={key}
              ></div>
            ))}
          </div>
        ) : (
          <SliderTyped {...settings}>
            {filteredOrders.map((order, index) => (
              <div key={index}>
                <MarketCard order={order} />
              </div>
            ))}
          </SliderTyped>
        )}
      </div>
    </div>
  );
};

export default RefersCarousel;
