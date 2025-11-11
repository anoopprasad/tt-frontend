import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Box, Typography, IconButton, Paper } from '@mui/material'
import { CloudUpload, Delete, Image as ImageIcon } from '@mui/icons-material'

export default function FileUpload({ files, onChange }) {
  const onDrop = useCallback(
    (acceptedFiles) => {
      onChange([...files, ...acceptedFiles])
    },
    [files, onChange]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-excel': ['.xls', '.xlsx'],
    },
  })

  const handleRemove = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    onChange(newFiles)
  }

  const isImage = (file) => {
    return file.type?.startsWith('image/') || file.name?.match(/\.(jpg|jpeg|png|gif)$/i)
  }

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'divider',
          borderRadius: 2,
          p: 3,
          textAlign: 'center',
          cursor: 'pointer',
          backgroundColor: isDragActive ? 'action.hover' : 'transparent',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'action.hover',
          },
        }}
      >
        <input {...getInputProps()} />
        <CloudUpload sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
        <Typography variant="body1" gutterBottom>
          {isDragActive ? 'Drop files here' : 'Drag & drop files here, or click to select'}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Supports images, PDFs, and documents
        </Typography>
      </Box>

      {files.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Files ({files.length})
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {files.map((file, index) => (
              <Paper
                key={index}
                sx={{
                  p: 1,
                  position: 'relative',
                  width: 100,
                  height: 100,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isImage(file) ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 4,
                    }}
                  />
                ) : (
                  <ImageIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
                )}
                <IconButton
                  size="small"
                  onClick={() => handleRemove(index)}
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
                  <Delete fontSize="small" />
                </IconButton>
                <Typography
                  variant="caption"
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: 4,
                    right: 4,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {file.name}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  )
}
