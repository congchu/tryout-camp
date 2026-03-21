'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { initMixpanel, track, trackPageView, trackButtonClick, trackFormStep, trackFormSubmit } from '@/lib/mixpanel'

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
  comment?: string
}

type Step = 'intro' | 'name' | 'email' | 'contact' | 'job' | 'aiTools' | 'aiLevel' | 'motivation' | 'comment' | 'confirm' | 'edit' | 'done'

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
    message: '챌린지는 슬랙에서 진행돼요! 💬\n초대장 보내드릴 이메일 주소 알려주세요 📧',
    inputType: 'email',
  },
  contact: {
    message: '전화번호 또는 카카오톡 ID 알려주세요! 📱\n(긴급 연락용이에요)',
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
  aiLevel: {
    message: 'AI 얼마나 익숙하세요? 🎯',
    buttons: [
      { label: '완전 처음이에요', value: '완전 처음이에요' },
      { label: '조금 써봤어요', value: '조금 써봤어요' },
      { label: '꽤 익숙해요', value: '꽤 익숙해요' },
      { label: '거의 매일 써요', value: '거의 매일 써요' },
    ],
  },
  aiTools: {
    message: '사용해 본 AI 툴이 있어요? 🤖\n(여러 개 선택 가능!)',
    buttons: [
      { label: 'ChatGPT', value: 'ChatGPT' },
      { label: 'Claude', value: 'Claude' },
      { label: 'Midjourney', value: 'Midjourney' },
      { label: 'AI웹빌더 (lovable, bolt, v0 등)', value: 'AI웹빌더' },
      { label: '안 써봤어요', value: '없음' },
    ],
    multiSelect: true,
  },
  motivation: {
    message: '이 챌린지 왜 하고 싶어요? 💪\n(여러 개 선택 가능!)',
    buttons: [
      { label: '포트폴리오 만들려고', value: '포트폴리오 제작' },
      { label: 'AI 배워보고 싶어서', value: 'AI 학습' },
      { label: '새로운 도전!', value: '새로운 도전' },
      { label: '직접 입력할게요', value: '__input__' },
    ],
    multiSelect: true,
  },
  comment: {
    message: '마지막으로! 🎤\n기대하는 것이나 운영자에게 하고 싶은 말 있으면 자유롭게 적어주세요~\n(없으면 건너뛰기 눌러주세요!)',
    buttons: [
      { label: '건너뛰기', value: '__skip__' },
    ],
    inputType: 'text',
  },
  confirm: {
    message: '',
    buttons: [
      { label: '네, 신청할게요!', value: 'confirm' },
      { label: '수정할래요', value: 'edit' },
    ],
  },
  edit: {
    message: '어떤 항목을 수정할까요? 🔧',
    buttons: [
      { label: '이름', value: 'edit_name' },
      { label: '이메일', value: 'edit_email' },
      { label: '연락처', value: 'edit_contact' },
      { label: '직종', value: 'edit_job' },
      { label: 'AI 툴', value: 'edit_aiTools' },
      { label: 'AI 친숙도', value: 'edit_aiLevel' },
      { label: '참여 동기', value: 'edit_motivation' },
      { label: '하고 싶은 말', value: 'edit_comment' },
    ],
  },
  done: {
    message: '',
  },
}

