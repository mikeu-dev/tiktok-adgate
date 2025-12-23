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
  downloadInfo: { url: string; type: 'MP4' | 'MP3' } | null;
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t('modal.title')}</DialogTitle>
          <DialogDescription>
            {t('modal.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <AdSense adSlot="9876543210" className="w-full h-64" />
        </div>
        <DialogFooter className="flex flex-col gap-2">
          {!isDownloadReady ? (
            <div className="w-full text-center">
              <div className="flex items-center justify-center gap-2 mb-2 text-lg font-medium">
                <Hourglass className="h-5 w-5 animate-spin" />
                <span>{t('modal.countdown', { count: countdown })}</span>
              </div>
              <Progress value={progressPercentage} className="w-full" />
            </div>
          ) : (
            <p className="text-center text-green-600 dark:text-green-400 font-semibold">{t('modal.ready')}</p>
          )}
          <Button onClick={handleDownload} disabled={!isDownloadReady} className="w-full" size="lg">
            <Download className="mr-2 h-4 w-4" />
            {t('modal.button', { type: downloadInfo?.type || '' })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
