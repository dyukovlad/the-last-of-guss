import React, { createContext, useContext, useReducer } from 'react';
import type { ReactNode } from 'react';
import { Snackbar, Alert } from '@mui/material';

type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

type NotificationAction =
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'REMOVE_NOTIFICATION'; payload: string }
  | { type: 'CLEAR_ALL_NOTIFICATIONS' };

const notificationReducer = (
  state: NotificationState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case 'ADD_NOTIFICATION':
      return {
        ...state,
        notifications: [...state.notifications, action.payload],
      };
    case 'REMOVE_NOTIFICATION':
      return {
        ...state,
        notifications: state.notifications.filter(
          (notification) => notification.id !== action.payload
        ),
      };
    case 'CLEAR_ALL_NOTIFICATIONS':
      return {
        ...state,
        notifications: [],
      };
    default:
      return state;
  }
};

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(notificationReducer, {
    notifications: [],
  });

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID();
    dispatch({
      type: 'ADD_NOTIFICATION',
      payload: { ...notification, id },
    });

    // Auto-remove notification after duration
    if (notification.duration !== 0) {
      setTimeout(() => {
        removeNotification(id);
      }, notification.duration || 5000);
    }
  };

  const removeNotification = (id: string) => {
    dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
  };

  const clearNotifications = () => {
    dispatch({ type: 'CLEAR_ALL_NOTIFICATIONS' });
  };

  return (
    <NotificationContext.Provider
      value={{ addNotification, removeNotification, clearNotifications }}
    >
      {children}
      {state.notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          autoHideDuration={notification.duration || 5000}
          onClose={() => removeNotification(notification.id)}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => removeNotification(notification.id)}
            severity={notification.type}
            sx={{ width: '100%' }}
          >
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      'useNotification must be used within a NotificationProvider'
    );
  }
  return context;
};
