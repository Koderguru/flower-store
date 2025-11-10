'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Clock } from 'lucide-react';

interface RecentItem {
  id: string;
  name: string;
  price: number;
  image?: string;
}

export default function RecentlyViewed() {
  const [recentItems, setRecentItems] = useState<RecentItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    loadRecentItems();
    
    const handleCartUpdate = () => loadRecentItems();
    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, []);

  const loadRecentItems = () => {
    const items = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentItems(items.slice(0, 5));
  };

  if (recentItems.length === 0) return null;

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed right-4 bottom-24 sm:bottom-20 md:bottom-24 bg-emerald-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-emerald-700 transition-all z-40 flex items-center gap-2"
        aria-expanded={isOpen}
        aria-controls="recently-viewed-panel"
      >
        <Clock className="w-5 h-5" />
        <span className="text-sm font-semibold">Recently Viewed</span>
      </button>

      {/* Sidebar Panel */}
      <div
        id="recently-viewed-panel"
        className={`fixed right-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Recently Viewed</h3>
              <p className="text-sm text-gray-500">{recentItems.length} items</p>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {recentItems.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                onClick={() => setIsOpen(false)}
                className="block group"
              >
                <div className="bg-gray-50 rounded-lg p-3 hover:bg-emerald-50 transition-colors">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={item.image || '/file.svg'}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-sm font-bold text-gray-900 mt-1">
                        ₹ {item.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
                localStorage.removeItem('recentlyViewed');
                setRecentItems([]);
                setIsOpen(false);
              }}
              className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
            >
              Clear History
            </button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/20 z-40"
        />
      )}
    </>
  );
}

