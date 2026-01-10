import { cn } from '@/utils/cn';
import type { FC } from 'react';

type PresetButtonsProps = {
  presets?: number[];
  value: number;
  setValue: (value: number) => void;
};

const PresetButtons: FC<PresetButtonsProps> = ({
  presets = [10, 20, 50, 100, 1000],
  value,
  setValue,
}) => {
  return (
    <div className="flex space-x-2">
      {presets.map((presetValue) => (
        <button
          key={presetValue}
          onClick={() => setValue(value + presetValue)}
          className={cn(
            'flex w-full h-5 text-[11px] items-center transition-all duration-100 justify-center rounded hover:bg-black/5 border border-shaftkings-gray-1000 dark:border-white/5 dark:hover:bg-white/5 py-1 font-medium text-[#C0C0C0]',
            {
              '!bg-shaftkings-gold-200 text-black': presetValue === value,
            }
          )}
        >
          +{presetValue}
        </button>
      ))}
    </div>
  );
};

export default PresetButtons;
