import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
} from '@mui/material'
import DownloadIcon from '@mui/icons-material/Download'
import { format, subMonths } from 'date-fns'
import { reportsApi } from '../api/reports'
import { projectsApi } from '../api/projects'
import { clientsApi } from '../api/clients'
import { tagsApi } from '../api/tags'
import { teamsApi } from '../api/teams'
import { formatDurationHours } from '../utils/dateUtils'

export const Reports = () => {
  const [viewMode, setViewMode] = useState('summary')
  const [filters, setFilters] = useState({
    startDate: subMonths(new Date(), 1),
    endDate: new Date(),
    clientId: '',
    projectId: '',
    tagIds: [],
    teamIds: [],
    billable: 'all',
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: async () => {
      const response = await clientsApi.list()
      return response.data || []
    },
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      const response = await projectsApi.list()
      return response.data || []
    },
  })

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const response = await tagsApi.list()
      return response.data || []
    },
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const response = await teamsApi.list()
      return response.data || []
    },
  })

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => {
      const params = {
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
      }
      if (filters.clientId) params.clientId = filters.clientId
      if (filters.projectId) params.projectId = filters.projectId
      if (filters.tagIds.length > 0) params.tagIds = filters.tagIds
      if (filters.teamIds.length > 0) params.teamIds = filters.teamIds
      if (filters.billable !== 'all') params.isBillable = filters.billable === 'billable'

      const response = await reportsApi.generate(params)
      return response.data
    },
    enabled: !!filters.startDate && !!filters.endDate,
  })

  const handleExport = () => {
    // Trigger CSV download
    const params = new URLSearchParams({
      startDate: filters.startDate.toISOString(),
      endDate: filters.endDate.toISOString(),
      format: 'csv',
    })
    if (filters.clientId) params.append('clientId', filters.clientId)
    if (filters.projectId) params.append('projectId', filters.projectId)
    // ... other params

    window.open(`/api/v1/reports?${params.toString()}`, '_blank')
  }

  const clients = clientsData || []
  const projects = projectsData || []
  const tags = tagsData || []
  const teams = teamsData || []

  const report = reportData || {
    summary: {},
    entries: [],
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          Reports
        </Typography>
        <Button
          variant="contained"
          startIcon={<DownloadIcon />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                label="Start Date"
                type="date"
                value={format(filters.startDate, 'yyyy-MM-dd')}
                onChange={(e) => setFilters({ ...filters, startDate: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                label="End Date"
                type="date"
                value={format(filters.endDate, 'yyyy-MM-dd')}
                onChange={(e) => setFilters({ ...filters, endDate: new Date(e.target.value) })}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={filters.clientId}
                  onChange={(e) => setFilters({ ...filters, clientId: e.target.value })}
                  label="Client"
                >
                  <MenuItem value="">All</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={filters.projectId}
                  onChange={(e) => setFilters({ ...filters, projectId: e.target.value })}
                  label="Project"
                >
                  <MenuItem value="">All</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControl fullWidth>
                <InputLabel>Billable</InputLabel>
                <Select
                  value={filters.billable}
                  onChange={(e) => setFilters({ ...filters, billable: e.target.value })}
                  label="Billable"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="billable">Billable</MenuItem>
                  <MenuItem value="non-billable">Non-Billable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Box sx={{ mb: 2 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
        >
          <ToggleButton value="summary">Summary</ToggleButton>
          <ToggleButton value="detailed">Detailed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {viewMode === 'summary' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Project
                </Typography>
                {report.summary?.byProject?.map((item) => (
                  <Box key={item.projectId} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.projectName}: {formatDurationHours(item.totalHours)}h
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Tag
                </Typography>
                {report.summary?.byTag?.map((item) => (
                  <Box key={item.tagId} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.tagName}: {formatDurationHours(item.totalHours)}h
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  By Team
                </Typography>
                {report.summary?.byTeam?.map((item) => (
                  <Box key={item.teamId} sx={{ mb: 1 }}>
                    <Typography variant="body2">
                      {item.teamName}: {formatDurationHours(item.totalHours)}h
                    </Typography>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      ) : (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell>Billable</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.entries?.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      {entry.startTime ? format(new Date(entry.startTime), 'MMM d, yyyy') : '-'}
                    </TableCell>
                    <TableCell>{entry.description || '-'}</TableCell>
                    <TableCell>{entry.project?.name || '-'}</TableCell>
                    <TableCell>
                      {entry.duration ? formatDurationHours(entry.duration) + 'h' : '-'}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={entry.isBillable ? 'Yes' : 'No'}
                        color={entry.isBillable ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}
    </Box>
  )
}

