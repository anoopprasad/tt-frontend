import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { Box, Typography, CircularProgress } from '@mui/material'
import { dashboardService } from '../../services/dashboardService'
import { startOfMonth, endOfMonth } from 'date-fns'

const COLORS = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#84cc16']

const ProjectDistributionChart = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ['reports', 'projects', 'month'],
    queryFn: () =>
      dashboardService.getReports({
        startDate: startOfMonth(new Date()).toISOString(),
        endDate: endOfMonth(new Date()).toISOString(),
        groupBy: 'project',
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

  const projectData = data?.data?.byProject || []
  const chartData = projectData
    .map((item) => ({
      name: item.projectName || 'No Project',
      value: parseFloat(item.totalHours || 0),
    }))
    .filter((item) => item.value > 0)

  if (chartData.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
        <Typography color="text.secondary">No data available</Typography>
      </Box>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => `${value.toFixed(1)} hours`} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}

export default ProjectDistributionChart
