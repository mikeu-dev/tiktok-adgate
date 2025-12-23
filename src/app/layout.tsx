import type { Metadata, Viewport } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { Toaster } from "@/components/ui/toaster"
import { cn } from '@/lib/utils';
import { LanguageProvider } from '@/components/providers/language-provider';

const siteConfig = {
  name: 'TikTok AdGate Downloader',
  url: 'https://tiktok-adgate-downloader.com', // Ganti dengan URL domain production Anda
  description: 'Download TikTok videos in HD without watermarks for free. Our simple tool lets you save MP4 videos or MP3 audio after a short ad. Fast, reliable, and unlimited.',
  ogImage: 'https://tiktok-adgate-downloader.com/og-image.png', // Ganti dengan URL gambar OG Anda
  links: {
    twitter: 'https://twitter.com/your_handle', // Ganti dengan handle Twitter Anda
  },
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} - Gratis & Tanpa Watermark`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    'TikTok downloader',
    'download TikTok',
    'TikTok no watermark',
    'free TikTok downloader',
    'save TikTok video',
    'TikTok video downloader',
    'TikTok MP4',
    'TikTok MP3',
    'unduh TikTok',
    'downloader TikTok tanpa watermark',
    'simpan video TikTok',
  ],
  authors: [
    {
      name: 'Your Name', // Ganti dengan nama Anda atau nama perusahaan
      url: siteConfig.url,
    },
  ],
  creator: 'Your Name', // Ganti dengan nama Anda atau nama perusahaan

  openGraph: {
    type: 'website',
    locale: 'id_ID',
    alternateLocale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
    creator: '@your_handle', // Ganti dengan handle Twitter Anda
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: `${siteConfig.url}/site.webmanifest`,
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};


import { Inter, Source_Code_Pro, Outfit } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], variable: "--font-source-code-pro" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6698556269439251" />
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6698556269439251" crossOrigin="anonymous"></script>
      </head>
      <body className={cn("font-body antialiased min-h-screen flex flex-col", inter.variable, sourceCodePro.variable, outfit.variable)}>
        <LanguageProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex-grow">
              {children}
            </div>
            <Toaster />
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
