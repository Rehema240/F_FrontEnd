import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import headService from '../../services/headService';
import '../../styles/Notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // These would be real notifications in a production app
  // For now, we'll use mock data based on department events and users
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch department events and users to create mock notifications
        // Use Promise.allSettled to continue even if one API fails
        const responses = await Promise.allSettled([
          headService.getDepartmentEvents(),
          headService.getDepartmentUsers()
        ]);
        
        const events = responses[0].status === 'fulfilled' && responses[0].value.data ? 
          responses[0].value.data : [];
        const users = responses[1].status === 'fulfilled' && responses[1].value.data ? 
          responses[1].value.data : [];
        
        // Create mock notifications based on events and users
        const mockNotifications = [];
        
        // Add notifications for new events
        if (events.length > 0) {
          events.slice(0, 5).forEach(event => {
            mockNotifications.push({
              id: `event-${event.id}`,
              type: 'event',
              title: `New Event: ${event.title}`,
              message: `A new event "${event.title}" has been created in your department.`,
              createdAt: event.created_at || new Date().toISOString(),
              read: false
            });
          });
        }
        
        // Add notifications for user activity
        if (users.length > 0) {
          users.slice(0, 3).forEach(departmentUser => {
            mockNotifications.push({
              id: `user-${departmentUser.id}`,
              type: 'user',
              title: `User Activity: ${departmentUser.full_name}`,
              message: `${departmentUser.full_name} has recently joined your department.`,
              createdAt: departmentUser.created_at || new Date().toISOString(),
              read: false
            });
          });
        }
        
        // If we couldn't get any data, add fallback notifications
        if (mockNotifications.length === 0) {
          mockNotifications.push({
            id: 'fallback-1',
            type: 'system',
            title: 'Welcome to Notifications',
            message: 'This is where you will see updates about events and users in your department.',
            createdAt: new Date().toISOString(),
            read: false
          });
        }
        
        // Sort notifications by date (newest first)
        mockNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        setNotifications(mockNotifications);
      } catch (err) {
        console.error(err);
        // Even if we fail, provide some fallback notifications
        const fallbackNotifications = [
          {
            id: 'fallback-1',
            type: 'system',
            title: 'Welcome to Notifications',
            message: 'This is where you will see updates about events and users in your department.',
            createdAt: new Date().toISOString(),
            read: false
          }
        ];
        setNotifications(fallbackNotifications);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const markAsRead = (notificationId) => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification =>
        notification.id === notificationId ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prevNotifications =>
      prevNotifications.map(notification => ({ ...notification, read: true }))
    );
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div style={{ color: 'red' }}>{error}</div>;
  }

  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="notifications-container">
      <div className="notifications-header">
        <h1>Notifications</h1>
        <div className="notifications-actions">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead} 
              className="btn btn-primary"
            >
              Mark All as Read
            </button>
          )}
        </div>
      </div>
      
      <div className="notifications-summary">
        <p>{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
      </div>
      
      <div className="notifications-list">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id}
              className={`notification-item ${notification.read ? 'read' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <span className="notification-time">
                  {new Date(notification.createdAt).toLocaleString()}
                </span>
              </div>
              {!notification.read && (
                <div className="notification-unread-indicator"></div>
              )}
            </div>
          ))
        ) : (
          <p>No notifications found.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
