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
import { teamsAPI } from '../../api/teams';
import { LoadingSpinner } from '../common/LoadingSpinner';

export const TeamsTab = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#667eea' });

  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsAPI.list,
  });

  const createMutation = useMutation({
    mutationFn: teamsAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      enqueueSnackbar('Team created', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create team', {
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => teamsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      enqueueSnackbar('Team updated', { variant: 'success' });
      handleCloseDialog();
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update team', {
        variant: 'error',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: teamsAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['teams']);
      enqueueSnackbar('Team deleted', { variant: 'success' });
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to delete team', {
        variant: 'error',
      });
    },
  });

  const teams = teamsData?.data || [];

  const handleOpenDialog = (team = null) => {
    if (team) {
      setEditingTeam(team);
      setFormData({ name: team.name, color: team.color || '#667eea' });
    } else {
      setEditingTeam(null);
      setFormData({ name: '', color: '#667eea' });
    }
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTeam(null);
    setFormData({ name: '', color: '#667eea' });
  };

  const handleSubmit = () => {
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
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
          Add Team
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: 1,
                        bgcolor: team.color,
                        border: 1,
                        borderColor: 'divider',
                      }}
                    />
                    {team.color}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenDialog(team)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(team.id)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTeam ? 'Edit Team' : 'New Team'}</DialogTitle>
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
          <TextField
            fullWidth
            label="Color"
            type="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
