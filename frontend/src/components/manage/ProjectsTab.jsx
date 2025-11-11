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
  Chip,
  Switch,
  FormControlLabel,
  Autocomplete,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { projectsAPI } from '../../api/projects';
import { clientsAPI } from '../../api/clients';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const ProjectsTab = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({ name: '', clientId: null, isBillable: true, color: '#667eea' });

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.list,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.list,
  });

  const createMutation = useMutation({
    mutationFn: projectsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      enqueueSnackbar('Project created', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create project', {
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      enqueueSnackbar('Project updated', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update project', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: projectsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects']);
      enqueueSnackbar('Project deleted', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete project', {
        variant: 'error',
      });
    },
  });

  const projects = projectsData?.data || [];
  const clients = clientsData?.data || [];

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name,
        clientId: project.clientId,
        isBillable: project.isBillable,
        color: project.color || '#667eea',
      });
    } else {
      setEditingProject(null);
      setFormData({ name: '', clientId: null, isBillable: true, color: '#667eea' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingProject(null);
    setFormData({ name: '', clientId: null, isBillable: true, color: '#667eea' });
  };

  const handleSubmit = () => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
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
          Add Project
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Billable</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client?.name || '-'}</TableCell>
                <TableCell>
                  {project.isBillable ? (
                    <Chip label="Yes" size="small" color="success" />
                  ) : (
                    <Chip label="No" size="small" />
                  )}
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: project.color,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                    {project.color}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(project.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingProject ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
          <Autocomplete
            options={clients}
            getOptionLabel={(option) => option.name}
            value={clients.find((c) => c.id === formData.clientId) || null}
            onChange={(_, newValue) => setFormData({ ...formData, clientId: newValue?.id || null })}
            renderInput={(params) => <TextField {...params} label="Client" margin="normal" />}
          />
          <TextField
            fullWidth
            label="Color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            margin="normal"
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isBillable}
                onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
              />
            }
            label="Billable"
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
