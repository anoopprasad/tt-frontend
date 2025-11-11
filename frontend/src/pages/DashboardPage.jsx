import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Chip,
} from '@mui/material';
import {
  TrendingUp,
  AccessTime,
  AttachMoney,
  CalendarMonth,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { dashboardAPI } from '../api/dashboard';
import { timeEntriesAPI } from '../api/timeEntries';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';
import { formatHours, formatDate } from '../utils/formatters';
import dayjs from 'dayjs';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#43e97b'];

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card sx={{ height: '100%', position: 'relative', overflow: 'visible' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="text.secondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 1 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            bgcolor: `${color}.light`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: `${color}.main`,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export const DashboardPage = () => {
  const { data: summaryData, isLoading: summaryLoading, error: summaryError } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: dashboardAPI.getSummary,
  });

  const { data: entriesData } = useQuery({
    queryKey: ['recent-entries'],
    queryFn: () => timeEntriesAPI.list({ limit: 10 }),
  });

  const summary = summaryData?.data || {};
  const entries = entriesData?.data || [];

  // Calculate stats for charts
  const projectData = entries.reduce((acc, entry) => {
    const projectName = entry.project?.name || 'No Project';
    const duration = dayjs(entry.endTime).diff(dayjs(entry.startTime), 'hour', true);
    
    const existing = acc.find((item) => item.name === projectName);
    if (existing) {
      existing.value += duration;
    } else {
      acc.push({ name: projectName, value: duration });
    }
    return acc;
  }, []);

  // Last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = dayjs().subtract(i, 'day');
    return {
      date: date.format('MMM D'),
      hours: 0,
    };
  }).reverse();

  entries.forEach((entry) => {
    const entryDate = dayjs(entry.startTime).format('MMM D');
    const dayData = last7Days.find((d) => d.date === entryDate);
    if (dayData) {
      const duration = dayjs(entry.endTime).diff(dayjs(entry.startTime), 'hour', true);
      dayData.hours += duration;
    }
  });

  if (summaryLoading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (summaryError) {
    return <ErrorMessage message="Failed to load dashboard data" />;
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Today"
            value={`${formatHours(summary.todaySeconds || 0)}h`}
            subtitle="Hours tracked today"
            icon={<AccessTime fontSize="large" />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="This Week"
            value={`${formatHours(summary.weekSeconds || 0)}h`}
            subtitle="Total this week"
            icon={<CalendarMonth fontSize="large" />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="This Month"
            value={`${formatHours(summary.monthSeconds || 0)}h`}
            subtitle="Total this month"
            icon={<TrendingUp fontSize="large" />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard
            title="Billable Rate"
            value={`${summary.billableRate || 0}%`}
            subtitle="Billable vs non-billable"
            icon={<AttachMoney fontSize="large" />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Time by Project
            </Typography>
            {projectData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={projectData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)} hours`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 300 }}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Last 7 Days
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={last7Days}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip formatter={(value) => `${value.toFixed(2)} hours`} />
                <Bar dataKey="hours" fill="#667eea" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Entries */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          Recent Time Entries
        </Typography>
        {entries.length > 0 ? (
          <Box>
            {entries.map((entry) => {
              const duration = dayjs(entry.endTime).diff(dayjs(entry.startTime), 'second');
              return (
                <Box
                  key={entry.id}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    p: 2,
                    mb: 1,
                    borderRadius: 2,
                    border: 1,
                    borderColor: 'divider',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 500 }}>
                      {entry.description}
                    </Typography>
                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                      {entry.project && (
                        <Chip
                          label={entry.project.name}
                          size="small"
                          sx={{ bgcolor: entry.project.color }}
                        />
                      )}
                      {entry.isBillable && (
                        <Chip label="Billable" size="small" color="success" />
                      )}
                    </Box>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {formatHours(duration)}h
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(entry.startTime)}
                    </Typography>
                  </Box>
                </Box>
              );
            })}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">No time entries yet</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
