import type { Metadata } from 'next';
import { Inter } from 'next/font/google'; // Standard Next.js font optimization
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider'; // For light/dark mode toggle
import { Analytics } from '@vercel/analytics/next';
import { Navbar } from '@/components/layout/Navbar';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Type Duel',
  description: 'Real-time two-player typing game.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Existing Google Font links can be kept if preferred, or removed if using next/font */}
        
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        {/* <!-- Meta Pixel Code --> */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '1057016612691557');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript><img height="1" width="1" style={{ display: 'none' }}
        src="https://www.facebook.com/tr?id=1057016612691557&ev=PageView&noscript=1"
        /></noscript>
        {/* <!-- End Meta Pixel Code --> */}
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {/* Change this line: */}
            <div className='mt-10'>
              <Navbar />
            </div>
            
            <main className="flex-grow"> {/* Removed container and p-4 */}
              {children}
              <Analytics />
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
