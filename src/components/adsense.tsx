'use client';

import { useEffect, useState, FC, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import Link from 'next/link';

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type AdSenseProps = {
  className?: string;
  adSlot: string;
  adFormat?: string;
  fullWidthResponsive?: boolean;
};

const AdSense: FC<AdSenseProps> = ({
  className,
  adSlot,
  adFormat = 'auto',
  fullWidthResponsive = true
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, [adSlot, pathname, isMounted]);

  if (!isMounted) {
    return (
      <div className={cn("flex justify-center items-center text-muted-foreground text-sm bg-muted/50 rounded-lg border border-dashed h-24", className)}>
        <span className="p-4">Loading Ad...</span>
      </div>
    );
  }

  return (
    <div className={cn("relative flex justify-center items-center overflow-hidden min-h-[100px] rounded-lg", className)} key={pathname + adSlot}>
      {/* Internal Ad / Fallback */}
      <Link
        href="/pricing"
        className="absolute inset-0 z-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-between px-6 hover:opacity-95 transition-opacity"
        onClick={() => {
          console.log("Internal Ad Clicked: Upgrade to Pro");
          // Here you would add your analytics call, e.g.
          // analytics.track('ad_click', { type: 'internal', slot: adSlot });
        }}
      >
        <div className="flex flex-col text-white">
          <span className="font-bold text-lg">Upgrade to Pro</span>
          <span className="text-xs text-white/80">Ad-free, Unlimited History & High Speed</span>
        </div>
        <div className="bg-white text-purple-600 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm whitespace-nowrap">
          Get Started
        </div>
      </Link>

      {/* External AdSense */}
      <ins
        className="adsbygoogle relative z-10 w-full h-full pointer-events-none"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-6698556269439251"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
        suppressHydrationWarning
      ></ins>
    </div>
  );
};

export default AdSense;
