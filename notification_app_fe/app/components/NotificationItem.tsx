'use client';
import React from 'react';
import { Box, Typography, IconButton, Chip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { Notification } from '../services/api';

interface Props {
  notification: Notification;
  isRead: boolean;
  onRead: (id: string | number) => void;
}

export default function NotificationItem({ notification, isRead, onRead }: Props) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Event': return 'info.main';
      case 'Result': return 'success.main';
      case 'Placement': return 'warning.main';
      default: return 'text.secondary';
    }
  };

  const getChipColor = (type: string): any => {
    switch (type) {
      case 'Event': return 'info';
      case 'Result': return 'success';
      case 'Placement': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Box 
      onClick={() => { if (!isRead) onRead(notification.id); }}
      sx={{ 
        display: 'flex', 
        alignItems: 'flex-start', 
        gap: 2, 
        p: 2, 
        bgcolor: isRead ? 'transparent' : 'rgba(59, 130, 246, 0.04)',
        borderLeft: isRead ? '2px solid transparent' : '2px solid',
        borderLeftColor: isRead ? 'transparent' : 'info.main',
        borderBottom: '1px solid',
        borderColor: 'divider',
        cursor: 'pointer',
        transition: 'background 0.2s',
        '&:hover': {
          bgcolor: 'rgba(0, 0, 0, 0.02)',
        }
      }}
    >
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', mt: 0.8, flexShrink: 0, bgcolor: getTypeColor(notification.notification_type) }} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
          {notification.title || notification.message || 'Notification'}
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {notification.message}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>
            {notification.timestamp || notification.created_at || 'Recently'}
          </Typography>
          <Chip 
            label={notification.notification_type} 
            size="small" 
            color={getChipColor(notification.notification_type)}
            sx={{ height: 20, fontSize: 10, fontWeight: 600 }}
          />
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, flexShrink: 0 }}>
        {!isRead && (
          <IconButton 
            size="small" 
            onClick={(e) => { e.stopPropagation(); onRead(notification.id); }}
            sx={{ color: 'text.disabled', '&:hover': { color: 'success.main', bgcolor: 'rgba(16, 185, 129, 0.1)' } }}
          >
            <CheckIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
    </Box>
  );
}
