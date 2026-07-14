import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { Order, UserProfile, WebsiteSettings } from '../types';
import { User, KeyRound, MapPin, ClipboardList, ShieldCheck, Printer, LogOut, RefreshCw, Truck, ChevronDown, ChevronUp, Package } from 'lucide-react';
import InvoicePrint from '../components/InvoicePrint';

interface ClientAccountProps {
  initialSubView?: 'login' | 'register' | 'forgot' | 'profile' | 'orders';
  setView: (view: string, params?: any) => void;
  settings: WebsiteSettings;
}

export default function ClientAccount({ initialSubView = 'login', setView, settings }: ClientAccountProps) {
  const [subView, setSubView] = useState<'login' | 'register' | 'forgot' | 'profile' | 'orders'>(initialSubView);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Login Form
  const [email, setEmail] = useState('matubberanamul001@gmail.com');
  const [password, setPassword] = useState('user123');

  // Register Form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regPass, setRegPass] = useState('');

  // Profile Form
  const [profName, setProfName] = useState('');
  const [profPhone, setProfPhone] = useState('');
  const [profAddress, setProfAddress] = useState('');

  // Order History State
  const [pastOrders, setPastOrders] = useState<Order[]>([]);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const user = api.getCurrentUser();

  // Load profile values on login
  useEffect(() => {
    if (user) {
      setProfName(user.name);
      setProfPhone(user.phone || '');
      setProfAddress(user.address || '');
      setSubView('profile');

      // Fetch order history
      setLoading(true);
      api.getOrders()
        .then(setPastOrders)
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setSubView('login');
    }
  }, [user]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.login(email, password);
      // Success will trigger state sync
      setView('profile');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.register(regName, regEmail, regPhone, regAddress, regPass);
      setView('profile');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      await api.updateProfile({
        name: profName,
        phone: profPhone,
        address: profAddress
      });
      setSuccess('Profile details saved successfully!');
    } catch (err: any) {
      setError(err.message || 'Failed to update details');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('Password recovery guidelines have been transmitted to your email address.');
  };

  const handleLogout = () => {
    api.logout();
    setView('home');
  };

  // If viewing invoice details
  if (selectedInvoiceOrder) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <InvoicePrint 
          order={selectedInvoiceOrder} 
          settings={settings} 
          onBack={() => setSelectedInvoiceOrder(null)} 
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
      {user ? (
        // ==========================================
        // SIGNED-IN USER PANEL
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Navigation Sidebar */}
          <aside className="space-y-2">
            <div className="rounded-2xl border border-gray-150 bg-white p-4 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-sm font-black text-gray-800 truncate">{user.name}</h3>
              <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
              <button
                onClick={() => setSubView('profile')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-left transition-colors ${subView === 'profile' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <User className="h-4 w-4" />
                Profile Settings
              </button>
              <button
                onClick={() => setSubView('orders')}
                className={`w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-left transition-colors ${subView === 'orders' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                <ClipboardList className="h-4 w-4" />
                Order History
                {pastOrders.length > 0 && (
                  <span className="ml-auto rounded-full bg-neutral-900 px-2 py-0.5 text-[9px] font-bold text-white">
                    {pastOrders.length}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-3 text-xs font-bold text-left text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </aside>

          {/* Tab Subviews Content */}
          <main className="md:col-span-3">
            {error && (
              <div className="mb-4 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
                {error}
              </div>
            )}
            {success && (
              <div className="mb-4 rounded-xl bg-green-50 p-4 text-xs font-bold text-green-600 border border-green-100">
                {success}
              </div>
            )}

            {/* Profile Settings Edit */}
            {subView === 'profile' && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-black text-gray-900">Profile Settings</h2>
                  <p className="text-[11px] text-gray-400">Keep your billing address and dispatch contact details updated</p>
                </div>

                <form onSubmit={handleUpdateProfileSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        required
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                        Mobile Phone
                      </label>
                      <input
                        type="text"
                        required
                        value={profPhone}
                        onChange={(e) => setProfPhone(e.target.value)}
                        className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Billing / Dispatch Address
                    </label>
                    <input
                      type="text"
                      required
                      value={profAddress}
                      onChange={(e) => setProfAddress(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl bg-neutral-900 hover:bg-blue-600 px-6 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
                  >
                    {loading ? 'Saving Details...' : 'Save Profile Changes'}
                  </button>
                </form>
              </div>
            )}

            {/* Order History list */}
            {subView === 'orders' && (
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xs space-y-6">
                <div>
                  <h2 className="text-base font-black text-gray-900">Purchase Receipts</h2>
                  <p className="text-[11px] text-gray-400">View and print invoices of your past purchases</p>
                </div>

                {loading ? (
                  <div className="flex justify-center py-8">
                    <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : pastOrders.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 p-10 text-center text-xs text-gray-400">
                    No order history found for this account. Create an order first.
                  </div>
                ) : (
                  <div className="rounded-xl border border-gray-150 overflow-hidden bg-white">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-gray-50 text-gray-500 font-bold border-b border-gray-150">
                          <th className="p-3">Receipt No</th>
                          <th className="p-3">Order Date</th>
                          <th className="p-3">Total Paid</th>
                          <th className="p-3">Status</th>
                          <th className="p-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {pastOrders.map((order) => {
                          const isExpanded = expandedOrderId === order.id;
                          const getProgressWidth = (status: string) => {
                            if (status === 'delivered') return '100%';
                            if (status === 'shipped') return '50%';
                            return '0%';
                          };
                          const isStepActive = (step: 'pending' | 'shipped' | 'delivered', currentStatus: string) => {
                            if (currentStatus === 'cancelled' || currentStatus === 'refunded') return false;
                            if (step === 'pending') {
                              return ['pending', 'confirmed', 'processing', 'shipped', 'delivered'].includes(currentStatus);
                            }
                            if (step === 'shipped') {
                              return ['shipped', 'delivered'].includes(currentStatus);
                            }
                            if (step === 'delivered') {
                              return currentStatus === 'delivered';
                            }
                            return false;
                          };

                          return (
                            <React.Fragment key={order.id}>
                              <tr className={`hover:bg-gray-50/50 transition-colors ${isExpanded ? 'bg-blue-50/10' : ''}`}>
                                <td className="p-3">
                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className="text-blue-600 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                                  >
                                    {order.invoiceNo}
                                    {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                                  </button>
                                </td>
                                <td className="p-3 text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td className="p-3 font-bold text-gray-800">৳{order.total.toLocaleString()}</td>
                                <td className="p-3">
                                  <span className={`inline-block rounded-md text-[9px] font-extrabold tracking-wider px-2 py-0.5 uppercase ${order.orderStatus === 'delivered' ? 'bg-green-50 text-green-700' : order.orderStatus === 'cancelled' ? 'bg-red-50 text-red-700' : 'bg-blue-50 text-blue-700'}`}>
                                    {order.orderStatus}
                                  </span>
                                </td>
                                <td className="p-3 text-right space-x-1.5">
                                  <button
                                    onClick={() => setExpandedOrderId(isExpanded ? null : order.id)}
                                    className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer ${isExpanded ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                                  >
                                    <Truck className="h-3.5 w-3.5" />
                                    Track Status
                                  </button>
                                  <button
                                    onClick={() => setSelectedInvoiceOrder(order)}
                                    className="inline-flex items-center gap-1 rounded-lg bg-gray-100 hover:bg-neutral-900 hover:text-white text-gray-600 px-2.5 py-1.5 text-[10px] font-bold transition-all cursor-pointer"
                                  >
                                    <Printer className="h-3.5 w-3.5" />
                                    Invoice
                                  </button>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-gray-50/30">
                                  <td colSpan={5} className="p-4 border-t border-gray-100">
                                    <div className="space-y-6 animate-in fade-in slide-in-from-top-1 duration-200">
                                      
                                      {/* Visual Tracking Progress */}
                                      <div className="relative max-w-xl mx-auto py-6 px-4">
                                        {/* Background Connective line */}
                                        <div className="absolute top-[38px] left-[15%] right-[15%] h-1 bg-gray-200 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-blue-600 transition-all duration-500" 
                                            style={{ width: getProgressWidth(order.orderStatus) }}
                                          />
                                        </div>

                                        <div className="relative flex justify-between z-10">
                                          {/* Step 1: Pending */}
                                          <div className="flex flex-col items-center w-[30%]">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                              isStepActive('pending', order.orderStatus)
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                : 'bg-white border-gray-300 text-gray-400'
                                            }`}>
                                              <ClipboardList className="h-5 w-5" />
                                            </div>
                                            <span className="mt-2 text-[10px] font-black uppercase tracking-wider text-gray-700 text-center">Pending</span>
                                            <span className="text-[9px] text-gray-400 text-center">Order Received</span>
                                          </div>

                                          {/* Step 2: Shipped */}
                                          <div className="flex flex-col items-center w-[30%]">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                              isStepActive('shipped', order.orderStatus)
                                                ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                : 'bg-white border-gray-300 text-gray-400'
                                            }`}>
                                              <Truck className="h-5 w-5" />
                                            </div>
                                            <span className="mt-2 text-[10px] font-black uppercase tracking-wider text-gray-700 text-center">Shipped</span>
                                            <span className="text-[9px] text-gray-400 text-center">Dispatched & Transit</span>
                                          </div>

                                          {/* Step 3: Delivered */}
                                          <div className="flex flex-col items-center w-[30%]">
                                            <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                                              isStepActive('delivered', order.orderStatus)
                                                ? 'bg-green-600 border-green-600 text-white shadow-md'
                                                : 'bg-white border-gray-300 text-gray-400'
                                            }`}>
                                              <ShieldCheck className="h-5 w-5" />
                                            </div>
                                            <span className="mt-2 text-[10px] font-black uppercase tracking-wider text-gray-700 text-center">Delivered</span>
                                            <span className="text-[9px] text-gray-400 text-center">Arrived Safely</span>
                                          </div>
                                        </div>
                                      </div>

                                      {/* Alert if cancelled/refunded */}
                                      {(order.orderStatus === 'cancelled' || order.orderStatus === 'refunded') && (
                                        <div className="max-w-xl mx-auto rounded-xl bg-red-50 border border-red-100 p-3 text-center text-red-600 text-xs font-semibold">
                                          ⚠️ This transaction was <span className="uppercase font-black">{order.orderStatus}</span>. For inquiry, reach support.
                                        </div>
                                      )}

                                      {/* Package breakdown card */}
                                      <div className="max-w-xl mx-auto rounded-xl border border-gray-150 bg-white p-4 space-y-3">
                                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Order Contents</span>
                                          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Method: {order.paymentMethod.toUpperCase()}</span>
                                        </div>
                                        
                                        <div className="divide-y divide-gray-100 max-h-48 overflow-y-auto pr-1">
                                          {order.items.map((item, index) => (
                                            <div key={index} className="flex items-center gap-3 py-2 text-[11px]">
                                              <img src={item.image} alt={item.name} className="h-9 w-9 rounded-lg object-cover border border-gray-100" />
                                              <div className="flex-1 min-w-0">
                                                <h5 className="font-bold text-gray-800 truncate">{item.name}</h5>
                                                {item.selectedVariant && (
                                                  <p className="text-[9px] text-gray-400 font-medium">Variant: {item.selectedVariant}</p>
                                                )}
                                              </div>
                                              <div className="text-right font-medium">
                                                <span className="text-gray-400">Qty {item.quantity}</span>
                                                <p className="font-bold text-gray-700">৳{(item.price * item.quantity).toLocaleString()}</p>
                                              </div>
                                            </div>
                                          ))}
                                        </div>

                                        <div className="pt-2.5 border-t border-gray-100 space-y-1 text-gray-500 text-[11px] font-medium">
                                          <div className="flex justify-between">
                                            <span>Billing / Shipping Address:</span>
                                            <span className="text-gray-800 font-bold max-w-xs text-right truncate" title={order.shippingAddress}>
                                              {order.shippingAddress}
                                            </span>
                                          </div>
                                          <div className="flex justify-between font-bold text-gray-800 text-xs pt-1">
                                            <span>Paid Total:</span>
                                            <span className="text-blue-600">৳{order.total.toLocaleString()}</span>
                                          </div>
                                        </div>
                                      </div>

                                    </div>
                                  </td>
                                </tr>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </main>
        </div>
      ) : (
        // ==========================================
        // GUEST PORTALS (LOGIN / REGISTER / FORGOT)
        // ==========================================
        <div className="mx-auto max-w-sm rounded-2xl border border-gray-150 bg-white p-6 sm:p-8 shadow-xl">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 p-4 text-xs font-bold text-red-600 border border-red-100">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 rounded-xl bg-green-50 p-4 text-xs font-bold text-green-600 border border-green-100">
              {success}
            </div>
          )}

          {/* 1. Login form */}
          {subView === 'login' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-gray-950 tracking-tight">Welcome Back</h2>
                <p className="text-xs text-gray-400">Sign in to sync your cart, orders, and details</p>
              </div>

              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setSubView('forgot')}
                      className="text-[10px] font-bold text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </button>
                  </div>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-2">
                Don't have an account?{' '}
                <button
                  onClick={() => setSubView('register')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign Up Free
                </button>
              </p>
            </div>
          )}

          {/* 2. Register Form */}
          {subView === 'register' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <User className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-gray-950 tracking-tight">Create Account</h2>
                <p className="text-xs text-gray-400">Join BazareX VIP premium tech club</p>
              </div>

              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Imran Khan"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. imran@gmail.com"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Mobile Phone
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 01712-345678"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Min 6 characters"
                      value={regPass}
                      onChange={(e) => setRegPass(e.target.value)}
                      className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Complete Shipping Address
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dhanmondi, Dhaka"
                    value={regAddress}
                    onChange={(e) => setRegAddress(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-2">
                Already have an account?{' '}
                <button
                  onClick={() => setSubView('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Sign In
                </button>
              </p>
            </div>
          )}

          {/* 3. Forgot Password Form */}
          {subView === 'forgot' && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-black text-gray-950 tracking-tight">Reset Password</h2>
                <p className="text-xs text-gray-400">Enter your email and we'll transmit guidelines</p>
              </div>

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                    Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. imran@gmail.com"
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-xs focus:border-blue-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-neutral-900 hover:bg-blue-600 py-3 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  Request Link
                </button>
              </form>

              <p className="text-xs text-center text-gray-500 mt-2">
                Remember your password?{' '}
                <button
                  onClick={() => setSubView('login')}
                  className="font-bold text-blue-600 hover:underline"
                >
                  Back to Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
