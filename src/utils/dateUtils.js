import { format, startOfWeek, addDays, addWeeks, parseISO, isSameDay } from 'date-fns'

export const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

export const formatDurationHours = (seconds) => {
  return (seconds / 3600).toFixed(2)
}

export const getWeekStart = (date = new Date()) => {
  return startOfWeek(date, { weekStartsOn: 1 }) // Monday
}

export const getWeekDays = (weekStart) => {
  return Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
}

export const formatTime = (date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'HH:mm')
}

export const formatDate = (date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'yyyy-MM-dd')
}

export const formatDateTime = (date) => {
  if (typeof date === 'string') {
    date = parseISO(date)
  }
  return format(date, 'MMM d, yyyy HH:mm')
}

export const calculateDuration = (startTime, endTime) => {
  const start = typeof startTime === 'string' ? parseISO(startTime) : startTime
  const end = typeof endTime === 'string' ? parseISO(endTime) : endTime
  return Math.floor((end - start) / 1000) // Return seconds
}
