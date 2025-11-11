import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Paper,
  Typography,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Delete as DeleteIcon,
  Download as DownloadIcon,
  InsertDriveFile as FileIcon,
} from '@mui/icons-material';
import { useMutation } from '@tanstack/react-query';
import { timeEntriesAPI } from '../../api/timeEntries';
import { useSnackbar } from 'notistack';

export const FileUpload = ({ entryId, attachments = [], onUploadSuccess }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [uploading, setUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: ({ entryId, file }) => timeEntriesAPI.uploadAttachment(entryId, file),
    onSuccess: () => {
      enqueueSnackbar('File uploaded successfully', { variant: 'success' });
      onUploadSuccess && onUploadSuccess();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to upload file', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: timeEntriesAPI.deleteAttachment,
    onSuccess: () => {
      enqueueSnackbar('File deleted successfully', { variant: 'success' });
      onUploadSuccess && onUploadSuccess();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete file', {
        variant: 'error',
      });
    },
  });

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (!entryId) {
        enqueueSnackbar('Please save the time entry first', { variant: 'warning' });
        return;
      }

      setUploading(true);
      for (const file of acceptedFiles) {
        await uploadMutation.mutateAsync({ entryId, file });
      }
      setUploading(false);
    },
    [entryId, uploadMutation, enqueueSnackbar]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: true,
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <Box>
      {/* Drop Zone */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          border: 2,
          borderStyle: 'dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          bgcolor: isDragActive ? 'action.hover' : 'background.paper',
          transition: 'all 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            bgcolor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" gutterBottom>
          {isDragActive ? 'Drop files here...' : 'Drag & drop files here'}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          or click to browse
        </Typography>
      </Paper>

      {uploading && (
        <Box sx={{ mt: 2 }}>
          <LinearProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
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
              <FileIcon sx={{ mr: 2, color: 'text.secondary' }} />
              <ListItemText
                primary={attachment.filename}
                secondary={attachment.fileSize ? formatFileSize(attachment.fileSize) : ''}
              />
              <ListItemSecondaryAction>
                {attachment.url && (
                  <IconButton
                    edge="end"
                    href={attachment.url}
                    target="_blank"
                    sx={{ mr: 1 }}
                  >
                    <DownloadIcon />
                  </IconButton>
                )}
                <IconButton
                  edge="end"
                  onClick={() => deleteMutation.mutate(attachment.id)}
                >
                  <DeleteIcon />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
      )}
    </Box>
  );
};
