import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home } from 'lucide-react'; // Example icon

const MenuItem = ({ item, isCollapsed }) => {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `menu-item ${isActive ? 'active' : ''} ${isCollapsed ? 'collapsed' : ''}`
      }
    >
      <Home size={20} />
      {!isCollapsed && <span className="menu-item-name">{item.name}</span>}
    </NavLink>
  );
};

export default MenuItem;
