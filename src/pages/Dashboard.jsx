import { useQuery } from '@tanstack/react-query'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Skeleton,
} from '@mui/material'
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
} from 'recharts'
import { dashboardApi } from '../api/dashboard'
import { timeEntriesApi } from '../api/timeEntries'
import { formatDurationHours } from '../utils/dateUtils'
import { format, subDays } from 'date-fns'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export const Dashboard = () => {
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async () => {
      const response = await dashboardApi.getSummary()
      return response.data
    },
  })

  const { data: recentEntries, isLoading: entriesLoading } = useQuery({
    queryKey: ['timeEntries', 'recent'],
    queryFn: async () => {
      const response = await timeEntriesApi.list({ limit: 10 })
      return response.data || []
    },
  })

  // Calculate last 7 days data
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i)
    return {
      date: format(date, 'EEE'),
      hours: 0, // Would need to calculate from time entries
    }
  })

  // Calculate project distribution
  const projectData = summaryData?.projectDistribution || []

  const summary = summaryData || {
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    billableHours: 0,
    nonBillableHours: 0,
  }

  if (summaryLoading || entriesLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Card>
                <CardContent>
                  <Skeleton height={60} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                Today
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {summary.todayHours?.toFixed(1) || '0.0'}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                This Week
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {summary.weekHours?.toFixed(1) || '0.0'}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)', color: 'white' }}>
            <CardContent>
              <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
                This Month
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {summary.monthHours?.toFixed(1) || '0.0'}h
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Billable Ratio
              </Typography>
              <Typography variant="h4" fontWeight={600}>
                {summary.billableHours && summary.nonBillableHours
                  ? `${((summary.billableHours / (summary.billableHours + summary.nonBillableHours)) * 100).toFixed(0)}%`
                  : '0%'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {summary.billableHours?.toFixed(1) || 0}h billable /{' '}
                {summary.nonBillableHours?.toFixed(1) || 0}h non-billable
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
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
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="hours"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Last 7 Days
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="hours" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Entries */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Time Entries
          </Typography>
          {recentEntries && recentEntries.length > 0 ? (
            <Box component="table" sx={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Description</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Project</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Duration</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentEntries.map((entry) => (
                  <tr key={entry.id}>
                    <td style={{ padding: '8px' }}>{entry.description || 'No description'}</td>
                    <td style={{ padding: '8px' }}>
                      {entry.project?.name || 'No project'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {entry.duration ? formatDurationHours(entry.duration) + 'h' : '-'}
                    </td>
                    <td style={{ padding: '8px' }}>
                      {entry.startTime ? format(new Date(entry.startTime), 'MMM d, yyyy') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Box>
          ) : (
            <Typography color="text.secondary">No recent entries</Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
