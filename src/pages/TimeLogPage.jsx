import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  Button,
  CircularProgress,
} from '@mui/material'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import TodayIcon from '@mui/icons-material/Today'
import { timeEntryService } from '../services/timeEntryService'
import { getWeekDays, getNextWeek, getPreviousWeek, formatDate } from '../utils/dateUtils'
import TimeEntryForm from '../components/TimeEntryForm'
import WeeklyCalendar from '../components/WeeklyCalendar'

export default function TimeLogPage() {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [editingEntry, setEditingEntry] = useState(null)
  const [formOpen, setFormOpen] = useState(false)

  const weekDays = getWeekDays(currentWeek)
  const startDate = weekDays[0]
  const endDate = weekDays[6]

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['timeEntries', { startDate: formatDate(startDate), endDate: formatDate(endDate) }],
    queryFn: () =>
      timeEntryService.getTimeEntries({
        startDate: formatDate(startDate),
        endDate: formatDate(endDate),
      }),
  })

  const timeEntries = data?.data || []

  const handlePreviousWeek = () => {
    setCurrentWeek(getPreviousWeek(currentWeek))
  }

  const handleNextWeek = () => {
    setCurrentWeek(getNextWeek(currentWeek))
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  const handleSlotClick = (day, hour) => {
    setSelectedSlot({ day, hour })
    setEditingEntry(null)
    setFormOpen(true)
  }

  const handleEntryClick = (entry) => {
    setEditingEntry(entry)
    setSelectedSlot(null)
    setFormOpen(true)
  }

  const handleFormClose = () => {
    setFormOpen(false)
    setSelectedSlot(null)
    setEditingEntry(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    refetch()
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Time Log
        </Typography>
        <Box display="flex" gap={1} alignItems="center">
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
            {startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
            {endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Typography>
        </Box>
      </Box>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : (
        <WeeklyCalendar
          weekDays={weekDays}
          timeEntries={timeEntries}
          onSlotClick={handleSlotClick}
          onEntryClick={handleEntryClick}
        />
      )}

      <TimeEntryForm
        open={formOpen}
        onClose={handleFormClose}
        onSuccess={handleFormSuccess}
        initialData={editingEntry}
        slotData={selectedSlot}
        weekStart={startDate}
      />
    </Box>
  )
}
