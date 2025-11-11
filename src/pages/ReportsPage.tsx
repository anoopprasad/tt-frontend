// Reports page

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Chip,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  CardContent,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Download } from '@mui/icons-material';
import { useReports } from '../hooks/useReports';
import { useClients } from '../hooks/useClients';
import { useProjects } from '../hooks/useProjects';
import { useTags } from '../hooks/useTags';
import { useTeams } from '../hooks/useTeams';
import { formatDate, formatDurationHours } from '../utils/date';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';

type ViewMode = 'summary' | 'detailed';

export const ReportsPage: React.FC = () => {
  const [startDate, setStartDate] = useState<Date>(startOfMonth(subMonths(new Date(), 1)));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [clientId, setClientId] = useState<number | undefined>();
  const [projectId, setProjectId] = useState<number | undefined>();
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<number[]>([]);
  const [billableFilter, setBillableFilter] = useState<'all' | 'billable' | 'non-billable'>('all');
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  const { data: clients = [] } = useClients();
  const { data: projects = [] } = useProjects();
  const { data: tags = [] } = useTags();
  const { data: teams = [] } = useTeams();

  const filters = {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate),
    clientId,
    projectId,
    tagIds: selectedTags.length > 0 ? selectedTags : undefined,
    teamIds: selectedTeams.length > 0 ? selectedTeams : undefined,
    isBillable: billableFilter === 'all' ? undefined : billableFilter === 'billable',
  };

  const { data: reportData, isLoading } = useReports(filters);

  const handleExport = () => {
    // TODO: Implement CSV export
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, String(value));
      }
    });
    window.open(`/api/v1/reports/export?${params.toString()}`, '_blank');
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const summary = reportData?.summary || {
    totalHours: 0,
    billableHours: 0,
    byProject: {},
    byTag: {},
    byTeam: {},
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Reports</Typography>
          <Button
            variant="contained"
            startIcon={<Download />}
            onClick={handleExport}
            disabled={!reportData}
          >
            Export CSV
          </Button>
        </Box>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Filters
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={(newValue) => newValue && setStartDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={(newValue) => newValue && setEndDate(newValue)}
                slotProps={{ textField: { fullWidth: true } }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Client</InputLabel>
                <Select
                  value={clientId || ''}
                  label="Client"
                  onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : undefined)}
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
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Project</InputLabel>
                <Select
                  value={projectId || ''}
                  label="Project"
                  onChange={(e) => setProjectId(e.target.value ? Number(e.target.value) : undefined)}
                >
                  <MenuItem value="">All</MenuItem>
                  {projects
                    .filter((p) => !clientId || p.clientId === clientId)
                    .map((project) => (
                      <MenuItem key={project.id} value={project.id}>
                        {project.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                multiple
                options={tags}
                getOptionLabel={(option) => option.name}
                value={tags.filter((t) => selectedTags.includes(t.id))}
                onChange={(_, newValue) => setSelectedTags(newValue.map((t) => t.id))}
                renderInput={(params) => <TextField {...params} label="Tags" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Autocomplete
                multiple
                options={teams}
                getOptionLabel={(option) => option.name}
                value={teams.filter((t) => selectedTeams.includes(t.id))}
                onChange={(_, newValue) => setSelectedTeams(newValue.map((t) => t.id))}
                renderInput={(params) => <TextField {...params} label="Teams" />}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip
                      label={option.name}
                      {...getTagProps({ index })}
                      key={option.id}
                      sx={{ bgcolor: option.color }}
                    />
                  ))
                }
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Billable Status</InputLabel>
                <Select
                  value={billableFilter}
                  label="Billable Status"
                  onChange={(e) => setBillableFilter(e.target.value as any)}
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="billable">Billable Only</MenuItem>
                  <MenuItem value="non-billable">Non-Billable Only</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        {/* View Toggle */}
        <Box mb={2}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(_, newMode) => newMode && setViewMode(newMode)}
            aria-label="view mode"
          >
            <ToggleButton value="summary">Summary</ToggleButton>
            <ToggleButton value="detailed">Detailed</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Summary View */}
        {viewMode === 'summary' && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Total Hours
                  </Typography>
                  <Typography variant="h4">
                    {formatDurationHours(summary.totalHours * 3600)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Billable Hours
                  </Typography>
                  <Typography variant="h4">
                    {formatDurationHours(summary.billableHours * 3600)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom>
                    Billable %
                  </Typography>
                  <Typography variant="h4">
                    {summary.totalHours > 0
                      ? Math.round((summary.billableHours / summary.totalHours) * 100)
                      : 0}%
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            {/* By Project */}
            {Object.keys(summary.byProject).length > 0 && (
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Hours by Project
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
                        {Object.entries(summary.byProject).map(([projectId, hours]) => {
                          const project = projects.find((p) => p.id === Number(projectId));
                          return (
                            <TableRow key={projectId}>
                              <TableCell>{project?.name || 'Unknown'}</TableCell>
                              <TableCell align="right">
                                {formatDurationHours(Number(hours) * 3600)}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            )}
          </Grid>
        )}

        {/* Detailed View */}
        {viewMode === 'detailed' && (
          <Paper>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell>Client</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell>Billable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reportData?.entries?.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{formatDate(entry.date)}</TableCell>
                      <TableCell>{entry.description}</TableCell>
                      <TableCell>{entry.project?.name || '-'}</TableCell>
                      <TableCell>{entry.client?.name || '-'}</TableCell>
                      <TableCell align="right">
                        {formatDurationHours(entry.duration || 0)}
                      </TableCell>
                      <TableCell>{entry.isBillable ? 'Yes' : 'No'}</TableCell>
                    </TableRow>
                  ))}
                  {(!reportData?.entries || reportData.entries.length === 0) && (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No entries found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}
      </Box>
    </LocalizationProvider>
  );
};
