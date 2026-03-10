import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress, Alert, LinearProgress, Chip } from '@mui/material';
import { FolderOpen, People, TrendingUp, CheckCircle } from '@mui/icons-material';
import { dashboardAPI, projectsAPI } from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <Card>
    <CardContent sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700} display="block" mb={1}>
            {title.toUpperCase()}
          </Typography>
          <Typography variant="h3" fontWeight={800} color={color}>{value ?? '—'}</Typography>
          {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
        </Box>
        <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${color}22` }}>
          {React.cloneElement(icon, { sx: { fontSize: 32, color } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export function ManagerDashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), projectsAPI.getAll()])
      .then(([s, p]) => { setStats(s.data); setProjects(p.data.slice(0, 6)); })
      .catch(() => setError('Failed to load dashboard'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  const chartData = [
    { name: 'My Projects', count: stats?.myProjects || 0 },
    { name: 'Active', count: stats?.activeProjects || 0 },
    { name: 'Completed', count: stats?.completedProjects || 0 },
    { name: 'Team Members', count: stats?.totalTeamMembers || 0 },
  ];

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} color="primary.dark" mb={3}>Manager Dashboard</Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="My Projects" value={stats?.myProjects} icon={<FolderOpen />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Active" value={stats?.activeProjects} icon={<TrendingUp />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Completed" value={stats?.completedProjects} icon={<CheckCircle />} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Team Members" value={stats?.totalTeamMembers} icon={<People />} color="#ff6f00" />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Overview</Typography>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[6,6,0,0]}>
                    {chartData.map((_, i) => <Cell key={i} fill={['#1a237e','#2e7d32','#0288d1','#ff6f00'][i]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={7}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight={700} mb={2}>Recent Projects</Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {projects.slice(0, 4).map(p => (
                  <Box key={p._id}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2" fontWeight={600}>{p.title}</Typography>
                      <Typography variant="caption" fontWeight={700}>{p.progress}%</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={p.progress || 0} sx={{ height: 6, borderRadius: 3 }} />
                  </Box>
                ))}
                {projects.length === 0 && <Typography color="text.secondary" variant="body2">No projects yet</Typography>}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}

export function ClientDashboard() {
  const [stats, setStats] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([dashboardAPI.getStats(), projectsAPI.getAll()])
      .then(([s, p]) => { setStats(s.data); setProjects(p.data); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Typography variant="h5" fontWeight={800} color="primary.dark" mb={3}>My Dashboard</Typography>
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Assigned Projects" value={stats?.assignedProjects} icon={<FolderOpen />} color="#1a237e" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Active" value={stats?.activeProjects} icon={<TrendingUp />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Completed" value={stats?.completedProjects} icon={<CheckCircle />} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title="Pending" value={stats?.pendingProjects} icon={<FolderOpen />} color="#ff6f00" />
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight={700} mb={2}>My Projects</Typography>
          {projects.length === 0 ? (
            <Typography color="text.secondary">No projects assigned yet</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {projects.map(p => (
                <Box key={p._id} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="subtitle2" fontWeight={700}>{p.title}</Typography>
                    <Chip size="small" label={p.status}
                      sx={{ bgcolor: p.status === 'active' ? '#e8f5e9' : '#e3f2fd', fontWeight: 700, fontSize: '0.7rem',
                        color: p.status === 'active' ? '#2e7d32' : '#0d47a1' }} />
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LinearProgress variant="determinate" value={p.progress || 0}
                      sx={{ flex: 1, height: 6, borderRadius: 3 }} />
                    <Typography variant="caption" fontWeight={700}>{p.progress}%</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
