import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, Phone, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || '/account';

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (isLogin) {
      const res = await login(formData.email, formData.password);
      setLoading(false);
      if (res.success) {
        navigate(redirect);
      } else {
        setError(res.message);
      }
    } else {
      if (!formData.name || !formData.phone) {
        setLoading(false);
        setError('Please fill in all fields');
        return;
      }
      const res = await register(formData.name, formData.email, formData.phone, formData.password);
      setLoading(false);
      if (res.success) {
        navigate(redirect);
      } else {
        setError(res.message);
      }
    }
  };

  return (
    <div className="bg-[#f9f9f7] min-h-[75vh] py-12 sm:py-16 flex items-center justify-center">
      <div className="site-container max-w-md w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-9 border border-[#e2e3e1] shadow-2xs space-y-6">
          
          <div className="text-center">
            <h1 className="font-['Manrope'] font-bold text-2xl text-black">
              {isLogin ? 'Customer Sign In' : 'Create Customer Account'}
            </h1>
            <p className="font-['Inter'] text-xs text-neutral-500 mt-1">
              {isLogin
                ? 'Sign in to access your orders, saved addresses and wishlist.'
                : 'Register for fast checkout and delivery tracking.'}
            </p>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Anand Sharma"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-[#f9f9f7] pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-[#f9f9f7] pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f7] pl-9 pr-3 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-[#f9f9f7] pl-9 pr-10 py-2.5 text-xs sm:text-sm rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-neutral-100">
            <button
              onClick={() => {
                setIsLogin(p => !p);
                setError('');
              }}
              className="text-xs font-medium text-neutral-700 hover:text-black hover:underline cursor-pointer"
            >
              {isLogin
                ? "Don't have an account? Register here"
                : 'Already have an account? Sign In'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
