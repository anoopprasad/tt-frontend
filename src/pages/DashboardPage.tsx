// Dashboard page

import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  AccessTime,
  TrendingUp,
  CalendarToday,
  AttachMoney,
} from '@mui/icons-material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useDashboardSummary } from '../hooks/useDashboard';
import { useTimeEntries } from '../hooks/useTimeEntries';
import { formatDurationHours, formatDate } from '../utils/date';
import { LoadingSpinner } from '../components/common/LoadingSpinner';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export const DashboardPage: React.FC = () => {
  const { data: summary, isLoading: summaryLoading } = useDashboardSummary();
  const { data: recentEntries, isLoading: entriesLoading } = useTimeEntries({ 
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  if (summaryLoading) {
    return <LoadingSpinner />;
  }

  const stats = [
    {
      title: 'Today',
      value: summary ? formatDurationHours(summary.todayHours * 3600) : '0h',
      icon: <AccessTime />,
      color: '#1976d2',
    },
    {
      title: 'This Week',
      value: summary ? formatDurationHours(summary.weekHours * 3600) : '0h',
      icon: <CalendarToday />,
      color: '#2e7d32',
    },
    {
      title: 'This Month',
      value: summary ? formatDurationHours(summary.monthHours * 3600) : '0h',
      icon: <TrendingUp />,
      color: '#ed6c02',
    },
    {
      title: 'Billable',
      value: summary ? `${Math.round((summary.billableHours / (summary.billableHours + summary.nonBillableHours)) * 100) || 0}%` : '0%',
      icon: <AttachMoney />,
      color: '#9c27b0',
    },
  ];

  // Prepare chart data
  const projectData = recentEntries?.reduce((acc: any, entry) => {
    if (entry.project) {
      const projectName = entry.project.name;
      const hours = (entry.duration || 0) / 3600;
      acc[projectName] = (acc[projectName] || 0) + hours;
    }
    return acc;
  }, {}) || {};

  const pieData = Object.entries(projectData).map(([name, value]) => ({
    name,
    value: Number(value),
  }));

  // Daily hours for last 7 days
  const dailyData = recentEntries?.reduce((acc: any, entry) => {
    const date = formatDate(entry.date);
    const hours = (entry.duration || 0) / 3600;
    acc[date] = (acc[date] || 0) + hours;
  }, {}) || {};

  const barData = Object.entries(dailyData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, value]) => ({
      date: formatDate(date, 'MMM dd'),
      hours: Number(value),
    }));

  const recentEntriesList = recentEntries?.slice(0, 10) || [];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography color="text.secondary" gutterBottom>
                      {stat.title}
                    </Typography>
                    <Typography variant="h4">{stat.value}</Typography>
                  </Box>
                  <Box sx={{ color: stat.color }}>{stat.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Time by Project
            </Typography>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Hours (Last 7 Days)
            </Typography>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <Box textAlign="center" py={4}>
                <Typography color="text.secondary">No data available</Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Recent Entries */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Recent Time Entries
        </Typography>
        {entriesLoading ? (
          <Box textAlign="center" py={4}>
            <CircularProgress />
          </Box>
        ) : recentEntriesList.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Project</TableCell>
                  <TableCell align="right">Duration</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {recentEntriesList.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{formatDate(entry.date)}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{entry.project?.name || '-'}</TableCell>
                    <TableCell align="right">
                      {formatDurationHours(entry.duration || 0)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography color="text.secondary">No recent entries</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};
