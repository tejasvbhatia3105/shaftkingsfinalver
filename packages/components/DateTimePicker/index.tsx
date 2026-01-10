/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-shadow */
import { useCallback, useEffect, useState, useRef } from 'react';
import SelectionModeButtons from '../SelectDateMode';
import { CalendarIcon } from '../Icons';

interface TimeState {
  hours: string;
  minutes: string;
  period: string;
}

type DateTimePickerProps = {
  onChange: (startTimestamp: number, endTimestamp: number) => void;
  startTimestamp: number;
  endTimestamp: number;
};

const DateTimePicker: React.FC<DateTimePickerProps> = ({
  onChange,
  startTimestamp,
  endTimestamp,
}) => {
  const today = new Date();
  const [startDate, setStartDate] = useState(
    startTimestamp ? new Date(startTimestamp * 1000) : new Date()
  );
  const [endDate, setEndDate] = useState(
    endTimestamp ? new Date(endTimestamp * 1000) : new Date()
  );
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [startTime] = useState<TimeState>(() => {
    if (startTimestamp) {
      const date = new Date(startTimestamp * 1000);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return {
        hours: (hours % 12 || 12).toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        period: hours >= 12 ? 'PM' : 'AM',
      };
    }
    return { hours: '10', minutes: '00', period: 'AM' };
  });

  const [endTime] = useState<TimeState>(() => {
    if (endTimestamp) {
      const date = new Date(endTimestamp * 1000);
      const hours = date.getUTCHours();
      const minutes = date.getUTCMinutes();
      return {
        hours: (hours % 12 || 12).toString().padStart(2, '0'),
        minutes: minutes.toString().padStart(2, '0'),
        period: hours >= 12 ? 'PM' : 'AM',
      };
    }
    return { hours: '09', minutes: '00', period: 'PM' };
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');
  const datePickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target as Node)
      ) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const convertTo24Hour = (time: TimeState) => {
    let hours = parseInt(time.hours, 10);
    if (time.period === 'PM' && hours !== 12) {
      hours += 12;
    }
    if (time.period === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours;
  };

  const createUTCTimestamp = useCallback((date: Date, time: TimeState) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const day = date.getDate();
    const hours = convertTo24Hour(time);
    const minutes = parseInt(time.minutes, 10);

    return Date.UTC(year, month, day, hours, minutes, 0);
  }, []);

  useEffect(() => {
    if (endDate < startDate) {
      setEndDate(startDate);
    }

    const startTimestamp = createUTCTimestamp(startDate, startTime);
    const endTimestamp = createUTCTimestamp(endDate, endTime);
    onChange(startTimestamp / 1000, endTimestamp / 1000);
  }, [startDate, endDate, startTime, endTime]);

  const generateCalendarDays = () => {
    const year = calendarDate.getFullYear();
    const month = calendarDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const startingDay = firstDay.getDay();

    for (let i = 0; i < startingDay; i += 1) {
      const prevDate = new Date(year, month, -startingDay + i + 1);
      days.push({ date: prevDate, isCurrentMonth: false, isDisabled: true });
    }

    for (let i = 1; i <= lastDay.getDate(); i += 1) {
      const currentDate = new Date(year, month, i);
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isDisabled: currentDate < new Date(today.setHours(0, 0, 0, 0)),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i += 1) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, isDisabled: false });
    }

    return days;
  };

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const handleDateSelect = (date: Date) => {
    if (selectionMode === 'start') {
      setStartDate(date);
      setSelectionMode('end');
    } else {
      if (date >= startDate) {
        setEndDate(date);
      } else {
        setEndDate(startDate);
        setStartDate(date);
      }
      setSelectionMode('start');
    }
  };

  const handlePrevMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1)
    );
  };

  const handleNextMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1)
    );
  };

  const formatDate = (date: Date) => {
    return `${(date.getMonth() + 1).toString().padStart(2, '0')}/${date
      .getDate()
      .toString()
      .padStart(2, '0')}/${date.getFullYear()}`;
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isInRange = (date: Date) => {
    return date >= startDate && date <= endDate;
  };

  const formatDisplayDateTime = () => {
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    return (
      <span className="text-sm font-medium text-[#C0C0C0]">
        {formattedStartDate}
        <span className="text-triad-dark-150 mx-2 font-medium">to</span>
        {formattedEndDate} | UTC
      </span>
    );
  };

  return (
    <div className="relative w-full" ref={datePickerRef}>
      <div
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="flex h-10 w-[280px] cursor-pointer items-center rounded-md border border-white/10 px-3 py-2.5"
      >
        <div className="flex w-full items-center justify-between text-sm font-semibold text-white">
          <span>{formatDisplayDateTime()}</span>
          <CalendarIcon />
        </div>
      </div>

      {isCalendarOpen && (
        <div className="absolute z-10 animate-fade-down rounded-b-lg border-t border-white/10 bg-black p-4 animate-duration-700">
          <div className="flex w-full justify-between gap-x-5">
            <div className="flex flex-col items-center justify-center">
              <div className="mb-4 flex w-full items-center justify-between">
                <button
                  onClick={handlePrevMonth}
                  className="text-gray-400 hover:text-white"
                >
                  &lt;
                </button>
                <div className="text-white">
                  {months[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </div>
                <button
                  onClick={handleNextMonth}
                  className="text-gray-400 hover:text-white"
                >
                  &gt;
                </button>
              </div>

              <div className="mb-4 grid grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div
                    key={index}
                    className="py-2 text-center text-sm text-gray-400"
                  >
                    {day}
                  </div>
                ))}
                {generateCalendarDays().map((day, index) => {
                  const isSelected =
                    day.date.toDateString() === startDate.toDateString() ||
                    day.date.toDateString() === endDate.toDateString();
                  const isInRangeDay = isInRange(day.date);
                  const isTodayDate = isToday(day.date);

                  return (
                    <button
                      key={index}
                      onClick={() => handleDateSelect(day.date)}
                      // disabled={day.isDisabled}
                      className={`
                        relative rounded-md p-2 text-sm
                        ${day.isCurrentMonth ? 'text-white' : 'text-gray-300'}
                        ${isSelected ? 'bg-[#0052FF]' : ''}
                        ${!isSelected && isInRangeDay ? 'bg-[#0052FF]/50' : ''}
                        ${
                          isTodayDate && isSelected
                            ? 'font-bold text-white'
                            : isTodayDate
                            ? 'font-bold text-[#0052FF] after:absolute after:bottom-0.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-[#0052FF]'
                            : ''
                        }
                        ${
                          !day.isDisabled && selectionMode === 'start'
                            ? 'hover:ring-2 hover:ring-blue-400'
                            : 'hover:ring-2 hover:ring-blue-600'
                        }
                      `}
                    >
                      {day.date.getDate()}
                    </button>
                  );
                })}
              </div>
              <SelectionModeButtons
                selectionMode={selectionMode}
                setSelectionMode={setSelectionMode}
              />
            </div>
            {/* <div className="flex flex-col">
              <TimePicker
                selectedTime={startTime}
                setSelectedTime={setStartTime}
              />

              <span className="my-5 text-sm text-triad-dark-150">to</span>
              <TimePicker selectedTime={endTime} setSelectedTime={setEndTime} />
            </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default DateTimePicker;
