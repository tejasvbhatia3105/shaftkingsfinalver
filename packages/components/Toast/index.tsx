'use client';

import type { ReactNode } from 'react';
import type { Id } from 'react-toastify';
import { toast as toastfy } from 'react-toastify';
import { IconClose } from '../Icons';
import { Toastfy as ToastfyComponent } from './Toastfy';

type ToastProps = {
  title: string | JSX.Element;
  description?: string | ReactNode;
  type: 'success' | 'error' | 'info';
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  timeClose?: number;
  manualProgress?: number;
  hideProgressBar?: boolean;
  closeOnClick?: boolean;
  pauseOnHover?: boolean;
  draggable?: boolean;
  isLoading?: boolean;
  link?: {
    href: string;
    name: string;
  };
  isDropdown?: boolean;
};

function showToast(props: ToastProps): Id {
  const {
    title,
    description,
    type,
    position = 'bottom-left',
    timeClose = 3000,
    hideProgressBar = true,
    pauseOnHover = true,
    draggable = true,
    isLoading,
    link,
    manualProgress,
    isDropdown = false, // valor padrão
  } = props;

  const theme = 'dark';

  return toastfy(
    <ToastfyComponent
      title={title}
      description={description}
      isLoading={isLoading}
      type={type}
      link={link}
      manualProgress={manualProgress}
      duration={timeClose}
      isDropdown={isDropdown}
    />,
    {
      position,
      autoClose: isDropdown ? false : timeClose,
      hideProgressBar,
      closeOnClick: !isDropdown,
      pauseOnHover,
      draggable,
      isLoading,
      closeButton: isDropdown ? (
        false
      ) : (
        <div className="absolute right-0 top-0 mr-3.5 mt-3.5 flex size-[30px] items-center justify-center rounded-md bg-black/5 backdrop-blur-2xl dark:bg-white/5">
          <IconClose
            color={theme === 'dark' ? '#fff' : '#0C131F'}
            svgProps={{ className: 'flex max-w-3.5 min-w-3.5' }}
          />
        </div>
      ),
      style: {
        width: '100%',
        border: '1px solid',
        background: theme === 'dark' ? '#fff' : '#E5E5E5',
        borderColor: theme === 'dark' ? 'transparent' : '#DADADA',
        boxShadow: '0px 0px 100px 4px rgba(0, 0, 0, 0.10)',
        borderRadius: '6px',
      },
      className: 'toast-responsive !rounded-2xl !p-0 !overflow-hidden',
    }
  );
}

export const Toast = {
  show: showToast,
  update: toastfy.update,
  dismiss: toastfy.dismiss,
};

export const Toastfy = ToastfyComponent;
