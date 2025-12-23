'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Calendar, Download, Play, ExternalLink } from 'lucide-react';

import { useAuth } from '@/components/auth-provider';
import { getUserHistory, type DownloadReturn } from '@/lib/db/downloads';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';
import { format } from 'date-fns';

export default function HistoryPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [history, setHistory] = useState<DownloadReturn[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const { t } = useLanguage();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/');
        } else if (user) {
            fetchHistory();
        }
    }, [user, loading, router]);

    const fetchHistory = async () => {
        if (!user) return;
        setIsLoadingHistory(true);
        try {
            const data = await getUserHistory(user.uid);
            setHistory(data);
        } catch (error) {
            console.error("Failed to fetch history", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Skeleton className="h-12 w-12 rounded-full" /></div>;
    }

    if (!user) return null;

    return (
        <>
            <Header />
            <main className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">My History</h1>
                    <p className="text-muted-foreground">Your recent downloads</p>
                </div>

                {isLoadingHistory ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <Skeleton key={i} className="h-64 w-full rounded-xl" />
                        ))}
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                        <h2 className="text-xl font-semibold mb-2">No history yet</h2>
                        <p className="text-muted-foreground mb-4">Start downloading videos to see them here.</p>
                        <Button onClick={() => router.push('/')}>Go Home</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {history.map((item, index) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="bg-card rounded-xl border shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <div className="aspect-[16/9] relative bg-black/5">
                                    {/* Thumbnail usually 9:16 for TikTok, so we crop/contain */}
                                    {item.video.cover && (
                                        <img
                                            src={item.video.cover}
                                            alt={item.video.title}
                                            className="w-full h-full object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <a href={item.video.play} target="_blank" rel="noopener noreferrer" className="text-white">
                                            <Play className="h-12 w-12 fill-white hover:scale-110 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-semibold truncate mb-2" title={item.video.title}>{item.video.title || 'No Title'}</h3>
                                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            <span>{item.createdAt?.seconds ? format(new Date(item.createdAt.seconds * 1000), 'MMM d, yyyy') : 'Just now'}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline" className="w-full flex gap-2" asChild>
                                            <a href={item.video.hdplay || item.video.play} target="_blank" rel="noopener noreferrer">
                                                <Download className="h-3 w-3" /> Download
                                            </a>
                                        </Button>
                                        {/* <Button variant="ghost" size="icon" asChild>
                                            <a href={`https://tiktok.com/@${item.video.author?.unique_id}/video/${item.video.id}`} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </Button> */}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
