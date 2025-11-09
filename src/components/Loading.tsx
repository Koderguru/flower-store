'use client';

import Lottie from 'lottie-react';
import loadingAnimation from '@/data/loading.json';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="w-32 h-32">
        <Lottie animationData={loadingAnimation} loop />
      </div>
    </div>
  );
}

