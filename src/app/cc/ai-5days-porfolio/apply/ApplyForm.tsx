'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

interface Message {
  role: 'user' | 'assistant'
  content: string
  buttons?: { label: string; value: string }[]
  multiSelect?: boolean
}

interface CollectedData {
  name?: string
  email?: string
  contact?: string
  job?: string
  aiTools?: string[]
  aiLevel?: string
  motivation?: string
}

type Step = 'intro' | 'name' | 'email' | 'contact' | 'job' | 'aiTools' | 'aiLevel' | 'motivation' | 'confirm' | 'done'

const pointFont = { fontFamily: "'KyoboHandwriting2019', sans-serif" }

const FLOW: Record<Step, { message: string; buttons?: { label: string; value: string }[]; multiSelect?: boolean; inputType?: 'text' | 'email' }> = {
  intro: {
    message: '',
    buttons: [
      { label: '좋아요!', value: 'yes' },
      { label: '음... 아뇨', value: 'no' },
    ],
  },
  name: {
    message: '반가워요! 이름이 뭐예요? 😊',
    inputType: 'text',
  },
  email: {
    message: '슬랙 초대 보내드릴 이메일 주소 알려주세요! 📧',
    inputType: 'email',
  },
  contact: {
    message: '카카오톡 ID나 전화번호도 알려주세요! 📱\n(긴급 연락용이에요)',
    inputType: 'text',
  },
  job: {
    message: '어떤 일 하세요? 🧑‍💻',
    buttons: [
      { label: '디자이너', value: '디자이너' },
      { label: '개발자', value: '개발자' },
      { label: '기획자', value: '기획자' },
      { label: '마케터', value: '마케터' },
      { label: '영상편집자', value: '영상편집자' },
      { label: '작가', value: '작가' },
      { label: '기타', value: '기타' },
    ],
  },
  aiTools: {
    message: '요즘 쓰고 있는 AI 툴이 있어요? 🤖\n(여러 개 선택 가능!)',
    buttons: [
      { label: 'ChatGPT', value: 'ChatGPT' },
      { label: 'Claude', value: 'Claude' },
      { label: 'Midjourney', value: 'Midjourney' },
      { label: 'AI웹빌더', value: 'AI웹빌더(lovable, bolt, v0 등)' },
      { label: '안 써봤어요', value: '없음' },
    ],
    multiSelect: true,
  },
  aiLevel: {
    message: 'AI 얼마나 익숙하세요? 🎯',
    buttons: [
      { label: '완전 처음이에요', value: '처음' },
      { label: '조금 써봤어요', value: '초급' },
      { label: '꽤 익숙해요', value: '중급' },
      { label: '거의 매일 써요', value: '고급' },
    ],
  },
  motivation: {
    message: '이 챌린지 왜 하고 싶어요? 💪',
    buttons: [
      { label: '포트폴리오 만들려고', value: '포트폴리오 제작' },
      { label: 'AI 배워보고 싶어서', value: 'AI 학습' },
      { label: '새로운 도전!', value: '새로운 도전' },
      { label: '직접 입력할게요', value: '__input__' },
    ],
  },
  confirm: {
    message: '',
    buttons: [
      { label: '네, 신청할게요!', value: 'confirm' },
      { label: '수정할래요', value: 'edit' },
    ],
  },
  done: {
    message: '',
  },
}

