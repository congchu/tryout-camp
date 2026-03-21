'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
      `}</style>

      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-6xl mb-4 inline-block">🤔</span>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-3">
            404
          </h1>
          <p className="text-gray-500 mb-8">
            페이지를 찾을 수 없어요
          </p>
          <Link
            href="/"
            className="inline-block bg-[#ff6633] text-white font-bold px-6 py-3 rounded-full hover:bg-[#e55a2d] transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </motion.div>
      </main>

      <footer className="border-t border-black/5 px-6 py-8 text-center">
        <p className="text-gray-400 text-sm">
          실험마켓 | 문의: cookie00421@gmail.com
        </p>
      </footer>
    </div>
  )
}
