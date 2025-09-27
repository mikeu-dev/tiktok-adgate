'use client';

import { useState, FC } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DownloadModal } from './download-modal';
import type { VideoData } from '@/lib/types';
import { Download, Music } from 'lucide-react';

interface ResultCardProps {
  videoData: VideoData;
  onDownload: () => void;
}

export const ResultCard: FC<ResultCardProps> = ({ videoData, onDownload }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState<{ url: string; type: 'MP4' | 'MP3' } | null>(null);
  
  const videoUrl = videoData.hdplay || videoData.play;

  const handleDownloadClick = (url: string, type: 'MP4' | 'MP3') => {
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
          <div className="relative aspect-video w-full overflow-hidden rounded-md">
            <Image
              src={videoData.cover}
              alt={`Thumbnail for TikTok video: ${videoData.title}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-4">
          {videoUrl && (
            <Button
              className="w-full sm:w-auto"
              size="lg"
              onClick={() => handleDownloadClick(videoUrl, 'MP4')}
            >
              <Download className="mr-2 h-4 w-4" />
              Download MP4
            </Button>
          )}
          {videoData.music && (
            <Button
              className="w-full sm:w-auto"
              size="lg"
              variant="secondary"
              onClick={() => handleDownloadClick(videoData.music, 'MP3')}
            >
              <Music className="mr-2 h-4 w-4" />
              Download MP3
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
