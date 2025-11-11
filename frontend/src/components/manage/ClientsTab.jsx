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
import { clientsAPI } from '../../api/clients';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ClientsTab = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [formData, setFormData] = useState({ name: '' });

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.list,
  });

  const createMutation = useMutation({
    mutationFn: clientsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      enqueueSnackbar('Client created', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create client', {
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      enqueueSnackbar('Client updated', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update client', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: clientsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients']);
      enqueueSnackbar('Client deleted', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete client', {
        variant: 'error',
      });
    },
  });

  const clients = clientsData?.data || [];

  const handleOpenDialog = (client = null) => {
    if (client) {
      setEditingClient(client);
      setFormData({ name: client.name });
    } else {
      setEditingClient(null);
      setFormData({ name: '' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingClient(null);
    setFormData({ name: '' });
  };

  const handleSubmit = () => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
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
          Add Client
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
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(client)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(client.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingClient ? 'Edit Client' : 'New Client'}</DialogTitle>
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
            {editingClient ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
