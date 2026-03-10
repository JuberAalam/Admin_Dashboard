import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Select, MenuItem, FormControl,
  InputLabel, Chip, IconButton, Alert, CircularProgress, Grid,
  FormGroup, FormControlLabel, Checkbox,
} from '@mui/material';
import { Add, Delete, Campaign, Info, Warning, CheckCircle, Error } from '@mui/icons-material';
import { announcementsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const TYPE_META = {
  info: { icon: <Info />, color: '#0288d1', bg: '#e3f2fd', label: 'Info' },
  warning: { icon: <Warning />, color: '#ed6c02', bg: '#fff3e0', label: 'Warning' },
  success: { icon: <CheckCircle />, color: '#2e7d32', bg: '#e8f5e9', label: 'Success' },
  error: { icon: <Error />, color: '#d32f2f', bg: '#ffebee', label: 'Alert' },
};

const emptyForm = { title: '', content: '', type: 'info', targetRoles: [] };

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const canCreate = user?.role === 'admin' || user?.role === 'manager';
  const canDelete = user?.role === 'admin';
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [dialog, setDialog] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const res = await announcementsAPI.getAll();
      setAnnouncements(res.data);
    } catch {
      setError('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    setSaving(true);
    try {
      await announcementsAPI.create(form);
      setSuccess('Announcement created!');
      setDialog(false);
      setForm(emptyForm);
      load();
    } catch {
      setError('Failed to create announcement');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await announcementsAPI.delete(id);
      setSuccess('Announcement deleted');
      load();
    } catch {
      setError('Delete failed');
    }
  };

  const toggleRole = (role) => {
    setForm(prev => ({
      ...prev,
      targetRoles: prev.targetRoles.includes(role)
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role],
    }));
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary.dark">Announcements</Typography>
        {canCreate && <Button variant="contained" startIcon={<Add />} onClick={() => setDialog(true)}>New Announcement</Button>}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {announcements.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: 'center', py: 8 }}>
            <Campaign sx={{ fontSize: 64, color: '#ccc', mb: 2 }} />
            <Typography color="text.secondary">No announcements at the moment</Typography>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={2}>
          {announcements.map(ann => {
            const meta = TYPE_META[ann.type] || TYPE_META.info;
            return (
              <Grid item xs={12} key={ann._id}>
                <Card sx={{ borderLeft: `4px solid ${meta.color}` }}>
                  <CardContent sx={{ p: '20px !important' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 2, flex: 1 }}>
                        <Box sx={{ p: 1, borderRadius: 2, bgcolor: meta.bg, display: 'flex', alignItems: 'center', height: 'fit-content' }}>
                          {React.cloneElement(meta.icon, { sx: { color: meta.color, fontSize: 20 } })}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5, flexWrap: 'wrap' }}>
                            <Typography variant="subtitle1" fontWeight={700}>{ann.title}</Typography>
                            <Chip size="small" label={meta.label} sx={{ bgcolor: meta.bg, color: meta.color, fontWeight: 700, fontSize: '0.7rem' }} />
                            {ann.targetRoles?.length > 0 && ann.targetRoles.map(r => (
                              <Chip key={r} size="small" label={r} variant="outlined" sx={{ fontSize: '0.65rem', height: 20 }} />
                            ))}
                          </Box>
                          <Typography variant="body2" color="text.secondary" mb={1}>{ann.content}</Typography>
                          <Typography variant="caption" color="text.disabled">
                            Posted by {ann.createdBy?.name} • {new Date(ann.createdAt).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </Box>
                      {canDelete && (
                        <IconButton size="small" color="error" onClick={() => handleDelete(ann._id)}>
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Create Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>Create Announcement</DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} fullWidth required />
            <TextField label="Content" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} fullWidth multiline rows={4} required />
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select value={form.type} label="Type" onChange={e => setForm({ ...form, type: e.target.value })}>
                {Object.entries(TYPE_META).map(([k, v]) => <MenuItem key={k} value={k}>{v.label}</MenuItem>)}
              </Select>
            </FormControl>
            <Box>
              <Typography variant="body2" fontWeight={600} mb={1}>Target Roles (leave empty for all)</Typography>
              <FormGroup row>
                {['admin', 'manager', 'client'].map(r => (
                  <FormControlLabel
                    key={r}
                    control={<Checkbox checked={form.targetRoles.includes(r)} onChange={() => toggleRole(r)} size="small" />}
                    label={r.charAt(0).toUpperCase() + r.slice(1)}
                  />
                ))}
              </FormGroup>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving || !form.title || !form.content}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Post Announcement'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
