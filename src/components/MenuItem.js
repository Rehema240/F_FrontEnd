import { Home } from 'lucide-react'; // Example icon
import { NavLink } from 'react-router-dom';
import NotificationBadge from './NotificationBadge';

const MenuItem = ({ item, isCollapsed }) => {
  // Determine if this is the notifications menu item
  const isNotificationsItem = item.path && item.path.includes('/notifications');
  
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `menu-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`
      }
    >
      <div className="menu-item-icon-container">
        <Home size={20} />
        {isNotificationsItem && <NotificationBadge />}
      </div>
      {!isCollapsed && (
        <span className="menu-item-name">
          {item.name}
        </span>
      )}
    </NavLink>
  );
};

export default MenuItem;
