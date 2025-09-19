import React, { useEffect, useState } from 'react';
import '../styles/SuppliersPage.css';
import supabase from '../supabaseClient';

const SuppliersPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ id: null, company_name: '', contact_person: '', contact_email: '' });

  async function fetchSuppliers() {
    const { data, error } = await supabase.from('suppliers').select('*').order('company_name');
    if (!error) setSuppliers(data || []);
  }
  useEffect(() => { fetchSuppliers(); }, []);

  function openCreate() {
    setForm({ id: null, company_name: '', contact_person: '', contact_email: '' });
    setShowForm(true);
  }
  function openEdit(s) {
    setForm({ id: s.id, company_name: s.company_name, contact_person: s.contact_person, contact_email: s.contact_email });
    setShowForm(true);
  }

  async function saveSupplier(e) {
    e.preventDefault();
    setError('');
    const payload = {
      company_name: form.company_name.trim(),
      contact_person: form.contact_person.trim(),
      contact_email: form.contact_email.trim(),
    };
    if (!payload.company_name || !payload.contact_person || !payload.contact_email) {
      setError('All fields are required');
      return;
    }
    if (form.id) {
      const { error } = await supabase.from('suppliers').update(payload).eq('id', form.id);
      if (error) { setError(error.message); return; }
    } else {
      const { error } = await supabase.from('suppliers').insert(payload);
      if (error) { setError(error.message); return; }
    }
    setShowForm(false);
    await fetchSuppliers();
  }

  async function deleteSupplier(id) {
    if (!confirm('Delete this supplier?')) return;
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (error) { alert(error.message); return; }
    await fetchSuppliers();
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="suppliers-page">
      <div className="suppliers-header">
        <h1>Suppliers</h1>
      </div>
      
      <div className="suppliers-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <button className="add-supplier-btn" onClick={openCreate}>Add supplier</button>
      </div>

      {showForm && (
        <form onSubmit={saveSupplier} style={{ background: '#fff', border: '1px solid #e1e5e9', borderRadius: 8, padding: 16, margin: '12px 0' }}>
          {error && (
            <div style={{ background: '#fee', color: '#c33', padding: 10, border: '1px solid #fcc', borderRadius: 6, marginBottom: 12 }}>{error}</div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
            <div>
              <label>Company name</label>
              <input type="text" value={form.company_name} onChange={(e)=>setForm({ ...form, company_name: e.target.value })} required />
            </div>
            <div>
              <label>Contact person</label>
              <input type="text" value={form.contact_person} onChange={(e)=>setForm({ ...form, contact_person: e.target.value })} required />
            </div>
            <div>
              <label>Contact email</label>
              <input type="email" value={form.contact_email} onChange={(e)=>setForm({ ...form, contact_email: e.target.value })} required />
            </div>
          </div>
          <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
            <button type="submit" className="btn btn-primary">{form.id ? 'Update Supplier' : 'Create Supplier'}</button>
            <button type="button" onClick={()=> setShowForm(false)} className="btn">Cancel</button>
          </div>
        </form>
      )}
      
      <div className="suppliers-grid">
        {filteredSuppliers.map(supplier => (
          <div key={supplier.id} className="supplier-card">
            <div className="supplier-logo">
              <div className={`logo-icon logo-${supplier.id}`}>☀️</div>
            </div>
            <div className="supplier-info">
              <h3 className="supplier-name">{supplier.company_name}</h3>
              <p className="supplier-contact">{supplier.contact_person}</p>
              <div className="supplier-email">
                <span className="email-icon">✉️</span>
                <span>{supplier.contact_email}</span>
              </div>
              <div className="supplier-orders">
                <p>Purchase orders</p>
                <p className="order-count">{supplier.num_orders}</p>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button className="btn" onClick={()=>openEdit(supplier)}>Edit</button>
                <button onClick={()=>deleteSupplier(supplier.id)} className="btn btn-danger">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuppliersPage;