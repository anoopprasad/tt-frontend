import { useState } from 'react'
import { Box, Typography, IconButton, Card, Button, Grid } from '@mui/material'
import { ChevronLeft, ChevronRight, Add } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { format, startOfWeek, addDays, addWeeks, subWeeks, isSameDay, parseISO } from 'date-fns'
import { timeEntryService } from '../services/timeEntryService'
import TimeEntryModal from '../components/TimeEntryModal'
import WeeklyCalendar from '../components/WeeklyCalendar'

export default function TimeLogPage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)

  const weekStart = format(currentWeek, 'yyyy-MM-dd')
  const weekEnd = format(addDays(currentWeek, 6), 'yyyy-MM-dd')

  const { data, isLoading } = useQuery({
    queryKey: ['timeEntries', { startDate: weekStart, endDate: weekEnd }],
    queryFn: () => timeEntryService.getTimeEntries({ startDate: weekStart, endDate: weekEnd }),
  })

  const timeEntries = data?.data || []

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleToday = () => {
    setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))
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
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Time Log
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setSelectedSlot(null)
            setSelectedEntry(null)
            setModalOpen(true)
          }}
        >
          Add Entry
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
          <IconButton onClick={handlePreviousWeek}>
            <ChevronLeft />
          </IconButton>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="h6">
              {format(currentWeek, 'MMM dd')} - {format(addDays(currentWeek, 6), 'MMM dd, yyyy')}
            </Typography>
            <Button size="small" onClick={handleToday} sx={{ mt: 1 }}>
              Today
            </Button>
          </Box>
          <IconButton onClick={handleNextWeek}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Card>

      <WeeklyCalendar
        weekStart={currentWeek}
        timeEntries={timeEntries}
        onSlotClick={handleSlotClick}
        onEntryClick={handleEntryClick}
        isLoading={isLoading}
      />

      <TimeEntryModal
        open={modalOpen}
        onClose={handleModalClose}
        entry={selectedEntry}
        initialSlot={selectedSlot}
        weekStart={currentWeek}
      />
    </Box>
  )
}
