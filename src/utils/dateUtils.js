import { format, startOfWeek, endOfWeek, eachDayOfInterval, addWeeks, subWeeks, parseISO } from 'date-fns'

export function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`
}

export function formatHours(seconds) {
  return (seconds / 3600).toFixed(2)
}

export function getWeekDays(date = new Date()) {
  const start = startOfWeek(date, { weekStartsOn: 1 }) // Monday
  const end = endOfWeek(date, { weekStartsOn: 1 })
  return eachDayOfInterval({ start, end })
}

export function getNextWeek(date) {
  return addWeeks(date, 1)
}

export function getPreviousWeek(date) {
  return subWeeks(date, 1)
}

export function formatDate(date) {
  return format(date, 'yyyy-MM-dd')
}

export function formatDateTime(date) {
  return format(parseISO(date), 'MMM dd, yyyy HH:mm')
}

export function formatTime(date) {
  return format(parseISO(date), 'HH:mm')
}
