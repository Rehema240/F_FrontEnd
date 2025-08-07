import React from 'react';
import { LogOut } from 'lucide-react';

const SidebarFooter = ({ onLogout, isCollapsed }) => {
  return (
    <div className="sidebar-footer">
      <button onClick={onLogout} className="logout-button">
        <LogOut size={20} />
        {!isCollapsed && <span className="logout-text">Logout</span>}
      </button>
    </div>
  );
};

export default SidebarFooter;
