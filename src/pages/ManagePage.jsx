import { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Switch,
} from '@mui/material'
import { Add, Edit, Delete } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm, Controller } from 'react-hook-form'
import { useSnackbar } from 'notistack'
import { projectService } from '../services/projectService'
import { clientService } from '../services/clientService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'

function TabPanel({ children, value, index }) {
  return <div hidden={value !== index}>{value === index && <Box sx={{ pt: 3 }}>{children}</Box>}</div>
}

export default function ManagePage() {
  const [tab, setTab] = useState(0)
  const [clientModalOpen, setClientModalOpen] = useState(false)
  const [projectModalOpen, setProjectModalOpen] = useState(false)
  const [tagModalOpen, setTagModalOpen] = useState(false)
  const [teamModalOpen, setTeamModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const { enqueueSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  // Clients
  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  })

  const clients = clientsData?.data || []

  const clientMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id ? clientService.updateClient(id, data) : clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      enqueueSnackbar(editingItem ? 'Client updated' : 'Client created', { variant: 'success' })
      setClientModalOpen(false)
      setEditingItem(null)
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Operation failed', { variant: 'error' })
    },
  })

  // Projects
  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const projects = projectsData?.data || []

  const projectMutation = useMutation({
    mutationFn: ({ id, data }) =>
      id ? projectService.updateProject(id, data) : projectService.createProject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      enqueueSnackbar(editingItem ? 'Project updated' : 'Project created', { variant: 'success' })
      setProjectModalOpen(false)
      setEditingItem(null)
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Operation failed', { variant: 'error' })
    },
  })

  // Tags
  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  })

  const tags = tagsData?.data || []

  const tagMutation = useMutation({
    mutationFn: ({ id, data }) => (id ? tagService.updateTag(id, data) : tagService.createTag(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      enqueueSnackbar(editingItem ? 'Tag updated' : 'Tag created', { variant: 'success' })
      setTagModalOpen(false)
      setEditingItem(null)
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Operation failed', { variant: 'error' })
    },
  })

  // Teams
  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
  })

  const teams = teamsData?.data || []

  const teamMutation = useMutation({
    mutationFn: ({ id, data }) => (id ? teamService.updateTeam(id, data) : teamService.createTeam(data)),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      enqueueSnackbar(editingItem ? 'Team updated' : 'Team created', { variant: 'success' })
      setTeamModalOpen(false)
      setEditingItem(null)
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Operation failed', { variant: 'error' })
    },
  })

  const deleteClient = useMutation({
    mutationFn: (id) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      enqueueSnackbar('Client deleted', { variant: 'success' })
    },
  })

  const deleteProject = useMutation({
    mutationFn: (id) => projectService.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      enqueueSnackbar('Project deleted', { variant: 'success' })
    },
  })

  const deleteTag = useMutation({
    mutationFn: (id) => tagService.deleteTag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] })
      enqueueSnackbar('Tag deleted', { variant: 'success' })
    },
  })

  const deleteTeam = useMutation({
    mutationFn: (id) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] })
      enqueueSnackbar('Team deleted', { variant: 'success' })
    },
  })

  const handleDelete = (type, id) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      switch (type) {
        case 'client':
          deleteClient.mutate(id)
          break
        case 'project':
          deleteProject.mutate(id)
          break
        case 'tag':
          deleteTag.mutate(id)
          break
        case 'team':
          deleteTeam.mutate(id)
          break
      }
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Manage
        </Typography>
      </Box>

      <Paper>
        <Tabs value={tab} onChange={(e, v) => setTab(v)}>
          <Tab label="Clients" />
          <Tab label="Projects" />
          <Tab label="Tags" />
          <Tab label="Teams" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingItem(null)
                setClientModalOpen(true)
              }}
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
                        onClick={() => {
                          setEditingItem(client)
                          setClientModalOpen(true)
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('client', client.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tab} index={1}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingItem(null)
                setProjectModalOpen(true)
              }}
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
                    <TableCell>{project.isBillable ? 'Yes' : 'No'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingItem(project)
                          setProjectModalOpen(true)
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('project', project.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tab} index={2}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingItem(null)
                setTagModalOpen(true)
              }}
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
                        onClick={() => {
                          setEditingItem(tag)
                          setTagModalOpen(true)
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('tag', tag.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>

        <TabPanel value={tab} index={3}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setEditingItem(null)
                setTeamModalOpen(true)
              }}
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
                        label={team.color || 'Default'}
                        sx={{ backgroundColor: team.color || 'grey.500', color: 'white' }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingItem(team)
                          setTeamModalOpen(true)
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDelete('team', team.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </TabPanel>
      </Paper>

      {/* Client Modal */}
      <ClientModal
        open={clientModalOpen}
        onClose={() => {
          setClientModalOpen(false)
          setEditingItem(null)
        }}
        client={editingItem}
        onSubmit={(data) => clientMutation.mutate({ id: editingItem?.id, data })}
      />

      {/* Project Modal */}
      <ProjectModal
        open={projectModalOpen}
        onClose={() => {
          setProjectModalOpen(false)
          setEditingItem(null)
        }}
        project={editingItem}
        clients={clients}
        onSubmit={(data) => projectMutation.mutate({ id: editingItem?.id, data })}
      />

      {/* Tag Modal */}
      <TagModal
        open={tagModalOpen}
        onClose={() => {
          setTagModalOpen(false)
          setEditingItem(null)
        }}
        tag={editingItem}
        onSubmit={(data) => tagMutation.mutate({ id: editingItem?.id, data })}
      />

      {/* Team Modal */}
      <TeamModal
        open={teamModalOpen}
        onClose={() => {
          setTeamModalOpen(false)
          setEditingItem(null)
        }}
        team={editingItem}
        onSubmit={(data) => teamMutation.mutate({ id: editingItem?.id, data })}
      />
    </Box>
  )
}

function ClientModal({ open, onClose, client, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: client?.name || '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (client) {
      reset({ name: client.name })
    } else {
      reset({ name: '' })
    }
  }, [client, reset])

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>
        <DialogContent>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {client ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function ProjectModal({ open, onClose, project, clients, onSubmit }) {
  const { register, handleSubmit, reset, control, formState: { errors } } = useForm({
    defaultValues: {
      name: project?.name || '',
      clientId: project?.clientId || '',
      isBillable: project?.isBillable || false,
    },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (project) {
      reset({
        name: project.name,
        clientId: project.clientId || '',
        isBillable: project.isBillable || false,
      })
    } else {
      reset({ name: '', clientId: '', isBillable: false })
    }
  }, [project, reset])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
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
            control={<Controller name="isBillable" control={control} render={({ field }) => <Switch {...field} checked={field.value} />} />}
            label="Billable"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {project ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function TagModal({ open, onClose, tag, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: tag?.name || '' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (tag) {
      reset({ name: tag.name })
    } else {
      reset({ name: '' })
    }
  }, [tag, reset])

  return (
    <Dialog open={open} onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{tag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
        <DialogContent>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {tag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

function TeamModal({ open, onClose, team, onSubmit }) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: team?.name || '', color: team?.color || '#6366f1' },
  })

  const handleClose = () => {
    reset()
    onClose()
  }

  useEffect(() => {
    if (team) {
      reset({ name: team.name, color: team.color || '#6366f1' })
    } else {
      reset({ name: '', color: '#6366f1' })
    }
  }, [team, reset])

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{team ? 'Edit Team' : 'New Team'}</DialogTitle>
        <DialogContent>
          <TextField
            {...register('name', { required: 'Name is required' })}
            label="Name"
            fullWidth
            margin="normal"
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            {...register('color')}
            label="Color"
            type="color"
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {team ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
