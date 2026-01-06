import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';

type Notification = {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
};

type NotificationContextType = {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [eventSource, setEventSource] = useState<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Connect to SSE endpoint
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const sse = new EventSource(`/api/notifications/stream?userId=${userId}`);
    
    sse.onopen = () => {
      console.log('Connected to notification stream');
      setIsConnected(true);
    };

    sse.onmessage = (event) => {
      const data = JSON.parse(event.data);
      handleNewNotification({
        type: data.type || 'info',
        title: data.title || 'New Update',
        message: data.message || 'You have a new notification',
      });
    };

    sse.onerror = (error) => {
      console.error('SSE error:', error);
      setIsConnected(false);
      sse.close();
    };

    setEventSource(sse);

    return () => {
      sse.close();
      setIsConnected(false);
    };
  }, []);

  const handleNewNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification using correct Sonner API
    switch (newNotification.type) {
      case 'success':
        toast.success(newNotification.title, {
          description: newNotification.message,
          duration: 5000,
        });
        break;
      case 'error':
        toast.error(newNotification.title, {
          description: newNotification.message,
          duration: 5000,
        });
        break;
      case 'warning':
        toast.warning(newNotification.title, {
          description: newNotification.message,
          duration: 5000,
        });
        break;
      case 'info':
      default:
        toast.info(newNotification.title, {
          description: newNotification.message,
          duration: 5000,
        });
        break;
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({
        ...notification,
        read: true,
      }))
    );
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        addNotification: handleNewNotification,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
