import React, { useEffect, useState } from 'react';
import '../styles/DashboardPage.css';
import supabase from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [inv, setInv] = useState(null);
  const [sales, setSales] = useState(null);
  const [pchs, setPchs] = useState(null);
  const [activity, setActivity] = useState([]);
  const navigate = useNavigate();

  async function fetchAll() {
    setLoading(true);
    setError('');
    const [invRes, salesRes, pchsRes, actRes] = await Promise.all([
      supabase.from('v_inventory_summary').select('*').single(),
      supabase.from('v_sales_summary').select('*').single(),
      supabase.from('v_purchase_summary').select('*').single(),
      supabase.from('v_recent_activity').select('*').order('created_at', { ascending: false }).limit(20),
    ]);

    if (invRes.error || salesRes.error || pchsRes.error || actRes.error) {
      setError(invRes.error?.message || salesRes.error?.message || pchsRes.error?.message || actRes.error?.message || 'Failed to load dashboard');
    } else {
      setInv(invRes.data || null);
      setSales(salesRes.data || null);
      setPchs(pchsRes.data || null);
      setActivity(actRes.data || []);
    }
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, []);

  const inventorySummary = {
    // QUESTION: Should this show sum of quantities (inv.total_units) or number of distinct products (inv.product_count)?
    totalItems: inv?.total_units ?? 0,
    lowStock: inv?.low_stock_count ?? 0,
    outOfStock: inv?.out_of_stock_count ?? 0,
    recentlyAdded: inv?.recently_added_count ?? 0,
  };

  const salesSummary = {
    totalOrders: sales?.total_orders ?? 0,
    pendingOrders: sales?.pending_orders ?? 0,
    completedOrders: sales?.completed_orders ?? 0,
    revenue: sales ? `$${Number(sales.revenue || 0).toLocaleString()}` : '$0',
  };

  const purchaseSummary = {
    totalOrders: pchs?.total_orders ?? 0,
    pendingOrders: pchs?.pending_orders ?? 0,
    completedOrders: pchs?.completed_orders ?? 0,
    spent: pchs ? `$${Number(pchs.total_spent || 0).toLocaleString()}` : '$0',
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-display">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {error && (
        <div style={{ background: '#fee', color: '#c33', padding: 10, border: '1px solid #fcc', borderRadius: 6, marginBottom: 16 }}>
          {error}
        </div>
      )}
      {loading && <div>Loading...</div>}

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
            <button className="view-details-btn" onClick={() => navigate('/inventory')}>View Inventory</button>
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
            <button className="view-details-btn" onClick={() => navigate('/sales-orders')}>View Sales Orders</button>
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
            <button className="view-details-btn" onClick={() => navigate('/purchase-orders')}>View Purchase Orders</button>
          </div>
        </div>
      </div>

      <div className="recent-activity-section">
        <div className="section-header">
          <h2>Recent Activity</h2>
          <button className="view-all-btn" onClick={fetchAll}>Refresh</button>
        </div>
        <div className="activity-list">
          {activity.map((a, idx) => (
            <div key={`${a.event_type}-${a.ref_id}-${idx}`} className={`activity-item ${a.event_type}`}>
              <div className="activity-icon">
                {a.event_type === 'sold_product' ? '🛒' : a.event_type === 'purchased_product' ? '📋' : a.event_type === 'added_product' ? '➕' : a.event_type === 'low_stock' ? '⚠️' : 'ℹ️'}
              </div>
              <div className="activity-details">
                <div className="activity-title">{a.title}</div>
                <div className="activity-meta">
                  <span>{a.details}</span>
                  <span className="activity-date" style={{ marginLeft: 8 }}>{new Date(a.created_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
          {!activity.length && !loading && <div>No recent activity</div>}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;