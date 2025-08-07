import React from 'react';
import MenuItem from './MenuItem';

const SidebarMenu = ({ items, isCollapsed }) => {
  return (
    <div className="sidebar-menu">
      {items.map((item, index) => (
        <MenuItem key={index} item={item} isCollapsed={isCollapsed} />
      ))}
    </div>
  );
};

export default SidebarMenu;
