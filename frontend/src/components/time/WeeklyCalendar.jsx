import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Card,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { getWeekDates, formatTime, formatDuration } from '../../utils/formatters';

export const WeeklyCalendar = ({ entries = [], onEntryClick, onSlotClick }) => {
  const [currentWeek, setCurrentWeek] = useState(dayjs());
  const weekDates = getWeekDates(currentWeek);

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEntriesForDayAndHour = (date, hour) => {
    return entries.filter((entry) => {
      const entryStart = dayjs(entry.startTime);
      const entryEnd = dayjs(entry.endTime);
      const slotStart = date.hour(hour);
      const slotEnd = date.hour(hour + 1);
      
      return (
        entryStart.isSame(date, 'day') &&
        ((entryStart.hour() === hour) || 
         (entryStart.isBefore(slotStart) && entryEnd.isAfter(slotStart)))
      );
    });
  };

  const calculateEntryPosition = (entry, hour) => {
    const entryStart = dayjs(entry.startTime);
    const entryEnd = dayjs(entry.endTime);
    const hourStart = entryStart.hour(hour).minute(0);
    const hourEnd = entryStart.hour(hour + 1).minute(0);
    
    const startMinute = entryStart.hour() === hour ? entryStart.minute() : 0;
    const endMinute = entryEnd.hour() === hour ? entryEnd.minute() : 60;
    
    const top = (startMinute / 60) * 100;
    const height = ((endMinute - startMinute) / 60) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  return (
    <Box>
      {/* Week Navigation */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={() => setCurrentWeek(currentWeek.subtract(1, 'week'))}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600, minWidth: 200, textAlign: 'center' }}>
            {weekDates[0].format('MMM D')} - {weekDates[6].format('MMM D, YYYY')}
          </Typography>
          <IconButton onClick={() => setCurrentWeek(currentWeek.add(1, 'week'))}>
            <ChevronRight />
          </IconButton>
          <IconButton onClick={() => setCurrentWeek(dayjs())} size="small">
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Today
            </Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Calendar Grid */}
      <Paper sx={{ overflow: 'auto', maxHeight: '70vh' }}>
        <Box sx={{ display: 'flex', minWidth: 800 }}>
          {/* Time Column */}
          <Box sx={{ width: 60, flexShrink: 0, borderRight: 1, borderColor: 'divider' }}>
            <Box sx={{ height: 60, borderBottom: 1, borderColor: 'divider' }} />
            {hours.map((hour) => (
              <Box
                key={hour}
                sx={{
                  height: 60,
                  borderBottom: 1,
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  pt: 0.5,
                }}
              >
                <Typography variant="caption" color="text.secondary">
                  {hour}:00
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Day Columns */}
          {weekDates.map((date) => {
            const isToday = date.isSame(dayjs(), 'day');
            return (
              <Box
                key={date.format('YYYY-MM-DD')}
                sx={{
                  flex: 1,
                  borderRight: 1,
                  borderColor: 'divider',
                  '&:last-child': { borderRight: 0 },
                }}
              >
                {/* Day Header */}
                <Box
                  sx={{
                    height: 60,
                    borderBottom: 1,
                    borderColor: 'divider',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: isToday ? 'primary.light' : 'transparent',
                    color: isToday ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="caption">{date.format('ddd')}</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {date.format('D')}
                  </Typography>
                </Box>

                {/* Hour Slots */}
                {hours.map((hour) => {
                  const slotEntries = getEntriesForDayAndHour(date, hour);
                  
                  return (
                    <Box
                      key={hour}
                      sx={{
                        height: 60,
                        borderBottom: 1,
                        borderColor: 'divider',
                        position: 'relative',
                        cursor: 'pointer',
                        '&:hover': {
                          bgcolor: 'action.hover',
                        },
                      }}
                      onClick={() => onSlotClick && onSlotClick(date.hour(hour))}
                    >
                      {slotEntries.map((entry) => {
                        const position = calculateEntryPosition(entry, hour);
                        const duration = dayjs(entry.endTime).diff(dayjs(entry.startTime), 'second');
                        
                        return (
                          <Tooltip
                            key={entry.id}
                            title={
                              <Box>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                  {entry.description}
                                </Typography>
                                <Typography variant="caption">
                                  {formatTime(entry.startTime)} - {formatTime(entry.endTime)}
                                </Typography>
                                <Typography variant="caption" display="block">
                                  {formatDuration(duration)}
                                </Typography>
                                {entry.project && (
                                  <Typography variant="caption" display="block">
                                    {entry.project.name}
                                  </Typography>
                                )}
                              </Box>
                            }
                          >
                            <Card
                              onClick={(e) => {
                                e.stopPropagation();
                                onEntryClick && onEntryClick(entry);
                              }}
                              sx={{
                                position: 'absolute',
                                top: position.top,
                                height: position.height,
                                left: 4,
                                right: 4,
                                minHeight: 30,
                                bgcolor: entry.project?.color || 'primary.main',
                                color: 'white',
                                p: 0.5,
                                cursor: 'pointer',
                                overflow: 'hidden',
                                '&:hover': {
                                  boxShadow: 3,
                                },
                              }}
                            >
                              <Typography
                                variant="caption"
                                sx={{
                                  fontWeight: 600,
                                  display: 'block',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {entry.description}
                              </Typography>
                              {entry.project && (
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontSize: '0.65rem',
                                    opacity: 0.9,
                                  }}
                                >
                                  {entry.project.name}
                                </Typography>
                              )}
                            </Card>
                          </Tooltip>
                        );
                      })}
                    </Box>
                  );
                })}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
};
