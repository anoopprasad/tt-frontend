import { useState } from 'react'
import { Box, Typography, Button, IconButton, Paper } from '@mui/material'
import { ChevronLeft, ChevronRight, Add } from '@mui/icons-material'
import { startOfWeek, endOfWeek, addWeeks, subWeeks, format } from 'date-fns'
import WeeklyCalendar from '../../components/calendar/WeeklyCalendar'
import TimeEntryFormModal from '../../components/forms/TimeEntryFormModal'

const TimeLog = () => {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [selectedDateTime, setSelectedDateTime] = useState(null)

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 1 })
  const weekEnd = endOfWeek(currentWeek, { weekStartsOn: 1 })

  const handlePreviousWeek = () => {
    setCurrentWeek(subWeeks(currentWeek, 1))
  }

  const handleNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const handleToday = () => {
    setCurrentWeek(new Date())
  }

  const handleNewEntry = (dateTime = null) => {
    setSelectedEntry(null)
    setSelectedDateTime(dateTime)
    setFormModalOpen(true)
  }

  const handleEditEntry = (entry) => {
    setSelectedEntry(entry)
    setSelectedDateTime(null)
    setFormModalOpen(true)
  }

  const handleCloseModal = () => {
    setFormModalOpen(false)
    setSelectedEntry(null)
    setSelectedDateTime(null)
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Time Log
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleNewEntry()}
        >
          Add Entry
        </Button>
      </Box>

      {/* Week Navigation */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <IconButton onClick={handlePreviousWeek}>
            <ChevronLeft />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="h6" fontWeight={600}>
              {format(weekStart, 'MMM dd')} - {format(weekEnd, 'MMM dd, yyyy')}
            </Typography>
            <Button size="small" onClick={handleToday} variant="outlined">
              Today
            </Button>
          </Box>
          <IconButton onClick={handleNextWeek}>
            <ChevronRight />
          </IconButton>
        </Box>
      </Paper>

      {/* Calendar */}
      <WeeklyCalendar
        weekStart={weekStart}
        onNewEntry={handleNewEntry}
        onEditEntry={handleEditEntry}
      />

      {/* Time Entry Form Modal */}
      <TimeEntryFormModal
        open={formModalOpen}
        onClose={handleCloseModal}
        entry={selectedEntry}
        initialDateTime={selectedDateTime}
      />
    </Box>
  )
}

export default TimeLog
