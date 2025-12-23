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
import { useLanguage } from '@/hooks/use-language';
import { motion } from 'framer-motion';

import { saveDownload } from '@/lib/db/downloads';
import { useAuth } from '@/components/auth-provider';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<VideoData | null>(null);
  const [downloadCount, setDownloadCount] = useLocalStorage('downloadCount', 0);
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const handleFetchVideo = async (url: string) => {
    setIsLoading(true);
    setError(null);
    setVideoData(null);

    const result = await getVideoInfo(url, language);

    if (result.success && result.data) {
      setVideoData(result.data);
      if (user) {
        // Save to history asynchronously
        saveDownload(user.uid, result.data).catch(console.error);
      }
    } else {
      setError(result.error || t('error.unknown'));
    }

    setIsLoading(false);
  };

  const incrementDownloadCount = () => {
    setDownloadCount(prevCount => prevCount + 1);
  };

  return (
    <>
      <Header />
      <motion.main
        initial="hidden"
        animate="show"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="container mx-auto px-4 py-8 md:py-12 flex-grow"
      >
        <div className="max-w-2xl mx-auto">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              show: { opacity: 1, y: 0 }
            }}
            className="text-center mb-10"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient bg-clip-text text-transparent">
              {t('home.title')}
            </h1>
            <p className="text-muted-foreground md:text-xl font-light">
              {t('home.subtitle')}
            </p>
          </motion.div>

          <InputForm onSubmit={handleFetchVideo} isLoading={isLoading} />

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 }
            }}
            className="my-10"
          >
            <AdSense adSlot="1234567890" className="w-full h-28 flex items-center justify-center bg-muted/20 rounded-lg border border-dashed border-muted-foreground/20" />
          </motion.div>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <Skeleton className="h-[250px] w-full rounded-xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-3/4 rounded-full" />
                <Skeleton className="h-4 w-1/2 rounded-full" />
              </div>
              <div className="flex gap-4 pt-2">
                <Skeleton className="h-12 w-32 rounded-lg" />
                <Skeleton className="h-12 w-32 rounded-lg" />
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Alert variant="destructive" className="border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400">
                <Terminal className="h-4 w-4" />
                <AlertTitle>{t('error.title')}</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </motion.div>
          )}
          {videoData && (
            <ResultCard videoData={videoData} onDownload={incrementDownloadCount} />
          )}

          <motion.div
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1 }
            }}
            className="mt-16 text-center text-sm text-muted-foreground/60"
          >
            {t('home.downloadCount', { count: downloadCount })}
          </motion.div>
        </div>
      </motion.main>
      <Footer />
    </>
  );
}
