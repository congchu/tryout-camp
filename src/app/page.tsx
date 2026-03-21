'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

// 챌린지 목록 데이터
const CHALLENGES = [
  {
    id: 'ai-5days-porfolio',
    slug: '/cc/ai-5days-porfolio',
    emoji: '✨',
    title: '포폴 없는 프리랜서 구출 챌린지',
    subtitle: '5일 만에 AI로 포트폴리오 만들기',
    status: 'open', // open, coming, closed
    date: '3/28 ~ 4/1',
    price: '1만 5천원 (결과물 제출 시 환급)',
    tags: ['AI', '포트폴리오', '5일'],
  },
  {
    id: 'coming-soon-1',
    slug: '#',
    emoji: '🚀',
    title: '다음 챌린지 준비 중...',
    subtitle: '곧 만나요!',
    status: 'coming',
    date: 'TBD',
    price: '',
    tags: [],
  },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
}

export default function ChallengeListPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#f7f7f7]" style={{ fontFamily: "'Pretendard', sans-serif" }}>
      {/* Fonts */}
      <style>{`
        @import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');
      `}</style>

      {/* 실험마켓 캠프 */}
      <header className="px-6 py-12 text-center border-b border-black/5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="max-w-2xl mx-auto"
        >
          <span className="text-4xl mb-3 inline-block">📦</span>
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
            실험마켓 캠프
          </h1>
          <p className="text-gray-500">
            함께 도전하고, 함께 완주하는 챌린지
          </p>
        </motion.div>
      </header>

      {/* Challenge List */}
      <main className="max-w-2xl mx-auto px-6 py-12">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="space-y-6"
        >
          {CHALLENGES.map((challenge) => (
            <motion.div
              key={challenge.id}
              variants={fadeInUp}
              onClick={() => challenge.status === 'open' && router.push(challenge.slug)}
              className={`
                relative rounded-2xl p-6 transition-all
                ${challenge.status === 'open'
                  ? 'bg-white hover:bg-gray-50 cursor-pointer border border-gray-200 hover:border-[#ff6633]/50 shadow-sm hover:shadow-md'
                  : 'bg-gray-100 border border-gray-200 opacity-60'
                }
              `}
              whileHover={challenge.status === 'open' ? { scale: 1.02 } : {}}
            >
              {/* Status Badge */}
              {challenge.status === 'open' && (
                <span className="absolute -top-3 right-6 bg-[#ff6633] text-white text-xs font-bold px-3 py-1 rounded-full">
                  모집중
                </span>
              )}
              {challenge.status === 'coming' && (
                <span className="absolute -top-3 right-6 bg-gray-300 text-gray-600 text-xs font-bold px-3 py-1 rounded-full">
                  준비중
                </span>
              )}

              <div className="flex items-start gap-4">
                {/* Emoji */}
                <span
                  className="text-5xl flex-shrink-0"
                  style={{ filter: challenge.status === 'coming' ? 'grayscale(1)' : 'none' }}
                >
                  {challenge.emoji}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
                    {challenge.title}
                  </h2>
                  <p className="text-gray-500 text-sm mb-3">
                    {challenge.subtitle}
                  </p>

                  {challenge.status === 'open' && (
                    <>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {challenge.tags.map((tag) => (
                          <span
                            key={tag}
                            className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Info */}
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-[#ff6633] font-medium">📅 {challenge.date}</span>
                        <span className="text-gray-400">{challenge.price}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Arrow */}
                {challenge.status === 'open' && (
                  <span className="text-[#ff6633] text-2xl flex-shrink-0">
                    →
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 px-6 py-8 text-center">
        <p className="text-gray-400 text-sm">
          실험마켓 | 문의: cookie00421@gmail.com
        </p>
      </footer>
    </div>
  )
}
