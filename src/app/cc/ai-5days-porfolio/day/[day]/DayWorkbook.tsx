'use client'

import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'
import { DAYS_CONTENT, type ContentBlock } from './content'
import AIMissionHelper from '@/components/AIMissionHelper'

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
      className="absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer bg-orange-100 text-orange-600 hover:bg-orange-200"
    >
      {copied ? '복사됨!' : '복사'}
    </button>
  )
}

function CheckboxItem({ label, storageKey }: { label: string; storageKey: string }) {
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'true') setChecked(true)
  }, [storageKey])

  const toggle = () => {
    const next = !checked
    setChecked(next)
    localStorage.setItem(storageKey, String(next))
  }

  return (
    <label className="flex items-start gap-3 cursor-pointer group" onClick={toggle}>
      <span
        className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
          checked
            ? 'bg-green-500 border-green-500'
            : 'border-gray-300 bg-white group-hover:border-orange-400'
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <span className={`text-sm leading-relaxed ${checked ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
        {label}
      </span>
    </label>
  )
}

function InputField({ label, placeholder, storageKey }: { label: string; placeholder?: string; storageKey: string }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) setValue(saved)
  }, [storageKey])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
    localStorage.setItem(storageKey, e.target.value)
  }

  return (
    <div className="mt-2">
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || '여기에 입력하세요...'}
        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 bg-white transition-colors"
      />
    </div>
  )
}

function ContentRenderer({ block, dayNum, stepIndex, blockIndex }: { block: ContentBlock; dayNum: number; stepIndex: number; blockIndex: number }) {
  const keyPrefix = `workbook-d${dayNum}-s${stepIndex}-b${blockIndex}`

  switch (block.type) {
    case 'text':
      return <p className="text-[0.9375rem] text-gray-600 leading-relaxed">{block.value}</p>
    case 'prompt':
      return (
        <div className="relative bg-gray-50 border border-gray-200 rounded-xl p-4 pr-20 mt-2">
          <CopyButton text={block.value} />
          <pre className="text-gray-700 text-sm whitespace-pre-wrap font-mono leading-relaxed">
            {block.value}
          </pre>
        </div>
      )
    case 'list':
      return (
        <ul className="space-y-2 mt-2">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-gray-600 text-[0.9375rem]">
              <span className="text-orange-400 mt-0.5 flex-shrink-0">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )
    case 'tip':
      return (
        <div className="mt-3 border-l-4 border-orange-300 bg-orange-50 rounded-r-lg px-5 py-4">
          <p className="text-orange-900 text-sm font-medium">💡 {block.value}</p>
        </div>
      )
    case 'input':
      return (
        <InputField
          label={block.label}
          placeholder={block.placeholder}
          storageKey={`${keyPrefix}-input`}
        />
      )
    case 'checkbox':
      return (
        <div className="space-y-2.5 mt-2">
          {block.items.map((item, i) => (
            <CheckboxItem
              key={i}
              label={item}
              storageKey={`${keyPrefix}-cb-${i}`}
            />
          ))}
        </div>
      )
  }
}

function StepCard({
  step,
  stepIndex,
  dayNum,
  totalSteps,
}: {
  step: { title: string; duration: string; content: ContentBlock[] }
  stepIndex: number
  dayNum: number
  totalSteps: number
}) {
  const storageKey = `workbook-d${dayNum}-step-${stepIndex}-done`
  const [done, setDone] = useState(false)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'true') {
      setDone(true)
      setCollapsed(true)
    }
  }, [storageKey])

  const toggleDone = useCallback(() => {
    const next = !done
    setDone(next)
    localStorage.setItem(storageKey, String(next))
    if (next) setCollapsed(true)
  }, [done, storageKey])

  return (
    <motion.div
      variants={fadeInUp}
      className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      {/* Step 헤더 — 클릭으로 접기/펼치기 */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="w-full flex items-center gap-3 p-5 md:p-6 text-left cursor-pointer hover:bg-gray-50/50 transition-colors"
      >
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-black flex-shrink-0 transition-colors ${
            done ? 'bg-green-500 text-white' : 'bg-orange-500 text-white'
          }`}
        >
          {done ? (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8L6.5 11.5L13 4.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            stepIndex + 1
          )}
        </span>
        <div className="flex-1 min-w-0">
          <h2 className={`text-lg font-bold ${done ? 'text-gray-400' : 'text-gray-800'}`}>
            {step.title}
          </h2>
        </div>
        <span className="text-gray-400 text-sm flex-shrink-0 mr-2">{step.duration}</span>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${collapsed ? '' : 'rotate-180'}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Step 콘텐츠 */}
      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 space-y-3 border-t border-gray-100 pt-4">
              {step.content.map((block, blockIndex) => (
                <ContentRenderer
                  key={blockIndex}
                  block={block}
                  dayNum={dayNum}
                  stepIndex={stepIndex}
                  blockIndex={blockIndex}
                />
              ))}

              {/* Step 완료 토글 */}
              <div className="pt-3 mt-3 border-t border-gray-100">
                <label
                  className="flex items-center gap-2 cursor-pointer group"
                  onClick={(e) => { e.stopPropagation(); toggleDone() }}
                >
                  <span
                    className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border transition-colors ${
                      done
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 bg-white group-hover:border-orange-400'
                    }`}
                  >
                    {done && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2.5 6L5 8.5L9.5 3.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm font-medium ${done ? 'text-green-600' : 'text-gray-500'}`}>
                    Step {stepIndex + 1} 완료{done ? '!' : ''}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function DayWorkbook({ day }: { day: string }) {
  const router = useRouter()
  const dayNum = Number(day)
  const [desktopOpen, setDesktopOpen] = useState(false)

  const dayData = DAYS_CONTENT.find((d) => d.day === dayNum)

  if (!dayData) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <p className="text-gray-800 text-xl">존재하지 않는 Day입니다.</p>
      </div>
    )
  }

  const prevDay = dayNum > 1 ? dayNum - 1 : null
  const nextDay = dayNum < 5 ? dayNum + 1 : null
  const progress = (dayNum / 5) * 100

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* 상단 헤더 */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={() => router.push('/cc/ai-5days-porfolio')}
              className="text-gray-500 hover:text-gray-800 text-sm flex items-center gap-1 transition-colors cursor-pointer"
            >
              ← 목록
            </button>
            <span className="text-gray-400 text-sm font-medium">
              Day {dayNum} / 5
            </span>
          </div>
          {/* 진행 바 */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-orange-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            />
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <div className="flex justify-center">
        <main className={`w-full max-w-2xl px-4 py-8 transition-all ${desktopOpen ? 'md:mr-[380px]' : ''}`}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            {/* Day 타이틀 */}
            <motion.div variants={fadeInUp} className="mb-10">
              <div className="flex items-center gap-3 mb-3">
                <span className="bg-orange-500 text-white text-sm font-black px-3 py-1 rounded-full">
                  Day {dayData.day}
                </span>
                <span className="text-gray-400 text-sm">{dayData.totalTime}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
                {dayData.emoji} {dayData.title}
              </h1>
            </motion.div>

            {/* Steps */}
            <div className="space-y-4">
              {dayData.steps.map((step, stepIndex) => (
                <StepCard
                  key={stepIndex}
                  step={step}
                  stepIndex={stepIndex}
                  dayNum={dayNum}
                  totalSteps={dayData.steps.length}
                />
              ))}
            </div>

            {/* 미션 완료 조건 */}
            <motion.div
              variants={fadeInUp}
              className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-5 md:p-6"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl flex-shrink-0">📌</span>
                <div>
                  <h3 className="text-lg font-black text-gray-800 mb-1">
                    오늘의 미션 완료 조건
                  </h3>
                  <p className="text-orange-900 font-medium text-[0.9375rem]">{dayData.mission}</p>
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
                <h3 className="text-2xl font-black text-orange-500 mb-2">
                  챌린지 완료! 축하합니다!
                </h3>
                <p className="text-gray-500">
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
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-4 text-left transition-colors cursor-pointer shadow-sm"
                >
                  <span className="text-gray-400 text-xs block mb-1">← 이전</span>
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
                  className="flex-1 bg-white hover:bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-4 text-right transition-colors cursor-pointer shadow-sm"
                >
                  <span className="text-gray-400 text-xs block mb-1">다음 →</span>
                  <span className="font-bold text-sm">
                    Day {nextDay}: {DAYS_CONTENT[nextDay - 1].title}
                  </span>
                </button>
              ) : (
                <button
                  onClick={() => router.push('/cc/ai-5days-porfolio')}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-4 py-4 text-center transition-colors cursor-pointer font-bold shadow-sm"
                >
                  챌린지 메인으로 돌아가기
                </button>
              )}
            </motion.div>
          </motion.div>
        </main>
      </div>

      {/* 하단 여백 */}
      <div className="h-20" />

      {/* AI 미션 도우미 */}
      <AIMissionHelper
        desktopOpen={desktopOpen}
        setDesktopOpen={setDesktopOpen}
        day={dayData.day}
        missionTitle={dayData.title}
        missionContent={dayData.steps.map((s) => s.title).join(', ') + ' → 미션: ' + dayData.mission}
      />
    </div>
  )
}
