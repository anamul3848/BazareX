import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { Product, Category, Brand, Banner, Review } from '../types';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, ChevronRight, Star, Mail, Zap, Compass, Trophy, Flame, Smartphone, Headphones, Tablet, Laptop, Speaker, Grid } from 'lucide-react';

interface ClientHomeProps {
  setView: (view: string, params?: any) => void;
  categories: Category[];
  brands: Brand[];
}

export default function ClientHome({ setView, categories, brands }: ClientHomeProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [emailSub, setEmailSub] = useState('');
  const [subbed, setSubbed] = useState(false);

  useEffect(() => {
    // Parallel fetching
    api.getBanners().then(setBanners).catch(console.error);
    api.getProducts().then(setProducts).catch(console.error);
    api.getReviews(undefined, true).then(setReviews).catch(console.error);
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setActiveBanner(curr => (curr + 1) % banners.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [banners]);

  const safeProducts = Array.isArray(products) ? products : [];
  const featured = safeProducts.filter(p => p.isFeatured && p.status === 'active');
  const flashSale = safeProducts.filter(p => p.isFlashSale && p.status === 'active');
  const bestSellers = safeProducts.filter(p => p.isBestSeller && p.status === 'active');
  const newArrivals = safeProducts.filter(p => p.isNewArrival && p.status === 'active');

  const handleSubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailSub) {
      setSubbed(true);
      setEmailSub('');
    }
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Hero Slideshow Banner */}
      {banners.length > 0 && (
        <section className="relative w-full overflow-hidden bg-neutral-950 h-[240px] sm:h-[300px] md:h-[340px]">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              {/* Image with subtle overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent z-10" />
              <img
                src={banner.image}
                alt={banner.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              
              {/* Text overlay */}
              <div className="absolute inset-0 flex items-center z-20 px-4 sm:px-8 lg:px-16">
                <div className="max-w-xl text-left space-y-3">
                  <span className="inline-block rounded-full bg-blue-600 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white">
                    Premium Collection
                  </span>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white leading-tight">
                    {banner.title}
                  </h1>
                  <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-md">
                    {banner.subtitle}
                  </p>
                  <button
                    onClick={() => setView('shop')}
                    className="rounded-xl bg-white px-5 py-2.5 text-xs font-bold text-neutral-900 hover:bg-blue-600 hover:text-white transition-all transform hover:scale-105"
                  >
                    Explore Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Navigation controls */}
          <button
            onClick={() => setActiveBanner(curr => (curr - 1 + banners.length) % banners.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-all backdrop-blur-sm"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setActiveBanner(curr => (curr + 1) % banners.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 rounded-full bg-white/10 hover:bg-white/20 p-2.5 text-white transition-all backdrop-blur-sm"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Indicators */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`h-2.5 rounded-full transition-all ${i === activeBanner ? 'w-6 bg-blue-600' : 'w-2.5 bg-white/40'}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* 2. Visual Rounded Category Circles */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-left mb-6">
          <h2 className="text-lg font-black tracking-tight text-gray-900">Categories</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6 max-w-5xl">
          {[
            { name: 'Mobile', icon: Smartphone, slug: 'smartphones' },
            { name: 'Headphone', icon: Headphones, slug: 'audio' },
            { name: 'Tablets', icon: Tablet, slug: 'accessories' },
            { name: 'Laptop', icon: Laptop, slug: 'laptops' },
            { name: 'Speakers', icon: Speaker, slug: 'audio' },
            { name: 'More', icon: Grid, slug: '' },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  if (cat.name === 'More') {
                    setView('shop');
                  } else {
                    setView('shop', { category: cat.slug });
                  }
                }}
                className="group flex flex-col items-center cursor-pointer transition-transform duration-200 active:scale-95"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50 border border-gray-100 shadow-sm group-hover:bg-blue-50 group-hover:border-blue-200 transition-all duration-300">
                  <Icon className="h-6 w-6 text-neutral-700 group-hover:text-blue-600 transition-colors stroke-[1.5]" />
                </div>
                <span className="mt-2.5 text-xs font-bold text-gray-500 group-hover:text-neutral-900 transition-colors text-center">
                  {cat.name}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. Flash Deals for You Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-amber-500 fill-current animate-pulse" />
            <h2 className="text-lg font-black text-gray-900">Flash Deals for You</h2>
          </div>
          <button 
            onClick={() => setView('shop', { isFlashSale: 'true' })} 
            className="text-xs font-bold text-blue-600 hover:underline"
          >
            See All
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {(flashSale.length > 0 ? flashSale : safeProducts).slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} setView={setView} />
          ))}
        </div>
      </section>

      {/* 4. Tabbed/Featured Lists: New Arrivals / Best Sellers / Featured */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Featured Products */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Flame className="h-5 w-5 text-red-500 fill-current" />
                <h2 className="text-xl font-extrabold text-gray-900">Featured Releases</h2>
              </div>
              <button onClick={() => setView('shop', { isFeatured: 'true' })} className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} setView={setView} />
              ))}
            </div>
          </div>
        )}

        {/* New Arrivals */}
        {newArrivals.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-extrabold text-gray-900">New Arrivals</h2>
              </div>
              <button onClick={() => setView('shop', { isNewArrival: 'true' })} className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {newArrivals.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} setView={setView} />
              ))}
            </div>
          </div>
        )}

        {/* Best Sellers */}
        {bestSellers.length > 0 && (
          <div>
            <div className="flex items-center justify-between gap-4 border-b border-gray-100 pb-3 mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500 fill-current" />
                <h2 className="text-xl font-extrabold text-gray-900">Best Sellers</h2>
              </div>
              <button onClick={() => setView('shop', { isBestSeller: 'true' })} className="text-xs font-bold text-blue-600 hover:underline">
                View All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {bestSellers.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} setView={setView} />
              ))}
            </div>
          </div>
        )}

      </section>

      {/* 5. Brand Logos Section */}
      <section className="bg-gray-50 border-y border-gray-100 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[11px] font-bold uppercase tracking-widest text-gray-400 mb-6">Official Authorized Retailer for elite brands</p>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-16">
            {brands.map((b) => (
              <div 
                key={b.id} 
                onClick={() => setView('shop', { brand: b.name })}
                className="flex items-center gap-1.5 cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
              >
                <div className="h-8 w-8 rounded-full overflow-hidden bg-white border border-gray-100">
                  <img src={b.logo} alt={b.name} className="h-full w-full object-cover" />
                </div>
                <span className="font-extrabold tracking-tight text-gray-800 text-sm">{b.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Customer Reviews Slider */}
      {reviews.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-1 mb-8">
            <h2 className="text-2xl font-black tracking-tight text-gray-900">Trusted by Tech Lovers</h2>
            <p className="text-xs text-gray-400">Read verified reviews from our loyal customers</p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {reviews.slice(0, 3).map((review) => (
              <div key={review.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-xs font-bold">
                  <span className="text-gray-800">{review.userName}</span>
                  <span className="text-blue-600 truncate max-w-[120px]" onClick={() => setView('product', { id: review.productId })}>
                    {review.productName}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 7. Interactive Newsletter Block */}
      <section className="mx-auto max-w-5xl px-4">
        <div className="rounded-3xl bg-neutral-900 px-6 py-10 sm:px-12 sm:py-14 text-center text-white relative overflow-hidden shadow-xl border border-neutral-800">
          <div className="absolute inset-0 bg-blue-600/10 mix-blend-color-dodge pointer-events-none" />
          
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/20 text-blue-500 mb-2">
              <Mail className="h-6 w-6" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight">Stay ahead of the curve</h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Subscribe to BazareX Newsletter. Get VIP launch access, flash sale notification countdowns, and discount alerts.
            </p>

            {subbed ? (
              <div className="rounded-xl bg-blue-600/20 text-blue-400 py-3 font-semibold text-sm border border-blue-500/30">
                🎉 Welcome to the Club! Check your inbox for your exclusive signup voucher code.
              </div>
            ) : (
              <form onSubmit={handleSubSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={emailSub}
                  onChange={(e) => setEmailSub(e.target.value)}
                  className="flex-1 rounded-xl bg-neutral-800 border border-neutral-700 text-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 text-sm cursor-pointer transition-colors"
                >
                  Join VIP Club
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
