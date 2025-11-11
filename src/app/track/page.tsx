'use client';

import { useMemo, useState } from 'react';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle2,
  CalendarClock,
  PhoneCall,
  ArrowRight,
} from 'lucide-react';

type TrackingStep = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: 'completed' | 'current' | 'upcoming';
  icon: React.ReactNode;
};

const mockTrackings: Record<
  string,
  {
    orderId: string;
    eta: string;
    recipient: string;
    address: string;
    contact: string;
    status: 'processing' | 'in_transit' | 'delivered';
    steps: TrackingStep[];
  }
> = {
  '#AMT2301': {
    orderId: '#AMT2301',
    eta: 'Hari ini, 18.30 – 19.00 WIB',
    recipient: 'Ayu Putri',
    address: 'Jl. Senopati No. 17, Kebayoran Baru, Jakarta Selatan',
    contact: '+62 812-3456-7890',
    status: 'in_transit',
    steps: [
      {
        id: 'placed',
        title: 'Pesanan Diterima',
        description: 'Tim kami sudah menerima pesanan dan menghubungi florist.',
        timestamp: 'Hari ini • 11.15',
        status: 'completed',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 'preparing',
        title: 'Karangan Disiapkan',
        description: 'Florist merangkai bunga sesuai pilihan kamu.',
        timestamp: 'Hari ini • 14.40',
        status: 'completed',
        icon: <CalendarClock className="w-5 h-5" />,
      },
      {
        id: 'enroute',
        title: 'Sedang Dikirim',
        description: 'Kurir kami menuju alamat dengan kendaraan berpendingin.',
        timestamp: 'Hari ini • 17.05',
        status: 'current',
        icon: <Truck className="w-5 h-5" />,
      },
      {
        id: 'delivered',
        title: 'Terkirim',
        description: 'Serah terima akan dilakukan di depan alamat penerima.',
        timestamp: 'Terjadwal • 18.30',
        status: 'upcoming',
        icon: <CheckCircle2 className="w-5 h-5" />,
      },
    ],
  },
  '#AMT2294': {
    orderId: '#AMT2294',
    eta: 'Terkirim kemarin, 16.10 WIB',
    recipient: 'Rizky Pratama',
    address: 'Jl. Braga No. 221, Bandung, Jawa Barat',
    contact: '+62 811-2233-4455',
    status: 'delivered',
    steps: [
      {
        id: 'placed',
        title: 'Pesanan Diterima',
        description: 'Tim kami sudah menerima pesanan dan menghubungi florist.',
        timestamp: 'Kemarin • 09.35',
        status: 'completed',
        icon: <Package className="w-5 h-5" />,
      },
      {
        id: 'preparing',
        title: 'Karangan Disiapkan',
        description: 'Florist merangkai bunga sesuai pilihan kamu.',
        timestamp: 'Kemarin • 12.20',
        status: 'completed',
        icon: <CalendarClock className="w-5 h-5" />,
      },
      {
        id: 'enroute',
        title: 'Sedang Dikirim',
        description: 'Kurir kami menuju alamat dengan kendaraan berpendingin.',
        timestamp: 'Kemarin • 15.05',
        status: 'completed',
        icon: <Truck className="w-5 h-5" />,
      },
      {
        id: 'delivered',
        title: 'Terkirim',
        description: 'Serah terima berhasil dengan konfirmasi OTP.',
        timestamp: 'Kemarin • 16.10',
        status: 'completed',
        icon: <CheckCircle2 className="w-5 h-5" />,
      },
    ],
  },
};

const statusBadgeStyles: Record<string, string> = {
  processing: 'bg-amber-100 text-amber-700 border border-amber-200',
  in_transit: 'bg-blue-100 text-blue-700 border border-blue-200',
  delivered: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
};

