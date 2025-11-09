'use client';

import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { MapPin, Search, Navigation, Clock, Globe2, Building2 } from 'lucide-react';
import { gsap } from '@/lib/gsap';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (city: string) => void;
}

export default function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
  const [searchLocation, setSearchLocation] = useState('');
  const panelRef = useRef<HTMLDivElement>(null);
  const itemsContainerRef = useRef<HTMLDivElement>(null);

  const popularCities = useMemo(
    () => [
      { name: 'Jakarta Selatan', region: 'DKI Jakarta', eta: 'Pengantaran 2 jam' },
      { name: 'Jakarta Barat', region: 'DKI Jakarta', eta: 'Pengantaran 2 jam' },
      { name: 'Surabaya Pusat', region: 'Jawa Timur', eta: 'Pengantaran 3 jam' },
      { name: 'Bandung Utara', region: 'Jawa Barat', eta: 'Pengantaran 4 jam' },
      { name: 'Yogyakarta', region: 'DI Yogyakarta', eta: 'Pengantaran 1 hari' },
      { name: 'Denpasar', region: 'Bali', eta: 'Pengantaran 1 hari' },
      { name: 'Semarang', region: 'Jawa Tengah', eta: 'Pengantaran 1 hari' },
      { name: 'Medan Kota', region: 'Sumatera Utara', eta: 'Pengantaran 2 hari' },
      { name: 'Makassar', region: 'Sulawesi Selatan', eta: 'Pengantaran 2 hari' },
      { name: 'Balikpapan', region: 'Kalimantan Timur', eta: 'Pengantaran 2 hari' },
      { name: 'Batam', region: 'Kepulauan Riau', eta: 'Pengantaran 2 hari' },
      { name: 'Bogor', region: 'Jawa Barat', eta: 'Pengantaran 1 hari' },
    ],
    []
  );

  const curatedRegions = useMemo(
    () => [
      'DKI Jakarta',
      'Jawa Barat',
      'Jawa Tengah',
      'Jawa Timur',
      'Bali',
      'Sumatera Utara',
      'Sulawesi Selatan',
    ],
    []
  );

  const handleSelectCity = (city: string) => {
    onSelectLocation(city);
    onClose();
  };

  useGSAP(
    () => {
      if (!panelRef.current) return;
      const panelTimeline = gsap.fromTo(
        panelRef.current,
        { y: -12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.26, ease: 'power2.out' }
      );

      if (!itemsContainerRef.current) return;
      const items = itemsContainerRef.current.querySelectorAll('.city-item');
      const listTween = gsap.from(items, {
        x: -10,
        opacity: 0,
        duration: 0.2,
        stagger: 0.04,
        ease: 'power1.out',
        delay: 0.1,
      });

      const chips = panelRef.current.querySelectorAll('.region-chip');
      const chipTween = gsap.from(chips, {
        y: 16,
        opacity: 0,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.out',
      });

      return () => {
        panelTimeline.kill();
        listTween.kill();
        chipTween.kill();
      };
    },
    { dependencies: [isOpen], scope: panelRef, revertOnUpdate: true }
  );

  if (!isOpen) return null;

  return (
    <>
      {/* Invisible Backdrop - click to close */}
      <div onClick={onClose} className="fixed inset-0 z-40" />

      {/* Dropdown Panel */}
      <div
        ref={panelRef}
        className="absolute top-full right-0 mt-3 w-[24rem] rounded-3xl bg-white shadow-[0_35px_70px_-40px_rgba(15,118,110,0.55)] z-50 overflow-hidden border border-white/60"
      >
        <div className="relative px-5 pt-5 pb-4 bg-gradient-to-br from-emerald-50 via-white to-white border-b border-emerald-100/50">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-500 mb-1">Pilih Lokasi</p>
              <h3 className="font-display text-xl font-semibold text-gray-900 leading-snug">
                Kirim Bunga ke Seluruh Indonesia
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Tentukan area pengiriman untuk melihat ketersediaan stok dan estimasi waktu tiba.
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            {curatedRegions.map((region) => (
              <button
                key={region}
                onClick={() => handleSelectCity(region)}
                className="region-chip inline-flex items-center gap-2 rounded-full bg-emerald-50 text-emerald-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-emerald-100 transition-colors"
              >
                <Building2 className="w-4 h-4" />
                {region}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="w-full flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold text-sm shadow-[0_15px_35px_-18px_rgba(16,185,129,0.6)] hover:shadow-[0_22px_40px_-20px_rgba(16,185,129,0.6)] transition-shadow"
            onPointerMove={(event) => {
              const target = event.currentTarget;
              const bounds = target.getBoundingClientRect();
              const x = event.clientX - (bounds.left + bounds.width / 2);
              gsap.to(target, {
                x: x * 0.04,
                duration: 0.25,
                ease: 'power2.out',
              });
            }}
            onPointerLeave={(event) => {
              gsap.to(event.currentTarget, {
                x: 0,
                duration: 0.3,
                ease: 'elastic.out(1, 0.4)',
              });
            }}
          >
            <Navigation className="w-4 h-4" />
            Gunakan Lokasi Saat Ini
          </button>

          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari kota atau kecamatan..."
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl border border-emerald-100 focus:outline-none focus:border-emerald-300 bg-white text-sm shadow-inner"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-500">
                Area Populer
              </h4>
              <span className="text-[11px] text-gray-400 uppercase tracking-[0.3em]">
                Estimasi tiba
              </span>
            </div>
            <div ref={itemsContainerRef} className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {popularCities
                .filter((city) =>
                  city.name.toLowerCase().includes(searchLocation.toLowerCase()) ||
                  city.region.toLowerCase().includes(searchLocation.toLowerCase())
                )
                .map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleSelectCity(`${city.name}, ${city.region}`)}
                    className="city-item group w-full flex items-center justify-between px-4 py-3 rounded-2xl border border-white hover:border-emerald-100 hover:bg-emerald-50/40 transition-all"
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500 group-hover:bg-emerald-100">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{city.name}</p>
                        <p className="text-xs text-gray-500">{city.region}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{city.eta}</span>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

