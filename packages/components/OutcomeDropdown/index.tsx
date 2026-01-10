import { useTheme } from 'next-themes';
import { useState } from 'react';
import { cn } from '@/utils/cn';
import { IconArrowDown } from '../Icons';

type Props = {
  options: {
    id: string;
    image: string;
    name: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

const OutcomeDropdown = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((opt) => opt.id === value);
  const { theme } = useTheme();

  const handleSelect = (option: { id: string }) => {
    onChange?.(option.id);
    setIsOpen(false);
  };

  return (
    <div className="relative size-full max-w-[80%]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-[38px] w-full items-center justify-between overflow-hidden rounded-[1px] bg-black/5 px-2 text-[13px] dark:bg-white/5 dark:text-white"
      >
        <div className="flex items-center gap-2">
          {selectedOption ? (
            <>
              <img
                src={selectedOption.image}
                alt={selectedOption.name}
                className="size-[22px] rounded-full object-cover"
              />
              <span className="max-w-[100px] truncate text-xs">
                {selectedOption.name}
              </span>
            </>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </div>
        <IconArrowDown
          rotate={isOpen}
          circle={false}
          color={theme === 'dark' ? '#fff' : '#000'}
          className={`ml-2 w-6 rotate-90 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute mt-1 max-h-[150px] min-h-[150px] w-full overflow-y-auto rounded-lg border border-white/10 bg-white shadow-lg dark:bg-shaftkings-dark-420">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => handleSelect(option)}
              className={cn(
                'flex w-full items-center gap-2 px-2 py-2 text-left dark:text-white hover:bg-white/10',
                value === option.id && 'bg-white/10'
              )}
            >
              <img
                src={option.image}
                alt={option.name}
                className="size-6 rounded-full object-cover"
              />
              <span className="truncate text-xs">{option.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default OutcomeDropdown;
