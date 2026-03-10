import React, { useState, useEffect } from 'react';
import {
  Box, Card, CardContent, Typography, Button, TextField, Dialog,
  DialogTitle, DialogContent, DialogActions, Select, MenuItem,
  FormControl, InputLabel, Chip, IconButton, Tooltip, Alert,
  CircularProgress, InputAdornment, Avatar, Switch, FormControlLabel,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
} from '@mui/material';
import { Add, Edit, Delete, Search, AdminPanelSettings, SupervisorAccount, AccountCircle } from '@mui/icons-material';
import { usersAPI } from '../../services/api';

const ROLE_COLORS = {
  admin: { bg: '#e8eaf6', color: '#1a237e' },
  manager: { bg: '#e8f5e9', color: '#1b5e20' },
  client: { bg: '#e3f2fd', color: '#0d47a1' },
};

const ROLE_ICONS = {
  admin: <AdminPanelSettings fontSize="small" />,
  manager: <SupervisorAccount fontSize="small" />,
  client: <AccountCircle fontSize="small" />,
};

const emptyForm = { name: '', email: '', password: '', role: 'client', department: '', phone: '', isActive: true };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [dialog, setDialog] = useState({ open: false, mode: 'create', user: null });
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      const res = await usersAPI.getAll({ search, role: roleFilter });
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [search, roleFilter]);

  const openCreate = () => { setForm(emptyForm); setDialog({ open: true, mode: 'create' }); };
  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, password: '', role: user.role,
      department: user.department || '', phone: user.phone || '', isActive: user.isActive });
    setDialog({ open: true, mode: 'edit', user });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      if (dialog.mode === 'create') {
        await usersAPI.create(form);
        setSuccess('User created successfully');
      } else {
        const { password, ...rest } = form;
        await usersAPI.update(dialog.user._id, rest);
        setSuccess('User updated successfully');
      }
      setDialog({ open: false });
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await usersAPI.delete(id);
      setSuccess('User deleted');
      setDeleteConfirm(null);
      load();
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight={800} color="primary.dark">User Management</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={openCreate}>Add User</Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess('')}>{success}</Alert>}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', p: '16px !important' }}>
          <TextField
            placeholder="Search users..." size="small" value={search}
            onChange={e => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><Search /></InputAdornment> }}
            sx={{ flex: 1, minWidth: 200 }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Role</InputLabel>
            <Select value={roleFilter} label="Role" onChange={e => setRoleFilter(e.target.value)}>
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="admin">Admin</MenuItem>
              <MenuItem value="manager">Manager</MenuItem>
              <MenuItem value="client">Client</MenuItem>
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                {['User', 'Email', 'Role', 'Department', 'Status', 'Joined', 'Actions'].map(h => (
                  <TableCell key={h} sx={{ fontWeight: 700, fontSize: '0.8rem', color: 'text.secondary' }}>
                    {h.toUpperCase()}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}><CircularProgress /></TableCell></TableRow>
              ) : users.length === 0 ? (
                <TableRow><TableCell colSpan={7} align="center" sx={{ py: 4 }}>No users found</TableCell></TableRow>
              ) : users.map(user => (
                <TableRow key={user._id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Avatar sx={{ bgcolor: ROLE_COLORS[user.role]?.color, width: 36, height: 36, fontSize: 14 }}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body2" fontWeight={600}>{user.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell><Typography variant="body2">{user.email}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.role}
                      icon={ROLE_ICONS[user.role]}
                      sx={{ bgcolor: ROLE_COLORS[user.role]?.bg, color: ROLE_COLORS[user.role]?.color, fontWeight: 700 }}
                    />
                  </TableCell>
                  <TableCell><Typography variant="body2">{user.department || '—'}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={user.isActive ? 'Active' : 'Inactive'}
                      color={user.isActive ? 'success' : 'default'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{new Date(user.createdAt).toLocaleDateString()}</Typography>
                  </TableCell>
                  <TableCell>
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(user)}>
                        <Edit fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton size="small" color="error" onClick={() => setDeleteConfirm(user)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={dialog.open} onClose={() => setDialog({ open: false })} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>
          {dialog.mode === 'create' ? 'Add New User' : 'Edit User'}
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Full Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} fullWidth required />
            <TextField label="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} fullWidth required />
            {dialog.mode === 'create' && (
              <TextField label="Password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} fullWidth required />
            )}
            <FormControl fullWidth>
              <InputLabel>Role</InputLabel>
              <Select value={form.role} label="Role" onChange={e => setForm({ ...form, role: e.target.value })}>
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="manager">Manager</MenuItem>
                <MenuItem value="client">Client</MenuItem>
              </Select>
            </FormControl>
            <TextField label="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} fullWidth />
            <TextField label="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} fullWidth />
            {dialog.mode === 'edit' && (
              <FormControlLabel
                control={<Switch checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} color="success" />}
                label="Active Account"
              />
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialog({ open: false })}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} color="inherit" /> : dialog.mode === 'create' ? 'Create User' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={Boolean(deleteConfirm)} onClose={() => setDeleteConfirm(null)} maxWidth="xs">
        <DialogTitle fontWeight={700}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete <strong>{deleteConfirm?.name}</strong>? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button variant="contained" color="error" onClick={() => handleDelete(deleteConfirm._id)}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
