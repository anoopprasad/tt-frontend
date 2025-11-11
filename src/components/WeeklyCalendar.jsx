import { useMemo } from 'react'
import {
  Paper,
  Box,
  Typography,
  Grid,
  Chip,
} from '@mui/material'
import { useTimerStore } from '../store/timerStore'
import { formatTime, formatHours } from '../utils/dateUtils'
import { format } from 'date-fns'

const HOURS = Array.from({ length: 24 }, (_, i) => i)

export default function WeeklyCalendar({ weekDays, timeEntries, onSlotClick, onEntryClick }) {
  const { runningTimer } = useTimerStore()

  // Group entries by day and hour
  const entriesByDayHour = useMemo(() => {
    const map = {}
    timeEntries.forEach((entry) => {
      if (!entry.startTime) return
      const date = new Date(entry.startTime)
      const day = format(date, 'yyyy-MM-dd')
      const hour = date.getHours()
      if (!map[day]) map[day] = {}
      if (!map[day][hour]) map[day][hour] = []
      map[day][hour].push(entry)
    })
    return map
  }, [timeEntries])

  const getDayKey = (date) => format(date, 'yyyy-MM-dd')

  const getEntryHeight = (duration) => {
    if (!duration) return 60
    const hours = parseFloat(formatHours(duration))
    return Math.max(60, hours * 60)
  }

  return (
    <Paper sx={{ p: 2 }}>
      <Grid container spacing={1}>
        {/* Header row */}
        <Grid item xs={1}>
          <Box sx={{ height: 40 }} />
        </Grid>
        {weekDays.map((day) => (
          <Grid item xs key={day}>
            <Box
              sx={{
                textAlign: 'center',
                py: 1,
                borderBottom: 2,
                borderColor: 'divider',
              }}
            >
              <Typography variant="body2" fontWeight={600}>
                {format(day, 'EEE')}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {format(day, 'MMM d')}
              </Typography>
            </Box>
          </Grid>
        ))}

        {/* Time slots */}
        {HOURS.map((hour) => (
          <Grid container item xs={12} key={hour} spacing={1}>
            <Grid item xs={1}>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ position: 'relative', top: -8 }}
              >
                {hour.toString().padStart(2, '0')}:00
              </Typography>
            </Grid>
            {weekDays.map((day) => {
              const dayKey = getDayKey(day)
              const entries = entriesByDayHour[dayKey]?.[hour] || []
              const isToday = getDayKey(new Date()) === dayKey
              const isRunningTimer =
                runningTimer &&
                getDayKey(new Date(runningTimer.startTime)) === dayKey &&
                new Date(runningTimer.startTime).getHours() === hour

              return (
                <Grid item xs key={day}>
                  <Box
                    onClick={() => onSlotClick(day, hour)}
                    sx={{
                      minHeight: 60,
                      border: `1px solid ${isToday ? 'primary.main' : 'divider'}`,
                      borderLeft: isToday ? `3px solid primary.main` : '1px solid divider',
                      backgroundColor: isToday ? 'action.hover' : 'background.paper',
                      p: 0.5,
                      cursor: 'pointer',
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    {isRunningTimer && (
                      <Chip
                        label="LIVE"
                        size="small"
                        color="error"
                        sx={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          fontSize: '0.65rem',
                          height: 18,
                        }}
                      />
                    )}
                    {entries.map((entry) => (
                      <Box
                        key={entry.id}
                        onClick={(e) => {
                          e.stopPropagation()
                          onEntryClick(entry)
                        }}
                        sx={{
                          backgroundColor: entry.isBillable ? 'primary.light' : 'secondary.light',
                          color: 'white',
                          p: 0.5,
                          mb: 0.5,
                          borderRadius: 1,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          '&:hover': {
                            opacity: 0.8,
                          },
                        }}
                      >
                        <Typography variant="caption" noWrap>
                          {entry.description || 'No description'}
                        </Typography>
                        {entry.duration && (
                          <Typography variant="caption" display="block">
                            {formatHours(entry.duration)}h
                          </Typography>
                        )}
                      </Box>
                    ))}
                  </Box>
                </Grid>
              )
            })}
          </Grid>
        ))}
      </Grid>
    </Paper>
  )
}
