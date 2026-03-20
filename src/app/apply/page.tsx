'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  buttons?: { label: string; value: string }[]
}

interface CollectedData {
  name?: string
  email?: string
  contact?: string
  job?: string
  motivation?: string
}

type Step = 'intro' | 'name' | 'email' | 'contact' | 'job' | 'motivation' | 'confirm' | 'done'

const pointFont = { fontFamily: "'KyoboHandwriting2019', sans-serif" }

export default function AI5DayApplyPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<Step>('intro')
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const hasSentInitial = useRef(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const sendMessage = useCallback(async (userMessage: string, currentMessages: Message[], currentData: CollectedData) => {
    const newMessages: Message[] = [
      ...currentMessages,
      { role: 'user' as const, content: userMessage },
    ]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      const res = await fetch('/api//chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          collectedData: currentData,
        }),
      })

      if (!res.ok) throw new Error('Chat API error')

      const data = await res.json()

      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply,
        buttons: data.buttons?.length > 0 ? data.buttons : undefined,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStep(data.step)
      setCollectedData(data.collectedData)

      if (data.step === 'done') {
        await handleSubmit(data.collectedData)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: '앗, 문제가 생겼어요 😅\n다시 한 번 말씀해주세요!',
        },
      ])
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [])

  // Initial greeting (hardcoded, 4 messages sequentially)
  useEffect(() => {
    if (hasSentInitial.current) return
    hasSentInitial.current = true

    const introMessages: Message[] = [
      {
        role: 'assistant',
        content: `안녕하세요! 문어쌤입니다 🐙\n크크웍스 × 실험마켓 AI 5일 챌린지에 오신 걸 환영해요!`,
      },
      {
        role: 'assistant',
        content: `이 챌린지는 포트폴리오 없는 프리랜서 분들을 위해 준비했어요.\n5일 동안 AI를 활용해 나만의 포트폴리오를 완성할 수 있답니다.`,
      },
      {
        role: 'assistant',
        content: `매일 미션을 완료하면 보증금 3만원 100% 환급해 드리고,\nAI 사용법부터 포트폴리오 완성까지 차근차근 안내해 드릴게요.\n슬랙 동료들과 함께 소통하며 즐겁게 완주해 보세요.`,
      },
      {
        role: 'assistant',
        content: `신청하시겠어요?`,
        buttons: [
          { label: '네 좋아요', value: '네 좋아요' },
          { label: '아니요', value: '아니요' },
        ],
      },
    ]

    const timers: NodeJS.Timeout[] = []
    introMessages.forEach((msg, idx) => {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, msg])
        if (idx === introMessages.length - 1) {
          setTimeout(() => inputRef.current?.focus(), 100)
        }
      }, idx * 1000)
      timers.push(timer)
    })

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  const handleSubmit = async (finalData: CollectedData) => {
    setIsSubmitting(true)
    try {
      await fetch('/api//submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...finalData,
          appliedAt: new Date().toISOString(),
        }),
      })
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
      setIsDone(true)
    }
  }

  const handleSend = () => {
    if (!input.trim() || isLoading || isDone) return
    const userMsg = input.trim()
    setInput('')
    sendMessage(userMsg, messages, collectedData)
  }

  const handleButtonClick = (value: string) => {
    if (isLoading || isDone) return

    if (step === 'confirm' && value === 'confirm') {
      sendMessage('네, 맞아요! 신청할게요!', messages, collectedData)
    } else {
      sendMessage(value, messages, collectedData)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col" style={pointFont}>
      {/* Fonts */}
      <style>{`
        @font-face {
          font-family: 'KyoboHandwriting2019';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link
            href="/"
            className="text-white/60 hover:text-white transition-colors"
          >
            ← 뒤로
          </Link>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Image src="/nozy-happy.png" alt="문어쌤" width={32} height={32} className="w-8 h-8" />
            <h1 className="text-[#c8ff00] font-black text-lg">문어쌤과 신청하기</h1>
          </div>
          <div className="w-10" /> {/* spacer */}
        </div>
      </header>

      {/* Progress bar */}
      <div className="bg-white/5">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c8ff00] rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width:
                  step === 'intro'
                    ? '5%'
                    : step === 'name'
                      ? '15%'
                      : step === 'email'
                        ? '30%'
                        : step === 'contact'
                          ? '45%'
                          : step === 'job'
                            ? '60%'
                            : step === 'motivation'
                              ? '75%'
                              : step === 'confirm'
                                ? '90%'
                                : '100%',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <AnimatePresence mode="popLayout">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex-shrink-0 mr-2 mt-1">
                    <Image src="/nozy-happy.png" alt="문어쌤" width={36} height={36} className="w-9 h-9" />
                  </div>
                )}
                <div className="flex flex-col max-w-[80%]">
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-[#c8ff00] text-black'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-base whitespace-pre-wrap leading-relaxed">
                      {msg.content}
                    </p>
                  </div>

                  {/* Buttons */}
                  {msg.role === 'assistant' &&
                    msg.buttons &&
                    msg.buttons.length > 0 &&
                    i === messages.length - 1 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="flex flex-wrap gap-2 mt-3"
                      >
                        {msg.buttons.map((btn, btnIdx) => (
                          <button
                            key={btnIdx}
                            onClick={() => handleButtonClick(btn.value)}
                            disabled={isLoading}
                            className="bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#c8ff00]/20 transition-colors disabled:opacity-50"
                          >
                            {btn.label}
                          </button>
                        ))}
                      </motion.div>
                    )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex-shrink-0 mr-2 mt-1">
                <Image src="/nozy-happy.png" alt="문어쌤" width={36} height={36} className="w-9 h-9" />
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 bg-[#c8ff00] rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Done message */}
          {isDone && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="bg-[#c8ff00]/10 border border-[#c8ff00]/30 rounded-2xl p-6 inline-block">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-[#c8ff00] font-black text-xl mb-2">
                  신청 완료!
                </p>
                <p className="text-white/60 text-sm mb-1">
                  보증금 3만원 입금 후 참여가 확정됩니다
                </p>
                <div className="bg-white/10 rounded-xl p-4 mt-4 text-left">
                  <p className="text-[#c8ff00] font-bold text-sm mb-2">💰 보증금 입금 안내</p>
                  <p className="text-white text-sm">카카오뱅크 3333-25-5765032</p>
                  <p className="text-white text-sm">예금주: 정쿠</p>
                  <p className="text-white/60 text-xs mt-2">
                    * 입금자명을 신청자 이름으로 해주세요
                  </p>
                  <p className="text-white/60 text-xs">
                    * 5일 미션 완료 시 100% 환급됩니다
                  </p>
                </div>
                <Link
                  href="/"
                  className="inline-block mt-4 bg-[#c8ff00] text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  돌아가기
                </Link>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      {!isDone && (
        <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm border-t border-white/10 px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                step === 'confirm'
                  ? '위 버튼을 눌러주세요...'
                  : '메시지를 입력하세요...'
              }
              disabled={isLoading || isSubmitting}
              className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-full px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#c8ff00]/50 disabled:opacity-50"
              style={pointFont}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || isSubmitting}
              className="bg-[#c8ff00] text-black w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl hover:scale-105 transition-transform disabled:opacity-30 disabled:hover:scale-100 flex-shrink-0"
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
