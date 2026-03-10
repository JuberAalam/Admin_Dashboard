import React, { useState } from 'react';
import {
  Box, Card, CardContent, Typography, TextField, Button, Alert,
  CircularProgress, Avatar, Divider, Grid, Chip,
} from '@mui/material';
import { Save, Lock } from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { usersAPI, authAPI } from '../services/api';

const ROLE_COLORS = { admin: '#1a237e', manager: '#2e7d32', client: '#0d47a1' };

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', phone: user?.phone || '' });
  const [pwdForm, setPwdForm] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [saving, setSaving] = useState(false);
  const [savingPwd, setSavingPwd] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true); setMsg(''); setError('');
    try {
      const res = await usersAPI.update(user._id || user.id, form);
      updateUser({ ...user, ...res.data });
      setMsg('Profile updated successfully!');
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async () => {
    if (pwdForm.newPassword !== pwdForm.confirm) return setError('Passwords do not match');
    setSavingPwd(true); setMsg(''); setError('');
    try {
      await authAPI.changePassword({ currentPassword: pwdForm.currentPassword, newPassword: pwdForm.newPassword });
      setMsg('Password changed successfully!');
      setPwdForm({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Password change failed');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <Box maxWidth={700}>
      <Typography variant="h5" fontWeight={800} color="primary.dark" mb={3}>My Profile</Typography>

      {msg && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setMsg('')}>{msg}</Alert>}
      {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>{error}</Alert>}

      {/* Profile header */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Avatar sx={{ width: 80, height: 80, fontSize: 32, fontWeight: 700, bgcolor: ROLE_COLORS[user?.role] }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight={700}>{user?.name}</Typography>
              <Typography variant="body2" color="text.secondary" mb={1}>{user?.email}</Typography>
              <Chip
                label={user?.role?.toUpperCase()}
                size="small"
                sx={{ bgcolor: `${ROLE_COLORS[user?.role]}22`, color: ROLE_COLORS[user?.role], fontWeight: 800 }}
              />
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit info */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Personal Information</Typography>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField label="Full Name" fullWidth value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Email" fullWidth value={user?.email} disabled helperText="Email cannot be changed" />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Department" fullWidth value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField label="Phone" fullWidth value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            </Grid>
          </Grid>
          <Button variant="contained" startIcon={<Save />} onClick={handleSave} disabled={saving} sx={{ mt: 2 }}>
            {saving ? <CircularProgress size={20} color="inherit" /> : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* Change password */}
      <Card>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={700} mb={2}>Change Password</Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField label="Current Password" type="password" fullWidth value={pwdForm.currentPassword} onChange={e => setPwdForm({ ...pwdForm, currentPassword: e.target.value })} />
            <TextField label="New Password" type="password" fullWidth value={pwdForm.newPassword} onChange={e => setPwdForm({ ...pwdForm, newPassword: e.target.value })} />
            <TextField label="Confirm New Password" type="password" fullWidth value={pwdForm.confirm} onChange={e => setPwdForm({ ...pwdForm, confirm: e.target.value })} />
            <Button variant="outlined" startIcon={<Lock />} onClick={handlePasswordChange} disabled={savingPwd || !pwdForm.currentPassword || !pwdForm.newPassword}>
              {savingPwd ? <CircularProgress size={20} /> : 'Change Password'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
