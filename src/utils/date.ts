// Date utility functions

import { format, parseISO, startOfWeek, endOfWeek, addWeeks, subWeeks, startOfDay, endOfDay } from 'date-fns';

export const formatDate = (date: string | Date, formatStr = 'yyyy-MM-dd'): string => {
  const d = typeof date === 'string' ? parseISO(date) : date;
  return format(d, formatStr);
};

export const formatDateTime = (date: string | Date): string => {
  return formatDate(date, 'yyyy-MM-dd HH:mm');
};

export const formatTime = (date: string | Date): string => {
  return formatDate(date, 'HH:mm');
};

export const getWeekRange = (date: Date = new Date()) => {
  return {
    start: startOfWeek(date, { weekStartsOn: 1 }), // Monday
    end: endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getNextWeek = (date: Date) => addWeeks(date, 1);
export const getPreviousWeek = (date: Date) => subWeeks(date, 1);

export const secondsToHours = (seconds: number): number => {
  return Math.round((seconds / 3600) * 100) / 100;
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const formatDurationHours = (seconds: number): string => {
  const hours = secondsToHours(seconds);
  return `${hours}h`;
};
