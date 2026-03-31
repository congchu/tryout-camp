'use client'

import { useEffect, useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getWorkbookProgress, updateDayProgress, submitDayMission, submitMission, saveMissionDraft, getUserSubmission, getUserProfile, DayProgress, UserProfile } from '@/lib/workbook-db'
import type { DayContent, Step as StepContent } from './_content'
import { ArrowLeft, Clock, CheckCircle2, ChevronLeft, ChevronRight, Copy, Check, X, Image as ImageIcon } from 'lucide-react'
import { DAY_CONTENT } from './_content'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const BASE_PATH = '/cc/ai-portfolio/workbook'

function ImageModal({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 overflow-auto"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 p-2 text-white hover:text-gray-300 bg-black/50 rounded-full z-20"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Image container */}
      <div className="min-h-full flex items-center justify-center p-4">
        <img
          src={src}
          alt="결과 이미지"
          className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  )
}

const RAINBOW_COLORS = [
  '#f97316', // orange
  '#eab308', // yellow
  '#22c55e', // green
  '#3b82f6', // blue
  '#a855f7', // purple
  '#ec4899', // pink
]

function DancingText({ text }: { text: string }) {
  return (
    <span className="inline-flex flex-wrap justify-center">
      {text.split('').map((char, index) => (
        <span
          key={index}
          className="dancing-char inline-block"
          style={{
            animationDelay: `${index * 0.05}s`,
            color: RAINBOW_COLORS[index % RAINBOW_COLORS.length],
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

function CelebrationModal({ onClose }: { onClose: () => void }) {
  const fireConfetti = useCallback(() => {
    // 불꽃놀이 효과
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      // 왼쪽에서 발사
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
      })
      // 오른쪽에서 발사
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }

    // 초기 빵빠레
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899']
    })

    frame()
  }, [])

  useEffect(() => {
    fireConfetti()
  }, [fireConfetti])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60" onClick={onClose}>

      {/* Modal Content */}
      <div
        className="relative bg-white rounded-t-3xl sm:rounded-3xl p-6 md:p-8 max-w-2xl w-full sm:w-auto mx-0 sm:mx-4 shadow-2xl animate-slide-up max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2" style={{ fontFamily: 'KyoboHandwriting2019' }}>
            <DancingText text="포폴 없는 프리랜서 구출 챌린지 완료!!" />
          </h2>
          <p className="text-gray-600 mb-6">완주하신 여러분들 진심으로 축하드립니다!</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 mb-6">
          <p className="font-semibold text-gray-900 mb-3">여정을 돌아보면</p>
          <div className="space-y-1.5 text-gray-700">
            <p>✅ Day 1, <strong>AI 도구</strong>를 처음 만났습니다.</p>
            <p>✅ Day 2, <strong>멋진 템플릿</strong>을 가져왔습니다.</p>
            <p>✅ Day 3, <strong>내 이야기</strong>를 채워넣었습니다.</p>
            <p>✅ Day 4, <strong>세상에 공개</strong>했습니다.</p>
            <p>✅ Day 5, <strong>누가 봤는지</strong> 확인할 수 있게 됐습니다.</p>
            <p>✅ Day 6, <strong>나만의 도메인</strong>을 갖게 됐습니다.</p>
          </div>
        </div>

        <div className="text-gray-600 space-y-4 mb-6 leading-relaxed">
          <p>
            AI로 만든다는게 어떤 건지 감이 안오셨을텐데, 직접 해보니 어떠셨나요?<br />
            쉬우면서도 어렵다면, 잘 따라오셨습니!!😂
          </p>
          <p>
            이번 챌린지는 완성 단계가 아니라,<br />
            <strong className="text-gray-900">가능성과 방향을 확인하는 과정</strong>이었습니다.
          </p>
          <p>
            결과물이 부족하게 느껴지는 것도 자연스러운 상태입니다.<br />
            이제부터는 그 결과물을 기준으로 계속 개선해 나가면 됩니다 :)
          </p>
        </div>

        <p className="text-center text-lg font-semibold text-gray-900 mb-6">
          고생 많으셨습니다! 뒷풀이에서 만나요~! 🍻
        </p>

        <button
          onClick={onClose}
          className="w-full px-8 py-3 bg-orange-500 text-white font-bold rounded-xl hover:bg-orange-600 transition-colors"
        >
          확인
        </button>
      </div>

      <style jsx global>{`
        @keyframes slide-up {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          60% {
            transform: translateY(-10px);
            opacity: 1;
          }
          100% {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        @keyframes dance {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-8px) rotate(-5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(-4px) rotate(5deg);
          }
        }
        .dancing-char {
          animation: dance 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}

function CodeBlock({ children, ...props }: { children?: React.ReactNode } & React.HTMLAttributes<HTMLPreElement>) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const text = (children as any)?.props?.children || ''
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="relative group">
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-1.5 rounded bg-gray-200 hover:bg-gray-300"
        title="복사"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4 text-gray-600" />}
      </button>
      <pre {...props}>{children}</pre>
    </div>
  )
}

export default function WorkbookDayPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const day = Number(params.day)
  const isBonus = day === 6
  const { user } = useAuth()
  const [progress, setProgress] = useState<DayProgress | null>(null)
  const [submission, setSubmission] = useState('')
  const [missionForm, setMissionForm] = useState<Record<string, string>>({
    prompt: '',
    tool: '',
    reference: '',
    result: '',
    rating: '',
    likes: '',
    dislikes: '',
    feedback: ''
  })
  const [fileUploads, setFileUploads] = useState<Record<string, File | null>>({})
  const [filePreviews, setFilePreviews] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(false)
  const [modalImage, setModalImage] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [activeStep, setActiveStep] = useState<string>('step-1')
  const [content, setContent] = useState<DayContent | null>(null)
  const [contentLoading, setContentLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [completedDays, setCompletedDays] = useState(0)
  const [showCelebration, setShowCelebration] = useState(false)

  const dayKey = `day${day}` as 'day1' | 'day2' | 'day3' | 'day4' | 'day5' | 'day6'

  // 모달 열릴 때 배경 스크롤 방지
  useEffect(() => {
    if (modalImage) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [modalImage])

  // 현재 step 인덱스
  const currentStepIndex = content?.steps.findIndex(s => s.id === activeStep) ?? 0
  const currentStep = activeStep === 'mission' ? null : content?.steps[currentStepIndex]
  const isMission = activeStep === 'mission'

  // Load content from static file
  useEffect(() => {
    if (!isNaN(day) && day >= 1 && day <= 6) {
      setContent(DAY_CONTENT[day])
      setContentLoading(false)
    } else {
      setContentLoading(false)
    }
  }, [day])

  useEffect(() => {
    if (content?.steps.length) {
      const stepFromUrl = searchParams.get('step')
      if (stepFromUrl) {
        if (stepFromUrl === 'mission') {
          setActiveStep('mission')
        } else {
          // step=1 -> index 0, step=2 -> index 1 ...
          const stepIndex = parseInt(stepFromUrl) - 1
          if (stepIndex >= 0 && stepIndex < content.steps.length) {
            setActiveStep(content.steps[stepIndex].id)
          } else {
            setActiveStep(content.steps[0].id)
          }
        }
      } else {
        setActiveStep(content.steps[0].id)
      }
    }
  }, [content, searchParams])

  // 세션 스토리지 키
  const sessionKey = `mission-form-day${day}`

  // 폼 값 변경 시 세션 스토리지에 자동 저장
  useEffect(() => {
    if (day && Object.values(missionForm).some(v => v)) {
      sessionStorage.setItem(sessionKey, JSON.stringify(missionForm))
    }
  }, [missionForm, day, sessionKey])

  useEffect(() => {
    async function loadProgress() {
      // 1. 먼저 세션 스토리지에서 불러오기 (새로고침 대비)
      const savedSession = sessionStorage.getItem(sessionKey)
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession)
          setMissionForm(prev => ({ ...prev, ...parsed }))
        } catch (e) {
          console.error('Failed to parse session storage:', e)
        }
      }

      if (user) {
        // 사용자 프로필 불러오기
        const profile = await getUserProfile(user.uid)
        setUserProfile(profile)

        const data = await getWorkbookProgress(user.uid)
        if (data) {
          // 완료된 Day 수 계산 (Day 1-5만)
          let completed = 0
          for (let i = 1; i <= 5; i++) {
            const key = `day${i}` as keyof typeof data
            if (data[key] && (data[key] as DayProgress).status === 'completed') {
              completed++
            }
          }
          setCompletedDays(completed)

          // 현재 Day 진행 상황 로드
          const dayDataKey = `day${day}` as keyof typeof data
          if (data[dayDataKey]) {
            const dayData = data[dayDataKey] as DayProgress
            setProgress(dayData)
            setSubmission(dayData.submission || '')
            // 임시 저장된 드래프트 불러오기 (세션 스토리지가 없을 때만)
            if (dayData.draft && !savedSession) {
              setMissionForm(prev => ({
                ...prev,
                ...dayData.draft
              }))
            }
          }
        }

        // 기존 제출물 불러오기 (세션 스토리지가 없을 때만)
        if (!savedSession) {
          const existingSubmission = await getUserSubmission(user.uid, day)
          if (existingSubmission) {
            // 동적으로 모든 필드 불러오기
            const loadedData: Record<string, string> = {}
            Object.entries(existingSubmission).forEach(([key, value]) => {
              if (typeof value === 'string') {
                loadedData[key] = value
              }
            })
            setMissionForm(prev => ({
              ...prev,
              ...loadedData
            }))
          }
        }
      }
    }
    loadProgress()
  }, [user, dayKey, day, sessionKey])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    await updateDayProgress(user.uid, dayKey, {
      status: 'in_progress',
      submission,
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleSaveDraft = async () => {
    if (!user) return
    setSaving(true)
    await saveMissionDraft(user.uid, dayKey, missionForm)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleFileSelect = (fieldId: string, file: File | null) => {
    setFileUploads(prev => ({ ...prev, [fieldId]: file }))
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setFilePreviews(prev => ({ ...prev, [fieldId]: reader.result as string }))
      }
      reader.readAsDataURL(file)
    } else {
      setFilePreviews(prev => ({ ...prev, [fieldId]: '' }))
    }
  }

  const uploadFile = async (file: File, _fieldId: string): Promise<string> => {
    // Convert file to base64 data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  const handleSubmit = async () => {
    if (!user) return

    // Check if using new structured fields
    const hasFields = content?.mission.fields && content.mission.fields.length > 0

    if (hasFields && content?.mission.fields) {
      // Validate required fields
      const requiredFields = content.mission.fields.filter(f => f.required)
      const allFilled = requiredFields.every(f => missionForm[f.id]?.trim())
      if (!allFilled) return

      setSaving(true)

      setUploading(true)

      // Handle reference field (URL or file upload)
      let referenceValue = missionForm.reference || ''
      if (fileUploads.reference) {
        referenceValue = await uploadFile(fileUploads.reference, 'reference')
      }

      // Handle result field (URL or file upload)
      let resultValue = missionForm.result || ''
      if (fileUploads.result) {
        resultValue = await uploadFile(fileUploads.result, 'result')
      }

      setUploading(false)

      // 동적으로 모든 폼 필드 수집
      const submissionData: Record<string, string> = { ...missionForm }
      // 파일 업로드 필드 덮어쓰기
      if (referenceValue) submissionData.reference = referenceValue
      if (resultValue) submissionData.result = resultValue

      await submitMission(
        user.uid,
        user.email || '',
        userProfile?.name || user.displayName || '익명',
        day,
        submissionData
      )

      // 슬랙으로 전송 (이미지 base64는 제외하고 URL만 전송)
      try {
        const slackData: Record<string, string | number> = {
          userName: userProfile?.name || user.displayName || '익명',
          userEmail: user.email || '',
          day,
        }
        // 모든 폼 필드를 슬랙 데이터에 추가
        Object.entries(submissionData).forEach(([key, value]) => {
          if (typeof value === 'string' && value.startsWith('data:')) {
            slackData[key] = '(이미지 첨부됨)'
          } else {
            slackData[key] = value || ''
          }
        })

        const slackRes = await fetch('/api/mission-slack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(slackData)
        })
        if (!slackRes.ok) {
          console.error('Slack response not ok:', await slackRes.text())
        }
      } catch (e) {
        console.error('Slack notification failed:', e)
      }

      // 처음 완료하는 경우만 completedDays 증가
      if (progress?.status !== 'completed') {
        setCompletedDays(prev => prev + 1)
      }
      setProgress({ status: 'completed' })
      // 제출 성공 시 세션 스토리지 비우기
      sessionStorage.removeItem(sessionKey)

      // Day 6 완료 시 축하 팝업
      if (day === 6) {
        setShowCelebration(true)
      }
    } else {
      // Legacy: simple text submission
      if (!submission.trim()) return
      setSaving(true)
      await submitDayMission(user.uid, dayKey, submission)
      // 처음 완료하는 경우만 completedDays 증가
      if (progress?.status !== 'completed') {
        setCompletedDays(prev => prev + 1)
      }
      setProgress({ status: 'completed', submission })
      sessionStorage.removeItem(sessionKey)
    }

    setSaving(false)
  }

  const isFormValid = () => {
    if (!content?.mission.fields) return submission.trim().length > 0
    const requiredFields = content.mission.fields.filter(f => f.required)
    return requiredFields.every(f => missionForm[f.id]?.trim())
  }

  const handleCopyForm = () => {
    if (!content?.mission.fields) return

    const lines = content.mission.fields.map(field => {
      const value = missionForm[field.id] || ''
      // Skip file uploads (base64) for copy
      if (field.type === 'url_or_file' && value.startsWith('data:')) {
        return `[${field.label}]\n(이미지 첨부됨 - 파일로 직접 전송해주세요)`
      }
      return `[${field.label}]\n${value || '(미입력)'}`
    })

    const text = `=== Day ${day} 미션 제출 ===\n\n${lines.join('\n\n')}`
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const goToStep = (stepId: string) => {
    setActiveStep(stepId)
    // step id를 숫자로 변환 (index + 1)
    const stepNum = stepId === 'mission' ? 'mission' : (content?.steps.findIndex(s => s.id === stepId) ?? 0) + 1
    router.push(`${BASE_PATH}/day/${day}?step=${stepNum}`, { scroll: false })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToPrev = () => {
    if (!content) return
    if (isMission) {
      goToStep(content.steps[content.steps.length - 1].id)
    } else if (currentStepIndex > 0) {
      goToStep(content.steps[currentStepIndex - 1].id)
    }
  }

  const goToNext = () => {
    if (!content) return
    if (currentStepIndex < content.steps.length - 1) {
      goToStep(content.steps[currentStepIndex + 1].id)
    } else if (!isMission) {
      goToStep('mission')
    }
  }

  const toggleCheckItem = (itemId: string) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }))
  }

  const isStepComplete = (step: StepContent) => {
    if (!step.checkItems || step.checkItems.length === 0) return false
    return step.checkItems.every((_, idx) => checkedItems[`${step.id}-${idx}`])
  }

  const progressPercent = Math.round((completedDays / 5) * 100)

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!content || isNaN(day) || day < 1 || day > 6) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>잘못된 페이지입니다.</p>
      </div>
    )
  }

  return (
    <>
      {/* Image Modal */}
      {modalImage && (
        <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
      )}

      {/* Celebration Modal */}
      {showCelebration && (
        <CelebrationModal onClose={() => setShowCelebration(false)} />
      )}

      <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <Link
              href={BASE_PATH}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs">목록</span>
            </Link>
            {user && (
              <span className="text-xs text-gray-400">{user.displayName}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span className={`font-medium ${isBonus ? 'text-purple-600' : 'text-orange-600'}`}>
              {isBonus ? '🎁 보너스' : <>Day {day} <span className="text-gray-400">/ 5</span></>}
            </span>
            {!isBonus && <span className="text-xs">{progressPercent}% 완료</span>}
            {isBonus && <span className="text-xs text-purple-500">선택 과정</span>}
          </div>
          {/* Progress bar (보너스에서는 숨김) */}
          {!isBonus && (
            <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-orange-500 transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto flex">
        {/* 왼쪽 목차 (PC만) */}
        <aside className="hidden lg:block w-64 shrink-0  bg-[#f8fafc]">
          <nav className="sticky top-24 p-4 space-y-1">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">목차</p>
            {content.steps.map((step, idx) => {
              const isComplete = isStepComplete(step)
              const isActive = activeStep === step.id
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all ${
                    isActive
                      ? 'bg-orange-100 text-orange-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    isComplete
                      ? 'bg-green-500 text-white'
                      : isActive
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isComplete ? '✓' : idx + 1}
                  </span>
                  <span className="truncate">{step.title}</span>
                </button>
              )
            })}

            {/* 미션 링크 */}
            <button
              onClick={() => goToStep('mission')}
              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left text-sm transition-all mt-4 ${
                activeStep === 'mission'
                  ? 'bg-orange-100 text-orange-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs bg-orange-500 text-white shrink-0">
                !
              </span>
              <span className="truncate">오늘의 미션</span>
            </button>
          </nav>
        </aside>

        {/* 메인 콘텐츠 */}
        <main className="flex-1 min-w-0 px-4 lg:px-8 pb-16 pt-6">
          
          {/* 모바일 Step 네비게이션 */}
          <div className="lg:hidden flex items-center gap-2 mb-6 overflow-x-auto pb-2">
            {content.steps.map((step, idx) => {
              const isComplete = isStepComplete(step)
              const isActive = activeStep === step.id
              return (
                <button
                  key={step.id}
                  onClick={() => goToStep(step.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-orange-500 text-white'
                      : isComplete
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  <span className="font-medium">{idx + 1}</span>
                </button>
              )
            })}
            <button
              onClick={() => goToStep('mission')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-all ${
                activeStep === 'mission'
                  ? 'bg-orange-500 text-white'
                  : 'bg-gray-100 text-gray-600'
              }`}
            >
              미션
            </button>
          </div>

          {/* 선택된 Step 콘텐츠 */}
          {currentStep && !isMission && (
            <section>
              {/* Step Header */}
              <div className="flex items-start gap-4 mb-6">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                  isStepComplete(currentStep)
                    ? 'bg-green-500 text-white'
                    : 'bg-orange-100 text-orange-600'
                }`}>
                  {isStepComplete(currentStep) ? <CheckCircle2 className="w-5 h-5" /> : currentStepIndex + 1}
                </span>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {currentStep.title}
                  </h2>
                  {currentStep.duration && (
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Clock className="w-4 h-4" />
                      {currentStep.duration}
                    </p>
                  )}
                </div>
              </div>

              {/* Step Content */}
              <div className="mt-6">
                <div className="prose prose-gray max-w-none leading-snug prose-h2:text-orange-600 prose-h3:text-gray-900 prose-p:text-gray-600 prose-p:leading-normal prose-p:my-2 prose-hr:my-8 prose-strong:text-gray-900 prose-table:text-sm prose-th:bg-gray-100 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-blockquote:bg-orange-50 prose-blockquote:border-l-orange-500 prose-blockquote:not-italic prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:mt-0">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}
                    components={{
                      pre: CodeBlock,
                      a: ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">{children}</a>
                      },
                      // @ts-expect-error - custom element for modal image
                      'modal-img': ({ src, children }: { src?: string; children?: React.ReactNode }) => {
                        return (
                          <button
                            type="button"
                            onClick={() => src && setModalImage(src)}
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium ml-5 mr-2 cursor-pointer"
                          >
                            <ImageIcon className="w-4 h-4" />
                            {children}
                          </button>
                        )
                      },
                      'button-link': ({ href, children }: { href?: string; children?: React.ReactNode }) => {
                        return (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block px-6 py-3 bg-orange-500 !text-white font-bold rounded-lg hover:bg-orange-600 transition-colors !no-underline"
                          >
                            {children}
                          </a>
                        )
                      }
                    }}
                  >{currentStep.content}</ReactMarkdown>
                </div>

                {/* Check Items */}
                {currentStep.checkItems && currentStep.checkItems.length > 0 && (
                  <div className="mt-8 p-5 bg-gray-50 rounded-xl">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">체크리스트</p>
                    <div className="space-y-3">
                      {currentStep.checkItems.map((item, itemIdx) => {
                        const itemId = `${currentStep.id}-${itemIdx}`
                        const isChecked = checkedItems[itemId]
                        return (
                          <label key={itemId} className="flex items-center gap-3 cursor-pointer group">
                            <input
                              type="checkbox"
                              checked={isChecked || false}
                              onChange={() => toggleCheckItem(itemId)}
                              className="sr-only"
                            />
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                              isChecked
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-300 group-hover:border-gray-400'
                            }`}>
                              {isChecked && (
                                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </span>
                            <span className={`text-sm transition-all ${
                              isChecked ? 'text-gray-400 line-through' : 'text-gray-700'
                            }`}>
                              {item}
                            </span>
                          </label>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Step 내비게이션 */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
                {currentStepIndex > 0 ? (
                  <button
                    onClick={goToPrev}
                    className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span className="text-sm">이전</span>
                  </button>
                ) : (
                  <div />
                )}
                <button
                  onClick={goToNext}
                  className="flex items-center gap-2 px-5 py-2.5 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  <span>{currentStepIndex < content.steps.length - 1 ? '다음' : '미션 확인'}</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </section>
          )}

          {/* Mission */}
          {isMission && (
            <section>
              <div className="rounded-2xl bg-gray-100 border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-2 text-gray-900">{content.mission.title}</h2>
                <p className="text-gray-600 mb-6">{content.mission.description}</p>

                {user ? (
                  <>
                    {/* New structured fields */}
                    {content.mission.fields && content.mission.fields.length > 0 ? (
                      <div className="space-y-4">
                        {content.mission.fields.map((field) => (
                          <div key={field.id}>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              {field.label} {field.required && <span className="text-gray-400">*</span>}
                            </label>
                            {field.type === 'textarea' ? (
                              <textarea
                                value={missionForm[field.id] || ''}
                                onChange={(e) => setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full h-32 p-4 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400"
                                disabled={false}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={missionForm[field.id] || ''}
                                onChange={(e) => setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900"
                                disabled={false}
                              >
                                <option value="">선택해주세요</option>
                                {field.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.type === 'radio' ? (
                              <div className="flex flex-col gap-2">
                                {field.options?.map(opt => (
                                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 bg-white hover:border-gray-300 cursor-pointer transition-colors has-[:checked]:border-orange-400 has-[:checked]:bg-orange-50">
                                    <input
                                      type="radio"
                                      name={field.id}
                                      value={opt}
                                      checked={missionForm[field.id] === opt}
                                      onChange={(e) => setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                                      className="w-4 h-4 text-orange-500 focus:ring-orange-500"
                                    />
                                    <span className="text-gray-700">{opt}</span>
                                  </label>
                                ))}
                              </div>
                            ) : field.type === 'file' ? (
                              <div className="space-y-2">
                                <input
                                  type="file"
                                  accept={field.accept || 'image/*'}
                                  onChange={(e) => handleFileSelect(field.id, e.target.files?.[0] || null)}
                                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                  disabled={false}
                                />
                                {filePreviews[field.id] && (
                                  <div className="mt-2">
                                    <img
                                      src={filePreviews[field.id]}
                                      alt="미리보기"
                                      className="max-h-40 rounded-lg border border-gray-200"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : field.type === 'url_or_file' ? (
                              <div className="space-y-2">
                                <div className="flex gap-2 items-center">
                                  <input
                                    type="text"
                                    value={missionForm[field.id] || ''}
                                    onChange={(e) => {
                                      setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))
                                      if (e.target.value) {
                                        setFileUploads(prev => ({ ...prev, [field.id]: null }))
                                        setFilePreviews(prev => ({ ...prev, [field.id]: '' }))
                                      }
                                    }}
                                    placeholder="URL 입력"
                                    className="flex-1 p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400"
                                    disabled={false}
                                  />
                                  <span className="text-gray-400 text-sm">또는</span>
                                  <label className={`px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-700 text-sm font-medium cursor-pointer hover:bg-gray-50 ${progress?.status === 'completed' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    파일 첨부
                                    <input
                                      type="file"
                                      accept={field.accept || 'image/*'}
                                      onChange={(e) => {
                                        const file = e.target.files?.[0] || null
                                        handleFileSelect(field.id, file)
                                        if (file) {
                                          setMissionForm(prev => ({ ...prev, [field.id]: '' }))
                                        }
                                      }}
                                      className="hidden"
                                      disabled={false}
                                    />
                                  </label>
                                </div>
                                {filePreviews[field.id] && (
                                  <div className="mt-2">
                                    <img
                                      src={filePreviews[field.id]}
                                      alt="미리보기"
                                      className="max-h-40 rounded-lg border border-gray-200"
                                    />
                                  </div>
                                )}
                              </div>
                            ) : (
                              <input
                                type="text"
                                value={missionForm[field.id] || ''}
                                onChange={(e) => setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                                placeholder={field.placeholder}
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900 placeholder:text-gray-400"
                                disabled={false}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* Legacy: simple textarea */
                      <textarea
                        value={submission}
                        onChange={(e) => setSubmission(e.target.value)}
                        placeholder={content.mission.placeholder}
                        className="w-full h-48 p-4 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none resize-none bg-white text-gray-900 placeholder:text-gray-400"
                        disabled={progress?.status === 'completed'}
                      />
                    )}

                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm">
                        {progress?.status === 'completed' ? (
                          <span className="text-green-600 font-medium">제출 완료! (수정 가능)</span>
                        ) : saved ? (
                          <span className="text-gray-600">저장됨!</span>
                        ) : copied ? (
                          <span className="text-blue-600">복사됨!</span>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleCopyForm}
                          className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5"
                          title="제출이 안 되면 복사해서 직접 전달해주세요"
                        >
                          <Copy className="w-4 h-4" />
                          {copied ? '복사됨!' : '내용 복사'}
                        </button>
                        <button
                          onClick={handleSaveDraft}
                          disabled={saving || uploading}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                        >
                          {saving ? '저장 중...' : '임시 저장'}
                        </button>
                        <button
                          onClick={handleSubmit}
                          disabled={saving || uploading || !isFormValid()}
                          className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 disabled:opacity-50"
                        >
                          {uploading ? '업로드 중...' : saving ? '제출 중...' : progress?.status === 'completed' ? '다시 제출' : '제출하기'}
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-600 text-sm">
                    미션을 제출하려면 로그인이 필요해요.{' '}
                    <Link href={BASE_PATH} className="underline font-medium text-gray-900">
                      로그인하기
                    </Link>
                  </p>
                )}
              </div>

              {/* 미션에서 이전 버튼 */}
              <div className="mt-10 pt-6 border-t border-gray-200 flex items-center justify-between">
                <button
                  onClick={goToPrev}
                  className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  <span className="text-sm">이전</span>
                </button>
                <div />
              </div>
            </section>
          )}

        </main>
      </div>
    </div>
    </>
  )
}
