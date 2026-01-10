// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-nested-ternary */
import { Calendar } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

interface TimeState {
  hours: string;
  minutes: string;
  period: string;
}

type DatePickerProps = {
  onChange: (endTimestamp: number) => void;
};

const DatePicker: React.FC<DatePickerProps> = ({ onChange }) => {
  const today = useMemo(() => new Date(), []);
  today.setHours(0, 0, 0, 0);

  const [endDate, setEndDate] = useState(new Date());
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [endTime] = useState<TimeState>({
    hours: '09',
    minutes: '00',
    period: 'PM',
  });

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

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
    const newDate = new Date(date);
    const hours = convertTo24Hour(time);
    newDate.setHours(hours, parseInt(time.minutes, 10), 0, 0);
    return newDate.getTime();
  }, []);

  useEffect(() => {
    const endTimestamp = createUTCTimestamp(endDate, endTime);
    onChange(endTimestamp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, endTime]);

  const generateCalendarDays = useMemo(() => {
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
        isDisabled: currentDate < today,
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i += 1) {
      const nextDate = new Date(year, month + 1, i);
      days.push({ date: nextDate, isCurrentMonth: false, isDisabled: false });
    }

    return days;
  }, [calendarDate, today]);

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

  const handleDateSelect = (event: React.MouseEvent, date: Date) => {
    event.preventDefault();
    setEndDate(date);
  };

  const handlePrevMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1)
    );
  };

  const handleNextMonth = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
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

  const formatDisplayDateTime = () => {
    const formattedEndDate = formatDate(endDate);
    return (
      <span>
        {formattedEndDate} {endTime.hours}:{endTime.minutes} {endTime.period}
      </span>
    );
  };

  return (
    <div className="relative size-full">
      <div
        onClick={() => setIsCalendarOpen(!isCalendarOpen)}
        className="mb-2.5 w-full cursor-pointer rounded-[1px] border border-white/10 p-3 pt-1"
      >
        <span className="text-xs font-medium text-[#C0C0C0]">Close</span>
        <div className="mt-2 flex w-full items-center justify-between text-sm font-semibold text-white">
          <span>{formatDisplayDateTime()}</span>
          <Calendar className="size-5 cursor-pointer text-gray-400" />
        </div>
      </div>

      {isCalendarOpen && (
        <div className="absolute z-40 w-full animate-fade-down rounded-b-lg border-t border-white/10 bg-[#1c1f25] p-4 pb-0 animate-duration-700">
          <div className="flex w-full">
            <div className="flex w-full flex-col items-center justify-center">
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

              <div className="mb-4 grid w-full grid-cols-7 gap-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                  <div
                    key={index}
                    className="py-2 text-center text-sm text-gray-400"
                  >
                    {day}
                  </div>
                ))}
                {generateCalendarDays.map((day, index) => {
                  const isSelected =
                    day.date.toDateString() === endDate.toDateString();
                  const isTodayDate = isToday(day.date);

                  return (
                    <button
                      key={index}
                      onClick={(event) =>
                        !day.isDisabled && handleDateSelect(event, day.date)
                      }
                      disabled={day.isDisabled}
                      className={`
                        relative rounded-[1px] p-2 text-sm hover:bg-shaftkings-gold-200/80
                        ${day.isCurrentMonth ? 'text-white' : 'text-gray-600'}
                        ${isSelected ? 'bg-[#0052FF]' : ''}
                        ${
                          isTodayDate && isSelected
                            ? 'font-bold text-white'
                            : isTodayDate
                            ? 'font-bold !text-[#0052FF] after:absolute after:bottom-0.5 after:left-1/2 after:size-1.5 after:-translate-x-1/2 after:rounded-full after:bg-[#0052FF]'
                            : ''
                        }
                        ${
                          day.isDisabled
                            ? 'cursor-not-allowed opacity-50 hover:bg-transparent'
                            : 'hover:bg-gray-700 hover:text-white'
                        }
                      `}
                    >
                      {day.date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DatePicker;
