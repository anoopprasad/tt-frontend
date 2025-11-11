// Sidebar navigation component

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
} from '@mui/material';
import {
  Dashboard,
  CalendarToday,
  Assessment,
  Settings,
} from '@mui/icons-material';
import { useUIStore } from '../../store/uiStore';

const drawerWidth = 240;

interface SidebarProps {
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
  { text: 'Time Log', icon: <CalendarToday />, path: '/time-log' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
  { text: 'Manage', icon: <Settings />, path: '/manage' },
];

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onMobileClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { sidebarOpen } = useUIStore();

  const handleNavigation = (path: string) => {
    navigate(path);
    onMobileClose();
  };

  const drawer = (
    <>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleNavigation(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>
      
      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: sidebarOpen ? drawerWidth : 0,
            transition: 'width 0.3s',
            overflowX: 'hidden',
          },
        }}
        open={sidebarOpen}
      >
        {drawer}
      </Drawer>
    </>
  );
};
