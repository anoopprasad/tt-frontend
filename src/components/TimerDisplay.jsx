import { useEffect } from 'react'
import { Box, Button, Typography, Chip } from '@mui/material'
import StopIcon from '@mui/icons-material/Stop'
import { useTimerStore } from '../store/timerStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../services/timeEntryService'
import { useSnackbar } from './SnackbarProvider'
import { formatDuration } from '../utils/dateUtils'

export default function TimerDisplay() {
  const { runningTimer, elapsedSeconds, stopTimer } = useTimerStore()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()

  const stopMutation = useMutation({
    mutationFn: () => timeEntryService.stopTimer(runningTimer.id),
    onSuccess: () => {
      stopTimer()
      showSuccess('Timer stopped successfully')
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to stop timer')
    },
  })

  const handleStop = () => {
    if (runningTimer?.id) {
      stopMutation.mutate()
    } else {
      stopTimer()
    }
  }

  const totalSeconds = elapsedSeconds
  const displayTime = formatDuration(totalSeconds)

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        backgroundColor: 'error.light',
        px: 2,
        py: 0.5,
        borderRadius: 2,
      }}
    >
      <Chip
        label="LIVE"
        size="small"
        sx={{
          backgroundColor: 'error.main',
          color: 'white',
          fontWeight: 600,
          animation: 'pulse 2s infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.7 },
          },
        }}
      />
      <Typography variant="body1" fontWeight={600} color="error.dark">
        {displayTime}
      </Typography>
      {runningTimer?.description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {runningTimer.description}
        </Typography>
      )}
      <Button
        variant="contained"
        color="error"
        size="small"
        startIcon={<StopIcon />}
        onClick={handleStop}
        disabled={stopMutation.isPending}
        sx={{ ml: 'auto' }}
      >
        Stop
      </Button>
    </Box>
  )
}
