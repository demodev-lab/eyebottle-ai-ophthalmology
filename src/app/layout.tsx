import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "아이보틀(Eyebottle) - 안과 진료를 혁신하는 AI 웹사이트",
    template: "%s | 아이보틀(Eyebottle)"
  },
  description: "반복 진료 작업을 AI로 3배 빠르게! 문서작업과 데이터 시각화를 한 곳에서. 안과 전문의를 위한 혁신적인 AI 도구입니다. 네컷안과툰, 진단서 작성, 근시진행트래커 등 다양한 기능을 제공합니다.",
  keywords: [
    "아이보틀", 
    "Eyebottle", 
    "안과", 
    "AI", 
    "진료", 
    "자동화", 
    "네컷안과툰", 
    "진단서", 
    "근시진행트래커",
    "의료 AI",
    "안과 의사",
    "진료 효율화",
    "의료 자동화",
    "데이터 시각화"
  ],
  authors: [{ name: "아이보틀 팀", url: "https://eyebottle.com" }],
  creator: "아이보틀 팀",
  publisher: "아이보틀",
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
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: {
      'naver-site-verification': process.env.NAVER_SITE_VERIFICATION || '',
    },
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "https://eyebottle.com",
    siteName: "아이보틀(Eyebottle)",
    title: "아이보틀(Eyebottle) - 안과 진료 AI 혁신",
    description: "반복 진료 작업을 AI로 3배 빠르게! 안과 전문의를 위한 혁신적인 도구. 네컷안과툰, 진단서 작성, 근시진행트래커 등 다양한 기능을 제공합니다.",
    images: [
      {
        url: "/eyebottle-logo.png",
        width: 1200,
        height: 630,
        alt: "아이보틀(Eyebottle) - 안과 진료 AI 도구",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "아이보틀(Eyebottle) - 안과 진료 AI 혁신",
    description: "반복 진료 작업을 AI로 3배 빠르게! 안과 전문의를 위한 혁신적인 도구",
    images: ["/eyebottle-logo.png"],
    creator: "@eyebottle",
    site: "@eyebottle",
  },
  icons: {
    icon: "/eyebottle-logo.png",
    apple: "/eyebottle-logo.png",
    shortcut: "/eyebottle-logo.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://eyebottle.com",
    languages: {
      'ko-KR': 'https://eyebottle.com',
    },
  },
  category: "healthcare",
  classification: "Medical AI Software",
  other: {
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'format-detection': 'telephone=no',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 구조화된 데이터 (JSON-LD)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "아이보틀(Eyebottle)",
    "description": "반복 진료 작업을 AI로 3배 빠르게! 안과 전문의를 위한 혁신적인 AI 도구. 네컷안과툰, 진단서 작성, 근시진행트래커 등 다양한 기능을 제공합니다.",
    "url": "https://eyebottle.com",
    "applicationCategory": "HealthApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "KRW",
      "availability": "https://schema.org/InStock"
    },
    "creator": {
      "@type": "Organization",
      "name": "아이보틀 팀",
      "url": "https://eyebottle.com"
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": "https://eyebottle.com"
    },
    "image": "https://eyebottle.com/eyebottle-logo.png",
    "screenshot": "https://eyebottle.com/eyebottle-logo.png",
    "featureList": [
      "네컷안과툰 생성",
      "진단서 자동 작성",
      "근시진행트래커",
      "데이터 시각화",
      "AI 기반 진료 자동화"
    ],
    "softwareVersion": "1.2",
    "datePublished": "2023-04-01",
    "dateModified": "2023-05-01",
    "inLanguage": "ko-KR",
    "audience": {
      "@type": "ProfessionalAudience",
      "audienceType": "안과 전문의"
    }
  };

  return (
    <html lang="ko">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
