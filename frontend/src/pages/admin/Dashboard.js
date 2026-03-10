import React, { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Box, Chip,
  LinearProgress, Avatar, List, ListItem, ListItemAvatar,
  ListItemText, Divider, CircularProgress, Alert,
} from '@mui/material';
import {
  People, FolderOpen, CheckCircle, TrendingUp,
  Campaign, SupervisorAccount, PersonOutline,
} from '@mui/icons-material';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { dashboardAPI, usersAPI, projectsAPI } from '../../services/api';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="body2" color="text.secondary" fontWeight={600} mb={1}>
            {title.toUpperCase()}
          </Typography>
          <Typography variant="h3" fontWeight={800} color={color}>
            {value ?? '—'}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          )}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}22` }}>
          {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const COLORS = ['#1a237e', '#ff6f00', '#2e7d32', '#d32f2f', '#0288d1'];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), usersAPI.getAll(), projectsAPI.getAll()])
      .then(([s, u, p]) => {
        setStats(s.data);
        setUsers(u.data.slice(0, 5));
        setProjects(p.data.slice(0, 5));
      })
      .catch(err => setError(err.response?.data?.message || 'Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress size={48} /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const roleChartData = stats?.usersByRole?.map(r => ({ name: r._id, value: r.count })) || [];
  const statusChartData = stats?.projectsByStatus?.map(s => ({
    name: s._id.charAt(0).toUpperCase() + s._id.slice(1), count: s.count
  })) || [];

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} color="primary.dark" mb={3}>
        Admin Overview
      </Typography>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Users" value={stats?.totalUsers} icon={<People />} color="#1a237e" subtitle="All registered users" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Total Projects" value={stats?.totalProjects} icon={<FolderOpen />} color="#ff6f00" subtitle="All projects" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Active Projects" value={stats?.activeProjects} icon={<TrendingUp />} color="#2e7d32" subtitle="Currently in progress" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Completed" value={stats?.completedProjects} icon={<CheckCircle />} color="#0288d1" subtitle="Finished projects" />
        </Grid>
      </Grid>

      <Grid container spacing={3} mb={3}>
        {/* Users by Role Pie */}
        <Grid item xs={12} md={5}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Users by Role</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={roleChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, value }) => `${name}: ${value}`}>
                    {roleChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Projects by Status Bar */}
        <Grid item xs={12} md={7}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Projects by Status</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusChartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#1a237e" radius={[6, 6, 0, 0]}>
                    {statusChartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Users */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Recent Users</Typography>
              <List disablePadding>
                {users.map((u, i) => (
                  <React.Fragment key={u._id}>
                    <ListItem disablePadding sx={{ py: 1 }}>
                      <ListItemAvatar>
                        <Avatar sx={{
                          bgcolor: u.role === 'admin' ? '#1a237e' : u.role === 'manager' ? '#2e7d32' : '#0288d1',
                          width: 36, height: 36, fontSize: 14,
                        }}>
                          {u.name.charAt(0)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={u.name}
                        secondary={u.email}
                        primaryTypographyProps={{ fontWeight: 600, fontSize: '0.875rem' }}
                        secondaryTypographyProps={{ fontSize: '0.75rem' }}
                      />
                      <Chip label={u.role} size="small" sx={{
                        bgcolor: u.role === 'admin' ? '#e8eaf6' : u.role === 'manager' ? '#e8f5e9' : '#e3f2fd',
                        color: u.role === 'admin' ? '#1a237e' : u.role === 'manager' ? '#2e7d32' : '#0d47a1',
                        fontWeight: 700, fontSize: '0.7rem',
                      }} />
                    </ListItem>
                    {i < users.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Projects */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Recent Projects</Typography>
              <List disablePadding>
                {projects.map((p, i) => (
                  <React.Fragment key={p._id}>
                    <ListItem disablePadding sx={{ py: 1, flexDirection: 'column', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 0.5 }}>
                        <Typography variant="body2" fontWeight={700}>{p.title}</Typography>
                        <Chip
                          size="small"
                          label={p.status}
                          sx={{
                            bgcolor: p.status === 'active' ? '#e8f5e9' : p.status === 'completed' ? '#e3f2fd' : p.status === 'on-hold' ? '#fff3e0' : '#f3e5f5',
                            color: p.status === 'active' ? '#2e7d32' : p.status === 'completed' ? '#0d47a1' : p.status === 'on-hold' ? '#e65100' : '#6a1b9a',
                            fontWeight: 700, fontSize: '0.7rem',
                          }}
                        />
                      </Box>
                      <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LinearProgress
                          variant="determinate"
                          value={p.progress || 0}
                          sx={{ flex: 1, height: 6, borderRadius: 3, bgcolor: '#e0e0e0',
                            '& .MuiLinearProgress-bar': { borderRadius: 3 } }}
                        />
                        <Typography variant="caption" color="text.secondary">{p.progress || 0}%</Typography>
                      </Box>
                    </ListItem>
                    {i < projects.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
