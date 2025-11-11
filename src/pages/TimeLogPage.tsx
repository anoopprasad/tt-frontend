// Time Log page with weekly calendar

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  MoreVert,
} from '@mui/icons-material';
import { useTimeEntries, useCreateTimeEntry, useUpdateTimeEntry, useDeleteTimeEntry, useStopTimer } from '../hooks/useTimeEntries';
import { useTimerStore } from '../store/timerStore';
import { WeeklyCalendar } from '../components/time-entry/WeeklyCalendar';
import { TimeEntryForm } from '../components/time-entry/TimeEntryForm';
import type { TimeEntry } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { getWeekRange } from '../utils/date';

export const TimeLogPage: React.FC = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<'create' | 'edit' | 'timer'>('create');
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [menuEntry, setMenuEntry] = useState<TimeEntry | null>(null);

  const weekRange = getWeekRange();
  const { data: entries, isLoading } = useTimeEntries({
    startDate: weekRange.start.toISOString().split('T')[0],
    endDate: weekRange.end.toISOString().split('T')[0],
  });

  const { mutate: createEntry } = useCreateTimeEntry();
  const { mutate: updateEntry } = useUpdateTimeEntry();
  const { mutate: deleteEntry } = useDeleteTimeEntry();
  const { mutate: stopTimer } = useStopTimer();
  const { runningEntry, setRunningEntry, setStartTime, reset } = useTimerStore();

  const handleSlotClick = (date: Date, hour: number) => {
    const startTime = new Date(date);
    startTime.setHours(hour, 0, 0, 0);
    const endTime = new Date(startTime);
    endTime.setHours(hour + 1, 0, 0, 0);

    setSelectedEntry({
      date: date.toISOString().split('T')[0],
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
    } as TimeEntry);
    setFormMode('create');
    setFormOpen(true);
  };

  const handleEntryClick = (entry: TimeEntry) => {
    setSelectedEntry(entry);
    setFormMode('edit');
    setFormOpen(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, entry: TimeEntry) => {
    setAnchorEl(event.currentTarget);
    setMenuEntry(entry);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMenuEntry(null);
  };

  const handleEdit = () => {
    if (menuEntry) {
      setSelectedEntry(menuEntry);
      setFormMode('edit');
      setFormOpen(true);
    }
    handleMenuClose();
  };

  const handleDelete = () => {
    if (menuEntry) {
      deleteEntry(menuEntry.id);
    }
    handleMenuClose();
  };

  const handleFormSubmit = (data: Partial<TimeEntry>) => {
    if (formMode === 'edit' && selectedEntry?.id) {
      updateEntry(
        { id: selectedEntry.id, ...data },
        {
          onSuccess: () => {
            setFormOpen(false);
            setSelectedEntry(null);
          },
        }
      );
    } else if (formMode === 'timer') {
      createEntry(
        { ...data, startTime: new Date().toISOString() },
        {
          onSuccess: (newEntry) => {
            setRunningEntry(newEntry);
            setStartTime(new Date());
            setFormOpen(false);
            setSelectedEntry(null);
          },
        }
      );
    } else {
      createEntry(data, {
        onSuccess: () => {
          setFormOpen(false);
          setSelectedEntry(null);
        },
      });
    }
  };

  const handleStartTimer = () => {
    setSelectedEntry(null);
    setFormMode('timer');
    setFormOpen(true);
  };

  const handleStopTimerClick = () => {
    if (runningEntry) {
      stopTimer(runningEntry.id, {
        onSuccess: () => {
          reset();
        },
      });
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Time Log</Typography>
        {runningEntry ? (
          <Button variant="contained" color="error" onClick={handleStopTimerClick}>
            Stop Timer
          </Button>
        ) : (
          <Button variant="contained" startIcon={<Add />} onClick={handleStartTimer}>
            Start Timer
          </Button>
        )}
      </Box>

      <WeeklyCalendar
        entries={entries || []}
        onSlotClick={handleSlotClick}
        onEntryClick={handleEntryClick}
        runningEntryId={runningEntry?.id}
      />

      <TimeEntryForm
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedEntry(null);
        }}
        onSubmit={handleFormSubmit}
        initialData={selectedEntry || undefined}
        mode={formMode}
      />

      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};
