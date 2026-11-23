import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Check
} from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartTotal,
    cartCount,
    couponCode,
    couponDiscount,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [inputCoupon, setInputCoupon] = React.useState('');
  const [couponError, setCouponError] = React.useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = e => {
    e.preventDefault();
    if (!inputCoupon.trim()) return;
    const res = applyCoupon(inputCoupon.trim());
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setInputCoupon('');
    }
  };

  const finalShipping = cartTotal > 1999 || cartTotal === 0 ? 0 : 150;
  const finalTotal = Math.max(0, cartTotal + finalShipping - couponDiscount);

  if (cart.length === 0) {
    return (
      <div className="bg-[#f9f9f7] min-h-[70vh] py-12 sm:py-16 flex items-center">
        <div className="site-container max-w-xl mx-auto text-center bg-white p-6 sm:p-12 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <ShoppingBag className="w-7 h-7 sm:w-8 sm:h-8" />
          </div>
          <h2 className="font-['Manrope'] font-bold text-xl sm:text-2xl text-black">Your Cart is Empty</h2>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-2 mb-6 leading-relaxed">
            Explore our professional marble polishing powders, tile adhesives, and diamond accessories.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-[#ffdf9c] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-xl hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-6 sm:py-12">
      <div className="site-container">
        
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="font-['Manrope'] font-bold text-xl sm:text-3xl text-black tracking-tight">
            Shopping Cart ({cartCount} {cartCount === 1 ? 'item' : 'items'})
          </h1>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-1">
            Free shipping automatically applied for orders over ₹1,999.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          
          {/* Cart Items List (8 cols on lg, full width on mobile) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#e2e3e1] shadow-2xs divide-y divide-neutral-100 overflow-hidden">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-5 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                  
                  {/* Thumbnail & Product Info */}
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Link
                      to={`/product/${item.id}`}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-neutral-50 border border-neutral-200 p-1.5 flex-shrink-0 flex items-center justify-center overflow-hidden"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </Link>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider truncate">
                        {item.brand}
                      </span>
                      <Link
                        to={`/product/${item.id}`}
                        className="font-['Manrope'] font-semibold text-xs sm:text-sm text-black hover:underline line-clamp-2 leading-snug"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        <span className="font-bold text-black">₹{item.price.toLocaleString('en-IN')}</span>
                        {item.size && <span>• {item.size}</span>}
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Item Subtotal Row */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
                    <div className="flex items-center border border-neutral-300 rounded-lg overflow-hidden bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 sm:p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 sm:w-9 text-center text-xs font-bold text-black">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 sm:p-2 text-neutral-500 hover:text-black hover:bg-neutral-100 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className="font-['Manrope'] font-bold text-sm sm:text-base text-black block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-neutral-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove Item"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            {/* Trust Features Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 p-4 bg-white rounded-2xl border border-[#e2e3e1] text-center text-[10px] sm:text-xs text-neutral-600">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-neutral-900">100% Genuine</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-neutral-800" />
                <span className="font-bold text-neutral-900">Express Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RotateCcw className="w-4 h-4 text-amber-700" />
                <span className="font-bold text-neutral-900">7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Cart Summary & Checkout Sidebar (4 cols on lg, full width on mobile) */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl border border-[#e2e3e1] shadow-2xs space-y-5">
            <h3 className="font-['Manrope'] font-bold text-base sm:text-lg text-black pb-3 border-b border-neutral-100">
              Order Summary
            </h3>

            {/* Coupon Code Section */}
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1.5 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-amber-600" />
                <span>Have a discount coupon?</span>
              </label>

              {couponCode ? (
                <div className="flex items-center justify-between p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="font-bold">{couponCode} applied</span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-rose-600 font-semibold hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={inputCoupon}
                    onChange={e => setInputCoupon(e.target.value)}
                    placeholder="e.g. STONE10"
                    className="flex-1 bg-[#f9f9f7] uppercase font-mono px-3 py-2 rounded-xl border border-neutral-300 text-xs focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-[#ffdf9c] rounded-xl font-bold text-xs hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-neutral-600 pt-3 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Items Subtotal:</span>
                <span className="font-semibold text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>

              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Discount:</span>
                  <span className="font-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>Estimated Shipping:</span>
                <span className="font-semibold text-black">
                  {finalShipping === 0 ? (
                    <span className="text-emerald-700 font-bold uppercase text-[11px]">FREE</span>
                  ) : (
                    `₹${finalShipping}`
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-3 border-t border-neutral-200 text-base font-bold text-black">
                <span>Total Amount:</span>
                <span className="font-['Manrope'] text-lg sm:text-xl">
                  ₹{finalTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Checkout Action */}
            <div className="pt-2">
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black hover:bg-neutral-900 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer active:scale-98"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
