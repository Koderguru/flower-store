'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, ArrowLeft, CheckCircle2, Truck, MapPin, Wallet } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

type ShippingMethod = 'standard' | 'express' | 'same_day';
type PaymentMethod = 'credit_card' | 'debit_card' | 'paypal' | 'western_union';

const shippingOptions: Array<{
  id: ShippingMethod;
  label: string;
  description: string;
  price: number;
  eta: string;
}> = [
  {
    id: 'standard',
    label: 'Standard Delivery',
    description: 'Arrives in 3-5 business days',
    price: 0,
    eta: '3-5 business days',
  },
  {
    id: 'express',
    label: 'Express Delivery',
    description: 'Dispatched within 24 hours',
    price: 299,
    eta: '1-2 business days',
  },
  {
    id: 'same_day',
    label: 'Same-Day Delivery',
    description: 'Available for metro cities on orders before 3 PM',
    price: 499,
    eta: 'Today',
  },
];

const paymentOptions: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: 'credit_card',
    label: 'Credit Card',
    description: 'Pay securely with Visa, Mastercard, or AMEX',
  },
  {
    id: 'debit_card',
    label: 'Debit Card',
    description: 'Supports major Indian debit cards and RuPay',
  },
  {
    id: 'paypal',
    label: 'PayPal',
    description: 'Checkout quickly with your PayPal wallet',
  },
  {
    id: 'western_union',
    label: 'Western Union',
    description: 'Complete payment offline via Western Union transfer',
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India',
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
  const [cardDetails, setCardDetails] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [orderNotes, setOrderNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);

    if (storedCart.length === 0) {
      router.replace('/cart');
    }
  }, [router]);

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const taxAmount = useMemo(() => Math.round(subtotal * 0.1), [subtotal]);

  const selectedShipping = useMemo(
    () => shippingOptions.find((option) => option.id === shippingMethod),
    [shippingMethod]
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const orderTotal = subtotal + taxAmount + shippingCost;

  const handleShippingChange = (field: keyof typeof shippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const missingShippingField = Object.entries(shippingDetails).find(
      ([key, value]) => key !== 'orderNotes' && value.trim() === ''
    );

    if (missingShippingField) {
      setError('Please fill in all shipping details before placing your order.');
      return;
    }

    if (paymentMethod === 'credit_card' || paymentMethod === 'debit_card') {
      const missingCardField = Object.entries(cardDetails).find(([, value]) => value.trim() === '');
      if (missingCardField) {
        setError('Please complete your card details to continue.');
        return;
      }
    }

    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setPaymentSuccess(true);

    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      router.replace('/');
    }, 2200);
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-10">
          {/* Checkout Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-6 sm:p-8 space-y-8"
          >
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Secure Checkout
              </p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-1">
                Shipping & Payment Details
              </h1>
              <p className="text-sm text-gray-600 mt-2">
                Tell us where to send your blooms and how you’d like to pay.
              </p>
            </header>

            {/* Shipping Details */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Details</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">First Name</label>
                  <input
                    value={shippingDetails.firstName}
                    onChange={(e) => handleShippingChange('firstName', e.target.value)}
                    placeholder="Aditi"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Last Name</label>
                  <input
                    value={shippingDetails.lastName}
                    onChange={(e) => handleShippingChange('lastName', e.target.value)}
                    placeholder="Sharma"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Email Address</label>
                  <input
                    type="email"
                    value={shippingDetails.email}
                    onChange={(e) => handleShippingChange('email', e.target.value)}
                    placeholder="aditi@example.com"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                  <input
                    value={shippingDetails.phone}
                    onChange={(e) => handleShippingChange('phone', e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
              </div>
              <div className="grid gap-4 mt-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Address</label>
                  <input
                    value={shippingDetails.address}
                    onChange={(e) => handleShippingChange('address', e.target.value)}
                    placeholder="Flat 12B, Bloom Residences"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">City</label>
                    <input
                      value={shippingDetails.city}
                      onChange={(e) => handleShippingChange('city', e.target.value)}
                      placeholder="Mumbai"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">State</label>
                    <input
                      value={shippingDetails.state}
                      onChange={(e) => handleShippingChange('state', e.target.value)}
                      placeholder="Maharashtra"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Postal Code</label>
                    <input
                      value={shippingDetails.postalCode}
                      onChange={(e) => handleShippingChange('postalCode', e.target.value)}
                      placeholder="400001"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-gray-700">Country</label>
                    <input
                      value={shippingDetails.country}
                      onChange={(e) => handleShippingChange('country', e.target.value)}
                      placeholder="India"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700">Order Notes (Optional)</label>
                  <textarea
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="Any specific delivery instructions?"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 h-24 resize-none"
                  />
                </div>
              </div>
            </section>

            {/* Shipping Method */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Truck className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Shipping Method</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {shippingOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setShippingMethod(option.id)}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      shippingMethod === option.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.6)]'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold text-gray-900">{option.label}</p>
                      <span className="text-sm font-semibold text-emerald-600">
                        {option.price === 0
                          ? 'Free'
                          : `₹ ${option.price.toLocaleString('en-IN')}`}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">{option.description}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-[0.25em] mt-3">
                      ETA: {option.eta}
                    </p>
                  </button>
                ))}
              </div>
            </section>

            {/* Payment Method */}
            <section>
              <div className="flex items-center gap-3 mb-5">
                <Wallet className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {paymentOptions.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPaymentMethod(option.id)}
                    className={`text-left rounded-2xl border p-4 transition-all ${
                      paymentMethod === option.id
                        ? 'border-emerald-500 bg-emerald-50 shadow-[0_12px_30px_-18px_rgba(16,185,129,0.6)]'
                        : 'border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/40'
                    }`}
                  >
                    <p className="font-semibold text-gray-900">{option.label}</p>
                    <p className="text-sm text-gray-500 mt-2">{option.description}</p>
                  </button>
                ))}
              </div>

              {(paymentMethod === 'credit_card' || paymentMethod === 'debit_card') && (
                <div className="mt-6 space-y-4 border border-gray-200 rounded-2xl p-5 bg-gray-50">
                  <p className="text-sm font-semibold text-gray-700">
                    Card Details ({paymentMethod === 'credit_card' ? 'Credit' : 'Debit'})
                  </p>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Name on Card</label>
                    <input
                      value={cardDetails.nameOnCard}
                      onChange={(e) => handleCardChange('nameOnCard', e.target.value)}
                      placeholder="Aditi Sharma"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">Card Number</label>
                    <input
                      value={cardDetails.cardNumber}
                      onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                      placeholder="XXXX XXXX XXXX XXXX"
                      maxLength={19}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 tracking-[0.3em]"
                    />
                  </div>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Expiry Month</label>
                      <input
                        value={cardDetails.expiryMonth}
                        onChange={(e) => handleCardChange('expiryMonth', e.target.value)}
                        placeholder="MM"
                        maxLength={2}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">Expiry Year</label>
                      <input
                        value={cardDetails.expiryYear}
                        onChange={(e) => handleCardChange('expiryYear', e.target.value)}
                        placeholder="YYYY"
                        maxLength={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">CVV</label>
                      <input
                        value={cardDetails.cvv}
                        onChange={(e) => handleCardChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={4}
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center tracking-[0.3em]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'paypal' && (
                <div className="mt-6 border border-amber-200 bg-amber-50 rounded-2xl p-5 text-sm text-amber-700">
                  We will redirect you to PayPal after you review your order. Please ensure your
                  PayPal email matches your order details for a smooth checkout.
                </div>
              )}

              {paymentMethod === 'western_union' && (
                <div className="mt-6 border border-emerald-200 bg-emerald-50 rounded-2xl p-5 text-sm text-emerald-700">
                  You will receive step-by-step instructions after confirming your order. Share the
                  MTCN reference with our team to complete the payment.
                </div>
              )}
            </section>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {paymentSuccess && (
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700 font-semibold">
                <CheckCircle2 className="w-5 h-5" />
                Payment successful! Your order is on its way.
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-80"
            >
              {isSubmitting ? (
                <>
                  <span className="h-5 w-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                  Processing your order...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Place Order & Pay ₹ {orderTotal.toLocaleString('en-IN')}
                </>
              )}
            </button>

            <div className="flex items-center gap-3 text-xs text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              All transactions are encrypted and backed by Bloom SecurePay.
            </div>
          </form>

          {/* Order Summary */}
          <aside className="bg-white rounded-3xl shadow-xl border border-emerald-100/60 p-6 sm:p-8 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full translate-x-16 -translate-y-10" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Order Summary
              </p>
              <h2 className="text-xl font-display font-bold text-gray-900 mt-2">
                Blooming Favourites
              </h2>
              <p className="text-sm text-gray-600 mt-3">
                We’ll keep you posted about every milestone from preparation to delivery.
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={`${item.id}-${item.variant ?? 'default'}`} className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || '/file.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 line-clamp-2">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty {item.quantity}
                        {item.variant ? ` · ${item.variant}` : ''}
                      </p>
                    </div>
                    <div className="text-sm font-semibold text-gray-900">
                      ₹ {(item.price * item.quantity).toLocaleString('en-IN')}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    ₹ {subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (10%)</span>
                  <span className="font-semibold text-gray-900">
                    ₹ {taxAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({selectedShipping?.label ?? 'Standard'})</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0
                      ? 'Free'
                      : `₹ ${shippingCost.toLocaleString('en-IN')}`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Due</span>
                  <span>₹ {orderTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="bg-emerald-50 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.25em] mb-2">
                  Delivery Promise
                </h4>
                <p className="text-sm text-gray-700">
                  {selectedShipping
                    ? `Your order will arrive ${selectedShipping.eta.toLowerCase()}.`
                    : 'Select a shipping method to see delivery estimates.'}{' '}
                  Track every step from dispatch to doorstep in your Bloom account.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

