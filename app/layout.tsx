import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { url } from "inspector";
import Script from "next/script";

const geistSans = Poppins({
  subsets: ["latin"],
  variable: "--font-geist-sans",
  weight: ["400", "500", "600", "700"],
});

const baseUrl = "https://countdown-timer-app.example.com";

export const metadata: Metadata = {
  title: "Countdown Timer | Advanced Timer App",
  description:
    "A feature-rich countdown timer app with customizable settings, themes, and notifications to help you manage your time effectively.",
  openGraph: {
    title: "Countdown Timer | Advanced Timer App",
    description:
      "A feature-rich countdown timer app with customizable settings, themes, and notifications to help you manage your time effectively.",
    url: baseUrl,
    siteName: "Countdown Timer",
    images: [
      {
        url: `${baseUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Countdown Timer App",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Countdown Timer | Advanced Timer App",
    description:
      "A feature-rich countdown timer app with customizable settings, themes, and notifications to help you manage your time effectively.",
    images: [`${baseUrl}/og-image.png`],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  authors: [
    {
      name: "Muhammad Sheraz",
      url: "https://sherazportfolio.vercel.app/",
    },
  ],
  alternates: {
    canonical: baseUrl,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Countdown Timer",
  url: baseUrl,
  description:
    "A feature-rich countdown timer app with customizable settings, themes, and notifications to help you manage your time effectively.",
  applicationCategory: "ProductivityApplication",
  operatingSystem: "All",
  image: `${baseUrl}/og-image.png`,
  datepublished: "2025-10-20",
  author: "Muhammad Sheraz",
  publisher: "Muhammad Sheraz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} antialiased`}>{children}</body>
      <Script
        id="json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </html>
  );
}
