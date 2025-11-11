import { useQuery } from '@tanstack/react-query';
import { FormControl, InputLabel, Select, MenuItem, Box, Typography } from '@mui/material';
import { projectsAPI } from '../../api/projects';

export const ProjectSelect = ({ value, onChange, disabled = false, fullWidth = true }) => {
  const { data: projectsData, isLoading } = useQuery({
    queryKey: ['projects'],
    queryFn: projectsAPI.list,
  });

  const projects = projectsData?.data || [];

  // Group projects by client
  const groupedProjects = projects.reduce((acc, project) => {
    const clientName = project.client?.name || 'No Client';
    if (!acc[clientName]) {
      acc[clientName] = [];
    }
    acc[clientName].push(project);
    return acc;
  }, {});

  return (
    <FormControl fullWidth={fullWidth} margin="normal" disabled={disabled}>
      <InputLabel>Project (Optional)</InputLabel>
      <Select
        value={value || ''}
        onChange={(e) => onChange(e.target.value || null)}
        label="Project (Optional)"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {Object.entries(groupedProjects).map(([clientName, clientProjects]) => [
          <MenuItem key={clientName} disabled>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
              {clientName}
            </Typography>
          </MenuItem>,
          ...clientProjects.map((project) => (
            <MenuItem key={project.id} value={project.id} sx={{ pl: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    bgcolor: project.color || 'primary.main',
                  }}
                />
                {project.name}
              </Box>
            </MenuItem>
          )),
        ])}
      </Select>
    </FormControl>
  );
};
