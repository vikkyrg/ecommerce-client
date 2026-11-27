import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';

export default function Checkout() {
  const { cart, cartTotal, couponDiscount, cartStockError, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const defaultAddr = user?.addresses?.find(a => a.isDefault) || user?.addresses?.[0];

  const [formData, setFormData] = useState({
    fullName: defaultAddr?.fullName || user?.name || '',
    email: user?.email || '',
    phone: defaultAddr?.phone || user?.phone || '',
    house: defaultAddr?.house || '',
    street: defaultAddr?.street || '',
    area: defaultAddr?.area || '',
    city: defaultAddr?.city || 'Bangalore',
    state: defaultAddr?.state || 'Karnataka',
    pincode: defaultAddr?.pincode || '560001',
    landmark: defaultAddr?.landmark || '',
    addressType: defaultAddr?.addressType || defaultAddr?.type || 'Home',
    paymentMethod: 'UPI'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const shippingPrice = cartTotal > 1999 || cartTotal === 0 ? 0 : 150;
  const totalPrice = Math.max(0, cartTotal + shippingPrice - couponDiscount);
  const hasUnpricedItems = cart.some(item =>
    item.price === null || item.price === undefined || !Number.isFinite(Number(item.price))
  );

  if (cart.length === 0) {
    return (
      <div className="site-container py-20 text-center">
        <h2 className="font-['Manrope'] font-bold text-2xl text-black">Your Cart is Empty</h2>
        <p className="text-xs text-neutral-500 mt-2 mb-6">Add products before proceeding to checkout.</p>
        <Link to="/products" className="bg-black text-[#ffdf9c] px-6 py-3 rounded-lg text-xs font-semibold">
          Browse Products
        </Link>
      </div>
    );
  }

  if (hasUnpricedItems) {
    return (
      <div className="site-container py-20 text-center">
        <h2 className="font-['Manrope'] font-bold text-2xl text-black">Price confirmation required</h2>
        <p className="text-sm text-neutral-500 mt-2 mb-6">
          Some products do not have a catalog price yet. Remove them or request a quote before checkout.
        </p>
        <Link to="/cart" className="bg-black text-[#ffdf9c] px-6 py-3 rounded-lg text-xs font-semibold">
          Return to Cart
        </Link>
      </div>
    );
  }

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitOrder = async e => {
    e.preventDefault();
    if (cartStockError) {
      setError(cartStockError);
      return;
    }
    setIsSubmitting(true);
    setError('');

    try {
      const orderPayload = {
        userId: user?._id || user?.id,
        customerName: formData.fullName,
        phone: formData.phone,
        guestEmail: formData.email,
        orderItems: cart.map(item => ({
          product: item.id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
          size: item.size
        })),
        shippingAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          house: formData.house,
          street: formData.street,
          area: formData.area,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          landmark: formData.landmark,
          addressType: formData.addressType
        },
        paymentMethod: formData.paymentMethod,
        itemsPrice: cartTotal,
        shippingPrice,
        discountAmount: couponDiscount,
        totalPrice
      };

      const placedOrder = await createOrder(orderPayload);
      clearCart();
      navigate(`/order-success/${placedOrder.orderNumber || placedOrder._id}`, {
        state: { order: placedOrder }
      });
    } catch (err) {
      setError(err.message || 'Failed to place order. Please check your inputs.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 mb-6 font-['Inter']">
          <Link to="/cart" className="hover:text-black">Cart</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-black font-semibold">Checkout</span>
        </div>

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Form: Customer & Shipping Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Contact Information */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e3e1] shadow-2xs space-y-4">
              <h2 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3 flex items-center justify-between">
                <span>1. Contact Information</span>
                <Lock className="w-4 h-4 text-emerald-600" />
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Mobile Number (with WhatsApp) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
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
                  className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Step 2: Delivery Address */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e3e1] shadow-2xs space-y-4">
              <div className="border-b border-neutral-100 pb-3 flex items-center justify-between">
                <h2 className="font-['Manrope'] font-bold text-lg text-black">
                  2. Shipping &amp; Delivery Address
                </h2>
                {user?.addresses && user.addresses.length > 0 && (
                  <span className="text-[11px] font-semibold text-neutral-500">
                    Saved addresses available
                  </span>
                )}
              </div>

              {/* Saved Address Quick Selector */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="space-y-2 mb-4">
                  <label className="block text-xs font-semibold text-neutral-700">
                    Choose from Saved Addresses:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {user.addresses.map((addr, idx) => (
                      <div
                        key={idx}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            fullName: addr.fullName || prev.fullName,
                            phone: addr.phone || prev.phone,
                            house: addr.house || '',
                            street: addr.street || '',
                            city: addr.city || 'Bangalore',
                            state: addr.state || 'Karnataka',
                            pincode: addr.pincode || '560001',
                            addressType: addr.type || addr.addressType || 'Home'
                          }));
                        }}
                        className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                          formData.house === addr.house && formData.pincode === addr.pincode
                            ? 'border-black bg-neutral-50 ring-1 ring-black'
                            : 'border-neutral-200 hover:border-neutral-400 bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-black mb-1">
                          <span>{addr.fullName}</span>
                          <span className="text-[10px] uppercase px-1.5 py-0.2 bg-neutral-200 rounded">
                            {addr.type || addr.addressType || 'Home'}
                          </span>
                        </div>
                        <p className="text-neutral-600 line-clamp-1">{addr.house}, {addr.street}</p>
                        <p className="text-neutral-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Flat / House / Building *</label>
                  <input
                    type="text"
                    name="house"
                    required
                    value={formData.house}
                    onChange={handleChange}
                    placeholder="Flat 302, Green residency"
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Street / Colony *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleChange}
                    placeholder="2nd Main Road, Industrial Layout"
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
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
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">Pincode *</label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    value={formData.pincode}
                    onChange={handleChange}
                    placeholder="560001"
                    className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">Landmark (Optional)</label>
                <input
                  type="text"
                  name="landmark"
                  value={formData.landmark}
                  onChange={handleChange}
                  placeholder="Near Metro Station or landmark"
                  className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Step 3: Payment Method */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#e2e3e1] shadow-2xs space-y-4">
              <h2 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                3. Payment Method
              </h2>

              <div className="space-y-2.5">
                {[
                  { id: 'UPI', label: 'UPI / QR / Instant PhonePe & GPay', desc: 'Fastest direct payment with zero convenience fees' },
                  { id: 'Card', label: 'Credit or Debit Card', desc: 'Visa, MasterCard, RuPay cards supported' },
                  { id: 'NetBanking', label: 'Net Banking', desc: 'All major Indian private and public sector banks' },
                  { id: 'COD', label: 'Cash on Delivery', desc: 'Pay cash upon delivery at your doorstep' }
                ].map(opt => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === opt.id
                        ? 'border-black bg-neutral-50 shadow-2xs'
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={opt.id}
                      checked={formData.paymentMethod === opt.id}
                      onChange={handleChange}
                      className="mt-1"
                    />
                    <div>
                      <span className="font-['Manrope'] font-bold text-xs sm:text-sm text-black block">
                        {opt.label}
                      </span>
                      <span className="text-[11px] text-neutral-500 block mt-0.5">{opt.desc}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Summary: Items & Total (5 cols) - Sticky on Desktop */}
          <div className="lg:col-span-5 lg:sticky lg:top-[96px] self-start space-y-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#e2e3e1] shadow-2xs space-y-4 max-h-[calc(100vh-120px)] overflow-y-auto">
              <h3 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                Order Review ({cart.length} items)
              </h3>

              <div className="divide-y divide-neutral-100 max-h-56 sm:max-h-64 overflow-y-auto pr-1 scrollbar-thin">
                {cart.map(item => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={item.image} alt={item.name} className="w-10 h-10 object-contain rounded border border-neutral-200 p-1 flex-shrink-0" />
                      <div className="min-w-0">
                        <span className="font-semibold text-black line-clamp-1 max-w-[180px]">{item.name}</span>
                        <span className="text-[10px] text-neutral-500">Qty: {item.quantity}</span>
                      </div>
                    </div>
                    <span className="font-bold text-black flex-shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-2 text-xs sm:text-sm pt-3 border-t border-neutral-200">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Coupon Discount</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery Charges</span>
                  <span className="font-semibold text-black">
                    {shippingPrice === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${shippingPrice}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-lg font-bold text-black font-['Manrope']">
                  <span>Total Amount</span>
                  <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {error}
                </div>
              )}
              {cartStockError && (
                <div role="alert" className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                  {cartStockError}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting || Boolean(cartStockError)}
                className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-sm py-4 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span>{isSubmitting ? 'Placing Order...' : `Place Order (₹${totalPrice.toLocaleString('en-IN')})`}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-neutral-400 text-center space-y-1 pt-1">
                <p>By placing this order you agree to our Terms and Shipping Policies.</p>
                <p className="text-emerald-700 font-medium">Safe &amp; Encrypted 256-Bit SSL Checkout</p>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
