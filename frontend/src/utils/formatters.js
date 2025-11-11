import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(duration);
dayjs.extend(relativeTime);

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

export const formatHours = (seconds) => {
  const hours = seconds / 3600;
  return hours.toFixed(2);
};

export const formatDate = (date, format = 'MMM D, YYYY') => {
  return dayjs(date).format(format);
};

export const formatDateTime = (date) => {
  return dayjs(date).format('MMM D, YYYY h:mm A');
};

export const formatTime = (date) => {
  return dayjs(date).format('h:mm A');
};

export const getWeekDates = (date) => {
  const start = dayjs(date).startOf('week');
  const dates = [];
  for (let i = 0; i < 7; i++) {
    dates.push(start.add(i, 'day'));
  }
  return dates;
};
