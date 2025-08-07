import React from 'react';
import { ChevronFirst, ChevronLast } from 'lucide-react';

const SidebarHeader = ({ user, onToggle, isCollapsed }) => {
  return (
    <div className="sidebar-header">
      <div className="user-profile">
        <img src={user?.avatar} alt="User Avatar" className="user-avatar" />
        {!isCollapsed && (
          <div className="user-info">
            <span className="user-name">{user?.name}</span>
            <span className="user-role">{user?.role}</span>
          </div>
        )}
      </div>
      <button onClick={onToggle} className="toggle-button">
        {isCollapsed ? <ChevronLast /> : <ChevronFirst />}
      </button>
    </div>
  );
};

export default SidebarHeader;
