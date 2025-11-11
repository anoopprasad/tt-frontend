import { Box, Typography, Paper, Skeleton } from '@mui/material'
import { format, addDays, addHours, isSameDay, parseISO, startOfDay } from 'date-fns'
import { getWeekDays } from '../../utils/dateUtils'
import { formatTime, calculateDuration, formatDurationHours } from '../../utils/dateUtils'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export const WeeklyCalendar = ({ weekStart, entries, onSlotClick, onEntryClick, isLoading }) => {
  const weekDays = getWeekDays(weekStart)

  const getEntriesForSlot = (day, hour) => {
    return entries.filter((entry) => {
      if (!entry.startTime) return false
      const start = parseISO(entry.startTime)
      const entryDay = startOfDay(start)
      const entryHour = start.getHours()

      return isSameDay(entryDay, day) && entryHour === hour
    })
  }

  if (isLoading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={600} />
      </Box>
    )
  }

  return (
    <Box sx={{ p: 2, overflowX: 'auto' }}>
      <Box sx={{ display: 'flex', minWidth: 1000 }}>
        {/* Hour labels */}
        <Box sx={{ width: 60, flexShrink: 0 }}>
          <Box sx={{ height: 60 }} /> {/* Header spacer */}
          {HOURS.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: 60,
                display: 'flex',
                alignItems: 'flex-start',
                pr: 1,
                pt: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {hour.toString().padStart(2, '0')}:00
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Calendar grid */}
        {weekDays.map((day) => (
          <Box key={day.toISOString()} sx={{ flex: 1, minWidth: 0 }}>
            {/* Day header */}
            <Paper
              sx={{
                height: 60,
                p: 1,
                mb: 0.5,
                textAlign: 'center',
                background: isSameDay(day, new Date())
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'grey.100',
                color: isSameDay(day, new Date()) ? 'white' : 'text.primary',
              }}
            >
              <Typography variant="caption" display="block" fontWeight={600}>
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="h6" fontWeight={600}>
                {format(day, 'd')}
              </Typography>
            </Paper>

            {/* Hour slots */}
            {HOURS.map((hour) => {
              const slotEntries = getEntriesForSlot(day, hour)
              return (
                <Box
                  key={`${day}-${hour}`}
                  onClick={() => onSlotClick(day, hour)}
                  sx={{
                    height: 60,
                    border: '1px solid',
                    borderColor: 'divider',
                    position: 'relative',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                >
                  {slotEntries.map((entry, idx) => {
                    const start = parseISO(entry.startTime)
                    const end = entry.endTime ? parseISO(entry.endTime) : new Date()
                    const duration = calculateDuration(entry.startTime, end)
                    const minutes = Math.floor((start.getMinutes() / 60) * 100) / 100
                    const heightPercent = (duration / 3600) * 100

                    return (
                      <Paper
                        key={entry.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEntryClick(entry)
                        }}
                        sx={{
                          position: 'absolute',
                          top: `${minutes * 60}px`,
                          left: `${(idx / slotEntries.length) * 100}%`,
                          width: `${100 / slotEntries.length}%`,
                          height: `${Math.max(heightPercent, 5)}%`,
                          minHeight: '20px',
                          p: 0.5,
                          backgroundColor: entry.project?.color || 'primary.main',
                          color: 'white',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.9,
                            zIndex: 1,
                          },
                        }}
                      >
                        <Typography variant="caption" noWrap sx={{ fontSize: '0.7rem' }}>
                          {entry.description || 'No description'}
                        </Typography>
                        <Typography variant="caption" display="block" sx={{ fontSize: '0.65rem', opacity: 0.9 }}>
                          {formatDurationHours(duration)}h
                        </Typography>
                      </Paper>
                    )
                  })}
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    </Box>
  )
}
