import { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';
import { ProjectsTab } from '../components/manage/ProjectsTab';
import { ClientsTab } from '../components/manage/ClientsTab';
import { TeamsTab } from '../components/manage/TeamsTab';
import { TagsTab } from '../components/manage/TagsTab';

export const ManagePage = () => {
  const [currentTab, setCurrentTab] = useState(0);

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 700 }}>
        Manage
      </Typography>

      <Paper sx={{ mb: 2 }}>
        <Tabs value={currentTab} onChange={(_, newValue) => setCurrentTab(newValue)}>
          <Tab label="Projects" />
          <Tab label="Clients" />
          <Tab label="Teams" />
          <Tab label="Tags" />
        </Tabs>
      </Paper>

      <Box sx={{ mt: 3 }}>
        {currentTab === 0 && <ProjectsTab />}
        {currentTab === 1 && <ClientsTab />}
        {currentTab === 2 && <TeamsTab />}
        {currentTab === 3 && <TagsTab />}
      </Box>
    </Box>
  );
};
