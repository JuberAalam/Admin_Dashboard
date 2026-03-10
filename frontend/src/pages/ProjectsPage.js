import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Chip, IconButton, Tooltip, Alert, CircularProgress,
  Grid, LinearProgress, Avatar, AvatarGroup,
} from '@mui/material';
import { Add, Edit, Delete, FolderOpen } from '@mui/icons-material';
import { projectsAPI, usersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STATUS_META = {
  planning: { color: '#7b1fa2', bg: '#f3e5f5', label: 'Planning' },
  active: { color: '#2e7d32', bg: '#e8f5e9', label: 'Active' },
  'on-hold': { color: '#e65100', bg: '#fff3e0', label: 'On Hold' },
  completed: { color: '#0d47a1', bg: '#e3f2fd', label: 'Completed' },
};

const PRIORITY_META = {
  low: { color: '#2e7d32', label: 'Low' },
  medium: { color: '#ff6f00', label: 'Medium' },
  high: { color: '#d32f2f', label: 'High' },
};

const emptyForm = { title: '', description: '', status: 'planning', priority: 'medium', progress: 0, deadline: '', department: '', budget: 0, assignedTo: [] };

export default function ProjectsPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'admin' || user?.role === 'manager';
  const [projects, setProjects] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialog, setDialog] = useState({ open: false, mode: 'create', project: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const [pRes, uRes] = await Promise.all([projectsAPI.getAll(), canEdit ? usersAPI.getAll() : Promise.resolve({ data: [] })]);
      setProjects(pRes.data);
      setAllUsers(uRes.data);
    } catch (err) {
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setForm(emptyForm); setDialog({ open: true, mode: 'create' }); };
  const openEdit = (p) => {
    setForm({
      title: p.title, description: p.description, status: p.status,
      priority: p.priority, progress: p.progress, deadline: p.deadline ? p.deadline.slice(0, 10) : '',
      department: p.department || '', budget: p.budget || 0,
      assignedTo: p.assignedTo?.map(u => u._id) || [],
    });
    setDialog({ open: true, mode: 'edit', project: p });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      if (dialog.mode === 'create') await projectsAPI.create(form);
      else await projectsAPI.update(dialog.project._id, form);
      setSuccess(dialog.mode === 'create' ? 'Project created!' : 'Project updated!');
      setDialog({ open: false });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    try {
      await projectsAPI.delete(id);
      setSuccess('Project deleted');
      load();
    } catch (err) {
      setError('Delete failed');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary.dark">
          {user?.role === 'client' ? 'My Projects' : 'Projects'}
        </Typography>
        {canEdit && <Button variant="contained" startIcon={<Add />} onClick={openCreate}>New Project</Button>}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {projects.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <FolderOpen sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography color="text.secondary">No projects found</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {projects.map(p => {
            const sm = STATUS_META[p.status] || {};
            const pm = PRIORITY_META[p.priority] || {};
            return (
              <Grid item xs={12} sm={6} lg={4} key={p._id}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardContent sx={{ flex: 1, p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                      <Chip size="small" label={sm.label} sx={{ bgcolor: sm.bg, color: sm.color, fontWeight: 700 }} />
                      <Chip size="small" label={pm.label} variant="outlined" sx={{ borderColor: pm.color, color: pm.color, fontWeight: 700 }} />
                    </Box>
                    <Typography variant="h6" fontWeight={700} mb={1}>{p.title}</Typography>
                    <Typography variant="body2" color="text.secondary" mb={2} sx={{ minHeight: 40, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {p.description || 'No description'}
                    </Typography>

                    <Box mb={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" color="text.secondary">Progress</Typography>
                        <Typography variant="caption" fontWeight={700}>{p.progress}%</Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate" value={p.progress || 0}
                        sx={{ height: 8, borderRadius: 4, bgcolor: '#e0e0e0',
                          '& .MuiLinearProgress-bar': { borderRadius: 4, bgcolor: sm.color } }}
                      />
                    </Box>

                    {p.deadline && (
                      <Typography variant="caption" color="text.secondary">
                        📅 Deadline: {new Date(p.deadline).toLocaleDateString()}
                      </Typography>
                    )}

                    {p.assignedTo?.length > 0 && (
                      <Box sx={{ mt: 1.5 }}>
                        <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 28, height: 28, fontSize: 12 } }}>
                          {p.assignedTo.map(u => (
                            <Tooltip key={u._id} title={u.name}>
                              <Avatar sx={{ bgcolor: '#1a237e' }}>{u.name?.charAt(0)}</Avatar>
                            </Tooltip>
                          ))}
                        </AvatarGroup>
                      </Box>
                    )}
                  </CardContent>

                  {canEdit && (
                    <Box sx={{ px: 2, pb: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(p)}>
                          <Edit fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {user?.role === 'admin' && (
                        <Tooltip title="Delete">
                          <IconButton size="small" color="error" onClick={() => handleDelete(p._id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </Box>
                  )}
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{dialog.mode === 'create' ? 'Create Project' : 'Edit Project'}</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth required />
            <TextField label="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select value={form.status} label="Status" onChange={e => setForm({ ...form, status: e.target.value })}>
                    {Object.keys(STATUS_META).map(s => <MenuItem key={s} value={s}>{STATUS_META[s].label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Priority</InputLabel>
                  <Select value={form.priority} label="Priority" onChange={e => setForm({ ...form, priority: e.target.value })}>
                    {Object.keys(PRIORITY_META).map(p => <MenuItem key={p} value={p}>{PRIORITY_META[p].label}</MenuItem>)}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <TextField label="Progress (%)" type="number" value={form.progress} onChange={e => setForm({ ...form, progress: Math.min(100, Math.max(0, Number(e.target.value))) })} fullWidth inputProps={{ min: 0, max: 100 }} />
            <TextField label="Deadline" type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} fullWidth InputLabelProps={{ shrink: true }} />
            <TextField label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} fullWidth />
            <TextField label="Budget ($)" type="number" value={form.budget} onChange={e => setForm({ ...form, budget: Number(e.target.value) })} fullWidth />
            {allUsers.length > 0 && (
              <FormControl fullWidth>
                <InputLabel>Assign To</InputLabel>
                <Select multiple value={form.assignedTo} label="Assign To" onChange={e => setForm({ ...form, assignedTo: e.target.value })}
                  renderValue={selected => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map(id => {
                        const u = allUsers.find(u => u._id === id);
                        return <Chip key={id} label={u?.name} size="small" />;
                      })}
                    </Box>
                  )}
                >
                  {allUsers.map(u => <MenuItem key={u._id} value={u._id}>{u.name} ({u.role})</MenuItem>)}
                </Select>
              </FormControl>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : dialog.mode === 'create' ? 'Create' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
