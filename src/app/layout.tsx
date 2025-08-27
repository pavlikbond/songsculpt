import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Script from "next/script";
import { Analytics } from "@vercel/analytics/react";
import { ReactQueryProvider } from "./contexts/react-query";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Song Sculpt",
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

        <body className={inter.className}>
          {" "}
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
