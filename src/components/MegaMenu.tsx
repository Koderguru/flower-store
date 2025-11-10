'use client';

import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';
import { useRef } from 'react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'flowers' | 'gifts' | 'cakes' | 'occasion' | 'express' | 'deal';
  onNavigate: (type: MegaMenuProps['type'], label?: string) => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function MegaMenu({ isOpen, onClose, type, onNavigate, onMouseEnter, onMouseLeave }: MegaMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!menuRef.current) return;

      if (isOpen) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -20 },
          { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
        );
      }
    },
    { dependencies: [isOpen], scope: menuRef }
  );

  if (!isOpen) return null;

  const getMenuContent = () => {
    switch (type) {
      case 'flowers':
        return {
          sections: [
            {
              title: 'By Collection',
              links: [
                'All Flowers',
                'Flowers Bouquet',
                'Flowers In A Basket',
                'Flowers In A Vase',
                'Flower Boxes',
                'Flowers In Wooden Tray',
                'Exotic Flowers',
                'Luxury Collection',
                'Affordable Flowers',
                'Heart Shaped Arrangement',
              ],
            },
            {
              title: 'Shop by Flower Type',
              links: [
                'Roses',
                'Carnations',
                'Lilies',
                'Orchids',
                'Sunflowers',
                'Gerberas',
              ],
            },
            {
              title: 'By Recipient',
              links: ['For Her', 'For Him', 'For Mom', 'For Dad'],
            },
            {
              title: 'By Color',
              links: [
                'Red Flowers',
                'Pink Flowers',
                'White Flowers',
                'Orange Flowers',
                'Purple Flowers',
                'Yellow Flowers',
              ],
            },
            {
              title: 'By Price',
              links: [
                'Under ₹ 5,000',
                '₹ 5,000 to ₹ 10,000',
                '₹ 10,000 to ₹ 20,000',
                'Above ₹ 20,000',
              ],
            },
          ],
        };
      case 'gifts':
        return {
          sections: [
            {
              title: 'Gift Categories',
              links: [
                'Chocolates',
                'Teddy Bears',
                'Gift Hampers',
                'Personalized Gifts',
                'Greeting Cards',
              ],
            },
            {
              title: 'By Occasion',
              links: ['Birthday Gifts', 'Anniversary Gifts', 'Wedding Gifts'],
            },
          ],
        };
      case 'cakes':
        return {
          sections: [
            {
              title: 'Cake Types',
              links: [
                'Chocolate Cakes',
                'Vanilla Cakes',
                'Fruit Cakes',
                'Photo Cakes',
                'Designer Cakes',
              ],
            },
            {
              title: 'By Weight',
              links: ['0.5 Kg', '1 Kg', '2 Kg', '3 Kg & Above'],
            },
          ],
        };
      case 'occasion':
        return {
          sections: [
            {
              title: 'Celebrations',
              links: [
                'Birthday',
                'Anniversary',
                'Wedding',
                'Congratulations',
                'Get Well Soon',
              ],
            },
            {
              title: 'Festivals',
              links: [
                'Valentine Day',
                'Mother\'s Day',
                'Father\'s Day',
                'Christmas',
                'New Year',
              ],
            },
          ],
        };
      case 'express':
        return {
          sections: [
            {
              title: 'Delivery Options',
              links: [
                'Same Day Delivery',
                'Midnight Delivery',
                'Early Morning Delivery',
                'Fixed Time Delivery',
              ],
            },
          ],
        };
      case 'deal':
        return {
          sections: [
            {
              title: 'Special Offers',
              links: [
                'Today\'s Deals',
                'Combo Offers',
                'Clearance Sale',
                'Best Sellers',
              ],
            },
          ],
        };
      default:
        return { sections: [] };
    }
  };

  const content = getMenuContent();

  return (
      <div
        ref={menuRef}
        className="absolute left-0 right-0 top-full z-50"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-6">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200">
            <div className="px-8 py-8">
              <div className={`grid gap-8 ${content.sections.length === 5 ? 'grid-cols-5' : content.sections.length === 4 ? 'grid-cols-4' : content.sections.length === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
                {content.sections.map((section, index) => (
                  <div key={index}>
                    <h3 className="font-bold text-gray-900 mb-4 text-sm">
                      {section.title}
                    </h3>
                    <ul className="space-y-2">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <button
                            type="button"
                            className="w-full text-left text-sm text-gray-700 hover:text-emerald-600 transition-colors block py-1"
                            onClick={() => {
                              onNavigate(type, link);
                              onClose();
                            }}
                          >
                            {link}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
}

