import { useState } from 'react'
import { Box, Typography, Tabs, Tab, Paper } from '@mui/material'
import ProjectsTab from './ProjectsTab'
import ClientsTab from './ClientsTab'
import TeamsTab from './TeamsTab'
import TagsTab from './TagsTab'

const Manage = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
        Manage
      </Typography>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, value) => setActiveTab(value)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Projects" />
          <Tab label="Clients" />
          <Tab label="Teams" />
          <Tab label="Tags" />
        </Tabs>
      </Paper>

      <Box sx={{ py: 2 }}>
        {activeTab === 0 && <ProjectsTab />}
        {activeTab === 1 && <ClientsTab />}
        {activeTab === 2 && <TeamsTab />}
        {activeTab === 3 && <TagsTab />}
      </Box>
    </Box>
  )
}

export default Manage
