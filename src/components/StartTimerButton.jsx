import { useState } from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { timeEntryService } from '../services/timeEntryService'
import { projectService } from '../services/projectService'
import { useTimerStore } from '../store/timerStore'
import { useSnackbar } from './SnackbarProvider'

export default function StartTimerButton() {
  const [open, setOpen] = useState(false)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const { startTimer } = useTimerStore()

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const projects = projectsData?.data || []

  const startMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry({
      description: data.description,
      projectId: data.projectId || null,
      startTime: new Date().toISOString(),
    }),
    onSuccess: (response) => {
      const timeEntry = response.data
      startTimer({
        id: timeEntry.id,
        description: timeEntry.description,
        projectId: timeEntry.projectId,
      })
      setOpen(false)
      reset()
      showSuccess('Timer started')
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to start timer')
    },
  })

  const onSubmit = (data) => {
    startMutation.mutate(data)
  }

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        startIcon={<PlayArrowIcon />}
        onClick={() => setOpen(true)}
      >
        Start Timer
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>Start Timer</DialogTitle>
          <DialogContent sx={{ pt: 2 }}>
            <TextField
              {...register('description', { required: 'Description is required' })}
              label="Description"
              fullWidth
              multiline
              rows={3}
              error={!!errors.description}
              helperText={errors.description?.message}
              sx={{ mb: 2 }}
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
                    {project.client?.name ? `${project.client.name} - ` : ''}
                    {project.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="contained" disabled={startMutation.isPending}>
              Start
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
}
