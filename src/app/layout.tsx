import type { Metadata } from 'next';
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '아이보틀(Eyebottle) - 안과 진료를 혁신하는 AI 웹사이트',
  description:
    '반복 진료 작업을 AI로 3배 빠르게! 문서작업과 데이터 시각화를 한 곳에서. 안과 전문의를 위한 혁신적인 AI 도구입니다.',
  keywords:
    '아이보틀, 안과, AI, 진료, 자동화, 네컷안과툰, 진단서, 근시진행트래커',
  authors: [{ name: '아이보틀 팀' }],
  openGraph: {
    title: '아이보틀(Eyebottle) - 안과 진료 AI 혁신',
    description:
      '반복 진료 작업을 AI로 3배 빠르게! 안과 전문의를 위한 혁신적인 도구',
    type: 'website',
    images: [
      {
        url: '/assets/logos/eyebottle-logo.png',
        width: 1200,
        height: 630,
        alt: '아이보틀 로고',
      },
    ],
  },
  icons: {
    icon: '/assets/logos/eyebottle-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko" suppressHydrationWarning={true}>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning={true}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
