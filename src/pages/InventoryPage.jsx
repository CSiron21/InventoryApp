import React, { useEffect, useState } from 'react';
import '../styles/InventoryPage.css';
import supabase from '../supabaseClient';

const computeStatus = (quantity) => {
  if (quantity <= 5) return { label: 'Low', color: 'low' };
  if (quantity >= 15) return { label: 'High', color: 'high' };
  return { label: 'Normal', color: 'normal' };
};

const InventoryPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: null, name: '', price: '', quantity: '', image_url: '' });

  async function fetchProducts() {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('products')
      .select('id,name,price,quantity,units_sold,image_url,created_at')
      .order('created_at', { ascending: false });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setProducts(data || []);
  }

  useEffect(() => { fetchProducts(); }, []);

  function openCreate() {
    setIsEditing(false);
    setForm({ id: null, name: '', price: '', quantity: '', image_url: '' });
    setIsFormOpen(true);
  }

  function openEdit(p) {
    setIsEditing(true);
    setForm({ id: p.id, name: p.name, price: String(p.price), quantity: String(p.quantity), image_url: p.image_url || '' });
    setIsFormOpen(true);
  }

  async function saveProduct(e) {
    e.preventDefault();
    setError('');
    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
      image_url: form.image_url?.trim() || null,
    };
    if (!payload.name || isNaN(payload.price) || isNaN(payload.quantity) || payload.price < 0 || payload.quantity < 0) {
      setError('Please provide valid name, non-negative price and quantity.');
      return;
    }
    if (isEditing) {
      const { error } = await supabase.from('products').update(payload).eq('id', form.id);
      if (error) { setError(error.message); return; }
    } else {
      const { error } = await supabase.from('products').insert(payload);
      if (error) { setError(error.message); return; }
    }
    setIsFormOpen(false);
    await fetchProducts();
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return;
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    await fetchProducts();
  }

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="inventory-page">
      <div className="banner-section">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=300&fit=crop" 
          alt="Warehouse facility"
          className="banner-image"
        />
      </div>
      
      <div className="page-content">
        <div className="page-header">
          <h1 className="page-title">Inventory</h1>
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
            <button className="add-product-btn" onClick={openCreate}>Add Product</button>
          </div>
        </div>

        {isFormOpen && (
          <form onSubmit={saveProduct} className="product-form" style={{ background: '#fff', border: '1px solid #e1e5e9', borderRadius: 8, padding: 16, marginBottom: 16 }}>
            {error && (
              <div style={{ background: '#fee', color: '#c33', padding: 10, border: '1px solid #fcc', borderRadius: 6, marginBottom: 12 }}>{error}</div>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 12 }}>
              <div>
                <label>Name</label>
                <input type="text" value={form.name} onChange={(e)=>setForm({ ...form, name: e.target.value })} required />
              </div>
              <div>
                <label>Price</label>
                <input type="number" min="0" step="0.01" value={form.price} onChange={(e)=>setForm({ ...form, price: e.target.value })} required />
              </div>
              <div>
                <label>Quantity</label>
                <input type="number" min="0" step="1" value={form.quantity} onChange={(e)=>setForm({ ...form, quantity: e.target.value })} required />
              </div>
              <div>
                <label>Image URL (optional)</label>
                <input type="url" value={form.image_url} onChange={(e)=>setForm({ ...form, image_url: e.target.value })} />
              </div>
            </div>
            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button type="submit" className="btn btn-primary">{isEditing ? 'Update Product' : 'Create Product'}</button>
              <button type="button" onClick={()=> setIsFormOpen(false)} className="btn">Cancel</button>
            </div>
          </form>
        )}

        {loading && <div>Loading...</div>}

        <div className="products-grid">
          {filteredProducts.map(product => {
            const status = computeStatus(product.quantity);
            return (
              <div key={product.id} className="product-card">
                <div className="product-image-container">
                  <img 
                    src={product.image_url || 'https://placehold.co/300x300?text=No+Image'} 
                    alt={product.name}
                    className="product-image"
                  />
                  <div className={`stock-status ${status.color}`}>
                    {status.label}
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-name">{product.name}</h3>
                  <div className="stock-details">
                    <p>Price: <span>${Number(product.price).toFixed(2)}</span></p>
                    <p>Units Available: <span>{product.quantity}</span></p>
                    <p>Units Sold: <span>{product.units_sold}</span></p>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button onClick={()=>openEdit(product)} className="btn">Edit</button>
                    <button onClick={()=>deleteProduct(product.id)} className="btn btn-danger">Delete</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
