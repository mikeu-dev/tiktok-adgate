'use client';

import { useState, FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { DownloadModal } from './download-modal';
import type { VideoData } from '@/lib/types';
import { Download, Music, Loader2, Images } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';
import { downloadImagesAsZip } from '@/lib/zip-utils';

interface ResultCardProps {
  videoData: VideoData;
  onDownload: () => void;
}

export const ResultCard: FC<ResultCardProps> = ({ videoData, onDownload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; type: string } | null>(null);
  const [isZipping, setIsZipping] = useState(false);
  const { t } = useLanguage();

  const videoUrl = videoData.hdplay || videoData.play;

  const handleDownloadClick = (url: string, type: string) => {
    setDownloadInfo({ url, type });
    setIsModalOpen(true);
  };

  const handleDownloadZip = async () => {
    if (!videoData.images || videoData.images.length === 0) return;

    setIsZipping(true);
    try {
      await downloadImagesAsZip(videoData.images, `tiktok_slides_${videoData.id}.zip`);
      onDownload();
    } catch (error) {
      console.error('Failed to download zip:', error);
      // Could show a toast here if available
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg border-primary/20 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="leading-tight text-xl md:text-2xl">{videoData.title}</CardTitle>
          <CardDescription className="flex items-center gap-2">
            ID: {videoData.id}
            {videoData.images && (
              <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80">
                <Images className="w-3 h-3 mr-1" />
                {videoData.images.length} Slides
              </span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Main Video/Cover View */}
          <div className="relative aspect-video w-full overflow-hidden rounded-xl border bg-black/5 shadow-inner cursor-pointer group" onClick={() => videoUrl && handleDownloadClick(videoUrl, 'MP4')}>
            <Image
              src={videoData.cover}
              alt={t('result.thumbnailAlt', { title: videoData.title })}
              fill
              className="object-contain blur-3xl scale-110 opacity-50"
            />
            <Image
              src={videoData.cover}
              alt={t('result.thumbnailAlt', { title: videoData.title })}
              fill
              className="object-contain z-10 transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {videoUrl && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="bg-white/20 backdrop-blur-md p-4 rounded-full shadow-2xl transform group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Image Slides Carousel */}
          {videoData.images && videoData.images.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Images className="w-5 h-5 text-primary" />
                  Photo Slides
                </h3>
                <span className="text-xs text-muted-foreground">{videoData.images.length} images</span>
              </div>

              <div className="relative px-4 sm:px-12 py-2">
                <Carousel
                  opts={{
                    align: "start",
                    loop: true,
                  }}
                  className="w-full"
                >
                  <CarouselContent className="-ml-2 md:-ml-4">
                    {videoData.images.map((img, idx) => (
                      <CarouselItem key={idx} className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 lg:basis-1/4">
                        <div
                          className="relative aspect-[3/4] rounded-lg overflow-hidden border bg-muted group cursor-pointer hover:ring-2 ring-primary transition-all shadow-sm hover:shadow-md"
                          onClick={() => handleDownloadClick(img, 'JPG')}
                        >
                          <Image
                            src={img}
                            alt={`Slide ${idx + 1}`}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 25vw"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                            <Download className="w-6 h-6 text-white drop-shadow-md" />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-0 sm:-left-8" />
                  <CarouselNext className="right-0 sm:-right-8" />
                </Carousel>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3">
          {videoUrl ? (
            <Button
              className="w-full sm:w-auto flex-1 font-semibold"
              size="lg"
              onClick={() => handleDownloadClick(videoUrl, 'MP4')}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('result.downloadMp4')}
            </Button>
          ) : (
            videoData.images && (
              <Button
                className="w-full sm:w-auto flex-1 font-semibold"
                size="lg"
                onClick={handleDownloadZip}
                disabled={isZipping}
              >
                {isZipping ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Download className="mr-2 h-4 w-4" />
                )}
                {isZipping ? 'Zipping...' : 'Download All Images (ZIP)'}
              </Button>
            )
          )}

          {/* If there are images AND a video (rare but possible), allow ZIP download too */}
          {videoUrl && videoData.images && videoData.images.length > 0 && (
            <Button
              className="w-full sm:w-auto flex-1 font-semibold"
              size="lg"
              variant="secondary"
              onClick={handleDownloadZip}
              disabled={isZipping}
            >
              {isZipping ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Images className="mr-2 h-4 w-4" />
              )}
              {isZipping ? 'Zipping...' : 'Download Images (ZIP)'}
            </Button>
          )}

          {videoData.music && (
            <Button
              className="w-full sm:w-auto flex-1"
              size="lg"
              variant="outline"
              onClick={() => handleDownloadClick(videoData.music!, 'MP3')}
            >
              <Music className="mr-2 h-4 w-4" />
              {t('result.downloadMp3')}
            </Button>
          )}
        </CardFooter>
      </Card>

      <DownloadModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        downloadInfo={downloadInfo}
        onDownloadSuccess={onDownload}
      />
    </>
  );
};
