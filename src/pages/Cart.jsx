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
  Tag
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
      <div className="bg-[#f9f9f7] min-h-[70vh] py-16 flex items-center">
        <div className="site-container max-w-xl mx-auto text-center bg-white p-8 sm:p-12 rounded-2xl border border-[#e2e3e1] shadow-2xs">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4 text-neutral-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h2 className="font-['Manrope'] font-bold text-2xl text-black">Your Cart is Empty</h2>
          <p className="font-['Inter'] text-xs sm:text-sm text-neutral-500 mt-2 mb-6">
            Explore our professional marble polishing powders, tile adhesives, and diamond accessories.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 bg-black text-[#ffdf9c] font-semibold text-xs sm:text-sm px-6 py-3.5 rounded-lg hover:bg-neutral-800 transition-colors shadow-xs"
          >
            <span>Explore All Products</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9f9f7] min-h-screen py-8 sm:py-12">
      <div className="site-container">
        <div className="mb-6 sm:mb-8">
          <h1 className="font-['Manrope'] font-bold text-2xl sm:text-3xl text-black tracking-tight">
            Shopping Cart ({cartCount} items)
          </h1>
          <p className="font-['Inter'] text-xs text-neutral-500 mt-1">
            Free shipping automatically applied for orders over ₹1,999.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Items List (8 cols) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-[#e2e3e1] shadow-2xs divide-y divide-neutral-100 overflow-hidden">
              {cart.map(item => (
                <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <Link to={`/product/${item.id}`} className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl bg-neutral-50 border border-neutral-200 p-2 flex-shrink-0 flex items-center justify-center">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain" />
                    </Link>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-neutral-400 block tracking-wider">
                        {item.brand}
                      </span>
                      <Link to={`/product/${item.id}`} className="font-['Manrope'] font-semibold text-sm sm:text-base text-black hover:underline line-clamp-2">
                        {item.name}
                      </Link>
                      <div className="flex items-center gap-2 mt-1 text-xs text-neutral-500">
                        {item.size && <span>Size: <strong className="text-neutral-800">{item.size}</strong></span>}
                        <span>•</span>
                        <span className="text-black font-semibold">₹{item.price.toLocaleString('en-IN')} each</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 pl-22 sm:pl-0">
                    <div className="flex items-center border border-neutral-300 rounded-lg bg-white">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-3 sm:px-4 text-xs sm:text-sm font-bold text-black min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 sm:p-2 text-neutral-600 hover:bg-neutral-100 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right min-w-[80px]">
                      <span className="font-['Manrope'] font-bold text-sm sm:text-base text-black block">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-rose-600 hover:underline inline-flex items-center gap-1 mt-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2">
              <Link to="/products" className="text-xs font-semibold text-neutral-600 hover:text-black flex items-center gap-1">
                <span>← Continue Shopping</span>
              </Link>
            </div>
          </div>

          {/* Order Summary & Checkout Box (4 cols) */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-white rounded-2xl p-6 border border-[#e2e3e1] shadow-2xs space-y-4">
              <h3 className="font-['Manrope'] font-bold text-lg text-black border-b border-neutral-100 pb-3">
                Order Summary
              </h3>

              {/* Coupon Form */}
              <div>
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Coupon (e.g. STONE10)"
                      value={inputCoupon}
                      onChange={e => setInputCoupon(e.target.value)}
                      className="w-full bg-[#f9f9f7] pl-8 pr-3 py-2 text-xs border border-neutral-300 rounded-lg focus:outline-none focus:border-black uppercase font-medium"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-neutral-900 text-white text-xs font-semibold px-4 py-2 rounded-lg hover:bg-black transition-colors"
                  >
                    Apply
                  </button>
                </form>
                {couponError && <p className="text-[11px] text-rose-600 mt-1">{couponError}</p>}
                {couponCode && (
                  <div className="flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg mt-2">
                    <span>Coupon <strong>{couponCode}</strong> applied</span>
                    <button onClick={removeCoupon} className="text-rose-600 hover:underline text-[11px]">Remove</button>
                  </div>
                )}
              </div>

              {/* Cost Rows */}
              <div className="space-y-2 text-xs sm:text-sm font-['Inter'] pt-2 border-t border-neutral-100 text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-black">₹{cartTotal.toLocaleString('en-IN')}</span>
                </div>
                {couponDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-semibold">-₹{couponDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Standard Shipping</span>
                  <span className="font-semibold text-black">
                    {finalShipping === 0 ? <strong className="text-emerald-700">FREE</strong> : `₹${finalShipping}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-neutral-200 text-base sm:text-lg font-bold text-black font-['Manrope']">
                  <span>Total Payable</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <div className="pt-2">
                <button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-black hover:bg-neutral-800 text-[#ffdf9c] font-bold text-xs sm:text-sm py-3.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-3 border-t border-neutral-100 text-[11px] text-neutral-500 space-y-1.5">
                <p className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Secure Checkout with UPI, Cards &amp; NetBanking</span>
                </p>
                <p className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-neutral-700 flex-shrink-0" />
                  <span>Insured shipping with verified door-to-door tracking</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
