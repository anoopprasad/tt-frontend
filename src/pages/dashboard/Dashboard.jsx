import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { dashboardService } from '../../services/dashboardService'
import { timeEntryService } from '../../services/timeEntryService'
import { TrendingUp, AccessTime, AttachMoney, CalendarToday } from '@mui/icons-material'
import ProjectDistributionChart from '../../components/charts/ProjectDistributionChart'
import DailyHoursChart from '../../components/charts/DailyHoursChart'
import RecentEntriesTable from '../../components/common/RecentEntriesTable'

const StatCard = ({ title, value, subtitle, icon, color }) => (
  <Card
    sx={{
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 0.5 }}>
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            width: 56,
            height: 56,
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${color}22 0%, ${color}11 100%)`,
            color: color,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
)

const Dashboard = () => {
  const { data: summaryData, isLoading: summaryLoading } = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: dashboardService.getSummary,
  })

  const { data: recentEntriesData, isLoading: entriesLoading } = useQuery({
    queryKey: ['timeEntries', 'recent'],
    queryFn: () => timeEntryService.getTimeEntries({ limit: 10 }),
  })

  const summary = summaryData?.data || {}
  const recentEntries = recentEntriesData?.data || []

  const formatHours = (hours) => {
    if (hours === undefined || hours === null) return '0.0'
    return typeof hours === 'number' ? hours.toFixed(1) : '0.0'
  }

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          {summaryLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Today"
              value={`${formatHours(summary.todayHours)}h`}
              subtitle="Hours logged"
              icon={<CalendarToday fontSize="large" />}
              color="#6366f1"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {summaryLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="This Week"
              value={`${formatHours(summary.weekHours)}h`}
              subtitle="Hours logged"
              icon={<AccessTime fontSize="large" />}
              color="#10b981"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {summaryLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="This Month"
              value={`${formatHours(summary.monthHours)}h`}
              subtitle="Hours logged"
              icon={<TrendingUp fontSize="large" />}
              color="#f59e0b"
            />
          )}
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          {summaryLoading ? (
            <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 2 }} />
          ) : (
            <StatCard
              title="Billable"
              value={`${summary.billablePercentage || 0}%`}
              subtitle="This month"
              icon={<AttachMoney fontSize="large" />}
              color="#ec4899"
            />
          )}
        </Grid>
      </Grid>

      {/* Charts */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Time by Project
              </Typography>
              <ProjectDistributionChart />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Daily Hours (Last 7 Days)
              </Typography>
              <DailyHoursChart />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Entries */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={600} gutterBottom sx={{ mb: 2 }}>
            Recent Time Entries
          </Typography>
          <RecentEntriesTable entries={recentEntries} loading={entriesLoading} />
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard
