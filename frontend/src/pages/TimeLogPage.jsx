import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Box, Typography, Button, Fab } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import { timeEntriesAPI } from '../api/timeEntries';
import { WeeklyCalendar } from '../components/time/WeeklyCalendar';
import { TimeEntryForm } from '../components/time/TimeEntryForm';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ErrorMessage } from '../components/common/ErrorMessage';

export const TimeLogPage = () => {
  const queryClient = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();
  const [formOpen, setFormOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [defaultDate, setDefaultDate] = useState(null);

  const { data: entriesData, isLoading, error } = useQuery({
    queryKey: ['time-entries'],
    queryFn: () => timeEntriesAPI.list(),
  });

  const createMutation = useMutation({
    mutationFn: timeEntriesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['time-entries']);
      enqueueSnackbar('Time entry created', { variant: 'success' });
      setFormOpen(false);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to create entry', {
        variant: 'error',
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => timeEntriesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['time-entries']);
      enqueueSnackbar('Time entry updated', { variant: 'success' });
      setFormOpen(false);
      setSelectedEntry(null);
    },
    onError: (error) => {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to update entry', {
        variant: 'error',
      });
    },
  });

  const handleEntryClick = (entry) => {
    setSelectedEntry(entry);
    setFormOpen(true);
  };

  const handleSlotClick = (date) => {
    setDefaultDate(date);
    setSelectedEntry(null);
    setFormOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (selectedEntry) {
      updateMutation.mutate({ id: selectedEntry.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleFormClose = () => {
    setFormOpen(false);
    setSelectedEntry(null);
    setDefaultDate(null);
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading time entries..." />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load time entries" />;
  }

  const entries = entriesData?.data || [];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Time Log
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setSelectedEntry(null);
            setDefaultDate(null);
            setFormOpen(true);
          }}
        >
          New Entry
        </Button>
      </Box>

      <WeeklyCalendar
        entries={entries}
        onEntryClick={handleEntryClick}
        onSlotClick={handleSlotClick}
      />

      <TimeEntryForm
        open={formOpen}
        onClose={handleFormClose}
        onSubmit={handleFormSubmit}
        entry={selectedEntry}
        defaultDate={defaultDate}
      />
    </Box>
  );
};
