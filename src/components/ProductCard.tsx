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
  const [likeAnimating, setLikeAnimating] = useState(false);
  const [showLikeBurst, setShowLikeBurst] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [showLottie, setShowLottie] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!showLottie) return;
    const timer = setTimeout(() => setShowLottie(false), 2000);
    return () => clearTimeout(timer);
  }, [showLottie]);

  const likeAnimationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const likeBurstTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (likeAnimationTimeoutRef.current) {
        clearTimeout(likeAnimationTimeoutRef.current);
      }
      if (likeBurstTimeoutRef.current) {
        clearTimeout(likeBurstTimeoutRef.current);
      }
    };
  }, []);

  const handleToggleLike = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLiked((prev) => {
      const next = !prev;
      if (next) {
        setShowLikeBurst(true);
        if (likeBurstTimeoutRef.current) {
          clearTimeout(likeBurstTimeoutRef.current);
        }
        likeBurstTimeoutRef.current = setTimeout(() => {
          setShowLikeBurst(false);
        }, 900);
      } else {
        setShowLikeBurst(false);
      }
      return next;
    });
    setLikeAnimating(true);
    if (likeAnimationTimeoutRef.current) {
      clearTimeout(likeAnimationTimeoutRef.current);
    }
    likeAnimationTimeoutRef.current = setTimeout(() => {
      setLikeAnimating(false);
    }, 520);
  };

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
        <div
          ref={cardRef}
          className={`relative bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-300 transform ${
            isLiked ? 'shadow-xl shadow-rose-200/70 scale-[1.01]' : ''
          } ${likeAnimating ? 'scale-[1.02]' : ''} hover:shadow-xl`}
        >
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
          <div className="absolute top-3 right-3 z-20">
            <button
              onClick={handleToggleLike}
              className="relative w-10 h-10 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-md hover:bg-white hover:scale-110 transition-all z-10 overflow-hidden"
              aria-label="Add to wishlist"
            >
              {isLiked && (
                <span className="like-glow absolute inset-0" />
              )}
              {likeAnimating && (
                <>
                  <span className="absolute inset-0 rounded-full bg-red-100/70 animate-ping" />
                  <span className="like-ripple" />
                </>
              )}
              <Heart
                className={`w-5 h-5 transition-all duration-300 ${
                  isLiked ? 'fill-red-500 text-red-500' : 'text-gray-600'
                } ${likeAnimating ? 'scale-125 rotate-6' : 'scale-100'} transform`}
              />
            </button>
            {showLikeBurst && (
              <div className="pointer-events-none absolute -top-6 -right-6 w-24 h-24">
                <span className="like-ring ring-1" />
                <span className="like-ring ring-2" />
                <span className="like-petal petal-1" />
                <span className="like-petal petal-2" />
                <span className="like-petal petal-3" />
                <span className="like-spark spark-1" />
                <span className="like-spark spark-2" />
                <span className="like-spark spark-3" />
              </div>
            )}
          </div>

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
      {isMounted && showLottie && cardRef.current
        ? createPortal(
            <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center bg-white/80 backdrop-blur-sm">
              <div className="w-[min(80%,320px)] max-w-[260px] rounded-3xl bg-white shadow-xl px-5 py-6 sm:px-6 sm:py-7 flex flex-col items-center gap-4">
                <Lottie animationData={shoppingCartAnimation} loop={false} className="w-full max-w-[220px]" style={{ height: 'auto' }} />
                <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.32em] text-emerald-700 text-center">
                  Adding to Cart
                </p>
              </div>
            </div>,
            cardRef.current
          )
        : null}
      <style jsx>{`
        .like-glow {
          opacity: 0;
          border-radius: 9999px;
          background: radial-gradient(circle at 50% 40%, rgba(254, 226, 226, 0.9), rgba(251, 113, 133, 0.35));
          animation: like-glow 1s ease-out forwards;
        }
        .like-ripple {
          position: absolute;
          inset: -6px;
          border-radius: 9999px;
          border: 2px solid rgba(251, 113, 133, 0.35);
          opacity: 0;
          animation: like-ripple 0.6s ease-out forwards;
        }
        .like-spark {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border-radius: 9999px;
          background: radial-gradient(circle at 30% 30%, #fda4af, #fb7185);
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.4);
          filter: blur(0.2px);
        }
        .like-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 12px;
          height: 12px;
          border: 2px solid rgba(251, 113, 133, 0.35);
          border-radius: 9999px;
          opacity: 0;
        }
        .ring-1 {
          animation: like-ring-burst 0.85s ease-out forwards;
        }
        .ring-2 {
          animation: like-ring-burst 0.85s ease-out forwards 120ms;
        }
        .like-petal {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 10px;
          height: 18px;
          border-radius: 9999px;
          background: linear-gradient(180deg, #fb7185 0%, #f43f5e 100%);
          opacity: 0;
          transform-origin: center;
        }
        .petal-1 {
          animation: petal-one 0.8s ease-out forwards;
        }
        .petal-2 {
          animation: petal-two 0.8s ease-out forwards 60ms;
        }
        .petal-3 {
          animation: petal-three 0.8s ease-out forwards 120ms;
        }
        .spark-1 {
          animation: spark-one 0.7s ease-out forwards;
        }
        .spark-2 {
          animation: spark-two 0.7s ease-out forwards 60ms;
        }
        .spark-3 {
          animation: spark-three 0.7s ease-out forwards 120ms;
        }
        @keyframes like-glow {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          40% {
            opacity: 1;
            transform: scale(1.05);
          }
          100% {
            opacity: 0;
            transform: scale(1.4);
          }
        }
        @keyframes like-ripple {
          0% {
            opacity: 0.8;
            transform: scale(0.6);
          }
          100% {
            opacity: 0;
            transform: scale(1.25);
          }
        }
        @keyframes like-ring-burst {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          40% {
            opacity: 0.9;
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(2.1);
          }
        }
        @keyframes petal-one {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(-18deg);
          }
          45% {
            opacity: 1;
            transform: translate(-140%, -160%) scale(0.9) rotate(-28deg);
          }
          100% {
            opacity: 0;
            transform: translate(-200%, -250%) scale(0.4) rotate(-38deg);
          }
        }
        @keyframes petal-two {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(6deg);
          }
          45% {
            opacity: 1;
            transform: translate(-40%, -220%) scale(1) rotate(12deg);
          }
          100% {
            opacity: 0;
            transform: translate(-40%, -300%) scale(0.5) rotate(22deg);
          }
        }
        @keyframes petal-three {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.3) rotate(24deg);
          }
          45% {
            opacity: 1;
            transform: translate(90%, -150%) scale(0.85) rotate(32deg);
          }
          100% {
            opacity: 0;
            transform: translate(140%, -220%) scale(0.45) rotate(42deg);
          }
        }
        @keyframes spark-one {
          0% {
            opacity: 0;
            transform: translate(-40%, -40%) scale(0.4);
          }
          40% {
            opacity: 0.9;
            transform: translate(-110%, -120%) scale(1.05);
          }
          100% {
            opacity: 0;
            transform: translate(-150%, -190%) scale(0.6);
          }
        }
        @keyframes spark-two {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.4);
          }
          40% {
            opacity: 0.9;
            transform: translate(-60%, -160%) scale(1.15);
          }
          100% {
            opacity: 0;
            transform: translate(-60%, -220%) scale(0.6);
          }
        }
        @keyframes spark-three {
          0% {
            opacity: 0;
            transform: translate(-60%, -40%) scale(0.4);
          }
          40% {
            opacity: 0.9;
            transform: translate(20%, -120%) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(70%, -190%) scale(0.55);
          }
        }
      `}</style>
    </>
  );
}
