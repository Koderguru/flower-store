'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, ArrowLeft, CheckCircle2, Truck, MapPin, Wallet } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

type ShippingMethod = 'standard' | 'express' | 'same_day';
type PaymentMethod = 'card' | 'paypal' | 'western_union';
type CheckoutStep = 1 | 2 | 3;

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
    price: 75000,
    eta: '1-2 business days',
  },
  {
    id: 'same_day',
    label: 'Same-Day Delivery',
    description: 'Available for metro cities on orders before 3 PM',
    price: 125000,
    eta: 'Today',
  },
];

const paymentOptions: Array<{
  id: PaymentMethod;
  label: string;
  description: string;
}> = [
  {
    id: 'card',
    label: 'Credit / Debit Card',
    description: 'Pay securely with Visa, Mastercard, AMEX, and major debit cards',
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
  const [currentStep, setCurrentStep] = useState<CheckoutStep>(1);
  const { formatPrice } = useCurrency();

  const [shippingDetails, setShippingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Indonesia',
  });
  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [billingDetails, setBillingDetails] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'Indonesia',
  });

  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>('standard');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
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

  const selectedPaymentOption = useMemo(
    () => paymentOptions.find((option) => option.id === paymentMethod),
    [paymentMethod]
  );

  const shippingCost = selectedShipping?.price ?? 0;
  const orderTotal = subtotal + taxAmount + shippingCost;

  const handleShippingChange = (field: keyof typeof shippingDetails, value: string) => {
    setShippingDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCardChange = (field: keyof typeof cardDetails, value: string) => {
    setCardDetails((prev) => ({ ...prev, [field]: value }));
  };

  const validateShippingDetails = () => {
    const missingShippingField = Object.entries(shippingDetails).find(
      ([key, value]) => key !== 'orderNotes' && value.trim() === ''
    );

    if (missingShippingField) {
      setError('Please fill in all shipping details before continuing.');
      return false;
    }

    if (!billingSameAsShipping) {
      const missingBillingField = Object.entries(billingDetails).find(([, value]) => value.trim() === '');
      if (missingBillingField) {
        setError('Please complete your billing details or mark them as same as shipping.');
        return false;
      }
    }

    return true;
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'card') {
      const missingCardField = Object.entries(cardDetails).find(([, value]) => value.trim() === '');
      if (missingCardField) {
        setError('Please complete your card details to continue.');
        return false;
      }
    }
    return true;
  };

  const handleContinueFromShipping = () => {
    setError(null);
    if (!validateShippingDetails()) {
      return;
    }
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleContinueFromPayment = () => {
    setError(null);
    if (!validatePaymentDetails()) {
      return;
    }
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStepNavigate = (targetStep: CheckoutStep) => {
    if (targetStep < currentStep) {
      setCurrentStep(targetStep);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlaceOrder = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentStep !== 3) {
      return;
    }
    setError(null);

    if (!validateShippingDetails() || !validatePaymentDetails()) {
      return;
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/40 via-white to-white py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </Link>
        <section className="bg-white border border-emerald-100/80 rounded-3xl shadow-lg shadow-emerald-100/40 p-6 sm:p-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-emerald-500">
                Bloom Secure Checkout
              </p>
              <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-2">
                Complete your purchase
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                We’ll deliver your blooms with real‑time updates and concierge-level care.
              </p>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Payments encrypted with 256-bit SSL protection
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { label: 'Shipping', value: 1 as CheckoutStep, description: 'Address & delivery' },
              { label: 'Payment', value: 2 as CheckoutStep, description: 'Payment choice' },
              { label: 'Review', value: 3 as CheckoutStep, description: 'Confirm & pay' },
            ].map((step, index) => {
              const status =
                step.value < currentStep ? 'done' : step.value === currentStep ? 'current' : 'upcoming';
              const isClickable = status === 'done';
              return (
                <button
                  key={step.label}
                  type="button"
                  onClick={() => isClickable && handleStepNavigate(step.value)}
                  className={`flex items-center gap-3 rounded-2xl border p-4 transition text-left ${
                    status === 'done'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                      : status === 'current'
                        ? 'border-sky-200 bg-sky-50 text-sky-700'
                        : 'border-gray-200 bg-gray-50 text-gray-500'
                  } ${isClickable ? 'hover:border-emerald-500/80 hover:bg-emerald-50/70' : ''}`}
                >
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                      status === 'done'
                        ? 'bg-emerald-600 text-white'
                        : status === 'current'
                          ? 'bg-sky-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em]">{step.label}</p>
                    <p className="text-[11px] text-gray-500">
                      {status === 'done'
                        ? 'Completed'
                        : status === 'current'
                          ? 'You are here'
                          : step.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div className="grid lg:grid-cols-[1.25fr_0.75fr] gap-8 lg:gap-10">
          {/* Checkout Form */}
          <form
            onSubmit={handlePlaceOrder}
            className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-6 sm:p-8 space-y-9"
          >
            <header>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                Secure Checkout
              </p>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-1">
                {currentStep === 1
                  ? 'Where should we deliver your blooms?'
                  : currentStep === 2
                    ? 'Choose how you would like to pay'
                    : 'Review and confirm your order'}
              </h2>
              <p className="text-sm text-gray-600 mt-2">
                {currentStep === 1 &&
                  'Provide delivery details and select your preferred shipping speed.'}
                {currentStep === 2 &&
                  'Securely select your payment method and add card details if required.'}
                {currentStep === 3 &&
                  'Double-check your details before placing the order. You can still go back to edit.'}
              </p>
            </header>

            {currentStep === 1 && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <MapPin className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Details</h3>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">First Name</label>
                      <input
                        value={shippingDetails.firstName}
                        onChange={(e) => handleShippingChange('firstName', e.target.value)}
                        placeholder="Ayu"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Last Name</label>
                      <input
                        value={shippingDetails.lastName}
                        onChange={(e) => handleShippingChange('lastName', e.target.value)}
                        placeholder="Putri"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Email Address</label>
                      <input
                        type="email"
                        value={shippingDetails.email}
                        onChange={(e) => handleShippingChange('email', e.target.value)}
                        placeholder="ayu@example.com"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                      <input
                        value={shippingDetails.phone}
                        onChange={(e) => handleShippingChange('phone', e.target.value)}
                        placeholder="+62 812-5555-1234"
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
                        placeholder="Jl. Taman Anggrek No. 12"
                        className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">City</label>
                        <input
                          value={shippingDetails.city}
                          onChange={(e) => handleShippingChange('city', e.target.value)}
                          placeholder="Jakarta Selatan"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">State</label>
                        <input
                          value={shippingDetails.state}
                          onChange={(e) => handleShippingChange('state', e.target.value)}
                          placeholder="DKI Jakarta"
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
                          placeholder="12190"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700">Country</label>
                        <input
                          value={shippingDetails.country}
                          onChange={(e) => handleShippingChange('country', e.target.value)}
                          placeholder="Indonesia"
                          className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                        />
                      </div>
                    </div>
                  <div className="mt-6 space-y-4">
                    <div className="rounded-2xl border border-emerald-100 bg-white/80 shadow-sm">
                      <label className="flex items-start gap-4 p-4 sm:p-5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={billingSameAsShipping}
                          onChange={(event) => setBillingSameAsShipping(event.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-emerald-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        <div className="flex-1 space-y-1">
                          <p className="flex items-center gap-2 text-sm font-semibold text-gray-900">
                            <ShieldCheck className="w-4 h-4 text-emerald-600" />
                            Use shipping details for billing
                          </p>
                          <p className="text-xs text-gray-500">
                            Keep this on if your billing information matches the delivery address.
                            Turn it off to add a different billing address.
                          </p>
                        </div>
                      </label>
                    </div>

                    {!billingSameAsShipping && (
                      <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 md:p-6 space-y-4">
                        <p className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.22em]">
                          Billing Address
                        </p>
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">First Name</label>
                            <input
                              value={billingDetails.firstName}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, firstName: e.target.value }))
                              }
                              placeholder="Ayu"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Last Name</label>
                            <input
                              value={billingDetails.lastName}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, lastName: e.target.value }))
                              }
                              placeholder="Putri"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Email Address</label>
                            <input
                              type="email"
                              value={billingDetails.email}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, email: e.target.value }))
                              }
                              placeholder="ayu@example.com"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                            <input
                              value={billingDetails.phone}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, phone: e.target.value }))
                              }
                              placeholder="+62 812-5555-5678"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-semibold text-gray-700">Billing Address</label>
                          <input
                            value={billingDetails.address}
                            onChange={(e) =>
                              setBillingDetails((prev) => ({ ...prev, address: e.target.value }))
                            }
                            placeholder="Jl. Melati Indah No. 8"
                            className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">City</label>
                            <input
                              value={billingDetails.city}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, city: e.target.value }))
                              }
                              placeholder="Bandung"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">State / Province</label>
                            <input
                              value={billingDetails.state}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, state: e.target.value }))
                              }
                              placeholder="Jawa Barat"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Postal Code</label>
                            <input
                              value={billingDetails.postalCode}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, postalCode: e.target.value }))
                              }
                              placeholder="40115"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-sm font-semibold text-gray-700">Country</label>
                            <input
                              value={billingDetails.country}
                              onChange={(e) =>
                                setBillingDetails((prev) => ({ ...prev, country: e.target.value }))
                              }
                              placeholder="Indonesia"
                              className="w-full border border-emerald-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                            />
                          </div>
                        </div>
                      </div>
                    )}
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

                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Shipping Method</h3>
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
                            {option.price === 0 ? 'Free' : formatPrice(option.price)}
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

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={handleContinueFromShipping}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
                  >
                    Continue to Payment
                    <CreditCard className="w-4 h-4" />
                  </button>
                  <p className="text-xs text-gray-500">
                    You can review everything before placing the order.
                  </p>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <section>
                  <div className="flex items-center gap-3 mb-5">
                    <Wallet className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-lg font-semibold text-gray-900">Payment Method</h3>
                  </div>
                  <p className="text-xs font-medium uppercase tracking-[0.28em] text-gray-400 mb-3">
                    Choose how you would like to pay
                  </p>
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

                  {paymentMethod === 'card' && (
                    <div className="mt-6 border border-gray-200 rounded-2xl overflow-hidden">
                      <div className="px-5 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
                        <p className="text-sm font-semibold text-gray-800">
                          Card details (Credit or Debit)
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          PCI-DSS compliant
                        </div>
                      </div>
                      <div className="p-5 bg-white space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Name on card</label>
                          <input
                            value={cardDetails.nameOnCard}
                            onChange={(e) => handleCardChange('nameOnCard', e.target.value)}
                            placeholder="Ayu Putri"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">Card number</label>
                          <div className="relative">
                            <input
                              value={cardDetails.cardNumber}
                              onChange={(e) => handleCardChange('cardNumber', e.target.value)}
                              placeholder="XXXX XXXX XXXX XXXX"
                              maxLength={19}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 tracking-[0.3em]"
                            />
                            <div className="absolute inset-y-0 right-3 flex items-center gap-1">
                              <span className="inline-flex h-6 w-10 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold">
                                VISA
                              </span>
                              <span className="inline-flex h-6 w-10 items-center justify-center rounded-md bg-gray-100 text-[11px] font-semibold">
                                MC
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="grid sm:grid-cols-[1fr_1fr_0.8fr] gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expiry month</label>
                            <input
                              value={cardDetails.expiryMonth}
                              onChange={(e) => handleCardChange('expiryMonth', e.target.value)}
                              placeholder="MM"
                              maxLength={2}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Expiry year</label>
                            <input
                              value={cardDetails.expiryYear}
                              onChange={(e) => handleCardChange('expiryYear', e.target.value)}
                              placeholder="YYYY"
                              maxLength={4}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-1">
                              CVV
                              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-[0.25em]">
                                Secure
                              </span>
                            </label>
                            <input
                              value={cardDetails.cvv}
                              onChange={(e) => handleCardChange('cvv', e.target.value)}
                              placeholder="123"
                              maxLength={4}
                              className="w-full border border-gray-200 rounded-xl px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-center tracking-[0.25em]"
                            />
                          </div>
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

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={() => handleStepNavigate(1)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                  >
                    Back to Shipping
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueFromPayment}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
                  >
                    Review Order
                    <ShieldCheck className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <section className="space-y-6">
                  <div className="rounded-2xl border border-gray-200 bg-gray-50 p-5">
                    <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-[0.28em] mb-4">
                      Delivery Overview
                    </h3>
                    <div className="grid sm:grid-cols-2 gap-4 text-sm text-gray-600">
                      <div>
                        <p className="font-semibold text-gray-900">Recipient</p>
                        <p>
                          {shippingDetails.firstName} {shippingDetails.lastName}
                        </p>
                        <p>{shippingDetails.phone}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Delivery Address</p>
                        <p>
                          {shippingDetails.address}, {shippingDetails.city}, {shippingDetails.state}{' '}
                          {shippingDetails.postalCode}
                        </p>
                        <p>{shippingDetails.country}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Shipping Method</p>
                        <p>{selectedShipping?.label}</p>
                        <p className="text-xs uppercase tracking-[0.3em] text-gray-400 mt-1">
                          ETA: {selectedShipping?.eta}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Payment Method</p>
                        <p>{selectedPaymentOption?.label}</p>
                        {paymentMethod === 'card' && cardDetails.cardNumber && (
                          <p className="text-xs text-gray-500 mt-1">
                            Ending in{' '}
                            {cardDetails.cardNumber.slice(-4).padStart(cardDetails.cardNumber.length, '•')}
                          </p>
                        )}
                      </div>
                    </div>
                    {orderNotes && (
                      <div className="mt-4 rounded-xl border border-dashed border-gray-300 bg-white p-4 text-sm text-gray-600">
                        <p className="font-semibold text-gray-900 mb-1">Order Notes</p>
                        <p>{orderNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                    <h3 className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.28em] mb-3">
                      Before we proceed
                    </h3>
                    <ul className="space-y-2 text-sm text-emerald-800">
                      <li>• We will share live tracking updates once your order is dispatched.</li>
                      <li>• You will receive an SMS and email confirmation immediately after payment.</li>
                      <li>• Our concierge will reach out if there are any delivery instructions needed.</li>
                    </ul>
                  </div>
                </section>

                {paymentSuccess && (
                  <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-5 h-5" />
                    Payment successful! Your order is on its way.
                  </div>
                )}

                {error && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-100 pt-6">
                  <button
                    type="button"
                    onClick={() => handleStepNavigate(2)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition hover:border-gray-300"
                  >
                    Back to Payment
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700 disabled:opacity-80"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                        Processing your order...
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-5 h-5" />
                        Pay {formatPrice(orderTotal)}
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  All transactions are encrypted and backed by Bloom SecurePay.
                </div>
              </>
            )}

            {currentStep !== 3 && error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {currentStep !== 3 && (
              <div className="border-t border-gray-100 pt-5">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-emerald-600" />
                    Free delivery upgrade on orders above {formatPrice(1300000)}
                  </div>
                  <span className="hidden sm:block h-3 w-px bg-gray-200" />
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    Delivery ETA shared after dispatch
                  </div>
                </div>
              </div>
            )}
          </form>

          {/* Order Summary */}
          <aside className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-6 sm:p-8 space-y-6">
            <div className="bg-gray-50 rounded-2xl p-6 relative overflow-hidden border border-gray-100/80">
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
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>GST (10%)</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(taxAmount)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping ({selectedShipping?.label ?? 'Standard'})</span>
                  <span className="font-semibold text-gray-900">
                    {shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Due</span>
                  <span>{formatPrice(orderTotal)}</span>
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

              <div className="border border-gray-200 rounded-2xl p-5 bg-white">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-[0.3em] mb-3">
                  Need a hand?
                </h4>
                <p className="text-sm text-gray-600">
                  Speak to our concierge team at{' '}
                  <a href="tel:+91180000000" className="font-semibold text-emerald-600">
                    1800-000-0000
                  </a>{' '}
                  or email{' '}
                  <a href="mailto:care@flowersindonesia.com" className="font-semibold text-emerald-600">
                    care@flowersindonesia.com
                  </a>
                  . We’re available 7 AM – 11 PM IST.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

