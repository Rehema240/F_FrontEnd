import { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import studentService from '../../services/studentService';
import '../../styles/StudentComponents.css';

const Notifications = () => {
  const { 
    fetchNotifications: contextFetchNotifications,
    markAsRead: contextMarkAsRead,
    markAllAsRead: contextMarkAllAsRead,
    loading: contextLoading,
    error: contextError,
    notifications: contextNotifications
  } = useNotifications();
  const { user } = useAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    unreadOnly: false,
    notificationType: null
  });
  const [pagination, setPagination] = useState({
    skip: 0,
    limit: 10,
    hasMore: true
  });

  const fetchNotifications = async (reset = false) => {
    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, cannot fetch notifications');
      setError('Please login to view notifications');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const skip = reset ? 0 : pagination.skip;
      
      const response = await studentService.getNotifications(
        skip,
        pagination.limit,
        filter.unreadOnly,
        filter.notificationType
      );
      
      // Log the response for debugging
      console.log('Fetched notifications:', response.data);
      
      // Set notifications based on whether we're resetting or loading more
      setNotifications(prev => 
        reset ? response.data : [...prev, ...response.data]
      );
      
      // Update pagination
      setPagination(prev => ({
        ...prev,
        skip: reset ? pagination.limit : prev.skip + prev.limit,
        hasMore: response.data.length === pagination.limit
      }));
      
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      
      let errorMessage = 'Failed to fetch notifications.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      } else if (err.response?.data) {
        errorMessage = typeof err.response.data === 'string' 
          ? err.response.data 
          : JSON.stringify(err.response.data);
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset and fetch notifications when filter changes, but only if user is authenticated
    if (user) {
      fetchNotifications(true);
    }
  }, [filter.unreadOnly, filter.notificationType, user]);

  const markAsRead = async (notificationId) => {
    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, cannot mark notification as read');
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to mark notifications as read.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
    
    try {
      // Mark the notification as read on the server and update context
      const success = await contextMarkAsRead(notificationId);
      
      if (success) {
        // Update the UI to reflect the change
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => 
            notification.id === notificationId ? { ...notification, is_read: true } : notification
          )
        );
        
        // Show a brief success message
        Swal.fire({
          icon: 'success',
          title: 'Marked as read',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
      
      let errorMessage = 'Failed to mark notification as read.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }
  };
  
  const markAllAsRead = async () => {
    // Check if user is authenticated
    if (!user) {
      console.log('User not authenticated, cannot mark all notifications as read');
      Swal.fire({
        icon: 'error',
        title: 'Authentication Required',
        text: 'Please log in to mark notifications as read.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      return;
    }
    
    try {
      // Mark all notifications as read on the server and update context
      const success = await contextMarkAllAsRead();
      
      if (success) {
        // Update all notifications in the UI
        setNotifications(prevNotifications => 
          prevNotifications.map(notification => ({ ...notification, is_read: true }))
        );
        
        Swal.fire({
          icon: 'success',
          title: 'All notifications marked as read',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } catch (err) {
      console.error('Failed to mark all notifications as read:', err);
      
      let errorMessage = 'Failed to mark all notifications as read.';
      if (err.response?.status === 401) {
        errorMessage = 'Authentication required. Please log in again.';
      }
      
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
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
    
    // Get current date for comparison
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    // Format based on how recent the notification is
    if (date >= today) {
      return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (date >= yesterday) {
      return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString([], { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };
  
  const loadMore = () => {
    if (!pagination.hasMore || loading) return;
    fetchNotifications();
  };

  return (
    <div className="student-page-container">
      <div className="page-header">
        <h1 className="student-page-title">Notifications</h1>
        {user && (
          <div className="notification-actions">
            {notifications.some(notification => !notification.is_read) && (
              <button className="btn btn-sm btn-outline-primary" onClick={markAllAsRead}>
                Mark all as read
              </button>
            )}
            <div className="notification-filters">
              <label className="filter-label">
                <input 
                  type="checkbox"
                  checked={filter.unreadOnly}
                  onChange={(e) => setFilter({...filter, unreadOnly: e.target.checked})}
                />
                Unread only
              </label>
              <select 
                value={filter.notificationType || ''}
                onChange={(e) => setFilter({
                  ...filter, 
                  notificationType: e.target.value || null
                })}
                className="notification-type-filter"
              >
                <option value="">All types</option>
                <option value="event">Events</option>
                <option value="opportunity">Opportunities</option>
                <option value="announcement">Announcements</option>
                <option value="reminder">Reminders</option>
              </select>
            </div>
          </div>
        )}
      </div>
      
      {!user && (
        <div className="error-container auth-required">
          <p>Please log in to view your notifications.</p>
        </div>
      )}
      
      {user && loading && notifications.length === 0 && (
        <div className="loading-container">Loading notifications...</div>
      )}
      
      {user && error && (
        <div className="error-container">{error}</div>
      )}
      
      {user && !loading && notifications.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📭</div>
          <p>You don't have any notifications yet.</p>
        </div>
      ) : (user && !loading && notifications.length > 0 && 
        <>
          <div className="notifications-list">
            {notifications.map(notification => (
              <div 
                key={notification.id} 
                className={`notification-item ${notification.is_read ? '' : 'unread'}`}
                onClick={() => !notification.is_read && markAsRead(notification.id)}
              >
                <div className="notification-icon">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="notification-content">
                  <h3>{notification.title}</h3>
                  <p>{notification.body}</p>
                  <div className="notification-meta">
                    <span className="notification-time">{formatDate(notification.created_at)}</span>
                    {!notification.is_read && (
                      <span className="notification-status">New</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {pagination.hasMore && (
            <div className="load-more-container">
              <button 
                className="btn btn-outline-primary"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load more'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Notifications;
