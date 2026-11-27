import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  LogOut,
  ShieldCheck,
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Truck,
  ArrowRight,
  Plus,
  Trash2,
  Edit2,
  Search,
  AlertCircle,
  Eye,
  EyeOff,
  Phone,
  Mail,
  Home,
  Briefcase,
  Building,
  RefreshCw,
  ExternalLink,
  MessageCircle,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { fetchMyOrders, cancelOrderApi } from '../services/api';
import businessConfig from '../config/businessConfig';
import ProductCard from '../components/products/ProductCard';

export default function Account() {
  const { user, logout, updateProfile } = useAuth();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Active Tab: overview | profile | orders | addresses | wishlist | settings
  const currentTab = searchParams.get('tab') || 'overview';
  const selectedOrderId = searchParams.get('orderId');

  // Orders State
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderFilter, setOrderFilter] = useState('All');

  // Customer Cancellation State
  const [cancelModalOrder, setCancelModalOrder] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState('');
  const [cancelSuccess, setCancelSuccess] = useState('');

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || ''
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [profileError, setProfileError] = useState('');

  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Address Management State
  const [addresses, setAddresses] = useState(() => {
    if (user?.addresses && Array.isArray(user.addresses)) {
      return user.addresses;
    }
    // Check localStorage fallback for addresses
    try {
      const saved = localStorage.getItem(`ns_stone_addr_${user?._id || user?.email}`);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddressIdx, setEditingAddressIdx] = useState(null);
  const [addressFormData, setAddressFormData] = useState({
    fullName: '',
    phone: '',
    house: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
    type: 'Home',
    isDefault: false
  });
  const [addressError, setAddressError] = useState('');
  const [addressSaving, setAddressSaving] = useState(false);

  // Sync state on user load
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }

    setProfileForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || ''
    });

    if (user.addresses && Array.isArray(user.addresses) && user.addresses.length > 0) {
      setAddresses(user.addresses);
    }
  }, [user, navigate]);

  // Load orders
  const loadOrders = async () => {
    setLoadingOrders(true);
    setOrdersError('');
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('ns_stone_token') : null;
    if (!token) {
      setLoadingOrders(false);
      setOrders([]);
      return;
    }
    try {
      const data = await fetchMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.warn('Orders fetch note:', err.message);
      if (err.message && err.message.includes('401')) {
        setOrdersError('Session expired. Please sign in again to view your orders.');
      }
      setOrders([]);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  if (!user) return null;

  // Set active tab helper
  const handleTabChange = tabId => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', tabId);
    params.delete('orderId');
    setSearchParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Profile Save
  const handleSaveProfile = async e => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');

    if (!profileForm.name.trim()) {
      setProfileError('Full name is required');
      return;
    }
    if (!profileForm.phone.trim()) {
      setProfileError('Phone number is required');
      return;
    }

    setProfileSaving(true);
    try {
      const res = await updateProfile({
        name: profileForm.name.trim(),
        phone: profileForm.phone.trim()
      });
      setProfileSaving(false);
      if (res.success) {
        setProfileSuccess('Profile updated successfully!');
        setIsEditingProfile(false);
        setTimeout(() => setProfileSuccess(''), 4000);
      } else {
        setProfileError(res.message || 'Failed to update profile');
      }
    } catch (err) {
      setProfileSaving(false);
      setProfileError(err.message || 'Error updating profile');
    }
  };

  // Address Save
  const handleSaveAddress = async e => {
    e.preventDefault();
    setAddressError('');

    const { fullName, phone, house, street, city, state, pincode, type, isDefault } = addressFormData;
    if (!fullName || !phone || !house || !street || !city || !state || !pincode) {
      setAddressError('Please fill in all address fields.');
      return;
    }

    setAddressSaving(true);
    let updated = [...addresses];

    const newEntry = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      house: house.trim(),
      street: street.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      type: type || 'Home',
      isDefault: isDefault || addresses.length === 0
    };

    if (newEntry.isDefault) {
      updated = updated.map(a => ({ ...a, isDefault: false }));
    }

    if (editingAddressIdx !== null) {
      updated[editingAddressIdx] = newEntry;
    } else {
      updated.push(newEntry);
    }

    setAddresses(updated);
    try {
      localStorage.setItem(`ns_stone_addr_${user._id || user.email}`, JSON.stringify(updated));
      await updateProfile({ addresses: updated });
    } catch (e) {
      console.warn('Address sync note:', e);
    }

    setAddressSaving(false);
    setAddressModalOpen(false);
    setEditingAddressIdx(null);
    setAddressFormData({
      fullName: '',
      phone: '',
      house: '',
      street: '',
      city: '',
      state: '',
      pincode: '',
      type: 'Home',
      isDefault: false
    });
  };

  const handleDeleteAddress = async idx => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    const updated = addresses.filter((_, i) => i !== idx);
    setAddresses(updated);
    try {
      localStorage.setItem(`ns_stone_addr_${user._id || user.email}`, JSON.stringify(updated));
      await updateProfile({ addresses: updated });
    } catch (e) {}
  };

  const handleSetDefaultAddress = async idx => {
    const updated = addresses.map((a, i) => ({
      ...a,
      isDefault: i === idx
    }));
    setAddresses(updated);
    try {
      localStorage.setItem(`ns_stone_addr_${user._id || user.email}`, JSON.stringify(updated));
      await updateProfile({ addresses: updated });
    } catch (e) {}
  };

  // Compute Order Statistics
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter(o =>
    ['Order Placed', 'Confirmed', 'Processing'].includes(o.orderStatus || 'Order Placed')
  ).length;
  const deliveredOrdersCount = orders.filter(o => (o.orderStatus || '').toLowerCase() === 'delivered').length;
  const wishlistCount = wishlist.length;

  // Filter Orders
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      !orderSearch ||
      (order.orderNumber || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.trackingNumber || '').toLowerCase().includes(orderSearch.toLowerCase()) ||
      (order.orderItems || []).some(item => (item.name || '').toLowerCase().includes(orderSearch.toLowerCase()));

    if (!matchesSearch) return false;

    if (orderFilter === 'All') return true;
    return (order.orderStatus || '').toLowerCase() === orderFilter.toLowerCase();
  });

  // Handle customer cancellation
  const handleConfirmCancelOrder = async e => {
    e.preventDefault();
    if (!cancelModalOrder) return;
    setIsCancelling(true);
    setCancelError('');
    setCancelSuccess('');

    try {
      const updated = await cancelOrderApi(cancelModalOrder._id, cancelReason);
      setCancelSuccess('Your order has been cancelled successfully.');
      setOrders(prev => prev.map(o => (o._id === updated._id ? updated : o)));
      setTimeout(() => {
        setCancelModalOrder(null);
        setCancelReason('');
        setCancelSuccess('');
      }, 1500);
    } catch (err) {
      setCancelError(err.message || 'Failed to cancel order. Please contact support.');
    } finally {
      setIsCancelling(false);
    }
  };

  // Helper: check if order can be cancelled by customer
  const canCustomerCancel = order => {
    if (!order) return false;
    return ['Order Placed', 'Confirmed', 'Processing'].includes(order.orderStatus);
  };

  // Selected Order for Details View
  const selectedOrder = selectedOrderId
    ? orders.find(o => o._id === selectedOrderId || o.orderNumber === selectedOrderId)
    : null;

  // Navigation Items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Home, count: null },
    { id: 'profile', label: 'My Profile', icon: User, count: null },
    { id: 'orders', label: 'My Orders', icon: Package, count: totalOrdersCount },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin, count: addresses.length },
    { id: 'wishlist', label: 'My Wishlist', icon: Heart, count: wishlistCount },
    { id: 'settings', label: 'Account Settings', icon: Settings, count: null }
  ];

  return (
    <div className="bg-[#F8F8F7] min-h-screen py-6 sm:py-10 text-[#111111]">
      <div className="site-container max-w-[1320px] mx-auto px-3 sm:px-6 lg:px-8">
        
        {/* TOP PROFILE HEADER CARD - LUXURY RETAIL REFINED */}
        <div className="bg-[#191919] text-white rounded-2xl border border-[#353535] p-5 sm:p-6 mb-6 sm:mb-8 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            {/* Avatar & User Details */}
            <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
              {/* Refined Avatar with restrained gold border */}
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-[#222222] border border-[#D4AF55]/60 flex items-center justify-center font-['Manrope'] font-bold text-lg sm:text-xl text-[#D4AF55] flex-shrink-0 select-none">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="font-['Manrope'] font-bold text-base sm:text-lg text-white tracking-tight truncate">
                    {user.name || 'Valued Customer'}
                  </h1>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-md bg-[#30291A] text-[#D4AF55] border border-[#D4AF55]/30">
                    <CheckCircle2 className="w-3 h-3 text-[#D4AF55]" />
                    Verified Customer
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#B8B8B8] mt-1 flex-wrap">
                  <span className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-[#B8B8B8]" />
                    {user.email}
                  </span>
                  {user.phone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[#B8B8B8]" />
                      +91 {user.phone.replace(/^91/, '')}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons: Restrained, subtle border, hover gold/red */}
            <div className="flex items-center gap-2.5 flex-wrap self-start md:self-center">
              <a
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B8B8B8] hover:text-[#D4AF55] bg-transparent hover:bg-white/[0.03] border border-[#353535] hover:border-[#D4AF55]/60 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                title="Contact Customer Support"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Need Help?</span>
              </a>

              {user.role === 'admin' && (
                <Link
                  to="/admin/dashboard"
                  className="inline-flex items-center text-xs font-semibold text-[#D4AF55] bg-[#30291A] hover:bg-[#3d3320] border border-[#D4AF55]/40 px-3.5 py-2 rounded-xl transition-colors"
                >
                  Admin Panel
                </Link>
              )}

              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B8B8B8] hover:text-rose-400 bg-transparent hover:bg-rose-500/5 border border-[#353535] hover:border-rose-500/40 px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                title="Sign out of account"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* MAIN LAYOUT: SIDEBAR + CONTENT PANE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* DESKTOP SIDEBAR / MOBILE NAV TABS */}
          <div className="lg:col-span-3">
            {/* Mobile Horizontal Pill Scroll */}
            <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-2 scrollbar-none">
              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-[#F5D98A] shadow-xs'
                        : 'bg-white text-neutral-700 border border-[#E8E5DF] hover:bg-neutral-50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.count !== null && item.count > 0 && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isActive ? 'bg-[#D4A83F] text-black' : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Desktop Vertical Menu Card */}
            <div className="hidden lg:block bg-white rounded-2xl border border-[#E8E5DF] p-3 shadow-xs space-y-1">
              <div className="px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-wider text-[#777777]">
                Customer Account
              </div>

              {navItems.map(item => {
                const Icon = item.icon;
                const isActive = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabChange(item.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-[#111111] text-[#F5D98A] shadow-xs'
                        : 'text-neutral-700 hover:bg-neutral-50 hover:text-black'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-[#D4A83F]' : 'text-neutral-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.count !== null && item.count > 0 && (
                        <span
                          className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                            isActive ? 'bg-[#D4A83F] text-black' : 'bg-neutral-100 text-neutral-600'
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-[#F5D98A]' : 'text-neutral-300'}`} />
                    </div>
                  </button>
                );
              })}

              <div className="pt-3 border-t border-[#E8E5DF] mt-2">
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Support Callout Widget */}
            <div className="hidden lg:block bg-gradient-to-br from-[#1A1A1A] to-[#111111] text-white rounded-2xl p-4 mt-5 border border-neutral-800 text-xs">
              <h4 className="font-['Manrope'] font-bold text-white mb-1">Stone Care Expert Support</h4>
              <p className="text-neutral-400 text-[11px] mb-3 leading-relaxed">
                Need chemical recommendations for Italian marble, granite or quartz?
              </p>
              <a
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-[#D4A83F] hover:bg-[#c29631] text-black font-bold px-3 py-1.5 rounded-lg text-[11px] transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat with Specialist</span>
              </a>
            </div>
          </div>

          {/* MAIN CONTENT CARD */}
          <div className="lg:col-span-9 bg-white rounded-2xl sm:rounded-3xl border border-[#E8E5DF] p-5 sm:p-8 shadow-xs min-h-[550px]">
            
            {/* 1. OVERVIEW TAB */}
            {currentTab === 'overview' && (
              <div className="space-y-7">
                <div>
                  <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                    Account Dashboard
                  </h2>
                  <p className="font-['Inter'] text-xs text-[#777777] mt-1">
                    Manage your stone care orders, addresses and profile settings.
                  </p>
                </div>

                {/* 4 SUMMARY CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
                  {/* Total Orders */}
                  <div
                    onClick={() => handleTabChange('orders')}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] hover:border-[#D4A83F] hover:bg-white transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-black text-[#D4A83F] flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Package className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#777777]">
                        All Time
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-['Manrope'] font-bold text-[#111111]">
                      {totalOrdersCount}
                    </div>
                    <div className="text-xs text-[#777777] font-medium mt-0.5">Total Orders</div>
                  </div>

                  {/* Pending Orders */}
                  <div
                    onClick={() => {
                      setOrderFilter('Processing');
                      handleTabChange('orders');
                    }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] hover:border-[#D4A83F] hover:bg-white transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Clock className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                        In Flight
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-['Manrope'] font-bold text-[#111111]">
                      {pendingOrdersCount}
                    </div>
                    <div className="text-xs text-[#777777] font-medium mt-0.5">Pending Orders</div>
                  </div>

                  {/* Delivered Orders */}
                  <div
                    onClick={() => {
                      setOrderFilter('Delivered');
                      handleTabChange('orders');
                    }}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] hover:border-[#D4A83F] hover:bg-white transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                        Completed
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-['Manrope'] font-bold text-[#111111]">
                      {deliveredOrdersCount}
                    </div>
                    <div className="text-xs text-[#777777] font-medium mt-0.5">Delivered</div>
                  </div>

                  {/* Wishlist Items */}
                  <div
                    onClick={() => handleTabChange('wishlist')}
                    className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] hover:border-[#D4A83F] hover:bg-white transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <Heart className="w-4 h-4 fill-rose-500/30" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600">
                        Saved
                      </span>
                    </div>
                    <div className="text-xl sm:text-2xl font-['Manrope'] font-bold text-[#111111]">
                      {wishlistCount}
                    </div>
                    <div className="text-xs text-[#777777] font-medium mt-0.5">Wishlist Items</div>
                  </div>
                </div>

                {/* RECENT ORDERS PREVIEW */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-['Manrope'] font-bold text-base sm:text-lg text-[#111111]">
                      Recent Orders
                    </h3>
                    {orders.length > 0 && (
                      <button
                        onClick={() => handleTabChange('orders')}
                        className="text-xs font-semibold text-[#D4A83F] hover:text-black hover:underline cursor-pointer flex items-center gap-1"
                      >
                        View All Orders <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {loadingOrders ? (
                    <div className="space-y-3">
                      {[1, 2].map(n => (
                        <div key={n} className="h-20 bg-neutral-100 rounded-2xl animate-pulse" />
                      ))}
                    </div>
                  ) : orders.length === 0 ? (
                    <div className="p-8 text-center bg-[#F8F8F7] rounded-2xl border border-[#E8E5DF]">
                      <Package className="w-10 h-10 text-neutral-300 mx-auto mb-2.5" />
                      <h4 className="font-['Manrope'] font-bold text-sm text-[#111111]">
                        No orders yet
                      </h4>
                      <p className="text-xs text-[#777777] mt-1 mb-4">
                        Explore our professional range of stone polishes, adhesives and sealers.
                      </p>
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-[#111111] text-[#F5D98A] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-2xs"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Start Shopping</span>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 3).map(order => (
                        <div
                          key={order._id || order.orderNumber}
                          className="p-4 rounded-2xl border border-[#E8E5DF] hover:border-[#D4A83F]/60 bg-[#F8F8F7] hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E5DF] flex items-center justify-center font-bold text-xs">
                              <Package className="w-4 h-4 text-neutral-600" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-xs text-black">
                                  {order.orderNumber}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                  order.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {order.orderStatus || 'Processing'}
                                </span>
                              </div>
                              <p className="text-[11px] text-[#777777] mt-0.5">
                                {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'} • {order.orderItems?.length || 1} items
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-200">
                            <div className="text-left sm:text-right">
                              <span className="text-[10px] uppercase font-bold text-neutral-400 block">Total</span>
                              <span className="font-bold text-sm text-black">₹{order.totalPrice?.toLocaleString('en-IN') || 0}</span>
                            </div>
                            <button
                              onClick={() => {
                                const p = new URLSearchParams(searchParams);
                                p.set('tab', 'orders');
                                p.set('orderId', order.orderNumber || order._id);
                                setSearchParams(p);
                              }}
                              className="bg-black text-[#F5D98A] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-800 cursor-pointer"
                            >
                              Details
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* SAVED ADDRESS & WISHLIST QUICK SUMMARY */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                  {/* Default Address Preview */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-black flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-[#D4A83F]" />
                        Primary Delivery Address
                      </span>
                      <button
                        onClick={() => handleTabChange('addresses')}
                        className="text-[11px] font-semibold text-[#D4A83F] hover:underline cursor-pointer"
                      >
                        Manage
                      </button>
                    </div>
                    {addresses.length === 0 ? (
                      <p className="text-xs text-[#777777]">No saved delivery addresses yet.</p>
                    ) : (
                      <div className="text-xs text-[#111111] space-y-0.5">
                        <p className="font-bold">{addresses[0].fullName} ({addresses[0].type})</p>
                        <p className="text-neutral-600">{addresses[0].house}, {addresses[0].street}</p>
                        <p className="text-neutral-600">{addresses[0].city}, {addresses[0].state} - {addresses[0].pincode}</p>
                      </div>
                    )}
                  </div>

                  {/* Wishlist Shortcut */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-black flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500" />
                          Saved Wishlist
                        </span>
                        <button
                          onClick={() => handleTabChange('wishlist')}
                          className="text-[11px] font-semibold text-[#D4A83F] hover:underline cursor-pointer"
                        >
                          View All
                        </button>
                      </div>
                      <p className="text-xs text-[#777777]">
                        {wishlistCount > 0
                          ? `You have ${wishlistCount} saved item${wishlistCount > 1 ? 's' : ''} in your wishlist.`
                          : 'Your wishlist is empty. Save products for later anytime.'}
                      </p>
                    </div>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-black hover:text-[#D4A83F] mt-3"
                    >
                      <span>Explore Catalog</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* 2. MY PROFILE TAB */}
            {currentTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
                  <div>
                    <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                      My Profile
                    </h2>
                    <p className="font-['Inter'] text-xs text-[#777777] mt-0.5">
                      View and manage your personal contact information.
                    </p>
                  </div>
                  {!isEditingProfile && (
                    <button
                      onClick={() => setIsEditingProfile(true)}
                      className="inline-flex items-center gap-1.5 bg-[#111111] text-[#F5D98A] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer self-start sm:self-auto"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>

                {profileSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>{profileSuccess}</span>
                  </div>
                )}

                {profileError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <span>{profileError}</span>
                  </div>
                )}

                {/* Profile Data Display / Form */}
                {isEditingProfile ? (
                  <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profileForm.name}
                        onChange={e => setProfileForm({ ...profileForm, name: e.target.value })}
                        className="w-full bg-[#F8F8F7] text-xs sm:text-sm p-3 rounded-xl border border-[#E8E5DF] focus:border-black focus:bg-white focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Email Address <span className="text-[10px] text-neutral-400 font-normal">(Primary Account ID)</span>
                      </label>
                      <input
                        type="email"
                        disabled
                        value={profileForm.email}
                        className="w-full bg-neutral-100 text-neutral-500 text-xs sm:text-sm p-3 rounded-xl border border-neutral-200 cursor-not-allowed"
                      />
                      <span className="text-[11px] text-neutral-400 mt-1 block">
                        Email cannot be changed directly to protect account security.
                      </span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">
                        Mobile Number
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-[#E8E5DF] bg-neutral-100 text-xs font-semibold text-neutral-600">
                          +91
                        </span>
                        <input
                          type="tel"
                          maxLength={10}
                          value={profileForm.phone}
                          onChange={e => setProfileForm({ ...profileForm, phone: e.target.value.replace(/\D/g, '') })}
                          className="w-full bg-[#F8F8F7] text-xs sm:text-sm p-3 rounded-r-xl border border-[#E8E5DF] focus:border-black focus:bg-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="bg-black hover:bg-neutral-800 text-[#F5D98A] font-bold text-xs px-5 py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {profileSaving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditingProfile(false);
                          setProfileForm({
                            name: user.name || '',
                            email: user.email || '',
                            phone: user.phone || ''
                          });
                        }}
                        className="bg-neutral-100 hover:bg-neutral-200 text-neutral-700 font-semibold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs sm:text-sm">
                    <div className="p-4 rounded-xl bg-[#F8F8F7] border border-[#E8E5DF]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                        Full Name
                      </span>
                      <span className="font-semibold text-black text-sm">{user.name || '—'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8F8F7] border border-[#E8E5DF]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                        Email Address
                      </span>
                      <span className="font-semibold text-black text-sm">{user.email || '—'}</span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8F8F7] border border-[#E8E5DF]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                        Mobile Number
                      </span>
                      <span className="font-semibold text-black text-sm">
                        {user.phone ? `+91 ${user.phone.replace(/^91/, '')}` : '—'}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-[#F8F8F7] border border-[#E8E5DF]">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#777777] block mb-1">
                        Account Status
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active &amp; Verified Customer
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 3. MY ORDERS & DETAILS TAB */}
            {currentTab === 'orders' && (
              <div className="space-y-6">
                {selectedOrder ? (
                  /* Dedicated Order Details & Visual Tracking Timeline */
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div className="flex items-center justify-between border-b border-[#E8E5DF] pb-4">
                      <div>
                        <button
                          onClick={() => {
                            const p = new URLSearchParams(searchParams);
                            p.delete('orderId');
                            setSearchParams(p);
                          }}
                          className="text-xs font-semibold text-[#D4A83F] hover:underline cursor-pointer flex items-center gap-1 mb-1"
                        >
                          ← Back to All Orders
                        </button>
                        <h2 className="font-['Manrope'] font-bold text-xl text-black">
                          Order Details: {selectedOrder.orderNumber}
                        </h2>
                      </div>
                      <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900">
                        {selectedOrder.orderStatus || 'Order Placed'}
                      </span>
                    </div>

                    {/* Visual Order Tracking Timeline */}
                    <div className="p-5 sm:p-6 bg-[#F8F8F7] rounded-2xl border border-[#E8E5DF] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-['Manrope'] font-bold text-sm text-black">
                          Order Status &amp; Tracking Timeline
                        </h4>
                        {canCustomerCancel(selectedOrder) && (
                          <button
                            onClick={() => {
                              setCancelModalOrder(selectedOrder);
                              setCancelReason('');
                              setCancelError('');
                              setCancelSuccess('');
                            }}
                            className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            Cancel Order
                          </button>
                        )}
                      </div>

                      {/* Timeline Steps */}
                      {selectedOrder.orderStatus === 'Cancelled' ? (
                        <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700 space-y-1">
                          <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
                          <p className="font-bold text-sm text-rose-800">This order has been cancelled.</p>
                          {selectedOrder.cancellationReason && (
                            <p className="text-[11px] text-rose-700">Reason: {selectedOrder.cancellationReason}</p>
                          )}
                          <p className="text-[11px] text-rose-500">
                            {selectedOrder.cancelledAt
                              ? `Cancelled on ${new Date(selectedOrder.cancelledAt).toLocaleString('en-IN')}`
                              : 'Cancelled'}
                          </p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-center text-xs pt-2">
                          {[
                            { name: 'Order Placed', desc: 'Order received' },
                            { name: 'Confirmed', desc: 'Order verified' },
                            { name: 'Processing', desc: 'Preparing goods' },
                            { name: 'Shipped', desc: 'Dispatched to courier' },
                            { name: 'Out for Delivery', desc: 'Arriving today' },
                            { name: 'Delivered', desc: 'Successfully delivered' }
                          ].map((stepObj, idx) => {
                            const steps = [
                              'Order Placed',
                              'Confirmed',
                              'Processing',
                              'Shipped',
                              'Out for Delivery',
                              'Delivered'
                            ];
                            const currentIdx = steps.indexOf(selectedOrder.orderStatus || 'Order Placed');
                            const isDone = currentIdx >= idx;
                            const isCurrent = currentIdx === idx;

                            // Look up timestamp from statusHistory if available
                            const historyMatch = selectedOrder.statusHistory?.find(h => h.status === stepObj.name);

                            return (
                              <div key={stepObj.name} className="flex flex-col items-center">
                                <div
                                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                                    isDone
                                      ? 'bg-emerald-600 text-white shadow-xs'
                                      : 'bg-neutral-200 text-neutral-400'
                                  } ${isCurrent ? 'ring-3 ring-amber-400' : ''}`}
                                >
                                  {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : idx + 1}
                                </div>
                                <span
                                  className={`text-xs font-bold leading-tight ${
                                    isDone ? 'text-black' : 'text-neutral-400'
                                  }`}
                                >
                                  {stepObj.name}
                                </span>
                                <span className="text-[10px] text-neutral-500 mt-0.5 leading-snug hidden sm:block">
                                  {stepObj.desc}
                                </span>
                                {historyMatch?.updatedAt && isDone && (
                                  <span className="text-[9px] text-neutral-400 mt-1 font-mono">
                                    {new Date(historyMatch.updatedAt).toLocaleDateString('en-IN', {
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {selectedOrder.trackingNumber && (
                        <div className="mt-4 pt-3 border-t border-[#E8E5DF] flex items-center justify-between text-xs text-[#777777]">
                          <span>
                            Tracking Reference: <strong className="font-mono text-black">{selectedOrder.trackingNumber}</strong>
                          </span>
                          <a
                            href={`/track-order?orderId=${selectedOrder.orderNumber}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#D4A83F] font-bold hover:underline"
                          >
                            Live Tracking Page →
                          </a>
                        </div>
                      )}
                    </div>

                    {/* Ordered Products Listing */}
                    <div className="border border-[#E8E5DF] rounded-2xl overflow-hidden">
                      <div className="bg-[#F8F8F7] px-4 py-3 border-b border-[#E8E5DF] font-bold text-xs text-neutral-700">
                        Items in this Order ({selectedOrder.orderItems?.length || 0})
                      </div>
                      <div className="divide-y divide-[#E8E5DF]">
                        {selectedOrder.orderItems?.map((item, idx) => (
                          <div key={idx} className="p-4 flex items-center justify-between gap-3 text-xs sm:text-sm">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-12 h-12 rounded-lg bg-white border border-neutral-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                {item.image ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-contain"
                                    onError={e => {
                                      e.target.style.display = 'none';
                                      e.target.parentElement.innerHTML = '<svg class="w-6 h-6 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
                                    }}
                                  />
                                ) : (
                                  <Package className="w-6 h-6 text-neutral-300" />
                                )}
                              </div>
                              <div className="min-w-0">
                                <h5 className="font-bold text-black truncate">{item.name}</h5>
                                <p className="text-[11px] text-[#777777]">
                                  Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}
                                </p>
                              </div>
                            </div>
                            <div className="font-bold text-black text-right whitespace-nowrap">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary & Shipping Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Shipping Details */}
                      <div className="p-4 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] text-xs">
                        <h4 className="font-bold text-black mb-2 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#D4A83F]" />
                          Delivery Address
                        </h4>
                        <p className="font-semibold text-black">{selectedOrder.customerName || selectedOrder.shippingAddress?.fullName}</p>
                        <p className="text-[#777777]">{selectedOrder.phone || selectedOrder.shippingAddress?.phone}</p>
                        <p className="text-[#777777] mt-1">
                          {typeof selectedOrder.shippingAddress === 'object' && selectedOrder.shippingAddress !== null
                            ? `${selectedOrder.shippingAddress.house || ''}, ${selectedOrder.shippingAddress.street || ''}, ${selectedOrder.shippingAddress.city || ''}, ${selectedOrder.shippingAddress.state || ''} - ${selectedOrder.shippingAddress.pincode || ''}`
                            : selectedOrder.shippingAddress || '—'}
                        </p>
                      </div>

                      {/* Payment & Price Summary */}
                      <div className="p-4 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] text-xs space-y-2">
                        <h4 className="font-bold text-black mb-1">Payment Summary</h4>
                        <div className="flex justify-between text-[#777777]">
                          <span>Payment Method</span>
                          <span className="font-semibold text-black">{selectedOrder.paymentMethod || 'UPI / Online'}</span>
                        </div>
                        <div className="flex justify-between text-[#777777]">
                          <span>Payment Status</span>
                          <span className="font-semibold text-emerald-700">{selectedOrder.paymentStatus || 'Completed'}</span>
                        </div>
                        <div className="flex justify-between text-[#777777]">
                          <span>Subtotal</span>
                          <span>₹{selectedOrder.itemsPrice?.toLocaleString('en-IN') || selectedOrder.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-[#777777]">
                          <span>Delivery Charges</span>
                          <span>{selectedOrder.shippingPrice === 0 ? 'FREE' : `₹${selectedOrder.shippingPrice || 0}`}</span>
                        </div>
                        <div className="pt-2 border-t border-[#E8E5DF] flex justify-between font-bold text-sm text-black">
                          <span>Grand Total</span>
                          <span className="text-[#D4A83F]">₹{selectedOrder.totalPrice?.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Standard Orders Listing with Filters & Search */
                  <>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
                      <div>
                        <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                          My Orders
                        </h2>
                        <p className="font-['Inter'] text-xs text-[#777777] mt-0.5">
                          View details, invoices and shipment tracking for your purchases.
                        </p>
                      </div>

                      {/* Search Bar */}
                      <div className="relative w-full sm:w-64">
                        <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          value={orderSearch}
                          onChange={e => setOrderSearch(e.target.value)}
                          placeholder="Search Order ID / Tracking..."
                          className="w-full bg-[#F8F8F7] text-xs pl-8 pr-3 py-2 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Filter Tabs - Responsive Grid (No horizontal swipe) */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex lg:flex-wrap items-center gap-1.5 sm:gap-2">
                      {[
                        'All',
                        'Order Placed',
                        'Confirmed',
                        'Processing',
                        'Shipped',
                        'Out for Delivery',
                        'Delivered',
                        'Cancelled'
                      ].map(filter => (
                        <button
                          key={filter}
                          onClick={() => setOrderFilter(filter)}
                          className={`text-xs px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-lg font-semibold transition-all cursor-pointer text-center leading-tight flex items-center justify-center ${
                            orderFilter === filter
                              ? 'bg-black text-[#F5D98A] shadow-2xs font-bold'
                              : 'bg-[#F8F8F7] text-neutral-600 hover:bg-neutral-100 border border-[#E8E5DF]/60'
                          }`}
                        >
                          {filter}
                        </button>
                      ))}
                    </div>

                    {/* Orders List */}
                    {loadingOrders ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map(n => (
                          <div key={n} className="h-32 bg-neutral-100 rounded-2xl animate-pulse" />
                        ))}
                      </div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="py-12 text-center bg-[#F8F8F7] rounded-2xl border border-[#E8E5DF]">
                        <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                        <h4 className="font-['Manrope'] font-bold text-base text-black">
                          No matching orders found
                        </h4>
                        <p className="text-xs text-[#777777] mt-1 mb-5">
                          {orderSearch ? 'Try adjusting your search criteria.' : 'You have not placed any orders matching this filter.'}
                        </p>
                        <Link
                          to="/products"
                          className="inline-flex items-center gap-2 bg-black text-[#F5D98A] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                        >
                          Browse Products
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {filteredOrders.map(order => (
                          <div
                            key={order._id || order.orderNumber}
                            className="p-5 rounded-2xl border border-[#E8E5DF] bg-[#F8F8F7] hover:bg-white transition-all space-y-4 shadow-2xs"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8E5DF] pb-3 text-xs">
                              <div>
                                <span className="font-mono font-bold text-sm text-black">
                                  {order.orderNumber}
                                </span>
                                <span className="text-[#777777] ml-2">
                                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN') : 'Recent'}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] uppercase font-bold text-neutral-500">Status:</span>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                                  order.orderStatus === 'Delivered'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}>
                                  {order.orderStatus || 'Order Placed'}
                                </span>
                              </div>
                            </div>

                            {/* Products preview in card */}
                            <div className="space-y-2">
                              {order.orderItems?.slice(0, 2).map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-2.5 min-w-0">
                                    <div className="w-10 h-10 rounded-lg bg-white border border-neutral-200 p-1 flex-shrink-0 flex items-center justify-center overflow-hidden">
                                      {item.image ? (
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-contain"
                                          onError={e => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = '<svg class="w-5 h-5 text-neutral-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>';
                                          }}
                                        />
                                      ) : (
                                        <Package className="w-5 h-5 text-neutral-300" />
                                      )}
                                    </div>
                                    <span className="font-medium text-black truncate">{item.name}</span>
                                    <span className="text-neutral-400">×{item.quantity}</span>
                                  </div>
                                  <span className="font-semibold text-black flex-shrink-0">
                                    ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                </div>
                              ))}
                              {order.orderItems?.length > 2 && (
                                <p className="text-[11px] text-neutral-400">
                                  +{order.orderItems.length - 2} more item(s)
                                </p>
                              )}
                            </div>

                            {/* Bottom Card Actions */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-[#E8E5DF]">
                              <div className="text-xs">
                                <span className="text-neutral-500">Total Order Amount: </span>
                                <strong className="text-black font-bold text-sm">
                                  ₹{order.totalPrice?.toLocaleString('en-IN') || 0}
                                </strong>
                              </div>

                              <div className="flex items-center gap-2">
                                <a
                                  href={`/track-order?orderId=${order.orderNumber}`}
                                  className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors inline-flex items-center gap-1"
                                >
                                  <Truck className="w-3.5 h-3.5" />
                                  <span>Track</span>
                                </a>

                                {canCustomerCancel(order) && (
                                  <button
                                    onClick={() => {
                                      setCancelModalOrder(order);
                                      setCancelReason('');
                                      setCancelError('');
                                      setCancelSuccess('');
                                    }}
                                    className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                                  >
                                    Cancel Order
                                  </button>
                                )}

                                <button
                                  onClick={() => {
                                    const p = new URLSearchParams(searchParams);
                                    p.set('tab', 'orders');
                                    p.set('orderId', order.orderNumber || order._id);
                                    setSearchParams(p);
                                  }}
                                  className="bg-black hover:bg-neutral-800 text-[#F5D98A] text-xs font-bold px-3.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                                >
                                  View Details
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 4. SAVED ADDRESSES TAB */}
            {currentTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
                  <div>
                    <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                      Saved Delivery Addresses
                    </h2>
                    <p className="font-['Inter'] text-xs text-[#777777] mt-0.5">
                      Manage multiple shipping locations for expedited checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingAddressIdx(null);
                      setAddressFormData({
                        fullName: user.name || '',
                        phone: user.phone || '',
                        house: '',
                        street: '',
                        city: '',
                        state: '',
                        pincode: '',
                        type: 'Home',
                        isDefault: addresses.length === 0
                      });
                      setAddressModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 bg-black text-[#F5D98A] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="py-12 text-center bg-[#F8F8F7] rounded-2xl border border-[#E8E5DF]">
                    <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h4 className="font-['Manrope'] font-bold text-base text-black">
                      No saved addresses
                    </h4>
                    <p className="text-xs text-[#777777] mt-1 mb-5">
                      Add your workshop, office or job-site addresses for quick ordering.
                    </p>
                    <button
                      onClick={() => setAddressModalOpen(true)}
                      className="inline-flex items-center gap-2 bg-black text-[#F5D98A] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add First Address</span>
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                          addr.isDefault
                            ? 'border-[#D4A83F] bg-amber-50/20 shadow-xs'
                            : 'border-[#E8E5DF] bg-[#F8F8F7]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-neutral-200 text-neutral-800">
                              {addr.type === 'Home' ? <Home className="w-3 h-3" /> : addr.type === 'Office' ? <Briefcase className="w-3 h-3" /> : <Building className="w-3 h-3" />}
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-[10px] font-bold text-[#D4A83F] bg-[#111111] px-2 py-0.5 rounded-md">
                                Default
                              </span>
                            )}
                          </div>
                          <h4 className="font-bold text-sm text-black">{addr.fullName}</h4>
                          <p className="text-xs text-neutral-500 mb-2">{addr.phone}</p>
                          <p className="text-xs text-neutral-700 leading-relaxed">
                            {addr.house}, {addr.street}
                            <br />
                            {addr.city}, {addr.state} - {addr.pincode}
                          </p>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#E8E5DF] text-xs">
                          {!addr.isDefault ? (
                            <button
                              onClick={() => handleSetDefaultAddress(idx)}
                              className="text-[11px] font-semibold text-neutral-600 hover:text-black hover:underline cursor-pointer"
                            >
                              Set as Default
                            </button>
                          ) : (
                            <span className="text-[11px] text-neutral-400">Primary delivery address</span>
                          )}

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => {
                                setEditingAddressIdx(idx);
                                setAddressFormData(addr);
                                setAddressModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-200 transition-colors cursor-pointer"
                              title="Edit address"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(idx)}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                              title="Delete address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 5. WISHLIST TAB */}
            {currentTab === 'wishlist' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E5DF] pb-4">
                  <div>
                    <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                      My Wishlist ({wishlist.length})
                    </h2>
                    <p className="font-['Inter'] text-xs text-[#777777] mt-0.5">
                      Stone chemicals and tooling saved for future purchasing.
                    </p>
                  </div>
                  {wishlist.length > 0 && (
                    <Link
                      to="/products"
                      className="text-xs font-semibold text-[#D4A83F] hover:underline"
                    >
                      Continue Shopping →
                    </Link>
                  )}
                </div>

                {wishlist.length === 0 ? (
                  <div className="py-12 text-center bg-[#F8F8F7] rounded-2xl border border-[#E8E5DF]">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <h4 className="font-['Manrope'] font-bold text-base text-black">
                      Your wishlist is empty
                    </h4>
                    <p className="text-xs text-[#777777] mt-1 mb-5">
                      Explore stone sealers, polishes, adhesives and diamond pads to save items.
                    </p>
                    <Link
                      to="/products"
                      className="inline-flex items-center gap-2 bg-black text-[#F5D98A] text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Explore Catalog</span>
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-5">
                    {wishlist.map(product => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* 6. ACCOUNT SETTINGS TAB */}
            {currentTab === 'settings' && (
              <div className="space-y-7">
                <div className="border-b border-[#E8E5DF] pb-4">
                  <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-[#111111] tracking-tight">
                    Account Settings &amp; Security
                  </h2>
                  <p className="font-['Inter'] text-xs text-[#777777] mt-0.5">
                    Manage password credentials and account verification details.
                  </p>
                </div>

                {/* Verification Status Card */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] space-y-3">
                  <h4 className="font-['Manrope'] font-bold text-sm text-black">
                    Verification Status
                  </h4>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                    <div>
                      <span className="font-semibold text-black block">Registered Email</span>
                      <span className="text-neutral-500">{user.email}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pt-3 border-t border-neutral-200">
                    <div>
                      <span className="font-semibold text-black block">Registered Phone</span>
                      <span className="text-neutral-500">+91 {user.phone?.replace(/^91/, '')}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg self-start sm:self-auto">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  </div>
                </div>

                {/* Change Password Placeholder notice */}
                <div className="p-4 sm:p-5 rounded-2xl bg-[#F8F8F7] border border-[#E8E5DF] space-y-4">
                  <div>
                    <h4 className="font-['Manrope'] font-bold text-sm text-black">
                      Password &amp; Authentication
                    </h4>
                    <p className="text-xs text-[#777777] mt-0.5">
                      For security, password resets are processed via authenticated OTP verification.
                    </p>
                  </div>

                  <div className="pt-2">
                    <a
                      href={`https://wa.me/919738893424?text=${encodeURIComponent(`Hi NS Stone Chemicals, I want to update my account password for ${user.email}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-black text-[#F5D98A] text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-neutral-800 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Request Password Reset Link</span>
                    </a>
                  </div>
                </div>

                {/* Sign Out Section */}
                <div className="p-4 sm:p-5 rounded-2xl border border-rose-200 bg-rose-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-['Manrope'] font-bold text-sm text-rose-900">
                      Sign Out from this Device
                    </h4>
                    <p className="text-xs text-rose-700 mt-0.5">
                      Clears your local session and token from this browser.
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to sign out?')) {
                        logout();
                        navigate('/');
                      }
                    }}
                    className="inline-flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors cursor-pointer self-start sm:self-auto"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ADDRESS ADD / EDIT MODAL */}
      {addressModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setAddressModalOpen(false)}
          />

          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto border border-neutral-100 animate-in fade-in zoom-in-95 duration-150">
            <div className="bg-[#111111] px-5 py-4 text-white flex items-center justify-between">
              <h3 className="font-['Manrope'] font-bold text-base text-white">
                {editingAddressIdx !== null ? 'Edit Delivery Address' : 'Add New Delivery Address'}
              </h3>
              <button
                onClick={() => setAddressModalOpen(false)}
                className="p-1 rounded-md text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} className="p-5 sm:p-6 space-y-3.5">
              {addressError && (
                <div className="p-3 bg-rose-50 text-rose-700 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{addressError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.fullName}
                    onChange={e => setAddressFormData({ ...addressFormData, fullName: e.target.value })}
                    className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                    placeholder="Recipient's Name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    maxLength={10}
                    value={addressFormData.phone}
                    onChange={e => setAddressFormData({ ...addressFormData, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                    placeholder="10-digit mobile"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  House / Building / Unit No. *
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.house}
                  onChange={e => setAddressFormData({ ...addressFormData, house: e.target.value })}
                  className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                  placeholder="e.g. Plot No. 42, Marble Yard"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Street / Area / Landmark *
                </label>
                <input
                  type="text"
                  required
                  value={addressFormData.street}
                  onChange={e => setAddressFormData({ ...addressFormData, street: e.target.value })}
                  className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                  placeholder="e.g. Industrial Area, Ring Road"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.city}
                    onChange={e => setAddressFormData({ ...addressFormData, city: e.target.value })}
                    className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={addressFormData.state}
                    onChange={e => setAddressFormData({ ...addressFormData, state: e.target.value })}
                    className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={addressFormData.pincode}
                    onChange={e => setAddressFormData({ ...addressFormData, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full bg-[#F8F8F7] text-xs p-2.5 rounded-xl border border-[#E8E5DF] focus:border-black focus:outline-none"
                    placeholder="6 digits"
                  />
                </div>
              </div>

              {/* Address Type */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Address Type
                </label>
                <div className="flex gap-2">
                  {['Home', 'Office', 'Other'].map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setAddressFormData({ ...addressFormData, type })}
                      className={`text-xs px-3.5 py-1.5 rounded-xl font-semibold border transition-all cursor-pointer ${
                        addressFormData.type === type
                          ? 'bg-black text-[#F5D98A] border-black'
                          : 'bg-[#F8F8F7] text-neutral-600 border-[#E8E5DF]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Set Default Checkbox */}
              <label className="flex items-center gap-2 pt-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={addressFormData.isDefault}
                  onChange={e => setAddressFormData({ ...addressFormData, isDefault: e.target.checked })}
                  className="rounded text-black focus:ring-black"
                />
                <span className="text-xs text-neutral-700 font-medium">
                  Make this my default delivery address
                </span>
              </label>

              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#E8E5DF]">
                <button
                  type="button"
                  onClick={() => setAddressModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={addressSaving}
                  className="px-5 py-2 rounded-xl bg-black hover:bg-neutral-800 text-[#F5D98A] text-xs font-bold transition-colors cursor-pointer disabled:opacity-60"
                >
                  {addressSaving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          CUSTOMER CANCELLATION CONFIRMATION DIALOG
          ========================================================================= */}
      {cancelModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-neutral-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-neutral-800 flex-shrink-0">
              <h3 className="font-bold text-sm font-['Manrope'] text-white">
                Cancel Order {cancelModalOrder.orderNumber}
              </h3>
              <button
                onClick={() => setCancelModalOrder(null)}
                className="p-1 text-neutral-400 hover:text-white rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmCancelOrder} className="p-5 space-y-4 text-xs">
              <p className="text-neutral-600 leading-relaxed">
                Are you sure you want to cancel order <strong className="font-mono text-black">{cancelModalOrder.orderNumber}</strong>?
                This action cannot be undone once confirmed.
              </p>

              <div>
                <label className="block text-neutral-700 font-semibold mb-1">
                  Reason for Cancellation (Optional)
                </label>
                <textarea
                  rows={3}
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="e.g. Ordered by mistake, found another product, delivery timeframe."
                  className="w-full px-3 py-2 text-xs bg-[#F8F8F7] border border-[#E8E5DF] rounded-xl focus:outline-none focus:border-black resize-none"
                />
              </div>

              {cancelError && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{cancelError}</span>
                </div>
              )}

              {cancelSuccess && (
                <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
                  <span>{cancelSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setCancelModalOrder(null)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-xs font-semibold text-neutral-700 cursor-pointer"
                >
                  No, Keep Order
                </button>
                <button
                  type="submit"
                  disabled={isCancelling}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
