'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { MapPin, ShoppingCart, Star, Truck, Tag, Info } from 'lucide-react';
import { Product, products } from '@/data/products';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

interface ProductDetailSheetProps {
  product: Product;
}

export default function ProductDetailSheet({ product }: ProductDetailSheetProps) {
  const [selectedVariant, setSelectedVariant] = useState<'classic' | 'deluxe' | 'premium'>('classic');
  const [selectedCity, setSelectedCity] = useState('');
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [openSections, setOpenSections] = useState({
    description: true,
    care: false,
    delivery: false,
  });
  const { formatPrice } = useCurrency();

  const variants = {
    classic: {
      name: 'Classic',
      price: product.price,
      stems: '10 stems',
      description: `Bouquet of 10 stems with green fillers and baby's breath wrapped in elegant paper with ribbons`,
    },
    deluxe: {
      name: 'Deluxe',
      price: Math.round(product.price * 1.5),
      stems: '20 stems',
      description: `Bouquet of 20 stems with green fillers and baby's breath wrapped in elegant paper with ribbons`,
    },
    premium: {
      name: 'Premium',
      price: Math.round(product.price * 2),
      stems: '30 stems',
      description: `Bouquet of 30 stems with green fillers and baby's breath wrapped in elegant paper with ribbons`,
    },
  };

  const cities = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Hyderabad', 'Chennai', 'Kolkata'];

  const currentVariant = variants[selectedVariant];

  const careGuide = [
    'Trim the stems by 1 inch and place in fresh, room-temperature water.',
    'Refresh water and flower food every 24 hours to keep blooms perky.',
    'Display away from direct sunlight, ceiling fans, or heating vents.',
  ];

  const deliveryNotes = product.deliveryInfo
    ? [product.deliveryInfo]
    : [
        'Same-day delivery available across major metro cities.',
        'Our chilled courier partners ensure every bouquet arrives fresh.',
        'Real-time tracking and delivery OTP confirmation for every order.',
      ];
  const toggleSection = (section: 'description' | 'care' | 'delivery') => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };


  useEffect(() => {
    if (typeof window === 'undefined') return;
    const recentlyViewed = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const filtered = recentlyViewed.filter((item: any) => item.id !== product.id);
    filtered.unshift({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    localStorage.setItem('recentlyViewed', JSON.stringify(filtered.slice(0, 10)));
  }, [product]);

  const handleAddToCart = () => {
    if (typeof window === 'undefined') return;

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existingItem = cart.find(
      (item: any) => item.id === product.id && item.variant === selectedVariant
    );

    if (existingItem) {
      existingItem.quantity += 1;
      existingItem.price = currentVariant.price;
    } else {
      cart.push({
        id: product.id,
        name: `${product.name} - ${variants[selectedVariant].name}`,
        price: currentVariant.price,
        image: product.image,
        quantity: 1,
        variant: selectedVariant,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    setIsAdded(true);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  // Get related products from same category
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <>
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left Side - Product Images */}
      <div className="space-y-4">
        {/* Main Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-gray-100">
          <Image
            src={product.image ?? '/file.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
            priority
          />
          {product.badge && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
              {product.badge}
            </div>
          )}
        </div>

        {/* Thumbnail Images */}
        <div className="grid grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 border-2 border-transparent hover:border-emerald-500 cursor-pointer transition-all">
              <Image
                src={product.image ?? '/file.svg'}
                alt={`${product.name} view ${i}`}
                fill
                sizes="25vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Product ID */}
        <p className="text-sm text-gray-500 italic">Product ID: #{product.id}5765</p>
      </div>

      {/* Right Side - Product Details */}
      <div className="relative space-y-6">
        {/* Price and Rating */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {formatPrice(currentVariant.price)}
            </span>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-sm text-gray-600 ml-1">{product.reviews} ratings</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h1>
        </div>

        {/* Variant Selection */}
        <div>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(variants) as Array<keyof typeof variants>).map((key) => {
              const variant = variants[key];
              const isSelected = selectedVariant === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedVariant(key)}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    isSelected
                      ? 'border-emerald-500 bg-emerald-50'
                      : 'border-gray-200 hover:border-emerald-300'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={product.image ?? '/file.svg'}
                      alt={variant.name}
                      width={32}
                      height={32}
                      className="rounded"
                    />
                    <span className={`font-bold text-sm ${isSelected ? 'text-emerald-600' : 'text-gray-900'}`}>
                      {variant.name}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600">{formatPrice(variant.price)}</p>
                  <p className="text-xs text-gray-500 mt-1">{variant.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Additional Options */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-2">
            <Tag className="w-5 h-5 text-gray-600" />
            <span className="text-sm text-gray-700">Arrange in Glass Vase</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-900">{formatPrice(200000)}</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>

        {/* City Selection */}
        <div className="relative">
          <button
            onClick={() => setShowCityDropdown(!showCityDropdown)}
            className="w-full flex items-center justify-between p-4 border-2 border-gray-200 rounded-xl hover:border-emerald-500 transition-all"
          >
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-red-500" />
              <span className="text-gray-700">{selectedCity || 'Choose City'}</span>
            </div>
            <svg className={`w-5 h-5 text-gray-600 transition-transform ${showCityDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showCityDropdown && (
            <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg max-h-60 overflow-auto">
              {cities.map((city) => (
                <button
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setShowCityDropdown(false);
                  }}
                  className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors"
                >
                  {city}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
            isAdded ? 'bg-emerald-600 text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
          }`}
        >
          {isAdded ? (
            <>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </>
          )}
        </button>

        {/* Tabs */}
        <div className="border-t border-gray-200 pt-6">
          <div className="space-y-4">
            <div>
              <button
                type="button"
                onClick={() => toggleSection('description')}
                className="w-full flex items-center justify-between py-3 border-b border-gray-200"
              >
                <span className="font-semibold text-gray-900">Description</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openSections.description ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.description && (
                <div className="pt-3 text-sm text-gray-600 leading-relaxed space-y-3">
                  <p>{product.description}</p>
                  {product.composition && product.composition.length > 0 && (
                    <ul className="list-disc pl-5 space-y-2">
                      {product.composition.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleSection('care')}
                className="w-full flex items-center justify-between py-3 border-b border-gray-200"
              >
                <span className="font-semibold text-gray-900">Care Guide</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openSections.care ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.care && (
                <div className="pt-3 text-sm text-gray-600">
                  <ul className="list-disc pl-5 space-y-2">
                    {careGuide.map((tip) => (
                      <li key={tip}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <button
                type="button"
                onClick={() => toggleSection('delivery')}
                className="w-full flex items-center justify-between py-3 border-b border-gray-200"
              >
                <span className="font-semibold text-gray-900">Delivery Information</span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openSections.delivery ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openSections.delivery && (
                <div className="pt-3 text-sm text-gray-600 space-y-2">
                  {deliveryNotes.map((note) => (
                    <p key={note}>{note}</p>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Related Products Section */}
    {relatedProducts.length > 0 && (
      <div className="mt-16 border-t border-gray-200 pt-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
            <p className="text-gray-600 mt-1">You might also like these flowers</p>
          </div>
          <Link
            href="/"
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1"
          >
            View All
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {relatedProducts.map((relatedProduct) => (
            <Link
              key={relatedProduct.id}
              href={`/products/${relatedProduct.id}`}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-3">
                <Image
                  src={relatedProduct.image ?? '/file.svg'}
                  alt={relatedProduct.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
                {relatedProduct.badge && (
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    {relatedProduct.badge}
                  </div>
                )}
                {relatedProduct.originalPrice && (
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Save {formatPrice(relatedProduct.originalPrice - relatedProduct.price)}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                  {relatedProduct.name}
                </h3>
                <div className="flex items-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(relatedProduct.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-gray-500">({relatedProduct.reviews})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    {formatPrice(relatedProduct.price)}
                  </span>
                  {relatedProduct.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {formatPrice(relatedProduct.originalPrice)}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    )}
    </>
  );
}

