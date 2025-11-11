import { useState, useEffect } from 'react'
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
  Chip,
  IconButton,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm, Controller } from 'react-hook-form'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import { projectsApi } from '../../api/projects'
import { clientsApi } from '../../api/clients'
import { tagsApi } from '../../api/tags'
import { teamsApi } from '../../api/teams'
import { timeEntriesApi } from '../../api/timeEntries'
import { attachmentsApi } from '../../api/attachments'
import { useSnackbar } from '../../components/SnackbarProvider'
import { formatDate, formatTime, calculateDuration } from '../../utils/dateUtils'
import { FileUpload } from './FileUpload'

export const TimeEntryModal = ({ open, onClose, entry, initialSlot, weekStart }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const isEdit = !!entry
  const [uploadedFiles, setUploadedFiles] = useState([])

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list()
      return response.data || []
    },
  })

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.list()
      return response.data || []
    },
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.list()
      return response.data || []
    },
  })

  const projects = projectsData || []
  const tags = tagsData || []
  const teams = teamsData || []

  const { register, handleSubmit, control, watch, setValue, reset } = useForm({
    defaultValues: {
      description: '',
      date: formatDate(new Date()),
      startTime: '09:00',
      endTime: '17:00',
      projectId: '',
      tagIds: [],
      teamIds: [],
      isBillable: false,
    },
  })

  const startTime = watch('startTime')
  const endTime = watch('endTime')
  const date = watch('date')

  useEffect(() => {
    if (entry) {
      reset({
        description: entry.description || '',
        date: entry.startTime ? formatDate(entry.startTime) : formatDate(new Date()),
        startTime: entry.startTime ? formatTime(entry.startTime) : '09:00',
        endTime: entry.endTime ? formatTime(entry.endTime) : '17:00',
        projectId: entry.projectId || '',
        tagIds: entry.tags?.map((t) => t.id) || [],
        teamIds: entry.teams?.map((t) => t.id) || [],
        isBillable: entry.isBillable || false,
      })
      setUploadedFiles(entry.attachments || [])
    } else if (initialSlot) {
      const { day, hour } = initialSlot
      const startHour = hour.toString().padStart(2, '0')
      const endHour = (hour + 1).toString().padStart(2, '0')
      reset({
        description: '',
        date: formatDate(day),
        startTime: `${startHour}:00`,
        endTime: `${endHour}:00`,
        projectId: '',
        tagIds: [],
        teamIds: [],
        isBillable: false,
      })
      setUploadedFiles([])
    } else {
      reset({
        description: '',
        date: formatDate(new Date()),
        startTime: '09:00',
        endTime: '17:00',
        projectId: '',
        tagIds: [],
        teamIds: [],
        isBillable: false,
      })
      setUploadedFiles([])
    }
  }, [entry, initialSlot, reset])

  const onSubmit = async (data) => {
    try {
      const startDateTime = new Date(`${data.date}T${data.startTime}`)
      const endDateTime = new Date(`${data.date}T${data.endTime}`)

      const payload = {
        description: data.description,
        startTime: startDateTime.toISOString(),
        endTime: endDateTime.toISOString(),
        projectId: data.projectId || null,
        tagIds: data.tagIds,
        teamIds: data.teamIds,
        isBillable: data.isBillable,
      }

      if (isEdit) {
        await timeEntriesApi.update(entry.id, payload)
        showSnackbar('Time entry updated', 'success')
      } else {
        const response = await timeEntriesApi.create(payload)
        const newEntry = response.data

        // Upload files if any
        if (uploadedFiles.length > 0) {
          const filesToUpload = uploadedFiles.filter((f) => f instanceof File)
          if (filesToUpload.length > 0) {
            await timeEntriesApi.uploadAttachments(newEntry.id, filesToUpload)
          }
        }

        showSnackbar('Time entry created', 'success')
      }

      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    } catch (error) {
      showSnackbar(
        error.response?.data?.error?.message || 'Failed to save time entry',
        'error'
      )
    }
  }

  const handleDelete = async () => {
    if (!isEdit || !window.confirm('Are you sure you want to delete this time entry?')) {
      return
    }

    try {
      await timeEntriesApi.delete(entry.id)
      showSnackbar('Time entry deleted', 'success')
      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    } catch (error) {
      showSnackbar(
        error.response?.data?.error?.message || 'Failed to delete time entry',
        'error'
      )
    }
  }

  const handleFileUpload = (files) => {
    setUploadedFiles((prev) => [...prev, ...files])
  }

  const handleFileDelete = async (fileId, index) => {
    if (fileId) {
      // Delete from server
      try {
        await attachmentsApi.delete(fileId)
        showSnackbar('File deleted', 'success')
      } catch (error) {
        showSnackbar('Failed to delete file', 'error')
        return
      }
    }
    // Remove from local state
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>
          {isEdit ? 'Edit Time Entry' : 'New Time Entry'}
          {isEdit && (
            <IconButton
              onClick={handleDelete}
              color="error"
              sx={{ float: 'right' }}
            >
              <DeleteIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('description', { required: 'Description is required' })}
              label="Description"
              multiline
              rows={3}
              fullWidth
            />

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                {...register('date', { required: true })}
                label="Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                {...register('startTime', { required: true })}
                label="Start Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                {...register('endTime', { required: true })}
                label="End Time"
                type="time"
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>

            <FormControl fullWidth>
              <InputLabel>Project</InputLabel>
              <Select {...register('projectId')} label="Project" defaultValue="">
                <MenuItem value="">None</MenuItem>
                {projects.map((project) => (
                  <MenuItem key={project.id} value={project.id}>
                    {project.name} {project.client && `(${project.client.name})`}
                  </MenuItem>
                ))}
              </Select>
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
              control={<Switch {...register('isBillable')} />}
              label="Billable"
            />

            <FileUpload
              files={uploadedFiles}
              onUpload={handleFileUpload}
              onDelete={handleFileDelete}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
