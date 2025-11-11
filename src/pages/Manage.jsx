import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  FormControlLabel,
  Switch,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useForm } from 'react-hook-form'
import { projectsApi } from '../api/projects'
import { clientsApi } from '../api/clients'
import { tagsApi } from '../api/tags'
import { teamsApi } from '../api/teams'
import { useSnackbar } from '../components/SnackbarProvider'

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>{value === index && <Box sx={{ p: 3 }}>{children}</Box>}</div>
)

export const Manage = () => {
  const [tab, setTab] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()

  const handleOpenModal = (item = null) => {
    setEditingItem(item)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
    setEditingItem(null)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Manage
      </Typography>

      <Card>
        <Tabs value={tab} onChange={(e, newValue) => setTab(newValue)}>
          <Tab label="Projects" />
          <Tab label="Clients" />
          <Tab label="Teams" />
          <Tab label="Tags" />
        </Tabs>

        <TabPanel value={tab} index={0}>
          <ProjectsTab onOpenModal={handleOpenModal} />
        </TabPanel>
        <TabPanel value={tab} index={1}>
          <ClientsTab onOpenModal={handleOpenModal} />
        </TabPanel>
        <TabPanel value={tab} index={2}>
          <TeamsTab onOpenModal={handleOpenModal} />
        </TabPanel>
        <TabPanel value={tab} index={3}>
          <TagsTab onOpenModal={handleOpenModal} />
        </TabPanel>
      </Card>

      {tab === 0 && (
        <ProjectModal
          open={modalOpen}
          onClose={handleCloseModal}
          project={editingItem}
        />
      )}
      {tab === 1 && (
        <ClientModal
          open={modalOpen}
          onClose={handleCloseModal}
          client={editingItem}
        />
      )}
      {tab === 2 && (
        <TeamModal
          open={modalOpen}
          onClose={handleCloseModal}
          team={editingItem}
        />
      )}
      {tab === 3 && (
        <TagModal
          open={modalOpen}
          onClose={handleCloseModal}
          tag={editingItem}
        />
      )}
    </Box>
  )
}

const ProjectsTab = ({ onOpenModal }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list()
      return response.data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: projectsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      showSnackbar('Project deleted', 'success')
    },
    onError: (error) => {
      showSnackbar('Failed to delete project', 'error')
    },
  })

  const projects = data || []

  if (isLoading) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onOpenModal()}>
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
              <TableCell>Actions</TableCell>
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
                    color={project.isBillable ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => onOpenModal(project)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Delete this project?')) {
                        deleteMutation.mutate(project.id)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const ClientsTab = ({ onOpenModal }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.list()
      return response.data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: clientsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      showSnackbar('Client deleted', 'success')
    },
  })

  const clients = data || []

  if (isLoading) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onOpenModal()}>
          Add Client
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => onOpenModal(client)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Delete this client?')) {
                        deleteMutation.mutate(client.id)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const TeamsTab = ({ onOpenModal }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.list()
      return response.data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: teamsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      showSnackbar('Team deleted', 'success')
    },
  })

  const teams = data || []

  if (isLoading) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onOpenModal()}>
          Add Team
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  <Chip
                    label={team.name}
                    sx={{ backgroundColor: team.color || 'primary.main' }}
                  />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => onOpenModal(team)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Delete this team?')) {
                        deleteMutation.mutate(team.id)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const TagsTab = ({ onOpenModal }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.list()
      return response.data || []
    },
  })

  const deleteMutation = useMutation({
    mutationFn: tagsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
      showSnackbar('Tag deleted', 'success')
    },
  })

  const tags = data || []

  if (isLoading) return <Typography>Loading...</Typography>

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => onOpenModal()}>
          Add Tag
        </Button>
      </Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => onOpenModal(tag)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => {
                      if (window.confirm('Delete this tag?')) {
                        deleteMutation.mutate(tag.id)
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

const ProjectModal = ({ open, onClose, project }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: '',
      clientId: '',
      isBillable: false,
    },
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.list()
      return response.data || []
    },
  })

  useEffect(() => {
    if (project) {
      reset({
        name: project.name || '',
        clientId: project.clientId || '',
        isBillable: project.isBillable || false,
      })
    } else {
      reset({
        name: '',
        clientId: '',
        isBillable: false,
      })
    }
  }, [project, reset])

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      showSnackbar('Project created', 'success')
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => projectsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['projects'])
      showSnackbar('Project updated', 'success')
      onClose()
    },
  })

  const onSubmit = (data) => {
    if (project) {
      updateMutation.mutate({ id: project.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const clients = clientsData || []

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('name', { required: true })}
              label="Name"
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select {...register('clientId')} label="Client" defaultValue="">
                <MenuItem value="">None</MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControlLabel
              control={<Switch {...register('isBillable')} />}
              label="Billable"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {project ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const ClientModal = ({ open, onClose, client }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '' },
  })

  useEffect(() => {
    reset({ name: client?.name || '' })
  }, [client, reset])

  const createMutation = useMutation({
    mutationFn: clientsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      showSnackbar('Client created', 'success')
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      showSnackbar('Client updated', 'success')
      onClose()
    },
  })

  const onSubmit = (data) => {
    if (client) {
      updateMutation.mutate({ id: client.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('name', { required: true })}
              label="Name"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {client ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const TeamModal = ({ open, onClose, team }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '', color: '#6366f1' },
  })

  useEffect(() => {
    reset({ name: team?.name || '', color: team?.color || '#6366f1' })
  }, [team, reset])

  const createMutation = useMutation({
    mutationFn: teamsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      showSnackbar('Team created', 'success')
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => teamsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      showSnackbar('Team updated', 'success')
      onClose()
    },
  })

  const onSubmit = (data) => {
    if (team) {
      updateMutation.mutate({ id: team.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{team ? 'Edit Team' : 'New Team'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('name', { required: true })}
              label="Name"
              fullWidth
            />
            <TextField
              {...register('color')}
              label="Color"
              type="color"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {team ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

const TagModal = ({ open, onClose, tag }) => {
  const { showSnackbar } = useSnackbar()
  const queryClient = useQueryClient()
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { name: '' },
  })

  useEffect(() => {
    reset({ name: tag?.name || '' })
  }, [tag, reset])

  const createMutation = useMutation({
    mutationFn: tagsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
      showSnackbar('Tag created', 'success')
      onClose()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => tagsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['tags'])
      showSnackbar('Tag updated', 'success')
      onClose()
    },
  })

  const onSubmit = (data) => {
    if (tag) {
      updateMutation.mutate({ id: tag.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{tag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              {...register('name', { required: true })}
              label="Name"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">
            {tag ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