export default function ApplyForm() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [step, setStep] = useState<Step>('intro')
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(false)
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [showMotivationInput, setShowMotivationInput] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const introMessages: Message[] = [
      {
        role: 'assistant',
        content: '안뇽! 문어쌤이에요 🐙✨\nAI 5일 챌린지에 오신 거 진심 환영!',
      },
      {
        role: 'assistant',
        content: '포폴 없어서 고민이셨죠?\n딱 5일만 투자하면 나만의 포트폴리오 뚝딱 완성할 수 있어요!',
      },
      {
        role: 'assistant',
        content: '매일 미션 클리어하면 보증금 3만원 전액 환급! 💰',
      },
      {
        role: 'assistant',
        content: '같이 해볼래요? 🙌',
        buttons: FLOW.intro.buttons,
      },
    ]

    const timers: NodeJS.Timeout[] = []
    introMessages.forEach((msg, idx) => {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, msg])
      }, idx * 800)
      timers.push(timer)
    })

    return () => timers.forEach((t) => clearTimeout(t))
  }, [])

  const addAssistantMessage = (nextStep: Step, customMessage?: string) => {
    const flow = FLOW[nextStep]
    if (!flow) return

    // step을 즉시 변경해서 중복 입력 방지
    setStep(nextStep)

    let content = customMessage || flow.message

    if (nextStep === 'confirm') {
      content = `입력하신 정보 확인해주세요! ✅\n\n` +
        `📝 이름: ${collectedData.name}\n` +
        `📧 이메일: ${collectedData.email}\n` +
        `📱 연락처: ${collectedData.contact}\n` +
        `💼 직종: ${collectedData.job}\n` +
        `🤖 AI 툴: ${collectedData.aiTools?.join(', ') || '없음'}\n` +
        `🎯 AI 능숙도: ${collectedData.aiLevel}\n` +
        `💪 참여 동기: ${collectedData.motivation}`
    }

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content,
          buttons: flow.buttons,
          multiSelect: flow.multiSelect,
        },
      ])
      if (flow.inputType) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }, 300)
  }

  const handleUserResponse = (value: string, displayText?: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: displayText || value }])

    switch (step) {
      case 'intro':
        if (value === 'yes') {
          addAssistantMessage('name')
        } else {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '아쉽네요 😢\n다음에 또 놀러와요!' },
          ])
          setIsDone(true)
        }
        break

      case 'name':
        setCollectedData((prev) => ({ ...prev, name: value }))
        addAssistantMessage('email')
        break

      case 'email':
        if (!value.includes('@')) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '앗, 이메일 형식이 맞나요? 다시 입력해주세요! 📧' },
          ])
          setTimeout(() => inputRef.current?.focus(), 100)
          return
        }
        setCollectedData((prev) => ({ ...prev, email: value }))
        addAssistantMessage('contact')
        break

      case 'contact':
        setCollectedData((prev) => ({ ...prev, contact: value }))
        addAssistantMessage('job')
        break

      case 'job':
        setCollectedData((prev) => ({ ...prev, job: value }))
        addAssistantMessage('aiTools')
        break

      case 'aiTools':
        break

      case 'aiLevel':
        setCollectedData((prev) => ({ ...prev, aiLevel: value }))
        addAssistantMessage('motivation')
        break

      case 'motivation':
        if (value === '__input__') {
          setShowMotivationInput(true)
          setTimeout(() => inputRef.current?.focus(), 100)
          return
        }
        setCollectedData((prev) => ({ ...prev, motivation: value }))
        setTimeout(() => {
          const updatedData = { ...collectedData, motivation: value }
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `입력하신 정보 확인해주세요! ✅\n\n` +
                `📝 이름: ${updatedData.name}\n` +
                `📧 이메일: ${updatedData.email}\n` +
                `📱 연락처: ${updatedData.contact}\n` +
                `💼 직종: ${updatedData.job}\n` +
                `🤖 AI 툴: ${updatedData.aiTools?.join(', ') || '없음'}\n` +
                `🎯 AI 능숙도: ${updatedData.aiLevel}\n` +
                `💪 참여 동기: ${value}`,
              buttons: FLOW.confirm.buttons,
            },
          ])
          setStep('confirm')
        }, 300)
        break

      case 'confirm':
        if (value === 'confirm') {
          handleSubmit()
        } else {
          setCollectedData({})
          setSelectedTools([])
          addAssistantMessage('name')
        }
        break
    }
  }

  const handleToolsConfirm = () => {
    const tools = selectedTools.length > 0 ? selectedTools : ['없음']
    setMessages((prev) => [...prev, { role: 'user', content: tools.join(', ') }])
    setCollectedData((prev) => ({ ...prev, aiTools: tools }))
    setSelectedTools([])
    addAssistantMessage('aiLevel')
  }

  const toggleTool = (tool: string) => {
    if (tool === '없음') {
      setSelectedTools(['없음'])
    } else {
      setSelectedTools((prev) => {
        const filtered = prev.filter((t) => t !== '없음')
        if (filtered.includes(tool)) {
          return filtered.filter((t) => t !== tool)
        } else {
          return [...filtered, tool]
        }
      })
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...collectedData,
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
    if (!input.trim() || isDone) return
    const userMsg = input.trim()
    setInput('')

    if (showMotivationInput) {
      setShowMotivationInput(false)
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
      setCollectedData((prev) => ({ ...prev, motivation: userMsg }))
      setTimeout(() => {
        const updatedData = { ...collectedData, motivation: userMsg }
        setMessages((prev) => [
          ...prev,
          {
            role: 'assistant',
            content: `입력하신 정보 확인해주세요! ✅\n\n` +
              `📝 이름: ${updatedData.name}\n` +
              `📧 이메일: ${updatedData.email}\n` +
              `📱 연락처: ${updatedData.contact}\n` +
              `💼 직종: ${updatedData.job}\n` +
              `🤖 AI 툴: ${updatedData.aiTools?.join(', ') || '없음'}\n` +
              `🎯 AI 능숙도: ${updatedData.aiLevel}\n` +
              `💪 참여 동기: ${userMsg}`,
            buttons: FLOW.confirm.buttons,
          },
        ])
        setStep('confirm')
      }, 300)
      return
    }

    handleUserResponse(userMsg)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const showInput = ['name', 'email', 'contact'].includes(step) || showMotivationInput

  return (
    <div className="min-h-screen bg-black flex flex-col" style={pointFont}>
      <style>{`
        @font-face {
          font-family: 'KyoboHandwriting2019';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
      `}</style>

      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/" className="text-white/60 hover:text-white transition-colors">← 뒤로</Link>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Image src="/nozy-happy.png" alt="문어쌤" width={32} height={32} className="w-8 h-8" />
            <h1 className="text-[#c8ff00] font-black text-lg">문어쌤과 신청하기</h1>
          </div>
          <div className="w-10" />
        </div>
      </header>

      <div className="bg-white/5">
        <div className="max-w-2xl mx-auto px-4">
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-[#c8ff00] rounded-full"
              initial={{ width: '0%' }}
              animate={{
                width:
                  step === 'intro' ? '5%'
                    : step === 'name' ? '15%'
                    : step === 'email' ? '25%'
                    : step === 'contact' ? '35%'
                    : step === 'job' ? '50%'
                    : step === 'aiTools' ? '60%'
                    : step === 'aiLevel' ? '70%'
                    : step === 'motivation' ? '85%'
                    : step === 'confirm' ? '95%'
                    : '100%',
              }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </div>

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
                      msg.role === 'user' ? 'bg-[#c8ff00] text-black' : 'bg-white/10 text-white'
                    }`}
                  >
                    <p className="text-base whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                  </div>

                  {msg.role === 'assistant' && msg.buttons && i === messages.length - 1 && !isDone && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex flex-wrap gap-2 mt-3"
                    >
                      {msg.multiSelect ? (
                        <>
                          {msg.buttons.map((btn, btnIdx) => (
                            <button
                              key={btnIdx}
                              onClick={() => toggleTool(btn.value)}
                              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                                selectedTools.includes(btn.value)
                                  ? 'bg-[#c8ff00] text-black'
                                  : 'bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] hover:bg-[#c8ff00]/20'
                              }`}
                            >
                              {selectedTools.includes(btn.value) ? '✓ ' : ''}{btn.label}
                            </button>
                          ))}
                          <button
                            onClick={handleToolsConfirm}
                            className="w-full mt-2 bg-[#c8ff00] text-black px-4 py-3 rounded-full font-bold hover:scale-[1.02] transition-transform"
                          >
                            선택 완료 →
                          </button>
                        </>
                      ) : (
                        msg.buttons.map((btn, btnIdx) => (
                          <button
                            key={btnIdx}
                            onClick={() => handleUserResponse(btn.value, btn.label)}
                            className="bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] px-4 py-2 rounded-full text-sm font-bold hover:bg-[#c8ff00]/20 transition-colors"
                          >
                            {btn.label}
                          </button>
                        ))
                      )}
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isDone && step !== 'intro' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <div className="bg-[#c8ff00]/10 border border-[#c8ff00]/30 rounded-2xl p-6 inline-block">
                <p className="text-4xl mb-3">🎉</p>
                <p className="text-[#c8ff00] font-black text-xl mb-2">신청 완료!</p>
                <p className="text-white/60 text-sm mb-1">보증금 3만원 입금 후 참여가 확정됩니다</p>
                <div className="bg-white/10 rounded-xl p-4 mt-4 text-left">
                  <p className="text-[#c8ff00] font-bold text-sm mb-2">💰 보증금 입금 안내</p>
                  <p className="text-white text-sm">카카오뱅크 3333-25-5765032</p>
                  <p className="text-white text-sm">예금주: 정쿠</p>
                  <p className="text-white/60 text-xs mt-2">* 입금자명을 신청자 이름으로 해주세요</p>
                  <p className="text-white/60 text-xs">* 5일 미션 완료 시 100% 환급됩니다</p>
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

      {!isDone && showInput && (
        <div className="sticky bottom-0 bg-black/90 backdrop-blur-sm border-t border-white/10 px-4 py-3">
          <div className="max-w-2xl mx-auto flex gap-2">
            <input
              ref={inputRef}
              type={step === 'email' ? 'email' : 'text'}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                step === 'name' ? '이름을 입력하세요...'
                  : step === 'email' ? 'email@example.com'
                  : step === 'contact' ? '연락처를 입력하세요...'
                  : showMotivationInput ? '참여 동기를 입력하세요...'
                  : '메시지를 입력하세요...'
              }
              disabled={isSubmitting}
              className="flex-1 bg-white/10 text-white placeholder-white/30 rounded-full px-5 py-3 text-base outline-none focus:ring-2 focus:ring-[#c8ff00]/50 disabled:opacity-50"
              style={pointFont}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSubmitting}
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
