import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { Coupon, WebsiteSettings } from '../types';
import { Trash2, ShieldCheck, Ticket, ArrowRight, ShoppingBag, Edit, ArrowLeft, RefreshCw } from 'lucide-react';

interface ClientCartProps {
  setView: (view: string, params?: any) => void;
  settings: WebsiteSettings;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
}

export default function ClientCart({ setView, settings, appliedCoupon, setAppliedCoupon }: ClientCartProps) {
  const { cart, updateCartQty, removeFromCart, clearCart, cartTotal } = useStore();
  const [couponCode, setCouponCode] = useState(appliedCoupon?.code || '');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState(appliedCoupon ? 'Voucher applied successfully!' : '');
  const [couponLoading, setCouponLoading] = useState(false);

  const user = api.getCurrentUser();

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    setCouponSuccess('');
    
    if (!couponCode.trim()) return;
    setCouponLoading(true);

    try {
      const coupon = await api.validateCoupon(couponCode, cartTotal);
      setAppliedCoupon(coupon);
      setCouponSuccess(`Voucher Applied! ৳${coupon.value}${coupon.discountType === 'percentage' ? '%' : ''} discount applied.`);
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponSuccess('');
    setCouponError('');
  };

  // Calculations
  const shipping = cart.length > 0 ? settings.shippingFlatRate : 0;
  
  let discountValue = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'percentage') {
      discountValue = Math.round((cartTotal * appliedCoupon.value) / 100);
    } else {
      discountValue = appliedCoupon.value;
    }
  }

  const tax = Math.round(((cartTotal - discountValue) * settings.taxPercentage) / 100);
  const grandTotal = Math.max(0, cartTotal - discountValue + shipping + tax);

  const handleCheckoutRedirect = () => {
    setView('checkout');
  };

  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
          <ShoppingBag className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your Cart is Empty</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          You haven't loaded any premium devices to your cart yet. Explore our latest gadgets and tech accessories now!
        </p>
        <button
          onClick={() => setView('shop')}
          className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          Explore Shop
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Redesigned Header to match screenshot */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3.5">
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">Cart</h1>
          <p className="text-xs text-gray-400">Review and configure your devices</p>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition-colors"
          title="Empty entire cart"
        >
          <Trash2 className="h-4 w-4" />
          Clear All
        </button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="space-y-3.5">
            {cart.map((item) => (
              <div 
                key={`${item.productId}-${item.selectedVariant || ''}`} 
                className="p-4 bg-white rounded-2xl border border-gray-100 shadow-xs hover:border-gray-200 transition-all flex flex-col sm:flex-row gap-4 items-start sm:items-center"
              >
                {/* Thumb image */}
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-gray-50 shrink-0 border border-gray-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>

                {/* Title, variant and Actions */}
                <div className="flex-1 w-full space-y-1">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-xs font-black text-gray-900 line-clamp-1">{item.name}</h4>
                      {item.selectedVariant ? (
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
                          {item.selectedVariant}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider mt-0.5">
                          Standard Edition
                        </p>
                      )}
                    </div>
                    <span className="text-xs font-black text-neutral-900 shrink-0">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5">
                    {/* Edit Option Action (Returns to details to configure) */}
                    <button
                      onClick={() => setView('product-details', { productId: item.productId })}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      <Edit className="h-3 w-3" />
                      Edit Details
                    </button>

                    <div className="flex items-center gap-3">
                      {/* Quantity adjustments */}
                      <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-1">
                        <button
                          onClick={() => updateCartQty(item.productId, item.quantity - 1, item.selectedVariant)}
                          className="h-7 w-7 text-xs font-black hover:bg-white rounded-lg transition-colors"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-black text-neutral-800">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQty(item.productId, item.quantity + 1, item.selectedVariant)}
                          className="h-7 w-7 text-xs font-black hover:bg-white rounded-lg transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Trash action */}
                      <button
                        onClick={() => (removeFromCart as any)(item.productId, item.selectedVariant)}
                        className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors cursor-pointer"
                        title="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Back To Shop link */}
          <div className="pt-2 px-1">
            <button
              onClick={() => setView('shop')}
              className="inline-flex items-center gap-1 text-xs font-black text-blue-600 hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </button>
          </div>
        </div>

        {/* Order checkout totals card */}
        <div className="space-y-6">
          {/* Coupon / Voucher block redesigned as beautiful pill container */}
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-xs space-y-3.5">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Promo Code</h3>
            
            {appliedCoupon ? (
              <div className="rounded-xl bg-green-50 p-3.5 flex items-center justify-between border border-green-100">
                <div>
                  <p className="text-xs font-black text-green-900 flex items-center gap-1.5">
                    <Ticket className="h-4 w-4 text-green-600" />
                    Code: {appliedCoupon.code}
                  </p>
                  <p className="text-[10px] text-green-700 font-medium mt-0.5">Applied successfully!</p>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  className="text-xs font-black text-red-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="relative flex items-center rounded-full border border-gray-200 bg-gray-50/50 p-1 pl-3.5 focus-within:bg-white focus-within:border-blue-500 transition-all">
                  <Ticket className="h-4 w-4 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter Promo Code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full bg-transparent px-3 py-1.5 text-xs focus:outline-none uppercase font-mono font-bold text-neutral-800"
                  />
                  <button
                    type="submit"
                    disabled={couponLoading}
                    className="h-8 w-8 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white shrink-0 transition-colors disabled:bg-neutral-300"
                    title="Apply Promo Code"
                  >
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
                {couponError && <p className="text-[10px] font-black text-red-600 px-1">{couponError}</p>}
                {couponSuccess && <p className="text-[10px] font-black text-green-600 px-1">{couponSuccess}</p>}
              </form>
            )}
          </div>

          {/* Checkout Totals Summary */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-800">Checkout Summary</h3>
            
            <div className="space-y-3 text-xs border-b border-gray-100 pb-4">
              <div className="flex justify-between text-gray-400 font-bold">
                <span>Sub Total</span>
                <span className="text-neutral-900">৳{cartTotal.toLocaleString()}</span>
              </div>

              {discountValue > 0 && (
                <div className="flex justify-between text-green-600 font-black">
                  <span>Discount</span>
                  <span>-৳{discountValue.toLocaleString()}</span>
                </div>
              )}

              <div className="flex justify-between text-gray-400 font-bold">
                <span>Shipping & Tax</span>
                <span className="text-neutral-900">৳{(shipping + tax).toLocaleString()}</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-black uppercase tracking-wider text-neutral-800">Total</span>
              <span className="text-lg font-black text-blue-600">৳{grandTotal.toLocaleString()}</span>
            </div>

            <button
              onClick={handleCheckoutRedirect}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 py-3.5 text-sm font-black text-white transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer shadow-md shadow-blue-100"
            >
              Checkout
            </button>

            <p className="text-[9px] text-center text-gray-400 mt-2 flex items-center justify-center gap-1 uppercase tracking-wider font-extrabold">
              <ShieldCheck className="h-3.5 w-3.5 text-green-600 fill-current shrink-0" />
              Secure Checkout certified by SSLCommerz
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
