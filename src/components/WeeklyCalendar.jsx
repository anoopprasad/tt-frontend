import { Box, Paper, Typography, Skeleton } from '@mui/material'
import { format, addDays, getHours, getMinutes, parseISO, isSameDay } from 'date-fns'
import { useMemo } from 'react'

const hours = Array.from({ length: 24 }, (_, i) => i)
const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function WeeklyCalendar({ weekStart, timeEntries, onSlotClick, onEntryClick, isLoading }) {
  const entriesByDay = useMemo(() => {
    const grouped = {}
    timeEntries.forEach((entry) => {
      if (entry.startTime) {
        const date = format(parseISO(entry.startTime), 'yyyy-MM-dd')
        if (!grouped[date]) {
          grouped[date] = []
        }
        grouped[date].push(entry)
      }
    })
    return grouped
  }, [timeEntries])

  const getEntryPosition = (entry) => {
    if (!entry.startTime || !entry.endTime) return null

    const start = parseISO(entry.startTime)
    const end = parseISO(entry.endTime)
    const dayIndex = Math.floor((start - weekStart) / (1000 * 60 * 60 * 24))
    
    if (dayIndex < 0 || dayIndex > 6) return null

    const startHour = getHours(start) + getMinutes(start) / 60
    const endHour = getHours(end) + getMinutes(end) / 60
    const duration = endHour - startHour

    return {
      dayIndex,
      top: (startHour / 24) * 100,
      height: (duration / 24) * 100,
    }
  }

  const getDayDate = (dayIndex) => {
    return addDays(weekStart, dayIndex)
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" height={800} />
  }

  return (
    <Paper sx={{ overflow: 'auto', p: 2 }}>
      <Box sx={{ display: 'grid', gridTemplateColumns: '60px repeat(7, 1fr)', gap: 1 }}>
        {/* Header */}
        <Box />
        {days.map((day, index) => {
          const dayDate = getDayDate(index)
          return (
            <Box key={day} sx={{ textAlign: 'center', p: 1 }}>
              <Typography variant="caption" display="block" fontWeight={600}>
                {day}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(dayDate, 'dd')}
              </Typography>
            </Box>
          )
        })}

        {/* Time slots */}
        {hours.map((hour) => (
          <Box key={hour}>
            <Box sx={{ p: 1, textAlign: 'right' }}>
              <Typography variant="caption" color="text.secondary">
                {hour}:00
              </Typography>
            </Box>
            {days.map((_, dayIndex) => {
              const dayDate = getDayDate(dayIndex)
              const dateKey = format(dayDate, 'yyyy-MM-dd')
              const dayEntries = entriesByDay[dateKey] || []

              return (
                <Box
                  key={`${hour}-${dayIndex}`}
                  sx={{
                    position: 'relative',
                    minHeight: '60px',
                    border: '1px solid',
                    borderColor: 'divider',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover',
                    },
                  }}
                  onClick={() => onSlotClick(dayDate, hour)}
                >
                  {dayEntries
                    .filter((entry) => {
                      if (!entry.startTime) return false
                      const start = parseISO(entry.startTime)
                      const entryHour = getHours(start)
                      return entryHour === hour
                    })
                    .map((entry) => {
                      const pos = getEntryPosition(entry)
                      if (!pos || pos.dayIndex !== dayIndex) return null

                      return (
                        <Box
                          key={entry.id}
                          onClick={(e) => {
                            e.stopPropagation()
                            onEntryClick(entry)
                          }}
                          sx={{
                            position: 'absolute',
                            top: `${pos.top}%`,
                            height: `${Math.max(pos.height, 5)}%`,
                            left: 0,
                            right: 0,
                            backgroundColor: entry.isBillable ? 'primary.main' : 'secondary.main',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 1,
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            zIndex: 1,
                            '&:hover': {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Typography variant="caption" noWrap>
                            {entry.description || 'No description'}
                          </Typography>
                          <Typography variant="caption" display="block">
                            {entry.project?.name || 'No project'}
                          </Typography>
                        </Box>
                      )
                    })}
                </Box>
              )
            })}
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
