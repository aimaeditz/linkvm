import React from 'react';
import { Skeleton, Spinner } from '@/components/shared/Loader';

export default function Loading() {
  return (
    <div className="min-h-screen bg-white flex flex-col justify-between font-sans">
      {/* Top Navbar skeleton */}
      <div className="h-20 border-b border-slate-100 flex items-center justify-between max-w-7xl mx-auto px-6 w-full">
        <Skeleton className="w-36 h-8 rounded-lg" />
        <div className="hidden md:flex gap-6">
          <Skeleton className="w-16 h-4" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-16 h-4" />
        </div>
        <Skeleton className="w-28 h-9 rounded-full" />
      </div>

      {/* Main hero skeleton */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-4xl mx-auto px-6 py-16 text-center w-full">
        <Skeleton className="w-64 h-6 rounded-full mb-6" />
        <Skeleton className="w-full max-w-2xl h-14 rounded-xl mb-4" />
        <Skeleton className="w-full max-w-lg h-6 rounded-lg mb-8" />
        <div className="flex gap-4 mb-12">
          <Skeleton className="w-36 h-12 rounded-full" />
          <Skeleton className="w-36 h-12 rounded-full" />
        </div>
        <Spinner size="md" className="mt-4" />
      </div>

      {/* Bottom footer skeleton */}
      <div className="h-16 border-t border-slate-100 flex items-center justify-center">
        <Skeleton className="w-48 h-3 rounded" />
      </div>
    </div>
  );
}
