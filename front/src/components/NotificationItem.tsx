import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import {
  Mail,
  Warning,
  CheckCircle,
  Schedule,
  PriorityHigh,
} from '@mui/icons-material';

interface NotificationItemProps {
  id: string;
  type: 'courrier' | 'warning' | 'success' | 'reminder' | 'urgent';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  priority?: 'basse' | 'normale' | 'haute' | 'urgente';
}

const NotificationItem: React.FC<NotificationItemProps> = ({
  type,
  title,
  message,
  timestamp,
  isRead,
  priority,
}) => {
  const getIcon = () => {
    switch (type) {
      case 'courrier':
        return <Mail color="primary" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'success':
        return <CheckCircle color="success" />;
      case 'reminder':
        return <Schedule color="info" />;
      case 'urgent':
        return <PriorityHigh color="error" />;
      default:
        return <Mail color="primary" />;
    }
  };

  const getPriorityColor = () => {
    switch (priority) {
      case 'urgente':
        return 'error';
      case 'haute':
        return 'warning';
      case 'normale':
        return 'primary';
      case 'basse':
        return 'default';
      default:
        return 'default';
    }
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString('fr-FR');
  };

  return (
    <ListItem
      sx={{
        backgroundColor: isRead ? 'transparent' : 'primary.light',
        borderRadius: 1,
        mb: 1,
        opacity: isRead ? 0.7 : 1,
        '&:hover': {
          backgroundColor: isRead ? 'grey.50' : 'primary.light',
        },
      }}
    >
      <ListItemIcon>
        {getIcon()}
      </ListItemIcon>
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: isRead ? 400 : 600,
                color: isRead ? 'text.secondary' : 'text.primary',
              }}
            >
              {title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {priority && (
                <Chip
                  label={priority}
                  color={getPriorityColor() as any}
                  size="small"
                  variant="outlined"
                />
              )}
              <Typography variant="caption" color="text.secondary">
                {formatTimestamp(timestamp)}
              </Typography>
            </Box>
          </Box>
        }
        secondary={
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mt: 0.5,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {message}
          </Typography>
        }
      />
    </ListItem>
  );
};

export default NotificationItem;
