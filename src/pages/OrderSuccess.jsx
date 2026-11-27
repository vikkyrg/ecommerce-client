import React, { useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Copy,
  Check
} from 'lucide-react';
import { fetchOrderById } from '../services/api';
import businessConfig from '../config/businessConfig';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!order && orderId) {
      fetchOrderById(orderId)
        .then(data => setOrder(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [orderId, order]);

  const handleCopyOrder = () => {
    const num = order?.orderNumber || orderId;
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-10 sm:py-16">
      <div className="site-container max-w-3xl mx-auto">
        
        {/* Success Banner */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 border border-[#e2e3e1] shadow-2xs text-center space-y-4 mb-8">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full inline-block">
            Order Confirmed &amp; Processing
          </span>
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black">
            Thank You for Your Order!
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-600 max-w-lg mx-auto leading-relaxed">
            We have received your order. Our warehouse team is preparing your package with genuine materials and careful packing for secure transit.
          </p>

          {/* Order Details Badge */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <div className="bg-neutral-100 border border-neutral-300 px-4 py-2 rounded-lg font-mono text-xs sm:text-sm font-bold text-neutral-900 flex items-center gap-2">
              <span>Order ID: {order?.orderNumber || orderId}</span>
              <button
                onClick={handleCopyOrder}
                className="text-neutral-500 hover:text-black cursor-pointer"
                title="Copy order number"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Order Details Summary */}
        {order && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#e2e3e1] shadow-2xs space-y-6 mb-8">
            <h3 className="font-['Manrope'] font-bold text-base sm:text-lg text-black border-b border-neutral-100 pb-3 flex items-center justify-between">
              <span>Order Summary</span>
              <span className="text-xs font-normal text-neutral-500">
                Payment: <strong className="text-black">{order.paymentMethod} ({order.paymentStatus || 'Completed'})</strong>
              </span>
            </h3>

            {/* Products List */}
            <div className="divide-y divide-neutral-100">
              {order.orderItems?.map((item, idx) => (
                <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                  <div className="flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-contain rounded border border-neutral-200 p-1" />
                    <div>
                      <p className="font-semibold text-black line-clamp-1">{item.name}</p>
                      <p className="text-[11px] text-neutral-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold text-black">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div className="pt-3 border-t border-neutral-100 space-y-1.5 text-xs text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-semibold text-black">₹{(order.itemsPrice || 0).toLocaleString('en-IN')}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount:</span>
                  <span className="font-semibold">-₹{order.discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span className="font-semibold text-black">
                  {order.shippingPrice === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${order.shippingPrice}`}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-neutral-200 text-base font-bold text-black font-['Manrope']">
                <span>Total Amount:</span>
                <span>₹{(order.totalPrice || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Delivery Address */}
            {order.shippingAddress && (
              <div className="pt-4 border-t border-neutral-100 text-xs text-neutral-600 bg-neutral-50 p-4 rounded-xl">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                  Shipping Destination
                </span>
                <p className="font-bold text-black">{order.shippingAddress.fullName} ({order.shippingAddress.phone})</p>
                <p>{order.shippingAddress.house}, {order.shippingAddress.street}</p>
                <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
              </div>
            )}
          </div>
        )}

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/account?tab=orders"
            className="w-full sm:w-auto bg-black text-[#ffdf9c] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-neutral-800 transition-colors inline-flex items-center justify-center gap-2 shadow-xs"
          >
            <Package className="w-4 h-4" />
            <span>View My Orders</span>
          </Link>

          <Link
            to="/products"
            className="w-full sm:w-auto bg-white text-neutral-800 border border-neutral-300 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-neutral-50 transition-colors inline-flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/track-order"
            className="w-full sm:w-auto bg-neutral-100 text-neutral-700 font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-neutral-200 transition-colors inline-flex items-center justify-center gap-2"
          >
            <Truck className="w-4 h-4 text-neutral-600" />
            <span>Live Tracking</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