export default function TrackOrderPage() {
  const [orderId, setOrderId] = useState('#AMT2301');
  const normalizedId = orderId.trim().toUpperCase();
  const tracking = mockTrackings[normalizedId];

  const activeStepIndex = useMemo(() => {
    if (!tracking) return -1;
    return tracking.steps.findIndex((step) => step.status === 'current');
  }, [tracking]);

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-emerald-100/50 py-12 lg:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -right-24 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 rounded-full bg-rose-100/40 blur-3xl" />
      </div>

      <div className="relative mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 sm:px-6 lg:px-0">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr),300px] lg:gap-16">
          <div className="space-y-10">
            <form
              className="flex flex-col gap-4 rounded-2xl border border-emerald-100/70 bg-white/70 px-5 py-5 shadow-sm shadow-emerald-100/50 sm:flex-row sm:items-end sm:gap-5"
              onSubmit={(event) => {
                event.preventDefault();
                setOrderId(orderId.trim());
              }}
            >
              <div className="flex-1">
                <label htmlFor="orderId" className="text-sm font-semibold text-gray-700">
                  Order Number
                </label>
                <input
                  id="orderId"
                  type="text"
                  placeholder="e.g., #AMT2301"
                  value={orderId}
                  onChange={(event) => setOrderId(event.target.value)}
                  className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-gray-900 shadow-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                />
              </div>
              <div className="sm:self-end">
                <button
                  type="submit"
                  className="inline-flex min-w-[160px] items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-300/40 transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  Track Order
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {tracking ? (
              <div className="space-y-10">
                <div className="rounded-2xl border border-emerald-100/70 bg-white/70 px-5 py-6 shadow-sm shadow-emerald-100/40">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.25em] text-emerald-500">Estimated Arrival</p>
                      <p className="mt-2 text-lg font-semibold text-emerald-900">{tracking.eta}</p>
                    </div>
                    <span
                      className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${statusBadgeStyles[tracking.status]}`}
                    >
                      <Truck className="h-4 w-4" />
                      {tracking.status === 'processing' && 'Processing'}
                      {tracking.status === 'in_transit' && 'In Transit'}
                      {tracking.status === 'delivered' && 'Delivered'}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-4 text-sm text-gray-600 sm:grid-cols-2">
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Recipient</p>
                      <p className="font-semibold text-gray-900">{tracking.recipient}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400">Address</p>
                      <p>{tracking.address}</p>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 shadow-inner shadow-emerald-100/50">
                      <MapPin className="h-4 w-4 text-emerald-600" />
                      <span>Keep your 4-digit OTP ready when the courier arrives.</span>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl bg-white/80 px-3 py-2 shadow-inner shadow-emerald-100/50">
                      <PhoneCall className="h-4 w-4 text-emerald-600" />
                      <span className="font-medium text-gray-700">{tracking.contact}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-8 top-4 bottom-0 w-px bg-gradient-to-b from-emerald-200 via-emerald-200/40 to-transparent" />
                    <div className="space-y-6">
                      {tracking.steps.map((step, index) => (
                        <div key={step.id} className={`relative pl-16 ${index !== tracking.steps.length - 1 ? 'pb-6' : ''}`}>
                          <div
                            className={`absolute left-4 top-0 flex h-9 w-9 items-center justify-center rounded-full border-2 ${
                              step.status === 'completed'
                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200/60'
                                : step.status === 'current'
                                ? 'border-emerald-500 bg-white text-emerald-600 shadow-md shadow-emerald-200/70'
                                : 'border-gray-200 bg-white text-gray-300'
                            }`}
                          >
                            {step.icon}
                          </div>
                          <div className="flex flex-col gap-2 text-sm text-gray-600">
                            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                              <h3 className="text-base font-semibold text-gray-900">{step.title}</h3>
                              <span className="text-xs font-medium uppercase tracking-[0.28em] text-gray-400">
                                {step.timestamp}
                              </span>
                            </div>
                            <p>{step.description}</p>
                            {step.status === 'current' && (
                              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                                <Truck className="h-3.5 w-3.5" />
                                Courier is on step {activeStepIndex + 1} of {tracking.steps.length}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-16 flex flex-col items-center justify-center gap-4 rounded-4xl border border-dashed border-gray-200 bg-gray-50 py-14 text-center shadow-inner">
                <CalendarClock className="h-12 w-12 text-gray-300" />
                <div className="max-w-md space-y-2">
                  <h3 className="text-lg font-semibold text-gray-800">Order number not found</h3>
                  <p className="text-sm text-gray-500">
                    Double-check the format, for example <span className="font-semibold text-gray-700">#AMT2301</span>. If it still doesn’t appear, reach out to our concierge team.
                  </p>
                </div>
              </div>
            )}
          </div>

          <aside className="space-y-10 text-sm text-gray-600">
            <div className="space-y-4 rounded-2xl border border-emerald-100/70 bg-white/80 px-5 py-5 shadow-sm shadow-emerald-100/40">
              <h2 className="text-base font-semibold text-gray-900">Delivery Tips</h2>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <Package className="mt-1 h-4 w-4 text-emerald-600" />
                  Same-day slots are available for orders placed before 5:00 PM in metro cities.
                </li>
                <li className="flex gap-3">
                  <Truck className="mt-1 h-4 w-4 text-emerald-600" />
                  Live tracking link appears 20 minutes before the courier arrives.
                </li>
                <li className="flex gap-3">
                  <CheckCircle2 className="mt-1 h-4 w-4 text-emerald-600" />
                  Ask the recipient to share the OTP to complete a secure handover.
                </li>
              </ul>
            </div>

            <div className="space-y-4 rounded-2xl border border-gray-200/70 bg-white/70 px-5 py-5 shadow-sm">
              <h2 className="text-base font-semibold text-gray-900">Need to adjust delivery?</h2>
              <p className="text-sm text-gray-500">
                Update the delivery address or time up to 30 minutes before your slot begins.
              </p>
              <div className="flex flex-col gap-3">
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                  <MapPin className="h-4 w-4" />
                  Change delivery address
                </button>
                <button className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-100">
                  <CalendarClock className="h-4 w-4" />
                  Reschedule delivery slot
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}


