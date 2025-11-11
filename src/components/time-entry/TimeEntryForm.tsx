// Time entry form component

import React, { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  Box,
  Chip,
  Autocomplete,
  Grid,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useProjects } from '../../hooks/useProjects';
import { useTags } from '../../hooks/useTags';
import { useTeams } from '../../hooks/useTeams';
import type { TimeEntry, Project, Tag, Team } from '../../types';
import { formatDateTime, parseISO } from 'date-fns';

interface TimeEntryFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<TimeEntry>) => void;
  initialData?: Partial<TimeEntry>;
  mode?: 'create' | 'edit' | 'timer';
}

export const TimeEntryForm: React.FC<TimeEntryFormProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
  mode = 'create',
}) => {
  const { data: projects = [] } = useProjects();
  const { data: tags = [] } = useTags();
  const { data: teams = [] } = useTeams();

  const { control, handleSubmit, reset, watch, setValue } = useForm<Partial<TimeEntry>>({
    defaultValues: {
      description: '',
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      projectId: undefined,
      tagIds: [],
      teamIds: [],
      isBillable: false,
      ...initialData,
    },
  });

  const startTime = watch('startTime');
  const endTime = watch('endTime');

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        startTime: initialData.startTime ? parseISO(initialData.startTime) : new Date(),
        endTime: initialData.endTime ? parseISO(initialData.endTime) : new Date(),
      });
    }
  }, [initialData, reset]);

  // Group projects by client
  const projectsByClient = projects.reduce((acc: Record<number, Project[]>, project) => {
    const clientId = project.clientId || 0;
    if (!acc[clientId]) acc[clientId] = [];
    acc[clientId].push(project);
    return acc;
  }, {});

  const handleFormSubmit = (data: Partial<TimeEntry>) => {
    const submitData = {
      ...data,
      startTime: data.startTime instanceof Date ? data.startTime.toISOString() : data.startTime,
      endTime: data.endTime instanceof Date ? data.endTime.toISOString() : data.endTime,
    };
    onSubmit(submitData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>
          {mode === 'timer' ? 'Start Timer' : mode === 'edit' ? 'Edit Time Entry' : 'New Time Entry'}
        </DialogTitle>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Controller
                  name="description"
                  control={control}
                  rules={{ required: 'Description is required' }}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Description"
                      fullWidth
                      multiline
                      rows={3}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />
              </Grid>

              {mode !== 'timer' && (
                <>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Date"
                          type="date"
                          fullWidth
                          InputLabelProps={{ shrink: true }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="startTime"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          label="Start Time"
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="endTime"
                      control={control}
                      render={({ field }) => (
                        <DateTimePicker
                          {...field}
                          label="End Time"
                          slotProps={{ textField: { fullWidth: true } }}
                        />
                      )}
                    />
                  </Grid>
                </>
              )}

              <Grid item xs={12} md={6}>
                <Controller
                  name="projectId"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel>Project</InputLabel>
                      <Select {...field} label="Project">
                        <MenuItem value={undefined}>None</MenuItem>
                        {Object.entries(projectsByClient).map(([clientId, clientProjects]) => {
                          const client = projects.find(p => p.clientId === Number(clientId))?.client;
                          return clientProjects.map((project) => (
                            <MenuItem key={project.id} value={project.id}>
                              {client ? `${client.name} - ` : ''}{project.name}
                            </MenuItem>
                          ));
                        })}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="tagIds"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={tags}
                      getOptionLabel={(option) => option.name}
                      value={tags.filter(t => field.value?.includes(t.id))}
                      onChange={(_, newValue) => field.onChange(newValue.map(t => t.id))}
                      renderInput={(params) => <TextField {...params} label="Tags" />}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip label={option.name} {...getTagProps({ index })} key={option.id} />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <Controller
                  name="teamIds"
                  control={control}
                  render={({ field }) => (
                    <Autocomplete
                      multiple
                      options={teams}
                      getOptionLabel={(option) => option.name}
                      value={teams.filter(t => field.value?.includes(t.id))}
                      onChange={(_, newValue) => field.onChange(newValue.map(t => t.id))}
                      renderInput={(params) => <TextField {...params} label="Teams" />}
                      renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                          <Chip 
                            label={option.name} 
                            {...getTagProps({ index })} 
                            key={option.id}
                            sx={{ bgcolor: option.color }}
                          />
                        ))
                      }
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12}>
                <Controller
                  name="isBillable"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={<Switch {...field} checked={field.value} />}
                      label="Billable"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="contained">
              {mode === 'timer' ? 'Start Timer' : mode === 'edit' ? 'Update' : 'Create'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </LocalizationProvider>
  );
};
