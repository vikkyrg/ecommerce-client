import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';

export default function CheckoutModal({ isOpen, onClose, summary }) {
  const { cartItems, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'upi'
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');

  if (!isOpen) return null;

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newOrderId = 'NS-' + Math.floor(100000 + Math.random() * 900000);
    setOrderId(newOrderId);
    setIsSuccess(true);
    clearCart();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl z-10 overflow-hidden max-h-[92vh] sm:max-h-[90vh] flex flex-col animate-in fade-in slide-in-from-bottom sm:slide-in-from-top duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-[#171717] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#ffdf9c]" />
            <h3 className="font-['Manrope'] font-bold text-base sm:text-lg">
              {isSuccess ? 'Order Confirmation' : 'Direct Customer Checkout'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-['Manrope'] font-bold text-2xl text-black">
                Thank You for Your Order!
              </h4>
              <p className="text-sm text-neutral-600 max-w-md mx-auto">
                Your order <span className="font-bold text-black">{orderId}</span> has been confirmed. A delivery tracking link and invoice receipt have been sent to <span className="font-semibold text-black">{formData.email || 'your email'}</span>.
              </p>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 max-w-sm mx-auto text-left text-xs space-y-1.5 mt-4">
                <p><span className="text-neutral-500">Recipient:</span> <span className="font-semibold text-black">{formData.name}</span></p>
                <p><span className="text-neutral-500">Phone:</span> <span className="font-semibold text-black">{formData.phone}</span></p>
                <p><span className="text-neutral-500">Address:</span> <span className="font-semibold text-black">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</span></p>
                <p><span className="text-neutral-500">Payment:</span> <span className="font-semibold text-black uppercase">{formData.paymentMethod}</span></p>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="bg-black hover:bg-neutral-800 text-[#ffdf9c] font-semibold text-xs px-6 py-3 rounded-lg"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Customer Contact */}
              <div>
                <h4 className="font-['Manrope'] font-bold text-sm text-black mb-3 pb-1 border-b border-neutral-200">
                  1. Contact Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="name@example.com"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address */}
              <div>
                <h4 className="font-['Manrope'] font-bold text-sm text-black mb-3 pb-1 border-b border-neutral-200">
                  2. Delivery Address
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">House / Flat / Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Flat No., Building Name, Street"
                      className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="e.g. Bangalore"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">State *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="e.g. Karnataka"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-700 mb-1">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        required
                        value={formData.pincode}
                        onChange={handleChange}
                        placeholder="e.g. 560001"
                        className="w-full text-xs p-2.5 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method Selection */}
              <div>
                <h4 className="font-['Manrope'] font-bold text-sm text-black mb-3 pb-1 border-b border-neutral-200">
                  3. Select Payment Method
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'upi', label: 'UPI (GPay / PhonePe / Paytm)' },
                    { id: 'card', label: 'Credit / Debit Card' },
                    { id: 'netbanking', label: 'Net Banking' },
                    { id: 'cod', label: 'Cash on Delivery (COD)' }
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`p-3 rounded-lg border flex flex-col justify-between cursor-pointer text-xs transition-all ${
                        formData.paymentMethod === method.id
                          ? 'border-black bg-neutral-50 font-bold text-black'
                          : 'border-neutral-200 text-neutral-600 hover:border-neutral-400'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="text-black focus:ring-black h-3.5 w-3.5"
                        />
                      </div>
                      <span className="mt-2 text-[11px] leading-snug">{method.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Order Summary & Submit */}
              <div className="pt-3 border-t border-neutral-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-left w-full sm:w-auto">
                  <span className="text-xs text-neutral-500 block">Total Amount Payable:</span>
                  <span className="font-['Manrope'] text-xl font-extrabold text-black">
                    ₹{summary ? summary.total.toLocaleString('en-IN') : '0'}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-[#ffdf9c] font-semibold text-xs sm:text-sm px-7 py-3 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.98]"
                >
                  Confirm &amp; Place Order
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
