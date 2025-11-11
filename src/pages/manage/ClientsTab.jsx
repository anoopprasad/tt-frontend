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
import { clientService } from '../../services/clientService'

const ClientsTab = () => {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [formData, setFormData] = useState({ name: '' })

  const { data: clientsData, isLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients,
  })

  const clients = clientsData?.data || []

  const createMutation = useMutation({
    mutationFn: (data) => clientService.createClient(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      handleCloseDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => clientService.updateClient(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
      handleCloseDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => clientService.deleteClient(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['clients'])
    },
  })

  const handleOpenDialog = (client = null) => {
    if (client) {
      setEditingClient(client)
      setFormData({ name: client.name })
    } else {
      setEditingClient(null)
      setFormData({ name: '' })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingClient(null)
  }

  const handleSubmit = () => {
    if (editingClient) {
      updateMutation.mutate({ id: editingClient.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this client?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Clients
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Client
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
                ) : clients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} align="center">
                      <Typography color="text.secondary">No clients yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  clients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell>
                        <Typography fontWeight={500}>{client.name}</Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(client)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(client.id)}>
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
        <DialogTitle>{editingClient ? 'Edit Client' : 'Add Client'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Client Name"
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
            {editingClient ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ClientsTab
