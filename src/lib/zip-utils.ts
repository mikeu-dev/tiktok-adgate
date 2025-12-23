import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export async function downloadImagesAsZip(images: string[], zipFilename: string = 'images.zip'): Promise<void> {
    const zip = new JSZip();
    const folder = zip.folder('images');

    if (!folder) {
        throw new Error('Failed to create zip folder');
    }

    // Helper to fetch image blob
    const fetchImage = async (url: string) => {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch ${url}`);
            return await response.blob();
        } catch (error) {
            console.error('Error fetching image for zip:', error);
            // Fallback or skip could be handled here
            return null;
        }
    };

    const promises = images.map(async (url, index) => {
        // Try to extract extension from URL or default to jpg
        const ext = url.split('.').pop()?.split('?')[0] || 'jpg';
        const filename = `image_${index + 1}.${ext}`;

        // For TikTok/external images, we might face CORS issues.
        // Ideally this should go through a proxy if direct fetch fails.
        const blob = await fetchImage(url);

        if (blob) {
            folder.file(filename, blob);
        }
    });

    await Promise.all(promises);

    const content = await zip.generateAsync({ type: 'blob' });
    saveAs(content, zipFilename);
}
