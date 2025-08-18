import { createContext, useContext, useEffect, useState } from 'react';
import studentService from '../services/studentService';
import { useAuth } from './AuthContext';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const { user, isInitialized } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch notifications ONLY when user is authenticated
  useEffect(() => {
    // Only fetch notifications if user is authenticated
    if (user && isInitialized) {
      console.log('User is authenticated, fetching notifications');
      fetchUnreadCount();
      
      // Poll for new notifications every minute, but only if user is authenticated
      const intervalId = setInterval(fetchUnreadCount, 60000);
      
      return () => {
        clearInterval(intervalId);
      };
    }
  }, [user, isInitialized]);

  const fetchUnreadCount = async () => {
    // Check if user is authenticated before making API call
    if (!user) {
      console.log('User not authenticated, skipping notification fetch');
      return;
    }
    
    try {
      console.log('Fetching unread notification count...');
      const response = await studentService.getUnreadNotificationCount();
      const count = parseInt(response.data, 10);
      
      if (!isNaN(count)) {
        setUnreadCount(count);
        console.log(`Updated unread count: ${count}`);
      }
    } catch (err) {
      console.error('Error fetching unread notification count:', err);
      // Don't update state on error to avoid showing incorrect counts
    }
  };

  const fetchNotifications = async (skip = 0, limit = 10, unreadOnly = false, notificationType = null) => {
    // Check if user is authenticated before making API call
    if (!user) {
      console.log('User not authenticated, skipping notifications fetch');
      return [];
    }
    
    setLoading(true);
    try {
      console.log(`Fetching notifications: skip=${skip}, limit=${limit}, unreadOnly=${unreadOnly}`);
      const response = await studentService.getNotifications(skip, limit, unreadOnly, notificationType);
      setNotifications(response.data);
      setError(null);
      
      // Update unread count
      fetchUnreadCount();
      
      return response.data;
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to fetch notifications.');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    // Check if user is authenticated before making API call
    if (!user) {
      console.log('User not authenticated, cannot mark notification as read');
      return false;
    }
    
    try {
      await studentService.markNotificationAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === notificationId ? { ...notification, is_read: true } : notification
        )
      );
      
      // Decrement unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (err) {
      console.error('Error marking notification as read:', err);
      return false;
    }
  };

  const markAllAsRead = async () => {
    // Check if user is authenticated before making API call
    if (!user) {
      console.log('User not authenticated, cannot mark all notifications as read');
      return false;
    }
    
    try {
      await studentService.markAllNotificationsAsRead();
      
      // Update local state
      setNotifications(prev => prev.map(notification => ({ ...notification, is_read: true })));
      
      // Reset unread count
      setUnreadCount(0);
      
      return true;
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      return false;
    }
  };

  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        unreadCount, 
        loading, 
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        fetchUnreadCount
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);