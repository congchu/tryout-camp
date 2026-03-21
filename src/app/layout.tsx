import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 5일 챌린지 | 크크웍스 × 실험마켓',
  description: '포폴 없는 프리랜서를 구출하라~~ 💕',
  openGraph: {
    title: 'AI 5일 챌린지 | 크크웍스 × 실험마켓',
    description: '포폴 없는 프리랜서를 구출하라~~ 💕',
    type: 'website',
    images: [
      {
        url: '/cc/og-image.png',
        width: 1200,
        height: 600,
      },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
