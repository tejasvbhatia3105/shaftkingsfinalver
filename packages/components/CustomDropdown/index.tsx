import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import { IconArrowBottom } from '../Icons';

interface CustomDropdownProps {
  options: { label: string; value: string }[];
  onSelect: (value: string) => void;
  defaultValue?: string;
}

const CustomDropdown = ({
  options,
  onSelect,
  defaultValue,
}: CustomDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const [selectedValue, setSelectedValue] = useState(
    defaultValue || options[0]?.value
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleSelect = (value: string) => {
    setSelectedValue(value);
    onSelect(value);
    setIsOpen(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedLabel =
    options.find((opt) => opt.value === selectedValue)?.label || 'Selecione';

  return (
    <div ref={dropdownRef} className="relative lg:w-[240px]">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-11 w-full items-center justify-between overflow-hidden rounded-[1px] bg-black/5 px-4 py-2 text-[13px] dark:bg-white/5 dark:text-white"
      >
        <span className="w-11/12 truncate text-left">{selectedLabel}</span>
        <IconArrowBottom
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
          color={theme === 'dark' ? '#fff' : '#0C131F'}
        />
      </button>

      {isOpen && (
        <ul className="absolute mt-1 max-h-48 w-full overflow-y-auto rounded-[1px] bg-white shadow-lg dark:bg-shaftkings-dark-420">
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`flex h-[44px] cursor-pointer items-center truncate px-4 py-2 text-[13px] hover:bg-white/5 dark:text-white ${
                selectedValue === option.value
                  ? 'bg-black/5 font-semibold dark:bg-white/5'
                  : ''
              }`}
            >
              <span className="truncate">{option.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
