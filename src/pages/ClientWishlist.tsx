import React from 'react';
import { useStore } from '../lib/store';
import { Heart, ShoppingBag } from 'lucide-react';
import ProductCard from '../components/ProductCard';

interface ClientWishlistProps {
  setView: (view: string, params?: any) => void;
}

export default function ClientWishlist({ setView }: ClientWishlistProps) {
  const { wishlist, clearWishlist } = useStore();

  if (wishlist.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
          <Heart className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Your Wishlist is Empty</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Start marking devices you love to save them here for easy buying and inventory monitoring!
        </p>
        <button
          onClick={() => setView('shop')}
          className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          Explore Catalogue
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Your Saved Wishlist</h1>
          <p className="text-xs text-gray-400 mt-1">Easily monitor prices and inventory status of hardware saved to your profile</p>
        </div>
        <button
          onClick={clearWishlist}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wishlist.map((p) => (
          <ProductCard key={p.id} product={p} setView={setView} />
        ))}
      </div>
    </div>
  );
}
