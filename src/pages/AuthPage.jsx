import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, Phone, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const location = useLocation();
  const isRegisterRoute = location.pathname.includes('/register');
  const [isLogin, setIsLogin] = useState(!isRegisterRoute);

  useEffect(() => {
    setIsLogin(!location.pathname.includes('/register'));
  }, [location.pathname]);

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
    <div className="bg-[#f9f9f7] min-h-[calc(100vh-220px)] py-10 sm:py-16 md:py-20 flex items-center justify-center px-4">
      {/* Centered Login Card with strictly bounded max width (480px - 520px) */}
      <div className="w-[94%] max-w-[500px] bg-white rounded-2xl border border-[#e2e3e1] p-6 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
        
        {/* Header */}
        <div className="text-center mb-6 sm:mb-7">
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-[26px] text-[#111111] tracking-tight leading-tight">
            {isLogin ? 'Customer Sign In' : 'Create Customer Account'}
          </h1>
          <p className="font-['Inter'] text-xs sm:text-[13px] text-neutral-500 mt-2 leading-relaxed max-w-sm mx-auto">
            {isLogin
              ? 'Sign in to access your orders, saved addresses and wishlist.'
              : 'Register for fast checkout, saved addresses and real-time order tracking.'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 sm:p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Anand Sharma"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full h-[48px] bg-[#fbfbfa] pl-10 pr-3 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full h-[48px] bg-[#fbfbfa] pl-10 pr-3 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="email"
                required
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full h-[48px] bg-[#fbfbfa] pl-10 pr-3 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full h-[48px] bg-[#fbfbfa] pl-10 pr-11 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(p => !p)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-black p-1 cursor-pointer transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-[50px] bg-[#111111] hover:bg-black text-[#ffdf9c] font-['Manrope'] font-bold text-xs sm:text-sm rounded-xl shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed border border-neutral-800 mt-2"
          >
            {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Registration / Sign In Link */}
        <div className="text-center pt-5 mt-5 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => {
              setIsLogin(p => !p);
              setError('');
            }}
            className="text-xs sm:text-[13px] text-neutral-600 hover:text-black cursor-pointer font-['Inter']"
          >
            {isLogin ? (
              <span>
                Don't have an account?{' '}
                <span className="font-bold text-[#b8862d] hover:text-[#d4af37] underline decoration-[#ffdf9c] underline-offset-2">
                  Register here
                </span>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <span className="font-bold text-[#b8862d] hover:text-[#d4af37] underline decoration-[#ffdf9c] underline-offset-2">
                  Sign In
                </span>
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
