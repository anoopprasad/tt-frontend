import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Autocomplete,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Download as DownloadIcon, ViewList, ViewModule } from '@mui/icons-material';
import dayjs from 'dayjs';
import { dashboardAPI } from '../api/dashboard';
import { projectsAPI } from '../api/projects';
import { clientsAPI } from '../api/clients';
import { tagsAPI } from '../api/tags';
import { teamsAPI } from '../api/teams';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { formatHours, formatDate } from '../utils/formatters';

export const ReportsPage = () => {
  const [viewMode, setViewMode] = useState('summary');
  const [startDate, setStartDate] = useState(dayjs().startOf('month'));
  const [endDate, setEndDate] = useState(dayjs().endOf('month'));
  const [selectedClient, setSelectedClient] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [billableFilter, setBillableFilter] = useState('all');

  const { data: reportsData, isLoading } = useQuery({
    queryKey: [
      'reports',
      startDate.format('YYYY-MM-DD'),
      endDate.format('YYYY-MM-DD'),
      selectedClient?.id,
      selectedProject?.id,
      selectedTags.map((t) => t.id),
      selectedTeams.map((t) => t.id),
      billableFilter,
    ],
    queryFn: () =>
      dashboardAPI.getReports({
        startDate: startDate.format('YYYY-MM-DD'),
        endDate: endDate.format('YYYY-MM-DD'),
        clientId: selectedClient?.id,
        projectId: selectedProject?.id,
        tagIds: selectedTags.map((t) => t.id).join(','),
        teamIds: selectedTeams.map((t) => t.id).join(','),
        isBillable: billableFilter === 'all' ? undefined : billableFilter === 'billable',
      }),
  });

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.list,
  });

  const { data: clientsData } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsAPI.list,
  });

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsAPI.list,
  });

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsAPI.list,
  });

  const projects = projectsData?.data || [];
  const clients = clientsData?.data || [];
  const tags = tagsData?.data || [];
  const teams = teamsData?.data || [];
  const reportData = reportsData?.data || { entries: [], summary: {} };

  const handleExport = () => {
    // Trigger CSV download - would call backend endpoint
    alert('CSV export would be triggered here');
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
          Reports
        </Typography>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                sx={{ width: '100%' }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={clients}
                getOptionLabel={(option) => option.name}
                value={selectedClient}
                onChange={(_, newValue) => setSelectedClient(newValue)}
                renderInput={(params) => <TextField {...params} label="Client" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                options={projects}
                getOptionLabel={(option) => option.name}
                value={selectedProject}
                onChange={(_, newValue) => setSelectedProject(newValue)}
                renderInput={(params) => <TextField {...params} label="Project" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={tags}
                getOptionLabel={(option) => option.name}
                value={selectedTags}
                onChange={(_, newValue) => setSelectedTags(newValue)}
                renderInput={(params) => <TextField {...params} label="Tags" />}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                multiple
                options={teams}
                getOptionLabel={(option) => option.name}
                value={selectedTeams}
                onChange={(_, newValue) => setSelectedTeams(newValue)}
                renderInput={(params) => <TextField {...params} label="Teams" />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                select
                label="Billable Status"
                value={billableFilter}
                onChange={(e) => setBillableFilter(e.target.value)}
                fullWidth
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="billable">Billable Only</MenuItem>
                <MenuItem value="non-billable">Non-Billable Only</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Paper>

        {/* View Toggle and Export */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newValue) => newValue && setViewMode(newValue)}
          >
            <ToggleButton value="summary">
              <ViewModule sx={{ mr: 1 }} />
              Summary
            </ToggleButton>
            <ToggleButton value="detailed">
              <ViewList sx={{ mr: 1 }} />
              Detailed
            </ToggleButton>
          </ToggleButtonGroup>

          <Button variant="outlined" startIcon={<DownloadIcon />} onClick={handleExport}>
            Export CSV
          </Button>
        </Box>

        {/* Results */}
        {isLoading ? (
          <LoadingSpinner message="Generating report..." />
        ) : viewMode === 'summary' ? (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Summary
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.light', borderRadius: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                    {formatHours(reportData.summary?.totalSeconds || 0)}h
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Hours
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'success.light', borderRadius: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'success.main' }}>
                    {formatHours(reportData.summary?.billableSeconds || 0)}h
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Billable Hours
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'warning.light', borderRadius: 2 }}>
                  <Typography variant="h3" sx={{ fontWeight: 700, color: 'warning.main' }}>
                    {reportData.summary?.entryCount || 0}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Total Entries
                  </Typography>
                </Box>
              </Grid>
            </Grid>

            {/* By Project */}
            {reportData.summary?.byProject && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  By Project
                </Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Project</TableCell>
                        <TableCell align="right">Hours</TableCell>
                        <TableCell align="right">Entries</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(reportData.summary.byProject).map(([project, data]) => (
                        <TableRow key={project}>
                          <TableCell>{project}</TableCell>
                          <TableCell align="right">{formatHours(data.seconds)}h</TableCell>
                          <TableCell align="right">{data.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </Paper>
        ) : (
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
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
                    <TableCell align="center">Billable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData.entries?.map((entry) => {
                    const duration = dayjs(entry.endTime).diff(dayjs(entry.startTime), 'second');
                    return (
                      <TableRow key={entry.id}>
                        <TableCell>{formatDate(entry.startTime)}</TableCell>
                        <TableCell>{entry.description}</TableCell>
                        <TableCell>
                          {entry.project && (
                            <Chip
                              label={entry.project.name}
                              size="small"
                              sx={{ bgcolor: entry.project.color }}
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                            {entry.tags?.map((tag) => (
                              <Chip key={tag.id} label={tag.name} size="small" />
                            ))}
                          </Box>
                        </TableCell>
                        <TableCell align="right">{formatHours(duration)}h</TableCell>
                        <TableCell align="center">
                          {entry.isBillable && <Chip label="✓" size="small" color="success" />}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};
