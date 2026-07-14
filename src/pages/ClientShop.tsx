import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Product, Category, Brand } from '../types';
import ProductCard from '../components/ProductCard';
import { SlidersHorizontal, ArrowUpDown, X, Star } from 'lucide-react';

interface ClientShopProps {
  setView: (view: string, params?: any) => void;
  categories: Category[];
  brands: Brand[];
  initialParams?: any;
  searchTerm: string;
  onClearSearch: () => void;
}

export default function ClientShop({ 
  setView, categories, brands, initialParams, searchTerm, onClearSearch 
}: ClientShopProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(initialParams?.category || '');
  const [selectedBrand, setSelectedBrand] = useState(initialParams?.brand || '');
  const [maxPrice, setMaxPrice] = useState('150000');
  const [selectedRating, setSelectedRating] = useState('');
  const [inStockOnly, setInStockOnly] = useState(false);
  const [selectedSort, setSelectedSort] = useState('latest');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Sync initial params if they change from Navbar quick links
  useEffect(() => {
    if (initialParams?.category) {
      setSelectedCategory(initialParams.category);
    }
    if (initialParams?.brand) {
      setSelectedBrand(initialParams.brand);
    }
  }, [initialParams]);

  useEffect(() => {
    setLoading(true);
    
    // Construct query filters
    const filters: any = {
      category: selectedCategory,
      brand: selectedBrand,
      search: searchTerm,
      maxPrice,
      rating: selectedRating,
      sort: selectedSort
    };

    if (initialParams?.isFeatured) filters.isFeatured = 'true';
    if (initialParams?.isFlashSale) filters.isFlashSale = 'true';
    if (initialParams?.isBestSeller) filters.isBestSeller = 'true';
    if (initialParams?.isNewArrival) filters.isNewArrival = 'true';

    api.getProducts(filters)
      .then(data => {
        let list = Array.isArray(data) ? data : [];
        if (inStockOnly) {
          list = list.filter((p: Product) => p.stock > 0);
        }
        setProducts(list);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedBrand, searchTerm, maxPrice, selectedRating, inStockOnly, selectedSort, initialParams]);

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setMaxPrice('150000');
    setSelectedRating('');
    setInStockOnly(false);
    setSelectedSort('latest');
    onClearSearch();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-100 pb-5 mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Tech Showcase</h1>
          <p className="text-xs text-gray-400 mt-1">
            {searchTerm ? `Search results for "${searchTerm}"` : 'Browse high-performance gadgets and certified tech accessories'}
          </p>
        </div>

        {/* Action Triggers (Mobile Filter & Desktop Sort) */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 px-4 text-xs font-bold text-gray-700 md:hidden flex-1"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
            Filters
          </button>

          <div className="relative flex-1 sm:flex-initial">
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full sm:w-52 rounded-xl border border-gray-200 bg-white py-2.5 pl-3 pr-8 text-xs font-bold text-gray-700 focus:outline-none focus:border-blue-500 appearance-none cursor-pointer"
            >
              <option value="latest">Sort by: Latest Arrivals</option>
              <option value="priceAsc">Sort by: Price (Low to High)</option>
              <option value="priceDesc">Sort by: Price (High to Low)</option>
              <option value="popularity">Sort by: Popularity</option>
            </select>
            <ArrowUpDown className="absolute right-3.5 top-3.5 h-3.5 w-3.5 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="flex gap-8 items-start">
        {/* 1. FILTER SIDEBAR (Desktop) */}
        <aside className="hidden md:block w-64 shrink-0 space-y-6 sticky top-24">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Filters</h3>
            <button 
              onClick={handleClearFilters}
              className="text-[11px] font-bold text-blue-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          {/* Categories */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 mb-2.5">Category</h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-cat"
                  checked={selectedCategory === ''}
                  onChange={() => setSelectedCategory('')}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                />
                <span className="text-xs text-neutral-600 font-medium">All Categories</span>
              </label>
              {categories.map((cat) => (
                <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sidebar-cat"
                    checked={selectedCategory.toLowerCase() === cat.slug.toLowerCase()}
                    onChange={() => setSelectedCategory(cat.slug)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                  />
                  <span className="text-xs text-neutral-600 font-medium">{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 mb-2.5">Brand</h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-brand"
                  checked={selectedBrand === ''}
                  onChange={() => setSelectedBrand('')}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                />
                <span className="text-xs text-neutral-600 font-medium">All Brands</span>
              </label>
              {brands.map((b) => (
                <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sidebar-brand"
                    checked={selectedBrand.toLowerCase() === b.name.toLowerCase()}
                    onChange={() => setSelectedBrand(b.name)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                  />
                  <span className="text-xs text-neutral-600 font-medium">{b.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-gray-800">Max Price</h4>
              <span className="text-xs font-bold text-blue-600">৳{parseInt(maxPrice).toLocaleString()}</span>
            </div>
            <input
              type="range"
              min="5000"
              max="150000"
              step="5000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Rating */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold text-gray-800 mb-2.5">Minimum Rating</h4>
            <div className="space-y-1.5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="sidebar-rating"
                  checked={selectedRating === ''}
                  onChange={() => setSelectedRating('')}
                  className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                />
                <span className="text-xs text-neutral-600 font-medium">Any Rating</span>
              </label>
              {['4', '4.5', '4.8'].map((star) => (
                <label key={star} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sidebar-rating"
                    checked={selectedRating === star}
                    onChange={() => setSelectedRating(star)}
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 border-gray-300"
                  />
                  <span className="text-xs text-neutral-600 font-medium flex items-center gap-1">
                    {star}+ <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Stock Availability */}
          <div className="border-t border-gray-100 pt-4">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
              />
              <span className="text-xs text-neutral-600 font-bold">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* 2. PRODUCT GRID (Desktop & Mobile) */}
        <main className="flex-1">
          {loading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 p-12 text-center space-y-3">
              <SlidersHorizontal className="mx-auto h-10 w-10 text-gray-300" />
              <h3 className="text-sm font-bold text-gray-800">No matching devices found</h3>
              <p className="text-xs text-gray-400 max-w-sm mx-auto">
                No gadgets matched your specific filter properties. Try broadening your pricing, category, or keyword search parameters.
              </p>
              <button
                onClick={handleClearFilters}
                className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} setView={setView} />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* 3. MOBILE FILTERS DRAWER */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs md:hidden">
          <div className="w-full max-w-xs bg-white h-full overflow-y-auto p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-right duration-250">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-5">
                <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Filter Products</h3>
                <button
                  onClick={() => setMobileFiltersOpen(false)}
                  className="rounded-full p-1.5 hover:bg-gray-100 text-gray-500"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Category */}
              <div className="space-y-3 mb-6">
                <h4 className="text-xs font-bold text-gray-800">Categories</h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-cat"
                      checked={selectedCategory === ''}
                      onChange={() => setSelectedCategory('')}
                      className="rounded text-blue-600 h-4 w-4 border-gray-300"
                    />
                    <span className="text-xs text-neutral-600">All Categories</span>
                  </label>
                  {categories.map((cat) => (
                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-cat"
                        checked={selectedCategory.toLowerCase() === cat.slug.toLowerCase()}
                        onChange={() => setSelectedCategory(cat.slug)}
                        className="rounded text-blue-600 h-4 w-4 border-gray-300"
                      />
                      <span className="text-xs text-neutral-600">{cat.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="space-y-3 mb-6 border-t border-gray-50 pt-4">
                <h4 className="text-xs font-bold text-gray-800">Brands</h4>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="mobile-brand"
                      checked={selectedBrand === ''}
                      onChange={() => setSelectedBrand('')}
                      className="rounded text-blue-600 h-4 w-4 border-gray-300"
                    />
                    <span className="text-xs text-neutral-600">All Brands</span>
                  </label>
                  {brands.map((b) => (
                    <label key={b.id} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="mobile-brand"
                        checked={selectedBrand.toLowerCase() === b.name.toLowerCase()}
                        onChange={() => setSelectedBrand(b.name)}
                        className="rounded text-blue-600 h-4 w-4 border-gray-300"
                      />
                      <span className="text-xs text-neutral-600">{b.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Max Price */}
              <div className="space-y-3 mb-6 border-t border-gray-50 pt-4">
                <div className="flex items-center justify-between text-xs font-bold text-gray-800">
                  <span>Price Limit</span>
                  <span className="text-blue-600">৳{parseInt(maxPrice).toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="5000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>

              {/* Stock */}
              <div className="border-t border-gray-50 pt-4 mb-6">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 h-4 w-4"
                  />
                  <span className="text-xs text-neutral-600 font-bold">In Stock Only</span>
                </label>
              </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex gap-2 border-t border-gray-100 pt-4">
              <button
                onClick={handleClearFilters}
                className="flex-1 rounded-xl border border-gray-200 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-50"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="flex-1 rounded-xl bg-blue-600 text-white py-2.5 text-xs font-bold hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
