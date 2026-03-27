'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth-context'
import { getWorkbookProgress, initWorkbookProgress, WorkbookProgress, DayProgress, getUserProfile, saveUserProfile, UserProfile } from '@/lib/workbook-db'
import { ArrowLeft, Clock, CheckCircle2, PlayCircle, Circle, Lock, Loader2 } from 'lucide-react'
import Link from 'next/link'

const CHALLENGE_INFO = {
  title: 'AI 5일 포트폴리오 챌린지',
  description: '5일 만에 AI로 나만의 포트폴리오 웹사이트를 만들어요!',
  days: 5,
  difficulty: '초급',
  goal: '포트폴리오 완성',
}

const MISSIONS = [
  {
    day: 1,
    title: 'AI로 웹사이트 만드는 법',
    mission: 'AI 도구 이해 + 첫 결과물 만들기',
    duration: '40분',
  },
  {
    day: 2,
    title: '화려한 포폴 따라만들기',
    mission: 'Codex / Claude Code로 레벨업',
    duration: '40분',
  },
  {
    day: 3,
    title: '콘텐츠 완성하기',
    mission: '내 정보 + 이미지 채우기',
    duration: '30분',
  },
  {
    day: 4,
    title: '배포하기',
    mission: '실제 URL로 세상에 공개',
    duration: '30분',
  },
  {
    day: 5,
    title: '방문자 확인',
    mission: 'Mixpanel 연동 + 분석',
    duration: '30분',
  },
]

