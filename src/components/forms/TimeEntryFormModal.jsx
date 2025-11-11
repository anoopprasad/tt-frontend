import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
  Alert,
  Box,
  IconButton,
} from '@mui/material'
import { DatePicker, TimePicker } from '@mui/x-date-pickers'
import { Delete } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../../services/timeEntryService'
import ProjectSelector from './ProjectSelector'
import TagsSelector from './TagsSelector'
import TeamsSelector from './TeamsSelector'
import FileUpload from '../common/FileUpload'
import { format } from 'date-fns'

const TimeEntryFormModal = ({ open, onClose, entry, initialDateTime }) => {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState({
    description: '',
    date: new Date(),
    startTime: new Date(),
    endTime: new Date(Date.now() + 3600000), // 1 hour later
    projectId: null,
    tagIds: [],
    teamIds: [],
    isBillable: false,
  })
  const [error, setError] = useState('')
  const [attachments, setAttachments] = useState([])

  // Initialize form data
  useEffect(() => {
    if (entry) {
      setFormData({
        description: entry.description || '',
        date: entry.startTime ? new Date(entry.startTime) : new Date(),
        startTime: entry.startTime ? new Date(entry.startTime) : new Date(),
        endTime: entry.endTime ? new Date(entry.endTime) : new Date(Date.now() + 3600000),
        projectId: entry.projectId || null,
        tagIds: entry.tags?.map((t) => t.id) || [],
        teamIds: entry.teams?.map((t) => t.id) || [],
        isBillable: entry.isBillable || false,
      })
      setAttachments(entry.attachments || [])
    } else if (initialDateTime) {
      const endTime = new Date(initialDateTime.getTime() + 3600000)
      setFormData((prev) => ({
        ...prev,
        date: initialDateTime,
        startTime: initialDateTime,
        endTime: endTime,
      }))
    }
  }, [entry, initialDateTime, open])

  // Create mutation
  const createMutation = useMutation({
    mutationFn: (data) => timeEntryService.createTimeEntry(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Failed to create time entry')
    },
  })

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => timeEntryService.updateTimeEntry(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Failed to update time entry')
    },
  })

  // Delete mutation
  const deleteMutation = useMutation({
    mutationFn: (id) => timeEntryService.deleteTimeEntry(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['timeEntries'])
      queryClient.invalidateQueries(['dashboard'])
      onClose()
    },
    onError: (err) => {
      setError(err.response?.data?.error?.message || 'Failed to delete time entry')
    },
  })

  const handleSubmit = () => {
    setError('')

    // Combine date with times
    const startDateTime = new Date(formData.date)
    startDateTime.setHours(
      formData.startTime.getHours(),
      formData.startTime.getMinutes(),
      0,
      0
    )

    const endDateTime = new Date(formData.date)
    endDateTime.setHours(
      formData.endTime.getHours(),
      formData.endTime.getMinutes(),
      0,
      0
    )

    if (endDateTime <= startDateTime) {
      setError('End time must be after start time')
      return
    }

    const payload = {
      description: formData.description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      projectId: formData.projectId,
      tagIds: formData.tagIds,
      teamIds: formData.teamIds,
      isBillable: formData.isBillable,
    }

    if (entry) {
      updateMutation.mutate({ id: entry.id, data: payload })
    } else {
      createMutation.mutate(payload)
    }
  }

  const handleDelete = () => {
    if (entry && window.confirm('Are you sure you want to delete this time entry?')) {
      deleteMutation.mutate(entry.id)
    }
  }

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>{entry ? 'Edit Time Entry' : 'Add Time Entry'}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Grid container spacing={2} sx={{ mt: 0.5 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Date"
              value={formData.date}
              onChange={(value) => handleChange('date', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TimePicker
              label="Start Time"
              value={formData.startTime}
              onChange={(value) => handleChange('startTime', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TimePicker
              label="End Time"
              value={formData.endTime}
              onChange={(value) => handleChange('endTime', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12}>
            <ProjectSelector
              value={formData.projectId}
              onChange={(value) => handleChange('projectId', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TagsSelector
              value={formData.tagIds}
              onChange={(value) => handleChange('tagIds', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TeamsSelector
              value={formData.teamIds}
              onChange={(value) => handleChange('teamIds', value)}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isBillable}
                  onChange={(e) => handleChange('isBillable', e.target.checked)}
                />
              }
              label="Billable"
            />
          </Grid>
          <Grid item xs={12}>
            <FileUpload
              timeEntryId={entry?.id}
              attachments={attachments}
              onAttachmentsChange={setAttachments}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2, justifyContent: 'space-between' }}>
        <Box>
          {entry && (
            <Button
              color="error"
              startIcon={<Delete />}
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
            >
              Delete
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {entry ? 'Update' : 'Create'}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  )
}

export default TimeEntryFormModal
