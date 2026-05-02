'use client';
import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper, TextField, MenuItem } from '@mui/material';
import { fetchNotifications, Notification } from '../services/api';
import NotificationItem from '../components/NotificationItem';
import { useReadNotifications } from '../hooks/useReadNotifications';

export default function PriorityNotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  
  // API Query states
  const [limit, setLimit] = useState<number>(5);
  const [filterType, setFilterType] = useState('All');
  
  const { readIds, markAsRead, markAllAsRead } = useReadNotifications();

  useEffect(() => {
    loadData();
  }, [limit, filterType]);

  const loadData = async () => {
    setLoading(true);
    const params: any = { limit };
    if (filterType !== 'All') {
      params.notification_type = filterType;
    }
    const data = await fetchNotifications(params);
    setNotifications(data);
    setLoading(false);
  };

  const unreadCount = notifications.filter(n => !readIds.has(n.id)).length;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Topbar */}
      <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: 18 }}>Priority Notifications</Typography>
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
        
        {/* Controls */}
        <Box sx={{ display: 'flex', gap: 2, mb: 4, alignItems: 'center' }}>
          <TextField
            select
            label="Type Filter"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="All">All Types</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="Result">Result</MenuItem>
            <MenuItem value="Placement">Placement</MenuItem>
          </TextField>

          <TextField
            type="number"
            label="Top N (Limit)"
            value={limit}
            onChange={(e) => setLimit(Math.max(1, parseInt(e.target.value) || 1))}
            size="small"
            sx={{ width: 120 }}
            InputProps={{ inputProps: { min: 1, max: 100 } }}
          />
        </Box>

        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
          Showing top {notifications.length} priority notifications
        </Typography>

        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>Loading priority data...</Box>
          ) : notifications.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.disabled' }}>No priority notifications found</Box>
          ) : (
            notifications.map(n => (
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
