import { Box, Grid, Card, CardContent, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../services/dashboardService'
import { timeEntryService } from '../services/timeEntryService'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
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

  const summary = summaryData?.data || {}
  const recentEntries = recentEntriesData?.data || []

  // Prepare chart data
  const projectData = summary.projectDistribution?.map((item) => ({
    name: item.projectName || 'Unassigned',
    value: item.hours || 0,
  })) || []

  const dailyHours = summary.dailyHours?.map((item) => ({
    date: format(new Date(item.date), 'MMM dd'),
    hours: item.hours || 0,
  })) || []

  const summaryCards = [
    {
      title: 'Today',
      value: `${summary.todayHours || 0}h`,
      icon: <AccessTimeIcon />,
      color: '#6366f1',
    },
    {
      title: 'This Week',
      value: `${summary.weekHours || 0}h`,
      icon: <CalendarTodayIcon />,
      color: '#8b5cf6',
    },
    {
      title: 'This Month',
      value: `${summary.monthHours || 0}h`,
      icon: <TrendingUpIcon />,
      color: '#10b981',
    },
    {
      title: 'Billable Ratio',
      value: summary.billableRatio ? `${Math.round(summary.billableRatio * 100)}%` : '0%',
      icon: <AttachMoneyIcon />,
      color: '#f59e0b',
    },
  ]

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 700 }}>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {summaryCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card
              sx={{
                height: '100%',
                background: `linear-gradient(135deg, ${card.color}15 0%, ${card.color}05 100%)`,
                border: `1px solid ${card.color}30`,
              }}
            >
              <CardContent>
                {summaryLoading ? (
                  <Skeleton variant="rectangular" height={100} />
                ) : (
                  <>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          backgroundColor: `${card.color}20`,
                          color: card.color,
                        }}
                      >
                        {card.icon}
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Charts Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Time by Project
              </Typography>
              {summaryLoading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : projectData.length > 0 ? (
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
                      dataKey="value"
                    >
                      {projectData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
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
                Daily Hours (Last 7 Days)
              </Typography>
              {summaryLoading ? (
                <Skeleton variant="rectangular" height={300} />
              ) : dailyHours.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={dailyHours}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="hours" fill="#6366f1" name="Hours" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">No data available</Typography>
                </Box>
              )}
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
          {entriesLoading ? (
            <Skeleton variant="rectangular" height={200} />
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Project</TableCell>
                    <TableCell align="right">Duration</TableCell>
                    <TableCell align="right">Billable</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentEntries.length > 0 ? (
                    recentEntries.map((entry) => (
                      <TableRow key={entry.id}>
                        <TableCell>
                          {entry.startTime ? format(new Date(entry.startTime), 'MMM dd, yyyy') : '-'}
                        </TableCell>
                        <TableCell>{entry.description || '-'}</TableCell>
                        <TableCell>
                          {entry.project?.name || 'No project'}
                        </TableCell>
                        <TableCell align="right">
                          {entry.duration ? `${(entry.duration / 3600).toFixed(2)}h` : '-'}
                        </TableCell>
                        <TableCell align="right">
                          {entry.isBillable ? 'Yes' : 'No'}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align="center">
                        <Typography color="text.secondary" sx={{ py: 2 }}>
                          No time entries yet
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
