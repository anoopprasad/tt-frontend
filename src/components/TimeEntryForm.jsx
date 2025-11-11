import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Typography,
  Chip,
  IconButton,
} from '@mui/material'
import { useForm, Controller } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../services/timeEntryService'
import { projectService } from '../services/projectService'
import { clientService } from '../services/clientService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'
import { useSnackbar } from './SnackbarProvider'
import FileUpload from './FileUpload'
import CloseIcon from '@mui/icons-material/Close'
import { format } from 'date-fns'

export default function TimeEntryForm({
  open,
  onClose,
  onSuccess,
  initialData,
  slotData,
  weekStart,
}) {
  const { register, handleSubmit, control, reset, watch, setValue } = useForm()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [files, setFiles] = useState([])

  const isEditMode = !!initialData

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  })

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
  })

  const projects = projectsData?.data || []
  const clients = clientsData?.data || []
  const tags = tagsData?.data || []
  const teams = teamsData?.data || []

  // Group projects by client
  const projectsByClient = projects.reduce((acc, project) => {
    const clientId = project.clientId || 'none'
    if (!acc[clientId]) acc[clientId] = []
    acc[clientId].push(project)
    return acc
  }, {})

  useEffect(() => {
    if (open) {
      if (initialData) {
        // Edit mode
        reset({
          description: initialData.description || '',
          date: initialData.startTime
            ? format(new Date(initialData.startTime), 'yyyy-MM-dd')
            : format(new Date(), 'yyyy-MM-dd'),
          startTime: initialData.startTime
            ? format(new Date(initialData.startTime), 'HH:mm')
            : '',
          endTime: initialData.endTime
            ? format(new Date(initialData.endTime), 'HH:mm')
            : '',
          duration: initialData.duration
            ? (initialData.duration / 3600).toFixed(2)
            : '',
          projectId: initialData.projectId || '',
          tagIds: initialData.tags?.map((t) => t.id) || [],
          teamIds: initialData.teams?.map((t) => t.id) || [],
          isBillable: initialData.isBillable || false,
        })
        setFiles(initialData.attachments || [])
      } else if (slotData) {
        // New entry from calendar slot
        const slotDate = slotData.day
        const slotHour = slotData.hour
        reset({
          description: '',
          date: format(slotDate, 'yyyy-MM-dd'),
          startTime: `${slotHour.toString().padStart(2, '0')}:00`,
          endTime: `${(slotHour + 1).toString().padStart(2, '0')}:00`,
          duration: '1.00',
          projectId: '',
          tagIds: [],
          teamIds: [],
          isBillable: false,
        })
        setFiles([])
      } else {
        // New entry
        reset({
          description: '',
          date: format(new Date(), 'yyyy-MM-dd'),
          startTime: '',
          endTime: '',
          duration: '',
          projectId: '',
          tagIds: [],
          teamIds: [],
          isBillable: false,
        })
        setFiles([])
      }
    }
  }, [open, initialData, slotData, reset])

  const startTime = watch('startTime')
  const endTime = watch('endTime')

  // Calculate duration when times change
  useEffect(() => {
    if (startTime && endTime) {
      const [startH, startM] = startTime.split(':').map(Number)
      const [endH, endM] = endTime.split(':').map(Number)
      const startMinutes = startH * 60 + startM
      const endMinutes = endH * 60 + endM
      const durationHours = (endMinutes - startMinutes) / 60
      if (durationHours > 0) {
        setValue('duration', durationHours.toFixed(2))
      }
    }
  }, [startTime, endTime, setValue])

  const createMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry(data),
    onSuccess: async (response) => {
      const entryId = response.data.id
      // Upload files if any
      if (files.length > 0 && files[0] instanceof File) {
        try {
          await timeEntryService.uploadAttachments(entryId, files)
        } catch (error) {
          console.error('File upload error:', error)
        }
      }
      showSuccess('Time entry created successfully')
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onSuccess()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to create time entry')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => timeEntryService.updateTimeEntry(id, data),
    onSuccess: async () => {
      // Handle file uploads if needed
      showSuccess('Time entry updated successfully')
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      onSuccess()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to update time entry')
    },
  })

  const onSubmit = (data) => {
    const date = data.date
    const startDateTime = data.startTime
      ? `${date}T${data.startTime}:00`
      : null
    const endDateTime = data.endTime ? `${date}T${data.endTime}:00` : null

    const payload = {
      description: data.description,
      startTime: startDateTime,
      endTime: endDateTime,
      duration: data.duration ? parseFloat(data.duration) * 3600 : null,
      projectId: data.projectId || null,
      tagIds: data.tagIds || [],
      teamIds: data.teamIds || [],
      isBillable: data.isBillable || false,
    }

    if (isEditMode) {
      updateMutation.mutate({ id: initialData.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" fontWeight={600}>
              {isEditMode ? 'Edit Time Entry' : 'New Time Entry'}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            {...register('description', { required: 'Description is required' })}
            label="Description"
            fullWidth
            multiline
            rows={3}
            margin="normal"
            required
          />

          <Box display="flex" gap={2} mt={2}>
            <TextField
              {...register('date', { required: true })}
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              {...register('startTime')}
              label="Start Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              {...register('endTime')}
              label="End Time"
              type="time"
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              {...register('duration')}
              label="Duration (hours)"
              type="number"
              fullWidth
              inputProps={{ step: 0.25, min: 0 }}
            />
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Project</InputLabel>
            <Controller
              name="projectId"
              control={control}
              render={({ field }) => (
                <Select {...field} label="Project">
                  <MenuItem value="">None</MenuItem>
                  {Object.entries(projectsByClient).map(([clientId, clientProjects]) => {
                    const client = clients.find((c) => c.id === parseInt(clientId))
                    return clientProjects.map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {client?.name ? `${client.name} - ` : ''}
                        {project.name}
                      </MenuItem>
                    ))
                  })}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Tags</InputLabel>
            <Controller
              name="tagIds"
              control={control}
              render={({ field }) => (
                <Select {...field} multiple label="Tags" renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const tag = tags.find((t) => t.id === value)
                      return <Chip key={value} label={tag?.name || value} size="small" />
                    })}
                  </Box>
                )}>
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Teams</InputLabel>
            <Controller
              name="teamIds"
              control={control}
              render={({ field }) => (
                <Select {...field} multiple label="Teams" renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => {
                      const team = teams.find((t) => t.id === value)
                      return <Chip key={value} label={team?.name || value} size="small" />
                    })}
                  </Box>
                )}>
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <FormControlLabel
            control={
              <Controller
                name="isBillable"
                control={control}
                render={({ field }) => <Switch {...field} checked={field.value} />}
              />
            }
            label="Billable"
            sx={{ mt: 2 }}
          />

          <Box mt={2}>
            <FileUpload files={files} onChange={setFiles} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {isEditMode
              ? updateMutation.isPending
                ? 'Updating...'
                : 'Update'
              : createMutation.isPending
              ? 'Creating...'
              : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
