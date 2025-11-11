import { FormControl, InputLabel, Select, MenuItem, Chip, Box, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { teamService } from '../../services/teamService'

const TeamsSelector = ({ value = [], onChange, disabled, error, helperText }) => {
  const { data: teamsData, isLoading } = useQuery({
    queryKey: ['teams'],
    queryFn: teamService.getTeams,
  })

  const teams = teamsData?.data || []

  return (
    <FormControl fullWidth error={error} disabled={disabled || isLoading}>
      <InputLabel>Teams</InputLabel>
      <Select
        multiple
        value={value}
        onChange={(e) => onChange(e.target.value)}
        label="Teams"
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((teamId) => {
              const team = teams.find((t) => t.id === teamId)
              return (
                <Chip
                  key={teamId}
                  label={team?.name || teamId}
                  size="small"
                  sx={{
                    backgroundColor: team?.color || 'default',
                    color: 'white',
                  }}
                />
              )
            })}
          </Box>
        )}
      >
        {isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          teams.map((team) => (
            <MenuItem key={team.id} value={team.id}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 16,
                    height: 16,
                    borderRadius: '50%',
                    backgroundColor: team.color || '#ccc',
                  }}
                />
                {team.name}
              </Box>
            </MenuItem>
          ))
        )}
      </Select>
      {helperText && <Typography variant="caption" color="error">{helperText}</Typography>}
    </FormControl>
  )
}

export default TeamsSelector
