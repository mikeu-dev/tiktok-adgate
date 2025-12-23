'use client';

import { useState, useEffect, FC } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import AdSense from './adsense';
import { Download, Hourglass } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface DownloadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  downloadInfo: { url: string; type: string } | null;
  onDownloadSuccess: () => void;
}

export const DownloadModal: FC<DownloadModalProps> = ({ open, onOpenChange, downloadInfo, onDownloadSuccess }) => {
  const [countdown, setCountdown] = useState(10); // Default fallback
  const [adDuration, setAdDuration] = useState(10);
  const [isDownloadReady, setIsDownloadReady] = useState(false);
  const [isLoadingConfig, setIsLoadingConfig] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    // Fetch ad configuration when the component mounts
    import('@/lib/api').then(async (mod) => {
      try {
        const config = await mod.getAdConfiguration();
        setAdDuration(config.adDuration);
        setCountdown(config.adDuration);
      } catch (error) {
        console.error('Failed to load ad configuration:', error);
      } finally {
        setIsLoadingConfig(false);
      }
    });
  }, []);

  useEffect(() => {
    if (open && !isLoadingConfig) {
      setIsDownloadReady(false);
      setCountdown(adDuration);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsDownloadReady(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [open, isLoadingConfig, adDuration]);

  const handleDownload = () => {
    if (!downloadInfo) return;
    const link = document.createElement('a');
    link.href = downloadInfo.url;
    link.setAttribute('download', `tiktok_video.${downloadInfo.type.toLowerCase()}`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onDownloadSuccess();
    onOpenChange(false);
  };

  const progressPercentage = ((adDuration - countdown) / adDuration) * 100;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md gap-6 transition-all duration-300">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-bold text-center">{t('modal.title')}</DialogTitle>
          <DialogDescription className="text-center text-muted-foreground text-sm">
            {t('modal.description')}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6">
          {/* Ad Area with proper container */}
          <div className="relative rounded-xl overflow-hidden bg-muted/30 border border-border/50 min-h-[250px] flex items-center justify-center">
            <AdSense adSlot="9876543210" className="w-full h-full min-h-[250px]" />
          </div>

          {/* Status & Controls Area */}
          <div className="space-y-4">
            {!isDownloadReady ? (
              <div className="space-y-3 p-4 rounded-lg bg-secondary/20 border border-secondary/50">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-primary">
                    <Hourglass className="h-4 w-4 animate-spin" />
                    Waiting for ad...
                  </span>
                  <span className="font-mono bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                    {countdown}s
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2 w-full transition-all" />
                <p className="text-xs text-center text-muted-foreground pt-1">
                  {t('modal.countdown', { count: countdown })}
                </p>
              </div>
            ) : (
              <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 p-4 rounded-lg text-center animate-in fade-in zoom-in-95 duration-300 mobile-safe-area">
                <p className="font-semibold flex items-center justify-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                  </span>
                  {t('modal.ready')}
                </p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button
            onClick={handleDownload}
            disabled={!isDownloadReady}
            className="w-full sm:w-auto min-w-[200px] h-12 text-lg font-semibold shadow-lg hover:shadow-primary/25 transition-all"
            size="lg"
          >
            <Download className="mr-2 h-5 w-5" />
            {t('modal.button', { type: downloadInfo?.type || '' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
