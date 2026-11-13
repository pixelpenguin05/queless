import type { Metadata, Viewport } from 'next';
import './globals.css';
import { isFirebaseConfigured } from '@/lib/firebase';

export const metadata: Metadata = {
  title: 'QueueLess: order ahead, skip the queue',
  description: 'Order food from nearby restaurants and pick it up when it is ready.',
  manifest: '/manifest.json',
  icons: { icon: '/icon-192.png', apple: '/icon-192.png' },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#E23744',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body>
        {!isFirebaseConfigured && (
          <div className="bg-amber-100 px-4 py-2 text-center text-xs text-amber-900">
            Local mode: data is saved in this browser only. Add Firebase keys to sync across phones.
          </div>
        )}
        {children}
      </body>
    </html>
  );
}
