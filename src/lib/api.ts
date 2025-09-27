'use server';

import type { TikTokAPIResponse, VideoData } from './types';

interface ActionResult {
  success: boolean;
  data?: VideoData;
  error?: string;
}

export async function getVideoInfo(url: string): Promise<ActionResult> {
  // Basic validation
  if (!url || !url.includes('tiktok.com')) {
    return { success: false, error: 'Please provide a valid TikTok URL.' };
  }

  try {
    const response = await fetch('https://www.tikwm.com/api/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
      },
      body: new URLSearchParams({ url }),
      cache: 'no-store'
    });
    
    if (!response.ok) {
        return { success: false, error: `API request failed with status: ${response.status}` };
    }

    const result: TikTokAPIResponse = await response.json();

    if (result.code === 0 && result.data) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.msg || 'Failed to get video information. The video might be private or deleted.' };
    }
  } catch (error) {
    console.error('API fetch error:', error);
    return { success: false, error: 'An unexpected error occurred while contacting the API. Please try again later.' };
  }
}
