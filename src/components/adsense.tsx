'use client';

import { useEffect, FC, useRef } from 'react';
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
  const pathname = usePathname();
  const adContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (adContainerRef.current && adContainerRef.current.clientWidth > 0) {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (err) {
        console.error('AdSense error:', err);
      }
    }
  }, [pathname, adSlot]);

  return (
    <div ref={adContainerRef} className={cn("flex justify-center items-center text-muted-foreground text-sm bg-muted/50 rounded-lg border border-dashed", className)} key={pathname + adSlot}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0000000000000000" // Placeholder
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive.toString()}
      ></ins>
       {/* In a real scenario, the Ad will be displayed here. This is a placeholder. */}
       <span className="p-4">Advertisement Area</span>
    </div>
  );
};

export default AdSense;
