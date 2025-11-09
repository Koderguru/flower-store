'use client';

import Image from 'next/image';
import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap';

interface CategoryChipProps {
  name: string;
  image: string;
  isActive?: boolean;
  onClick?: () => void;
  index?: number;
}

export default function CategoryChip({
  name,
  image,
  isActive = false,
  onClick,
  index = 0,
}: CategoryChipProps) {
  const chipRef = useRef<HTMLButtonElement>(null);

  useGSAP(
    () => {
      if (!chipRef.current) return;
      gsap.fromTo(
        chipRef.current,
        {
          opacity: 0,
          scale: 0.9,
          y: 16,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.48,
          delay: index * 0.05,
          ease: 'back.out(1.6)',
        }
      );
    },
    { dependencies: [index], scope: chipRef }
  );

  const handlePointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!chipRef.current) return;
    const bounds = chipRef.current.getBoundingClientRect();
    const relativeX = event.clientX - (bounds.left + bounds.width / 2);
    const relativeY = event.clientY - (bounds.top + bounds.height / 2);

    gsap.to(chipRef.current, {
      x: relativeX * 0.1,
      y: relativeY * 0.15,
      rotateX: relativeY * -0.02,
      rotateY: relativeX * 0.02,
      duration: 0.4,
      ease: 'power2.out',
    });
  };

  const handlePointerLeave = () => {
    if (!chipRef.current) return;
    gsap.to(chipRef.current, {
      x: 0,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.4)',
    });
  };

  return (
    <button
      ref={chipRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`category-chip relative flex flex-col items-center gap-3 p-4 rounded-2xl transition-all duration-300 will-change-transform ${
        isActive
          ? 'bg-emerald-600 text-white shadow-lg'
          : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
      }`}
    >
      <div className="relative w-16 h-16 rounded-full overflow-hidden bg-gray-100">
        <Image
          src={image}
          alt={name}
          fill
          className="object-cover"
          sizes="64px"
        />
      </div>
      <span className="text-sm font-semibold whitespace-nowrap">{name}</span>
    </button>
  );
}

