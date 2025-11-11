import { Box, Paper, Typography, Skeleton, Chip } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { timeEntryService } from '../../services/timeEntryService'
import { format, addDays, isSameDay, startOfDay, endOfDay } from 'date-fns'
import { PlayArrow } from '@mui/icons-material'
import { useTimerStore } from '../../stores/timerStore'

const HOURS = Array.from({ length: 24 }, (_, i) => i)
const HOUR_HEIGHT = 60 // pixels per hour

const WeeklyCalendar = ({ weekStart, onNewEntry, onEditEntry }) => {
  const isRunning = useTimerStore((state) => state.isRunning)
  
  const { data, isLoading } = useQuery({
    queryKey: ['timeEntries', 'week', format(weekStart, 'yyyy-MM-dd')],
    queryFn: () =>
      timeEntryService.getTimeEntries({
        startDate: startOfDay(weekStart).toISOString(),
        endDate: endOfDay(addDays(weekStart, 6)).toISOString(),
      }),
  })

  const entries = data?.data || []

  const getEntriesForDay = (day) => {
    return entries.filter((entry) => {
      if (!entry.startTime) return false
      return isSameDay(new Date(entry.startTime), day)
    })
  }

  const calculatePosition = (startTime) => {
    const date = new Date(startTime)
    const hours = date.getHours()
    const minutes = date.getMinutes()
    return (hours + minutes / 60) * HOUR_HEIGHT
  }

  const calculateHeight = (startTime, endTime) => {
    if (!endTime) return HOUR_HEIGHT // Default height for running timers
    const start = new Date(startTime)
    const end = new Date(endTime)
    const durationHours = (end - start) / (1000 * 60 * 60)
    return Math.max(durationHours * HOUR_HEIGHT, 30) // Minimum 30px
  }

  const formatDuration = (startTime, endTime) => {
    if (!endTime) return 'Running...'
    const start = new Date(startTime)
    const end = new Date(endTime)
    const hours = (end - start) / (1000 * 60 * 60)
    return `${hours.toFixed(1)}h`
  }

  if (isLoading) {
    return <Skeleton variant="rectangular" height={600} />
  }

  return (
    <Paper sx={{ overflow: 'auto', maxHeight: '70vh' }}>
      <Box sx={{ display: 'flex' }}>
        {/* Time Labels */}
        <Box sx={{ width: 60, flexShrink: 0, borderRight: 1, borderColor: 'divider' }}>
          <Box sx={{ height: 40, borderBottom: 1, borderColor: 'divider' }} />
          {HOURS.map((hour) => (
            <Box
              key={hour}
              sx={{
                height: HOUR_HEIGHT,
                borderBottom: 1,
                borderColor: 'divider',
                px: 1,
                display: 'flex',
                alignItems: 'flex-start',
                pt: 0.5,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                {format(new Date().setHours(hour, 0, 0, 0), 'HH:mm')}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Days */}
        {Array.from({ length: 7 }, (_, i) => {
          const day = addDays(weekStart, i)
          const dayEntries = getEntriesForDay(day)
          const isToday = isSameDay(day, new Date())

          return (
            <Box
              key={i}
              sx={{
                flex: 1,
                minWidth: 120,
                borderRight: i < 6 ? 1 : 0,
                borderColor: 'divider',
              }}
            >
              {/* Day Header */}
              <Box
                sx={{
                  height: 40,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isToday ? 'primary.light' : 'background.paper',
                  color: isToday ? 'white' : 'text.primary',
                }}
              >
                <Typography variant="body2" fontWeight={600}>
                  {format(day, 'EEE dd')}
                </Typography>
              </Box>

              {/* Time Slots */}
              <Box sx={{ position: 'relative', height: HOURS.length * HOUR_HEIGHT }}>
                {HOURS.map((hour) => (
                  <Box
                    key={hour}
                    sx={{
                      height: HOUR_HEIGHT,
                      borderBottom: 1,
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                    onClick={() => {
                      const dateTime = new Date(day)
                      dateTime.setHours(hour, 0, 0, 0)
                      onNewEntry(dateTime)
                    }}
                  />
                ))}

                {/* Time Entries */}
                {dayEntries.map((entry) => {
                  const top = calculatePosition(entry.startTime)
                  const height = calculateHeight(entry.startTime, entry.endTime)
                  const isRunningEntry = isRunning && !entry.endTime

                  return (
                    <Box
                      key={entry.id}
                      onClick={() => onEditEntry(entry)}
                      sx={{
                        position: 'absolute',
                        top: `${top}px`,
                        left: 4,
                        right: 4,
                        height: `${height}px`,
                        backgroundColor: isRunningEntry
                          ? 'error.light'
                          : entry.project?.color || 'primary.main',
                        color: 'white',
                        borderRadius: 1,
                        p: 0.5,
                        cursor: 'pointer',
                        overflow: 'hidden',
                        boxShadow: 1,
                        transition: 'all 0.2s',
                        '&:hover': {
                          boxShadow: 3,
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                        {isRunningEntry && <PlayArrow sx={{ fontSize: 14 }} />}
                        <Typography variant="caption" fontWeight={600}>
                          {formatDuration(entry.startTime, entry.endTime)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          display: 'block',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {entry.description || 'No description'}
                      </Typography>
                      {entry.project && (
                        <Typography
                          variant="caption"
                          sx={{
                            display: 'block',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            opacity: 0.9,
                            fontSize: '0.65rem',
                          }}
                        >
                          {entry.project.name}
                        </Typography>
                      )}
                    </Box>
                  )
                })}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Paper>
  )
}

export default WeeklyCalendar
