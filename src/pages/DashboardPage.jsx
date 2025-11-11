import { useQuery } from '@tanstack/react-query'
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
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
import { dashboardService } from '../services/dashboardService'
import { timeEntryService } from '../services/timeEntryService'
import { formatHours, formatDateTime } from '../utils/dateUtils'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6']

export default function DashboardPage() {
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: () => dashboardService.getSummary(),
  })

  const { data: recentEntriesData, isLoading: entriesLoading } = useQuery({
    queryKey: ['timeEntries', { limit: 10 }],
    queryFn: () => timeEntryService.getTimeEntries({ limit: 10 }),
  })

  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ['timeEntries', { days: 7 }],
    queryFn: () => {
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - 7)
      return timeEntryService.getTimeEntries({
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
      })
    },
  })

  if (summaryLoading || entriesLoading || weeklyLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    )
  }

  const summary = summaryData?.data || {}
  const recentEntries = recentEntriesData?.data || []
  const weeklyEntries = weeklyData?.data || []

  // Process data for charts
  const projectData = {}
  weeklyEntries.forEach((entry) => {
    const projectName = entry.project?.name || 'No Project'
    const hours = entry.duration ? parseFloat(formatHours(entry.duration)) : 0
    projectData[projectName] = (projectData[projectName] || 0) + hours
  })

  const pieData = Object.entries(projectData).map(([name, value]) => ({
    name,
    value: parseFloat(value.toFixed(2)),
  }))

  // Daily hours for last 7 days
  const dailyHours = {}
  weeklyEntries.forEach((entry) => {
    const date = entry.startTime?.split('T')[0] || new Date().toISOString().split('T')[0]
    const hours = entry.duration ? parseFloat(formatHours(entry.duration)) : 0
    dailyHours[date] = (dailyHours[date] || 0) + hours
  })

  const barData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().split('T')[0]
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short' }),
      hours: parseFloat((dailyHours[dateStr] || 0).toFixed(2)),
    }
  })

  const billableHours = summary.billableHours || 0
  const totalHours = summary.totalHours || 0
  const billablePercentage = totalHours > 0 ? ((billableHours / totalHours) * 100).toFixed(1) : 0

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Today
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {summary.todayHours ? parseFloat(summary.todayHours).toFixed(1) : '0.0'}h
                  </Typography>
                </Box>
                <AccessTimeIcon sx={{ fontSize: 40, color: 'primary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    This Week
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {summary.weekHours ? parseFloat(summary.weekHours).toFixed(1) : '0.0'}h
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, color: 'secondary.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    This Month
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {summary.monthHours ? parseFloat(summary.monthHours).toFixed(1) : '0.0'}h
                  </Typography>
                </Box>
                <CalendarTodayIcon sx={{ fontSize: 40, color: 'success.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography color="text.secondary" variant="body2" gutterBottom>
                    Billable
                  </Typography>
                  <Typography variant="h4" fontWeight={600}>
                    {billablePercentage}%
                  </Typography>
                </Box>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'warning.main', opacity: 0.7 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
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
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Daily Hours (Last 7 Days)
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hours" fill="#6366f1" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Entries */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight={600}>
                Recent Time Entries
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Description</TableCell>
                      <TableCell>Project</TableCell>
                      <TableCell>Date</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Billable</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentEntries.length > 0 ? (
                      recentEntries.map((entry) => (
                        <TableRow key={entry.id}>
                          <TableCell>{entry.description || '-'}</TableCell>
                          <TableCell>
                            {entry.project?.name || (
                              <Typography color="text.secondary" variant="body2">
                                No Project
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {entry.startTime
                              ? new Date(entry.startTime).toLocaleDateString()
                              : '-'}
                          </TableCell>
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
                            No recent entries
                          </Typography>
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
    </Box>
  )
}
