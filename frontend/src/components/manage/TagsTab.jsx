import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Button,
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
  Paper,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { tagsAPI } from '../../api/tags';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const TagsTab = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const { data: tagsData, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsAPI.list,
  });

  const createMutation = useMutation({
    mutationFn: tagsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
      enqueueSnackbar('Tag created', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create tag', {
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tagsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
      enqueueSnackbar('Tag updated', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update tag', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: tagsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags']);
      enqueueSnackbar('Tag deleted', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete tag', {
        variant: 'error',
      });
    },
  });

  const tags = tagsData?.data || [];

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setFormData({ name: tag.name });
    } else {
      setEditingTag(null);
      setFormData({ name: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
    setFormData({ name: '' });
  };

  const handleSubmit = () => {
    if (editingTag) {
      updateMutation.mutate({ id: editingTag.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this tag?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add Tag
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(tag)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(tag.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
            autoFocus
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
