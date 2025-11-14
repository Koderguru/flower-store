'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Truck, CheckCircle2, Clock, ArrowRight, Search } from 'lucide-react';
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
  subtotal?: number;
  taxAmount?: number;
  shippingCost?: number;
  orderTotal: number;
  status: 'processing' | 'in_transit' | 'delivered';
  eta: string;
}

const statusConfig = {
  processing: {
    label: 'Processing',
    icon: Clock,
    color: 'bg-amber-100 text-amber-700 border-amber-200',
  },
  in_transit: {
    label: 'In Transit',
    icon: Truck,
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  delivered: {
    label: 'Delivered',
    icon: CheckCircle2,
    color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { formatPrice } = useCurrency();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = () => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  };

  const filteredOrders = orders.filter((order) =>
    order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some((item) => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-emerald-100/40 via-white to-white py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-12 text-center">
            <Package className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-4">No Orders Yet</h1>
            <p className="text-gray-600 mb-8">
              You haven't placed any orders yet. Start shopping to see your order history here!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
            >
              Start Shopping
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-100/40 via-white to-white py-10 lg:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-6 sm:p-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
            Order History
          </h1>
          <p className="text-gray-600 mb-6">
            View and track all your past orders. Click on any order to see detailed tracking information.
          </p>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by order ID or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-12 text-center">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">No orders found matching your search.</p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const StatusIcon = statusConfig[order.status].icon;
              return (
                <div
                  key={order.orderId}
                  className="bg-white rounded-3xl shadow-xl border border-emerald-100/80 p-6 sm:p-8 hover:shadow-2xl transition-shadow"
                >
                  {/* Order Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-500 mb-2">
                        Order ID
                      </p>
                      <p className="text-2xl font-bold text-emerald-600">{order.orderId}</p>
                      <p className="text-sm text-gray-600 mt-1">Placed on {formatDate(order.orderDate)}</p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3">
                      <span
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold border ${statusConfig[order.status].color}`}
                      >
                        <StatusIcon className="w-4 h-4" />
                        {statusConfig[order.status].label}
                      </span>
                      <p className="text-xl font-bold text-gray-900">{formatPrice(order.orderTotal)}</p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-4 mb-6">
                    {order.items.map((item) => (
                      <div
                        key={`${item.id}-${item.variant ?? 'default'}`}
                        className="flex gap-4 p-4 bg-gray-50 rounded-2xl"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <Image
                            src={item.image || '/file.svg'}
                            alt={item.name}
                            fill
                            className="object-cover"
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
                          <p className="font-semibold text-gray-900">
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Info */}
                  <div className="mb-6 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                          Delivery To
                        </p>
                        <p className="font-semibold text-gray-900">
                          {order.shippingDetails.firstName} {order.shippingDetails.lastName}
                        </p>
                        <p className="text-gray-600 mt-1">
                          {order.shippingDetails.address}, {order.shippingDetails.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-1">
                          Estimated Delivery
                        </p>
                        <p className="font-semibold text-emerald-600">{order.eta}</p>
                        <p className="text-gray-600 mt-1">
                          Shipping: {order.shippingMethod === 'standard' ? 'Standard' : order.shippingMethod === 'express' ? 'Express' : 'Same-Day'}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/track?orderId=${order.orderId}`}
                    className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-2xl bg-emerald-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition hover:bg-emerald-700"
                  >
                    <Truck className="w-5 h-5" />
                    Track Order
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

