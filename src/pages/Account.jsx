import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, Package, MapPin, Heart, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const token = localStorage.getItem('ns_stone_token');
    const BASE = import.meta.env.VITE_API_URL || '';
    const API_URL = BASE ? `${BASE.replace(/\/+$/, '')}/api` : '/api';
    fetch(`${API_URL}/orders/myorders`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.json())
      .then(d => setOrders(Array.isArray(d) ? d : []))
      .catch(() => setOrders([]))
      .finally(() => setLoadingOrders(false));
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container">
        
        {/* Account Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-neutral-200 gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-black text-[#ffdf9c] flex items-center justify-center font-bold text-lg font-['Manrope']">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-black">
                {user.name}
              </h1>
              <p className="font-['Inter'] text-xs text-neutral-500">
                {user.email} • {user.phone}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-2xs"
              >
                Admin Dashboard
              </Link>
            )}
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3.5 py-2.5 rounded-lg cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Account Content Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Navigation Sidebar */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#e2e3e1] p-3 shadow-2xs space-y-1">
            {[
              { id: 'profile', label: 'My Profile', icon: User },
              { id: 'orders', label: `My Orders (${orders.length})`, icon: Package },
              { id: 'wishlist', label: `Saved Wishlist (${wishlist.length})`, icon: Heart }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-black text-[#ffdf9c]'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-70" />
                </button>
              );
            })}
          </div>

          {/* Main Tab Pane */}
          <div className="lg:col-span-9 bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-8 shadow-2xs">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h2 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-neutral-400">Full Name</span>
                    <span className="font-semibold text-black">{user.name}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-neutral-400">Email Address</span>
                    <span className="font-semibold text-black">{user.email}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-neutral-400">Phone Number</span>
                    <span className="font-semibold text-black">{user.phone}</span>
                  </div>
                  <div>
                    <span className="block text-[11px] font-bold uppercase text-neutral-400">Account Type</span>
                    <span className="font-semibold text-black capitalize">{user.role || 'Direct Customer'}</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="space-y-4">
                <h2 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                  Order History
                </h2>
                {orders.length === 0 ? (
                  <div className="py-10 text-center text-xs text-neutral-500">
                    <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
                    <p>No orders placed yet.</p>
                    <Link to="/products" className="inline-block mt-3 text-black font-bold underline">
                      Start Shopping
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-neutral-100">
                    {orders.map(ord => (
                      <div key={ord._id || ord.orderNumber} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs sm:text-sm">
                        <div>
                          <p className="font-mono font-bold text-black">{ord.orderNumber}</p>
                          <p className="text-[11px] text-neutral-500">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.orderItems?.length || 1} item(s)
                          </p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-black">₹{ord.totalPrice?.toLocaleString('en-IN')}</span>
                          <span className="px-2.5 py-1 bg-neutral-100 text-neutral-800 rounded font-semibold text-[11px]">
                            {ord.orderStatus}
                          </span>
                          <Link
                            to={`/order-success/${ord.orderNumber || ord._id}`}
                            className="text-amber-700 hover:underline font-semibold"
                          >
                            View
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="space-y-4">
                <h2 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                  Saved Products ({wishlist.length})
                </h2>
                {wishlist.length === 0 ? (
                  <p className="py-8 text-center text-xs text-neutral-500">
                    Your wishlist is empty. Browse products and tap the heart icon to save items.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlist.map(p => (
                      <div key={p.id} className="p-3 border border-neutral-200 rounded-xl flex items-center gap-3">
                        <img src={p.image} alt={p.name} className="w-12 h-12 object-contain" />
                        <div className="flex-1 min-w-0">
                          <Link to={`/product/${p.id}`} className="font-semibold text-xs text-black line-clamp-1 hover:underline">
                            {p.name}
                          </Link>
                          <span className="font-bold text-xs text-neutral-900 block mt-0.5">
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
