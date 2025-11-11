import { FormControl, InputLabel, Select, MenuItem, CircularProgress, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { projectService } from '../../services/projectService'

const ProjectSelector = ({ value, onChange, disabled, error, helperText, required }) => {
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.getProjects,
  })

  const projects = projectsData?.data || []

  // Group projects by client
  const groupedProjects = projects.reduce((acc, project) => {
    const clientName = project.client?.name || 'No Client'
    if (!acc[clientName]) {
      acc[clientName] = []
    }
    acc[clientName].push(project)
    return acc
  }, {})

  return (
    <FormControl fullWidth error={error} disabled={disabled || isLoading}>
      <InputLabel>Project {required && '*'}</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        label={`Project ${required ? '*' : ''}`}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {isLoading ? (
          <MenuItem disabled>
            <CircularProgress size={20} />
          </MenuItem>
        ) : (
          Object.entries(groupedProjects).map(([clientName, clientProjects]) => [
            <MenuItem key={`header-${clientName}`} disabled sx={{ fontWeight: 600, fontSize: '0.9em' }}>
              {clientName}
            </MenuItem>,
            ...clientProjects.map((project) => (
              <MenuItem key={project.id} value={project.id} sx={{ pl: 4 }}>
                {project.name}
              </MenuItem>
            )),
          ])
        )}
      </Select>
      {helperText && <Typography variant="caption" color="error">{helperText}</Typography>}
    </FormControl>
  )
}

export default ProjectSelector
