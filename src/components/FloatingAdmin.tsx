import React, { useState } from 'react';
import { api } from '../lib/api';
import { ShieldCheck, X, Eye, EyeOff } from 'lucide-react';

interface FloatingAdminProps {
  setView: (view: string) => void;
  onLoginSuccess: () => void;
}

export default function FloatingAdmin({ setView, onLoginSuccess }: FloatingAdminProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('admin@bazarex.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const currentUser = api.getCurrentUser();

  const handleAdminTrigger = () => {
    if (currentUser?.role === 'admin') {
      setView('admin');
    } else {
      setIsOpen(true);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      if (data.user.role !== 'admin') {
        api.logout();
        throw new Error('Access denied. This portal is strictly for authorized store administrators.');
      }
      setIsOpen(false);
      onLoginSuccess();
      setView('admin');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating fixed button */}
      <button
        onClick={handleAdminTrigger}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-neutral-900 text-white shadow-xl hover:bg-blue-600 transition-all group scale-100 hover:scale-105 active:scale-95 border-2 border-white"
        title="Admin Portal"
        id="floating-admin-btn"
      >
        <ShieldCheck className="h-5 w-5 group-hover:rotate-12 transition-transform" />
        <span className="pointer-events-none absolute right-14 whitespace-nowrap rounded-lg bg-neutral-900 px-2.5 py-1.5 text-[11px] font-bold text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100">
          Admin Portal
        </span>
      </button>

      {/* Secure Admin Login Modal overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-sm px-4">
          <div className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-150">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-1">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-black tracking-tight text-neutral-900">Secure Admin Login</h3>
              <p className="text-xs text-gray-400">Authorized personnel only. Sessions are fully encrypted.</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 rounded-xl bg-red-50 p-3 text-xs font-semibold text-red-600 leading-normal border border-red-100">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLoginSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Admin Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Access Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-neutral-900 py-2.5 text-sm font-bold text-white hover:bg-blue-600 disabled:bg-neutral-400 transition-colors cursor-pointer"
              >
                {loading ? 'Authenticating...' : 'Access Dashboard'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
