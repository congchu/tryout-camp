'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import FAQSection from './FAQSection'

const DAYS = [
  {
    day: 1,
    emoji: '🛠',
    title: 'AI 툴 셋팅 + 타겟 분석',
    time: '30분',
    desc: 'AI 툴 설치하고, 포트폴리오 타겟 분석하기',
  },
  {
    day: 2,
    emoji: '📂',
    title: '작업물 정리 + 구성 초안',
    time: '30분',
    desc: '내 작업물 정리하고, 사이트 구성 초안 짜기',
  },
  {
    day: 3,
    emoji: '🎨',
    title: '레퍼런스 + UX 구성',
    time: '30분',
    desc: '맘에 드는 레퍼런스 고르고, UX 구성하기',
  },
  {
    day: 4,
    emoji: '🛠',
    title: '사이트 만들고 배포!',
    time: '30분',
    desc: 'AI가 만들어주고, 바로 세상에 공개하기',
  },
  {
    day: 5,
    emoji: '🔄',
    title: '피드백 받으면서 개선',
    time: '30분',
    desc: 'AI 피드백 받고 수정. 이제 시작이에요!',
  },
]

const BONUS = [
  { emoji: '🌐', title: '나만의 도메인 연결', desc: '내 도메인 링크로 공유하면 얼마나 멋있게요~?' },
  { emoji: '📊', title: '방문자 트래킹 연동', desc: '누가 내 포폴을 봤는지 확인!' },
]

// 2주 캘린더 데이터 (3/24 ~ 4/6)
type CalendarDay = {
  date: number
  day: string
  event?: string
  highlight?: boolean
  special?: boolean
  month?: number
}

const CALENDAR_WEEKS: { days: CalendarDay[] }[] = [
  {
    days: [
      { date: 0, day: '월' }, // 빈 칸
      { date: 24, day: '화' },
      { date: 25, day: '수' },
      { date: 26, day: '목' },
      { date: 27, day: '금' },
      { date: 28, day: '토', event: 'Day1', highlight: true },
      { date: 29, day: '일', event: 'Day2', highlight: true },
    ],
  },
  {
    days: [
      { date: 30, day: '월', event: 'Day3', highlight: true },
      { date: 31, day: '화', event: 'Day4', highlight: true },
      { date: 1, day: '수', event: 'Day5', highlight: true, month: 4 },
      { date: 2, day: '목', month: 4 },
      { date: 3, day: '금', event: '🍻', special: true, month: 4 },
      { date: 4, day: '토', month: 4 },
      { date: 5, day: '일', month: 4 },
    ],
  },
]

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
}

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
}

const pop = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' as const } },
}

// 포인트 폰트 스타일
const pointFont = { fontFamily: "'KyoboHandwriting2019', sans-serif" }

