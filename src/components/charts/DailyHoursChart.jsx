import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, CircularProgress } from '@mui/material'
import { timeEntryService } from '../../services/timeEntryService'
import { subDays, format, startOfDay, endOfDay } from 'date-fns'

const DailyHoursChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['timeEntries', 'last7days'],
    queryFn: () =>
      timeEntryService.getTimeEntries({
        startDate: subDays(new Date(), 6).toISOString(),
        endDate: new Date().toISOString(),
      }),
  })

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography color="text.secondary">Failed to load data</Typography>
      </Box>
    )
  }

  const entries = data?.data || []

  // Group entries by day
  const dailyHours = {}
  for (let i = 6; i >= 0; i--) {
    const date = subDays(new Date(), i)
    const dateKey = format(date, 'yyyy-MM-dd')
    dailyHours[dateKey] = 0
  }

  entries.forEach((entry) => {
    if (entry.startTime && entry.endTime) {
      const dateKey = format(new Date(entry.startTime), 'yyyy-MM-dd')
      const start = new Date(entry.startTime)
      const end = new Date(entry.endTime)
      const hours = (end - start) / (1000 * 60 * 60)
      if (dailyHours[dateKey] !== undefined) {
        dailyHours[dateKey] += hours
      }
    }
  })

  const chartData = Object.entries(dailyHours).map(([date, hours]) => ({
    date: format(new Date(date), 'EEE'),
    hours: parseFloat(hours.toFixed(2)),
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
        <Tooltip formatter={(value) => `${value.toFixed(1)} hours`} />
        <Bar dataKey="hours" fill="#6366f1" radius={[8, 8, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DailyHoursChart
