import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
  Chip,
  Autocomplete,
} from '@mui/material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useQuery } from '@tanstack/react-query';
import { ProjectSelect } from '../common/ProjectSelect';
import { tagsAPI } from '../../api/tags';
import { teamsAPI } from '../../api/teams';

export const TimeEntryForm = ({ open, onClose, onSubmit, entry = null, defaultDate = null }) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(dayjs());
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs().add(1, 'hour'));
  const [projectId, setProjectId] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTeams, setSelectedTeams] = useState([]);
  const [isBillable, setIsBillable] = useState(true);

  const { data: tagsData } = useQuery({
    queryKey: ['tags'],
    queryFn: tagsAPI.list,
  });

  const { data: teamsData } = useQuery({
    queryKey: ['teams'],
    queryFn: teamsAPI.list,
  });

  const tags = tagsData?.data || [];
  const teams = teamsData?.data || [];

  useEffect(() => {
    if (entry) {
      setDescription(entry.description || '');
      setDate(dayjs(entry.startTime));
      setStartTime(dayjs(entry.startTime));
      setEndTime(entry.endTime ? dayjs(entry.endTime) : dayjs());
      setProjectId(entry.projectId);
      setSelectedTags(entry.tags || []);
      setSelectedTeams(entry.teams || []);
      setIsBillable(entry.isBillable ?? true);
    } else if (defaultDate) {
      setDate(dayjs(defaultDate));
      setStartTime(dayjs(defaultDate));
      setEndTime(dayjs(defaultDate).add(1, 'hour'));
    }
  }, [entry, defaultDate]);

  const handleSubmit = () => {
    const startDateTime = date
      .hour(startTime.hour())
      .minute(startTime.minute())
      .second(0);
    const endDateTime = date
      .hour(endTime.hour())
      .minute(endTime.minute())
      .second(0);

    onSubmit({
      description,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      projectId,
      tagIds: selectedTags.map((t) => t.id),
      teamIds: selectedTeams.map((t) => t.id),
      isBillable,
    });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>{entry ? 'Edit Time Entry' : 'New Time Entry'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              multiline
              rows={2}
              required
            />

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <DatePicker
                label="Date"
                value={date}
                onChange={setDate}
                sx={{ flex: 1 }}
              />
              <TimePicker
                label="Start Time"
                value={startTime}
                onChange={setStartTime}
                sx={{ flex: 1 }}
              />
              <TimePicker
                label="End Time"
                value={endTime}
                onChange={setEndTime}
                sx={{ flex: 1 }}
              />
            </Box>

            <ProjectSelect value={projectId} onChange={setProjectId} />

            <Autocomplete
              multiple
              options={tags}
              getOptionLabel={(option) => option.name}
              value={selectedTags}
              onChange={(_, newValue) => setSelectedTags(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Tags" margin="normal" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip label={option.name} {...getTagProps({ index })} size="small" />
                ))
              }
            />

            <Autocomplete
              multiple
              options={teams}
              getOptionLabel={(option) => option.name}
              value={selectedTeams}
              onChange={(_, newValue) => setSelectedTeams(newValue)}
              renderInput={(params) => (
                <TextField {...params} label="Teams" margin="normal" />
              )}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    label={option.name}
                    {...getTagProps({ index })}
                    size="small"
                    sx={{ bgcolor: option.color }}
                  />
                ))
              }
            />

            <FormControlLabel
              control={
                <Switch checked={isBillable} onChange={(e) => setIsBillable(e.target.checked)} />
              }
              label="Billable"
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {entry ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
