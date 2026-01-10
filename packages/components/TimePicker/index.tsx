import React from 'react';

type TimeState = {
  hours: string;
  minutes: string;
  period: string;
};

type TimePickerProps = {
  selectedTime: TimeState;
  setSelectedTime: (time: TimeState) => void;
};

const TimePicker: React.FC<TimePickerProps> = ({
  selectedTime,
  setSelectedTime,
}) => {
  const hours = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, '0')
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, '0')
  );

  return (
    <div className="flex items-center space-x-2 text-sm font-medium">
      <select
        value={selectedTime.hours}
        onChange={(e) =>
          setSelectedTime({ ...selectedTime, hours: e.target.value })
        }
        className="rounded border border-white/10 bg-transparent px-2 py-1 text-white"
      >
        {hours.map((hour) => (
          <option className="bg-black/80 text-white" key={hour} value={hour}>
            {hour}
          </option>
        ))}
      </select>
      <span className="text-white">:</span>
      <select
        value={selectedTime.minutes}
        onChange={(e) =>
          setSelectedTime({ ...selectedTime, minutes: e.target.value })
        }
        className="rounded border border-white/10 bg-transparent px-2 py-1 text-white"
      >
        {minutes.map((minute) => (
          <option
            className="bg-black/80 text-white"
            key={minute}
            value={minute}
          >
            {minute}
          </option>
        ))}
      </select>
      <select
        value={selectedTime.period}
        onChange={(e) =>
          setSelectedTime({ ...selectedTime, period: e.target.value })
        }
        className="rounded border border-white/10 bg-transparent px-2 py-1 text-white"
      >
        <option className="bg-black/80" value="AM">
          AM
        </option>
        <option className="bg-black/80" value="PM">
          PM
        </option>
      </select>
    </div>
  );
};

export default TimePicker;
