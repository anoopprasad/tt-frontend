import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
} from '@mui/material'
import { reportService } from '../services/reportService'
import { projectService } from '../services/projectService'
import { clientService } from '../services/clientService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'
import { formatHours } from '../utils/dateUtils'
import DownloadIcon from '@mui/icons-material/Download'

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState('summary')
  const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)))
  const [endDate, setEndDate] = useState(new Date())
  const [clientId, setClientId] = useState('')
  const [projectId, setProjectId] = useState('')
  const [tagIds, setTagIds] = useState([])
  const [teamIds, setTeamIds] = useState([])
  const [billableFilter, setBillableFilter] = useState('all')

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: () => clientService.getClients(),
  })

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => projectService.getProjects(),
  })

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.getTags(),
  })

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: () => teamService.getTeams(),
  })

  const clients = clientsData?.data || []
  const projects = projectsData?.data || []
  const tags = tagsData?.data || []
  const teams = teamsData?.data || []

  const reportParams = {
    startDate: startDate.toISOString().split('T')[0],
    endDate: endDate.toISOString().split('T')[0],
    ...(clientId && { clientId }),
    ...(projectId && { projectId }),
    ...(tagIds.length > 0 && { tagIds }),
    ...(teamIds.length > 0 && { teamIds }),
    ...(billableFilter !== 'all' && { isBillable: billableFilter === 'billable' }),
  }

  const { data: reportData, isLoading } = useQuery({
    queryKey: ['reports', reportParams],
    queryFn: () => reportService.getReports(reportParams),
  })

  const report = reportData?.data || {}
  const entries = report.entries || []
  const summary = report.summary || {}

  const handleExport = () => {
    // In a real implementation, this would trigger a CSV download from the backend
    const params = new URLSearchParams(reportParams)
    window.open(`/api/v1/reports/export?${params.toString()}`, '_blank')
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight={600}>
          Reports
        </Typography>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, newMode) => newMode && setViewMode(newMode)}
        >
          <ToggleButton value="summary">Summary</ToggleButton>
          <ToggleButton value="detailed">Detailed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight={600}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="Start Date"
                type="date"
                value={startDate.toISOString().split('T')[0]}
                onChange={(e) => setStartDate(new Date(e.target.value))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                label="End Date"
                type="date"
                value={endDate.toISOString().split('T')[0]}
                onChange={(e) => setEndDate(new Date(e.target.value))}
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select value={clientId} onChange={(e) => setClientId(e.target.value)} label="Client">
                  <MenuItem value="">All</MenuItem>
                  {clients.map((client) => (
                    <MenuItem key={client.id} value={client.id}>
                      {client.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select value={projectId} onChange={(e) => setProjectId(e.target.value)} label="Project">
                  <MenuItem value="">All</MenuItem>
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Billable</InputLabel>
                <Select
                  value={billableFilter}
                  onChange={(e) => setBillableFilter(e.target.value)}
                  label="Billable"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="billable">Billable</MenuItem>
                  <MenuItem value="non-billable">Non-Billable</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Tags</InputLabel>
                <Select
                  multiple
                  value={tagIds}
                  onChange={(e) => setTagIds(e.target.value)}
                  label="Tags"
                  renderValue={(selected) => selected.length + ' selected'}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth>
                <InputLabel>Teams</InputLabel>
                <Select
                  multiple
                  value={teamIds}
                  onChange={(e) => setTeamIds(e.target.value)}
                  label="Teams"
                  renderValue={(selected) => selected.length + ' selected'}
                >
                  {teams.map((team) => (
                    <MenuItem key={team.id} value={team.id}>
                      {team.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Box mt={2}>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
            >
              Export CSV
            </Button>
          </Box>
        </CardContent>
      </Card>

      {isLoading ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      ) : viewMode === 'summary' ? (
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Total Hours
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {summary.totalHours ? parseFloat(summary.totalHours).toFixed(2) : '0.00'}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Billable Hours
                </Typography>
                <Typography variant="h4" fontWeight={600} color="success.main">
                  {summary.billableHours ? parseFloat(summary.billableHours).toFixed(2) : '0.00'}h
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Entries
                </Typography>
                <Typography variant="h4" fontWeight={600}>
                  {entries.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          {summary.byProject && Object.keys(summary.byProject).length > 0 && (
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    By Project
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Project</TableCell>
                          <TableCell align="right">Hours</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {Object.entries(summary.byProject).map(([project, hours]) => (
                          <TableRow key={project}>
                            <TableCell>{project}</TableCell>
                            <TableCell align="right">{parseFloat(hours).toFixed(2)}h</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      ) : (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Detailed Entries
            </Typography>
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
                  {entries.length > 0 ? (
                    entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {entry.startTime
                            ? new Date(entry.startTime).toLocaleDateString()
                            : '-'}
                        </TableCell>
                        <TableCell>{entry.description || '-'}</TableCell>
                        <TableCell>{entry.project?.name || '-'}</TableCell>
                        <TableCell>
                          {entry.duration ? formatHours(entry.duration) + 'h' : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={entry.isBillable ? 'Yes' : 'No'}
                            size="small"
                            color={entry.isBillable ? 'success' : 'default'}
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" py={2}>
                          No entries found
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}
