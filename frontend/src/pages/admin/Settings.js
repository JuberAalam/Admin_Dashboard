import React from 'react';
import {
  Box, Card, CardContent, Typography, Grid, Switch, FormControlLabel,
  Divider, List, ListItem, ListItemText, ListItemSecondaryAction, Chip,
} from '@mui/material';
import { Security, Storage, Notifications, Palette } from '@mui/icons-material';

export default function SettingsPage() {
  return (
    <Box maxWidth={800}>
      <Typography variant="h5" fontWeight={800} color="primary.dark" mb={3}>System Settings</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Security color="primary" />
                <Typography variant="h6" fontWeight={700}>Security</Typography>
              </Box>
              <List disablePadding>
                {[
                  { label: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts', checked: false },
                  { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes', checked: true },
                  { label: 'IP Whitelist', desc: 'Restrict access by IP address', checked: false },
                ].map(item => (
                  <ListItem key={item.label} disablePadding sx={{ py: 1 }}>
                    <ListItemText primary={item.label} secondary={item.desc} primaryTypographyProps={{ fontWeight: 600 }} />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked={item.checked} size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Notifications color="primary" />
                <Typography variant="h6" fontWeight={700}>Notifications</Typography>
              </Box>
              <List disablePadding>
                {[
                  { label: 'Email Notifications', desc: 'Send email on new user registration', checked: true },
                  { label: 'Project Updates', desc: 'Notify managers on project changes', checked: true },
                  { label: 'System Alerts', desc: 'Critical system event notifications', checked: true },
                ].map(item => (
                  <ListItem key={item.label} disablePadding sx={{ py: 1 }}>
                    <ListItemText primary={item.label} secondary={item.desc} primaryTypographyProps={{ fontWeight: 600 }} />
                    <ListItemSecondaryAction>
                      <Switch defaultChecked={item.checked} size="small" />
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Storage color="primary" />
                <Typography variant="h6" fontWeight={700}>System Information</Typography>
              </Box>
              <Grid container spacing={2}>
                {[
                  { label: 'Database', value: 'MongoDB', status: 'Connected', color: 'success' },
                  { label: 'Backend', value: 'Node.js + Express', status: 'Running', color: 'success' },
                  { label: 'Auth', value: 'JWT Tokens', status: 'Active', color: 'info' },
                  { label: 'Version', value: 'v1.0.0', status: 'Latest', color: 'primary' },
                ].map(item => (
                  <Grid item xs={12} sm={6} key={item.label}>
                    <Box sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight={600}>{item.label}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                        <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                        <Chip size="small" label={item.status} color={item.color} />
                      </Box>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
