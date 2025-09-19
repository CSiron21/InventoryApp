import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import InventoryPage from '../pages/InventoryPage.jsx';
import SalesOrdersPage from '../pages/SalesOrdersPage.jsx';
import PurchaseOrdersPage from '../pages/PurchaseOrdersPage.jsx';
import SuppliersPage from '../pages/SuppliersPage.jsx';
import supabase from '../supabaseClient';
import '../styles/Dashboard.css';

const Dashboard = ({ user, profile, activeTab: initialTab = 'dashboard' }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const location = useLocation();
  const navigate = useNavigate();

  // Update active tab based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/dashboard') setActiveTab('dashboard');
    else if (path === '/inventory') setActiveTab('inventory');
    else if (path === '/sales-orders') setActiveTab('sales-orders');
    else if (path === '/purchase-orders') setActiveTab('purchase-orders');
    else if (path === '/suppliers') setActiveTab('suppliers');
  }, [location.pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    // Navigate to the corresponding route
    switch (tab) {
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'inventory':
        navigate('/inventory');
        break;
      case 'sales-orders':
        navigate('/sales-orders');
        break;
      case 'purchase-orders':
        navigate('/purchase-orders');
        break;
      case 'suppliers':
        navigate('/suppliers');
        break;
      default:
        navigate('/dashboard');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage user={user} profile={profile} />;
      case 'inventory':
        return <InventoryPage user={user} profile={profile} />;
      case 'sales-orders':
        return <SalesOrdersPage user={user} profile={profile} />;
      case 'purchase-orders':
        return <PurchaseOrdersPage user={user} profile={profile} />;
      case 'suppliers':
        return <SuppliersPage user={user} profile={profile} />;
      default:
        return <DashboardPage user={user} profile={profile} />;
    }
  };

  return (
    <div className="dashboard">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        onLogout={handleLogout}
        user={user}
        profile={profile}
      />
      {renderContent()}
    </div>
  );
};

export default Dashboard;
