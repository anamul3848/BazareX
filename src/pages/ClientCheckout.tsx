import React, { useState, useEffect } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { Coupon, WebsiteSettings, Order } from '../types';
import { ShieldCheck, Truck, CreditCard, Sparkles, Receipt } from 'lucide-react';

interface ClientCheckoutProps {
  setView: (view: string, params?: any) => void;
  settings: WebsiteSettings;
  appliedCoupon: Coupon | null;
  setAppliedCoupon: (coupon: Coupon | null) => void;
  onOrderSuccess: (order: Order) => void;
}

export default function ClientCheckout({ 
  setView, settings, appliedCoupon, setAppliedCoupon, onOrderSuccess 
}: ClientCheckoutProps) {
  const { cart, cartTotal, clearCart } = useStore();
  const user = api.getCurrentUser();

  // Prefill shipping info
  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(user?.address || '');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sslcommerz' | 'bkash' | 'nagad' | 'rocket'>('cod');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // No guest checkout redirect so that guests can check out directly with cash on delivery


  if (cart.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">No Items to Checkout</h2>
        <button onClick={() => setView('shop')} className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-xs font-bold">
          Explore Shop
        </button>
      </div>
    );
  }

  // Cost calculations
  const shipping = settings.shippingFlatRate;
  
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

  const handlePlaceOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!shippingAddress.trim()) {
      setError('Please provide a valid shipping address for prompt nationwide delivery.');
      return;
    }

    if (!customerPhone.trim()) {
      setError('Please provide a mobile contact phone number.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        paymentMethod,
        paymentStatus: (paymentMethod === 'cod' ? 'pending' : 'paid') as 'pending' | 'paid',
        orderStatus: 'pending' as const,
        items: cart.map(item => ({
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          selectedVariant: item.selectedVariant
        })),
        subtotal: cartTotal,
        discount: discountValue,
        couponCode: appliedCoupon?.code,
        shippingCost: shipping,
        tax,
        total: grandTotal
      };

      const completedOrder = await api.createOrder(orderPayload);
      clearCart();
      setAppliedCoupon(null);
      onOrderSuccess(completedOrder);
    } catch (err: any) {
      setError(err.message || 'Failed to submit order. Please retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900 tracking-tight">Checkout Order</h1>
        <p className="text-xs text-gray-400 mt-1">Provide your shipping coordinates and choose a payment method</p>
      </div>

      {!user && (
        <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4.5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <span className="inline-block rounded-md bg-blue-600 text-[10px] font-black uppercase tracking-wider text-white px-2 py-0.5">
              Guest Checkout Active
            </span>
            <p className="text-xs text-gray-600 font-bold">
              You are completing this purchase as a guest. All orders with Cash on Delivery are processed immediately!
            </p>
          </div>
          <button 
            type="button"
            onClick={() => setView('login')}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black px-4.5 py-2.5 transition-colors shrink-0 shadow-md shadow-blue-100"
          >
            Log In or Register
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
          {error}
        </div>
      )}

      <form onSubmit={handlePlaceOrderSubmit} className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Shipping details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Form coordinates */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
              <Truck className="h-4.5 w-4.5 text-blue-600" />
              Shipping Coordinates
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Mobile Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Complete Delivery Address
                </label>
                <input
                  type="text"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  placeholder="Street No, House No, Area Name, City"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Payment Terminal selector */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900 flex items-center gap-2">
              <CreditCard className="h-4.5 w-4.5 text-blue-600" />
              Choose Payment Method
            </h3>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {/* Cash on Delivery */}
              <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-neutral-950 bg-neutral-50/50' : 'border-gray-150 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="sr-only"
                />
                <span className="text-xs font-bold text-gray-800">Cash on Delivery</span>
                <span className="text-[10px] text-gray-400 mt-2">Pay cash when you open your delivery package</span>
              </label>

              {/* bKash Wallet */}
              <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${paymentMethod === 'bkash' ? 'border-pink-600 bg-pink-50/30' : 'border-gray-150 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="sr-only"
                />
                <span className="text-xs font-bold text-pink-600">bKash Mobile Money</span>
                <span className="text-[10px] text-gray-400 mt-2">Pay instantly with digital mobile bKash pin wallet</span>
              </label>

              {/* SSLCommerz Gateway */}
              <label className={`rounded-xl border p-4 flex flex-col justify-between cursor-pointer transition-all ${paymentMethod === 'sslcommerz' ? 'border-blue-600 bg-blue-50/30' : 'border-gray-150 hover:border-gray-300'}`}>
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'sslcommerz'}
                  onChange={() => setPaymentMethod('sslcommerz')}
                  className="sr-only"
                />
                <span className="text-xs font-bold text-blue-600">SSLCommerz Pay</span>
                <span className="text-[10px] text-gray-400 mt-2">Pay securely using Visa, MasterCard, or NetBanking</span>
              </label>
            </div>
          </div>

        </div>

        {/* Totals Summary Column */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6 h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Your Checkout Basket</h3>

          {/* Items summary */}
          <div className="divide-y divide-gray-100 max-h-56 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={`${item.productId}-${item.selectedVariant || ''}`} className="py-2.5 flex justify-between gap-2 text-xs">
                <div>
                  <p className="font-bold text-gray-800 line-clamp-1">{item.name}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Qty: {item.quantity} {item.selectedVariant ? `• ${item.selectedVariant}` : ''}</p>
                </div>
                <span className="font-bold text-gray-950 shrink-0">৳{(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          {/* Pricing break-down */}
          <div className="border-t border-gray-100 pt-4 space-y-2 text-xs text-gray-500">
            <div className="flex justify-between">
              <span>Cart Subtotal</span>
              <span className="font-bold text-gray-800">৳{cartTotal.toLocaleString()}</span>
            </div>

            {discountValue > 0 && (
              <div className="flex justify-between text-green-600 font-bold">
                <span>Voucher Discount</span>
                <span>-৳{discountValue.toLocaleString()}</span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Nationwide Shipping</span>
              <span className="font-bold text-gray-800">৳{shipping.toLocaleString()}</span>
            </div>

            <div className="flex justify-between">
              <span>Estimated VAT ({settings.taxPercentage}%)</span>
              <span className="font-bold text-gray-800">৳{tax.toLocaleString()}</span>
            </div>

            <div className="border-t border-gray-100 pt-3.5 flex justify-between text-sm font-black text-gray-950">
              <span>Grand Total</span>
              <span className="text-base text-blue-600">৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all transform hover:scale-102 cursor-pointer"
          >
            {loading ? 'Processing Order...' : 'Confirm & Place Order'}
          </button>

          <p className="text-[10px] text-center text-gray-400 flex items-center justify-center gap-1 leading-normal pt-2 border-t border-gray-50">
            <ShieldCheck className="h-4.5 w-4.5 text-green-600 fill-current" />
            Guaranteed Secure payment. All order packages are fully insured.
          </p>
        </div>
      </form>
    </div>
  );
}
