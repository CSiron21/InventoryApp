import React, { useState } from 'react';
import '../styles/Sidebar.css';

const Sidebar = ({ activeTab, setActiveTab, onLogout, user, profile }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
    { id: 'inventory', label: 'Inventory', icon: '📦' },
    { id: 'sales-orders', label: 'Sales orders', icon: '🛒' },
    { id: 'purchase-orders', label: 'Purchase orders', icon: '📋' },
    { id: 'suppliers', label: 'Suppliers', icon: '🚛' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <span className="sun-icon">☀️</span>
          <h2 className="sidebar-title">SunFlow Inventory</h2>
        </div>
      </div>

      <div className="separator"></div>

      <nav className="sidebar-nav">
        {menuItems.map(item => (
          <button
            key={item.id}
            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="user-avatar">
            <div className="avatar-gradient"></div>
          </div>
          <div className="user-info">
            <div className="user-name">{profile?.username || user?.email?.split('@')[0] || 'User'}</div>
            <div className="user-email">{user?.email || 'user@example.com'}</div>
          </div>
          <button className="logout-btn" onClick={onLogout}>
            →
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;