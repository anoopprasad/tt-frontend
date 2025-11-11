import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  IconButton,
  Card,
  Button,
  Grid,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayIcon from '@mui/icons-material/Today'
import { format, startOfWeek, addDays, addWeeks, isSameDay, parseISO } from 'date-fns'
import { timeEntriesApi } from '../api/timeEntries'
import { getWeekStart, getWeekDays, formatTime, calculateDuration } from '../utils/dateUtils'
import { TimeEntryModal } from '../components/TimeEntry/TimeEntryModal'
import { WeeklyCalendar } from '../components/TimeEntry/WeeklyCalendar'

export const TimeLog = () => {
  const [currentWeek, setCurrentWeek] = useState(getWeekStart(new Date()))
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const weekStart = getWeekStart(currentWeek)
  const weekEnd = addDays(weekStart, 6)

  const { data: entriesData, isLoading } = useQuery({
    queryKey: ['timeEntries', weekStart.toISOString(), weekEnd.toISOString()],
    queryFn: async () => {
      const response = await timeEntriesApi.list({
        startDate: weekStart.toISOString(),
        endDate: weekEnd.toISOString(),
      })
      return response.data || []
    },
  })

  const entries = entriesData || []

  const handlePreviousWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleToday = () => {
    setCurrentWeek(getWeekStart(new Date()))
  }

  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour })
    setSelectedEntry(null)
    setModalOpen(true)
  }

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry)
    setSelectedSlot(null)
    setModalOpen(true)
  }

  const handleModalClose = () => {
    setModalOpen(false)
    setSelectedEntry(null)
    setSelectedSlot(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Time Log
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <IconButton onClick={handlePreviousWeek} size="small">
            <ChevronLeftIcon />
          </IconButton>
          <Button
            variant="outlined"
            startIcon={<TodayIcon />}
            onClick={handleToday}
            size="small"
          >
            Today
          </Button>
          <IconButton onClick={handleNextWeek} size="small">
            <ChevronRightIcon />
          </IconButton>
          <Typography variant="body1" sx={{ ml: 2, minWidth: 200 }}>
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </Typography>
        </Box>
      </Box>

      <Card>
        <WeeklyCalendar
          weekStart={weekStart}
          entries={entries}
          onSlotClick={handleSlotClick}
          onEntryClick={handleEntryClick}
          isLoading={isLoading}
        />
      </Card>

      <TimeEntryModal
        open={modalOpen}
        onClose={handleModalClose}
        entry={selectedEntry}
        initialSlot={selectedSlot}
        weekStart={weekStart}
      />
    </Box>
  )
}
