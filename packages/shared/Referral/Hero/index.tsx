'use client';

import Link from 'next/link';
import {
  IconClose,
  IconCopyWhite,
  IconQrCode,
  IconTelegram,
  IconWhatsapp,
  IconX,
} from '@/components/Icons';
import { copyToClipboard } from '@/utils/copyToClipboard';
import { useTriad } from '@/context/Triad';
import { useMemo, useState } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const Hero = () => {
  const { connectedUser } = useTriad();
  const [showQR, setShowQR] = useState(false);

  const shareUrl = useMemo(
    () => `https://www.cricket.cricket/?ref=${connectedUser?.name}`,
    [connectedUser?.name]
  );
  const message = useMemo(
    () => `Join me on Cricket and earn up to $100,000!\n👉 ${shareUrl}`,
    [shareUrl]
  );
  const encodedMessage = encodeURIComponent(message);

  const shareLinks = useMemo(
    () => ({
      x: `https://twitter.com/intent/tweet?text=${encodedMessage}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        shareUrl
      )}&text=${encodedMessage}`,
      whatsapp: `https://wa.me/?text=${encodedMessage}`,
    }),
    [encodedMessage, shareUrl]
  );

  return (
    <div className="flex items-center pt-[70px] lg:h-[500px]">
      <div className="mx-auto flex size-full max-w-[1200px] flex-col items-center justify-between lg:flex-row ">
        <div className="max-w-[700px] text-center lg:text-left">
          <h1 className="text-base font-medium text-[#C0C0C0]">
            Cricket Refer Program
          </h1>
          <h2 className="mt-3 block  text-[30px] font-bold text-white lg:text-5xl  ">
            Invite Friends & Earn up to{' '}
            <span className="mt-4 inline text-[30px] font-bold leading-[32px] text-[#CEAC4D] lg:text-5xl lg:leading-[50px]">
              $100,000.00
            </span>
          </h2>

          <span className="mt-4 block text-sm font-medium text-[#C0C0C0]">
            Earn up to <span className="text-[#CEAC4D]">50%</span> in trading
            fees from your referrals.{' '}
            <Link className="text-[#CEAC4D]" href="">
              Learn More
            </Link>
          </span>
          <div className="mt-[30px] flex flex-col px-2.5 lg:px-0">
            <label
              htmlFor="copy-refer-link"
              className="text-left text-sm font-semibold text-white"
            >
              My Refer Link
            </label>
            <button
              disabled={!connectedUser?.name}
              onClick={() =>
                copyToClipboard(
                  `https://www.cricket.cricket/?ref=${connectedUser?.name}`
                )
              }
              id="copy-refer-link"
              className="mt-2 flex h-[46px] w-full justify-between rounded-[1px] bg-white/10 px-4 py-[13px] text-[#C0C0C0]/50 lg:w-[580px]"
              type="button"
            >
              https://www.cricket.cricket/?ref={connectedUser?.name}
              <IconCopyWhite />
            </button>
          </div>
          <span className="mt-6 block text-sm font-medium  text-white">
            Share to
          </span>
          <div className="mt-2 flex items-center justify-center gap-x-3 lg:justify-start">
            <Link className="" href={shareLinks.x} target="_blank">
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
                <IconX color="#A1A7BB" className="size-4" />
              </div>
            </Link>
            <Link
              className=""
              href={shareLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
                <IconWhatsapp color="#A1A7BB" className="size-4" />
              </div>
            </Link>
            <Link
              className=""
              href={shareLinks.telegram}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
                <IconTelegram className="size-5" />
              </div>
            </Link>
            <button onClick={() => setShowQR(true)}>
              <div className="flex size-10 items-center justify-center rounded-lg bg-white/5">
                <IconQrCode className="size-4" />
              </div>
            </button>
          </div>
        </div>
        <div className="relative z-[1] h-full flex-1 pl-24">
          <div className="absolute left-0 top-0 flex">
            <div className="flex w-[84px] flex-col items-center justify-center">
              <div className="absolute top-0 h-[98px] w-[48px] bg-gradient-to-b from-white/0 via-white/10 to-white/30 lg:h-[111px] lg:w-[54px]"></div>
              <img
                className="mt-20 animate-bounce animate-duration-[2000ms]"
                width={84}
                height={84}
                src="/assets/svg/referral/ball.svg"
                alt=""
              />
            </div>

            <div></div>
          </div>
          <div className="absolute left-20 top-0 flex">
            <div className="flex w-[103px] flex-col items-center justify-center">
              <div className="lg;w-[66px] absolute top-0 h-[177px] w-[60px] bg-gradient-to-b from-white/0 via-white/10 to-white/30 lg:h-[202px]"></div>
              <img
                className="mt-[162px] animate-bounce animate-duration-[2000ms]"
                width={103}
                height={103}
                src="/assets/svg/referral/ball.svg"
                alt=""
              />
            </div>

            <div></div>
          </div>
          <img
            className="relative -right-12 z-[1] mt-20 lg:right-0"
            width={431}
            height={376}
            src="/assets/svg/referral/ticket.svg"
            alt="ticket"
          />
        </div>
      </div>
      <img
        className="absolute right-[10%] top-[28rem] h-[449px] w-[647px] animate-spin animate-duration-[4000ms] lg:top-10"
        width={647}
        height={449}
        src="/assets/svg/referral/yellow-blur.svg"
        alt=""
      />
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="rounded-lg bg-white p-6 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between ">
              <span className="dark:text-white">Show qr code</span>
              <button
                className="text-sm text-gray-500 hover:text-black dark:hover:text-white"
                onClick={() => setShowQR(false)}
              >
                <IconClose />
              </button>
            </div>
            <QRCodeCanvas value={shareUrl} size={320} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Hero;
