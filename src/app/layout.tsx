import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { ReactQueryProvider } from "./contexts/react-query";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Song Sculpt - AI-Powered Song Analysis & Presentation Generator",
  description:
    "Transform any song into a professional presentation with AI-powered analysis. Generate slides with lyrics, themes, and insights automatically. Perfect for music education, presentations, and song analysis.",
  keywords: [
    "song analysis",
    "AI presentation generator",
    "music education",
    "lyrics analysis",
    "song themes",
    "presentation slides",
    "music technology",
    "AI music tools",
    "song interpretation",
    "music presentation",
  ],
  authors: [{ name: "Song Sculpt Team" }],
  creator: "Song Sculpt",
  publisher: "Song Sculpt",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://songsculpt.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Song Sculpt - AI-Powered Song Analysis & Presentation Generator",
    description:
      "Transform any song into a professional presentation with AI-powered analysis. Generate slides with lyrics, themes, and insights automatically.",
    url: "https://songsculpt.com",
    siteName: "Song Sculpt",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Song Sculpt - AI-Powered Song Analysis",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Song Sculpt - AI-Powered Song Analysis & Presentation Generator",
    description:
      "Transform any song into a professional presentation with AI-powered analysis. Generate slides with lyrics, themes, and insights automatically.",
    images: ["/og-image.png"],
    creator: "@songsculpt",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "music technology",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <Script
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
        />
        <Script
          id="gtag-init"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
          window.dataLayer = window.dataLayer || [];
          function gtag() {dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
            page_path: window.location.pathname,
          });
        `,
          }}
        />

        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
          <meta name="theme-color" content="#000000" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <meta name="apple-mobile-web-app-status-bar-style" content="default" />
          <meta name="apple-mobile-web-app-title" content="Song Sculpt" />
          <meta name="application-name" content="Song Sculpt" />
          <meta name="msapplication-TileColor" content="#000000" />
          <meta name="msapplication-config" content="/browserconfig.xml" />
          <link rel="icon" href="/favicon.ico" />
          <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
          <link rel="manifest" href="/manifest.json" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
          <link
            href="https://fonts.googleapis.com/css2?family=Faculty+Glyphic&family=Pacifico&display=swap"
            rel="stylesheet"
          />
        </head>
        <body>
          <Navbar />
          {children}
          <Footer />
          <Toaster position="bottom-right" />
          <Analytics />
        </body>
      </html>
    </ReactQueryProvider>
  );
}
