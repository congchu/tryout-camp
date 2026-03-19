import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI 5일 챌린지 | 크크웍스 × 실험마켓',
  description: '5일 만에 AI로 포트폴리오 만들기! 크크웍스와 실험마켓이 함께하는 프리랜서 구출 챌린지',
  openGraph: {
    title: 'AI 5일 챌린지 | 크크웍스 × 실험마켓',
    description: '5일 만에 AI로 포트폴리오 만들기!',
    type: 'website',
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
