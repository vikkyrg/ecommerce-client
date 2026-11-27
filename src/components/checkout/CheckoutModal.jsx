import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, CheckCircle2, ShieldCheck, CreditCard, Truck, Package, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { createOrder } from '../../services/api';

export default function CheckoutModal({ isOpen, onClose, summary }) {
  const { cart, cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const activeCart = cart && cart.length > 0 ? cart : cartItems || [];
  const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    name: defaultAddr?.fullName || user?.name || '',
    email: user?.email || '',
    phone: defaultAddr?.phone || user?.phone || '',
    address: defaultAddr ? `${defaultAddr.house || ''}, ${defaultAddr.street || ''}` : '',
    city: defaultAddr?.city || 'Bangalore',
    state: defaultAddr?.state || 'Karnataka',
    pincode: defaultAddr?.pincode || '560001',
    paymentMethod: 'UPI'
  });
  const [isSuccess, setIsSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState('');

  if (!isOpen) return null;

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError('');

    try {
      const orderPayload = {
        userId: user?._id || user?.id,
        customerName: formData.name,
        phone: formData.phone,
        guestEmail: formData.email,
        orderItems: activeCart.map(item => ({
          product: item.id || item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: {
          fullName: formData.name,
          phone: formData.phone,
          house: formData.address,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          addressType: 'Home'
        },
        paymentMethod: formData.paymentMethod.toUpperCase(),
        itemsPrice: summary ? summary.subtotal : activeCart.reduce((s, i) => s + (i.price * i.quantity), 0),
        shippingPrice: summary ? summary.shipping : 0,
        discountAmount: summary ? summary.discount : 0,
        totalPrice: summary ? summary.total : activeCart.reduce((s, i) => s + (i.price * i.quantity), 0)
      };

      const result = await createOrder(orderPayload);
      setPlacedOrder(result);
      setIsSuccess(true);
      clearCart();
    } catch (err) {
      setOrderError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                Your order <span className="font-bold text-black">{placedOrder?.orderNumber || 'NSC-CONFIRMED'}</span> has been placed and saved to your account.
              </p>

              <div className="bg-neutral-50 p-4 rounded-xl border border-neutral-200 max-w-sm mx-auto text-left text-xs space-y-1.5 mt-4">
                <p><span className="text-neutral-500">Order ID:</span> <span className="font-mono font-bold text-black">{placedOrder?.orderNumber}</span></p>
                <p><span className="text-neutral-500">Recipient:</span> <span className="font-semibold text-black">{formData.name}</span></p>
                <p><span className="text-neutral-500">Phone:</span> <span className="font-semibold text-black">{formData.phone}</span></p>
                <p><span className="text-neutral-500">Address:</span> <span className="font-semibold text-black">{formData.address}, {formData.city}, {formData.state} - {formData.pincode}</span></p>
                <p><span className="text-neutral-500">Total Paid:</span> <span className="font-bold text-black">₹{placedOrder?.totalPrice?.toLocaleString('en-IN') || (summary ? summary.total : 0)}</span></p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => {
                    onClose();
                    navigate('/account?tab=orders');
                  }}
                  className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-[#ffdf9c] font-semibold text-xs px-6 py-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Package className="w-4 h-4" />
                  <span>View My Orders</span>
                </button>
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-semibold text-xs px-6 py-3 rounded-xl transition-colors cursor-pointer"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {orderError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
                  {orderError}
                </div>
              )}
              
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
                  disabled={isSubmitting}
                  className="w-full sm:w-auto bg-black hover:bg-neutral-800 text-[#ffdf9c] font-semibold text-xs sm:text-sm px-7 py-3 rounded-lg transition-colors cursor-pointer shadow-xs active:scale-[0.98] disabled:opacity-60"
                >
                  {isSubmitting ? 'Placing Order...' : 'Confirm & Place Order'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
