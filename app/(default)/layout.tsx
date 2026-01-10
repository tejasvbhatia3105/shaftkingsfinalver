import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex size-full min-h-screen flex-col justify-between bg-black">
      <Header />

      <div className={cn('mx-auto w-full h-full pt-14 lg:pt-[80px]')}>
        {children}
      </div>

      <Footer />
    </div>
  );
}
