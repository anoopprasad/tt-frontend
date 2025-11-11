import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Typography,
  Skeleton,
  Box,
} from '@mui/material'
import { format } from 'date-fns'

const RecentEntriesTable = ({ entries, loading }) => {
  const formatDuration = (start, end) => {
    if (!start || !end) return '-'
    const startTime = new Date(start)
    const endTime = new Date(end)
    const hours = (endTime - startTime) / (1000 * 60 * 60)
    return `${hours.toFixed(1)}h`
  }

  if (loading) {
    return (
      <Box>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} height={60} sx={{ mb: 1 }} />
        ))}
      </Box>
    )
  }

  if (entries.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">No time entries yet</Typography>
      </Box>
    )
  }

  return (
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
          {entries.map((entry) => (
            <TableRow key={entry.id} hover>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {entry.description || 'No description'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {entry.project?.name || '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2">
                  {entry.startTime
                    ? format(new Date(entry.startTime), 'MMM dd, yyyy')
                    : '-'}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="body2" fontWeight={500}>
                  {formatDuration(entry.startTime, entry.endTime)}
                </Typography>
              </TableCell>
              <TableCell>
                <Chip
                  label={entry.isBillable ? 'Billable' : 'Non-billable'}
                  size="small"
                  color={entry.isBillable ? 'success' : 'default'}
                  sx={{ fontWeight: 500 }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RecentEntriesTable
