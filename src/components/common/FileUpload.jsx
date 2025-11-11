import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  LinearProgress,
  Chip,
} from '@mui/material'
import { CloudUpload, Delete, InsertDriveFile, Image } from '@mui/icons-material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { timeEntryService } from '../../services/timeEntryService'

const FileUpload = ({ timeEntryId, attachments = [], onAttachmentsChange }) => {
  const queryClient = useQueryClient()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const uploadMutation = useMutation({
    mutationFn: ({ timeEntryId, file }) =>
      timeEntryService.uploadAttachment(timeEntryId, file),
    onSuccess: (data) => {
      const newAttachment = data?.data
      if (newAttachment) {
        onAttachmentsChange([...attachments, newAttachment])
        queryClient.invalidateQueries(['timeEntries'])
      }
      setUploading(false)
      setUploadProgress(0)
    },
    onError: (error) => {
      console.error('Upload failed:', error)
      setUploading(false)
      setUploadProgress(0)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (attachmentId) => timeEntryService.deleteAttachment(attachmentId),
    onSuccess: (_, attachmentId) => {
      onAttachmentsChange(attachments.filter((a) => a.id !== attachmentId))
      queryClient.invalidateQueries(['timeEntries'])
    },
  })

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (!timeEntryId) {
        alert('Please save the time entry first before uploading files')
        return
      }

      if (acceptedFiles.length > 0) {
        setUploading(true)
        setUploadProgress(30)
        uploadMutation.mutate({
          timeEntryId,
          file: acceptedFiles[0],
        })
      }
    },
    [timeEntryId, uploadMutation]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    disabled: !timeEntryId || uploading,
  })

  const handleDelete = (attachmentId) => {
    if (window.confirm('Are you sure you want to delete this attachment?')) {
      deleteMutation.mutate(attachmentId)
    }
  }

  const getFileIcon = (filename) => {
    const ext = filename.split('.').pop().toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
      return <Image />
    }
    return <InsertDriveFile />
  }

  return (
    <Box>
      <Typography variant="body2" fontWeight={500} gutterBottom>
        Attachments
      </Typography>

      {/* Dropzone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          backgroundColor: isDragActive ? 'action.hover' : 'background.paper',
          cursor: timeEntryId ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s',
          opacity: !timeEntryId || uploading ? 0.5 : 1,
          '&:hover': {
            borderColor: timeEntryId && !uploading ? 'primary.main' : 'divider',
            backgroundColor: timeEntryId && !uploading ? 'action.hover' : 'background.paper',
          },
        }}
      >
        <input {...getInputProps()} />
        <Box sx={{ textAlign: 'center' }}>
          <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
          <Typography variant="body1" gutterBottom>
            {isDragActive
              ? 'Drop the file here'
              : 'Drag & drop a file here, or click to select'}
          </Typography>
          {!timeEntryId && (
            <Chip label="Save entry first to upload files" size="small" color="warning" />
          )}
        </Box>
      </Paper>

      {/* Upload Progress */}
      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Uploading...
          </Typography>
        </Box>
      )}

      {/* Attachments List */}
      {attachments.length > 0 && (
        <List sx={{ mt: 2 }}>
          {attachments.map((attachment) => (
            <ListItem
              key={attachment.id}
              sx={{
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                mb: 1,
              }}
            >
              <Box sx={{ mr: 2 }}>{getFileIcon(attachment.filename)}</Box>
              <ListItemText
                primary={attachment.filename}
                secondary={attachment.fileSize ? `${(attachment.fileSize / 1024).toFixed(1)} KB` : ''}
              />
              <ListItemSecondaryAction>
                <IconButton
                  edge="end"
                  onClick={() => handleDelete(attachment.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  )
}

export default FileUpload
