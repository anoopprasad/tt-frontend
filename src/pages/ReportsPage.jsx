import { useState } from 'react'
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
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { useQuery } from '@tanstack/react-query'
import { reportService } from '../services/reportService'
import { projectService } from '../services/projectService'
import { clientService } from '../services/clientService'
import { tagService } from '../services/tagService'
import { teamService } from '../services/teamService'
import { format, subDays } from 'date-fns'
import { Controller, useForm } from 'react-hook-form'

export default function ReportsPage() {
  const [viewMode, setViewMode] = useState('summary')
  const { register, control, watch } = useForm({
    defaultValues: {
      startDate: subDays(new Date(), 30),
      endDate: new Date(),
      clientId: '',
      projectId: '',
      tagIds: [],
      teamIds: [],
      billableFilter: 'all',
    },
  })

  const filters = watch()

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

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['reports', filters],
    queryFn: () =>
      reportService.getReports({
        startDate: format(filters.startDate, 'yyyy-MM-dd'),
        endDate: format(filters.endDate, 'yyyy-MM-dd'),
        clientId: filters.clientId || undefined,
        projectId: filters.projectId || undefined,
        tagIds: filters.tagIds?.length > 0 ? filters.tagIds : undefined,
        teamIds: filters.teamIds?.length > 0 ? filters.teamIds : undefined,
        isBillable: filters.billableFilter === 'all' ? undefined : filters.billableFilter === 'billable',
      }),
  })

  const clients = clientsData?.data || []
  const projects = projectsData?.data || []
  const tags = tagsData?.data || []
  const teams = teamsData?.data || []
  const reports = reportsData?.data || {}
  const summary = reports.summary || {}
  const entries = reports.entries || []

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
            Reports
          </Typography>
          <ToggleButtonGroup value={viewMode} exclusive onChange={(e, val) => val && setViewMode(val)}>
            <ToggleButton value="summary">Summary</ToggleButton>
            <ToggleButton value="detailed">Detailed</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Filters
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} md={3}>
                <Controller
                  name="startDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="Start Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <Controller
                  name="endDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      label="End Date"
                      value={field.value}
                      onChange={field.onChange}
                      slotProps={{ textField: { fullWidth: true } }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Client</InputLabel>
                  <Controller
                    name="clientId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Client">
                        <MenuItem value="">All</MenuItem>
                        {clients.map((client) => (
                          <MenuItem key={client.id} value={client.id}>
                            {client.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Project</InputLabel>
                  <Controller
                    name="projectId"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Project">
                        <MenuItem value="">All</MenuItem>
                        {projects.map((project) => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name}
                          </MenuItem>
                        ))}
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
                <FormControl fullWidth>
                  <InputLabel>Billable</InputLabel>
                  <Controller
                    name="billableFilter"
                    control={control}
                    render={({ field }) => (
                      <Select {...field} label="Billable">
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="billable">Billable</MenuItem>
                        <MenuItem value="non-billable">Non-Billable</MenuItem>
                      </Select>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {viewMode === 'summary' ? (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    By Project
                  </Typography>
                  {summary.byProject?.map((item) => (
                    <Box key={item.projectId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{item.projectName || 'Unassigned'}</Typography>
                      <Typography fontWeight={600}>{item.hours?.toFixed(2)}h</Typography>
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
                  {summary.byTag?.map((item) => (
                    <Box key={item.tagId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{item.tagName}</Typography>
                      <Typography fontWeight={600}>{item.hours?.toFixed(2)}h</Typography>
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
                  {summary.byTeam?.map((item) => (
                    <Box key={item.teamId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography>{item.teamName}</Typography>
                      <Typography fontWeight={600}>{item.hours?.toFixed(2)}h</Typography>
                    </Box>
                  ))}
                </CardContent>
              </Card>
            </Grid>
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
                      <TableCell>Tags</TableCell>
                      <TableCell align="right">Duration</TableCell>
                      <TableCell align="right">Billable</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {entries.length > 0 ? (
                      entries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>
                            {entry.startTime ? format(new Date(entry.startTime), 'MMM dd, yyyy') : '-'}
                          </TableCell>
                          <TableCell>{entry.description || '-'}</TableCell>
                          <TableCell>{entry.project?.name || '-'}</TableCell>
                          <TableCell>
                            {entry.tags?.map((tag) => (
                              <Chip key={tag.id} label={tag.name} size="small" sx={{ mr: 0.5 }} />
                            ))}
                          </TableCell>
                          <TableCell align="right">
                            {entry.duration ? `${(entry.duration / 3600).toFixed(2)}h` : '-'}
                          </TableCell>
                          <TableCell align="right">{entry.isBillable ? 'Yes' : 'No'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography color="text.secondary" sx={{ py: 2 }}>
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
    </LocalizationProvider>
  )
}
