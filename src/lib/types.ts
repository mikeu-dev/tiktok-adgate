export interface VideoData {
  id: string;
  title: string;
  cover: string;
  play?: string; // Video URL (with watermark)
  wmplay?: string; // Video URL (with watermark)
  hdplay?: string; // HD Video URL (no watermark)
  music?: string; // MP3 URL
  images?: string[]; // Slide images URL
}

export interface TikTokAPIResponse {
  code: number;
  msg: string;
  data: VideoData;
  processed_time: number;
}
