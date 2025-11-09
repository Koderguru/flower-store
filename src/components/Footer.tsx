'use client';

import { useRef, useState } from 'react';
import { Instagram, Facebook, Twitter, Mail, Heart, Youtube, Linkedin, Send } from 'lucide-react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap';

export default function Footer() {
  const [email, setEmail] = useState('');

  const footerLinks = {
    'FLOWERSINDONESIA': ['About Us', 'Delivery Information', 'Privacy Policy', 'Terms & Conditions', 'Contact Us'],
    'Categories': ['Flowers', 'Cakes', 'Plants', 'Gifts', 'Combos', 'Chocolates'],
    'Occasions': ['Birthday', 'Anniversary', 'Wedding', 'Valentine', 'Mother\'s Day', 'Congratulations'],
    'Other Links': ['Corporate Gifts', 'Franchise', 'Careers', 'Blog', 'Customer Care'],
  };

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Youtube, href: '#', label: 'Youtube' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  const footerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const columns = gsap.utils.toArray<HTMLElement>('.footer-column');
      columns.forEach((column) => {
        ScrollTrigger.create({
          trigger: column,
          start: 'top 90%',
          onEnter: () => {
            gsap.fromTo(
              column,
              { opacity: 0, y: 30 },
              { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' }
            );
          },
        });
      });

      const icons = gsap.utils.toArray<HTMLElement>('.footer-social');
      ScrollTrigger.create({
        trigger: footerRef.current,
        start: 'top 95%',
        onEnter: () => {
          gsap.from(icons, {
            opacity: 0,
            y: 12,
            duration: 0.4,
            stagger: 0.08,
            ease: 'power1.out',
          });
        },
      });
    },
    { scope: footerRef }
  );

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log('Subscribed:', email);
    setEmail('');
  };

  return (
    <footer ref={footerRef} className="bg-white border-t border-gray-200">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-blue-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="font-display text-3xl font-bold text-gray-900 mb-2">
              Subscribe
            </h3>
            <p className="text-gray-600 mb-6">
              Get exclusive offers and updates delivered to your inbox
            </p>
            <form onSubmit={handleSubscribe} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-2"
              >
                Subscribe
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Logo and Description */}
        <div className="mb-12">
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-2">
              FLOWERSINDONESIA            </h2>
            <p className="text-gray-600 max-w-2xl">
              India's leading online gifting platform, delivering happiness across 600+ cities. 
              Fresh flowers, delicious cakes, and thoughtful gifts for every occasion.
            </p>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="footer-column">
              <h3 className="font-bold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-gray-600 hover:text-emerald-600 transition-colors text-sm"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Payment & Social */}
        <div className="border-t border-gray-200 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Social Links */}
            <div className="flex items-center gap-4">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  className="footer-social w-10 h-10 rounded-full bg-gray-100 hover:bg-emerald-600 hover:text-white flex items-center justify-center transition-all"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>

            {/* App Store Badges */}
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Download App
              </button>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              © 2024 FLOWERSINDONESIA. All rights reserved. | Delivering Happiness Since 2007
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

