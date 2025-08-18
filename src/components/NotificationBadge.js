import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

/**
 * A component that displays a notification badge with unread count
 * Can be used in navigation items to show pending notifications
 */
const NotificationBadge = () => {
  const { unreadCount, loading } = useNotifications();
  const { user } = useAuth();

  // Don't render anything if:
  // - User is not authenticated
  // - There are no unread notifications
  // - Notifications are still loading
  if (!user || unreadCount === 0 || loading) {
    return null;
  }

  return (
    <div className="notification-badge">
      {unreadCount > 9 ? '9+' : unreadCount}
    </div>
  );
};

export default NotificationBadge;