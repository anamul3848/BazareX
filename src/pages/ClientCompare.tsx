import { useStore } from '../lib/store';
import { Trash2, ShoppingCart, GitCompare } from 'lucide-react';
import { Product } from '../types';

interface ClientCompareProps {
  setView: (view: string, params?: any) => void;
}

export default function ClientCompare({ setView }: ClientCompareProps) {
  const { compare, removeFromCompare, clearCompare, addToCart } = useStore();

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
  };

  if (compare.length === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600 mb-2">
          <GitCompare className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">No Devices to Compare</h2>
        <p className="text-xs text-gray-400 max-w-sm mx-auto">
          Add some high-end gadgets to compare specifications side-by-side!
        </p>
        <button
          onClick={() => setView('shop')}
          className="rounded-xl bg-blue-600 px-6 py-3 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
        >
          Browse Catalogue
        </button>
      </div>
    );
  }

  // Get unique list of specification keys across all devices
  const allSpecKeys = Array.from(
    new Set(compare.flatMap((p) => Object.keys(p.specifications)))
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Compare Hardware</h1>
          <p className="text-xs text-gray-400 mt-1">Lined up side-by-side specs comparison for selected tech gear</p>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-red-600 hover:underline"
        >
          Clear Comparison Matrix
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-150 bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-xs table-fixed min-w-[640px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-150">
              <th className="p-4 w-1/4 font-black uppercase text-gray-400 tracking-wider">Device Specs</th>
              {compare.map((p) => (
                <th key={p.id} className="p-4 border-l border-gray-100 relative group">
                  <button
                    onClick={() => removeFromCompare(p.id)}
                    className="absolute top-2 right-2 rounded-full p-1 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition-all cursor-pointer shadow-xs"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>

                  <div className="space-y-2 mt-4 text-center">
                    <img src={p.images[0]} alt="" className="mx-auto h-20 w-20 object-cover rounded-xl border bg-gray-50" />
                    <h3 className="font-extrabold text-gray-900 line-clamp-2 hover:text-blue-600 cursor-pointer" onClick={() => setView('product-details', { id: p.id })}>
                      {p.name}
                    </h3>
                    <div>
                      <p className="font-black text-blue-600">৳{(p.discountPrice > 0 ? p.discountPrice : p.price).toLocaleString()}</p>
                      {p.discountPrice > 0 && (
                        <p className="text-[10px] text-gray-400 line-through">৳{p.price.toLocaleString()}</p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handleAddToCart(p)}
                      disabled={p.stock === 0}
                      className="w-full rounded-lg bg-neutral-900 text-white hover:bg-blue-600 py-1.5 text-[10px] font-bold transition-all disabled:bg-gray-200 disabled:text-gray-400 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-150">
            {/* Base info */}
            <tr>
              <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">Brand Partner</td>
              {compare.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-gray-100 font-bold text-gray-800">{p.brand}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">Category Type</td>
              {compare.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-gray-100 font-bold text-gray-800">{p.category}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">SKU Code</td>
              {compare.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-gray-100 font-mono text-gray-500 font-bold">{p.sku}</td>
              ))}
            </tr>
            <tr>
              <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">Fulfillment Stock</td>
              {compare.map((p) => (
                <td key={p.id} className="p-3.5 border-l border-gray-100">
                  {p.stock > 0 ? (
                    <span className="rounded bg-green-50 text-green-700 font-bold text-[9px] px-2 py-0.5 border border-green-100">In Stock ({p.stock})</span>
                  ) : (
                    <span className="rounded bg-red-50 text-red-700 font-bold text-[9px] px-2 py-0.5 border border-red-100">Sold Out</span>
                  )}
                </td>
              ))}
            </tr>

            {/* Dynamic Specification rows */}
            {allSpecKeys.map((key) => (
              <tr key={key as string} className="hover:bg-gray-50/30">
                <td className="p-3.5 font-bold text-gray-700 bg-gray-50/50">{key as string}</td>
                {compare.map((p) => (
                  <td key={p.id} className="p-3.5 border-l border-gray-100 text-gray-600 font-medium">
                    {p.specifications[key as string] || <span className="text-gray-300">—</span>}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
