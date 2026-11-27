import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Search,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Calendar,
  Check
} from 'lucide-react';
import { trackOrderApi } from '../services/api';
import businessConfig from '../config/businessConfig';

export default function TrackOrder() {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';

  const [orderNumber, setOrderNumber] = useState(initialOrderId);
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTrackData = async (num, ph = '') => {
    if (!num.trim()) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const data = await trackOrderApi(num.trim(), ph.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'No tracking information found for this order ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTrackData(initialOrderId);
    }
  }, [initialOrderId]);

  const handleTrack = e => {
    e.preventDefault();
    fetchTrackData(orderNumber, phone);
  };

  const steps = [
    { title: 'Order Placed', desc: 'Order successfully placed.' },
    { title: 'Confirmed', desc: 'Order verified & accepted.' },
    { title: 'Processing', desc: 'Products prepared & packaged.' },
    { title: 'Shipped', desc: 'Dispatched to delivery partner.' },
    { title: 'Out for Delivery', desc: 'Courier out for delivery.' },
    { title: 'Delivered', desc: 'Successfully delivered.' }
  ];

  const currentIdx = order ? steps.findIndex(s => s.title === order.orderStatus) : 0;

  const getStatusBadge = status => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Out for Delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Shipped':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Confirmed':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'Cancelled':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'Order Placed':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-300';
    }
  };

  return (
    <div className="bg-[#f9f9f7] min-h-[calc(100vh-220px)] py-10 sm:py-14 md:py-16">
      {/* Centered Main Page Container (bounded max-w around 950px - 1000px) */}
      <div className="w-[94%] max-w-[960px] mx-auto space-y-6 sm:space-y-8">
        
        {/* Track Order Header */}
        <div className="text-center max-w-lg mx-auto">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#b8862d] bg-[#fbf3dc] px-3.5 py-1 rounded-full inline-block mb-2.5 border border-[#eedc9e]">
            ORDER STATUS &amp; DISPATCH
          </span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-[#111111] tracking-tight">
            Track Your Order
          </h1>
          <p className="font-['Inter'] text-xs sm:text-[13px] text-neutral-500 mt-1.5 leading-relaxed">
            Enter your Order ID (from your confirmation screen or SMS) to check live status.
          </p>
        </div>

        {/* Order Search Form Card (max-w around 860px centered) */}
        <div className="max-w-[880px] mx-auto w-full bg-white rounded-2xl p-5 sm:p-7 border border-[#e2e3e1] shadow-2xs hover:shadow-xs transition-shadow">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Order Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. NSC-2026-83829"
                    value={orderNumber}
                    onChange={e => setOrderNumber(e.target.value)}
                    className="w-full h-[46px] bg-[#fbfbfa] px-3.5 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white uppercase font-mono transition-all text-neutral-900 placeholder:text-neutral-400 placeholder:font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1.5">
                  Registered Mobile Number (Optional verification)
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full h-[46px] bg-[#fbfbfa] px-3.5 text-xs sm:text-sm rounded-xl border border-neutral-300 focus:outline-none focus:border-black focus:bg-white transition-all text-neutral-900 placeholder:text-neutral-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[48px] bg-[#111111] hover:bg-black text-[#ffdf9c] font-['Manrope'] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98 disabled:opacity-60 border border-neutral-800"
            >
              <Search className="w-4 h-4 text-[#ffdf9c]" />
              <span>{loading ? 'Searching...' : 'Check Status'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Order Results Section (matches 880px max-w card) */}
        {order && (
          <div className="max-w-[880px] mx-auto w-full bg-white rounded-2xl p-5 sm:p-7 border border-[#e2e3e1] shadow-2xs space-y-6 animate-in fade-in duration-200">
            
            {/* Order Top Meta Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-3">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Order Reference
                </span>
                <span className="font-mono font-bold text-base sm:text-lg text-black block mt-0.5">
                  {order.orderNumber}
                </span>
                <span className="text-[11px] text-neutral-500 block mt-0.5">
                  Placed on {order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                  }) : 'Recent'}
                </span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                  Order Status
                </span>
                <span className={`inline-block border px-3 py-1 rounded-full text-xs font-bold mt-1 ${getStatusBadge(order.orderStatus)}`}>
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Visual Order Tracking Timeline */}
            <div className="p-4 sm:p-6 bg-[#fbfbfa] rounded-2xl border border-neutral-200/90 space-y-3">
              <h3 className="font-['Manrope'] font-bold text-xs uppercase tracking-wider text-neutral-600">
                Live Shipment Timeline
              </h3>

              {order.orderStatus === 'Cancelled' ? (
                <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-center text-xs text-rose-700 space-y-1">
                  <AlertCircle className="w-6 h-6 text-rose-600 mx-auto mb-1" />
                  <p className="font-bold text-sm text-rose-800">This order has been cancelled.</p>
                  {order.cancellationReason && (
                    <p className="text-[11px] text-rose-700">Reason: {order.cancellationReason}</p>
                  )}
                  {order.cancelledAt && (
                    <p className="text-[11px] text-rose-500">
                      Cancelled on {new Date(order.cancelledAt).toLocaleString('en-IN')}
                    </p>
                  )}
                </div>
              ) : (
                <>
                  {/* Desktop Horizontal Stepper (hidden on mobile) */}
                  <div className="hidden sm:grid grid-cols-6 gap-2 text-center text-xs pt-3">
                    {steps.map((st, i) => {
                      const isDone = currentIdx !== -1 && i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      const hist = order.statusHistory?.find(h => h.status === st.title);

                      return (
                        <div key={st.title} className="flex flex-col items-center">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs mb-1.5 transition-all ${
                              isDone
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'bg-neutral-200 text-neutral-400'
                            } ${isCurrent ? 'ring-3 ring-[#ffdf9c]' : ''}`}
                          >
                            {isDone ? <CheckCircle2 className="w-5 h-5 text-white" /> : i + 1}
                          </div>
                          <span className={`text-xs font-bold leading-tight ${isDone ? 'text-black' : 'text-neutral-400'}`}>
                            {st.title}
                          </span>
                          <span className="text-[10px] text-neutral-500 mt-0.5 leading-snug">
                            {st.desc}
                          </span>
                          {hist?.updatedAt && isDone && (
                            <span className="text-[9px] text-neutral-400 mt-1 font-mono">
                              {new Date(hist.updatedAt).toLocaleDateString('en-IN', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Stepper (hidden on desktop) */}
                  <div className="sm:hidden space-y-4 pt-1">
                    {steps.map((st, i) => {
                      const isDone = currentIdx !== -1 && i <= currentIdx;
                      const isCurrent = i === currentIdx;
                      const hist = order.statusHistory?.find(h => h.status === st.title);

                      return (
                        <div key={st.title} className="flex items-start gap-3">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                              isDone
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                            } ${isCurrent ? 'ring-2 ring-[#ffdf9c]' : ''}`}
                          >
                            {isDone ? <CheckCircle2 className="w-4 h-4 text-white" /> : i + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className={`text-xs font-bold ${isDone ? 'text-black' : 'text-neutral-400'}`}>
                                {st.title}
                              </span>
                              {hist?.updatedAt && isDone && (
                                <span className="text-[10px] text-neutral-400 font-mono">
                                  {new Date(hist.updatedAt).toLocaleDateString('en-IN', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-neutral-500 mt-0.5 leading-snug">
                              {st.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {order.trackingNumber && (
                <div className="mt-3 pt-3 border-t border-neutral-200/80 flex items-center justify-between text-xs text-neutral-600">
                  <span>Courier AWB Tracking Number:</span>
                  <span className="font-mono font-bold text-black">{order.trackingNumber}</span>
                </div>
              )}
            </div>

            {/* Customer & Shipping Destination Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Customer Info */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
                <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Customer Contact</span>
                </h4>
                <p className="font-bold text-black text-sm">{order.customerName || order.shippingAddress?.fullName}</p>
                <p className="text-neutral-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-neutral-400" />
                  <span>{order.phone || order.shippingAddress?.phone}</span>
                </p>
                {order.guestEmail && (
                  <p className="text-neutral-600 flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-neutral-400" />
                    <span>{order.guestEmail}</span>
                  </p>
                )}
              </div>

              {/* Delivery Address */}
              <div className="p-4 rounded-xl border border-neutral-200 bg-white space-y-1.5">
                <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Delivery Address</span>
                </h4>
                {order.shippingAddress ? (
                  <div className="text-neutral-700 leading-relaxed">
                    <p className="font-semibold text-black">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                    {order.shippingAddress.area && <p>{order.shippingAddress.area}</p>}
                    <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  </div>
                ) : (
                  <p className="text-neutral-400 italic">No delivery address specified</p>
                )}
              </div>

            </div>

            {/* Ordered Products Section */}
            {order.orderItems && order.orderItems.length > 0 && (
              <div className="space-y-2 text-xs">
                <h4 className="font-bold text-neutral-500 uppercase tracking-wider text-[11px]">
                  Ordered Products ({order.orderItems.length})
                </h4>
                <div className="divide-y divide-neutral-100 border border-neutral-200 rounded-xl overflow-hidden bg-white">
                  {order.orderItems.map((item, idx) => (
                    <div key={idx} className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/50">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-neutral-50 border border-neutral-200 p-1 flex-shrink-0 flex items-center justify-center">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package className="w-5 h-5 text-neutral-300" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-black truncate">{item.name}</p>
                          <p className="text-[11px] text-neutral-500">
                            Qty: <strong className="text-neutral-800">{item.quantity}</strong> × ₹{(item.price || 0).toLocaleString('en-IN')}
                            {item.size && ` • ${item.size}`}
                          </p>
                        </div>
                      </div>
                      <span className="font-bold text-black font-['Manrope'] whitespace-nowrap">
                        ₹{((item.price || 0) * (item.quantity || 1)).toLocaleString('en-IN')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Price & Payment Summary */}
            <div className="p-4 rounded-xl border border-neutral-200 bg-[#fbfbfa] space-y-2 text-xs">
              <div className="flex justify-between items-center text-neutral-600">
                <span>Payment Method:</span>
                <span className="font-semibold text-black">
                  {order.paymentMethod || 'COD'} ({order.paymentStatus || 'Pending'})
                </span>
              </div>
              <div className="flex justify-between items-center text-neutral-600">
                <span>Subtotal:</span>
                <span className="font-semibold text-black">₹{(order.itemsPrice || 0).toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between items-center text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between items-center text-neutral-600">
                <span>Delivery Charges:</span>
                <span className="font-semibold text-black">
                  {order.shippingPrice === 0 ? 'FREE' : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-neutral-200 font-bold text-sm text-black">
                <span>Total Amount:</span>
                <span className="font-['Manrope'] text-base font-extrabold text-[#b8862d]">
                  ₹{(order.totalPrice || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Assistance Note */}
            <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span>Need immediate assistance with your dispatch?</span>
              <a
                href={businessConfig.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#b8862d] font-bold hover:underline inline-flex items-center gap-1"
              >
                Chat on WhatsApp ({businessConfig.phone}) →
              </a>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
