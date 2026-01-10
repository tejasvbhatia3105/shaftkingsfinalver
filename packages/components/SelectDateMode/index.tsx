import React from 'react';

type SelectionMode = 'start' | 'end';

type SelectionModeButtonsProps = {
  selectionMode: SelectionMode;
  setSelectionMode: (mode: SelectionMode) => void;
};

const SelectionModeButtons: React.FC<SelectionModeButtonsProps> = ({
  selectionMode,
  setSelectionMode,
}) => {
  const modes: { id: SelectionMode; label: string }[] = [
    { id: 'start', label: 'Start Date' },
    { id: 'end', label: 'End Date' },
  ];

  return (
    <div className="mb-4 flex items-center space-x-4">
      {modes.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => setSelectionMode(id)}
          className={`
            rounded px-2
            py-1
            text-xs
            font-medium
            transition-colors
            ${
              selectionMode === id
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-gray-400 hover:bg-white/20'
            }
          `}
        >
          {label}
        </button>
      ))}
    </div>
  );
};

export default SelectionModeButtons;
