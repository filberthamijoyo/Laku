import type { Metadata } from 'next';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ChatProvider } from '@/contexts/ChatContext';
import { AppProvider } from '@/providers';
import { DevAuthProvider } from '@/providers/DevAuthProvider';
import { Toaster } from 'sonner';

export const metadata: Metadata = {
  title: 'LAKU - Marketplace Indonesia',
  description: 'Platform belanja online dengan fitur group buying',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-white font-sans antialiased">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 z-50 px-4 py-2 bg-primary text-white rounded">
          Skip to main content
        </a>
        <div className="bg-white min-h-screen w-full">
          <LanguageProvider>
            <ChatProvider>
              <DevAuthProvider>
                <AppProvider>
                  {children}
                  <Toaster position="top-center" />
                </AppProvider>
              </DevAuthProvider>
            </ChatProvider>
          </LanguageProvider>
        </div>
      </body>
    </html>
  );
}
