import type { Metadata, Viewport } from 'next';
import './globals.css';

// Font loading with preload and display swap
const fonts = [
  { name: 'Space Grotesk', url: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap' },
  { name: 'Inter', url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap' },
  { name: 'JetBrains Mono', url: 'https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap' },
];

export const metadata: Metadata = {
  title: {
    default: 'Naman Soni — Explorer & Builder',
    template: '%s | Naman Soni',
  },
  description: 'Portfolio of Naman Soni — explorer who builds whatever sparks curiosity. AI/3D tools, generative art, and independent projects.',
  keywords: ['portfolio', 'AI tools', '3D', 'generative art', 'web development', 'creative coding', 'Naman Soni'],
  authors: [{ name: 'Naman Soni', url: 'https://github.com/NamanSoni78' }],
  creator: 'Naman Soni',
  publisher: 'Naman Soni',
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
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://inspiration.pages.dev',
    siteName: 'Naman Soni — Portfolio',
    title: 'Naman Soni — Explorer & Builder',
    description: 'Portfolio of Naman Soni — explorer who builds whatever sparks curiosity. AI/3D tools, generative art, and independent projects.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Naman Soni — Explorer & Builder',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naman Soni — Explorer & Builder',
    description: 'Portfolio of Naman Soni — explorer who builds whatever sparks curiosity.',
    images: ['/og-image.png'],
    creator: '@namansoni78',
  },
  verification: {
    // Add verification tokens if needed
  },
  other: {
    'theme-color': '#0A0A0A',
    'color-scheme': 'dark',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0A0A0A' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reducedMotion = typeof window !== 'undefined'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  return (
    <html lang="en" suppressHydrationWarning data-reduced-motion={reducedMotion ? 'true' : 'false'}>
      <head>
        {/* Font preloads */}
        {fonts.map((font) => (
          <link
            key={font.name}
            rel="preload"
            as="style"
            href={font.url}
            crossOrigin="anonymous"
          />
        ))}
        {fonts.map((font) => (
          <link
            key={`style-${font.name}`}
            rel="stylesheet"
            href={font.url}
            media="print"
            onLoad="this.media='all'"
            crossOrigin="anonymous"
          />
        ))}
        {/* DNS prefetch for external resources */}
        <link rel="dns-prefetch" href="https://github.com" />
        <link rel="dns-prefetch" href="https://links.namansoni.in" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-surface text-primary antialiased" data-reduced-motion={reducedMotion ? 'true' : 'false'}>
        <a href="#main" className="skip-link">Skip to main content</a>
        {children}
      </body>
    </html>
  );
}
