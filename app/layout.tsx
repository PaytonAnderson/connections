// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Connections - NYT Clone",
  description: "A clone of the New York Times Connections game.",
  metadataBase: new URL('https://nytconnections.vercel.app'), // Set base URL for resolving images
  openGraph: {
    title: "Connections - NYT Clone",
    description: "A clone of the New York Times Connections game.",
    images: [
      {
        url: "/logo.jfif", // Path relative to the base URL
        width: 1200,
        height: 630,
        alt: "Connections Logo",
      },
    ],
    url: "https://nytconnections.vercel.app", // Your full website URL
  },
  twitter: {
    title: "Connections - NYT Clone",
    description: "A clone of the New York Times Connections game.",
    images: [
      {
        url: "/logo.jfif", // Path relative to the base URL
        width: 1200,
        height: 630,
        alt: "Connections Logo",
      },
    ],
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
