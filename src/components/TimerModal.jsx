import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  CircularProgress,
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../services/timeEntryService'
import { projectService } from '../services/projectService'
import useTimerStore from '../stores/timerStore'
import { useSnackbar } from 'notistack'

export default function TimerModal({ open, onClose }) {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { startTimer } = useTimerStore()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const projects = projectsData?.data || []

  const createTimerMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry({
      description: data.description,
      projectId: data.projectId || null,
      startTime: new Date().toISOString(),
    }),
    onSuccess: (response) => {
      const timeEntry = response.data || response
      startTimer({
        id: timeEntry.id,
        description: timeEntry.description,
        projectId: timeEntry.projectId,
        startTime: timeEntry.startTime,
      })
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Timer started', { variant: 'success' })
      reset()
      onClose()
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to start timer', { variant: 'error' })
    },
  })

  const onSubmit = (data) => {
    createTimerMutation.mutate(data)
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>Start Timer</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('description', { required: 'Description is required' })}
              label="Description"
              multiline
              rows={3}
              fullWidth
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <FormControl fullWidth>
              <InputLabel>Project (Optional)</InputLabel>
              <Select
                {...register('projectId')}
                label="Project (Optional)"
                defaultValue=""
              >
                <MenuItem value="">None</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.client?.name ? `${project.client.name} - ` : ''}{project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} disabled={createTimerMutation.isPending}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createTimerMutation.isPending}
            startIcon={createTimerMutation.isPending ? <CircularProgress size={20} /> : null}
          >
            Start Timer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
