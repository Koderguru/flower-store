'use client';

import { useMemo, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { Search, Sparkles, ArrowRight, Leaf, Clock4, Crown, Truck, Palette, Gem, MapPin, ShieldCheck, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '@/components/ProductCard';
import CategoryChip from '@/components/CategoryChip';
import { products, categories } from '@/data/products';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { useCurrency } from '@/context/CurrencyContext';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { formatPrice } = useCurrency();

  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const productsSectionRef = useRef<HTMLDivElement>(null);
  const searchButtonRef = useRef<HTMLButtonElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);
  const storyRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const heroImages = [
    'https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1583623025817-d180a2221d0a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1455659817273-f96807779a8a?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
  ];

  const heroMetrics = [
    { value: '12k+', label: 'Same-day orders', icon: Clock4 },
    { value: '180+', label: 'Cities served', icon: MapPin },
    { value: '4.9', label: 'Customer rating', icon: ShieldCheck },
  ];

  const promotionalBanners = [
    {
      title: 'Flowers & Chocolates',
      subtitle: 'Mulai IDR 549.000',
      image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-pink-50',
    },
    {
      title: 'Affordable Range',
      subtitle: 'Mulai IDR 349.000',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80',
      bgColor: 'bg-blue-50',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Beautiful flowers delivered on time!',
    },
    {
      name: 'Rahul Verma',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Excellent service and quality.',
    },
    {
      name: 'Anita Desai',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Made my anniversary special!',
    },
    {
      name: 'Vikram Singh',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      text: 'Fresh flowers, great packaging.',
    },
  ];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const displayedProducts = useMemo(
    () =>
      filteredProducts.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [filteredProducts, searchQuery]
  );

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? heroImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === heroImages.length - 1 ? 0 : prev + 1));
  };

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.from('.hero-overlay', {
        opacity: 0,
        duration: 1.1,
      })
        .from(
          '.hero-badge',
          {
            y: -20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.6'
        )
        .from(
          '.hero-heading-line',
          {
            yPercent: 60,
            opacity: 0,
            duration: 0.9,
            stagger: 0.1,
          },
          '-=0.3'
        )
        .from(
          '.hero-paragraph',
          {
            y: 20,
            opacity: 0,
            duration: 0.6,
          },
          '-=0.5'
        )
        .from('.hero-search', {
          y: 20,
          opacity: 0,
          duration: 0.6,
        });

      const btn = searchButtonRef.current;
      if (!btn) return;

      const magnetic = gsap.quickTo(btn, 'x', { duration: 0.3, ease: 'power3.out' });
      const magneticY = gsap.quickTo(btn, 'y', { duration: 0.3, ease: 'power3.out' });

      const handleMove = (event: PointerEvent) => {
        const bounds = btn.getBoundingClientRect();
        const x = event.clientX - (bounds.left + bounds.width / 2);
        const y = event.clientY - (bounds.top + bounds.height / 2);
        magnetic(x * 0.15);
        magneticY(y * 0.2);
      };

      const reset = () => {
        magnetic(0);
        magneticY(0);
      };

      btn.addEventListener('pointermove', handleMove);
      btn.addEventListener('pointerleave', reset);

      return () => {
        btn.removeEventListener('pointermove', handleMove);
        btn.removeEventListener('pointerleave', reset);
      };
    },
    { scope: heroRef }
  );

  useGSAP(
    () => {
      if (!heroRef.current) return;

      const overlayParallax = gsap.to('.hero-overlay', {
        opacity: 0.55,
        scale: 1.05,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const heroFloat = gsap.to('.hero-badge', {
        y: 20,
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      return () => {
        overlayParallax.kill();
        heroFloat.kill();
      };
    },
    { scope: heroRef }
  );

  useGSAP(
    () => {
      const chips = gsap.utils.toArray<HTMLElement>('.category-chip');
      gsap.from(chips, {
        opacity: 0,
        y: 16,
        scale: 0.96,
        stagger: 0.06,
        duration: 0.5,
        ease: 'back.out(1.4)',
      });
    },
    { scope: categoriesRef }
  );

  useGSAP(
    () => {
      if (!productsSectionRef.current) return;

      const ctx = gsap.context(() => {
        ScrollTrigger.batch('.product-card', {
          start: 'top 85%',
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { opacity: 0, y: 60 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                ease: 'power2.out',
                stagger: 0.08,
              }
            );
          },
        });
      }, productsSectionRef);

      return () => ctx.revert();
    },
    {
      scope: productsSectionRef,
      dependencies: [displayedProducts.map((product) => product.id).join(',')],
      revertOnUpdate: true,
    }
  );

  useGSAP(
    () => {
      if (!highlightsRef.current) return;
      const cards = highlightsRef.current.querySelectorAll('.highlight-card');

      cards.forEach((card, index) => {
        gsap.from(card, {
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: index * 0.08,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        });
      });
    },
    { scope: highlightsRef }
  );

  useGSAP(
    () => {
      if (!storyRef.current) return;
      const stats = storyRef.current.querySelectorAll('.story-stat');

      gsap.from(stats, {
        opacity: 0,
        y: 24,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: storyRef.current,
          start: 'top 85%',
          once: true,
        },
      });
    },
    { scope: storyRef }
  );

  // Carousel animation
  useGSAP(
    () => {
      if (!carouselRef.current) return;
      
      gsap.to('.carousel-track', {
        x: `-${currentImageIndex * 100}%`,
        duration: 0.6,
        ease: 'power2.inOut',
      });
    },
    { dependencies: [currentImageIndex], scope: carouselRef }
  );

  return (
    <>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Full Width Carousel */}
      <section ref={heroRef} className="relative overflow-hidden bg-gray-100">
        <div className="relative w-full">
          {/* Carousel Container */}
          <div ref={carouselRef} className="relative overflow-hidden">
            <div className="carousel-track flex transition-transform">
              {heroImages.map((image, index) => (
                <div key={index} className="min-w-full px-1 sm:px-4 lg:px-10">
                  <div className="hero-frame relative mx-auto aspect-[21/9] md:aspect-[21/7]">
                    <Image
                      src={image}
                      alt={`Flower arrangement ${index + 1}`}
                      fill
                      sizes="100vw"
                      className="object-cover hero-visual"
                      priority={index === 0}
                    />
                    <div className="hero-overlay absolute inset-0" />
                    <div className="hero-curve hero-curve--accent" />
                    <div className="hero-curve hero-curve--accentSecondary" />
                    <div className="hero-curve hero-curve--glow" />
                    <div className="absolute inset-0 flex items-center">
                      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                        <div className="max-w-2xl">
                          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
                            Surprises
                            <br />
                            <span className="text-red-500">ANNIVERSARY</span>
                          </h1>
                          <p className="text-lg md:text-xl text-white mb-8 drop-shadow-md">
                            Make Your Anniversary Feel Unforgettable With Flowers
                          </p>
                          <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
                            SHOP NOW
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={handlePrevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-gray-900 hover:bg-white transition-all z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={handleNextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur shadow-lg flex items-center justify-center text-gray-900 hover:bg-white transition-all z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-white w-8'
                      : 'bg-white/50 hover:bg-white/75 w-2'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Categories - Tab Style */}
      <section className="bg-white border-b border-gray-200" ref={categoriesRef}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide py-4">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`flex items-center gap-3 px-6 py-3 rounded-full whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={category.image}
                    alt={category.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="font-semibold text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-6">
            {promotionalBanners.map((banner, index) => (
              <div
                key={index}
                className={`${banner.bgColor} rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow`}
              >
                <div className="flex items-center justify-between p-8">
                  <div>
                    <h3 className="font-display text-2xl font-bold text-gray-900 mb-2">
                      {banner.title}
                    </h3>
                    <p className="text-lg text-gray-700 mb-4">{banner.subtitle}</p>
                    <button className="px-6 py-2 bg-white border-2 border-gray-900 text-gray-900 font-semibold rounded-lg hover:bg-gray-900 hover:text-white transition-colors">
                      SHOP NOW
                    </button>
                  </div>
                  <div className="relative w-40 h-40 flex-shrink-0">
                    <Image
                      src={banner.image}
                      alt={banner.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Product Sections */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section 1: Shop Flowers By Design */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Shop Flowers By Design
                </h2>
                <p className="text-gray-600 mt-1">
                  Handpicked Floral Deliveries Across Indonesia
                </p>
              </div>
              <Link
                href="/products"
                className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                EXPLORE ALL
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product) => (
                <ProductCard key={product.id} {...product} index={0} />
              ))}
            </div>
          </div>

          {/* Section 2: Shop Flowers By Delivery */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Shop Flowers By Delivery
                </h2>
                <p className="text-gray-600 mt-1">Same Day & Midnight Delivery Available</p>
              </div>
              <Link
                href="/products"
                className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                EXPLORE ALL
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(4, 8).map((product) => (
                <ProductCard key={product.id} {...product} index={0} />
              ))}
            </div>
          </div>

          {/* Section 3: Shop Flowers By Occasion */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl font-bold text-gray-900">
                  Shop Flowers By Occasion
                </h2>
                <p className="text-gray-600 mt-1">Perfect Blooms for Every Celebration</p>
              </div>
              <Link
                href="/products"
                className="px-6 py-2 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
              >
                EXPLORE ALL
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(8, 12).map((product) => (
                <ProductCard key={product.id} {...product} index={0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Shop Flowers By Recipient
            </h2>
            <p className="text-gray-600">Thoughtful Gifts for Everyone You Love</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="text-center p-6 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{testimonial.name}</h3>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">★</span>
                  ))}
                </div>
                <p className="text-sm text-gray-600">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cakes Section */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Shop Amazing Gifts
            </h2>
            <p className="text-gray-600">Delicious Cakes & Thoughtful Presents</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {products.slice(12, 16).map((product) => (
              <ProductCard key={product.id} {...product} index={0} />
            ))}
          </div>
          <div className="text-center">
            <Link
              href="/products"
              className="inline-flex px-8 py-3 bg-gray-900 text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
            >
              EXPLORE ALL
            </Link>
          </div>
        </div>
      </section>

      {/* Luxury Flowers Section - Dark Background */}
      <section className="bg-gray-900 py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64">
            <Image
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
              alt="Flower decoration"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64">
            <Image
              src="https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=400&q=80"
              alt="Flower decoration"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl font-bold text-white mb-4">
              Luxury Flowers
            </h2>
            <p className="text-gray-300 text-lg">Premium Blooms for Special Moments</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {products.slice(0, 4).map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-xl hover:shadow-2xl transition-shadow">
                <div className="relative aspect-square">
                  <Image
                    src={product.image || '/file.svg'}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">{formatPrice(product.price)}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatPrice(product.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center">
            <button className="px-8 py-3 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-100 transition-colors">
              Shop Luxury Collection
            </button>
          </div>
        </div>
      </section>

      {/* More Product Sections */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              More Ways to Shop
            </h2>
            <p className="text-gray-600">Discover Our Complete Collection</p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {categories.slice(0, 6).map((category) => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl hover:shadow-lg transition-shadow"
              >
                <div className="relative w-20 h-20 rounded-full overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
    <style jsx>{`
      .hero-frame {
        border-radius: clamp(22px, 5vw, 64px);
        overflow: hidden;
        position: relative;
        isolation: isolate;
        box-shadow: 0 25px 45px -35px rgba(15, 23, 42, 0.45);
      }
      .hero-overlay {
        background: linear-gradient(110deg, rgba(15, 23, 42, 0.75) 0%, rgba(15, 23, 42, 0.35) 50%, rgba(15, 23, 42, 0.05) 78%, rgba(15, 23, 42, 0) 100%);
        mix-blend-mode: multiply;
      }
      .hero-curve {
        position: absolute;
        border-radius: 999px;
        filter: blur(0);
        pointer-events: none;
        opacity: 0.55;
      }
      .hero-curve--accent {
        width: clamp(140px, 24vw, 280px);
        height: clamp(200px, 32vw, 360px);
        bottom: clamp(-72px, -7vw, -26px);
        right: clamp(-110px, -5vw, -36px);
        background: radial-gradient(circle at 42% 38%, rgba(244, 63, 94, 0.6), rgba(244, 63, 94, 0.04));
        transform: rotate(15deg);
        filter: blur(22px);
        opacity: 0.55;
      }
      .hero-curve--accentSecondary {
        width: clamp(160px, 28vw, 300px);
        height: clamp(190px, 30vw, 340px);
        top: clamp(-110px, -9vw, -36px);
        right: clamp(-140px, -7vw, -52px);
        background: radial-gradient(circle at 50% 50%, rgba(249, 168, 212, 0.4), rgba(255, 255, 255, 0));
        transform: rotate(-10deg);
        filter: blur(26px);
        opacity: 0.6;
      }
      .hero-curve--glow {
        inset: auto 14% -16% auto;
        width: clamp(170px, 28vw, 340px);
        height: clamp(170px, 30vw, 340px);
        background: radial-gradient(circle at 60% 40%, rgba(253, 186, 140, 0.4), rgba(251, 113, 133, 0.05) 58%, rgba(255, 255, 255, 0));
        filter: blur(30px);
        opacity: 0.62;
      }
      @media (max-width: 768px) {
        .hero-frame {
          border-radius: clamp(20px, 7vw, 40px);
        }
        .hero-curve--accent,
        .hero-curve--accentSecondary,
        .hero-curve--glow {
          opacity: 0.45;
        }
      }
    `}</style>
    </>
  );
}
