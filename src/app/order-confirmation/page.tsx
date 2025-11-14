'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Package, ArrowRight, Home, Truck } from 'lucide-react';
import { useCurrency } from '@/context/CurrencyContext';

interface Order {
  orderId: string;
  orderDate: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variant?: string;
  }>;
  shippingDetails: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
    email: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  subtotal: number;
  taxAmount: number;
  shippingCost: number;
  orderTotal: number;
  status: string;
  eta: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId');
  const [order, setOrder] = useState<Order | null>(null);
  const { formatPrice } = useCurrency();

  useEffect(() => {
    if (orderId) {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const foundOrder = orders.find((o: Order) => o.orderId === orderId);
      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        router.push('/');
      }
    } else {
      router.push('/');
    }
  }, [orderId, router]);

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/40 via-white to-white py-10 lg:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-8 sm:p-12 space-y-8">
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900">
              Order Placed Successfully!
            </h1>
            <p className="text-lg text-gray-600">
              Thank you for your order. We've sent a confirmation email to{' '}
              <span className="font-semibold text-emerald-600">{order.shippingDetails.email}</span>
            </p>
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-emerald-50 rounded-2xl border border-emerald-200">
              <span className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Order ID:</span>
              <span className="text-xl font-bold text-emerald-600">{order.orderId}</span>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t border-gray-200 pt-8 space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={`${item.id}-${item.variant ?? 'default'}`} className="flex gap-4">
                  <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={item.image || '/file.svg'}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">Variant: {item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600 mt-1">Quantity: {item.quantity}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-200 pt-4 space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span className="font-semibold text-gray-900">{formatPrice(order.subtotal || 0)}</span>
              </div>
              {order.taxAmount && order.taxAmount > 0 && (
                <div className="flex justify-between text-gray-600">
                  <span>Tax (10%)</span>
                  <span className="font-semibold text-gray-900">{formatPrice(order.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="font-semibold text-gray-900">
                  {order.shippingCost === 0 ? 'Free' : formatPrice(order.shippingCost || 0)}
                </span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-3">
                <span>Total</span>
                <span>{formatPrice(order.orderTotal)}</span>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="border-t border-gray-200 pt-8 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Delivery Details</h2>
            <div className="bg-gray-50 rounded-2xl p-6 space-y-3">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Recipient</p>
                <p className="font-semibold text-gray-900 mt-1">
                  {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                </p>
                <p className="text-gray-600">{order.shippingDetails.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Delivery Address</p>
                <p className="text-gray-700 mt-1">
                  {order.shippingDetails.address}, {order.shippingDetails.city},{' '}
                  {order.shippingDetails.state} {order.shippingDetails.postalCode}
                </p>
                <p className="text-gray-600">{order.shippingDetails.country}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide">Estimated Delivery</p>
                <p className="font-semibold text-emerald-600 mt-1">{order.eta}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link
              href={`/track?orderId=${order.orderId}`}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
            >
              <Truck className="w-5 h-5" />
              Track Your Order
            </Link>
            <Link
              href="/orders"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              View Order History
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/"
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              <Home className="w-5 h-5" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

