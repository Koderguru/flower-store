'use client';

import { useEffect, useRef, useState } from 'react';
import { useGSAP } from '@gsap/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, User, MapPin, Menu, X, ChevronDown, Heart, Package } from 'lucide-react';
import LocationModal from './LocationModal';
import MegaMenu from './MegaMenu';
import { gsap } from '@/lib/gsap';
import { Currency, useCurrency } from '@/context/CurrencyContext';

export default function Navbar() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState(0);
  const [selectedLocation, setSelectedLocation] = useState('Jakarta');
  const { currency, setCurrency } = useCurrency();

  useEffect(() => {
    const updateCartCount = () => {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const total = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(total);
    };

    updateCartCount();
    window.addEventListener('cartUpdated', updateCartCount);
    return () => window.removeEventListener('cartUpdated', updateCartCount);
  }, []);

  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const closeMegaMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currencyOptions: Currency[] = ['IDR', 'USD'];

  const navItems = [
    { name: 'Express Delivery', href: '/collections/express', hasDropdown: true, menuType: 'express' as const },
    { name: 'Flowers', href: '/collections/flowers', hasDropdown: true, menuType: 'flowers' as const },
    { name: 'Gift Bundles', href: '/collections/gifts', hasDropdown: true, menuType: 'gifts' as const },
    { name: 'Cakes / Gifts', href: '/collections/cakes', hasDropdown: true, menuType: 'cakes' as const },
    { name: 'Occasion', href: '/collections/occasion', hasDropdown: true, menuType: 'occasion' as const },
    { name: 'Deal Zone', href: '/collections/deal', hasDropdown: true, menuType: 'deal' as const },
    { name: 'Plants', href: '/collections/plants' },
    { name: 'Luxury Collection', href: '/collections/luxury' },
  ];

  const clearMegaMenuCloseTimeout = () => {
    if (closeMegaMenuTimeoutRef.current) {
      clearTimeout(closeMegaMenuTimeoutRef.current);
      closeMegaMenuTimeoutRef.current = null;
    }
  };

  const scheduleMegaMenuClose = () => {
    clearMegaMenuCloseTimeout();
    closeMegaMenuTimeoutRef.current = setTimeout(() => {
      setActiveMegaMenu(null);
    }, 150);
  };

  const handleMegaMenuEnter = (menuType: string | null) => {
    clearMegaMenuCloseTimeout();
    if (menuType) {
      setActiveMegaMenu(menuType);
    }
  };

  const handleMegaMenuLeave = () => {
    scheduleMegaMenuClose();
  };

  const handleNavClick = (href: string) => {
    setActiveMegaMenu(null);
    router.push(href);
  };

  const handleMegaMenuNavigate = (type: 'flowers' | 'gifts' | 'cakes' | 'occasion' | 'express' | 'deal', label?: string) => {
    const target = `/collections/${type}${label ? `?highlight=${encodeURIComponent(label)}` : ''}`;
    setActiveMegaMenu(null);
    router.push(target);
  };

  useEffect(() => {
    return () => clearMegaMenuCloseTimeout();
  }, []);

  useGSAP(
    () => {
      if (!navRef.current) return;

      gsap.from(navRef.current, {
        y: -120,
        duration: 0.6,
        ease: 'power3.out',
      });

      const links = gsap.utils.toArray<HTMLElement>('.nav-link');
      gsap.from(links, {
        y: -20,
        opacity: 0,
        ease: 'power2.out',
        duration: 0.45,
        stagger: 0.08,
        delay: 0.2,
      });
    },
    { scope: navRef }
  );

  useEffect(() => {
    if (!mobileMenuRef.current) return;

    const menu = mobileMenuRef.current;
    if (isMenuOpen) {
      menu.style.display = 'block';
      gsap.fromTo(
        menu,
        { height: 0, opacity: 0 },
        {
          height: 'auto',
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
          onComplete: () => {
            menu.style.height = 'auto';
          },
        }
      );
    } else {
      gsap.to(menu, {
        height: 0,
        opacity: 0,
        duration: 0.22,
        ease: 'power1.inOut',
        onComplete: () => {
          menu.style.display = 'none';
        },
      });
    }
  }, [isMenuOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <button
              type="button"
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => {
                setActiveMegaMenu(null);
                router.push('/');
              }}
              aria-label="Go to homepage"
              onPointerMove={(event) => {
                const target = event.currentTarget;
                const bounds = target.getBoundingClientRect();
                const x = event.clientX - (bounds.left + bounds.width / 2);
                const y = event.clientY - (bounds.top + bounds.height / 2);
                gsap.to(target, {
                  x: x * 0.05,
                  y: y * 0.05,
                  duration: 0.3,
                  ease: 'power2.out',
                });
              }}
              onPointerLeave={(event) => {
                gsap.to(event.currentTarget, {
                  x: 0,
                  y: 0,
                  duration: 0.4,
                  ease: 'elastic.out(1, 0.4)',
                });
              }}
            >
              <div className="flex flex-col items-start">
                <span className="font-display text-2xl font-bold text-gray-900 tracking-tight">
                  FLOWERS<span className="text-emerald-600">INDONESIA</span>
                </span>
                <span className="text-[10px] font-medium text-gray-600 tracking-wider uppercase">
                  Delivering Happiness Across Indonesia
                </span>
              </div>
            </button>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search"
                className="w-full pl-12 pr-4 py-2.5 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-sm"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gray-100 hover:bg-gray-200 rounded text-sm font-medium text-gray-700 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
          {/* Sign In */}
          <Link
            href="/login"
            className="hidden lg:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <User className="w-5 h-5 text-gray-700" />
            <span className="text-sm font-medium text-gray-900">Sign In</span>
          </Link>

            {/* Track Order */}
            <Link
              href="/track"
              className="hidden lg:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Track Order</span>
            </Link>

            {/* Order History */}
            <Link
              href="/orders"
              className="hidden lg:flex items-center gap-2 px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Package className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-medium text-gray-900">Orders</span>
            </Link>

            {/* Currency Selector */}
            <div className="hidden lg:flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 bg-white/80">
              <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Currency</span>
              <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
                {currencyOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setCurrency(option)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded-full transition ${
                      currency === option
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                        : 'text-gray-600 hover:bg-white hover:shadow'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Cart */}
            <Link href="/cart" className="relative p-2 hover:bg-gray-50 rounded-lg transition-colors">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Location Selector - Moved to Corner */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
              >
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Crect width='24' height='12' fill='%23FF0000'/%3E%3Crect width='24' height='12' y='12' fill='white'/%3E%3C/svg%3E" alt="Indonesia" className="w-5 h-5" />
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">{selectedLocation}</span>
                  <ChevronDown className={`w-4 h-4 text-gray-600 transition-transform ${isLocationModalOpen ? 'rotate-180' : ''}`} />
                </div>
              </button>
              <LocationModal 
                isOpen={isLocationModalOpen} 
                onClose={() => setIsLocationModalOpen(false)}
                onSelectLocation={(city) => setSelectedLocation(city)}
              />
            </div>

            {/* Mobile Location */}
            <button
              onClick={() => setIsLocationModalOpen(!isLocationModalOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <MapPin className="w-6 h-6 text-gray-600" />
            </button>

            {/* Mobile Menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors"
          >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Secondary Navigation Bar */}
        <div className="hidden lg:block border-t border-gray-100 relative">
          <div
            className="flex items-center justify-center gap-1 h-12"
            onMouseLeave={handleMegaMenuLeave}
          >
            {navItems.map((item) => (
              <button
                key={item.name}
                type="button"
                onClick={() => handleNavClick(item.href)}
                onMouseEnter={() => {
                  if (item.hasDropdown && item.menuType) {
                    handleMegaMenuEnter(item.menuType);
                  } else {
                    setActiveMegaMenu(null);
                  }
                }}
                onMouseLeave={() => {
                  if (item.hasDropdown) {
                    handleMegaMenuLeave();
                  }
                }}
                className={`nav-link relative px-4 py-2 font-medium text-sm transition-colors flex items-center gap-1 ${
                  activeMegaMenu === item.menuType
                    ? 'text-emerald-600'
                    : 'text-gray-700 hover:text-emerald-600'
                }`}
              >
                {item.name}
                {item.hasDropdown && (
                  <ChevronDown
                    className={`w-3 h-3 transition-transform ${
                      activeMegaMenu === item.menuType ? 'rotate-180' : ''
                    }`}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Mega Menus */}
          {navItems.map(
            (item) =>
              item.menuType && (
                <MegaMenu
                  key={item.menuType}
                  isOpen={activeMegaMenu === item.menuType}
                  onClose={() => setActiveMegaMenu(null)}
                  type={item.menuType}
                  onNavigate={handleMegaMenuNavigate}
                  onMouseEnter={() => handleMegaMenuEnter(item.menuType!)}
                  onMouseLeave={handleMegaMenuLeave}
                />
              )
          )}
        </div>
      </div>

      <div
        ref={mobileMenuRef}
        className="lg:hidden border-t border-gray-100 bg-white overflow-hidden"
        style={{ display: 'none', height: 0, opacity: 0 }}
      >
        <div className="px-4 py-4 space-y-3">
          {navItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {item.name}
            </a>
          ))}
          <Link
            href="/track"
            className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Track Order
          </Link>
          <Link
            href="/orders"
            className="block px-4 py-3 rounded-lg hover:bg-emerald-50 text-gray-700 font-medium"
            onClick={() => setIsMenuOpen(false)}
          >
            Order History
          </Link>
          <div className="px-4 py-3 rounded-lg border border-gray-200 bg-gray-50">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">Currency</span>
            <div className="mt-3 flex items-center gap-2">
              {currencyOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setCurrency(option);
                    setIsMenuOpen(false);
                  }}
                  className={`flex-1 rounded-full px-3 py-2 text-sm font-semibold transition ${
                    currency === option
                      ? 'bg-emerald-600 text-white shadow'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
    </>
  );
}

