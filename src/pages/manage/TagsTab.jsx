import { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { tagService } from '../../services/tagService'

const TagsTab = () => {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTag, setEditingTag] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagService.getTags,
  })

  const tags = tagsData?.data || []

  const createMutation = useMutation({
    mutationFn: (data) => tagService.createTag(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
      handleCloseDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tagService.updateTag(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
      handleCloseDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
    },
  })

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingTag(tag)
      setFormData({ name: tag.name })
    } else {
      setEditingTag(null)
      setFormData({ name: '' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTag(null)
  }

  const handleSubmit = () => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Tags
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Tag
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : tags.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography color="text.secondary">No tags yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  tags.map((tag) => (
                    <TableRow key={tag.id}>
                      <TableCell>
                        <Typography fontWeight={500}>{tag.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(tag)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(tag.id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTag ? 'Edit Tag' : 'Add Tag'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Tag Name"
            value={formData.name}
            onChange={(e) => setFormData({ name: e.target.value })}
            required
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
          >
            {editingTag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TagsTab
