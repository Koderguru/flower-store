'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { ShoppingCart, Heart, Star, Truck } from 'lucide-react';
import Lottie from 'lottie-react';
import shoppingCartAnimation from '@/data/Shopping Cart.json';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image?: string;
  rating?: number;
  reviews?: number;
  badge?: string;
  index?: number;
}

export default function ProductCard({
  id,
  name,
  price,
  originalPrice,
  rating = 4.5,
  reviews = 0,
  badge,
  image = '/file.svg',
}: ProductCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!showLottie) return;
    const timer = setTimeout(() => setShowLottie(false), 2000);
    return () => clearTimeout(timer);
  }, [showLottie]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Add to cart in localStorage
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find((item: any) => item.id === id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id,
        name,
        price,
        image,
        quantity: 1,
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Add to recently viewed
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recentlyViewed.filter((item: any) => item.id !== id);
    filtered.unshift({ id, name, price, image });
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
    
    setIsAdded(true);
    setShowLottie(true);
    
    // Dispatch custom event for cart update
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  return (
    <>
      <Link href={`/products/${id}`} className="product-card group block">
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden bg-gray-50">
          <Image
            src={image}
            alt={name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          {(badge || discount > 0) && (
            <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
              {badge && (
                <span className="inline-block px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-md shadow-md">
                  {badge}
                </span>
              )}
              {discount > 0 && (
                <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-md shadow-md">
                  {discount}% OFF
                </span>
              )}
            </div>
          )}

          {/* Like Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsLiked(!isLiked);
            }}
            className="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
              }`}
            />
          </button>

          {/* Delivery Badge - Shows on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="bg-white/95 backdrop-blur rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
              <Truck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-semibold text-gray-900">Same Day Delivery</span>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-4">
          {/* Product Name */}
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors min-h-[2.5rem]">
            {name}
          </h3>

          {/* Rating */}
          {reviews > 0 && (
            <div className="flex items-center gap-1 mb-3">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3.5 h-3.5 ${
                      i < Math.floor(rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs text-gray-500">({reviews})</span>
            </div>
          )}

          {/* Price Section */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">
                Rp {price.toLocaleString()}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  Rp {originalPrice.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            ref={buttonRef}
            onClick={handleAddToCart}
            className={`relative w-full py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
              isAdded
                ? 'bg-green-600 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isAdded ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </>
            )}
          </button>

        </div>
        </div>
      </Link>
      {isMounted && showLottie && buttonRef.current
        ? createPortal(
            <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 pointer-events-none">
              <div className="w-full max-w-[360px] rounded-3xl bg-white shadow-2xl border border-emerald-100 px-6 py-6 sm:px-8 sm:py-7 flex flex-col items-center gap-4">
                <Lottie
                  animationData={shoppingCartAnimation}
                  loop={false}
                  className="w-[60vw] max-w-[240px] sm:max-w-[280px]"
                  style={{ height: 'auto' }}
                />
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700 text-center">
                  Adding to Cart
                </p>
              </div>
            </div>,
            document.body
          )
        : null}
    </>
  );
}
