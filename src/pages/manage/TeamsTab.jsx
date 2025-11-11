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
import { Add, Edit, Delete, Circle } from '@mui/icons-material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teamService } from '../../services/teamService'

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']

const TeamsTab = () => {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTeam, setEditingTeam] = useState(null)
  const [formData, setFormData] = useState({ name: '', color: COLORS[0] })

  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
  })

  const teams = teamsData?.data || []

  const createMutation = useMutation({
    mutationFn: (data) => teamService.createTeam(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      handleCloseDialog()
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => teamService.updateTeam(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
      handleCloseDialog()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (id) => teamService.deleteTeam(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['teams'])
    },
  })

  const handleOpenDialog = (team = null) => {
    if (team) {
      setEditingTeam(team)
      setFormData({ name: team.name, color: team.color || COLORS[0] })
    } else {
      setEditingTeam(null)
      setFormData({ name: '', color: COLORS[0] })
    }
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
    setEditingTeam(null)
  }

  const handleSubmit = () => {
    if (editingTeam) {
      updateMutation.mutate({ id: editingTeam.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      deleteMutation.mutate(id)
    }
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" fontWeight={600}>
          Teams
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Add Team
        </Button>
      </Box>

      <Card>
        <CardContent>
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
                {isLoading ? (
                  [1, 2, 3].map((i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                      <TableCell><Skeleton /></TableCell>
                    </TableRow>
                  ))
                ) : teams.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary">No teams yet</Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  teams.map((team) => (
                    <TableRow key={team.id}>
                      <TableCell>
                        <Typography fontWeight={500}>{team.name}</Typography>
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Circle sx={{ color: team.color, fontSize: 20 }} />
                          <Typography variant="body2">{team.color}</Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton size="small" onClick={() => handleOpenDialog(team)}>
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(team.id)}>
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
        <DialogTitle>{editingTeam ? 'Edit Team' : 'Add Team'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Team Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Box>
              <Typography variant="body2" gutterBottom>
                Select Color
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {COLORS.map((color) => (
                  <IconButton
                    key={color}
                    onClick={() => setFormData({ ...formData, color })}
                    sx={{
                      border: formData.color === color ? 3 : 1,
                      borderColor: formData.color === color ? 'primary.main' : 'divider',
                    }}
                  >
                    <Circle sx={{ color, fontSize: 32 }} />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!formData.name || createMutation.isPending || updateMutation.isPending}
          >
            {editingTeam ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default TeamsTab
