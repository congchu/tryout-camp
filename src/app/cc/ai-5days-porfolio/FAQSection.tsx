'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FAQ_ITEMS } from './variables'

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
