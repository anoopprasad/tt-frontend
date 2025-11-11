import { useState } from 'react'
import React from 'react'
import { SketchPicker } from 'react-color'
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Switch,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { clientService } from '../services/clientService'
import { projectService } from '../services/projectService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'
import { useSnackbar } from '../components/SnackbarProvider'

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && children}</div>
}

export default function ManagePage() {
  const [tab, setTab] = useState(0)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [editingType, setEditingType] = useState(null)

  const handleOpenDialog = (type, item = null) => {
    setEditingType(type)
    setEditingItem(item)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingItem(null)
    setEditingType(null)
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Manage
      </Typography>

      <Paper sx={{ mt: 2 }}>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Clients" />
          <Tab label="Projects" />
          <Tab label="Tags" />
          <Tab label="Teams" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tab} index={0}>
            <ClientsTab onOpenDialog={handleOpenDialog} />
          </TabPanel>
          <TabPanel value={tab} index={1}>
            <ProjectsTab onOpenDialog={handleOpenDialog} />
          </TabPanel>
          <TabPanel value={tab} index={2}>
            <TagsTab onOpenDialog={handleOpenDialog} />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <TeamsTab onOpenDialog={handleOpenDialog} />
          </TabPanel>
        </Box>
      </Paper>

      <ManageDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        type={editingType}
        item={editingItem}
      />
    </Box>
  )
}

