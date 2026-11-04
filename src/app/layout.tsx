import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { MenuProvider } from '@/context/MenuContext';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/OrderContext';
import { Navbar } from '@/components/Navbar';
import { BottomNav } from '@/components/BottomNav';
import { StudentAuthModal } from '@/components/StudentAuthModal';
import { NotificationBanner } from '@/components/NotificationBanner';

export const metadata: Metadata = {
  title: 'QueueLess CU — Skip the Queue. Enjoy Your Break.',
  description: 'Smart campus food ordering application for Chandigarh University canteen. Pre-order and pick up with zero wait time.',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/icon-192.png',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#E23744',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="bg-[#FAF7F2] text-[#1F292E] min-h-screen flex flex-col antialiased selection:bg-[#E8B92C]/30 selection:text-inherit">
        <AuthProvider>
          <MenuProvider>
            <CartProvider>
              <OrderProvider>
                <div className="min-h-screen flex flex-col w-full">
                  <Navbar />
                  <NotificationBanner />
                  <main className="flex-1 w-full pb-20 md:pb-10">
                    {children}
                  </main>
                  <BottomNav />
                  <StudentAuthModal />
                </div>
              </OrderProvider>
            </CartProvider>
          </MenuProvider>
        </AuthProvider>
      </body>
    </html>
  );
}