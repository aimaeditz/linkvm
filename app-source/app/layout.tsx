import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/shared/Providers';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://linkvaultme.com'),
  title: {
    default: 'LinkVaultMe - All your links. One premium page.',
    template: '%s | LinkVaultMe',
  },
  description:
    'Consolidate your social media, portfolio, and business links into one beautiful, lightning-fast page. Every feature unlocked. Free forever.',
  applicationName: 'LinkVaultMe',
  authors: [{ name: 'LinkVaultMe Team' }],
  keywords: [
    'link in bio',
    'link aggregator',
    'free link in bio',
    'creator portfolio',
    'social links',
    'custom QR code',
    'creator website',
  ],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://linkvaultme.com',
    siteName: 'LinkVaultMe',
    title: 'LinkVaultMe - All your links. One premium page.',
    description:
      'Consolidate your social media, portfolio, and business links into one beautiful, lightning-fast page. Every feature unlocked. Free forever.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LinkVaultMe - All your links. One premium page.',
    description:
      'Consolidate your social media, portfolio, and business links into one beautiful, lightning-fast page. Every feature unlocked. Free forever.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen bg-white text-slate-900 font-sans antialiased selection:bg-indigo-500 selection:text-white">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
