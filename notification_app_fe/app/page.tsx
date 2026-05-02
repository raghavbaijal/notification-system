'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, Chip } from '@mui/material';
import { fetchNotifications, Notification } from './services/api';
import NotificationItem from './components/NotificationItem';
import { useReadNotifications } from './hooks/useReadNotifications';

export default function AllNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const { readIds, markAsRead, markAllAsRead } = useReadNotifications();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await fetchNotifications();
    setNotifications(data);
    setLoading(false);
  };

  const filtered = filter === 'All' ? notifications : notifications.filter(n => n.notification_type === filter);
  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Topbar */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>All Notifications</Typography>
        <Button 
          variant="outlined" 
          size="small" 
          onClick={() => markAllAsRead(notifications.map(n => n.id))}
          sx={{ color: 'text.primary', borderColor: 'divider', '&:hover': { bgcolor: 'rgba(0,0,0,0.04)', borderColor: 'text.primary' } }}
        >
          Mark all as read
        </Button>
      </Box>

      {/* Content */}
      <Box sx={{ p: 3, flex: 1, overflowY: 'auto' }}>
        {/* Stats */}
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 4 }}>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Total Notifications</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, my: 0.5 }}>{notifications.length}</Typography>
            <Typography variant="caption" sx={{ color: 'success.main' }}>Lifetime received</Typography>
          </Paper>
          <Paper elevation={0} sx={{ p: 2, bgcolor: '#f8fafc', border: '1px solid', borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>Unread</Typography>
            <Typography variant="h4" sx={{ fontWeight: 600, my: 0.5 }}>{unreadCount}</Typography>
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>Requires attention</Typography>
          </Paper>
        </Box>

        {/* Filters & List */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>Recent Activity</Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            {['All', 'Event', 'Result', 'Placement'].map(f => (
              <Chip 
                key={f}
                label={f}
                onClick={() => setFilter(f)}
                sx={{ 
                  bgcolor: filter === f ? 'primary.main' : 'transparent', 
                  color: filter === f ? 'white' : 'text.secondary',
                  border: '1px solid',
                  borderColor: filter === f ? 'primary.main' : 'divider',
                  fontWeight: filter === f ? 600 : 400,
                  '&:hover': {
                    bgcolor: filter === f ? 'primary.main' : 'rgba(0,0,0,0.04)',
                  }
                }}
              />
            ))}
          </Box>
        </Box>

        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>Loading...</Box>
          ) : filtered.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>No notifications found</Box>
          ) : (
            filtered.map(n => (
              <NotificationItem 
                key={n.id} 
                notification={n} 
                isRead={readIds.has(n.id)} 
                onRead={markAsRead} 
              />
            ))
          )}
        </Paper>
      </Box>
    </Box>
  );
}
