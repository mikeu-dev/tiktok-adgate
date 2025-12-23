'use client';

import { useEffect, useState, FC, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

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
    <div className={cn("flex justify-center items-center text-muted-foreground text-sm bg-muted/50 rounded-lg border border-dashed overflow-hidden", className)} key={pathname + adSlot}>
      <ins
        className="adsbygoogle"
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
