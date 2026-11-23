import React, { useState } from 'react';
import { Search, Truck, Package, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { trackOrderApi } from '../services/api';
import businessConfig from '../config/businessConfig';

export default function TrackOrder() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTrack = async e => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const data = await trackOrderApi(orderNumber.trim(), phone.trim());
      setOrder(data);
    } catch (err) {
      setError(err.message || 'No tracking information found for this order ID.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    'Order Placed',
    'Confirmed',
    'Processing',
    'Shipped',
    'Out for Delivery',
    'Delivered'
  ];

  const currentIdx = order ? steps.indexOf(order.orderStatus || 'Order Placed') : 0;

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-16">
      <div className="site-container max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full inline-block mb-2">
            Order Status &amp; Dispatch
          </span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black">
            Track Your Order
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-1">
            Enter your Order ID (from your confirmation screen or SMS) to check live status.
          </p>
        </div>

        {/* Tracking Search Form */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e3e1] shadow-2xs mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. NSC-2025-10492"
                value={orderNumber}
                onChange={e => setOrderNumber(e.target.value)}
                className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black uppercase font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Registered Mobile Number (Optional verification)
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full bg-[#f9f9f7] text-xs sm:text-sm p-3 rounded-lg border border-neutral-300 focus:outline-none focus:border-black"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-black text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 rounded-xl hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Check Status'}</span>
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Tracking Results Card */}
        {order && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e3e1] shadow-2xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
              <div>
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Order</span>
                <span className="font-mono font-bold text-base text-black">{order.orderNumber}</span>
              </div>
              <div className="sm:text-right">
                <span className="text-[10px] uppercase font-bold text-neutral-400 block">Status</span>
                <span className="inline-block bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded text-xs font-bold">
                  {order.orderStatus}
                </span>
              </div>
            </div>

            {/* Stepper */}
            <div className="relative pt-2">
              <div className="space-y-4">
                {steps.map((st, i) => {
                  const isDone = i <= currentIdx;
                  return (
                    <div key={st} className="flex items-center gap-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-600 text-white'
                            : 'bg-neutral-100 text-neutral-400 border border-neutral-300'
                        }`}
                      >
                        {isDone ? '✓' : i + 1}
                      </div>
                      <span className={`text-xs sm:text-sm font-['Inter'] ${isDone ? 'font-bold text-black' : 'text-neutral-400'}`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {order.trackingNumber && (
              <div className="p-3 bg-neutral-50 rounded-lg text-xs text-neutral-600 flex items-center justify-between">
                <span>Shipping AWB Tracking:</span>
                <span className="font-mono font-bold text-black">{order.trackingNumber}</span>
              </div>
            )}

            <div className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-100">
              Need immediate order assistance? Chat directly on{' '}
              <a href={businessConfig.whatsappUrl} target="_blank" rel="noopener noreferrer" className="text-emerald-700 font-bold underline">
                WhatsApp ({businessConfig.phone})
              </a>.
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
