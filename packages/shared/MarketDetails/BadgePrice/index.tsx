import { cn } from '@/utils/cn';

type BadgeProps = {
  label?: string;
  icon?: React.ReactNode | (() => JSX.Element);
  variant?: 'official' | 'new' | 'power';
  className?: string;
};

export const BadgePrice = ({
  label,
  icon,
  variant = 'official',
  className = '',
}: BadgeProps) => {
  const baseStyle = 'flex items-center gap-1 h-6 rounded';

  const variantClasses: Record<typeof variant, string> = {
    official: 'bg-[#0052FF33] dark:text-white pr-2 pl-1 text-black',
    new: 'bg-[#00AAFF1A] text-[#18A8FF] pr-2 pl-1',
    power: 'bg-[#FFB6251A] p-[5px]',
  };

  return (
    <div className={cn(baseStyle, variantClasses[variant], className)}>
      {/* {icon && (typeof icon === 'function' ? icon() : icon)} */}
      {label && <span className="text-xs font-medium">{label}</span>}
    </div>
  );
};
