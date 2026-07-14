import React, { useState } from 'react';
import { api } from '../lib/api';
import { Lock, X, Eye, EyeOff } from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
}

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }: AdminLoginModalProps) {
  const [email, setEmail] = useState('admin@bazarex.com');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await api.login(email, password);
      if (data.user.role !== 'admin') {
        api.logout();
        throw new Error('Access denied. Administrators only.');
      }
      onLoginSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Incorrect credentials. Please review and retry.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs px-4">
      
      {/* Container Box */}
      <div className="w-full max-w-sm bg-neutral-950 text-gray-100 rounded-2xl p-6 sm:p-8 border border-neutral-800 shadow-2xl relative animate-in zoom-in-95 duration-150 space-y-6">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-full p-1.5 hover:bg-neutral-800 text-gray-500 transition-colors"
        >
          <X className="h-4.5 w-4.5" />
        </button>

        {/* Header Branding */}
        <div className="text-center space-y-1">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-md shadow-blue-600/20">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="text-base font-black uppercase tracking-widest text-white mt-3">BazareX Guard</h2>
          <p className="text-[10px] text-gray-400 font-medium">Verify secure administrator session access credentials</p>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="rounded-xl bg-red-950/50 border border-red-900/50 p-3 text-center text-red-400 text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleAdminSubmit} className="space-y-4">
          
          <div className="space-y-1">
            <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
              Admin Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. admin@bazarex.com"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 font-mono"
            />
          </div>

          <div className="space-y-1">
            <label className="block text-[9px] font-black uppercase tracking-widest text-gray-400">
              Security PIN
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g. admin123"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-blue-500 pr-10 font-mono"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 hover:bg-blue-700 py-3 text-xs font-bold text-white transition-all shadow-md shadow-blue-600/10 cursor-pointer"
          >
            {loading ? 'Verifying Session...' : 'Authenticate Securely'}
          </button>
        </form>

        <p className="text-[10px] text-center text-gray-500 leading-normal">
          Authorized operations are tracked. Intrusions are logged.
        </p>
      </div>
    </div>
  );
}
