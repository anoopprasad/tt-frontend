import { useState, useCallback } from 'react'
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

export const FileUpload = ({ files, onUpload, onDelete }) => {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files)
      onUpload(droppedFiles)
    },
    [onUpload]
  )

  const handleFileInput = useCallback(
    (e) => {
      const selectedFiles = Array.from(e.target.files)
      onUpload(selectedFiles)
    },
    [onUpload]
  )

  const isImage = (file) => {
    if (file.url) {
      return file.url.match(/\.(jpg|jpeg|png|gif|webp)$/i)
    }
    return file.type?.startsWith('image/')
  }

  const getFileUrl = (file) => {
    if (file.url) return file.url
    if (file instanceof File) return URL.createObjectURL(file)
    return null
  }

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        Attachments
      </Typography>

      <Paper
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        sx={{
          p: 3,
          border: '2px dashed',
          borderColor: isDragging ? 'primary.main' : 'divider',
          backgroundColor: isDragging ? 'action.hover' : 'background.paper',
          textAlign: 'center',
          cursor: 'pointer',
          mb: 2,
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body2" color="text.secondary">
          Drag & drop files here, or click to select
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
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {files.map((file, index) => {
            const url = getFileUrl(file)
            const isImg = isImage(file)
            const fileName = file.name || file.fileName || 'Unknown file'

            return (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  width: 120,
                  position: 'relative',
                }}
              >
                {isImg && url ? (
                  <Box
                    component="img"
                    src={url}
                    alt={fileName}
                    sx={{
                      width: '100%',
                      height: 100,
                      objectFit: 'cover',
                      borderRadius: 1,
                    }}
                  />
                ) : (
                  <Box
                    sx={{
                      width: '100%',
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'grey.100',
                      borderRadius: 1,
                    }}
                  >
                    {isImg ? (
                      <ImageIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    ) : (
                      <InsertDriveFileIcon sx={{ fontSize: 40, color: 'text.secondary' }} />
                    )}
                  </Box>
                )}
                <Typography
                  variant="caption"
                  noWrap
                  sx={{
                    display: 'block',
                    mt: 0.5,
                    textAlign: 'center',
                  }}
                >
                  {fileName}
                </Typography>
                <IconButton
                  size="small"
                  onClick={() => onDelete(file.id, index)}
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    backgroundColor: 'error.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'error.dark',
                    },
                  }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Paper>
            )
          })}
        </Box>
      )}
    </Box>
  )
}
