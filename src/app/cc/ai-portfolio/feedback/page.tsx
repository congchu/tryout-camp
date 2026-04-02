'use client'

import { useState } from 'react'
import { ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'

const DAYS = [
  { day: 1, title: 'Lovable로 웹사이트 만들기' },
  { day: 2, title: 'Codex로 레퍼런스 따라만들기' },
  { day: 3, title: '콘텐츠 완성 (내 정보 업데이트)' },
  { day: 4, title: 'Netlify로 배포하기' },
  { day: 5, title: 'Mixpanel로 방문자 확인' },
  { day: 6, title: '커스텀 도메인 연결' },
]

const DIFFICULTY_OPTIONS = ['안했어요', '쉬웠어요', '적당했어요', '어려웠어요']
const AMOUNT_OPTIONS = ['적었어요', '적당했어요', '많았어요']

export default function FeedbackPage() {
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // Form states
  const [name, setName] = useState('')
  const [expectation, setExpectation] = useState<string>('')
  const [nps, setNps] = useState<number | null>(null)
  const [recommendTo, setRecommendTo] = useState('')
  const [portfolioComplete, setPortfolioComplete] = useState<string>('')
  const [dayDifficulty, setDayDifficulty] = useState<Record<number, string>>({})
  const [amount, setAmount] = useState<string>('')
  const [feedback, setFeedback] = useState('')
  const [mindsetChange, setMindsetChange] = useState('')
  const [wantToLearn, setWantToLearn] = useState<string[]>([])
  const [wantToLearnOther, setWantToLearnOther] = useState('')
  const [lastWord, setLastWord] = useState('')

  const isFormValid =
    name.trim() &&
    expectation &&
    nps !== null &&
    recommendTo.trim() &&
    portfolioComplete &&
    Object.keys(dayDifficulty).length === 6 &&
    amount &&
    mindsetChange.trim()

  const handleSubmit = async () => {
    if (!isFormValid || submitting) return

    setSubmitting(true)
    try {
      const response = await fetch('/api/feedback-slack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          expectation,
          nps,
          recommendTo,
          portfolioComplete,
          dayDifficulty,
          amount,
          mindsetChange,
          wantToLearn,
          wantToLearnOther,
          feedback,
          lastWord,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      } else {
        alert('제출에 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('제출에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            피드백 감사합니다!
          </h1>
          <p className="text-gray-500 mb-8">
            소중한 의견 반영해서 더 나은 챌린지 만들게요
          </p>
          <Link
            href="/cc/ai-portfolio/workbook"
            className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            워크북으로 돌아가기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <section className="pt-14 pb-8 px-4">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/cc/ai-portfolio/workbook"
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            워크북으로 돌아가기
          </Link>

          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            AI 포폴 만들기 챌린지 피드백
          </h1>
          <p className="text-gray-500">
            5일 챌린지 어떠셨나요? 솔직한 피드백 부탁드려요!
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="px-4 pb-20">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* 이름 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="홍길동"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
            />
          </div>

          {/* 섹션: 만족도 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-8">
            <h2 className="text-lg font-bold text-gray-800">만족도</h2>

            {/* 만족도 (5점) */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                챌린지 전체적으로 얼마나 만족하셨나요? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => setExpectation(String(num))}
                    className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                      expectation === String(num)
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <span>기대 이하</span>
                <span>기대 이상</span>
              </div>
            </div>

            {/* NPS */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                주변에 이 챌린지를 추천하시겠어요? <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-11 gap-1">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => setNps(num)}
                    className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                      nps === num
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
                <span>전혀 아니요</span>
                <span>무조건이요!</span>
              </div>
            </div>

            {/* 추천 대상 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                추천한다면, 어떤 분들께 추천하고 싶으세요? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={recommendTo}
                onChange={(e) => setRecommendTo(e.target.value)}
                placeholder="예: 프리랜서 디자이너, 회사 소개 페이지 필요한 사람"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* 섹션: 콘텐츠 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-8">
            <h2 className="text-lg font-bold text-gray-800">콘텐츠</h2>

            {/* 결과물 완성도 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                실제로 쓸 수 있는 포트폴리오가 만들어졌나요? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {['네, 바로 쓸 수 있어요', '조금 더 다듬으면 될 것 같아요', '아직 완성 못했어요'].map((option) => (
                  <button
                    key={option}
                    onClick={() => setPortfolioComplete(option)}
                    className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all ${
                      portfolioComplete === option
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* 분량 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                하루에 할당된 분량은 어땠나요? <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                {AMOUNT_OPTIONS.map((option) => (
                  <button
                    key={option}
                    onClick={() => setAmount(option)}
                    className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                      amount === option
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>

            {/* Day별 난이도 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                각 Day의 난이도는 어땠나요? <span className="text-red-500">*</span>
              </label>
              <div className="space-y-4">
                {DAYS.map(({ day, title }) => (
                  <div key={day}>
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Day {day}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        {title}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {DIFFICULTY_OPTIONS.map((option) => (
                        <button
                          key={option}
                          onClick={() => setDayDifficulty(prev => ({ ...prev, [day]: option }))}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                            dayDifficulty[day] === option
                              ? 'bg-orange-500 text-white'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 섹션: 의견 */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-8">
            <h2 className="text-lg font-bold text-gray-800">의견</h2>

            {/* 생각 변화 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                챌린지 전/후로 AI에 대한 생각이 어떻게 바뀌었나요? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={mindsetChange}
                onChange={(e) => setMindsetChange(e.target.value)}
                placeholder="예: 어려울 것 같았는데 생각보다 쉬웠다. 근데 잘쓰려면 어려운거 같다"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>

            {/* 심화 과정 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                AI 포폴 챌린지 심화 과정이 생긴다면, 더 알고 싶은 건? <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <div className="space-y-2">
                {[
                  'AI 도구 다양하게 써보기 (Cursor, v0 등)',
                  'HTML/CSS 기초 (직접 수정하고 싶어요)',
                  '에러 잡는 법 (막혔을 때 해결하고 싶어요)',
                  '프롬프팅 방법 (AI한테 잘 시키고 싶어요)',
                  '디자인 레퍼런스/템플릿 (다양한 예시가 보고 싶어요)',
                  '개발 용어 (무슨 말인지 알고 싶어요)',
                  '자동화/노코드 (반복 작업 줄이고 싶어요)',
                ].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={wantToLearn.includes(option)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setWantToLearn([...wantToLearn, option])
                        } else {
                          setWantToLearn(wantToLearn.filter(item => item !== option))
                        }
                      }}
                      className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
                {/* 기타 옵션 */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={wantToLearn.includes('기타')}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setWantToLearn([...wantToLearn, '기타'])
                      } else {
                        setWantToLearn(wantToLearn.filter(item => item !== '기타'))
                        setWantToLearnOther('')
                      }
                    }}
                    className="w-5 h-5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">기타</span>
                </label>
                {wantToLearn.includes('기타') && (
                  <input
                    type="text"
                    value={wantToLearnOther}
                    onChange={(e) => setWantToLearnOther(e.target.value)}
                    placeholder="직접 입력해주세요"
                    className="ml-8 w-[calc(100%-2rem)] px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
                )}
              </div>
            </div>

            {/* 다음 챌린지 주제 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                다음에 이런 챌린지 있으면 해보고 싶다! <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="예: 카드뉴스 만들기, 블로그 만들기, 뉴스레터 자동화, 기획 아이디어 받기"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>

            {/* 마지막으로 하고 싶은 말 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                마지막으로 하고 싶은 말 <span className="text-gray-400 font-normal">(선택)</span>
              </label>
              <textarea
                value={lastWord}
                onChange={(e) => setLastWord(e.target.value)}
                placeholder="자유롭게 작성해주세요"
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none text-gray-900 bg-white"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!isFormValid || submitting}
            className="w-full py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                제출 중...
              </>
            ) : (
              '피드백 제출하기'
            )}
          </button>
        </div>
      </section>
    </div>
  )
}