export default function AI5DayPortfolioChallenge() {
  const router = useRouter()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [clickedChar, setClickedChar] = useState<string | null>(null)
  const [jeongkooActive, setJeongkooActive] = useState(false)
  const [kjang1Active, setKjang1Active] = useState(false)
  const [kjang2Active, setKjang2Active] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [showBottomBar, setShowBottomBar] = useState(true)
  const [colorOffset, setColorOffset] = useState(0)

  // 타이틀 색상 배열
  const titleColors = ['#00d4aa', '#4d9fff', '#ff6633', '#ff66aa', '#aa44ff']
  const getTitleColor = (index: number) => titleColors[(index + colorOffset) % titleColors.length]

  // 색상 이동 애니메이션
  useEffect(() => {
    const colorTimer = setInterval(() => {
      setColorOffset((prev) => (prev + 1) % titleColors.length)
    }, 400)
    return () => clearInterval(colorTimer)
  }, [])

  const handleCharClick = (name: string) => {
    setClickedChar(name)
    setTimeout(() => setClickedChar(null), 600)
  }

  useEffect(() => {
    const target = new Date('2026-03-28T06:00:00+09:00')
    const timer = setInterval(() => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) {
        clearInterval(timer)
        return
      }
      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-[#c8ff00] scroll-smooth snap-y snap-mandatory overflow-y-auto h-screen">
      {/* Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nanum+Pen+Script&display=swap');
        @font-face {
          font-family: 'KyoboHandwriting2019';
          src: url('https://cdn.jsdelivr.net/gh/projectnoonnu/noonfonts_20-04@1.0/KyoboHand.woff') format('woff');
          font-weight: normal;
          font-display: swap;
        }
        html { scroll-behavior: smooth; }
      `}</style>

      {/* Hero */}
      <section className="relative overflow-hidden px-6 py-16 text-center min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        {/* 정쿠 - 왼쪽 */}
        <div className="absolute left-2 md:left-[12%] bottom-8 md:bottom-auto md:top-20 z-20">
          <motion.img
            src={jeongkooActive || clickedChar === 'jeongkoo' ? "/cc/jeongkoo_v2.png" : "/cc/jeongkoo.png"}
            alt="정쿠"
            className="w-28 md:w-40 rotate-[-5deg] cursor-pointer"
            onClick={() => handleCharClick('jeongkoo')}
            onMouseEnter={() => setJeongkooActive(true)}
            onMouseLeave={() => setJeongkooActive(false)}
            initial={{ x: -200, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              y: [0, -10, 0],
              scale: clickedChar === 'jeongkoo' ? 1.3 : 1,
              rotate: clickedChar === 'jeongkoo' ? [-5, -15, 10, -10, 5, -5] : -5,
            }}
            transition={{
              x: { duration: 0.8, ease: 'easeOut' },
              opacity: { duration: 0.8 },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
              scale: { duration: 0.3 },
              rotate: { duration: 0.5 }
            }}
          />
          {(jeongkooActive || clickedChar === 'jeongkoo') && (
            <motion.div
              className="absolute -top-4 left-full ml-2 bg-white rounded-2xl px-3 py-2 shadow-lg whitespace-nowrap text-sm font-bold"
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              AI 어렵지 않아요. 뚝딱임.
              <div className="absolute top-1/2 -left-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-r-8 border-r-white" />
            </motion.div>
          )}
        </div>

        {/* 크크웍스1 - 오른쪽 상단 */}
        <div className="absolute right-2 md:right-[12%] top-16 z-20">
          <motion.img
            src={kjang1Active || clickedChar === 'kjang1' ? "/cc/kjang1_v2.png" : "/cc/kjang1.png"}
            alt="크크웍스1"
            className="w-40 md:w-60 rotate-[8deg] cursor-pointer"
            onClick={() => handleCharClick('kjang1')}
            onMouseEnter={() => setKjang1Active(true)}
            onMouseLeave={() => setKjang1Active(false)}
            initial={{ x: 200, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              y: [0, -12, 0],
              scale: clickedChar === 'kjang1' ? 1.3 : 1,
              rotate: clickedChar === 'kjang1' ? [8, 20, -10, 15, -5, 8] : 8,
            }}
            transition={{
              x: { duration: 0.8, ease: 'easeOut', delay: 0.1 },
              opacity: { duration: 0.8, delay: 0.1 },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              scale: { duration: 0.3 },
              rotate: { duration: 0.5 }
            }}
          />
          {(kjang1Active || clickedChar === 'kjang1') && (
            <motion.div
              className="absolute -top-4 right-full mr-2 bg-white rounded-2xl px-3 py-2 shadow-lg whitespace-nowrap text-sm font-bold"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              해낼 수 있도록 도와드립니다
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
            </motion.div>
          )}
        </div>

        {/* 크크웍스2 - 오른쪽 하단 */}
        <div className="absolute right-2 md:right-[18%] bottom-8 z-20">
          <motion.img
            src={kjang2Active || clickedChar === 'kjang2' ? "/cc/kjang2_v2.png" : "/cc/kjang2.png"}
            alt="크크웍스2"
            className="w-24 md:w-44 rotate-[-3deg] cursor-pointer"
            onClick={() => handleCharClick('kjang2')}
            onMouseEnter={() => setKjang2Active(true)}
            onMouseLeave={() => setKjang2Active(false)}
            initial={{ x: 200, opacity: 0 }}
            animate={{
              x: 0,
              opacity: 1,
              y: [0, -8, 0],
              scale: clickedChar === 'kjang2' ? 1.3 : 1,
              rotate: clickedChar === 'kjang2' ? [-3, -15, 12, -8, 5, -3] : -3,
            }}
            transition={{
              x: { duration: 0.8, ease: 'easeOut', delay: 0.2 },
              opacity: { duration: 0.8, delay: 0.2 },
              y: { duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1 },
              scale: { duration: 0.3 },
              rotate: { duration: 0.5 }
            }}
          />
          {(kjang2Active || clickedChar === 'kjang2') && (
            <motion.div
              className="absolute -top-4 right-full mr-2 bg-white rounded-2xl px-3 py-2 shadow-lg whitespace-nowrap text-sm font-bold"
              initial={{ opacity: 0, scale: 0.8, x: 10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              적게 일하고 많이 벌자
              <div className="absolute top-1/2 -right-2 -translate-y-1/2 w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-white" />
            </motion.div>
          )}
        </div>

        <motion.div
          className="relative z-10"
          initial="hidden"
          animate="visible"
          variants={stagger}
        >
          <motion.p variants={fadeInUp} className="text-lg text-black/50 mb-2">
            <strong className="text-black/50">크크웍스</strong> × <strong className="text-black/50">실험마켓</strong>
          </motion.p>
          <motion.h1
            variants={pop}
            className="text-4xl md:text-7xl lg:text-8xl font-black leading-tight mb-6"
            style={{ ...pointFont, WebkitTextStroke: '3px black', paintOrder: 'stroke fill' }}
          >
            <span className="inline-block text-5xl md:text-8xl lg:text-9xl">
              {['포', '폴', ' 없', '는'].map((char, i) => (
                <span key={i} style={{ color: getTitleColor(i), transition: 'color 0.3s ease' }}>{char}</span>
              ))}
            </span>
            <br className="md:hidden" />
            <span className="inline-block">
              {[' 프', '리', '랜', '서'].map((char, i) => (
                <span key={i} style={{ color: getTitleColor(i + 4), transition: 'color 0.3s ease' }}>{char}</span>
              ))}
            </span>
            <br />
            <span className="inline-block">
              <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
              >✨</motion.span>
              {['구', '출', ' 챌', '린', '지'].map((char, i) => (
                <span key={i} style={{ color: getTitleColor(i + 8), transition: 'color 0.3s ease' }}>{char}</span>
              ))}
              <motion.span
                className="inline-block"
                animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >✨</motion.span>
            </span>
          </motion.h1>
          <motion.p variants={fadeInUp} className="text-xl md:text-2xl text-black/70 mb-8 mt-0 leading-10">
            설마 아직도 포폴 없이 견적 보내세요?<br/>
            5일 만에 AI로 멋진 포트폴리오 만들어가세요!
          </motion.p>

          {/* 카운트다운 */}


          <motion.button
            variants={pop}
            onClick={() => router.push('/cc/ai-5days-porfolio/apply')}
            className="inline-block bg-black text-[#c8ff00] text-2xl font-black px-10 py-5 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform"
          >
            지금 신청하기 🔥
          </motion.button>
        </motion.div>
      </section>

      {/* 이런 분을 위해 */}
      <section className="bg-black text-white px-6 py-16 min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#c8ff00] text-center mb-10"
            style={pointFont}
          >
            이런 분 손 🙋
          </motion.h2>
          <div className="space-y-4">
            {[
              '포트폴리오 만들어야 하는데 미루고 있는 사람',
              '디자인/코딩 못 하는데 있어보이는 사이트 갖고 싶은 사람',
              'AI로 뭘 할 수 있는지 직접 체험해보고 싶은 사람',
              '혼자 하면 안 하니까 같이 할 사람이 필요한 사람',
            ].map((text, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="flex items-start gap-3"
              >
                <span className="text-[#c8ff00] text-2xl flex-shrink-0">✓</span>
                <p className="text-lg md:text-xl">{text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 왜 우리가 뭉쳤냐면요 */}
      <section className="px-6 py-16 bg-[#c8ff00] min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
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
            왜 우리가 뭉쳤냐면요?
          </motion.h2>

          {/* 크크웍스 x 실험마켓 - PC 가로 배치 */}
          <div className="flex flex-col md:flex-row md:items-stretch gap-0 md:gap-4 ">
            {/* 크크웍스 */}
            <motion.div variants={fadeInUp} className="flex-1 bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🏠</span>
                <h3 className="text-xl font-black text-gray-900">크크웍스</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">홍대 프리랜서 작업실</p>
              <p className="text-gray-700">
                실력파 프리랜서 커뮤니티.<br />
                <strong>포폴</strong>만 있으면 더 잘 될 사람들❣️
              </p>
            </motion.div>

            {/* X 표시 (가운데) */}
            <motion.div
              variants={fadeInUp}
              className="hidden md:flex items-center justify-center px-4"
            >
              <span className="text-4xl font-black text-black/30">×</span>
            </motion.div>
            {/* 모바일 X 표시 */}
            <motion.div variants={fadeInUp} className="flex md:hidden justify-center py-2">
              <span className="text-3xl font-black text-black/30">×</span>
            </motion.div>

            {/* 실험마켓 */}
            <motion.div variants={fadeInUp} className="flex-1 bg-white rounded-2xl p-4 md:p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🧪</span>
                <h3 className="text-xl font-black text-gray-900">실험마켓</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">N잡러/프리랜서를 위한 수익화 실험 플랫폼</p>
              <p className="text-gray-700">
                초보자도 바로 따라할 수 있는 <strong>미션북</strong> 제공<br />
                막막할 땐 AI가 도와줘요 💪
              </p>
            </motion.div>
          </div>

          {/* 결론 */}
          <motion.div variants={fadeInUp} className="text-center pt-6 mt-6">
              <p className="text-xl md:text-2xl font-bold text-black/80 mb-2">
                &ldquo;포트폴리오 하나면 달라지는 게 많아요&rdquo;
              </p>
              <p className="text-black/60">
                그래서 5일 만에 끝내는 챌린지 만들었습니다🧡
              </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 이렇게 진행돼요 - 실험마켓 플로우 */}
      <section className="px-6 py-16 bg-black min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#c8ff00] text-center mb-4"
            style={pointFont}
          >
            어차피 혼자는 안 함 ㅇㅈ?
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-center text-white/60 mb-10">
            혼자 끙끙대지 마세요. 같이 해요.
          </motion.p>

          {/* 플로우 스텝 */}
          <div className="space-y-4">
            {[
              {
                step: 1,
                emoji: '📖',
                title: '재밌게 읽기',
                desc: '캐릭터가 알려주는 이론 콘텐츠',
                detail: '딱딱한 강의? 노노. 문어쌤이 재밌게 설명해줘요.',
                character: '🐙',
              },
              {
                step: 2,
                emoji: '🧪',
                title: '직접 해보기',
                desc: '하루 30분 미션 수행',
                detail: '읽기만 하면 잊어버려요. 손으로 해봐야 내 것!',
                character: '💪',
              },
              {
                step: 3,
                emoji: '💬',
                title: '슬랙에 공유',
                desc: '미션 제출 + 질문하기',
                detail: '막히면 실험마켓 주인장 "정쿠"한테 물어보세요.',
                character: '🦆',
              },
              {
                step: 4,
                emoji: '🍻',
                title: '자랑하고 축하받기',
                desc: '4/3 (목)에 모여서 결과물 자랑 타임!',
                detail: '완성된 포트폴리오 들고 와서 자랑 타임!',
                character: '🎉',
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                variants={fadeInUp}
                className="relative"
              >
                {/* 연결선 */}
                {index < 3 && (
                  <div className="absolute left-[27px] top-[72px] w-0.5 h-[calc(100%-32px)] bg-[#c8ff00]/30" />
                )}

                <div className="flex gap-4">
                  {/* 스텝 번호 */}
                  <div className="flex-shrink-0">
                    <motion.div
                      className="w-14 h-14 rounded-full bg-[#c8ff00] text-black flex items-center justify-center text-2xl font-black"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {item.emoji}
                    </motion.div>
                  </div>

                  {/* 내용 */}
                  <div className="flex-1 bg-white/5 rounded-2xl p-4 hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-black text-white">{item.title}</h3>
                      <span className="text-xl">{item.character}</span>
                    </div>
                    <p className="text-[#c8ff00] text-sm font-medium mb-2">{item.desc}</p>
                    <p className="text-white/50 text-sm">{item.detail}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </motion.div>
      </section>

      {/* 과제 도움 섹션 */}
      <section className="px-6 py-16 bg-black min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-center text-[#c8ff00] font-black text-3xl md:text-5xl lg:text-6xl mb-8"
            style={pointFont}
          >
            걱정마세요.<br />
            과제를 반드시 할 수 있도록<br />
            도와드립니다💚
          </motion.h2>
          <motion.div variants={fadeInUp} className="flex flex-col items-center">
            <video
              src="/gif.mov"
              autoPlay
              loop
              muted
              playsInline
              className="w-full max-w-md rounded-2xl shadow-2xl"
            />
            <p className="text-white text-sm mt-4 text-center">
              * AI가 만든 영상입니다. 크장님이 정말로 후두려패진 않습니다. (아마도...?)
            </p>
          </motion.div>
        </motion.div>
      </section>

      {/* 5일 커리큘럼 */}
      <section className="px-6 py-16 bg-white min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-4"
            style={pointFont}
          >
            이렇게 진행돼요
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-center text-gray-900 mb-10 text-4xl">
            매일 30분, 커피 한 잔이면 끝 ☕️
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="bg-gray-50 rounded-2xl border-2 border-gray-100 p-4 md:p-6"
          >
            <div className="space-y-4">
              {DAYS.map((d, i) => (
                <div key={d.day}>
                  <div className="flex items-center gap-3">
                    <span className="bg-black text-[#c8ff00] text-sm font-black w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0">
                      D{d.day}
                    </span>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-800">
                        {d.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{d.desc}</p>
                    </div>
                  </div>
                  {i < DAYS.length - 1 && <div className="border-b border-gray-200 mt-4" />}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.p variants={fadeInUp} className="text-center text-gray-400 text-sm mt-8">
            * 상세 커리큘럼은 챌린지 시작 전 변경될 수 있습니다!
          </motion.p>
        </motion.div>
      </section>

      {/* 보너스 미션 */}
      <section className="px-6 py-16 bg-black min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#c8ff00] text-center mb-4"
            style={pointFont}
          >
            🎯 보너스 미션도 있어요~
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-center text-white/60 mb-10">
            선택 사항이에요. 여유 있으면 도전!
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {BONUS.map((b, i) => (
              <motion.div
                key={i}
                variants={fadeInUp}
                className="bg-white/10 border border-white/20 rounded-2xl p-6 flex items-start gap-4"
              >
                <span className="text-4xl">{b.emoji}</span>
                <div>
                  <p className="text-lg font-bold text-white">{b.title}</p>
                  <p className="text-sm text-white/60 mt-1 whitespace-pre-line">{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 일정 - 2주 캘린더 */}
      <section className="px-6 py-16 bg-[#c8ff00] min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-3xl mx-auto w-full"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-center mb-6 text-gray-900"
            style={pointFont}
          >
            일정을 참고해주세요
          </motion.h2>

          {/* 주요 일정 */}
          <motion.div variants={fadeInUp} className="mb-8 flex items-center justify-center gap-4">
            <span className="inline-flex items-center gap-2 bg-black text-[#c8ff00] px-4 py-2 rounded-full text-sm font-bold">
              🚀 3/28 시작
            </span>
            <span className="text-gray-400">···</span>
            <span className="inline-flex items-center gap-2 bg-black text-[#c8ff00] px-4 py-2 rounded-full text-sm font-bold">
              🍻 4/3 뒷풀이
            </span>
          </motion.div>

          {/* 캘린더 */}
          <motion.div variants={fadeInUp} className="bg-white rounded-2xl p-4 md:p-6 shadow-sm">
            {/* 요일 헤더 */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['월', '화', '수', '목', '금', '토', '일'].map((d) => (
                <div key={d} className="text-center text-sm font-bold text-gray-400 py-2">
                  {d}
                </div>
              ))}
            </div>

            {/* 주차별 날짜 */}
            {CALENDAR_WEEKS.map((week, weekIndex) => (
              <div key={weekIndex} className="grid grid-cols-7 gap-1 mb-1">
                {week.days.map((d, dayIndex) => (
                  d.date === 0 ? (
                    <div key={dayIndex} className="py-3 md:py-4" />
                  ) : (
                    <motion.div
                      key={dayIndex}
                      className={`relative text-center py-3 md:py-4 rounded-xl transition-all ${
                        d.highlight
                          ? 'bg-black text-[#c8ff00] font-black'
                          : 'special' in d && d.special
                          ? 'bg-[#c8ff00] text-black font-black border-2 border-black'
                          : 'text-gray-600'
                      }`}
                      whileHover={{ scale: d.highlight || d.special ? 1.1 : 1 }}
                    >
                      <span className="text-sm md:text-base">{d.date}</span>
                      {d.event && (
                        <span className={`block text-xs mt-0.5 ${d.highlight ? 'text-[#c8ff00]' : ''}`}>
                          {d.event}
                        </span>
                      )}
                    </motion.div>
                  )
                ))}
              </div>
            ))}

            {/* 범례 */}
            <div className="flex flex-wrap justify-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-black rounded"></div>
                <span className="text-sm text-gray-600">챌린지 진행</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-[#c8ff00] border-2 border-black rounded"></div>
                <span className="text-sm text-gray-600">뒷풀이 겸 축하모임</span>
              </div>
            </div>
          </motion.div>

          {/* 안내 사항 */}
          <motion.div variants={fadeInUp} className="mt-6 space-y-2 text-sm text-black/60">
            <p>* 미션은 5일치로 제공되지만, 본인 속도에 맞춰 진행하면 돼요. 꼭 그날 안에 끝낼 필요 없어요!</p>
            <p>* 단, 4/3 뒷풀이 전까지 최종 과제를 제출해야 환급이 됩니다.</p>
            <p>* 4/3 뒷풀이 겸 축하모임에서는 각자 만든 포트폴리오 자랑 + 서로 피드백 + 뒷풀이 🍻</p>
          </motion.div>
        </motion.div>
      </section>

      {/* 이런 페이지를 만들 수 있어요 */}
      <section className="px-6 py-16 bg-black min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#c8ff00] text-center mb-4"
            style={pointFont}
          >
            나만의 페이지를 만들어요
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-center text-white/60 mb-10">
            직접 만들기 전에, 미리 구경해보세요! 샘플은 계속 추가될 에정입니다😘
          </motion.p>

          {/* 예시 포트폴리오 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: '디자이너 포트폴리오',
                url: '/cc/sample/designer-sample.html',
                thumbnail: '/cc/sample/designer-mockup.png',
              },
              {
                title: '마케터 포트폴리오',
                url: '#',
                thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
                coming: true,
              },
              {
                title: '개발자 포트폴리오',
                url: '#',
                thumbnail: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop',
                coming: true,
              },
            ].map((item, i) => (
              <motion.a
                key={i}
                variants={fadeInUp}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all ${
                  item.coming ? 'pointer-events-none' : ''
                }`}
                whileHover={{ scale: item.coming ? 1 : 1.03 }}
              >
                {/* 썸네일 */}
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className={`w-full h-full object-cover transition-transform group-hover:scale-105 ${
                      item.coming ? 'opacity-50 blur-sm' : ''
                    }`}
                  />
                </div>

                {/* 타이틀 */}
                <div className="p-4">
                  <p className="font-bold text-gray-900">{item.title}</p>
                  {!item.coming && (
                    <p className="text-sm text-gray-500 mt-1">클릭해서 보기 →</p>
                  )}
                </div>

                {/* Coming Soon 오버레이 */}
                {item.coming && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span className="bg-black text-[#c8ff00] px-4 py-2 rounded-full text-sm font-bold">
                      Coming Soon
                    </span>
                  </div>
                )}
              </motion.a>
            ))}
          </div>

                  </motion.div>
      </section>

      <FAQSection />

      {/* CTA */}
      <section id="apply" className="bg-black text-white px-6 py-20 text-center min-h-screen flex flex-col justify-center snap-start" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <motion.div
          className="max-w-2xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={stagger}
        >
          <motion.h2
            variants={fadeInUp}
            className="text-3xl md:text-5xl lg:text-6xl font-black text-[#c8ff00] mb-4"
            style={pointFont}
          >
            5일 후, 나만의 포트폴리오가 생긴다
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-gray-400 text-lg mb-6">
            더 이상 미루지 마. AI가 도와줄게.
          </motion.p>

          {/* 보증금 정보 */}
          <motion.div variants={fadeInUp} className="mb-8">
            <span className="inline-block bg-white/10 rounded-full px-4 py-2 text-sm">
              도망 못 가게 <span className="text-[#c8ff00] font-black">3만원</span> 걸어요 · 다 하면 <span className="text-[#c8ff00] font-black">돌려줌</span>
            </span>
          </motion.div>

          <motion.button
            variants={pop}
            onClick={() => router.push('/cc/ai-5days-porfolio/apply')}
            className="inline-block bg-[#c8ff00] text-black text-2xl font-black px-12 py-6 rounded-full shadow-xl cursor-pointer hover:scale-105 transition-transform"
          >
            지금 신청하기 🔥
          </motion.button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 px-6 py-8 text-center" style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}>
        <button
          onClick={() => setShowPopup(true)}
          className="text-[#c8ff00]/60 hover:text-[#c8ff00] text-sm mb-4 inline-block transition-colors cursor-pointer"
        >
          이미 신청했다면? 로그인하기 →
        </button>
        <p className="text-gray-500 text-sm">
          크크웍스 × 실험마켓 | 문의: cookie00421@gmail.com
        </p>
      </footer>

      {/* 오픈 예정 팝업 */}
      {showPopup && (
        <motion.div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPopup(false)}
        >
          <motion.div
            className="bg-[#c8ff00] rounded-3xl p-8 max-w-sm text-center shadow-2xl"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}
          >
            <p className="text-5xl mb-4">🧡</p>
            <h3 className="text-2xl font-black text-black mb-2">3/20 오픈 예정!</h3>
            <p className="text-lg text-black/70 mb-6">많관부~</p>
            <button
              onClick={() => setShowPopup(false)}
              className="bg-black text-[#c8ff00] px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
            >
              확인 👍
            </button>
          </motion.div>
        </motion.div>
      )}

      {/* 모바일 하단 고정 바 */}
      {showBottomBar && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 bg-black border-t border-white/10 px-4 py-3 md:hidden z-40"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          style={{ fontFamily: "'KyoboHandwriting2019', sans-serif" }}
        >
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => setShowBottomBar(false)}
              className="text-white/40 hover:text-white/60 p-1"
            >
              ✕
            </button>
            <p className="text-white/60 text-sm flex-1">3/28 시작 · 보증금 3만원</p>
            <button
              onClick={() => router.push('/cc/ai-5days-porfolio/apply')}
              className="bg-[#c8ff00] text-black text-sm font-black px-4 py-2 rounded-full cursor-pointer hover:scale-105 transition-transform"
            >
              지금 신청하기 🔥
            </button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
