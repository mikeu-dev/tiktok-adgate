import AdSense from './adsense';

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <AdSense adSlot="5555555555" className="w-full h-24 flex items-center justify-center" />
        </div>
        <div className="text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} TikTok AdGate. All rights reserved.</p>
          <p>This service is not affiliated with TikTok.</p>
        </div>
      </div>
    </footer>
  );
}
