import { cn } from '@/utils/cn';
import type { Metadata } from 'next';
import NextTopLoader from 'nextjs-toploader';
import { AppLayout } from 'packages/layouts/AppLayout';
import type { ReactNode } from 'react';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './globals.css';
import { MontserratFont, JetBrainsMonoFont } from '@/utils/fonts';
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'ShaftKings | Markets',
  description: 'ShaftKings Prediction Market',
  icons: [
    {
      url: '/assets/favicon/favicon.ico',
      href: '/assets/favicon//favicon.ico',
      sizes: '32x32',
      type: 'image/x-icon',
    },
    {
      url: '/assets/favicon/apple-touch-icon.png',
      href: '/assets/favicon/apple-touch-icon.png',
      sizes: '180x180',
      type: 'image/png',
    },
    {
      url: '/assets/favicon/favicon-32x32.png',
      href: '/assets/favicon/favicon-32x32.png',
      sizes: '32x32',
      type: 'image/png',
    },
    {
      url: '/assets/favicon/favicon-16x16.png',
      href: '/assets/favicon/favicon-16x16.png',
      sizes: '16x16',
      type: 'image/png',
    },
    {
      url: '/assets/favicon/site.webmanifest',
      href: '/assets/favicon/site.webmanifest',
      rel: 'manifest',
    },
  ],
};

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-M8NLL3QV';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html className="h-full" lang="en">
      <head>
        <Script id="google-tag-manager">
          {`
             (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
            `}
        </Script>
      </head>
      <body
        className={cn(
          MontserratFont.className,
          JetBrainsMonoFont.variable,
          'lg:h-full min-h-full bg-black'
        )}
      >
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          ></iframe>
        </noscript>
        <AppLayout>
          <NextTopLoader
            color="#3961FB"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            easing="ease"
            speed={200}
            shadow="0 0 10px #3961FB,0 0 5px #3961FB"
          />
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
