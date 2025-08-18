import { useEffect, useState } from 'react';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await studentService.getMyNotifications();
        setNotifications(response.data);
      } catch (err) {
        setError('Failed to fetch notifications.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      await studentService.markNotificationAsRead(notificationId);
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => 
          notification.id === notificationId ? { ...notification, read: true } : notification
        )
      );
    } catch (err) {
      setError('Failed to mark notification as read.');
      console.error(err);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'event':
        return '📅';
      case 'opportunity':
        return '🌟';
      case 'announcement':
        return '📢';
      case 'reminder':
        return '⏰';
      default:
        return '📬';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) {
    return <div className="loading-container">Loading notifications...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="student-page-container">
      <h1 className="student-page-title">Notifications</h1>
      
      {notifications.length > 0 ? (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${notification.read ? '' : 'unread'}`}
              onClick={() => !notification.read && markAsRead(notification.id)}
            >
              <div className="notification-icon">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="notification-content">
                <h3>{notification.title}</h3>
                <p>{notification.message}</p>
                <div className="notification-meta">
                  <span className="notification-time">{formatDate(notification.created_at)}</span>
                  {!notification.read && (
                    <span className="notification-status">New</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>You don't have any notifications yet.</p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
