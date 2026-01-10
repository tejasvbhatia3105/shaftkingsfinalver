'use client';

import { Button } from '@/components/Button';
import { IconX } from '@/components/Icons';
import { Modal } from '@/components/Modal';
import { useMarket } from '@/context/Market';
import type { Order } from '@/types/market';
import { toPng } from 'html-to-image';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useTriad } from '@/context/Triad';
import MarketModalInfo from '../ModalClaimInfo';

type ClaimModalProps = {
  onCloseModal: () => void;
  openModal: boolean;
  order: Order;
  hiddenClaim?: boolean;
};

const ClaimModal: React.FC<ClaimModalProps> = ({
  openModal,
  onCloseModal,
  order,
  hiddenClaim = false,
}) => {
  const elementRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoadingShare, setLoadingShare] = useState(false);
  const { setUpdateAllOrdersNonce } = useTriad();
  const [loadingClaimOrder, setLoadingClaimOrder] = useState(false);
  const { claimPayoutOrder, setOpenModalPnlAfterClosePosition } = useMarket();

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setIsMobile(windowWidth < 1024);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const htmlToImageConvert = async () => {
    if (!elementRef.current) return;

    setLoadingShare(true);

    try {
      (elementRef.current as HTMLElement).style.borderRadius = '0px';

      const dataUrl = await toPng(elementRef.current as HTMLElement, {
        cacheBust: false,
        width: (elementRef.current as HTMLElement).offsetWidth,
        height: (elementRef.current as HTMLElement).offsetHeight,
        backgroundColor: 'transparent',
        pixelRatio: 2,
        skipAutoScale: true,
        style: {
          margin: '0',
          padding: '16px',
          backgroundColor: 'transparent',
          borderRadius: '0px',
        },
      });

      const link = document.createElement('a');
      link.download = 'my_order.png';
      link.href = dataUrl;
      link.click();

      const message =
        'Just hit a massive win on @shaftkings Profits are real! Get in and see for yourself.';
      const twitterUrl = `https://x.com/intent/tweet?text=${message}`;

      window.open(twitterUrl, '_blank');

      (elementRef.current as HTMLElement).style.borderRadius = '10px';
    } catch (error) {
      /* empty */
    } finally {
      setLoadingShare(false);
    }
  };

  const handleSubmit = useCallback(async () => {
    try {
      const marketId = Number(order.marketId);
      setLoadingClaimOrder(true);

      await claimPayoutOrder([
        {
          marketId,
          orderId: Number(order.orderId),
          userNonce: Number(order.userNonce),
          mint: new PublicKey(order.market?.mint),
          isTrdPayout: order.isTrdPayout,
          shares: order.shares,
          orderDirection: order.orderDirection,
        },
      ]);

      setUpdateAllOrdersNonce((prev) => prev + 1);
    } catch (error) {
      /* empty */
    } finally {
      setLoadingClaimOrder(false);
    }
  }, [
    order.marketId,
    order.orderDirection,
    order.market?.mint,
    order.orderId,
    order.userNonce,
    order.isTrdPayout,
    order.shares,
    claimPayoutOrder,
    setUpdateAllOrdersNonce,
  ]);

  return (
    <Modal
      className={{
        modal:
          'z-[9990] h-[540px] max-w-[530px] rounded-[10px] border border-white/15 bg-white p-4 backdrop-blur-2xl dark:bg-white/5 lg:h-[605px]',
      }}
      onClose={onCloseModal}
      isOpen={openModal}
    >
      <div className="flex w-full flex-col">
        <h4 className="text-center text-base text-shaftkings-dark-100 dark:text-white lg:text-xl">
          {(order.market?.winningDirection as 'Hype' | 'Flop') ===
          order.orderDirection
            ? 'Claim & Share My Prediction'
            : 'Share My Prediction'}
        </h4>
        <div
          ref={elementRef}
          className="mt-5 h-[435px] w-full rounded-[10px] bg-[url('/assets/img/modal-bg.png')] bg-cover bg-no-repeat p-4"
        >
          <div className=" flex w-full flex-col items-center justify-center gap-y-2 md:flex-row md:justify-between">
            <Image
              src="/assets/svg/logo-dark.svg"
              width={82}
              height={24}
              alt="triad-logo"
              style={{ backgroundColor: 'transparent' }}
            />
            <div className="relative top-0.5 flex w-full items-center justify-center gap-x-1 md:justify-end">
              {links.map((link, index) => (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-6 items-center gap-x-0.5 rounded-lg bg-shaftkings-dark-200 px-2 py-1"
                  key={index}
                >
                  <img
                    width={12}
                    height={12}
                    src={link.icon}
                    alt={link.label}
                  />
                  <span className="ml-1 text-[10px] leading-3 text-[#C0C0C0]">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
          <MarketModalInfo order={order} />
        </div>

        <div className="mt-6 flex items-center gap-x-2 text-base">
          {!hiddenClaim && !setOpenModalPnlAfterClosePosition && (
            <Button
              onClick={handleSubmit}
              disabled={loadingClaimOrder}
              loading={loadingClaimOrder}
              color="blue"
              className="flex h-14 w-full flex-1 items-center justify-center rounded-[1px] text-base font-semibold disabled:!bg-shaftkings-gold-200/60 disabled:text-white/80"
            >
              Claim
            </Button>
          )}

          <Button
            onClick={htmlToImageConvert}
            color="tertiary"
            loading={isLoadingShare}
            variant="outlined"
            className="hidden h-14 w-full flex-1 items-center justify-center gap-x-1 rounded-[1px] border border-white/10 bg-black/20 text-base font-semibold text-shaftkings-dark-100 transition-all dark:bg-white/[8%] dark:text-white lg:flex"
          >
            {isLoadingShare ? (
              <span className="text-sm">Uploading your image...</span>
            ) : (
              <div className="flex items-center gap-1.5">
                <IconX className="size-[16px]" />
                Share
              </div>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ClaimModal;

//
// utils
//

const links = [
  { icon: '/assets/svg/website.svg', label: 'app.triadfi.co', href: '/' },
  {
    icon: '/assets/svg/x.svg',
    label: '@triadFi',
    href: 'https://twitter.com/triadfi',
  },
  {
    icon: '/assets/svg/discord.svg',
    label: 'discord.gg/triadfi',
    href: 'https://discord.gg/triadfi',
  },
];
