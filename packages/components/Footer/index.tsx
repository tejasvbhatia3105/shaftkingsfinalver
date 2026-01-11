'use client';

import { cn } from '@/utils/cn';
import { PoppinsFont } from '@/utils/fonts';
import { useTheme } from 'next-themes';
import Image from 'next/image';

export function Footer() {
  const { theme } = useTheme();
  const isLegal = false;

  const footerColumns = [
    {
      title: 'Platform',
      links: [
        { name: 'PREDICT NOW', link: '/' },
        { name: 'INFORMATION', link: '/docs' },
        { name: 'REFER & EARN', link: '/referral' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { name: 'TERMS', link: '/terms' },
        { name: 'PRIVACY', link: '/privacy' },
      ],
    },
  ];

  const legalLinks = [
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Use', href: '/terms' },
  ];

  return (
    <footer
      className={cn(
        'flex min-h-96 flex-col border-t border-[#555555] bg-black text-white',
        PoppinsFont.className,
        {
          'bg-white text-black': isLegal,
        }
      )}
    >
      <div className="flex-1 px-5 py-12 pb-8 lg:px-[60px] lg:pt-[60px]">
        {/* Logo */}
        <div className="mb-10">
          <img
            width={82}
            height={30}
            className="relative h-[32px] w-auto object-contain lg:h-[40px]"
            src="/assets/img/shaftkingslogo.png"
            alt="ShaftKings logo"
          />
        </div>

        {/* Footer Columns */}
        <div className="grid max-w-2xl grid-cols-3 gap-4 text-opacity-45 opacity-45 transition-all duration-500 ease-in hover:opacity-100 md:grid-cols-3 lg:grid-cols-4 lg:gap-12">
          {footerColumns.map((column) => (
            <div key={column.title}>
              <h3
                className={cn(
                  'mb-2.5 text-base font-semibold uppercase tracking-wider',
                  isLegal ? 'text-black' : 'text-[#C0C0C0]'
                )}
              >
                {column.title}
              </h3>
              <ul className="space-y-[3px]">
                {column.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.link}
                      className={cn(
                        'text-xs tracking-[2px] transition-colors hover:text-white',
                        isLegal
                          ? 'text-black hover:text-black'
                          : 'text-[#C0C0C0]'
                      )}
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-24 px-8 py-6 lg:mb-0">
        <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-x-8 md:space-y-0">
          <div className="flex">
            {legalLinks.map(({ name, href }, index) => (
              <div key={name} className="flex items-center">
                {index > 0 && (
                  <span
                    className={cn(
                      'mx-3',
                      isLegal ? 'text-black' : 'text-[#C0C0C0]/75'
                    )}
                  >
                    |
                  </span>
                )}
                <a
                  href={href}
                  className={cn(
                    'text-[8px] font-normal uppercase tracking-[3px] transition-colors',
                    isLegal
                      ? 'text-black hover:text-black'
                      : 'text-[#C0C0C0]/75 hover:text-white'
                  )}
                >
                  {name}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 text-center">
          <p
            className={cn(
              'text-xs',
              isLegal ? 'text-black' : 'text-[#C0C0C087]'
            )}
          >
            Copyright © ShaftKings. All rights reserved.
          </p>
        </div>

        <div className="mx-auto mt-4 w-fit text-center">
          <p
            className={cn(
              'flex items-center text-xs font-normal',
              isLegal ? 'text-black' : 'text-[#A1A7BB]'
            )}
          >
            powered by{' '}
            <Image
              width={82}
              height={30}
              className="relative ml-1 h-5 w-9 object-contain lg:h-6"
              src={
                theme === 'dark'
                  ? '/assets/svg/logo-dark.svg'
                  : '/assets/img/light-logo.webp'
              }
              alt="triad logo"
            />
          </p>
        </div>
      </div>
    </footer>
  );
}
