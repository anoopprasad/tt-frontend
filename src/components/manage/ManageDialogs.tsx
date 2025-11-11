// Dialog forms for manage page

import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { useCreateProject, useUpdateProject } from '../../hooks/useProjects';
import { useCreateClient, useUpdateClient } from '../../hooks/useClients';
import { useCreateTag, useUpdateTag } from '../../hooks/useTags';
import { useCreateTeam, useUpdateTeam } from '../../hooks/useTeams';
import { useClients } from '../../hooks/useClients';
import { useToast } from '../../hooks/useToast';
import type { Project, Client, Tag, Team } from '../../types';

interface ProjectDialogProps {
  open: boolean;
  onClose: () => void;
  project?: Project | null;
}

export const ProjectDialog: React.FC<ProjectDialogProps> = ({ open, onClose, project }) => {
  const { data: clients = [] } = useClients();
  const toast = useToast();
  const { mutate: createProject } = useCreateProject();
  const { mutate: updateProject } = useUpdateProject();

  const [name, setName] = useState('');
  const [clientId, setClientId] = useState<number | undefined>();
  const [isBillable, setIsBillable] = useState(false);

  useEffect(() => {
    if (project) {
      setName(project.name);
      setClientId(project.clientId);
      setIsBillable(project.isBillable);
    } else {
      setName('');
      setClientId(undefined);
      setIsBillable(false);
    }
  }, [project, open]);

  const handleSubmit = () => {
    const data = { name, clientId, isBillable };
    if (project) {
      updateProject(
        { id: project.id, ...data },
        {
          onSuccess: () => {
            toast.success('Project updated successfully');
            onClose();
          },
          onError: () => toast.error('Failed to update project'),
        }
      );
    } else {
      createProject(data, {
        onSuccess: () => {
          toast.success('Project created successfully');
          onClose();
        },
        onError: () => toast.error('Failed to create project'),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{project ? 'Edit Project' : 'New Project'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Client</InputLabel>
          <Select
            value={clientId || ''}
            label="Client"
            onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : undefined)}
          >
            <MenuItem value="">None</MenuItem>
            {clients.map((client) => (
              <MenuItem key={client.id} value={client.id}>
                {client.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={isBillable} onChange={(e) => setIsBillable(e.target.checked)} />}
          label="Billable"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {project ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface ClientDialogProps {
  open: boolean;
  onClose: () => void;
  client?: Client | null;
}

export const ClientDialog: React.FC<ClientDialogProps> = ({ open, onClose, client }) => {
  const toast = useToast();
  const { mutate: createClient } = useCreateClient();
  const { mutate: updateClient } = useUpdateClient();

  const [name, setName] = useState('');

  useEffect(() => {
    if (client) {
      setName(client.name);
    } else {
      setName('');
    }
  }, [client, open]);

  const handleSubmit = () => {
    const data = { name };
    if (client) {
      updateClient(
        { id: client.id, ...data },
        {
          onSuccess: () => {
            toast.success('Client updated successfully');
            onClose();
          },
          onError: () => toast.error('Failed to update client'),
        }
      );
    } else {
      createClient(data, {
        onSuccess: () => {
          toast.success('Client created successfully');
          onClose();
        },
        onError: () => toast.error('Failed to create client'),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{client ? 'Edit Client' : 'New Client'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {client ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface TagDialogProps {
  open: boolean;
  onClose: () => void;
  tag?: Tag | null;
}

export const TagDialog: React.FC<TagDialogProps> = ({ open, onClose, tag }) => {
  const toast = useToast();
  const { mutate: createTag } = useCreateTag();
  const { mutate: updateTag } = useUpdateTag();

  const [name, setName] = useState('');

  useEffect(() => {
    if (tag) {
      setName(tag.name);
    } else {
      setName('');
    }
  }, [tag, open]);

  const handleSubmit = () => {
    const data = { name };
    if (tag) {
      updateTag(
        { id: tag.id, ...data },
        {
          onSuccess: () => {
            toast.success('Tag updated successfully');
            onClose();
          },
          onError: () => toast.error('Failed to update tag'),
        }
      );
    } else {
      createTag(data, {
        onSuccess: () => {
          toast.success('Tag created successfully');
          onClose();
        },
        onError: () => toast.error('Failed to create tag'),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{tag ? 'Edit Tag' : 'New Tag'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {tag ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

interface TeamDialogProps {
  open: boolean;
  onClose: () => void;
  team?: Team | null;
}

export const TeamDialog: React.FC<TeamDialogProps> = ({ open, onClose, team }) => {
  const toast = useToast();
  const { mutate: createTeam } = useCreateTeam();
  const { mutate: updateTeam } = useUpdateTeam();

  const [name, setName] = useState('');
  const [color, setColor] = useState('#1976d2');

  useEffect(() => {
    if (team) {
      setName(team.name);
      setColor(team.color || '#1976d2');
    } else {
      setName('');
      setColor('#1976d2');
    }
  }, [team, open]);

  const handleSubmit = () => {
    const data = { name, color };
    if (team) {
      updateTeam(
        { id: team.id, ...data },
        {
          onSuccess: () => {
            toast.success('Team updated successfully');
            onClose();
          },
          onError: () => toast.error('Failed to update team'),
        }
      );
    } else {
      createTeam(data, {
        onSuccess: () => {
          toast.success('Team created successfully');
          onClose();
        },
        onError: () => toast.error('Failed to create team'),
      });
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{team ? 'Edit Team' : 'New Team'}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Color"
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {team ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
