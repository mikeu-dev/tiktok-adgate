'use client';

import { useState, FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadModal } from './download-modal';
import type { VideoData } from '@/lib/types';
import { Download, Music } from 'lucide-react';
import { useLanguage } from '@/hooks/use-language';

interface ResultCardProps {
  videoData: VideoData;
  onDownload: () => void;
}

export const ResultCard: FC<ResultCardProps> = ({ videoData, onDownload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; type: string } | null>(null);
  const { t } = useLanguage();

  const videoUrl = videoData.hdplay || videoData.play;

  const handleDownloadClick = (url: string, type: string) => {
    setDownloadInfo({ url, type });
    setIsModalOpen(true);
  };

  return (
    <>
      <Card className="overflow-hidden shadow-lg">
        <CardHeader>
          <CardTitle className="leading-tight">{videoData.title}</CardTitle>
          <CardDescription>ID: {videoData.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative aspect-video w-full overflow-hidden rounded-md cursor-pointer group" onClick={() => videoUrl && handleDownloadClick(videoUrl, 'MP4')}>
            <Image
              src={videoData.cover}
              alt={t('result.thumbnailAlt', { title: videoData.title })}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {videoUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                <div className="bg-white/20 backdrop-blur-sm p-3 rounded-full">
                  <Download className="w-8 h-8 text-white" />
                </div>
              </div>
            )}
          </div>

          {/* Image Slides Section */}
          {videoData.images && videoData.images.length > 0 && (
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">Image Slides ({videoData.images.length})</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2 rounded-lg border p-2 bg-muted/20">
                {videoData.images.map((img, idx) => (
                  <div key={idx} className="relative aspect-square rounded overflow-hidden cursor-pointer hover:ring-2 ring-primary transition-all" onClick={() => handleDownloadClick(img, 'JPG' as any)}>
                    <Image
                      src={img}
                      alt={`Slide ${idx + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 33vw"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/50 text-white text-[10px] py-1 text-center opacity-0 hover:opacity-100 transition-opacity">
                      Download
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4 flex-wrap">
          {videoUrl ? (
            <Button
              className="w-full sm:w-auto flex-1"
              size="lg"
              onClick={() => handleDownloadClick(videoUrl, 'MP4')}
            >
              <Download className="mr-2 h-4 w-4" />
              {t('result.downloadMp4')}
            </Button>
          ) : (
            /* Logic to download all images could be added here, currently supported per image */
            <Button
              className="w-full sm:w-auto flex-1"
              size="lg"
              variant="outline"
              disabled
            >
              <Download className="mr-2 h-4 w-4" />
              Download All Images (Zip) - Coming Soon
            </Button>
          )}
          {videoData.music && (
            <Button
              className="w-full sm:w-auto flex-1"
              size="lg"
              variant="secondary"
              onClick={() => handleDownloadClick(videoData.music, 'MP3')}
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
