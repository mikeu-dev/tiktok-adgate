'use server';

import type { TikTokAPIResponse, VideoData } from './types';
import type { Language } from '@/hooks/use-language';
import id from '@/locales/id.json';
import en from '@/locales/en.json';
import { getAdConfiguration } from './config-store';

export { getAdConfiguration };

const translations = { id, en };

interface ActionResult {
  success: boolean;
  data?: VideoData;
  error?: string;
}

export async function getVideoInfo(url: string, lang: Language = 'id'): Promise<ActionResult> {
  const t = (key: keyof typeof id) => translations[lang][key] || translations['id'][key];

  // Basic validation
  if (!url || !url.includes('tiktok.com')) {
    return { success: false, error: t("api.error.invalidUrl") };
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
      return { success: false, error: `${t("api.error.requestFailed")} ${response.status}` };
    }

    const result: TikTokAPIResponse = await response.json();

    if (result.code === 0 && result.data) {
      return { success: true, data: result.data };
    } else {
      return { success: false, error: result.msg || t("api.error.getInfoFailed") };
    }
  } catch (error) {
    console.error('API fetch error:', error);
    return { success: false, error: t("api.error.unexpected") };
  }
}
