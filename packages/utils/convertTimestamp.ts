import { format, toZonedTime } from 'date-fns-tz';

export function convertISTtoLocalTime(timeIST: string, dateIST: string) {
  const [, datePart] = dateIST.split('\n');
  const [month, day] = datePart.split(' ');

  const currentYear = new Date().getFullYear();

  const istDateTimeString = `${month} ${day} ${timeIST} ${currentYear} GMT+0530`;

  const istDate = new Date(istDateTimeString);

  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localDate = toZonedTime(istDate, userTimezone);

  const localTime = format(localDate, 'h:mm a');

  const localDayName = format(localDate, 'EEE').toUpperCase();

  const localMonth = format(localDate, 'MMM').toUpperCase();
  const localDay = format(localDate, 'd');

  return {
    time: localTime,
    date: `${localDayName}\n${localMonth} ${localDay}`,
    dayName: localDayName,
    dayNumber: localDay,
  };
}

export function convertMatchesToLocalTime(matches: any[]) {
  return matches.map((match) => {
    const localTimeInfo = convertISTtoLocalTime(match.time, match.date);

    return {
      ...match,
      time: localTimeInfo.time,
      date: localTimeInfo.date,
      dayName: localTimeInfo.dayName,
      dayNumber: localTimeInfo.dayNumber,
    };
  });
}