export default function ApplyForm() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [step, setStep] = useState<Step>('confirm')
  const [collectedData, setCollectedData] = useState<CollectedData>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDone, setIsDone] = useState(true) // TODO: 테스트 후 false로, step도 'intro'로 변경
  const [selectedTools, setSelectedTools] = useState<string[]>([])
  const [selectedMotivations, setSelectedMotivations] = useState<string[]>([])
  const [showMotivationInput, setShowMotivationInput] = useState(false)
  const [showJobInput, setShowJobInput] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComposing, setIsComposing] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showCopiedSnackbar, setShowCopiedSnackbar] = useState(false)

  const copyAccountNumber = async () => {
    await navigator.clipboard.writeText('206802-04-058304')
    setShowCopiedSnackbar(true)
    setTimeout(() => setShowCopiedSnackbar(false), 2000)
  }
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Mixpanel 초기화 및 페이지뷰 트래킹
  useEffect(() => {
    initMixpanel()
    trackPageView('Apply Form')
  }, [])

  // step 변경 시 트래킹
  const stepOrder: Step[] = ['intro', 'name', 'email', 'contact', 'job', 'aiTools', 'aiLevel', 'motivation', 'comment', 'confirm', 'done']
  useEffect(() => {
    const stepNumber = stepOrder.indexOf(step) + 1
    if (step !== 'intro' && step !== 'edit') {
      trackFormStep(step, stepNumber)
    }
  }, [step])

  // 모달 열릴 때 배경 스크롤 잠금
  useEffect(() => {
    if (isDone || showQRModal) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isDone, showQRModal])

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

  const goToConfirm = (data: CollectedData) => {
    setIsEditing(false)
    setStep('confirm')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `수정했어요! 다시 확인해주세요 ✅\n\n` +
            `📝 이름: ${data.name}\n` +
            `📧 이메일: ${data.email}\n` +
            `📱 연락처: ${data.contact}\n` +
            `💼 직종: ${data.job}\n` +
            `🤖 AI 툴: ${data.aiTools?.join(', ') || '없음'}\n` +
            `🎯 AI 친숙도: ${data.aiLevel}\n` +
            `💪 참여 동기: ${data.motivation}\n` +
            `💬 하고 싶은 말: ${data.comment || '없음'}`,
          buttons: FLOW.confirm.buttons,
        },
      ])
      setIsProcessing(false)
    }, 300)
  }

  const goToConfirmFromComment = (data: CollectedData) => {
    setStep('confirm')
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `입력하신 정보 확인해주세요! ✅\n\n` +
            `📝 이름: ${data.name}\n` +
            `📧 이메일: ${data.email}\n` +
            `📱 연락처: ${data.contact}\n` +
            `💼 직종: ${data.job}\n` +
            `🤖 AI 툴: ${data.aiTools?.join(', ') || '없음'}\n` +
            `🎯 AI 친숙도: ${data.aiLevel}\n` +
            `💪 참여 동기: ${data.motivation}\n` +
            `💬 하고 싶은 말: ${data.comment || '없음'}`,
          buttons: FLOW.confirm.buttons,
        },
      ])
      setIsProcessing(false)
    }, 300)
  }

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
        `🎯 AI 친숙도: ${collectedData.aiLevel}\n` +
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
      setIsProcessing(false)
      if (flow.inputType) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }, 300)
  }

  const handleUserResponse = (value: string, displayText?: string) => {
    if (isProcessing) return
    setIsProcessing(true)
    setMessages((prev) => [...prev, { role: 'user', content: displayText || value }])

    switch (step) {
      case 'intro':
        trackButtonClick(displayText || value, 'intro')
        if (value === 'yes') {
          track('Intro Response', { response: 'yes', label: displayText })
          addAssistantMessage('name')
        } else if (value === 'bye') {
          track('Intro Response', { response: 'bye', label: displayText })
          setIsProcessing(false)
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: '알겠어요! 다음에 또 놀러와요 👋' },
            ])
            setIsDone(true)
          }, 300)
        } else {
          track('Intro Response', { response: 'no', label: displayText })
          setIsProcessing(false)
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: '앗 잠깐요! 😢\n\n5일 동안 매일 30분만 투자하면 돼요.\n게다가 미션 완료하면 보증금 3만원 전액 환급!\n\n부담 없이 한번 도전해보는 건 어때요?',
                buttons: [
                  { label: '좋아요, 해볼게요!', value: 'yes' },
                  { label: '다음에 할게요', value: 'bye' },
                ],
              },
            ])
          }, 300)
        }
        break

      case 'name':
        setCollectedData((prev) => ({ ...prev, name: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, name: value })
        } else {
          addAssistantMessage('email')
        }
        break

      case 'email':
        if (!value.includes('@')) {
          setMessages((prev) => [
            ...prev,
            { role: 'assistant', content: '앗, 이메일 형식이 맞나요?\n다시 입력해주세요! 📧' },
          ])
          setIsProcessing(false)
          setTimeout(() => inputRef.current?.focus(), 100)
          return
        }
        setCollectedData((prev) => ({ ...prev, email: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, email: value })
        } else {
          addAssistantMessage('contact')
        }
        break

      case 'contact':
        setCollectedData((prev) => ({ ...prev, contact: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, contact: value })
        } else {
          addAssistantMessage('job')
        }
        break

      case 'job':
        if (value === '기타') {
          setShowJobInput(true)
          setTimeout(() => {
            setMessages((prev) => [
              ...prev,
              { role: 'assistant', content: '어떤 일을 하시는지 직접 알려주세요! ✍️' },
            ])
            setIsProcessing(false)
            setTimeout(() => inputRef.current?.focus(), 100)
          }, 300)
          return
        }
        setCollectedData((prev) => ({ ...prev, job: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, job: value })
        } else {
          addAssistantMessage('aiTools')
        }
        break

      case 'aiTools':
        break

      case 'aiLevel':
        setCollectedData((prev) => ({ ...prev, aiLevel: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, aiLevel: value })
        } else {
          addAssistantMessage('motivation')
        }
        break

      case 'motivation':
        if (value === '__input__') {
          setShowMotivationInput(true)
          setIsProcessing(false)
          setTimeout(() => inputRef.current?.focus(), 100)
          return
        }
        setCollectedData((prev) => ({ ...prev, motivation: value }))
        if (isEditing) {
          goToConfirm({ ...collectedData, motivation: value })
        } else {
          addAssistantMessage('comment')
        }
        break

      case 'comment':
        if (value === '__skip__') {
          setCollectedData((prev) => ({ ...prev, comment: '' }))
          goToConfirmFromComment({ ...collectedData, comment: '' })
        }
        break

      case 'confirm':
        if (value === 'confirm') {
          handleSubmit()
        } else {
          // 수정할 항목 선택
          addAssistantMessage('edit')
        }
        break

      case 'edit':
        setIsEditing(true)
        const editTargets: Record<string, Step> = {
          'edit_name': 'name',
          'edit_email': 'email',
          'edit_contact': 'contact',
          'edit_job': 'job',
          'edit_aiTools': 'aiTools',
          'edit_aiLevel': 'aiLevel',
          'edit_motivation': 'motivation',
          'edit_comment': 'comment',
        }
        const targetStep = editTargets[value]
        if (targetStep) {
          addAssistantMessage(targetStep)
        }
        break
    }
  }

  const handleToolsConfirm = () => {
    const tools = selectedTools.length > 0 ? selectedTools : ['없음']
    setMessages((prev) => [...prev, { role: 'user', content: tools.join(', ') }])
    setCollectedData((prev) => ({ ...prev, aiTools: tools }))
    setSelectedTools([])
    if (isEditing) {
      goToConfirm({ ...collectedData, aiTools: tools })
    } else {
      addAssistantMessage('aiLevel')
    }
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

  const toggleMotivation = (motivation: string) => {
    if (motivation === '__input__') {
      setShowMotivationInput(true)
      setSelectedMotivations([])
      setTimeout(() => inputRef.current?.focus(), 100)
      return
    }
    // 다른 옵션 선택 시 직접 입력 모드 해제
    setShowMotivationInput(false)
    setSelectedMotivations((prev) => {
      if (prev.includes(motivation)) {
        return prev.filter((m) => m !== motivation)
      } else {
        return [...prev, motivation]
      }
    })
  }

  const handleMotivationsConfirm = () => {
    const motivations = selectedMotivations.length > 0 ? selectedMotivations.join(', ') : '없음'
    setMessages((prev) => [...prev, { role: 'user', content: motivations }])
    setCollectedData((prev) => ({ ...prev, motivation: motivations }))
    setSelectedMotivations([])
    if (isEditing) {
      goToConfirm({ ...collectedData, motivation: motivations })
    } else {
      addAssistantMessage('comment')
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
      trackFormSubmit('AI 5Days Challenge Apply', {
        job: collectedData.job,
        aiLevel: collectedData.aiLevel,
        motivation: collectedData.motivation,
      })
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
      setIsDone(true)
    }
  }

  const handleSend = () => {
    if (!input.trim() || isDone || isProcessing) return
    const userMsg = input.trim()
    setInput('')
    setIsProcessing(true)

    if (showJobInput) {
      setShowJobInput(false)
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
      setCollectedData((prev) => ({ ...prev, job: userMsg }))
      if (isEditing) {
        goToConfirm({ ...collectedData, job: userMsg })
      } else {
        addAssistantMessage('aiTools')
      }
      return
    }

    if (showMotivationInput) {
      setShowMotivationInput(false)
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
      setCollectedData((prev) => ({ ...prev, motivation: userMsg }))
      if (isEditing) {
        goToConfirm({ ...collectedData, motivation: userMsg })
      } else {
        addAssistantMessage('comment')
      }
      return
    }

    if (step === 'comment') {
      setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
      setCollectedData((prev) => ({ ...prev, comment: userMsg }))
      if (isEditing) {
        goToConfirm({ ...collectedData, comment: userMsg })
      } else {
        goToConfirmFromComment({ ...collectedData, comment: userMsg })
      }
      return
    }

    handleUserResponse(userMsg)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
      e.preventDefault()
      handleSend()
    }
  }

  const showInput = ['name', 'email', 'contact', 'comment'].includes(step) || showJobInput || showMotivationInput

  return (
    <div className="min-h-screen bg-black flex flex-col" style={pointFont}>
      <style>{`
        @font-face {
          font-family: 'KyoboHandwriting2019';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
        @keyframes heartFall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(110vh) rotate(720deg);
            opacity: 0;
          }
        }
        .heart-rain {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 60;
          overflow: hidden;
        }
        .heart {
          position: absolute;
          top: -20px;
          animation: heartFall linear forwards;
        }
      `}</style>

      <header className="sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/cc/ai-5days-porfolio" className="text-white/60 hover:text-white transition-colors">←</Link>
          <div className="flex items-center gap-2 flex-1 justify-center">
            <Image src="/nozy-right.png" alt="문어쌤" width={32} height={32} className="w-8 h-8" />
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
                    <Image src="/nozy-right.png" alt="문어쌤" width={36} height={36} className="w-9 h-9" />
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
                          {msg.buttons.map((btn, btnIdx) => {
                            const isMotivation = step === 'motivation'
                            const isSelected = isMotivation
                              ? selectedMotivations.includes(btn.value)
                              : selectedTools.includes(btn.value)
                            const onToggle = isMotivation
                              ? () => toggleMotivation(btn.value)
                              : () => toggleTool(btn.value)
                            return (
                              <button
                                key={btnIdx}
                                onClick={onToggle}
                                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                                  isSelected
                                    ? 'bg-[#c8ff00] text-black'
                                    : 'bg-[#c8ff00]/10 border border-[#c8ff00]/30 text-[#c8ff00] hover:bg-[#c8ff00]/20'
                                }`}
                              >
                                {isSelected ? '✓ ' : ''}{btn.label}
                              </button>
                            )
                          })}
                          {!showMotivationInput && (
                            <button
                              onClick={step === 'motivation' ? handleMotivationsConfirm : handleToolsConfirm}
                              className="w-full mt-2 bg-[#c8ff00] text-black px-4 py-3 rounded-full font-bold hover:scale-[1.02] transition-transform"
                            >
                              선택 완료 →
                            </button>
                          )}
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

{/* Completion Popup Modal */}
          <AnimatePresence>
            {isDone && step !== 'intro' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.8, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8, y: 20 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  className="bg-[#1a1a1a] border border-[#c8ff00]/30 rounded-3xl p-6 max-w-sm w-full text-center"
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <h2 className="text-[#c8ff00] font-black text-2xl">거의 다 왔어요!</h2>
                    <motion.div
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                    >
                      <Image src="/cc/kjang1_v2.png" alt="축하" width={60} height={60} className="w-15 h-15" />
                    </motion.div>
                  </div>
                  <p className="text-[#c8ff00] text-sm font-bold mb-2">보증금 3만원 입금하면 참여 확정!</p>
                  <p className="text-white/60 text-sm mb-5">챌린지 3/28(토) 시작 <br/> 슬랙 초대는 다음 주 중 보내드려요</p>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between w-full bg-[#FEE500] text-[#3C1E1E] px-4 py-3 rounded-2xl font-bold">
                      <a
                        href="https://qr.kakaopay.com/FFqnDXru7"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-left hover:opacity-80 transition-opacity"
                      >
                        <span className="text-lg block">카카오페이로 3만원 송금</span>
                        <span className="text-sm opacity-70">바로 송금하기 →</span>
                      </a>
                      <button
                        onClick={() => setShowQRModal(true)}
                        className="hover:scale-110 transition-transform"
                      >
                        <Image src="/cc/kakaopay-qr.jpeg" alt="카카오페이 QR" width={60} height={60} className="w-15 h-15 rounded-lg" />
                      </button>
                    </div>

                    <div className="bg-white/10 rounded-2xl p-4 text-left">
                      <p className="text-[#c8ff00] font-bold text-sm mb-2">🏦 계좌이체</p>
                      <button
                        onClick={copyAccountNumber}
                        className="text-white text-sm font-medium hover:text-[#c8ff00] transition-colors flex items-center gap-2"
                      >
                        <span>국민은행 206802-04-058304 (구민정)</span>
                        <span className="text-white/40 text-xs">복사</span>
                      </button>
                      <p className="text-white/60 text-xs mt-2">* 입금자명을 신청자 이름으로 해주세요</p>
                      <p className="text-white/60 text-xs">* 5일 미션 완료 시 100% 환급!</p>
                    </div>
                  </div>

                  <Link
                    href="/cc/ai-5days-porfolio"
                    className="inline-block mt-6 text-white/50 hover:text-white text-sm transition-colors"
                  >
                    ← 상세페이지로 돌아가기
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

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
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={() => setIsComposing(false)}
              placeholder={
                step === 'name' ? '이름을 입력하세요...'
                  : step === 'email' ? 'email@example.com'
                  : step === 'contact' ? '연락처를 입력하세요...'
                  : showJobInput ? '직종을 입력하세요...'
                  : showMotivationInput ? '참여 동기를 입력하세요...'
                  : '메시지를 입력하세요...'
              }
              disabled={isSubmitting || isProcessing}
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

      {/* Heart Rain Animation */}
      {isDone && step !== 'intro' && (
        <div className="heart-rain">
          {[5, 12, 20, 28, 35, 42, 50, 58, 65, 72, 80, 88, 95, 8, 18, 25, 33, 45, 55, 62, 75, 83, 90, 15, 38, 68, 78, 3, 48, 93].map((left, i) => (
            <span
              key={i}
              className="heart"
              style={{
                left: `${left}%`,
                fontSize: `${12 + (i % 5) * 3}px`,
                animationDuration: `${4 + (i % 4)}s`,
                animationDelay: `${(i % 6) * 0.8}s`,
              }}
            >
              {i % 3 === 0 ? '💛' : '❤️'}
            </span>
          ))}
        </div>
      )}

      {/* QR Modal */}
      <AnimatePresence>
        {showQRModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowQRModal(false)}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-6 text-center"
            >
              <Image src="/cc/kakaopay-qr.jpeg" alt="카카오페이 QR" width={280} height={280} className="rounded-xl" />
              <p className="mt-4 text-gray-800 font-bold text-lg">3만원 · 정쿠</p>
              <p className="text-gray-500 text-sm">QR코드를 스캔해주세요</p>
              <button
                onClick={() => setShowQRModal(false)}
                className="mt-4 text-gray-400 hover:text-gray-600 text-sm"
              >
                닫기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Copied Snackbar */}
      <AnimatePresence>
        {showCopiedSnackbar && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[110] bg-[#c8ff00] text-black px-6 py-3 rounded-full font-bold shadow-lg"
          >
            ✓ 계좌번호가 복사되었습니다
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
