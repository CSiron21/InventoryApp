import React, { useEffect, useState } from 'react';
import '../styles/SalesOrdersPage.css';
import supabase from '../supabaseClient';

const STATUSES = ['new','confirmed','shipped','delivered'];

const SalesOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ order_number: null, customer_email: '', product_id: '', product_name: '', quantity: 1, status: 'new' });

  async function fetchProducts() {
    const { data, error } = await supabase.from('products').select('id,name');
    if (!error) setProducts(data || []);
  }

  async function fetchOrders() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('sales_orders')
      .select('*')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) { setError(error.message); return; }
    setOrders(data || []);
  }

  useEffect(() => { fetchProducts(); fetchOrders(); }, []);

  function openCreate() {
    setForm({ order_number: null, customer_email: '', product_id: '', product_name: '', quantity: 1, status: 'new' });
    setShowForm(true);
  }
  function openEdit(o) {
    setForm({ ...o });
    setShowForm(true);
  }

  async function saveOrder(e) {
    e.preventDefault();
    setError('');
    const payload = {
      customer_email: form.customer_email.trim(),
      product_id: form.product_id,
      product_name: products.find(p => p.id === form.product_id)?.name || form.product_name,
      quantity: Number(form.quantity),
      status: form.status,
    };
    if (!payload.customer_email || !payload.product_id || isNaN(payload.quantity) || payload.quantity <= 0) {
      setError('Please provide valid email, product, and quantity > 0');
      return;
    }
    if (form.order_number) {
      const { error } = await supabase.from('sales_orders').update(payload).eq('order_number', form.order_number);
      if (error) { setError(error.message); return; }
    } else {
      const { error } = await supabase.from('sales_orders').insert(payload);
      if (error) { setError(error.message); return; }
    }
    setShowForm(false);
    await fetchOrders();
  }

  async function deleteOrder(order_number) {
    if (!confirm('Delete this order?')) return;
    const { error } = await supabase.from('sales_orders').delete().eq('order_number', order_number);
    if (error) { alert(error.message); return; }
    await fetchOrders();
  }

  const filteredOrders = orders.filter(order =>
    order.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (activeFilter === 'All' || order.status === activeFilter.toLowerCase())
  );

  return (
    <div className="sales-orders-page">
      <div className="banner-section">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=300&fit=crop" 
          alt="Logistics facility"
          className="banner-image"
        />
      </div>
      
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Sales orders</h1>
          <div className="header-actions">
            <div className="search-container">
              <span className="search-icon">🔍</span>
              <input 
                type="text" 
                placeholder="Q Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            <button className="create-order-btn" onClick={openCreate}>Create order</button>
          </div>
        </div>

        {showForm && (
          <form onSubmit={saveOrder} style={{ background: '#fff', border: '1px solid #e1e5e9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            {error && (
              <div style={{ background: '#fee', color: '#c33', padding: 10, border: '1px solid #fcc', borderRadius: 6, marginBottom: 12 }}>{error}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label>Customer Email</label>
                <input type="email" value={form.customer_email} onChange={(e)=>setForm({ ...form, customer_email: e.target.value })} required />
              </div>
              <div>
                <label>Product</label>
                <select value={form.product_id} onChange={(e)=>setForm({ ...form, product_id: e.target.value })} required>
                  <option value="">Select product</option>
                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <label>Quantity</label>
                <input type="number" min="1" step="1" value={form.quantity} onChange={(e)=>setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e)=>setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{form.order_number ? 'Update Order' : 'Create Order'}</button>
              <button type="button" onClick={()=> setShowForm(false)} className="btn">Cancel</button>
            </div>
          </form>
        )}

        <div className="status-filters">
          {['All','New','Confirmed','Shipped','Delivered'].map(status => (
            <button
              key={status}
              className={`filter-btn ${activeFilter === status ? 'active' : ''}`}
              onClick={() => setActiveFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        {loading && <div>Loading...</div>}

        <div className="orders-list">
          {filteredOrders.map(order => (
            <div key={order.order_number} className="order-card">
              <div className="order-header">
                <h3 className="customer-email">{order.customer_email}</h3>
                <div className={`order-status ${order.status}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-details">
                <div className="detail-column">
                  <span className="detail-label">Order #</span>
                  <span className="detail-value">{order.order_number}</span>
                </div>
                <div className="detail-column">
                  <span className="detail-label">Product</span>
                  <span className="detail-value">{order.product_name}</span>
                </div>
                <div className="detail-column">
                  <span className="detail-label">Quantity</span>
                  <span className="detail-value">{order.quantity}</span>
                </div>
                <div className="detail-column">
                  <span className="detail-label">Order date</span>
                  <span className="detail-value">{new Date(order.order_date).toLocaleString()}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={()=>openEdit(order)} className="btn">Edit</button>
                <button onClick={()=>deleteOrder(order.order_number)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SalesOrdersPage;
