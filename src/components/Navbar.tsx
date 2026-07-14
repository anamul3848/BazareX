import React, { useState } from 'react';
import { useStore } from '../lib/store';
import { api } from '../lib/api';
import { 
  Search, ShoppingCart, Heart, GitCompare, User, Menu, X, 
  ChevronDown, LogOut, LayoutDashboard, Compass, MapPin, PhoneCall 
} from 'lucide-react';
import { Category } from '../types';

interface NavbarProps {
  currentView: string;
  setView: (view: string, params?: any) => void;
  categories: Category[];
  onSearch: (term: string) => void;
}

export default function Navbar({ currentView, setView, categories, onSearch }: NavbarProps) {
  const { cartCount, wishlist, compareList } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const user = api.getCurrentUser();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchVal);
    setView('shop');
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    api.logout();
    setView('home');
    setShowProfileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/90 backdrop-blur-md">
      {/* Top minimal bar */}
      <div className="bg-neutral-900 py-1.5 px-4 text-center text-xs font-medium text-gray-300">
        <span>🎉 Grand Launch! Use coupon <strong className="text-white font-semibold">WELCOME10</strong> for 10% off.</span>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            onClick={() => setView('home')} 
            className="flex cursor-pointer items-center gap-2"
          >
            <div className="rounded-lg bg-blue-600 px-3 py-1 text-xl font-black tracking-tighter text-white">
              B
            </div>
            <span className="text-xl font-extrabold tracking-tight text-neutral-900">
              Bazare<span className="text-blue-600">X</span>
            </span>
          </div>

          {/* Search bar (Desktop) */}
          <form 
            onSubmit={handleSearchSubmit}
            className="hidden max-w-md flex-1 md:flex items-center relative"
          >
            <input
              type="text"
              placeholder="Search premium gadgets, brands, SKUs..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full rounded-full border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all"
            />
            <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
          </form>

          {/* Desktop Right items */}
          <div className="hidden items-center gap-4 md:flex">
            {/* Compare Button */}
            <button 
              onClick={() => setView('compare')}
              className={`relative rounded-full p-2 hover:bg-gray-100 transition-colors ${currentView === 'compare' ? 'text-blue-600 bg-blue-50' : 'text-neutral-700'}`}
              title="Compare Products"
            >
              <GitCompare className="h-5 w-5" />
              {compareList.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-neutral-900 text-[10px] font-bold text-white">
                  {compareList.length}
                </span>
              )}
            </button>

            {/* Wishlist Button */}
            <button 
              onClick={() => setView('wishlist')}
              className={`relative rounded-full p-2 hover:bg-gray-100 transition-colors ${currentView === 'wishlist' ? 'text-blue-600 bg-blue-50' : 'text-neutral-700'}`}
              title="Wishlist"
            >
              <Heart className="h-5 w-5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button 
              onClick={() => setView('cart')}
              className={`relative rounded-full p-2 hover:bg-gray-100 transition-colors ${currentView === 'cart' ? 'text-blue-600 bg-blue-50' : 'text-neutral-700'}`}
              title="Shopping Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white animate-pulse">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account Trigger */}
            <div className="relative">
              <button 
                onClick={() => {
                  if (user) {
                    setShowProfileMenu(!showProfileMenu);
                  } else {
                    setView('login');
                  }
                }}
                className="flex items-center gap-1.5 rounded-full border border-gray-100 bg-gray-50/50 py-1 px-3 hover:bg-gray-100 hover:border-gray-200 transition-all text-neutral-700"
              >
                <User className="h-4 w-4" />
                <span className="text-xs font-semibold max-w-[80px] truncate">
                  {user ? user.name.split(' ')[0] : 'Sign In'}
                </span>
                {user && <ChevronDown className="h-3 w-3 text-gray-400" />}
              </button>

              {/* Account Dropdown */}
              {showProfileMenu && user && (
                <div className="absolute right-0 mt-2 w-52 rounded-xl border border-gray-100 bg-white p-1.5 shadow-xl ring-1 ring-black/5 z-50">
                  <div className="px-3 py-2 border-b border-gray-50 mb-1">
                    <p className="text-xs text-gray-400">Signed in as</p>
                    <p className="text-sm font-bold truncate text-gray-800">{user.name}</p>
                    <p className="text-[10px] text-blue-600 capitalize font-medium">{user.role} Account</p>
                  </div>
                  <button 
                    onClick={() => { setView('profile'); setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </button>
                  <button 
                    onClick={() => { setView('orders'); setShowProfileMenu(false); }}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-neutral-700 hover:bg-gray-50 transition-colors"
                  >
                    <Compass className="h-4 w-4" />
                    Order History
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Right items triggers */}
          <div className="flex items-center gap-2 md:hidden">
            {/* Cart Button */}
            <button 
              onClick={() => setView('cart')}
              className="relative rounded-full p-2 text-neutral-700 hover:bg-gray-100"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Menu Toggle */}
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-full p-2 text-neutral-700 hover:bg-gray-100"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Subnavigation Bar (Desktop Categories) */}
      <nav className="hidden border-t border-gray-50 bg-gray-50/50 md:block">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-10 items-center justify-between">
            <div className="flex gap-6">
              <button 
                onClick={() => setView('home')} 
                className={`text-xs font-semibold tracking-wide transition-colors ${currentView === 'home' ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                HOME
              </button>
              <button 
                onClick={() => setView('shop')} 
                className={`text-xs font-semibold tracking-wide transition-colors ${currentView === 'shop' ? 'text-blue-600' : 'text-neutral-500 hover:text-neutral-900'}`}
              >
                SHOP ALL
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => {
                    onSearch('');
                    setView('shop', { category: cat.slug });
                  }}
                  className="text-xs font-semibold tracking-wide text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                  {cat.name.toUpperCase()}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => setView('about')} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                ABOUT
              </button>
              <button 
                onClick={() => setView('contact')} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
              >
                CONTACT
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 shadow-lg space-y-4 animate-in slide-in-from-top duration-200">
          {/* Mobile Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search premium tech..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          </form>

          {/* Categories list */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">Categories</p>
            <button
              onClick={() => { setView('shop'); setMobileMenuOpen(false); }}
              className="flex w-full items-center px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-gray-50 rounded-lg"
            >
              Shop All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  onSearch('');
                  setView('shop', { category: cat.slug });
                  setMobileMenuOpen(false);
                }}
                className="flex w-full items-center px-3 py-2 text-sm text-neutral-600 hover:bg-gray-50 rounded-lg pl-6"
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Quick pages & user profile */}
          <div className="border-t border-gray-100 pt-4 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 px-2 mb-1">Account & Support</p>
            
            {user ? (
              <>
                <button
                  onClick={() => { setView('profile'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-gray-50 rounded-lg"
                >
                  <User className="h-4 w-4" />
                  My Profile ({user.name})
                </button>
                <button
                  onClick={() => { setView('orders'); setMobileMenuOpen(false); }}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-gray-50 rounded-lg"
                >
                  <Compass className="h-4 w-4" />
                  My Orders
                </button>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => { setView('login'); setMobileMenuOpen(false); }}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm font-semibold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg"
              >
                <User className="h-4 w-4" />
                Sign In / Register
              </button>
            )}

            <div className="border-t border-gray-100 pt-3 flex gap-4 px-2">
              <button 
                onClick={() => { setView('about'); setMobileMenuOpen(false); }} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                About Us
              </button>
              <button 
                onClick={() => { setView('contact'); setMobileMenuOpen(false); }} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                Contact Us
              </button>
              <button 
                onClick={() => { setView('compare'); setMobileMenuOpen(false); }} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                Compare ({compareList.length})
              </button>
              <button 
                onClick={() => { setView('wishlist'); setMobileMenuOpen(false); }} 
                className="text-xs font-semibold text-neutral-500 hover:text-neutral-900"
              >
                Wishlist ({wishlist.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
