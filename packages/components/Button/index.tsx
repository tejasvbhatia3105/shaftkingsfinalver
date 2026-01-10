import { cn } from '@/utils/cn';
import type { ComponentProps, ReactNode } from 'react';
import type { StrictOmit } from 'ts-essentials';
import { IconLoading } from '../Icons';

type BaseProps = {
  /** @default "contained" */
  variant?: 'contained' | 'outlined';
  /** @default "default" */
  size?: 'x-small' | 'small' | 'default' | 'large';
  /** @default "primary" */
  color?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'gray'
    | 'blue'
    | 'purple'
    | 'light-red'
    | 'red'
    | 'gold'
    | 'white';
  children: ReactNode;
  className?: string;
  loading?: boolean;
};

type ButtonOnlyProps = BaseProps &
  StrictOmit<ComponentProps<'button'>, 'children'>;

export type ButtonProps = ButtonOnlyProps;

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'contained',
  size = 'default',
  color = 'primary',
  loading,
  className: buttonClassName,
  ...rest
}) => {
  const className = {
    size: {
      'x-small': 'text-[10.5px]/5 px-1.5',
      small: 'text-xs py-0.5 px-3',
      default: 'text-sm py-1 px-3',
      large: 'text-base py-2.5 px-5 font-semibold',
    },
    variant: {
      contained: {
        primary: 'bg-shaftkings-dark-300 hover:bg-shaftkings-dark-300/60 text-white',
        secondary:
          'bg-transparent border border-black hover:bg-legacy-silver-600 text-shaftkings-dark-100',
        tertiary:
          'bg-shaftkings-dark-200 text-[#C0C0C0] hover:bg-shaftkings-gold-200 hover:text-white',
        gray: 'bg-shaftkings-gray-400 hover:bg-legacy-green-700 text-white',
        blue: 'bg-shaftkings-azure-200 hover:bg-shaftkings-azure-200/80 text-white',
        gold: 'bg-shaftkings-gold-200 hover:bg-shaftkings-gold-200/80 text-black',
        purple: 'bg-shaftkings-purple-100 text-shaftkings-purple-200',
        'light-red': 'bg-shaftkings-red-100 text-shaftkings-red-600',
        red: 'bg-shaftkings-red-600 text-white',
      },
      outlined: {
        gold: 'border border-shaftkings-gold-200 hover:bg-shaftkings-gold-200/80 text-shaftkings-gold-200 hover:text-white',
        blue: 'border border-shaftkings-azure-200 hover:bg-shaftkings-azure-200/80 text-shaftkings-azure-200 hover:text-white',
        white: 'border border-white text-white/80',
      },
    },
    common:
      'rounded-lg flex items-center justify-center transition duration-200 ease-linear h-fit w-fit outline-none',
    disabled:
      'cursor-not-allowed bg-gray-200 !hover:bg-gray-200 dark:bg-shaftkings-dark-200 text-black/60 dark:text-shaftkings-dark-450 dark:hover:bg-shaftkings-dark-200',
  };

  const commonClasses = cn(
    className.common,
    className.size[size as keyof typeof className.size],
    variant
      ? (className.variant as { [key: string]: { [key: string]: string } })[
          variant
        ][color]
      : '',
    { [className.disabled]: (rest as { disabled?: boolean }).disabled },
    buttonClassName
  );

  return (
    <button className={cn('gap-x-2', commonClasses)} {...rest}>
      {loading && <IconLoading />}
      {children}
    </button>
  );
};
