// Weekly calendar component

import React from 'react';
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import { getWeekRange, getNextWeek, getPreviousWeek, formatDate, formatTime } from '../../utils/date';
import { format, eachHourOfInterval, startOfDay, addDays } from 'date-fns';
import type { TimeEntry } from '../../types';

interface WeeklyCalendarProps {
  entries: TimeEntry[];
  onSlotClick: (date: Date, hour: number) => void;
  onEntryClick: (entry: TimeEntry) => void;
  runningEntryId?: number;
}

const hours = Array.from({ length: 24 }, (_, i) => i);
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({
  entries,
  onSlotClick,
  onEntryClick,
  runningEntryId,
}) => {
  const [currentWeek, setCurrentWeek] = React.useState(new Date());
  const weekRange = getWeekRange(currentWeek);

  const handlePreviousWeek = () => {
    setCurrentWeek(getPreviousWeek(currentWeek));
  };

  const handleNextWeek = () => {
    setCurrentWeek(getNextWeek(currentWeek));
  };

  const getWeekDays = () => {
    const start = weekRange.start;
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  };

  const getEntriesForSlot = (date: Date, hour: number) => {
    const slotStart = new Date(date);
    slotStart.setHours(hour, 0, 0, 0);
    const slotEnd = new Date(slotStart);
    slotEnd.setHours(hour + 1, 0, 0, 0);

    return entries.filter((entry) => {
      const entryStart = new Date(entry.startTime);
      const entryEnd = entry.endTime ? new Date(entry.endTime) : new Date(); // Running timer
      
      return (
        entryStart.toDateString() === date.toDateString() &&
        entryStart.getHours() <= hour &&
        (entryEnd.getHours() > hour || (entryEnd.getHours() === hour && entryEnd.getMinutes() > 0))
      );
    });
  };

  const getEntryPosition = (entry: TimeEntry, hour: number) => {
    const entryStart = new Date(entry.startTime);
    const entryEnd = entry.endTime ? new Date(entry.endTime) : new Date();
    
    const startMinutes = entryStart.getHours() === hour ? entryStart.getMinutes() : 0;
    const endMinutes = entryEnd.getHours() === hour ? entryEnd.getMinutes() : 60;
    
    const top = (startMinutes / 60) * 100;
    const height = ((endMinutes - startMinutes) / 60) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  const weekDays = getWeekDays();

  return (
    <Paper sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <IconButton onClick={handlePreviousWeek}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="h6">
          {format(weekRange.start, 'MMM d')} - {format(weekRange.end, 'MMM d, yyyy')}
        </Typography>
        <IconButton onClick={handleNextWeek}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ overflowX: 'auto' }}>
        <Box sx={{ display: 'flex', minWidth: '800px' }}>
          {/* Hour labels */}
          <Box sx={{ width: 60, flexShrink: 0 }}>
            <Box sx={{ height: 40 }} /> {/* Header space */}
            {hours.map((hour) => (
              <Box
                key={hour}
                sx={{
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  pr: 1,
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {format(new Date().setHours(hour, 0), 'HH:mm')}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day columns */}
          {weekDays.map((day, dayIndex) => (
            <Box key={dayIndex} sx={{ flex: 1, minWidth: 100 }}>
              {/* Day header */}
              <Box
                sx={{
                  height: 40,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderBottom: '2px solid',
                  borderColor: 'primary.main',
                  bgcolor: 'primary.light',
                  color: 'primary.contrastText',
                }}
              >
                <Typography variant="caption" fontWeight="bold">
                  {days[dayIndex]}
                </Typography>
                <Typography variant="caption">
                  {format(day, 'MMM d')}
                </Typography>
              </Box>

              {/* Hour slots */}
              {hours.map((hour) => {
                const slotEntries = getEntriesForSlot(day, hour);
                return (
                  <Box
                    key={hour}
                    onClick={() => onSlotClick(day, hour)}
                    sx={{
                      height: 60,
                      position: 'relative',
                      borderBottom: '1px solid',
                      borderRight: '1px solid',
                      borderColor: 'divider',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    {slotEntries.map((entry) => (
                      <Tooltip
                        key={entry.id}
                        title={`${entry.description} - ${formatTime(entry.startTime)}`}
                        arrow
                      >
                        <Box
                          onClick={(e) => {
                            e.stopPropagation();
                            onEntryClick(entry);
                          }}
                          sx={{
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            ...getEntryPosition(entry, hour),
                            bgcolor: entry.id === runningEntryId ? 'error.main' : 'primary.main',
                            color: 'white',
                            p: 0.5,
                            borderRadius: 0.5,
                            fontSize: '0.75rem',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            '&:hover': {
                              opacity: 0.9,
                            },
                          }}
                        >
                          <Typography
                            variant="caption"
                            sx={{
                              display: 'block',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {entry.description}
                          </Typography>
                          {entry.project && (
                            <Typography variant="caption" sx={{ opacity: 0.9 }}>
                              {entry.project.name}
                            </Typography>
                          )}
                        </Box>
                      </Tooltip>
                    ))}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  );
};
