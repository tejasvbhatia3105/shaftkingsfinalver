import type { ReactNode } from 'react';

export default function DefaultLayout({ children }: { children: ReactNode }) {
  return (
    <div className="size-full h-auto bg-black">
      <div className="h-auto w-full bg-black">{children}</div>
    </div>
  );
}
