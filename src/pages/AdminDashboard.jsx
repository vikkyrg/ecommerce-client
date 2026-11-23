import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  Plus,
  Trash2,
  Edit,
  ArrowRight,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AdminDashboard() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New product form modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    brand: 'Tenax',
    sku: '',
    category: 'Marble & Granite Polishing',
    price: '',
    mrp: '',
    stock: 25,
    size: '1 Liter',
    description: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSXCIJPEceZGNuZyqKbhC8_BQArcQi3WMXEc0P1DzHrfhrQ3TAanwLtSHf3WCpP5t5jzjixohSK2FmRJXb0xDrW1BJr5WPP7Rce_dYV-5Q8wfaBDnS8Gq0HO83ki9DIQB9bzdanqfEYyU4zAgyMTbGdGs-wJu61xNxNbQPEvIN0wqzXv2_eVGH1lslY0QvOmjIkfsX0weN7Qp_4kELbQkg0tyCMS_Xi-Wx8DneX7w'
  });
  const [formMsg, setFormMsg] = useState('');

  const token = localStorage.getItem('ns_stone_token');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/login?redirect=/admin/dashboard');
      return;
    }

    Promise.all([
      fetch('/api/products?limit=100').then(r => r.json()),
      fetch('/api/orders', { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json())
    ])
      .then(([prodsData, ordersData]) => {
        setProducts(Array.isArray(prodsData?.products) ? prodsData.products : []);
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isAdmin, navigate, token]);

  const handleCreateProduct = async e => {
    e.preventDefault();
    setFormMsg('');

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProduct)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to create product');

      setProducts(prev => [data, ...prev]);
      setShowAddModal(false);
      setNewProduct({
        name: '',
        brand: 'Tenax',
        sku: '',
        category: 'Marble & Granite Polishing',
        price: '',
        mrp: '',
        stock: 25,
        size: '1 Liter',
        description: '',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSXCIJPEceZGNuZyqKbhC8_BQArcQi3WMXEc0P1DzHrfhrQ3TAanwLtSHf3WCpP5t5jzjixohSK2FmRJXb0xDrW1BJr5WPP7Rce_dYV-5Q8wfaBDnS8Gq0HO83ki9DIQB9bzdanqfEYyU4zAgyMTbGdGs-wJu61xNxNbQPEvIN0wqzXv2_eVGH1lslY0QvOmjIkfsX0weN7Qp_4kELbQkg0tyCMS_Xi-Wx8DneX7w'
      });
    } catch (err) {
      setFormMsg(err.message);
    }
  };

  const handleDeleteProduct = async id => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id && p.sku !== id));
      }
    } catch (e) {}
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ orderStatus: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setOrders(prev => prev.map(o => (o._id === orderId || o.orderNumber === orderId ? updated : o)));
      }
    } catch (e) {}
  };

  if (!isAdmin) return null;

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container">
        
        {/* Admin Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-neutral-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded tracking-wider uppercase">
                Admin Console
              </span>
              <span className="text-xs text-neutral-500 font-mono">v1.0</span>
            </div>
            <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black mt-1">
              Store Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-black text-[#ffdf9c] font-semibold text-xs px-4 py-2.5 rounded-lg hover:bg-neutral-800 transition-colors inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product</span>
            </button>
          </div>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e3e1] shadow-2xs">
            <span className="text-xs text-neutral-500 font-medium">Total Products</span>
            <p className="font-['Manrope'] font-bold text-2xl text-black mt-1">{products.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e2e3e1] shadow-2xs">
            <span className="text-xs text-neutral-500 font-medium">Orders Placed</span>
            <p className="font-['Manrope'] font-bold text-2xl text-black mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e2e3e1] shadow-2xs">
            <span className="text-xs text-neutral-500 font-medium">Total Revenue</span>
            <p className="font-['Manrope'] font-bold text-2xl text-black mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-[#e2e3e1] shadow-2xs">
            <span className="text-xs text-neutral-500 font-medium">Active Warehouse</span>
            <p className="font-['Manrope'] font-bold text-base text-emerald-700 mt-2">Bangalore Depot</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b border-neutral-200 mb-6">
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'products' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold border-b-2 cursor-pointer transition-colors ${
              activeTab === 'orders' ? 'border-black text-black' : 'border-transparent text-neutral-500 hover:text-black'
            }`}
          >
            Customer Orders ({orders.length})
          </button>
        </div>

        {/* Tab 1: Products Table */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-2xl border border-[#e2e3e1] shadow-2xs overflow-x-auto">
            <table className="w-full text-left text-xs font-['Inter']">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-4">Product</th>
                  <th className="p-4">SKU</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {products.map(p => (
                  <tr key={p.id || p.sku} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 object-contain rounded border border-neutral-200 p-1 bg-white" />
                      <div>
                        <span className="font-semibold text-black line-clamp-1 max-w-xs">{p.name}</span>
                        <span className="text-[10px] text-neutral-500 uppercase font-bold">{p.brand}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-semibold text-neutral-700">{p.sku}</td>
                    <td className="p-4 text-neutral-600 line-clamp-1 max-w-[160px]">{p.category}</td>
                    <td className="p-4 font-bold text-black">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.inStock !== false ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                        {p.stock || 25} in stock
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id || p.sku)}
                        className="text-rose-600 hover:text-rose-800 p-1 cursor-pointer"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Orders Table */}
        {activeTab === 'orders' && (
          <div className="bg-white rounded-2xl border border-[#e2e3e1] shadow-2xs overflow-x-auto">
            {orders.length === 0 ? (
              <p className="p-10 text-center text-xs text-neutral-500">No orders received yet.</p>
            ) : (
              <table className="w-full text-left text-xs font-['Inter']">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {orders.map(o => (
                    <tr key={o._id || o.orderNumber} className="hover:bg-neutral-50/80 transition-colors">
                      <td className="p-4 font-mono font-bold text-black">{o.orderNumber}</td>
                      <td className="p-4">
                        <span className="font-semibold text-black block">{o.customerName}</span>
                        <span className="text-[10px] text-neutral-500">{o.phone}</span>
                      </td>
                      <td className="p-4 text-neutral-600">{o.orderItems?.length || 1} item(s)</td>
                      <td className="p-4 font-bold text-black">₹{o.totalPrice?.toLocaleString('en-IN')}</td>
                      <td className="p-4">
                        <select
                          value={o.orderStatus || 'Order Placed'}
                          onChange={e => handleUpdateOrderStatus(o._id || o.orderNumber, e.target.value)}
                          className="bg-neutral-100 border border-neutral-300 rounded px-2 py-1 text-xs font-medium cursor-pointer"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/order-success/${o.orderNumber || o._id}`}
                          className="text-amber-700 hover:underline font-semibold"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Add Product Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-['Manrope'] font-bold text-lg text-black">Add New Product</h3>
                <button onClick={() => setShowAddModal(false)} className="text-neutral-400 hover:text-black">✕</button>
              </div>

              {formMsg && <p className="text-xs text-rose-600">{formMsg}</p>}

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={newProduct.name}
                    onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g. Tenax Pro Gloss Polish 1L"
                    className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Brand *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.brand}
                      onChange={e => setNewProduct({ ...newProduct, brand: e.target.value })}
                      className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={newProduct.sku}
                      onChange={e => setNewProduct({ ...newProduct, sku: e.target.value.toUpperCase() })}
                      placeholder="TNX-010"
                      className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300 uppercase font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Category *</label>
                  <select
                    value={newProduct.category}
                    onChange={e => setNewProduct({ ...newProduct, category: e.target.value })}
                    className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                  >
                    <option value="Marble & Granite Polishing">Marble & Granite Polishing</option>
                    <option value="Tile Adhesives & Epoxy Grouts">Tile Adhesives & Epoxy Grouts</option>
                    <option value="Marble & Granite Cutting Accessories">Marble & Granite Cutting Accessories</option>
                    <option value="Machines & Tools">Machines & Tools</option>
                    <option value="Floor Covering Materials">Floor Covering Materials</option>
                    <option value="Additional Essentials">Additional Essentials</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={newProduct.price}
                      onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                      placeholder="1800"
                      className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">MRP (₹)</label>
                    <input
                      type="number"
                      value={newProduct.mrp}
                      onChange={e => setNewProduct({ ...newProduct, mrp: e.target.value })}
                      placeholder="2100"
                      className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={newProduct.description}
                    onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
                    className="w-full bg-[#f9f9f7] p-2.5 rounded-lg border border-neutral-300"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border rounded-lg hover:bg-neutral-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-black text-[#ffdf9c] font-bold rounded-lg hover:bg-neutral-800"
                  >
                    Create Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
