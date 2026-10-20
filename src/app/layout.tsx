import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { MenuProvider } from '@/context/MenuContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';

export const metadata: Metadata = {
  title: 'QueueLess CU — Skip the Queue. Enjoy Your Break.',
  description: 'Smart campus food ordering application for Chandigarh University canteen.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#EA580C',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body className="bg-slate-900 min-h-screen text-slate-900 flex justify-center antialiased">
        {/* Mobile Viewport Container Shell */}
        <div className="w-full max-w-md min-h-screen bg-slate-50 flex flex-col shadow-2xl relative border-x border-slate-200/50">
          <AuthProvider>
            <MenuProvider>
              <CartProvider>
                <OrderProvider>
                  <Navbar />
                  <main className="flex-1 pb-20">{children}</main>
                  <BottomNav />
                </OrderProvider>
              </CartProvider>
            </MenuProvider>
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
