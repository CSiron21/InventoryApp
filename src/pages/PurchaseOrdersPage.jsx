import React, { useEffect, useState } from 'react';
import '../styles/PurchaseOrdersPage.css';
import supabase from '../supabaseClient';

const PO_STATUSES = ['sent','received'];

const PurchaseOrdersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSupplier, setActiveSupplier] = useState('All');
  const [activeStatus, setActiveStatus] = useState('All');
  const [pos, setPOs] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ id: null, supplier_id: '', product_id: '', product_quantity: 1, product_price: 0, status: 'sent' });

  async function fetchMaster() {
    const { data: s } = await supabase.from('suppliers').select('id,company_name');
    const { data: p } = await supabase.from('products').select('id,name,price');
    setSuppliers(s || []);
    setProducts(p || []);
  }
  async function fetchPOs() {
    setLoading(true);
    const { data, error } = await supabase.from('purchase_orders').select('*').order('created_at', { ascending: false });
    setLoading(false);
    if (error) return;
    setPOs(data || []);
  }
  useEffect(() => { fetchMaster(); fetchPOs(); }, []);

  function openCreate() {
    setForm({ id: null, supplier_id: '', product_id: '', product_quantity: 1, product_price: 0, status: 'sent' });
    setShowForm(true);
  }
  function openEdit(po) { setForm({ ...po }); setShowForm(true); }

  async function savePO(e) {
    e.preventDefault();
    setError('');
    const supplier = suppliers.find(x => x.id === form.supplier_id);
    const product = products.find(x => x.id === form.product_id);
    const payload = {
      supplier_id: form.supplier_id,
      supplier_name: supplier?.company_name || '',
      product_id: form.product_id,
      product_name: product?.name || '',
      product_quantity: Number(form.product_quantity),
      product_price: Number(form.product_price || product?.price || 0),
      status: form.status
    };
    if (!payload.supplier_id || !payload.product_id || isNaN(payload.product_quantity) || payload.product_quantity <= 0) {
      setError('Please select supplier/product and quantity > 0');
      return;
    }
    if (form.id) {
      const { error } = await supabase.from('purchase_orders').update(payload).eq('id', form.id);
      if (error) { setError(error.message); return; }
    } else {
      const { error } = await supabase.from('purchase_orders').insert(payload);
      if (error) { setError(error.message); return; }
    }
    setShowForm(false);
    await fetchPOs();
  }

  async function deletePO(id) {
    if (!confirm('Delete this PO?')) return;
    const { error } = await supabase.from('purchase_orders').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    await fetchPOs();
  }

  const filtered = pos.filter(order =>
    (searchTerm ? order.supplier_name.toLowerCase().includes(searchTerm.toLowerCase()) : true) &&
    (activeSupplier === 'All' || order.supplier_name === activeSupplier) &&
    (activeStatus === 'All' || order.status === activeStatus.toLowerCase())
  );

  return (
    <div className="purchase-orders-page">
      <div className="banner-section">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=300&fit=crop" 
          alt="Shipping containers"
          className="banner-image"
        />
      </div>
      
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Purchase orders</h1>
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
          <form onSubmit={savePO} style={{ background: '#fff', border: '1px solid #e1e5e9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            {error && (
              <div style={{ background: '#fee', color: '#c33', padding: 10, border: '1px solid #fcc', borderRadius: 6, marginBottom: 12 }}>{error}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label>Supplier</label>
                <select value={form.supplier_id} onChange={(e)=>setForm({ ...form, supplier_id: e.target.value })} required>
                  <option value="">Select supplier</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.company_name}</option>)}
                </select>
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
                <input type="number" min="1" step="1" value={form.product_quantity} onChange={(e)=>setForm({ ...form, product_quantity: e.target.value })} required />
              </div>
              <div>
                <label>Price</label>
                <input type="number" min="0" step="0.01" value={form.product_price} onChange={(e)=>setForm({ ...form, product_price: e.target.value })} required />
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e)=>setForm({ ...form, status: e.target.value })}>
                  {PO_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{form.id ? 'Update PO' : 'Create PO'}</button>
              <button type="button" onClick={()=> setShowForm(false)} className="btn">Cancel</button>
            </div>
          </form>
        )}

        <div className="filters-section">
          <div className="supplier-filters">
            <h4>Suppliers:</h4>
            <div className="filter-tags">
              {['All', ...suppliers.map(s => s.company_name)].map(supplier => (
                <button
                  key={supplier}
                  className={`filter-tag ${activeSupplier === supplier ? 'active' : ''}`}
                  onClick={() => setActiveSupplier(supplier)}
                >
                  {supplier}
                </button>
              ))}
            </div>
          </div>
          
          <div className="status-filters">
            <h4>Status:</h4>
            <div className="filter-tags">
              {['All','Sent','Received'].map(status => (
                <button
                  key={status}
                  className={`filter-tag ${activeStatus === status ? 'active' : ''}`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading && <div>Loading...</div>}

        <div className="orders-grid">
          {filtered.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-header">
                <h3 className="supplier-name">{order.supplier_name}</h3>
                <div className={`order-status ${order.status}`}>
                  {order.status}
                </div>
              </div>
              
              <div className="order-info">
                <div className="cost">Cost: ${Number(order.product_price).toFixed(2)}</div>
                <div className="order-date">Order made on: {new Date(order.order_date).toLocaleDateString()}</div>
                <div className="products">Product: {order.product_name} × {order.product_quantity}</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn" onClick={()=>openEdit(order)}>Edit</button>
                <button onClick={()=>deletePO(order.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PurchaseOrdersPage;
