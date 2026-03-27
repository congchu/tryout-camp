'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useAuth } from '@/lib/auth-context'
import {
  getWorkbookContent,
  saveDayContent,
  DayContent,
  StepContent,
  getAllUsersProgress,
  getAllSubmissions,
  UserProgressWithInfo,
  MissionSubmission
} from '@/lib/workbook-db'
import { DAY_CONTENT } from '../day/[day]/_content'
import { ArrowLeft, Plus, Trash2, Save, Loader2, Users, FileText, ChevronDown, ChevronUp } from 'lucide-react'

const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false })

const ADMIN_EMAIL = 'cookie00421@gmail.com'
const DAYS = [1, 2, 3, 4, 5] as const

type TabType = 'content' | 'progress'

export default function WorkbookAdminPage() {
  const { user, loading: authLoading } = useAuth()
  const [activeTab, setActiveTab] = useState<TabType>('progress')

  // Content editing state
  const [selectedDay, setSelectedDay] = useState<number>(1)
  const [content, setContent] = useState<DayContent | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [syncing, setSyncing] = useState(false)

  // Progress viewing state
  const [usersProgress, setUsersProgress] = useState<UserProgressWithInfo[]>([])
  const [submissions, setSubmissions] = useState<MissionSubmission[]>([])
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [expandedUser, setExpandedUser] = useState<string | null>(null)
  const [imageModal, setImageModal] = useState<string | null>(null)

  // Auth check
  const isAdmin = user?.email === ADMIN_EMAIL

  // Load content
  useEffect(() => {
    async function loadContent() {
      if (!isAdmin || activeTab !== 'content') return

      setLoading(true)
      const firestoreContent = await getWorkbookContent()

      if (firestoreContent && firestoreContent[selectedDay]) {
        setContent(firestoreContent[selectedDay])
      } else {
        setContent(DAY_CONTENT[selectedDay])
      }
      setLoading(false)
    }
    loadContent()
  }, [selectedDay, isAdmin, activeTab])

  // Load progress data
  useEffect(() => {
    async function loadProgressData() {
      if (!isAdmin || activeTab !== 'progress') return

      setLoadingProgress(true)
      const [progressData, submissionsData] = await Promise.all([
        getAllUsersProgress(),
        getAllSubmissions()
      ])
      setUsersProgress(progressData)
      setSubmissions(submissionsData)
      setLoadingProgress(false)
    }
    loadProgressData()
  }, [isAdmin, activeTab])

  // Save content
  const handleSave = async () => {
    if (!content) return

    setSaving(true)
    await saveDayContent(selectedDay, content)
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Sync from static file
  const handleSyncFromStatic = async () => {
    const staticContent = DAY_CONTENT[selectedDay]
    if (!staticContent) return

    setSyncing(true)
    setContent(staticContent)
    await saveDayContent(selectedDay, staticContent)
    setSyncing(false)
  }

  // Update handlers
  const updateBasicInfo = (field: 'title' | 'subtitle', value: string) => {
    if (!content) return
    setContent({ ...content, [field]: value })
  }

  const updateMission = (field: 'title' | 'description' | 'placeholder', value: string) => {
    if (!content) return
    setContent({
      ...content,
      mission: { ...content.mission, [field]: value }
    })
  }

  const updateStep = (stepIndex: number, field: keyof StepContent, value: string | string[]) => {
    if (!content) return
    const newSteps = [...content.steps]
    newSteps[stepIndex] = { ...newSteps[stepIndex], [field]: value }
    setContent({ ...content, steps: newSteps })
  }

  const addStep = () => {
    if (!content) return
    const newStep: StepContent = {
      id: `step-${content.steps.length + 1}`,
      title: '새 스텝',
      duration: '10분',
      content: '',
      checkItems: []
    }
    setContent({ ...content, steps: [...content.steps, newStep] })
  }

  const removeStep = (stepIndex: number) => {
    if (!content || content.steps.length <= 1) return
    const newSteps = content.steps.filter((_, i) => i !== stepIndex)
    setContent({ ...content, steps: newSteps })
  }

  const updateCheckItems = (stepIndex: number, checkItemsText: string) => {
    if (!content) return
    const checkItems = checkItemsText.split('\n').filter(item => item.trim())
    updateStep(stepIndex, 'checkItems', checkItems)
  }

  // Get user submissions
  const getUserSubmissions = (userId: string) => {
    return submissions.filter(s => s.userId === userId)
  }

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    )
  }

  // Not logged in or not admin
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-bold mb-4">접근 권한 없음</h1>
        <p className="text-gray-600 mb-6">이 페이지는 관리자만 접근할 수 있습니다.</p>
        <Link
          href="/cc/ai-portfolio/workbook"
          className="text-orange-600 hover:underline"
        >
          워크북으로 돌아가기
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Modal */}
      {imageModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setImageModal(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto">
            <img
              src={imageModal}
              alt="첨부 이미지"
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />
            <div className="mt-4 flex justify-center gap-3">
              <a
                href={imageModal}
                download="image.png"
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 bg-white text-gray-800 rounded-lg font-medium hover:bg-gray-100"
              >
                다운로드
              </a>
              <button
                onClick={() => setImageModal(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/cc/ai-portfolio/workbook"
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <h1 className="font-bold text-lg">워크북 어드민</h1>
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('progress')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'progress'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-4 h-4" />
              진행 현황
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'content'
                  ? 'bg-orange-100 text-orange-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4" />
              콘텐츠 편집
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {activeTab === 'progress' ? (
          // Progress Tab
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">참가자 현황</h2>
              <span className="text-sm text-gray-500">총 {usersProgress.length}명</span>
            </div>

            {loadingProgress ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : usersProgress.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                아직 참가자가 없습니다.
              </div>
            ) : (
              <div className="space-y-3">
                {usersProgress.map((userProgress) => {
                  const visitorId = userProgress.visitorId
                  const userSubs = getUserSubmissions(visitorId)
                  const isExpanded = expandedUser === visitorId
                  const progress = userProgress.progress

                  return (
                    <div
                      key={visitorId}
                      className="bg-white rounded-xl border border-gray-200 overflow-hidden"
                    >
                      {/* User Header */}
                      <button
                        onClick={() => setExpandedUser(isExpanded ? null : visitorId)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold">
                            {(userProgress.name || visitorId).slice(0, 2).toUpperCase()}
                          </div>
                          <div className="text-left">
                            <p className="font-medium text-gray-900">
                              {userProgress.name || userSubs[0]?.userName || visitorId.slice(0, 8)}
                            </p>
                            <p className="text-sm text-gray-500">
                              {userProgress.email || userSubs[0]?.userEmail || visitorId}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          {/* Day Progress */}
                          <div className="flex items-center gap-1">
                            {DAYS.map(day => {
                              const dayKey = `day${day}` as 'day1' | 'day2' | 'day3' | 'day4' | 'day5'
                              const dayProgress = progress[dayKey]
                              const status = dayProgress?.status || 'not_started'

                              return (
                                <div
                                  key={day}
                                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                                    status === 'completed'
                                      ? 'bg-emerald-100 text-emerald-700'
                                      : status === 'in_progress'
                                        ? 'bg-yellow-100 text-yellow-700'
                                        : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {day}
                                </div>
                              )
                            })}
                          </div>

                          {/* Submissions count */}
                          <span className="text-sm text-gray-500">
                            제출 {userSubs.length}개
                          </span>

                          {isExpanded ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>

                      {/* Expanded Details */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                          {userSubs.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">
                              아직 제출한 미션이 없습니다.
                            </p>
                          ) : (
                            <div className="space-y-4">
                              {userSubs.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="bg-white rounded-lg border border-gray-200 p-4"
                                >
                                  <div className="flex items-center justify-between mb-3">
                                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-sm font-bold rounded">
                                      Day {sub.day}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                      {sub.submittedAt && new Date((sub.submittedAt as unknown as { seconds?: number }).seconds ? (sub.submittedAt as unknown as { seconds: number }).seconds * 1000 : sub.submittedAt as unknown as number).toLocaleString('ko-KR')}
                                    </span>
                                  </div>

                                  {/* 상단 요약 정보 */}
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">
                                    {sub.tool && (
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="text-xs text-gray-500">도구</div>
                                        <div className="font-medium text-gray-800">{sub.tool}</div>
                                      </div>
                                    )}
                                    {sub.rating && (
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="text-xs text-gray-500">만족도</div>
                                        <div className="font-medium text-gray-800">{sub.rating}</div>
                                      </div>
                                    )}
                                    {sub.reference && (
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="text-xs text-gray-500">레퍼런스</div>
                                        {sub.reference.startsWith('data:') ? (
                                          <button
                                            onClick={() => setImageModal(sub.reference!)}
                                            className="text-blue-600 hover:underline font-medium"
                                          >
                                            이미지 보기
                                          </button>
                                        ) : (
                                          <a href={sub.reference} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                            링크 보기
                                          </a>
                                        )}
                                      </div>
                                    )}
                                    {sub.result && (
                                      <div className="bg-gray-50 rounded-lg px-3 py-2">
                                        <div className="text-xs text-gray-500">결과물</div>
                                        {sub.result.startsWith('data:') ? (
                                          <button
                                            onClick={() => setImageModal(sub.result!)}
                                            className="text-blue-600 hover:underline font-medium"
                                          >
                                            이미지 보기
                                          </button>
                                        ) : (
                                          <a href={sub.result} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">
                                            링크 보기
                                          </a>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* 상세 내용 */}
                                  <div className="space-y-3 text-sm">
                                    {sub.prompt && (
                                      <div>
                                        <div className="text-xs text-gray-500 mb-1">프롬프트</div>
                                        <pre className="bg-gray-50 rounded-lg p-3 text-xs text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                                          {sub.prompt}
                                        </pre>
                                      </div>
                                    )}

                                    {(sub.likes || sub.dislikes) && (
                                      <div className="grid grid-cols-2 gap-3">
                                        {sub.likes && (
                                          <div>
                                            <div className="text-xs text-gray-500 mb-1">👍 마음에 드는 부분</div>
                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-2">{sub.likes}</p>
                                          </div>
                                        )}
                                        {sub.dislikes && (
                                          <div>
                                            <div className="text-xs text-gray-500 mb-1">👎 아쉬운 부분</div>
                                            <p className="text-gray-700 bg-gray-50 rounded-lg p-2">{sub.dislikes}</p>
                                          </div>
                                        )}
                                      </div>
                                    )}

                                    {sub.feedback && (
                                      <div>
                                        <div className="text-xs text-gray-500 mb-1">💬 소감</div>
                                        <p className="text-gray-700 bg-gray-50 rounded-lg p-2">{sub.feedback}</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          // Content Tab
          <div>
            {/* Header with actions */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex gap-2">
                {DAYS.map(day => (
                  <button
                    key={day}
                    onClick={() => setSelectedDay(day)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedDay === day
                        ? 'bg-orange-600 text-white'
                        : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'
                    }`}
                  >
                    Day {day}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSyncFromStatic}
                  disabled={syncing}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                  {syncing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    '↻'
                  )}
                  {syncing ? '동기화 중...' : 'Static에서 불러오기'}
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving || !content}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 disabled:opacity-50"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {saving ? '저장 중...' : saved ? '저장됨!' : '저장'}
                </button>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : content ? (
              <div className="space-y-8">
                {/* Basic Info */}
                <section className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-lg mb-4">기본 정보</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                      <input
                        type="text"
                        value={content.title}
                        onChange={(e) => updateBasicInfo('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">부제목</label>
                      <input
                        type="text"
                        value={content.subtitle}
                        onChange={(e) => updateBasicInfo('subtitle', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>
                </section>

                {/* Steps */}
                <section className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-bold text-lg">스텝 ({content.steps.length}개)</h2>
                    <button
                      onClick={addStep}
                      className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700"
                    >
                      <Plus className="w-4 h-4" />
                      스텝 추가
                    </button>
                  </div>

                  <div className="space-y-6">
                    {content.steps.map((step, idx) => (
                      <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start justify-between mb-4">
                          <span className="px-2 py-1 bg-orange-100 text-orange-600 text-sm font-bold rounded">
                            Step {idx + 1}
                          </span>
                          {content.steps.length > 1 && (
                            <button
                              onClick={() => removeStep(idx)}
                              className="text-red-500 hover:text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>

                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">제목</label>
                              <input
                                type="text"
                                value={step.title}
                                onChange={(e) => updateStep(idx, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">소요 시간</label>
                              <input
                                type="text"
                                value={step.duration || ''}
                                onChange={(e) => updateStep(idx, 'duration', e.target.value)}
                                placeholder="예: 10분"
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                              />
                            </div>
                          </div>

                          <div data-color-mode="light">
                            <label className="block text-sm font-medium text-gray-700 mb-1">내용</label>
                            <MDEditor
                              value={step.content}
                              onChange={(val) => updateStep(idx, 'content', val || '')}
                              height={300}
                              preview="edit"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              체크리스트 (줄바꿈으로 구분)
                            </label>
                            <textarea
                              value={(step.checkItems || []).join('\n')}
                              onChange={(e) => updateCheckItems(idx, e.target.value)}
                              rows={3}
                              placeholder="체크할 항목을 한 줄에 하나씩 입력"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Mission */}
                <section className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="font-bold text-lg mb-4">오늘의 미션</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">미션 제목</label>
                      <input
                        type="text"
                        value={content.mission.title}
                        onChange={(e) => updateMission('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">설명</label>
                      <textarea
                        value={content.mission.description}
                        onChange={(e) => updateMission('description', e.target.value)}
                        rows={2}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">입력 플레이스홀더</label>
                      <textarea
                        value={content.mission.placeholder}
                        onChange={(e) => updateMission('placeholder', e.target.value)}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none font-mono text-sm"
                      />
                    </div>
                  </div>
                </section>
              </div>
            ) : (
              <p className="text-center text-gray-500">콘텐츠를 불러올 수 없습니다.</p>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
