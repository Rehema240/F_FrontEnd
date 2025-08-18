import SidebarFooter from './SidebarFooter';
import SidebarHeader from './SidebarHeader';
import SidebarMenu from './SidebarMenu';

const Sidebar = ({ isCollapsed, userRole, currentUser, handleToggle, handleLogout }) => {
  const getMenuItems = (role) => {
    switch (role) {
      case 'admin':
        return [
          { name: 'Dashboard Overview', path: '/admin/dashboard' },
          { name: 'Event Management', path: '/admin/events' },
          { name: 'Opportunity Management', path: '/admin/opportunities' },
          { name: 'User Management', path: '/admin/users' },
        ];
      case 'student':
        return [
          { name: 'My Dashboard', path: '/student/dashboard' },
          { name: 'Browse Events', path: '/student/events' },
          { name: 'Browse Opportunity', path: '/student/opportunities' },
          { name: 'Calendar View', path: '/student/calendar' },
          { name: 'Event History', path: '/student/history' },
          { name: 'Profile Settings', path: '/student/profile' },
          { name: 'Notifications', path: '/student/notifications' },
        ];
      case 'head':
        return [
          { name: 'Department Dashboard', path: '/head/dashboard' },
          { name: 'Event Management', path: '/head/events' },
          { name: 'Opportunity Management', path: '/head/opportunities' },
          { name: 'Calendar View', path: '/head/calendar' },
          { name: 'Confirmed Students', path: '/head/confirmed-students' },
        ];
      case 'employee':
        return [
          { name: 'My Dashboard', path: '/employee/dashboard' },
          { name: 'Event Management', path: '/employee/events' },
          { name: 'Calendar View', path: '/employee/calendar' },
          { name: 'Profile Settings', path: '/employee/profile' },
         
        ];
      default:
        return [];
    }
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <SidebarHeader user={currentUser} onToggle={handleToggle} isCollapsed={isCollapsed} />
      <SidebarMenu items={getMenuItems(userRole)} isCollapsed={isCollapsed} />
      <SidebarFooter onLogout={handleLogout} isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
