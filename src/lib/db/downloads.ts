
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import type { VideoData } from '@/lib/types';

export interface DownloadReturn {
    id: string;
    video: VideoData;
    createdAt: any;
    userId: string;
}

export async function saveDownload(userId: string, videoData: VideoData) {
    if (!userId || !videoData) return;

    try {
        const downloadsRef = collection(db, 'downloads');
        await addDoc(downloadsRef, {
            userId,
            video: videoData,
            createdAt: serverTimestamp(),
            videoId: videoData.id, // For easier querying/deduplication later
            title: videoData.title
        });
    } catch (error) {
        console.error("Error saving download:", error);
        throw error;
    }
}

export async function getUserHistory(userId: string, maxResults = 20): Promise<DownloadReturn[]> {
    if (!userId) return [];

    try {
        const downloadsRef = collection(db, 'downloads');
        const q = query(
            downloadsRef,
            where('userId', '==', userId),
            orderBy('createdAt', 'desc'),
            limit(maxResults)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as DownloadReturn));
    } catch (error) {
        console.error("Error fetching history:", error);
        return [];
    }
}
