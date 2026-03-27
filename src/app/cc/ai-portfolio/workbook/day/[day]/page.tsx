'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/auth-context'
import { getWorkbookProgress, updateDayProgress, submitDayMission, submitMission, saveMissionDraft, DayProgress } from '@/lib/workbook-db'
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

  const dayKey = `day${day}` as 'day1' | 'day2' | 'day3' | 'day4' | 'day5'

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
    if (isNaN(day) || day < 1 || day > 5) {
      setContentLoading(false)
      return
    }
    setContent(DAY_CONTENT[day])
    setContentLoading(false)
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

  useEffect(() => {
    async function loadProgress() {
      if (user) {
        const data = await getWorkbookProgress(user.uid)
        if (data && data[dayKey]) {
          const dayData = data[dayKey] as DayProgress
          setProgress(dayData)
          setSubmission(dayData.submission || '')
          // 임시 저장된 드래프트 불러오기
          if (dayData.draft) {
            setMissionForm(prev => ({
              ...prev,
              ...dayData.draft
            }))
          }
        }
      }
    }
    loadProgress()
  }, [user, dayKey])

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

    if (hasFields) {
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

      const submissionData = {
        prompt: missionForm.prompt || '',
        tool: missionForm.tool || '',
        reference: referenceValue,
        result: resultValue,
        rating: missionForm.rating || '',
        likes: missionForm.likes || '',
        dislikes: missionForm.dislikes || '',
        feedback: missionForm.feedback || '',
      }

      await submitMission(
        user.uid,
        user.email || '',
        user.displayName || '익명',
        day,
        submissionData
      )

      // 슬랙으로 전송
      try {
        await fetch('/api/mission-slack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userName: user.displayName || '익명',
            userEmail: user.email || '',
            day,
            ...submissionData
          })
        })
      } catch (e) {
        console.error('Slack notification failed:', e)
      }

      setProgress({ status: 'completed' })
    } else {
      // Legacy: simple text submission
      if (!submission.trim()) return
      setSaving(true)
      await submitDayMission(user.uid, dayKey, submission)
      setProgress({ status: 'completed', submission })
    }

    setSaving(false)
  }

  const isFormValid = () => {
    if (!content?.mission.fields) return submission.trim().length > 0
    const requiredFields = content.mission.fields.filter(f => f.required)
    return requiredFields.every(f => missionForm[f.id]?.trim())
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

  const totalCheckItems = content?.steps.reduce((acc, step) => acc + (step.checkItems?.length || 0), 0) || 0
  const checkedCount = Object.values(checkedItems).filter(Boolean).length
  const progressPercent = totalCheckItems > 0 ? Math.round((checkedCount / totalCheckItems) * 100) : 0

  if (contentLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  if (!content || isNaN(day) || day < 1 || day > 5) {
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
            <span className="font-medium text-orange-600">
              Day {day} <span className="text-gray-400">/ 5</span>
            </span>
            <span className="text-xs">{progressPercent}% 완료</span>
          </div>
          {/* Progress bar */}
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
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
                <div className="prose prose-gray max-w-none leading-snug prose-h2:text-orange-600 prose-h3:text-gray-900 prose-p:text-gray-600 prose-p:leading-normal prose-p:my-2 prose-hr:my-8 prose-strong:text-gray-900 prose-table:text-sm prose-th:bg-gray-100 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 prose-blockquote:bg-orange-50 prose-blockquote:border-l-orange-500 prose-blockquote:not-italic prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-gray-800 prose-code:before:content-none prose-code:after:content-none prose-pre:bg-gray-100 prose-pre:text-gray-800 prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}
                    components={{
                      pre: CodeBlock,
                      a: ({ href, children }) => {
                        return <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">{children}</a>
                      },
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
                                disabled={progress?.status === 'completed'}
                              />
                            ) : field.type === 'select' ? (
                              <select
                                value={missionForm[field.id] || ''}
                                onChange={(e) => setMissionForm(prev => ({ ...prev, [field.id]: e.target.value }))}
                                className="w-full p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900"
                                disabled={progress?.status === 'completed'}
                              >
                                <option value="">선택해주세요</option>
                                {field.options?.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : field.type === 'file' ? (
                              <div className="space-y-2">
                                <input
                                  type="file"
                                  accept={field.accept || 'image/*'}
                                  onChange={(e) => handleFileSelect(field.id, e.target.files?.[0] || null)}
                                  className="w-full p-3 rounded-xl border border-gray-300 focus:border-gray-500 focus:outline-none bg-white text-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200"
                                  disabled={progress?.status === 'completed'}
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
                                    disabled={progress?.status === 'completed'}
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
                                      disabled={progress?.status === 'completed'}
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
                                disabled={progress?.status === 'completed'}
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
                          <span className="text-green-600 font-medium">제출 완료!</span>
                        ) : saved ? (
                          <span className="text-gray-600">저장됨!</span>
                        ) : null}
                      </div>
                      <div className="flex gap-2">
                        {progress?.status !== 'completed' && (
                          <>
                            <button
                              onClick={handleSaveDraft}
                              disabled={saving}
                              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300 disabled:opacity-50"
                            >
                              {saving ? '저장 중...' : '임시 저장'}
                            </button>
                            <button
                              onClick={handleSubmit}
                              disabled={saving || uploading || !isFormValid()}
                              className="px-4 py-2 bg-gray-800 text-white rounded-lg text-sm font-bold hover:bg-gray-900 disabled:opacity-50"
                            >
                              {uploading ? '업로드 중...' : saving ? '제출 중...' : '제출하기'}
                            </button>
                          </>
                        )}
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
