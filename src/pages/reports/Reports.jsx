import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { FileDownload, TableChart, Assessment } from '@mui/icons-material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'
import { clientService } from '../../services/clientService'
import ProjectSelector from '../../components/forms/ProjectSelector'
import TagsSelector from '../../components/forms/TagsSelector'
import TeamsSelector from '../../components/forms/TeamsSelector'
import { startOfMonth, endOfMonth, format } from 'date-fns'

const Reports = () => {
  const [viewMode, setViewMode] = useState('summary')
  const [filters, setFilters] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    clientId: null,
    projectId: null,
    tagIds: [],
    teamIds: [],
    billableFilter: 'all',
  })

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: clientService.getClients,
  })

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () =>
      dashboardService.getReports({
        startDate: filters.startDate.toISOString(),
        endDate: filters.endDate.toISOString(),
        clientId: filters.clientId,
        projectId: filters.projectId,
        tagIds: filters.tagIds,
        teamIds: filters.teamIds,
        isBillable: filters.billableFilter === 'all' ? undefined : filters.billableFilter === 'billable',
      }),
    enabled: !!filters.startDate && !!filters.endDate,
  })

  const clients = clientsData?.data || []
  const reports = reportsData?.data || {}

  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
  }

  const handleExport = () => {
    // In a real app, this would trigger a CSV download from the backend
    alert('Export functionality would download a CSV file')
  }

  const formatHours = (hours) => {
    return typeof hours === 'number' ? hours.toFixed(1) : '0.0'
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" fontWeight={700}>
          Reports
        </Typography>
        <Button
          variant="outlined"
          startIcon={<FileDownload />}
          onClick={handleExport}
        >
          Export CSV
        </Button>
      </Box>

      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Filters
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="Start Date"
              value={filters.startDate}
              onChange={(value) => handleFilterChange('startDate', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <DatePicker
              label="End Date"
              value={filters.endDate}
              onChange={(value) => handleFilterChange('endDate', value)}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Client</InputLabel>
              <Select
                value={filters.clientId || ''}
                onChange={(e) => handleFilterChange('clientId', e.target.value || null)}
                label="Client"
              >
                <MenuItem value="">
                  <em>All Clients</em>
                </MenuItem>
                {clients.map((client) => (
                  <MenuItem key={client.id} value={client.id}>
                    {client.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <ProjectSelector
              value={filters.projectId}
              onChange={(value) => handleFilterChange('projectId', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TagsSelector
              value={filters.tagIds}
              onChange={(value) => handleFilterChange('tagIds', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TeamsSelector
              value={filters.teamIds}
              onChange={(value) => handleFilterChange('teamIds', value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel>Billable</InputLabel>
              <Select
                value={filters.billableFilter}
                onChange={(e) => handleFilterChange('billableFilter', e.target.value)}
                label="Billable"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="billable">Billable Only</MenuItem>
                <MenuItem value="non-billable">Non-billable Only</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {/* View Toggle */}
      <Box sx={{ mb: 3 }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(e, value) => value && setViewMode(value)}
        >
          <ToggleButton value="summary">
            <Assessment sx={{ mr: 1 }} />
            Summary
          </ToggleButton>
          <ToggleButton value="detailed">
            <TableChart sx={{ mr: 1 }} />
            Detailed
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Summary View */}
      {viewMode === 'summary' && (
        <Grid container spacing={3}>
          {/* Total Summary */}
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Total Summary
                </Typography>
                {isLoading ? (
                  <Skeleton height={60} />
                ) : (
                  <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Total Hours
                      </Typography>
                      <Typography variant="h4" fontWeight={700}>
                        {formatHours(reports.totalHours)}h
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Billable Hours
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="success.main">
                        {formatHours(reports.billableHours)}h
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Non-billable Hours
                      </Typography>
                      <Typography variant="h4" fontWeight={700} color="text.secondary">
                        {formatHours(reports.nonBillableHours)}h
                      </Typography>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* By Project */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  By Project
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell align="right">Hours</TableCell>
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
                      ) : reports.byProject && reports.byProject.length > 0 ? (
                        reports.byProject.map((item) => (
                          <TableRow key={item.projectId || 'no-project'}>
                            <TableCell>{item.projectName || 'No Project'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatHours(item.totalHours)}h
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography color="text.secondary">No data</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>

          {/* By Tag */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  By Tag
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>Tag</TableCell>
                        <TableCell align="right">Hours</TableCell>
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
                      ) : reports.byTag && reports.byTag.length > 0 ? (
                        reports.byTag.map((item) => (
                          <TableRow key={item.tagId || 'no-tag'}>
                            <TableCell>{item.tagName || 'No Tag'}</TableCell>
                            <TableCell align="right" sx={{ fontWeight: 600 }}>
                              {formatHours(item.totalHours)}h
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={2} align="center">
                            <Typography color="text.secondary">No data</Typography>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Detailed View */}
      {viewMode === 'detailed' && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Detailed Entries
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Tags</TableCell>
                    <TableCell align="right">Hours</TableCell>
                    <TableCell>Billable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    [1, 2, 3, 4, 5].map((i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                        <TableCell><Skeleton /></TableCell>
                      </TableRow>
                    ))
                  ) : reports.entries && reports.entries.length > 0 ? (
                    reports.entries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {entry.startTime
                            ? format(new Date(entry.startTime), 'MMM dd, yyyy')
                            : '-'}
                        </TableCell>
                        <TableCell>{entry.description || 'No description'}</TableCell>
                        <TableCell>{entry.project?.name || '-'}</TableCell>
                        <TableCell>
                          {entry.tags?.map((tag) => (
                            <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 0.5 }} />
                          ))}
                        </TableCell>
                        <TableCell align="right" sx={{ fontWeight: 600 }}>
                          {entry.startTime && entry.endTime
                            ? formatHours(
                                (new Date(entry.endTime) - new Date(entry.startTime)) /
                                  (1000 * 60 * 60)
                              )
                            : '-'}
                          h
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
                      <TableCell colSpan={6} align="center">
                        <Typography color="text.secondary">No entries found</Typography>
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

export default Reports
