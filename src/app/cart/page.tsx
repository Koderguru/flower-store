'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react';
import { products, type Product } from '@/data/products';
import { useCurrency } from '@/context/CurrencyContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  variant?: string;
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [cartNotice, setCartNotice] = useState<string | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadCart();
    
    const handleCartUpdate = () => loadCart();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(cart);
  };

  const updateQuantity = (id: string, change: number, variant?: string) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === id && item.variant === variant) {
        const newQuantity = Math.max(1, item.quantity + change);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const removeItem = (id: string, variant?: string) => {
    const updatedCart = cartItems.filter(item => !(item.id === id && item.variant === variant));
    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );
  const discountAmount = useMemo(
    () => Math.round((subtotal * discountPercent) / 100),
    [subtotal, discountPercent]
  );
  const total = Math.max(subtotal - discountAmount, 0);

  const handleApplyCoupon = () => {
    const code = couponCode.trim().toUpperCase();

    if (!code) {
      setCouponMessage({ type: 'error', text: 'Please enter a coupon code to apply.' });
      return;
    }

    if (code === 'BLOOM10') {
      setDiscountPercent(10);
      setCouponMessage({ type: 'success', text: 'Coupon applied! You saved 10% on your order.' });
    } else if (code === 'FIRSTFLOWER15') {
      setDiscountPercent(15);
      setCouponMessage({ type: 'success', text: 'Amazing! Enjoy a 15% discount on this order.' });
    } else {
      setDiscountPercent(0);
      setCouponMessage({ type: 'error', text: 'Sorry, that coupon code is not valid.' });
    }
  };

  const handleRemoveCoupon = () => {
    setDiscountPercent(0);
    setCouponMessage({ type: 'success', text: 'Coupon removed. You can try another code anytime!' });
  };

  const recommendedProducts = useMemo(() => {
    const cartIds = new Set(cartItems.map((item) => item.id));
    return products.filter((product) => !cartIds.has(product.id)).slice(0, 4);
  }, [cartItems]);

  const handleAddRecommended = (product: Product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    let updatedCart: CartItem[];

    if (existingItem) {
      updatedCart = cartItems.map((item) =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      );
    } else {
      updatedCart = [
        ...cartItems,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1,
        },
      ];
    }

    setCartItems(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
    setCartNotice(`${product.name} was added to your cart.`);

    setTimeout(() => setCartNotice(null), 3000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-20">
            <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-8">Add some beautiful flowers to your cart!</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Continue Shopping
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">{cartItems.length} items in your cart</p>
        </div>

        {cartNotice && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {cartNotice}
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.id}-${item.variant ?? 'default'}`}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                <div className="flex gap-6">
                  {/* Product Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={item.image || '/file.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <Link
                      href={`/products/${item.id}`}
                      className="font-semibold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-2"
                    >
                      {item.name}
                    </Link>
                    {item.variant && (
                      <p className="text-xs uppercase tracking-wide text-emerald-600 mt-1">
                        Variant: {item.variant}
                      </p>
                    )}
                    <p className="text-lg font-bold text-gray-900 mt-2">
                      {formatPrice(item.price)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2 border border-gray-200 rounded-lg">
                        <button
                          onClick={() => updateQuantity(item.id, -1, item.variant)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, 1, item.variant)}
                          className="p-2 hover:bg-gray-50 transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.id, item.variant)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Subtotal</p>
                    <p className="text-xl font-bold text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {recommendedProducts.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">You may also love</h2>
                  <span className="text-sm text-gray-500">Handpicked picks inspired by your cart</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                  {recommendedProducts.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg border border-gray-100 p-4 hover:shadow-md transition-shadow flex flex-col"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-gray-100 mb-4">
                        <Image
                          src={product.image || '/file.svg'}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
                        {product.name}
                      </h3>
                      <p className="text-base font-bold text-gray-900 mt-2">
                        {formatPrice(product.price)}
                      </p>
                      <button
                        type="button"
                        onClick={() => handleAddRecommended(product)}
                        className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Have a coupon?</label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code e.g. BLOOM10"
                    className="flex-1 border border-gray-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                  {discountPercent > 0 ? (
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="px-4 py-3 rounded-lg border border-red-200 text-red-600 font-semibold hover:bg-red-50 transition-colors"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={handleApplyCoupon}
                      className="px-4 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {couponMessage && (
                  <p
                    className={`mt-2 text-sm ${
                      couponMessage.type === 'success' ? 'text-emerald-600' : 'text-red-600'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discountPercent > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount ({discountPercent}%)</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 rounded-lg transition-colors shadow-lg flex items-center justify-center gap-2"
              >
                <CreditCard className="w-5 h-5" />
                Proceed to Checkout
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Free delivery on orders above {formatPrice(10000000)}. Express upgrades available at checkout.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

