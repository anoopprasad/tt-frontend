import { useState } from 'react'
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
} from '@mui/material'
import { useForm } from 'react-hook-form'
import { useQuery } from '@tanstack/react-query'
import { projectsApi } from '../../api/projects'
import { timeEntriesApi } from '../../api/timeEntries'
import { useTimerStore } from '../../stores/timerStore'
import { useSnackbar } from '../../components/SnackbarProvider'

export const StartTimerModal = ({ open, onClose }) => {
  const { showSnackbar } = useSnackbar()
  const { startTimer } = useTimerStore()
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list()
      return response.data || []
    },
  })

  const projects = projectsData || []

  const onSubmit = async (data) => {
    try {
      const response = await timeEntriesApi.create({
        description: data.description,
        projectId: data.projectId || null,
        startTime: new Date().toISOString(),
      })

      const timeEntry = response.data
      startTimer({
        id: timeEntry.id,
        description: data.description,
        projectId: data.projectId,
      })

      showSnackbar('Timer started', 'success')
      reset()
      onClose()
    } catch (error) {
      showSnackbar(
        error.response?.data?.error?.message || 'Failed to start timer',
        'error'
      )
    }
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
                    {project.name} {project.client && `(${project.client.name})`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            Start
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
