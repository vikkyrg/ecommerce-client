import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  Package,
  MapPin,
  Heart,
  LogOut,
  ArrowRight,
  ShieldCheck,
  Clock,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { fetchMyOrders } from '../../services/api';
import businessConfig from '../../config/businessConfig';

export default function AccountModal({ isOpen, onClose, initialTab = 'signin' }) {
  const { user, isAuthenticated, login, register, logout } = useAuth();
  const navigate = useNavigate();

  // Tab State: 'signin' | 'register' | 'forgot'
  const [activeTab, setActiveTab] = useState(initialTab);

  // Quick stats state when authenticated
  const [quickOrders, setQuickOrders] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Form states
  const [signInIdentifier, setSignInIdentifier] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Forgot password email/phone state
  const [forgotIdentifier, setForgotIdentifier] = useState('');
  const [forgotSubmitted, setForgotSubmitted] = useState(false);

  // UI status
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync initial tab when modal opens & load quick stats if authenticated
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      setFieldErrors({});
      setServerError('');
      setSuccessMessage('');
      setForgotSubmitted(false);

      const token = typeof localStorage !== 'undefined' ? localStorage.getItem('ns_stone_token') : null;
      if (isAuthenticated && user && token) {
        setLoadingStats(true);
        fetchMyOrders()
          .then(data => {
            if (Array.isArray(data)) setQuickOrders(data);
          })
          .catch(() => {})
          .finally(() => setLoadingStats(false));
      } else {
        setQuickOrders([]);
      }
    }
  }, [isOpen, initialTab, isAuthenticated, user]);

  if (!isOpen) return null;

  // Validation functions
  const validateEmail = email => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).trim());
  };

  const validateIndianMobile = phone => {
    // 10 digits starting with 6, 7, 8, or 9
    const clean = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '').replace(/^0/, '');
    return /^[6-9]\d{9}$/.test(clean);
  };

  const cleanIndianMobile = phone => {
    const clean = phone.replace(/[\s\-\+\(\)]/g, '').replace(/^91/, '').replace(/^0/, '');
    return clean;
  };

  // Switch tabs cleanly without closing modal
  const handleTabSwitch = tab => {
    setActiveTab(tab);
    setFieldErrors({});
    setServerError('');
    setSuccessMessage('');
    setForgotSubmitted(false);
  };

  // Handle Sign In submission
  const handleSignIn = async e => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const errors = {};
    const trimmedId = signInIdentifier.trim();

    if (!trimmedId) {
      errors.signInIdentifier = 'Please enter your email or 10-digit mobile number';
    } else {
      const isEmail = trimmedId.includes('@');
      if (isEmail) {
        if (!validateEmail(trimmedId)) {
          errors.signInIdentifier = 'Please enter a valid email address';
        }
      } else {
        if (!validateIndianMobile(trimmedId)) {
          errors.signInIdentifier = 'Enter a valid 10-digit mobile number (e.g. 9876543210)';
        }
      }
    }

    if (!signInPassword) {
      errors.signInPassword = 'Password is required';
    } else if (signInPassword.length < 6) {
      errors.signInPassword = 'Password must be at least 6 characters';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const res = await login(trimmedId, signInPassword);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Successfully signed in! Welcome back.');
        setTimeout(() => {
          onClose();
        }, 800);
      } else {
        setServerError(res.message || 'Invalid credentials. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setServerError(err.message || 'Connection error. Please try again.');
    }
  };

  // Handle Registration submission
  const handleRegister = async e => {
    e.preventDefault();
    setServerError('');
    setSuccessMessage('');

    const errors = {};
    const trimmedName = registerData.name.trim();
    const trimmedEmail = registerData.email.trim();
    const trimmedPhone = registerData.phone.trim();
    const password = registerData.password;
    const confirmPassword = registerData.confirmPassword;

    if (!trimmedName) {
      errors.name = 'Full name is required';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }

    if (!trimmedEmail) {
      errors.email = 'Email address is required';
    } else if (!validateEmail(trimmedEmail)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!trimmedPhone) {
      errors.phone = 'Mobile number is required';
    } else if (!validateIndianMobile(trimmedPhone)) {
      errors.phone = 'Please enter a valid 10-digit Indian mobile number';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword = 'Confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setLoading(true);

    try {
      const formattedPhone = cleanIndianMobile(trimmedPhone);
      const res = await register(trimmedName, trimmedEmail, formattedPhone, password);
      setLoading(false);
      if (res.success) {
        setSuccessMessage('Account created successfully! Welcome to NS Stone Chemicals.');
        setTimeout(() => {
          onClose();
        }, 1000);
      } else {
        setServerError(res.message || 'Registration failed. Please check your details.');
      }
    } catch (err) {
      setLoading(false);
      setServerError(err.message || 'Connection error. Please try again.');
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = e => {
    e.preventDefault();
    setServerError('');
    const trimmed = forgotIdentifier.trim();
    if (!trimmed) {
      setFieldErrors({ forgot: 'Please enter your registered email address or mobile number' });
      return;
    }
    setFieldErrors({});
    setForgotSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Background overlay with backdrop blur */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-[440px] bg-white rounded-2xl shadow-2xl z-10 overflow-hidden my-auto border border-neutral-100 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header - Black & Gold Premium Theme */}
        <div className="bg-[#171717] px-5 py-4 text-white flex items-center justify-between border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black/80 border border-[#ffdf9c]/30 flex items-center justify-center text-[#ffdf9c]">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-['Manrope'] font-bold text-sm sm:text-base text-white leading-tight">
                {isAuthenticated
                  ? 'My Account'
                  : activeTab === 'signin'
                  ? 'Sign In to Account'
                  : activeTab === 'register'
                  ? 'Create Customer Account'
                  : 'Reset Password'}
              </h3>
              <p className="font-['Inter'] text-[10px] text-neutral-400">
                {businessConfig.companyName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 max-h-[82vh] overflow-y-auto">
          {isAuthenticated && user ? (
            /* Logged In View */
            <div className="space-y-4">
              {/* Customer Profile Card */}
              <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/80">
                <div className="flex items-center gap-3.5">
                  <div className="w-11 h-11 rounded-full bg-black text-[#ffdf9c] border border-amber-400/40 flex items-center justify-center font-bold text-base shadow-xs flex-shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <h4 className="font-['Manrope'] font-bold text-sm text-neutral-900 truncate">
                        {user.name || 'Valued Customer'}
                      </h4>
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-1.5 py-0.2 rounded border border-amber-300/60">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500 truncate">{user.email}</p>
                    {user.phone && <p className="text-[11px] text-neutral-400">+91 {user.phone.replace(/^91/, '')}</p>}
                  </div>
                </div>

                {/* Dynamic Quick Stats Bar */}
                <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-neutral-200/60 text-center">
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/60">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Orders</span>
                    <span className="text-xs font-bold text-black font-['Manrope']">
                      {loadingStats ? '…' : quickOrders.length}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/60">
                    <span className="text-[10px] uppercase font-bold text-amber-600 block">Active</span>
                    <span className="text-xs font-bold text-black font-['Manrope']">
                      {loadingStats ? '…' : quickOrders.filter(o => ['Order Placed', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery'].includes(o.orderStatus)).length}
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg border border-neutral-200/60">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 block">Saved</span>
                    <span className="text-xs font-bold text-black font-['Manrope']">
                      {user?.addresses?.length || 0} addr
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Options - Enhanced with full dashboard access */}
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=overview');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <User className="w-4 h-4 text-[#D4A83F] group-hover:text-black transition-colors" />
                    Account Dashboard &amp; Overview
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=orders');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Package className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
                    My Orders &amp; Tracking
                  </span>
                  <div className="flex items-center gap-1.5">
                    {quickOrders.length > 0 && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-neutral-200 font-bold text-black">
                        {quickOrders.length}
                      </span>
                    )}
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                  </div>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=profile');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <ShieldCheck className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
                    My Profile &amp; Contact Info
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=addresses');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <MapPin className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
                    Saved Addresses
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=wishlist');
                  }}
                  className="w-full text-left p-3 rounded-xl hover:bg-neutral-100 flex items-center justify-between text-neutral-800 transition-colors cursor-pointer group"
                >
                  <span className="flex items-center gap-2.5 font-medium">
                    <Heart className="w-4 h-4 text-neutral-600 group-hover:text-black transition-colors" />
                    Saved Wishlist
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:text-black transition-colors" />
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-100">
                <button
                  onClick={logout}
                  className="w-full bg-neutral-100 text-neutral-700 hover:text-rose-600 hover:bg-rose-50 font-semibold text-xs py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            /* Unauthenticated View: Sign In / Register / Forgot Password */
            <div>
              {/* Tab Selector: Sign In vs Register */}
              {activeTab !== 'forgot' && (
                <div className="flex border-b border-neutral-200 mb-5">
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('signin')}
                    className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'signin'
                        ? 'border-black text-black font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTabSwitch('register')}
                    className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all cursor-pointer ${
                      activeTab === 'register'
                        ? 'border-black text-black font-bold'
                        : 'border-transparent text-neutral-400 hover:text-neutral-700'
                    }`}
                  >
                    Register
                  </button>
                </div>
              )}

              {/* Status alerts */}
              {serverError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{serverError}</span>
                </div>
              )}

              {successMessage && (
                <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}

              {/* 1. SIGN IN FORM */}
              {activeTab === 'signin' && (
                <form onSubmit={handleSignIn} className="space-y-3.5" noValidate>
                  {/* Email or Mobile Number */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address or Mobile Number
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={signInIdentifier}
                        onChange={e => {
                          setSignInIdentifier(e.target.value);
                          if (fieldErrors.signInIdentifier) {
                            setFieldErrors(prev => ({ ...prev, signInIdentifier: '' }));
                          }
                        }}
                        placeholder="e.g. name@example.com or 9876543210"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.signInIdentifier
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                    </div>
                    {fieldErrors.signInIdentifier && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.signInIdentifier}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-neutral-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => handleTabSwitch('forgot')}
                        className="text-[11px] font-medium text-amber-700 hover:text-black hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showSignInPassword ? 'text' : 'password'}
                        value={signInPassword}
                        onChange={e => {
                          setSignInPassword(e.target.value);
                          if (fieldErrors.signInPassword) {
                            setFieldErrors(prev => ({ ...prev, signInPassword: '' }));
                          }
                        }}
                        placeholder="••••••••"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.signInPassword
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowSignInPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.signInPassword && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.signInPassword}
                      </p>
                    )}
                  </div>

                  {/* Sign In Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#ffdf9c] border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </span>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-neutral-500">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('register')}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Register now
                    </button>
                  </div>
                </form>
              )}

              {/* 2. REGISTRATION FORM */}
              {activeTab === 'register' && (
                <form onSubmit={handleRegister} className="space-y-3" noValidate>
                  {/* Full Name */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Full Name
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={registerData.name}
                        onChange={e => {
                          setRegisterData({ ...registerData, name: e.target.value });
                          if (fieldErrors.name) setFieldErrors(prev => ({ ...prev, name: '' }));
                        }}
                        placeholder="e.g. Ramesh Kumar"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.name
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                    </div>
                    {fieldErrors.name && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.name}
                      </p>
                    )}
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="email"
                        value={registerData.email}
                        onChange={e => {
                          setRegisterData({ ...registerData, email: e.target.value });
                          if (fieldErrors.email) setFieldErrors(prev => ({ ...prev, email: '' }));
                        }}
                        placeholder="name@example.com"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.email
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                    </div>
                    {fieldErrors.email && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.email}
                      </p>
                    )}
                  </div>

                  {/* Mobile Number (10-digit Indian Mobile) */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Mobile Number (10-digit Indian)
                    </label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-2.5 rounded-l-xl border border-r-0 border-neutral-300 bg-neutral-100 text-neutral-600 text-xs font-semibold">
                        +91
                      </span>
                      <div className="relative flex-1">
                        <Phone className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="tel"
                          maxLength={10}
                          value={registerData.phone}
                          onChange={e => {
                            const val = e.target.value.replace(/\D/g, '');
                            setRegisterData({ ...registerData, phone: val });
                            if (fieldErrors.phone) setFieldErrors(prev => ({ ...prev, phone: '' }));
                          }}
                          placeholder="9876543210"
                          className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-8 pr-3 py-2.5 rounded-r-xl border transition-all focus:outline-none ${
                            fieldErrors.phone
                              ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                              : 'border-neutral-300 focus:border-black focus:bg-white'
                          }`}
                        />
                      </div>
                    </div>
                    {fieldErrors.phone && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.phone}
                      </p>
                    )}
                  </div>

                  {/* Password */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showRegisterPassword ? 'text' : 'password'}
                        value={registerData.password}
                        onChange={e => {
                          setRegisterData({ ...registerData, password: e.target.value });
                          if (fieldErrors.password) setFieldErrors(prev => ({ ...prev, password: '' }));
                        }}
                        placeholder="At least 6 characters"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.password
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegisterPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showRegisterPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.password && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.password}
                      </p>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <ShieldCheck className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={registerData.confirmPassword}
                        onChange={e => {
                          setRegisterData({ ...registerData, confirmPassword: e.target.value });
                          if (fieldErrors.confirmPassword) setFieldErrors(prev => ({ ...prev, confirmPassword: '' }));
                        }}
                        placeholder="Re-enter password"
                        className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border transition-all focus:outline-none ${
                          fieldErrors.confirmPassword
                            ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20'
                            : 'border-neutral-300 focus:border-black focus:bg-white'
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5 cursor-pointer"
                        tabIndex={-1}
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {fieldErrors.confirmPassword && (
                      <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3 flex-shrink-0" />
                        {fieldErrors.confirmPassword}
                      </p>
                    )}
                  </div>

                  {/* Create Account Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3 rounded-xl shadow-xs transition-all cursor-pointer active:scale-[0.99] disabled:opacity-60 flex items-center justify-center gap-2 mt-4"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-[#ffdf9c] border-t-transparent rounded-full animate-spin" />
                        Creating Account...
                      </span>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  <div className="pt-2 text-center text-xs text-neutral-500">
                    Already registered?{' '}
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('signin')}
                      className="text-black font-semibold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </div>
                </form>
              )}

              {/* 3. FORGOT PASSWORD VIEW */}
              {activeTab === 'forgot' && (
                <div className="space-y-4">
                  <div className="text-center">
                    <p className="text-xs text-neutral-600">
                      Enter your registered email address or mobile number to receive password reset assistance.
                    </p>
                  </div>

                  {forgotSubmitted ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2.5 text-center">
                      <CheckCircle2 className="w-6 h-6 text-amber-600 mx-auto" />
                      <h4 className="font-bold text-xs text-neutral-900">Assistance Request Sent</h4>
                      <p className="text-[11px] text-neutral-600 leading-relaxed">
                        If an account exists for <strong>{forgotIdentifier}</strong>, our support team or automated OTP will assist you. For instant reset, you may also message our verified support line:
                      </p>
                      <a
                        href={`https://wa.me/919738893424?text=${encodeURIComponent(`Hi NS Stone Chemicals support, I need to reset password for ${forgotIdentifier}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-black text-[#ffdf9c] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
                      >
                        Contact Support on WhatsApp
                      </a>
                    </div>
                  ) : (
                    <form onSubmit={handleForgotPassword} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-semibold text-neutral-700 mb-1">
                          Email Address or Mobile Number
                        </label>
                        <div className="relative">
                          <HelpCircle className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            value={forgotIdentifier}
                            onChange={e => {
                              setForgotIdentifier(e.target.value);
                              if (fieldErrors.forgot) setFieldErrors({});
                            }}
                            placeholder="e.g. name@example.com or 9876543210"
                            className={`w-full bg-[#f9f9f7] text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border transition-all focus:outline-none ${
                              fieldErrors.forgot
                                ? 'border-rose-400 focus:border-rose-500'
                                : 'border-neutral-300 focus:border-black focus:bg-white'
                            }`}
                          />
                        </div>
                        {fieldErrors.forgot && (
                          <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 flex-shrink-0" />
                            {fieldErrors.forgot}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3 rounded-xl transition-all cursor-pointer"
                      >
                        Send Reset Link
                      </button>
                    </form>
                  )}

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => handleTabSwitch('signin')}
                      className="text-xs text-neutral-500 hover:text-black font-semibold hover:underline cursor-pointer"
                    >
                      ← Back to Sign In
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
