import React, { useState } from 'react';
import { X, User, Lock, Mail, Phone, MapPin, Package, Heart, LogIn } from 'lucide-react';

export default function AccountModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('signin'); // 'signin', 'register', 'orders'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleLogin = e => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  const handleRegister = e => {
    e.preventDefault();
    setIsLoggedIn(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[92vh] sm:max-h-[90vh] overflow-y-auto animate-in fade-in slide-in-from-bottom sm:slide-in-from-top duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171717] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[#ffdf9c]" />
            <h3 className="font-['Manrope'] font-bold text-base">
              {isLoggedIn ? 'My Account' : activeTab === 'signin' ? 'Sign In to Account' : 'Create Customer Account'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6">
          {isLoggedIn ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-xl border border-neutral-200">
                <div className="w-10 h-10 rounded-full bg-black text-[#ffdf9c] flex items-center justify-center font-bold text-base">
                  {name ? name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div>
                  <h4 className="font-bold text-sm text-black">{name || 'Valued Customer'}</h4>
                  <p className="text-xs text-neutral-500">{email || 'customer@example.com'}</p>
                </div>
              </div>

              {/* Navigation Options */}
              <div className="space-y-1 text-xs">
                <button className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between text-neutral-800">
                  <span className="flex items-center gap-2.5"><Package className="w-4 h-4 text-neutral-600" /> My Orders &amp; Tracking</span>
                  <span className="text-neutral-400">0 Active</span>
                </button>
                <button className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between text-neutral-800">
                  <span className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-neutral-600" /> Saved Delivery Addresses</span>
                  <span className="text-neutral-400">1 Address</span>
                </button>
                <button className="w-full text-left p-2.5 rounded-lg hover:bg-neutral-100 flex items-center justify-between text-neutral-800">
                  <span className="flex items-center gap-2.5"><Heart className="w-4 h-4 text-neutral-600" /> My Wishlist</span>
                  <span className="text-neutral-400">Saved Items</span>
                </button>
              </div>

              <div className="pt-3 border-t border-neutral-200">
                <button
                  onClick={() => setIsLoggedIn(false)}
                  className="w-full bg-neutral-100 text-neutral-800 font-semibold text-xs py-2.5 rounded-lg hover:bg-neutral-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Tab selector */}
              <div className="flex border-b border-neutral-200 mb-5">
                <button
                  onClick={() => setActiveTab('signin')}
                  className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
                    activeTab === 'signin'
                      ? 'border-black text-black font-bold'
                      : 'border-transparent text-neutral-400 hover:text-black'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className={`flex-1 pb-2.5 text-xs font-semibold text-center border-b-2 transition-all ${
                    activeTab === 'register'
                      ? 'border-black text-black font-bold'
                      : 'border-transparent text-neutral-400 hover:text-black'
                  }`}
                >
                  Register
                </button>
              </div>

              {activeTab === 'signin' ? (
                <form onSubmit={handleLogin} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-semibold text-neutral-700">Password</label>
                      <span className="text-[11px] text-neutral-500 hover:underline cursor-pointer">Forgot Password?</span>
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-[#ffdf9c] font-semibold text-xs py-3 rounded-lg hover:bg-neutral-800 transition-colors mt-2"
                  >
                    Sign In
                  </button>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-3.5">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Your Name"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Password</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-black text-[#ffdf9c] font-semibold text-xs py-3 rounded-lg hover:bg-neutral-800 transition-colors mt-2"
                  >
                    Create Account
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
