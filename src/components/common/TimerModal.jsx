import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Alert,
} from '@mui/material'
import { PlayArrow, Stop } from '@mui/icons-material'
import { useTimerStore } from '../../stores/timerStore'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '../../services/projectService'
import { timeEntryService } from '../../services/timeEntryService'
import ProjectSelector from '../forms/ProjectSelector'

const TimerModal = ({ open, onClose }) => {
  const queryClient = useQueryClient()
  const isRunning = useTimerStore((state) => state.isRunning)
  const description = useTimerStore((state) => state.description)
  const projectId = useTimerStore((state) => state.projectId)
  const timeEntryId = useTimerStore((state) => state.timeEntryId)
  const startTimer = useTimerStore((state) => state.startTimer)
  const stopTimer = useTimerStore((state) => state.stopTimer)
  const updateDescription = useTimerStore((state) => state.updateDescription)
  const updateProject = useTimerStore((state) => state.updateProject)

  const [localDescription, setLocalDescription] = useState('')
  const [localProjectId, setLocalProjectId] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isRunning) {
      setLocalDescription(description)
      setLocalProjectId(projectId)
    } else {
      setLocalDescription('')
      setLocalProjectId(null)
    }
  }, [isRunning, description, projectId, open])

  // Start timer mutation
  const startMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry(data),
    onSuccess: (response) => {
      const entry = response?.data
      if (entry) {
        startTimer(
          localDescription,
          localProjectId,
          entry.id,
          entry.startTime
        )
        queryClient.invalidateQueries(['timeEntries'])
        onClose()
      }
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Failed to start timer')
    },
  })

  // Stop timer mutation
  const stopMutation = useMutation({
    mutationFn: (id) => timeEntryService.stopTimer(id),
    onSuccess: () => {
      stopTimer()
      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Failed to stop timer')
    },
  })

  const handleStart = () => {
    setError('')
    startMutation.mutate({
      description: localDescription,
      projectId: localProjectId,
      startTime: new Date().toISOString(),
    })
  }

  const handleStop = () => {
    setError('')
    if (timeEntryId) {
      stopMutation.mutate(timeEntryId)
    }
  }

  const handleDescriptionChange = (value) => {
    setLocalDescription(value)
    if (isRunning) {
      updateDescription(value)
    }
  }

  const handleProjectChange = (value) => {
    setLocalProjectId(value)
    if (isRunning) {
      updateProject(value)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isRunning ? 'Running Timer' : 'Start Timer'}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box sx={{ mt: 1 }}>
          <TextField
            fullWidth
            label="What are you working on?"
            value={localDescription}
            onChange={(e) => handleDescriptionChange(e.target.value)}
            multiline
            rows={3}
            sx={{ mb: 2 }}
            disabled={isRunning}
          />
          <ProjectSelector
            value={localProjectId}
            onChange={handleProjectChange}
            disabled={isRunning}
          />
          {isRunning && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
              Timer is running. Click Stop to complete this time entry.
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        {isRunning ? (
          <Button
            variant="contained"
            color="error"
            startIcon={<Stop />}
            onClick={handleStop}
            disabled={stopMutation.isPending}
          >
            Stop Timer
          </Button>
        ) : (
          <Button
            variant="contained"
            startIcon={<PlayArrow />}
            onClick={handleStart}
            disabled={startMutation.isPending}
          >
            Start Timer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default TimerModal
