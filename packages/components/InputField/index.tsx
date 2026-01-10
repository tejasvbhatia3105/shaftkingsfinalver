import { cn } from '@/utils/cn';
import type { ReactNode } from 'react';

type InputFieldProps = {
  label: string;
  description?: string;
  placeholder: string;
  className?: string;
  icon?: ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>;

const InputField: React.FC<InputFieldProps> = ({
  label,
  description,
  placeholder,
  className,
  icon,
  ...inputProps
}) => (
  <div>
    <h4 className="mb-2 text-sm font-medium text-shaftkings-dark-100 dark:text-white">
      {label}
    </h4>

    <div className="relative flex w-full items-center">
      <input
        placeholder={placeholder}
        className={cn(
          'h-12 w-full rounded-[1px] border border-black/20 dark:border-shaftkings-dark-200 bg-black/5 dark:bg-[#FFFFFF0A] px-4 text-black dark:text-white placeholder:text-xs placeholder:text-[#C0C0C0] md:placeholder:text-sm',
          {
            'cursor-not-allowed opacity-50': inputProps.disabled,
          },
          className
        )}
        {...inputProps}
      />

      {icon && <div className="absolute right-4 z-[1]">{icon}</div>}
    </div>
    <span className="mt-1 text-xs text-shaftkings-dark-100/80 dark:text-[#C0C0C0]">
      {description}
    </span>
  </div>
);

export default InputField;
