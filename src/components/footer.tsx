import { useLanguage } from '@/hooks/use-language';
import AdSense from './adsense';

export function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t bg-white/40 dark:bg-black/20 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <AdSense adSlot="5555555555" className="w-full h-24 flex items-center justify-center" />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TikTok AdGate. All rights reserved.</p>
          <p>{t('footer.disclaimer')}</p>
        </div>
      </div>
    </footer>
  );
}
