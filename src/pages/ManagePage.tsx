// Manage page for CRUD operations

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
} from '@mui/icons-material';
import { useProjects, useCreateProject, useUpdateProject, useDeleteProject } from '../hooks/useProjects';
import { useClients, useCreateClient, useUpdateClient, useDeleteClient } from '../hooks/useClients';
import { useTags, useCreateTag, useUpdateTag, useDeleteTag } from '../hooks/useTags';
import { useTeams, useCreateTeam, useUpdateTeam, useDeleteTeam } from '../hooks/useTeams';
import type { Project, Client, Tag, Team } from '../types';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { ProjectDialog, ClientDialog, TagDialog, TeamDialog } from '../components/manage/ManageDialogs';
import type { Project, Client, Tag, Team } from '../types';

type TabValue = 'projects' | 'clients' | 'teams' | 'tags';

export const ManagePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabValue>('projects');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Project | Client | Tag | Team | null>(null);

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Manage
      </Typography>

      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Projects" value="projects" />
        <Tab label="Clients" value="clients" />
        <Tab label="Teams" value="teams" />
        <Tab label="Tags" value="tags" />
      </Tabs>

      {activeTab === 'projects' && (
        <ProjectsSection
          onEdit={(item) => {
            setEditingItem(item);
            setDialogOpen(true);
          }}
          onAdd={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        />
      )}
      {activeTab === 'clients' && (
        <ClientsSection
          onEdit={(item) => {
            setEditingItem(item);
            setDialogOpen(true);
          }}
          onAdd={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        />
      )}
      {activeTab === 'teams' && (
        <TeamsSection
          onEdit={(item) => {
            setEditingItem(item);
            setDialogOpen(true);
          }}
          onAdd={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        />
      )}
      {activeTab === 'tags' && (
        <TagsSection
          onEdit={(item) => {
            setEditingItem(item);
            setDialogOpen(true);
          }}
          onAdd={() => {
            setEditingItem(null);
            setDialogOpen(true);
          }}
        />
      )}

      {/* Dialogs */}
      {activeTab === 'projects' && (
        <ProjectDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingItem(null);
          }}
          project={editingItem as Project | null}
        />
      )}
      {activeTab === 'clients' && (
        <ClientDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingItem(null);
          }}
          client={editingItem as Client | null}
        />
      )}
      {activeTab === 'teams' && (
        <TeamDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingItem(null);
          }}
          team={editingItem as Team | null}
        />
      )}
      {activeTab === 'tags' && (
        <TagDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setEditingItem(null);
          }}
          tag={editingItem as Tag | null}
        />
      )}
    </Box>
  );
};

// Projects Section
const ProjectsSection: React.FC<{ onEdit: (item: Project) => void; onAdd: () => void }> = ({
  onEdit,
  onAdd,
}) => {
  const { data: projects = [], isLoading } = useProjects();
  const { data: clients = [] } = useClients();
  const { mutate: deleteProject } = useDeleteProject();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Add Project
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Billable</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>{project.name}</TableCell>
                <TableCell>{project.client?.name || '-'}</TableCell>
                <TableCell>{project.isBillable ? 'Yes' : 'No'}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(project)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteProject(project.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Clients Section
const ClientsSection: React.FC<{ onEdit: (item: Client) => void; onAdd: () => void }> = ({
  onEdit,
  onAdd,
}) => {
  const { data: clients = [], isLoading } = useClients();
  const { mutate: deleteClient } = useDeleteClient();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Add Client
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clients.map((client) => (
              <TableRow key={client.id}>
                <TableCell>{client.name}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(client)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteClient(client.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Teams Section
const TeamsSection: React.FC<{ onEdit: (item: Team) => void; onAdd: () => void }> = ({
  onEdit,
  onAdd,
}) => {
  const { data: teams = [], isLoading } = useTeams();
  const { mutate: deleteTeam } = useDeleteTeam();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Add Team
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Color</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teams.map((team) => (
              <TableRow key={team.id}>
                <TableCell>{team.name}</TableCell>
                <TableCell>
                  {team.color && (
                    <Chip
                      label={team.color}
                      sx={{ bgcolor: team.color, color: 'white' }}
                      size="small"
                    />
                  )}
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(team)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteTeam(team.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

// Tags Section
const TagsSection: React.FC<{ onEdit: (item: Tag) => void; onAdd: () => void }> = ({
  onEdit,
  onAdd,
}) => {
  const { data: tags = [], isLoading } = useTags();
  const { mutate: deleteTag } = useDeleteTag();

  if (isLoading) return <LoadingSpinner />;

  return (
    <>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <Button variant="contained" startIcon={<Add />} onClick={onAdd}>
          Add Tag
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>{tag.name}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => onEdit(tag)}>
                    <Edit />
                  </IconButton>
                  <IconButton size="small" onClick={() => deleteTag(tag.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};
