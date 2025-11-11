import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from '@mui/material';
import { useTimerStore } from '../../store/timerStore';
import { timeEntriesAPI } from '../../api/timeEntries';
import { useSnackbar } from 'notistack';
import { ProjectSelect } from '../common/ProjectSelect';

export const TimerDialog = ({ open, onClose }) => {
  const { runningEntry, startTimer, stopTimer } = useTimerStore();
  const { enqueueSnackbar } = useSnackbar();
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    if (!description.trim()) {
      enqueueSnackbar('Please enter a description', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const response = await timeEntriesAPI.create({
        description,
        projectId,
        startTime: new Date().toISOString(),
      });

      if (response.data) {
        startTimer({
          ...response.data,
          startTime: new Date().toISOString(),
        });
        enqueueSnackbar('Timer started', { variant: 'success' });
        setDescription('');
        setProjectId(null);
        onClose();
      }
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to start timer', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    if (!runningEntry) return;

    setIsLoading(true);
    try {
      await timeEntriesAPI.stop(runningEntry.id);
      stopTimer();
      enqueueSnackbar('Timer stopped', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar(error.response?.data?.error?.message || 'Failed to stop timer', {
        variant: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{runningEntry ? 'Stop Timer' : 'Start Timer'}</DialogTitle>
      <DialogContent>
        {runningEntry ? (
          <Box>
            <TextField
              fullWidth
              label="Description"
              value={runningEntry.description}
              disabled
              margin="normal"
            />
            <ProjectSelect
              value={runningEntry.projectId}
              onChange={() => {}}
              disabled
            />
          </Box>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="What are you working on?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              margin="normal"
              autoFocus
              multiline
              rows={2}
            />
            <ProjectSelect
              value={projectId}
              onChange={setProjectId}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        {runningEntry ? (
          <Button onClick={handleStop} variant="contained" color="error" disabled={isLoading}>
            Stop Timer
          </Button>
        ) : (
          <Button onClick={handleStart} variant="contained" disabled={isLoading}>
            Start Timer
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
