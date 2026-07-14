import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useStore } from '../lib/store';
import { Product, Review } from '../types';
import ProductCard from '../components/ProductCard';
import { Star, ShieldCheck, Heart, GitCompare, ShoppingCart, Truck, RefreshCw, Send, ArrowLeft, Share2, Smartphone, Wifi } from 'lucide-react';

interface ClientProductDetailsProps {
  productId: string;
  setView: (view: string, params?: any) => void;
}

export default function ClientProductDetails({ productId, setView }: ClientProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [activeImage, setActiveImage] = useState('');
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  // Review Form state
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const { addToCart, toggleWishlist, isInWishlist, toggleCompare, isInCompare } = useStore();
  const user = api.getCurrentUser();

  useEffect(() => {
    setLoading(true);
    setReviewSuccess(false);
    setComment('');
    setRating(5);

    api.getProduct(productId)
      .then(data => {
        setProduct(data);
        setActiveImage(data.images[0] || '');
        
        // Auto-select first variant options
        if (data.variants) {
          const defaults: Record<string, string> = {};
          data.variants.forEach(v => {
            defaults[v.name] = v.options[0];
          });
          setSelectedVariants(defaults);
        }

        // Fetch related products (same category, different ID)
        api.getProducts({ category: data.category })
          .then(related => {
            setRelatedProducts(related.filter((p: Product) => p.id !== data.id).slice(0, 4));
          })
          .catch(console.error);

        // Fetch product reviews (approved only)
        api.getReviews(productId, true)
          .then(setReviews)
          .catch(console.error);
      })
      .catch(err => {
        console.error(err);
        setProduct(null);
      })
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-gray-800">Product not found</h2>
        <p className="text-sm text-gray-400">The product you are trying to view does not exist or has been removed.</p>
        <button onClick={() => setView('shop')} className="rounded-xl bg-blue-600 text-white px-5 py-2.5 text-xs font-bold">
          Return to Shop
        </button>
      </div>
    );
  }

  const inWish = isInWishlist(product.id);
  const inComp = isInCompare(product.id);
  const activePrice = product.discountPrice > 0 ? product.discountPrice : product.price;
  const hasDiscount = product.discountPrice > 0;
  
  const selectedVariantString = Object.entries(selectedVariants)
    .map(([k, v]) => `${k}: ${v}`)
    .join(', ');

  const handleAddToCart = () => {
    if (product.stock > 0) {
      addToCart(product, quantity, selectedVariantString || undefined);
    }
  };

  const handleBuyNow = () => {
    if (product.stock > 0) {
      addToCart(product, quantity, selectedVariantString || undefined);
      setView('cart');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    if (!user) {
      setReviewError('You must be signed in to submit a review.');
      return;
    }

    if (!comment.trim()) {
      setReviewError('Please write your review feedback.');
      return;
    }

    try {
      await api.submitReview({
        productId: product.id,
        productName: product.name,
        userName: user.name,
        userEmail: user.email,
        rating,
        comment,
        isApproved: false // Needs admin approval by default
      });
      setReviewSuccess(true);
      setComment('');
      setRating(5);
    } catch (err: any) {
      setReviewError(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      
      {/* Upper Grid Layout */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        
        {/* 1. Image Gallery with Hover zoom */}
        <div className="space-y-4">
          <div className="group relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xs">
            <img
              src={activeImage}
              alt={product.name}
              className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-130 cursor-zoom-in"
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Thumbnails list */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg border-2 bg-white transition-all ${img === activeImage ? 'border-blue-600 scale-95' : 'border-gray-100'}`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 2. Buy Box & Product Info */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            
            {/* Navigation and Actions Breadcrumb */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <button 
                onClick={() => setView('shop')}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Shop
              </button>
              
              <div className="flex items-center gap-2.5">
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-2 rounded-full border border-gray-100 hover:bg-gray-50 transition-colors ${inWish ? 'text-pink-600 bg-pink-50' : 'text-gray-400'}`}
                  title={inWish ? 'In Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`h-4 w-4 ${inWish ? 'fill-current' : ''}`} />
                </button>
                <button 
                  className="p-2 rounded-full border border-gray-100 hover:bg-gray-50 text-gray-400 transition-colors"
                  title="Share product"
                >
                  <Share2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* SKU and Breadcrumbs */}
            <div className="flex items-center justify-between text-[10px] font-black text-gray-400 uppercase tracking-widest">
              <span>SKU: {product.sku}</span>
              <span>{product.category} • {product.brand}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-black text-gray-950 tracking-tight leading-none">{product.name}</h1>
            <p className="text-xs text-gray-400 font-bold">By <span className="text-blue-600 hover:underline cursor-pointer">{product.brand}</span></p>

            {/* Ratings summary banner */}
            <div className="flex items-center gap-2 pt-1">
              <div className="flex text-amber-400">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <span className="text-xs font-extrabold text-neutral-800">{product.rating}</span>
              <span className="text-xs font-bold text-gray-400">({reviews.length} Verified Reviews)</span>
            </div>

            {/* Pricing Section */}
            <div className="flex items-baseline gap-2.5 pt-2">
              <p className="text-2xl font-black text-neutral-900">৳{activePrice.toLocaleString()}</p>
              {hasDiscount && (
                <p className="text-xs text-gray-400 line-through font-bold">
                  ৳{product.price.toLocaleString()}
                </p>
              )}
            </div>

            {/* Short description summary */}
            <p className="text-xs text-gray-500 leading-relaxed font-medium">
              {product.description}
            </p>

            {/* Variants Picker with screenshot styling */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                {product.variants.map((variant) => {
                  const isColorVariant = variant.name.toLowerCase().includes('color') || variant.name.toLowerCase().includes('colour');
                  
                  return (
                    <div key={variant.name} className="space-y-2">
                      <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">{variant.name}</h4>
                      <div className="flex flex-wrap gap-2.5">
                        {variant.options.map((opt) => {
                          const isSelected = selectedVariants[variant.name] === opt;
                          
                          if (isColorVariant) {
                            // Render round color option pill
                            const getColorDotStyle = (colorName: string) => {
                              const name = colorName.toLowerCase();
                              if (name.includes('desert') || name.includes('gold')) return '#C5B358';
                              if (name.includes('natural') || name.includes('gray') || name.includes('titanium')) return '#A2A2A1';
                              if (name.includes('white') || name.includes('silver')) return '#EFEFEF';
                              if (name.includes('black') || name.includes('charcoal')) return '#2E2D2C';
                              if (name.includes('blue')) return '#3B82F6';
                              if (name.includes('green')) return '#10B981';
                              if (name.includes('red')) return '#EF4444';
                              return '#6B7280'; // fallback
                            };

                            return (
                              <button
                                key={opt}
                                onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all border ${
                                  isSelected 
                                    ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-extrabold shadow-xs' 
                                    : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                <span 
                                  className="h-3 w-3 rounded-full border border-black/10 shrink-0" 
                                  style={{ backgroundColor: getColorDotStyle(opt) }} 
                                />
                                {opt}
                              </button>
                            );
                          } else {
                            // Render outline pill
                            return (
                              <button
                                key={opt}
                                onClick={() => setSelectedVariants(prev => ({ ...prev, [variant.name]: opt }))}
                                className={`rounded-xl px-4.5 py-2.5 text-xs font-bold transition-all border ${
                                  isSelected 
                                    ? 'border-blue-600 text-blue-600 bg-white ring-1 ring-blue-600 font-extrabold' 
                                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'
                                }`}
                              >
                                {opt}
                              </button>
                            );
                          }
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* A Snapshot View Specifications Panel from screenshot */}
            <div className="space-y-2.5 pt-4 border-t border-gray-100">
              <h4 className="text-xs font-black text-gray-800 uppercase tracking-wider">A Snapshot View</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 border border-gray-150">
                    <Smartphone className="h-4 w-4 text-gray-400" />
                  </div>
                  <span>
                    {product.specifications['Display'] || product.specifications['Screen'] || 'Super Retina XDR OLED Display'}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-medium text-gray-600">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-50 border border-gray-150">
                    <Wifi className="h-4 w-4 text-gray-400" />
                  </div>
                  <span>
                    {product.specifications['Connectivity'] || product.specifications['Battery'] || 'Ultra Wireless Charging System'}
                  </span>
                </div>
              </div>
            </div>

          </div>

          {/* Add-to-cart Counters and triggers */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            {product.stock > 0 && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-gray-800 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50/50 p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="h-8 w-8 text-sm font-bold hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    -
                  </button>
                  <span className="w-10 text-center text-xs font-black text-gray-800">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="h-8 w-8 text-sm font-bold hover:bg-white rounded-lg transition-colors border border-transparent hover:border-gray-200"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl border-2 border-blue-600 bg-white hover:bg-blue-50 text-blue-600 disabled:border-gray-200 disabled:bg-white disabled:text-gray-300 py-3.5 text-sm font-black transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                Buy Now
              </button>
              
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white py-3.5 text-sm font-black transition-all transform hover:scale-[1.01] active:scale-95 cursor-pointer"
              >
                Add to Cart
              </button>
            </div>

            {/* Quick indicators */}
            <div className="flex justify-between items-center text-[10px] text-gray-400 font-bold pt-1.5 uppercase tracking-wider">
              <span>✈️ Free worldwide express shipping</span>
              <span>🔒 Encrypted checkout</span>
            </div>
          </div>
        </div>
      </div>

      {/* Accordion tabs: description / technical specifications */}
      <section className="grid grid-cols-1 gap-12 lg:grid-cols-3 pt-8 border-t border-gray-100">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Technical Specifications</h3>
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <tbody>
                {Object.entries(product.specifications).map(([key, val], idx) => (
                  <tr key={key} className={idx % 2 === 0 ? 'bg-gray-50/50' : 'bg-white'}>
                    <td className="p-3.5 font-bold text-gray-700 w-1/3 border-b border-gray-100">{key}</td>
                    <td className="p-3.5 text-gray-600 border-b border-gray-100">{val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shipping highlights */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 space-y-4 h-fit">
          <h3 className="text-xs font-black uppercase tracking-widest text-neutral-900">Shopping Support</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Truck className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">Nationwide Shipping</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Prompt delivery across Bangladesh. Free shipping on large order tiers.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <RefreshCw className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">7-Day Easy Return</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Change of mind or defect claims processed within a week of purchase.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <ShieldCheck className="h-5 w-5 text-blue-600 shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">1 Year Official Warranty</h4>
                <p className="text-[11px] text-gray-500 mt-0.5">Authorized service center claims for all covered tech components.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews block (List and write review submission form) */}
      <section className="space-y-8 pt-8 border-t border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Customer Feedback ({reviews.length})</h3>
            <p className="text-xs text-gray-400 mt-0.5">Authentic buyer recommendations and rating reviews</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {/* Reviews list */}
          <div className="space-y-4 max-h-[460px] overflow-y-auto pr-2">
            {reviews.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-gray-200 p-8 text-center text-xs text-gray-400">
                Be the first to review this product! Help fellow tech enthusiasts with your feedback.
              </div>
            ) : (
              reviews.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-50 bg-white p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-gray-800">{r.userName}</span>
                    <span className="text-gray-400 text-[10px]">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex text-amber-400">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < r.rating ? 'fill-current' : 'text-gray-200'}`}
                      />
                    ))}
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed font-medium">"{r.comment}"</p>

                  {r.reply && (
                    <div className="rounded-lg bg-blue-50/50 p-3 text-[11px] text-gray-700 leading-normal border-l-2 border-blue-600">
                      <p className="font-bold text-blue-800 mb-0.5">BazareX Support Response</p>
                      {r.reply}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Form write feedback */}
          <div className="rounded-2xl bg-gray-50 p-6 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900">Share Your Device Experience</h4>
            
            {reviewSuccess ? (
              <div className="rounded-xl bg-green-50 p-4 text-xs font-semibold text-green-600 leading-relaxed border border-green-100">
                🎉 Review submitted successfully! Thank you for sharing your experience. It will appear on the product catalog shortly pending moderator approval.
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit} className="space-y-4">
                {reviewError && (
                  <div className="rounded-xl bg-red-50 p-3 text-xs text-red-600 font-semibold">
                    {reviewError}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Rating Score
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => setRating(i + 1)}
                          className="hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star
                            className={`h-5 w-5 ${i < rating ? 'fill-current' : 'text-gray-200'}`}
                          />
                        </button>
                      ))}
                    </div>
                    <span className="text-xs font-bold text-gray-600">{rating} out of 5 stars</span>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Feedback Comment
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Describe product performance, sound quality, aesthetics, or unboxing feedback..."
                    className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-neutral-900 hover:bg-blue-600 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
                >
                  <Send className="h-4 w-4" />
                  Submit Feedback
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Related/Complementary Devices Grid */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-black uppercase tracking-wider text-gray-900">Related Tech Devices</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} setView={setView} />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
