import React from 'react';
import '../styles/DashboardPage.css';

const DashboardPage = () => {
  // Mock data for dashboard
  const inventorySummary = {
    totalItems: 248,
    lowStock: 15,
    outOfStock: 3,
    recentlyAdded: 12
  };

  const salesSummary = {
    totalOrders: 87,
    pendingOrders: 14,
    completedOrders: 73,
    revenue: '$42,580'
  };

  const purchaseSummary = {
    totalOrders: 54,
    pendingOrders: 8,
    completedOrders: 46,
    spent: '$31,250'
  };

  const recentActivity = [
    { id: 1, type: 'sale', item: 'Solar Panel 250W', quantity: 5, date: '2 hours ago', customer: 'Green Energy Co.' },
    { id: 2, type: 'purchase', item: 'Inverter 5kW', quantity: 10, date: '5 hours ago', supplier: 'BrightSky Electronics' },
    { id: 3, type: 'inventory', item: 'Battery 12V', quantity: 20, date: '1 day ago', action: 'added' },
    { id: 4, type: 'sale', item: 'Mounting Kit', quantity: 8, date: '1 day ago', customer: 'SunPower Homes' },
    { id: 5, type: 'inventory', item: 'Solar Panel 300W', quantity: 3, date: '2 days ago', action: 'low stock alert' }
  ];

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      <div className="summary-cards">
        <div className="summary-card inventory-card">
          <div className="card-header">
            <h2>Inventory Summary</h2>
            <span className="card-icon">📦</span>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-value">{inventorySummary.totalItems}</span>
              <span className="metric-label">Total Items</span>
            </div>
            <div className="metric">
              <span className="metric-value">{inventorySummary.lowStock}</span>
              <span className="metric-label">Low Stock</span>
            </div>
            <div className="metric">
              <span className="metric-value">{inventorySummary.outOfStock}</span>
              <span className="metric-label">Out of Stock</span>
            </div>
            <div className="metric">
              <span className="metric-value">{inventorySummary.recentlyAdded}</span>
              <span className="metric-label">Recently Added</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">View Inventory</button>
          </div>
        </div>

        <div className="summary-card sales-card">
          <div className="card-header">
            <h2>Sales Summary</h2>
            <span className="card-icon">🛒</span>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-value">{salesSummary.totalOrders}</span>
              <span className="metric-label">Total Orders</span>
            </div>
            <div className="metric">
              <span className="metric-value">{salesSummary.pendingOrders}</span>
              <span className="metric-label">Pending</span>
            </div>
            <div className="metric">
              <span className="metric-value">{salesSummary.completedOrders}</span>
              <span className="metric-label">Completed</span>
            </div>
            <div className="metric">
              <span className="metric-value">{salesSummary.revenue}</span>
              <span className="metric-label">Revenue</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">View Sales Orders</button>
          </div>
        </div>

        <div className="summary-card purchase-card">
          <div className="card-header">
            <h2>Purchase Summary</h2>
            <span className="card-icon">📋</span>
          </div>
          <div className="card-content">
            <div className="metric">
              <span className="metric-value">{purchaseSummary.totalOrders}</span>
              <span className="metric-label">Total Orders</span>
            </div>
            <div className="metric">
              <span className="metric-value">{purchaseSummary.pendingOrders}</span>
              <span className="metric-label">Pending</span>
            </div>
            <div className="metric">
              <span className="metric-value">{purchaseSummary.completedOrders}</span>
              <span className="metric-label">Completed</span>
            </div>
            <div className="metric">
              <span className="metric-value">{purchaseSummary.spent}</span>
              <span className="metric-label">Total Spent</span>
            </div>
          </div>
          <div className="card-footer">
            <button className="view-details-btn">View Purchase Orders</button>
          </div>
        </div>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="view-all-btn">View All</button>
        </div>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className={`activity-item ${activity.type}-activity`}>
              <div className="activity-icon">
                {activity.type === 'sale' ? '🛒' : activity.type === 'purchase' ? '📋' : '📦'}
              </div>
              <div className="activity-details">
                <div className="activity-title">
                  {activity.type === 'sale' 
                    ? `Sold ${activity.quantity} ${activity.item}` 
                    : activity.type === 'purchase' 
                      ? `Purchased ${activity.quantity} ${activity.item}` 
                      : `${activity.action.charAt(0).toUpperCase() + activity.action.slice(1)} ${activity.quantity} ${activity.item}`}
                </div>
                <div className="activity-meta">
                  {activity.type === 'sale' 
                    ? `To: ${activity.customer}` 
                    : activity.type === 'purchase' 
                      ? `From: ${activity.supplier}` 
                      : ''}
                  <span className="activity-date">{activity.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;