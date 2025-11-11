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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Skeleton,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { projectService } from '../../services/projectService'
import { clientService } from '../../services/clientService'

const ProjectsTab = () => {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    clientId: null,
    isBillable: true,
  })

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients,
  })

  const projects = projectsData?.data || []
  const clients = clientsData?.data || []

  const createMutation = useMutation({
    mutationFn: (data) => projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      handleCloseDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      handleCloseDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
    },
  })

  const handleOpenDialog = (project = null) => {
    if (project) {
      setEditingProject(project)
      setFormData({
        name: project.name,
        clientId: project.clientId || null,
        isBillable: project.isBillable,
      })
    } else {
      setEditingProject(null)
      setFormData({
        name: '',
        clientId: null,
        isBillable: true,
      })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingProject(null)
  }

  const handleSubmit = () => {
    if (editingProject) {
      updateMutation.mutate({ id: editingProject.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Projects
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Project
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Billable</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : projects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">No projects yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  projects.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell>
                        <Typography fontWeight={500}>{project.name}</Typography>
                      </TableCell>
                      <TableCell>{project.client?.name || '-'}</TableCell>
                      <TableCell>
                        <Chip
                          label={project.isBillable ? 'Billable' : 'Non-billable'}
                          size="small"
                          color={project.isBillable ? 'success' : 'default'}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(project)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(project.id)}>
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
        <DialogTitle>{editingProject ? 'Edit Project' : 'Add Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={formData.clientId || ''}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value || null })}
                label="Client"
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isBillable}
                  onChange={(e) => setFormData({ ...formData, isBillable: e.target.checked })}
                />
              }
              label="Billable"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
          >
            {editingProject ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ProjectsTab
