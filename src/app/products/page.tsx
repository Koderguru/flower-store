'use client';

import { useMemo, useState } from 'react';
import { products, categories } from '@/data/products';
import ProductCard from '@/components/ProductCard';

const ALL_CATEGORY = 'All';

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>(ALL_CATEGORY);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === ALL_CATEGORY) {
      return products;
    }
    return products.filter((product) => product.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/70 via-white to-white py-12 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <section className="flex flex-wrap items-center justify-center gap-3">
          {categories.map((category) => {
            const isActive = category.name === selectedCategory;
            return (
              <button
                key={category.name}
                type="button"
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-3 px-4 py-2 rounded-full border transition-all ${
                  isActive
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-[0_10px_24px_-12px_rgba(16,185,129,0.6)]'
                    : 'border-gray-200 text-gray-600 hover:border-emerald-200 hover:bg-emerald-50/60'
                }`}
              >
                <span className="text-sm font-semibold">{category.name}</span>
              </button>
            );
          })}
        </section>

        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
            </h2>
            <p className="text-sm text-gray-500">
              {selectedCategory === ALL_CATEGORY ? 'All categories' : `${selectedCategory} collection`}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                rating={product.rating}
                reviews={product.reviews}
                badge={product.badge}
                image={product.image}
              />
            ))}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-white border border-gray-200 rounded-3xl shadow-sm">
              <p className="text-lg font-semibold text-gray-900">No products found</p>
              <p className="text-sm text-gray-500 mt-1">
                Try choosing a different category to explore more of our blooms.
              </p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

