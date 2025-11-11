import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
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
  FormControlLabel,
  Switch,
  Typography,
  Chip,
  IconButton,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../services/timeEntryService'
import { projectService } from '../services/projectService'
import { clientService } from '../services/clientService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'
import { format, addDays } from 'date-fns'
import { useSnackbar } from 'notistack'
import FileUpload from './FileUpload'
import DeleteIcon from '@mui/icons-material/Delete'

export default function TimeEntryModal({ open, onClose, entry, initialSlot, weekStart }) {
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const [files, setFiles] = useState([])
  const isEdit = !!entry

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
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
  const tags = tagsData?.data || []
  const teams = teamsData?.data || []

  const { register, handleSubmit, control, watch, setValue, reset, formState: { errors } } = useForm({
    defaultValues: {
      description: '',
      date: initialSlot?.day || new Date(),
      startTime: initialSlot ? new Date(initialSlot.day.setHours(initialSlot.hour, 0, 0, 0)) : new Date(),
      endTime: initialSlot ? new Date(initialSlot.day.setHours(initialSlot.hour + 1, 0, 0, 0)) : new Date(),
      projectId: '',
      tagIds: [],
      teamIds: [],
      isBillable: false,
    },
  })

  useEffect(() => {
    if (entry) {
      reset({
        description: entry.description || '',
        date: entry.startTime ? new Date(entry.startTime) : new Date(),
        startTime: entry.startTime ? new Date(entry.startTime) : new Date(),
        endTime: entry.endTime ? new Date(entry.endTime) : new Date(),
        projectId: entry.projectId || '',
        tagIds: entry.tags?.map((t) => t.id) || [],
        teamIds: entry.teams?.map((t) => t.id) || [],
        isBillable: entry.isBillable || false,
      })
      setFiles(entry.attachments || [])
    } else if (initialSlot) {
      const slotDate = initialSlot.day
      reset({
        description: '',
        date: slotDate,
        startTime: new Date(slotDate.setHours(initialSlot.hour, 0, 0, 0)),
        endTime: new Date(slotDate.setHours(initialSlot.hour + 1, 0, 0, 0)),
        projectId: '',
        tagIds: [],
        teamIds: [],
        isBillable: false,
      })
    } else {
      reset({
        description: '',
        date: new Date(),
        startTime: new Date(),
        endTime: new Date(),
        projectId: '',
        tagIds: [],
        teamIds: [],
        isBillable: false,
      })
    }
  }, [entry, initialSlot, reset])

  const startTime = watch('startTime')
  const endTime = watch('endTime')

  const createMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry(data),
    onSuccess: async (response) => {
      const timeEntry = response.data || response
      // Upload files if any
      if (files.length > 0 && timeEntry.id) {
        try {
          await timeEntryService.uploadAttachments(timeEntry.id, files)
        } catch (error) {
          console.error('Error uploading files:', error)
        }
      }
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Time entry created', { variant: 'success' })
      handleClose()
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create entry', { variant: 'error' })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => timeEntryService.updateTimeEntry(id, data),
    onSuccess: async () => {
      // Handle file uploads/deletions if needed
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Time entry updated', { variant: 'success' })
      handleClose()
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update entry', { variant: 'error' })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => timeEntryService.deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timeEntries'] })
      queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      enqueueSnackbar('Time entry deleted', { variant: 'success' })
      handleClose()
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete entry', { variant: 'error' })
    },
  })

  const handleClose = () => {
    reset()
    setFiles([])
    onClose()
  }

  const onSubmit = (data) => {
    const payload = {
      description: data.description,
      startTime: data.startTime.toISOString(),
      endTime: data.endTime.toISOString(),
      projectId: data.projectId || null,
      tagIds: data.tagIds,
      teamIds: data.teamIds,
      isBillable: data.isBillable,
    }

    if (isEdit) {
      updateMutation.mutate({ id: entry.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this time entry?')) {
      deleteMutation.mutate(entry.id)
    }
  }

  const calculateDuration = () => {
    if (startTime && endTime) {
      const diff = (endTime - startTime) / 1000 / 3600
      return diff > 0 ? `${diff.toFixed(2)} hours` : '0 hours'
    }
    return '0 hours'
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogTitle>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {isEdit ? 'Edit Time Entry' : 'New Time Entry'}
              {isEdit && (
                <IconButton onClick={handleDelete} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, pt: 2 }}>
              <TextField
                {...register('description', { required: 'Description is required' })}
                label="Description"
                multiline
                rows={3}
                fullWidth
                error={!!errors.description}
                helperText={errors.description?.message}
              />

              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
                <Controller
                  name="date"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <DatePicker
                      label="Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.date,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="startTime"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TimePicker
                      label="Start Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.startTime,
                        },
                      }}
                    />
                  )}
                />
                <Controller
                  name="endTime"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <TimePicker
                      label="End Time"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          error: !!errors.endTime,
                        },
                      }}
                    />
                  )}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">
                  Duration: {calculateDuration()}
                </Typography>
              </Box>

              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Project">
                      <MenuItem value="">None</MenuItem>
                      {projects.map((project) => (
                        <MenuItem key={project.id} value={project.id}>
                          {project.client?.name ? `${project.client.name} - ` : ''}{project.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Controller
                  name="tagIds"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      label="Tags"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const tag = tags.find((t) => t.id === value)
                            return tag ? <Chip key={value} label={tag.name} size="small" /> : null
                          })}
                        </Box>
                      )}
                    >
                      {tags.map((tag) => (
                        <MenuItem key={tag.id} value={tag.id}>
                          {tag.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Teams</InputLabel>
                <Controller
                  name="teamIds"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      multiple
                      label="Teams"
                      renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => {
                            const team = teams.find((t) => t.id === value)
                            return team ? (
                              <Chip
                                key={value}
                                label={team.name}
                                size="small"
                                sx={{ backgroundColor: team.color || 'primary.main' }}
                              />
                            ) : null
                          })}
                        </Box>
                      )}
                    >
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
              />

              <FileUpload files={files} onChange={setFiles} />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={createMutation.isPending || updateMutation.isPending}
            >
              {isEdit ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  )
}
