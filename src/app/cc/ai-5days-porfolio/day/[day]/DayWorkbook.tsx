'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { DAYS_CONTENT, type ContentBlock } from './content'

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.08 } },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-[#c8ff00]/20 text-[#c8ff00] hover:bg-[#c8ff00]/30"
    >
      {copied ? '복사됨!' : '복사'}
    </button>
  )
}

function ContentRenderer({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case 'text':
      return <p className="text-white/80 leading-relaxed">{block.value}</p>
    case 'prompt':
      return (
        <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 pr-20 mt-2">
          <CopyButton text={block.value} />
          <pre className="text-[#c8ff00]/90 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {block.value}
          </pre>
        </div>
      )
    case 'list':
      return (
        <ul className="space-y-2 mt-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70">
              <span className="text-[#c8ff00] mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <div className="mt-3 bg-[#c8ff00]/10 border border-[#c8ff00]/20 rounded-xl px-4 py-3">
          <p className="text-[#c8ff00] text-sm font-medium">💡 {block.value}</p>
        </div>
      )
  }
}

export default function DayWorkbook({ day }: { day: string }) {
  const router = useRouter()
  const dayNum = Number(day)

  const dayData = DAYS_CONTENT.find((d) => d.day === dayNum)

  if (!dayData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-white text-xl">존재하지 않는 Day입니다.</p>
      </div>
    )
  }

  const prevDay = dayNum > 1 ? dayNum - 1 : null
  const nextDay = dayNum < 5 ? dayNum + 1 : null
  const progress = (dayNum / 5) * 100

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @font-face {
          font-family: 'KyoboHandwriting2019';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      {/* 상단 헤더 */}
      <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/10">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push('/cc/ai-5days-porfolio')}
              className="text-white/60 hover:text-white text-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              ← 챌린지 메인
            </button>
            <span className="text-white/40 text-sm font-medium">
              Day {dayNum} / 5
            </span>
          </div>
          {/* 진행 바 */}
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c8ff00] rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          {/* Day 타이틀 */}
          <motion.div variants={fadeInUp} className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-[#c8ff00] text-black text-sm font-black px-3 py-1 rounded-full">
                Day {dayData.day}
              </span>
              <span className="text-white/40 text-sm">{dayData.totalTime}</span>
            </div>
            <h1
              className="text-3xl md:text-4xl font-black text-white leading-tight"
              style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}
            >
              {dayData.emoji} {dayData.title}
            </h1>
          </motion.div>

          {/* Steps */}
          <div className="space-y-6">
            {dayData.steps.map((step, stepIndex) => (
              <motion.div
                key={stepIndex}
                variants={fadeInUp}
                className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 md:p-6"
              >
                {/* Step 헤더 */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="bg-[#c8ff00] text-black w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0">
                    {stepIndex + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-white">{step.title}</h2>
                  </div>
                  <span className="text-white/30 text-sm flex-shrink-0">{step.duration}</span>
                </div>

                {/* Step 콘텐츠 */}
                <div className="space-y-3 pl-11">
                  {step.content.map((block, blockIndex) => (
                    <ContentRenderer key={blockIndex} block={block} />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* 미션 완료 조건 */}
          <motion.div
            variants={fadeInUp}
            className="mt-8 bg-[#c8ff00] rounded-2xl p-5 md:p-6"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl flex-shrink-0">📌</span>
              <div>
                <h3
                  className="text-lg font-black text-black mb-1"
                  style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}
                >
                  오늘의 미션 완료 조건
                </h3>
                <p className="text-black/80 font-medium">{dayData.mission}</p>
              </div>
            </div>
          </motion.div>

          {/* Day 5 완료 메시지 */}
          {dayNum === 5 && (
            <motion.div
              variants={fadeInUp}
              className="mt-6 text-center py-8"
            >
              <motion.p
                className="text-4xl mb-3"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                🎉
              </motion.p>
              <h3
                className="text-2xl font-black text-[#c8ff00] mb-2"
                style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}
              >
                챌린지 완료! 축하합니다!
              </h3>
              <p className="text-white/60">
                5일 동안 고생 많았어요. 이제 나만의 포트폴리오가 세상에 나왔습니다!
              </p>
            </motion.div>
          )}

          {/* 네비게이션 */}
          <motion.div
            variants={fadeInUp}
            className="mt-10 flex items-center justify-between gap-4"
          >
            {prevDay ? (
              <button
                onClick={() => router.push(`/cc/ai-5days-porfolio/day/${prevDay}`)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-4 text-left transition-colors cursor-pointer"
              >
                <span className="text-white/40 text-xs block mb-1">← 이전</span>
                <span className="font-bold text-sm">
                  Day {prevDay}: {DAYS_CONTENT[prevDay - 1].title}
                </span>
              </button>
            ) : (
              <div className="flex-1" />
            )}
            {nextDay ? (
              <button
                onClick={() => router.push(`/cc/ai-5days-porfolio/day/${nextDay}`)}
                className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl px-4 py-4 text-right transition-colors cursor-pointer"
              >
                <span className="text-white/40 text-xs block mb-1">다음 →</span>
                <span className="font-bold text-sm">
                  Day {nextDay}: {DAYS_CONTENT[nextDay - 1].title}
                </span>
              </button>
            ) : (
              <button
                onClick={() => router.push('/cc/ai-5days-porfolio')}
                className="flex-1 bg-[#c8ff00] hover:bg-[#d4ff33] text-black rounded-xl px-4 py-4 text-center transition-colors cursor-pointer font-bold"
              >
                챌린지 메인으로 돌아가기
              </button>
            )}
          </motion.div>
        </motion.div>
      </main>

      {/* 하단 여백 */}
      <div className="h-20" />
    </div>
  )
}
