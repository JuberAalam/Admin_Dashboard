import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, IconButton, Typography, Avatar, Menu, MenuItem,
  Divider, Chip, Tooltip, useTheme, useMediaQuery
} from '@mui/material';

import {
  Menu as MenuIcon, Dashboard, People, FolderOpen, Campaign,
  Settings, Logout, Person, School,
  AdminPanelSettings, SupervisorAccount, AccountCircle
} from '@mui/icons-material';

import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ✅ IMPORT NOTIFICATION BELL
import NotificationBell from './NotificationBell';

const DRAWER_WIDTH = 260;

const NAV_ITEMS = {
  admin: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/admin' },
    { label: 'User Management', icon: <People />, path: '/admin/users' },
    { label: 'Projects', icon: <FolderOpen />, path: '/admin/projects' },
    { label: 'Announcements', icon: <Campaign />, path: '/admin/announcements' },
    { label: 'Settings', icon: <Settings />, path: '/admin/settings' },
  ],
  manager: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/manager' },
    { label: 'Team', icon: <People />, path: '/manager/team' },
    { label: 'Projects', icon: <FolderOpen />, path: '/manager/projects' },
    { label: 'Announcements', icon: <Campaign />, path: '/manager/announcements' },
    { label: 'Profile', icon: <Person />, path: '/manager/profile' },
  ],
  client: [
    { label: 'Dashboard', icon: <Dashboard />, path: '/client' },
    { label: 'My Projects', icon: <FolderOpen />, path: '/client/projects' },
    { label: 'Announcements', icon: <Campaign />, path: '/client/announcements' },
    { label: 'Profile', icon: <Person />, path: '/client/profile' },
  ],
};

const ROLE_META = {
  admin: { label: 'Administrator', icon: <AdminPanelSettings />, color: '#ef5350' },
  manager: { label: 'Manager', icon: <SupervisorAccount />, color: '#66bb6a' },
  client: { label: 'Client', icon: <AccountCircle />, color: '#42a5f5' },
};

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const navItems = NAV_ITEMS[user?.role] || [];
  const roleMeta = ROLE_META[user?.role] || {};

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3 }}>
        <Typography variant="h6" color="#fff" fontWeight={800}>
          Admin Dashboard
        </Typography>
      </Box>

      {/* User Info */}
      <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar sx={{ bgcolor: roleMeta.color }}>
            {user?.name?.charAt(0)}
          </Avatar>
          <Box>
            <Typography color="#fff">{user?.name}</Typography>
            <Chip label={roleMeta.label} size="small" />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

      {/* Nav Items */}
      <List sx={{ flex: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;

          return (
            <ListItem key={item.label} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                }}
              >
                <ListItemIcon sx={{ color: '#fff' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} sx={{ color: '#fff' }} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton onClick={handleLogout}>
          <ListItemIcon>
            <Logout sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Logout" sx={{ color: '#fff' }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer
          variant="permanent"
          sx={{
            width: DRAWER_WIDTH,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              background: '#1e293b',
              color: '#fff',
            },
          }}
        >
          <DrawerContent />
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      >
        <DrawerContent />
      </Drawer>

      {/* Main */}
      <Box sx={{ flex: 1 }}>
        {/* AppBar */}
        <AppBar position="static" sx={{ bgcolor: '#fff', color: '#000' }}>
          <Toolbar>
            {isMobile && (
              <IconButton onClick={() => setMobileOpen(true)}>
                <MenuIcon />
              </IconButton>
            )}

            <Typography sx={{ flex: 1, fontWeight: 700 }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </Typography>

            {/* ✅ NOTIFICATION BELL */}
            <NotificationBell />

            {/* Profile */}
            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar sx={{ bgcolor: roleMeta.color }}>
                {user?.name?.charAt(0)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem disabled>
                {user?.name}
              </MenuItem>
              <MenuItem onClick={() => navigate(`/${user?.role}/profile`)}>
                <Person fontSize="small" sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}