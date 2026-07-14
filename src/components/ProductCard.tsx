import React from 'react';
import { useStore } from '../lib/store';
import { Product } from '../types';
import { Star, Heart, GitCompare, ShoppingCart, Eye } from 'lucide-react';

interface ProductCardProps {
  key?: any;
  product: Product;
  setView: (view: string, params?: any) => void;
}

export default function ProductCard({ product, setView }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();

  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm hover:shadow-md transition-all duration-300">
      
      {/* Product Image and Badges */}
      <div className="relative aspect-square overflow-hidden bg-gray-50/50">
        <img
          src={product.images[0] || 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=600&q=80'}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Action badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {hasDiscount && (
            <span className="rounded-md bg-blue-600 px-2 py-1 text-[10px] font-extrabold tracking-tight text-white shadow-sm">
              -{discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && (
            <span className="rounded-md bg-neutral-900 px-2 py-1 text-[10px] font-extrabold tracking-tight text-white shadow-sm uppercase">
              NEW
            </span>
          )}
          {product.stock === 0 && (
            <span className="rounded-md bg-red-600 px-2 py-1 text-[10px] font-extrabold tracking-tight text-white shadow-sm uppercase">
              OUT OF STOCK
            </span>
          )}
        </div>

        {/* Hover Action Overlay */}
        <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2.5 z-20">
          {/* Quick View */}
          <button
            onClick={() => setView('product', { id: product.id })}
            className="rounded-full bg-white p-2.5 text-neutral-800 shadow-lg hover:bg-blue-600 hover:text-white transition-all scale-90 group-hover:scale-100"
            title="View Details"
          >
            <Eye className="h-4.5 w-4.5" />
          </button>
          
          {/* Add to Compare */}
          <button
            onClick={() => toggleCompare(product)}
            className={`rounded-full p-2.5 shadow-lg transition-all scale-90 group-hover:scale-100 ${inComp ? 'bg-neutral-900 text-white hover:bg-neutral-800' : 'bg-white text-neutral-800 hover:bg-blue-600 hover:text-white'}`}
            title="Compare Product"
          >
            <GitCompare className="h-4.5 w-4.5" />
          </button>

          {/* Toggle Wishlist */}
          <button
            onClick={() => toggleWishlist(product)}
            className={`rounded-full p-2.5 shadow-lg transition-all scale-90 group-hover:scale-100 ${inWish ? 'bg-pink-600 text-white hover:bg-pink-500' : 'bg-white text-neutral-800 hover:bg-blue-600 hover:text-white'}`}
            title="Add to Wishlist"
          >
            <Heart className="h-4.5 w-4.5 fill-current" />
          </button>
        </div>
      </div>

      {/* Info Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Brand and category */}
        <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold uppercase tracking-wider mb-1">
          <span>{product.brand}</span>
          <span>{product.category}</span>
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => setView('product', { id: product.id })}
          className="text-sm font-bold text-gray-800 hover:text-blue-600 transition-colors cursor-pointer line-clamp-2 min-h-[40px] leading-snug"
        >
          {product.name}
        </h3>

        {/* Rating and review counts */}
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <span className="text-[11px] font-bold text-gray-400">({product.ratingsCount})</span>
        </div>

        {/* Price and Add to Cart layout */}
        <div className="mt-4 flex items-end justify-between gap-2 pt-3 border-t border-gray-50">
          <div>
            {hasDiscount && (
              <p className="text-xs text-gray-400 line-through">৳{product.price.toLocaleString()}</p>
            )}
            <p className="text-base font-black text-gray-950">৳{activePrice.toLocaleString()}</p>
          </div>

          <button
            onClick={() => {
              if (product.stock > 0) {
                addToCart(product, 1);
              }
            }}
            disabled={product.stock === 0}
            className={`rounded-xl p-2.5 transition-all cursor-pointer ${product.stock === 0 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 active:scale-95'}`}
            title={product.stock === 0 ? 'Out of stock' : 'Add to Cart'}
          >
            <ShoppingCart className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
