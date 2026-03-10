import React, { useState } from 'react';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, IconButton, Typography, Avatar, Menu, MenuItem,
  Divider, Chip, Tooltip, Badge, useTheme, useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, People, FolderOpen, Campaign,
  Settings, Logout, Person, School, ChevronLeft,
  AdminPanelSettings, SupervisorAccount, AccountCircle,
  NotificationsNone,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

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

  const handleLogout = () => { logout(); navigate('/login'); };

  const DrawerContent = () => (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Logo */}
      <Box sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Box sx={{
            p: 1, borderRadius: 2,
            background: 'rgba(255,255,255,0.15)',
            display: 'flex',
          }}>
            <School sx={{ color: '#fff', fontSize: 24 }} />
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={800} color="#fff" lineHeight={1.2}>
              Admin Dashboard
            </Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
              Management System
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* User info */}
      <Box sx={{ mx: 2, mb: 2, p: 2, borderRadius: 2, background: 'rgba(255,255,255,0.1)' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Avatar sx={{ bgcolor: roleMeta.color, width: 40, height: 40, fontSize: 16, fontWeight: 700 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" fontWeight={700} color="#fff" noWrap>
              {user?.name}
            </Typography>
            <Chip
              size="small"
              label={roleMeta.label}
              icon={React.cloneElement(roleMeta.icon, { style: { color: roleMeta.color, fontSize: 14 } })}
              sx={{
                height: 20, fontSize: '0.65rem', fontWeight: 700,
                bgcolor: 'rgba(255,255,255,0.15)', color: '#fff',
                '& .MuiChip-icon': { ml: '4px' },
              }}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 2, mb: 1 }} />

      {/* Nav */}
      <List sx={{ flex: 1, px: 1 }}>
        {navItems.map(item => {
          const active = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                onClick={() => { navigate(item.path); setMobileOpen(false); }}
                sx={{
                  borderRadius: 2,
                  bgcolor: active ? 'rgba(255,255,255,0.2)' : 'transparent',
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.12)' },
                  py: 1,
                }}
              >
                <ListItemIcon sx={{ minWidth: 36, color: active ? '#fff' : 'rgba(255,255,255,0.65)' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: '0.875rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
                  }}
                />
                {active && <Box sx={{ width: 4, height: 24, borderRadius: 2, bgcolor: '#fff' }} />}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Logout */}
      <Box sx={{ p: 2 }}>
        <ListItemButton
          onClick={handleLogout}
          sx={{
            borderRadius: 2, bgcolor: 'rgba(239,83,80,0.15)',
            '&:hover': { bgcolor: 'rgba(239,83,80,0.25)' },
          }}
        >
          <ListItemIcon sx={{ minWidth: 36 }}>
            <Logout sx={{ color: '#ef9a9a', fontSize: 20 }} />
          </ListItemIcon>
          <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.875rem', color: '#ef9a9a', fontWeight: 600 }} />
        </ListItemButton>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Desktop Drawer */}
      {!isMobile && (
        <Drawer variant="permanent" sx={{
          width: DRAWER_WIDTH, flexShrink: 0,
          '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', border: 'none' },
        }}>
          <DrawerContent />
        </Drawer>
      )}

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
        sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}
      >
        <DrawerContent />
      </Drawer>

      {/* Main content */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* AppBar */}
        <AppBar position="sticky" elevation={0} sx={{
          bgcolor: 'background.paper', borderBottom: '1px solid',
          borderColor: 'divider', color: 'text.primary',
        }}>
          <Toolbar>
            {isMobile && (
              <IconButton edge="start" onClick={() => setMobileOpen(true)} sx={{ mr: 1 }}>
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" fontWeight={700} sx={{ flex: 1, color: 'primary.dark' }}>
              {navItems.find(n => n.path === location.pathname)?.label || 'Dashboard'}
            </Typography>
            <Tooltip title="Notifications">
              <IconButton>
                <Badge badgeContent={3} color="error">
                  <NotificationsNone />
                </Badge>
              </IconButton>
            </Tooltip>
            <IconButton onClick={e => setAnchorEl(e.currentTarget)} sx={{ ml: 1 }}>
              <Avatar sx={{ bgcolor: roleMeta.color, width: 36, height: 36, fontSize: 14, fontWeight: 700 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
              <MenuItem disabled>
                <Box>
                  <Typography variant="body2" fontWeight={700}>{user?.name}</Typography>
                  <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
                </Box>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => { setAnchorEl(null); navigate(`/${user?.role}/profile`); }}>
                <Person fontSize="small" sx={{ mr: 1 }} /> Profile
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                <Logout fontSize="small" sx={{ mr: 1 }} /> Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>

        {/* Page Content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 }, overflow: 'auto' }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
