'use client';

import { useGlobal } from '@/context/Global';
import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
import { IconClose } from '../Icons';

export type ModalProps = {
  children: ReactNode;
  onClose: (value: boolean) => void;
  isOpen: boolean;
  className?: {
    blur?: string;
    modal?: string;
  };
  blur?: boolean;
  hiddenClose?: boolean;
};

export function Modal({
  children,
  onClose,
  className,
  isOpen,
  blur = true,
  hiddenClose = false,
}: ModalProps) {
  const { setIsModalOpen } = useGlobal();

  useEffect(() => {
    if (isOpen) {
      setIsModalOpen(true);
      return;
    }

    setIsModalOpen(false);
  }, [isOpen, setIsModalOpen]);

  const handleCloseEscKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose(false);
      }
    },
    [onClose]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleCloseEscKey);

    return () => {
      document.removeEventListener('keydown', handleCloseEscKey);
    };
  }, [handleCloseEscKey]);

  return (
    <>
      <div
        onClick={() => onClose(false)}
        className={cn(
          'fixed left-0 top-0 z-[102] flex size-full animate-fade cursor-pointer items-center bg-black/10 animate-duration-[400ms] animate-once animate-ease-linear',
          {
            'backdrop-blur-sm': blur,
          },
          className?.blur
        )}
      />

      <div
        className={cn(
          'fixed inset-0 z-[999]  mt-6 m-auto h-fit w-full max-w-[600px] animate-fade-up animate-duration-300 animate-once animate-ease-linear',
          className?.modal
        )}
      >
        <div className="h-auto w-full overflow-y-auto">
          {!hiddenClose && (
            <button
              className="absolute right-5 top-3 z-10 w-fit cursor-pointer"
              onClick={() => onClose(false)}
            >
              <IconClose />
            </button>
          )}

          {children}
        </div>
      </div>
    </>
  );
}
