import { cn } from '@/utils/cn';

interface DateSelectorProps {
  formats: { title: string; value: string }[];
  selectedDays: string;
  onChangeDays: (days: string) => void;
}

export function DateSelector({
  formats,
  selectedDays,
  onChangeDays,
}: DateSelectorProps) {
  return (
    <div className="flex h-8 w-full items-center gap-x-1 border-b border-white/10 bg-transparent pb-2.5">
      {formats.map((item, index) => (
        <>
          <button
            key={index}
            onClick={() => onChangeDays && onChangeDays(item.value)}
            className={cn(
              'text-shaftkings-gray-500 whitespace-nowrap flex items-center justify-center px-2 py-1 text-xs rounded font-semibold hover:bg-shaftkings-gold-200/10 dark:hover:bg-shaftkings-dark-200/20',
              { 'size-[30px]': index !== 2 },
              {
                'text-white bg-shaftkings-gold-200': item.value === selectedDays,
              }
            )}
          >
            {item.title}
          </button>

          {index === 1 && <div className="w-[1px] h-4 bg-white/10 mx-3"></div>}
        </>
      ))}
    </div>
  );
}