function ClientsTab({ onOpenDialog }) {
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  })

  const clients = data?.data || []

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Clients</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onOpenDialog('client')}
        >
          Add Client
        </Button>
      </Box>
      <TableContainer>
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
                  <IconButton
                    size="small"
                    onClick={() => onOpenDialog('client', client)}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteClientButton clientId={client.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function ProjectsTab({ onOpenDialog }) {
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const projects = data?.data || []
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  })
  const clients = clientsData?.data || []

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Projects</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onOpenDialog('project')}
        >
          Add Project
        </Button>
      </Box>
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
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client?.name || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={project.isBillable ? 'Yes' : 'No'}
                    size="small"
                    color={project.isBillable ? 'success' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onOpenDialog('project', project)}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteProjectButton projectId={project.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function TagsTab({ onOpenDialog }) {
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  })

  const tags = data?.data || []

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Tags</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onOpenDialog('tag')}
        >
          Add Tag
        </Button>
      </Box>
      <TableContainer>
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
                  <IconButton
                    size="small"
                    onClick={() => onOpenDialog('tag', tag)}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteTagButton tagId={tag.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function TeamsTab({ onOpenDialog }) {
  const { data, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
  })

  const teams = data?.data || []

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Teams</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onOpenDialog('team')}
        >
          Add Team
        </Button>
      </Box>
      <TableContainer>
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
                  <Chip
                    label={team.name}
                    sx={{
                      backgroundColor: team.color || '#6366f1',
                      color: 'white',
                    }}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    size="small"
                    onClick={() => onOpenDialog('team', team)}
                  >
                    <EditIcon />
                  </IconButton>
                  <DeleteTeamButton teamId={team.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

function ManageDialog({ open, onClose, type, item }) {
  const { register, handleSubmit, control, reset } = useForm()
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const isEdit = !!item

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
    enabled: type === 'project',
  })
  const clients = clientsData?.data || []

  const createClient = useMutation({
    mutationFn: (data) => clientService.createClient(data),
    onSuccess: () => {
      showSuccess('Client created successfully')
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to create client')
    },
  })

  const updateClient = useMutation({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: () => {
      showSuccess('Client updated successfully')
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to update client')
    },
  })

  const createProject = useMutation({
    mutationFn: (data) => projectService.createProject(data),
    onSuccess: () => {
      showSuccess('Project created successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to create project')
    },
  })

  const updateProject = useMutation({
    mutationFn: ({ id, data }) => projectService.updateProject(id, data),
    onSuccess: () => {
      showSuccess('Project updated successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to update project')
    },
  })

  const createTag = useMutation({
    mutationFn: (data) => tagService.createTag(data),
    onSuccess: () => {
      showSuccess('Tag created successfully')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to create tag')
    },
  })

  const updateTag = useMutation({
    mutationFn: ({ id, data }) => tagService.updateTag(id, data),
    onSuccess: () => {
      showSuccess('Tag updated successfully')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to update tag')
    },
  })

  const createTeam = useMutation({
    mutationFn: (data) => teamService.createTeam(data),
    onSuccess: () => {
      showSuccess('Team created successfully')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to create team')
    },
  })

  const updateTeam = useMutation({
    mutationFn: ({ id, data }) => teamService.updateTeam(id, data),
    onSuccess: () => {
      showSuccess('Team updated successfully')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      onClose()
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to update team')
    },
  })

  React.useEffect(() => {
    if (open && item) {
      reset(item)
    } else if (open) {
      reset({})
    }
  }, [open, item, reset])

  const onSubmit = (data) => {
    switch (type) {
      case 'client':
        if (isEdit) {
          updateClient.mutate({ id: item.id, data })
        } else {
          createClient.mutate(data)
        }
        break
      case 'project':
        if (isEdit) {
          updateProject.mutate({ id: item.id, data })
        } else {
          createProject.mutate(data)
        }
        break
      case 'tag':
        if (isEdit) {
          updateTag.mutate({ id: item.id, data })
        } else {
          createTag.mutate(data)
        }
        break
      case 'team':
        if (isEdit) {
          updateTeam.mutate({ id: item.id, data })
        } else {
          createTeam.mutate(data)
        }
        break
    }
  }

  const getTitle = () => {
    const action = isEdit ? 'Edit' : 'Add'
    const typeName = type ? type.charAt(0).toUpperCase() + type.slice(1) : ''
    return `${action} ${typeName}`
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{getTitle()}</DialogTitle>
        <DialogContent>
          {type === 'client' && (
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Name"
              fullWidth
              margin="normal"
              required
            />
          )}

          {type === 'project' && (
            <>
              <TextField
                {...register('name', { required: 'Name is required' })}
                label="Name"
                fullWidth
                margin="normal"
                required
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Client</InputLabel>
                <Controller
                  name="clientId"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} label="Client">
                      <MenuItem value="">None</MenuItem>
                      {clients.map((client) => (
                        <MenuItem key={client.id} value={client.id}>
                          {client.name}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
              </FormControl>
              <FormControlLabel
                control={
                  <Controller
                    name="isBillable"
                    control={control}
                    render={({ field }) => <Switch {...field} checked={field.value} />}
                  />
                }
                label="Billable"
                sx={{ mt: 2 }}
              />
            </>
          )}

          {type === 'tag' && (
            <TextField
              {...register('name', { required: 'Name is required' })}
              label="Name"
              fullWidth
              margin="normal"
              required
            />
          )}

          {type === 'team' && (
            <>
              <TextField
                {...register('name', { required: 'Name is required' })}
                label="Name"
                fullWidth
                margin="normal"
                required
              />
              <Box mt={2}>
                <Typography variant="body2" gutterBottom>
                  Color
                </Typography>
                <Controller
                  name="color"
                  control={control}
                  render={({ field }) => (
                    <SketchPicker
                      color={field.value || '#6366f1'}
                      onChangeComplete={(color) => field.onChange(color.hex)}
                    />
                  )}
                />
              </Box>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function DeleteClientButton({ clientId }) {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => clientService.deleteClient(clientId),
    onSuccess: () => {
      showSuccess('Client deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to delete client')
    },
  })

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => setConfirmOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Client?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this client?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              deleteMutation.mutate()
              setConfirmOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function DeleteProjectButton({ projectId }) {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => projectService.deleteProject(projectId),
    onSuccess: () => {
      showSuccess('Project deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to delete project')
    },
  })

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => setConfirmOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this project?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              deleteMutation.mutate()
              setConfirmOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function DeleteTagButton({ tagId }) {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => tagService.deleteTag(tagId),
    onSuccess: () => {
      showSuccess('Tag deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['tags'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to delete tag')
    },
  })

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => setConfirmOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Tag?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this tag?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              deleteMutation.mutate()
              setConfirmOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

function DeleteTeamButton({ teamId }) {
  const queryClient = useQueryClient()
  const { showSuccess, showError } = useSnackbar()
  const [confirmOpen, setConfirmOpen] = React.useState(false)

  const deleteMutation = useMutation({
    mutationFn: () => teamService.deleteTeam(teamId),
    onSuccess: () => {
      showSuccess('Team deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['teams'] })
    },
    onError: (error) => {
      showError(error.response?.data?.error?.message || 'Failed to delete team')
    },
  })

  return (
    <>
      <IconButton
        size="small"
        color="error"
        onClick={() => setConfirmOpen(true)}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle>Delete Team?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this team?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => {
              deleteMutation.mutate()
              setConfirmOpen(false)
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
