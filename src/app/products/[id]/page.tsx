import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ProductDetailSheet from '@/components/ProductDetailSheet';
import { products } from '@/data/products';

interface ProductDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return {
      title: 'Product not found | Bloom',
    };
  }

  return {
    title: `${product.name} | Bloom Luxury Florals`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { id } = await params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    notFound();
  }

  return (
    <div className="bg-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-500">Bloom Florist</p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-gray-900">
            {product.name}
          </h1>
          <p className="text-gray-500 text-sm">Curated by Bloom atelier • Rated {product.rating} ({product.reviews} reviews)</p>
        </div>

        <ProductDetailSheet product={product} />
      </div>
    </div>
  );
}