export default function WorkbookPage() {
  const { user, loading, signInWithGoogle, signOut } = useAuth()
  const [progress, setProgress] = useState<WorkbookProgress | null>(null)
  const [loadingProgress, setLoadingProgress] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showNameModal, setShowNameModal] = useState(false)
  const [nameInput, setNameInput] = useState('')
  const [savingName, setSavingName] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function loadUserData() {
      if (user) {
        setLoadingProgress(true)

        // Load profile
        const userProfile = await getUserProfile(user.uid)
        if (userProfile) {
          setProfile(userProfile)
        } else {
          // New user - show name modal
          setNameInput(user.displayName || '')
          setShowNameModal(true)
        }

        // Load progress
        let data = await getWorkbookProgress(user.uid)
        if (!data) {
          await initWorkbookProgress(user.uid)
          data = await getWorkbookProgress(user.uid)
        }
        setProgress(data)
        setLoadingProgress(false)
      }
    }
    loadUserData()
  }, [user])

  const handleSaveName = async () => {
    if (!user || !nameInput.trim()) return

    setSavingName(true)
    await saveUserProfile(user.uid, {
      name: nameInput.trim(),
      email: user.email || ''
    })
    setProfile({ name: nameInput.trim(), email: user.email || '' })
    setShowNameModal(false)
    setSavingName(false)
  }

  const getDayStatus = (dayNum: number): 'completed' | 'in_progress' | 'not_started' => {
    if (!progress) return 'not_started'
    const dayKey = `day${dayNum}` as keyof WorkbookProgress
    const dayProgress = progress[dayKey] as DayProgress | undefined
    return dayProgress?.status || 'not_started'
  }

  const getFirstIncompleteDay = (): number => {
    for (let i = 1; i <= 5; i++) {
      if (getDayStatus(i) !== 'completed') return i
    }
    return 5
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    )
  }

  // 로그인 안 된 상태
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero */}
        <section className="relative pt-14 pb-8 px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/cc/ai-portfolio"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              챌린지 홈
            </Link>

            <div className="flex items-start gap-4 mb-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl shrink-0">
                📖
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {CHALLENGE_INFO.title}
                </h1>
                <p className="text-gray-600">
                  {CHALLENGE_INFO.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-3">
              <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {CHALLENGE_INFO.days}일 완성
              </span>
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {CHALLENGE_INFO.difficulty}
              </span>
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                목표: {CHALLENGE_INFO.goal}
              </span>
            </div>
          </div>
        </section>

        {/* Login CTA */}
        <section className="px-4 pb-20">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 text-center">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                로그인하고 시작하기
              </h2>
              <p className="text-gray-500 mb-6">
                로그인하면 진행 상황이 자동 저장됩니다
              </p>
              <button
                onClick={signInWithGoogle}
                className="inline-flex items-center justify-center gap-3 bg-white border-2 border-gray-200 rounded-xl px-6 py-3 text-gray-700 font-medium hover:border-gray-300 hover:bg-gray-50 transition-all"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google로 시작하기
              </button>
            </div>
          </div>
        </section>
      </div>
    )
  }

  // 로그인 된 상태
  const firstIncomplete = getFirstIncompleteDay()
  const displayName = profile?.name || user.displayName || '참가자'

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Name Input Modal */}
      {showNameModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">👋</div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">환영합니다!</h2>
              <p className="text-gray-500 text-sm">챌린지에서 사용할 이름을 알려주세요</p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">이름</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                autoFocus
              />
              <p className="mt-2 text-xs text-gray-400">다른 참가자와 운영자에게 보여지는 이름이에요</p>
            </div>

            <button
              onClick={handleSaveName}
              disabled={!nameInput.trim() || savingName}
              className="w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {savingName ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  저장 중...
                </>
              ) : (
                '시작하기'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Hero */}
      <section className="relative pt-14 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href="/cc/ai-portfolio"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
            >
              <ArrowLeft className="w-4 h-4" />
              챌린지 홈
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">{displayName}</span>
              <button
                onClick={signOut}
                className="text-sm text-gray-400 hover:text-gray-600"
              >
                로그아웃
              </button>
            </div>
          </div>

          <div className="flex items-start gap-4 mb-6">
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-4xl shrink-0">
              📖
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {CHALLENGE_INFO.title}
              </h1>
              <p className="text-gray-600">
                {CHALLENGE_INFO.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {CHALLENGE_INFO.days}일 완성
            </span>
            <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
              {CHALLENGE_INFO.difficulty}
            </span>
            <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
              목표: {CHALLENGE_INFO.goal}
            </span>
          </div>
        </div>
      </section>

      {/* Mission List */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            미션 목록
          </h2>

          {loadingProgress ? (
            <div className="text-center py-8 text-gray-400">로딩 중...</div>
          ) : (
            <div className="space-y-3">
              {MISSIONS.map((mission) => {
                const status = getDayStatus(mission.day)
                const isCompleted = status === 'completed'
                const isFirst = mission.day === firstIncomplete
                const isLocked = mission.day > 1 // Day 2부터는 잠금

                return (
                  <button
                    key={mission.day}
                    onClick={() => !isLocked && router.push(`/cc/ai-portfolio/workbook/day/${mission.day}`)}
                    disabled={isLocked}
                    className={`w-full block rounded-xl border p-4 text-left transition-all ${
                      isLocked
                        ? "bg-gray-100 border-gray-200 cursor-not-allowed"
                        : "bg-white border-gray-100 hover:border-orange-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Day Badge */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                        ${isLocked
                          ? "bg-gray-200 text-gray-500"
                          : isCompleted
                            ? "bg-emerald-100 text-emerald-600"
                            : isFirst
                              ? "bg-orange-100 text-orange-600"
                              : "bg-gray-100 text-gray-500"
                        }
                      `}>
                        {isLocked ? (
                          <Lock className="w-5 h-5" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-6 h-6" />
                        ) : (
                          <span className="text-lg font-bold">{mission.day}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className={`font-semibold truncate ${isLocked ? "text-gray-500" : "text-gray-800"}`}>
                            {mission.title}
                          </h3>
                          {!isLocked && isFirst && !isCompleted && (
                            <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full shrink-0">
                              시작하기
                            </span>
                          )}
                          {!isLocked && status === 'in_progress' && (
                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full shrink-0">
                              진행 중
                            </span>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-2 ${isLocked ? "text-gray-500" : "text-gray-500"}`}>
                          {mission.mission}
                        </p>
                        <div className={`flex items-center gap-1 mt-2 text-xs ${isLocked ? "text-gray-400" : "text-gray-400"}`}>
                          <Clock className="w-3.5 h-3.5" />
                          {mission.duration}
                        </div>
                      </div>

                      {/* Arrow */}
                      <div className="shrink-0">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-400" />
                        ) : isCompleted ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <PlayCircle className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          )}

          {/* CTA */}
          <div className="mt-8 text-center">
            <button
              onClick={() => router.push(`/cc/ai-portfolio/workbook/day/1`)}
              className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
            >
              <PlayCircle className="w-5 h-5" />
              Day 1 {getDayStatus(1) === 'in_progress' ? '계속하기' : '시작하기'}
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
