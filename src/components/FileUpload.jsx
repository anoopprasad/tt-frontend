import { useCallback } from 'react'
import {
  Box,
  Typography,
  Paper,
  IconButton,
  LinearProgress,
} from '@mui/material'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import DeleteIcon from '@mui/icons-material/Delete'
import ImageIcon from '@mui/icons-material/Image'
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile'

export default function FileUpload({ files, onChange }) {
  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      const droppedFiles = Array.from(e.dataTransfer.files)
      onChange([...files, ...droppedFiles])
    },
    [files, onChange]
  )

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
  }, [])

  const handleFileInput = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files)
      onChange([...files, ...selectedFiles])
    },
    [files, onChange]
  )

  const handleRemove = useCallback(
    (index) => {
      const newFiles = files.filter((_, i) => i !== index)
      onChange(newFiles)
    },
    [files, onChange]
  )

  const isImage = (file) => {
    if (typeof file === 'string') return false // Already uploaded file
    return file.type?.startsWith('image/')
  }

  const getFileName = (file) => {
    if (typeof file === 'string') return file
    return file.name
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Attachments
      </Typography>
      <Paper
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: 'divider',
          textAlign: 'center',
          cursor: 'pointer',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Drag and drop files here, or click to select
        </Typography>
        <input
          id="file-input"
          type="file"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </Paper>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          {files.map((file, index) => (
            <Paper
              key={index}
              sx={{
                p: 2,
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              {isImage(file) && typeof file !== 'string' ? (
                <Box
                  component="img"
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  sx={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: 1,
                  }}
                />
              ) : (
                <Box
                  sx={{
                    width: 60,
                    height: 60,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'action.hover',
                    borderRadius: 1,
                  }}
                >
                  {isImage(file) ? (
                    <ImageIcon />
                  ) : (
                    <InsertDriveFileIcon />
                  )}
                </Box>
              )}
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography variant="body2" noWrap>
                  {getFileName(file)}
                </Typography>
                {typeof file !== 'string' && (
                  <Typography variant="caption" color="text.secondary">
                    {(file.size / 1024).toFixed(2)} KB
                  </Typography>
                )}
              </Box>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  handleRemove(index)
                }}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Paper>
          ))}
        </Box>
      )}
    </Box>
  )
}
