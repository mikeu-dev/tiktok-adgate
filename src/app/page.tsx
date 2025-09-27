'use client';

import { useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';

import type { VideoData } from '@/lib/types';
import { getVideoInfo } from '@/lib/api';

import { Header } from '@/components/header';
import { InputForm } from '@/components/input-form';
import { ResultCard } from '@/components/result-card';
import AdSense from '@/components/adsense';
import { Footer } from '@/components/footer';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Terminal } from 'lucide-react';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloadCount, setDownloadCount] = useLocalStorage('downloadCount', 0);

  const handleFetchVideo = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setVideoData(null);

    const result = await getVideoInfo(url);

    if (result.success && result.data) {
      setVideoData(result.data);
    } else {
      setError(result.error || 'An unknown error occurred.');
    }

    setIsLoading(false);
  };

  const incrementDownloadCount = () => {
    setDownloadCount(prevCount => prevCount + 1);
  };

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-12 flex-grow">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-5xl font-bold font-headline mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              TikTok AdGate Downloader
            </h1>
            <p className="text-muted-foreground md:text-lg">
              Paste a TikTok video link to download it without watermark. Watch a short ad to support us!
            </p>
          </div>

          <InputForm onSubmit={handleFetchVideo} isLoading={isLoading} />

          <div className="my-8">
            <AdSense adSlot="1234567890" className="w-full h-24 flex items-center justify-center" />
          </div>

          {isLoading && (
            <div className="space-y-4">
              <Skeleton className="h-[200px] w-full rounded-lg" />
              <Skeleton className="h-8 w-3/4" />
              <div className="flex gap-4">
                <Skeleton className="h-10 w-32" />
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          )}
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {videoData && (
            <ResultCard videoData={videoData} onDownload={incrementDownloadCount} />
          )}

          <div className="mt-12 text-center text-sm text-muted-foreground">
            You have downloaded {downloadCount} videos. Thanks for your support!
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
