'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

const FAQ_ITEMS = [
  { q: '코딩/디자인 못해도 되나요?', a: '네! AI가 다 해줘요. 복붙만 하면 됩니다.' },
  { q: '하루에 얼마나 시간 써야 하나요?', a: '30분이면 충분해요. 커피 한 잔 마시면서 하면 딱!' },
  { q: '어떻게 진행되나요?', a: '슬랙 채널에서 소통해요. 질문하면 바로 답변 드려요!' },
  { q: '보증금은 어떻게 돌려받나요?', a: '5일 미션 다 완료하면 100% 돌려드려요. 도망 못 가게 하는 장치예요 😉' },
  { q: '뒷풀이 겸 축하모임 꼭 참석해야 하나요?', a: '필수는 아니에요! 하지만 오시면 맥주도 마시고 네트워킹도 하고 🍻' },
  { q: '추가 비용이 있나요?', a: '사용하는 AI툴에 따라 비용이 필요할 수 있어요. 3~5만원 정도 생각하시면 좋아요. 챌린지 시작 시 안내드릴게요!' },
  { q: '챌린지 끝나고도 사이트 유지되나요?', a: '네! 평생 무료로 유지돼요. 도메인 연결하면 더 멋져요.' },
]

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const pointFont = { fontFamily: "'KyoboHandwriting2019', sans-serif" }

export default function FAQSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <section className="px-6 py-16 bg-[#c8ff00] min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
      <motion.div
        className="max-w-2xl mx-auto w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={stagger}
      >
        <motion.h2
          variants={fadeInUp}
          className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-10 text-gray-900"
          style={pointFont}
        >
          자주 묻는 질문
        </motion.h2>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, i) => (
            <motion.div
              key={i}
              variants={fadeInUp}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-4 py-2 md:p-5 flex items-center justify-between text-left"
              >
                <p className="font-black text-lg text-gray-900">Q. {item.q}</p>
                <motion.span
                  animate={{ rotate: openFaq === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-2xl text-black/40"
                >
                  ▾
                </motion.span>
              </button>
              <motion.div
                initial={false}
                animate={{
                  height: openFaq === i ? 'auto' : 0,
                  opacity: openFaq === i ? 1 : 0,
                }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <p className="px-5 pb-5 text-gray-600">{item.a}</p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  )
}
