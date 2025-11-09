'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CreditCard, ShieldCheck, Clock, Edit2, ArrowLeft, CheckCircle2 } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  variant?: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cardNumber, setCardNumber] = useState('');
  const [cvv, setCvv] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [dynamicPassword, setDynamicPassword] = useState('');
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(603); // 10:03 minutes

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartItems(storedCart);

    if (storedCart.length === 0) {
      router.replace('/cart');
    }
  }, [router]);

  useEffect(() => {
    if (secondsRemaining <= 0) return;
    const interval = setInterval(() => {
      setSecondsRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [secondsRemaining]);

  const totalAmount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const vatAmount = useMemo(() => Math.round(totalAmount * 0.1), [totalAmount]); // 10% VAT
  const payable = totalAmount + vatAmount;

  const formattedTimer = useMemo(() => {
    const minutes = Math.floor(secondsRemaining / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (secondsRemaining % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }, [secondsRemaining]);

  const handlePayNow = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPaying(true);
    setPaymentSuccess(false);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsPaying(false);
    setPaymentSuccess(true);

    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));

    setTimeout(() => {
      router.replace('/');
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/60 via-white to-white py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Keranjang
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_0.8fr] gap-8 lg:gap-10">
          {/* Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/50 p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-500">
                  Pembayaran Aman
                </p>
                <h1 className="text-2xl md:text-3xl font-display font-bold text-gray-900 mt-1">
                  FLOWERSINDONESIA PayIt
                </h1>
                <p className="text-sm text-gray-600 mt-2">
                  Masukkan detail kartu untuk menyelesaikan pesanan Anda.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-gray-100 rounded-2xl px-4 py-2 font-semibold text-gray-800">
                <Clock className="w-4 h-4 text-emerald-600" />
                <span>{formattedTimer}</span>
              </div>
            </div>

            <form onSubmit={handlePayNow} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Card Number</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-gray-500">
                    <span className="inline-flex items-center justify-center gap-1">
                      <span className="w-3 h-3 rounded-full bg-[#EB001B]" />
                      <span className="w-3 h-3 rounded-full bg-[#F79E1B] -ml-1 border border-white/50" />
                    </span>
                  </div>
                  <input
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="3416 6257 3365 3446"
                    maxLength={19}
                    className="w-full border border-gray-200 rounded-2xl pl-16 pr-12 py-3.5 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 tracking-[0.3em]"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600 text-sm font-semibold flex items-center gap-1"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit
                  </button>
                </div>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">CVV</label>
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    placeholder="446"
                    maxLength={4}
                    className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 tracking-[0.5em]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Expiry Month</label>
                  <input
                    value={expiryMonth}
                    onChange={(e) => setExpiryMonth(e.target.value)}
                    placeholder="10"
                    maxLength={2}
                    className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 text-center"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Expiry Year</label>
                  <input
                    value={expiryYear}
                    onChange={(e) => setExpiryYear(e.target.value)}
                    placeholder="24"
                    maxLength={2}
                    className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 text-center"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">Dynamic Password</label>
                <input
                  value={dynamicPassword}
                  onChange={(e) => setDynamicPassword(e.target.value)}
                  placeholder="Masukkan OTP"
                  className="w-full border border-gray-200 rounded-2xl py-3.5 px-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400 text-gray-900 tracking-[0.4em]"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isPaying}
                className="w-full bg-[#0A4CFF] hover:bg-[#083ddb] text-white font-semibold py-3.5 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-80"
              >
                {isPaying ? (
                  <>
                    <span className="h-5 w-5 rounded-full border-2 border-white/60 border-t-white animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Pay Now
                  </>
                )}
              </button>

              <div className="flex items-center gap-3 text-xs text-gray-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Pembayaran terenkripsi dan dilindungi oleh FLOWERSINDONESIA PayIt.
              </div>

              {paymentSuccess && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Pembayaran berhasil! Pesanan Anda sedang diproses.
                </div>
              )}
            </form>
          </div>

  {/* Summary */}
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/50 p-6 sm:p-8">
            <div className="bg-gray-50 rounded-2xl p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-emerald-100 to-transparent rounded-full translate-x-16 -translate-y-10" />
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-500">
                Kartu Virtual
              </p>
              <h2 className="text-xl font-display font-bold text-gray-900 mt-3">FLOWERS PAYIT</h2>
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Nama</span>
                  <span className="font-semibold text-gray-900">Aduke Morewa</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Nomor Kartu</span>
                  <span className="font-semibold text-gray-900 tracking-[0.3em]">•••• 3456</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Berlaku hingga</span>
                  <span className="font-semibold text-gray-900">09/24</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-[0.2em] mb-3">
                  Ringkasan Pesanan
                </h3>
                <div className="space-y-3">
                  {cartItems.map((item) => (
                    <div key={`${item.id}-${item.variant ?? 'default'}`} className="flex items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-100">
                        <Image
                          src={item.image || '/file.svg'}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900 line-clamp-2">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Qty {item.quantity}
                          {item.variant ? ` · ${item.variant}` : ''}
                        </p>
                      </div>
                      <div className="text-sm font-semibold text-gray-900">
                        Rp {(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-dashed border-gray-200 pt-4 space-y-3 text-sm text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-gray-900">Rp {totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (10%)</span>
                  <span className="font-semibold text-gray-900">Rp {vatAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total yang harus dibayar</span>
                  <span>Rp {payable.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-6 bg-emerald-50 rounded-2xl p-5">
                <h4 className="text-sm font-semibold text-emerald-700 uppercase tracking-[0.25em] mb-2">
                  Informasi Pengiriman
                </h4>
                <p className="text-sm text-gray-700">
                  Pesanan akan dikirim oleh kurir premium FLOWERSINDONESIA dalam 2 jam ke area
                  Jakarta. Pantau status pengiriman melalui dashboard akun Anda.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

