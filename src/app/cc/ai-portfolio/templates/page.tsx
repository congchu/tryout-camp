'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'

function CopyButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="flex-1 text-center text-sm py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
    >
      {copied ? '복사됨!' : 'GitHub링크 복사'}
    </button>
  )
}

interface Template {
  id: number
  name: string
  author: string
  description: string
  siteUrl: string
  repoUrl: string
  thumbnail: string
  tags: string[]
  category?: string
  type?: 'template' | 'reference'
}

const templates: Template[] = [
  {
    id: 1,
    name: 'Hamish Williams Portfolio',
    author: 'Hamish Williams',
    description: '3D 애니메이션과 다크테마. 개발자/크리에이터에게 추천',
    siteUrl: 'https://hamishw.com/',
    repoUrl: 'https://github.com/HamishMW/portfolio',
    thumbnail: '/cc/templates/01-hamish.png',
    tags: ['3D', 'Dark', 'Next.js'],
    type: 'template',
  },
  {
    id: 2,
    name: 'Luxury Engineering Portfolio',
    author: 'Hatim El Hassak',
    description: '럭셔리하고 고급스러운 느낌. 프리미엄 브랜딩에 적합',
    siteUrl: 'https://hatimelhassak.is-a.dev/',
    repoUrl: 'https://github.com/hatimhtm/luxury-engineering-portfolio',
    thumbnail: '/cc/templates/02-hatim.jpeg',
    tags: ['Luxury', 'Elegant'],
    type: 'template',
  },
  {
    id: 3,
    name: 'Karthigaiselvam Portfolio',
    author: 'Karthigai Selvam',
    description: '깔끔한 그리드 레이아웃. 심플하고 정돈된 느낌',
    siteUrl: 'https://karthigaiselvamr.vercel.app/',
    repoUrl: 'https://github.com/Karthigaiselvam-R-official/Karthigaiselvam-dev',
    thumbnail: '/cc/templates/03-karthigai.jpeg',
    tags: ['Clean', 'Grid'],
    type: 'template',
  },
  {
    id: 4,
    name: 'Saurav Portfolio',
    author: 'Saurav Singh',
    description: '모던한 UI와 스크롤 애니메이션. 개발자 포트폴리오',
    siteUrl: 'https://saurav-portfolio-updated.netlify.app/',
    repoUrl: 'https://github.com/sauravsingh6568/Saurav-Portfolio',
    thumbnail: '/cc/templates/04-saurav.jpeg',
    tags: ['Modern', 'Developer'],
    type: 'template',
  },
  {
    id: 5,
    name: 'AWWWARDS Standard Portfolio',
    author: 'Syed Noor',
    description: 'AWWWARDS 스타일. 트렌디한 인터랙션과 타이포그래피',
    siteUrl: 'https://syednoor.vercel.app/',
    repoUrl: 'https://github.com/syednoor058/AWWWARDS-Standard_Portfolio-Website',
    thumbnail: '/cc/templates/05-syednoor.jpeg',
    tags: ['AWWWARDS', 'Trendy'],
    type: 'template',
  },
  {
    id: 6,
    name: 'Moncy Portfolio',
    author: 'Moncy',
    description: '미니멀한 디자인. 콘텐츠에 집중하는 레이아웃',
    siteUrl: 'https://www.moncy.dev/',
    repoUrl: 'https://github.com/MoncyDev/Portfolio-Website',
    thumbnail: '/cc/templates/06-moncy.jpeg',
    tags: ['Minimal'],
    type: 'template',
  },
  {
    id: 7,
    name: 'Mohit Virli Portfolio',
    author: 'Mohit Virli',
    description: '컬러풀하고 개성있는 디자인. 크리에이티브 직군에 추천',
    siteUrl: 'https://mohitvirli.github.io/',
    repoUrl: 'https://github.com/mohitvirli/mohitvirli.github.io',
    thumbnail: '/cc/templates/07-mohitvirli.jpeg',
    tags: ['Colorful', 'Creative'],
    type: 'template',
  },
  {
    id: 8,
    name: 'Vara Portfolio',
    author: 'Vara',
    description: '다크 테마와 네온 컬러. 강렬한 첫인상',
    siteUrl: 'https://vara-s-portfolio.vercel.app/',
    repoUrl: 'https://github.com/VARA4u-tech/Vara-s--Portfolio',
    thumbnail: '/cc/templates/08-vara.jpeg',
    tags: ['Dark', 'Neon'],
    type: 'template',
  },
  {
    id: 9,
    name: 'Web Development Portfolio',
    author: 'Prashant Koirala',
    description: '프로페셔널한 레이아웃. 경력 개발자에게 적합',
    siteUrl: 'https://web-development-portfolio-blond.vercel.app/',
    repoUrl: 'https://github.com/prashantkoirala465/web-development-portfolio',
    thumbnail: '/cc/templates/09-prashant.jpeg',
    tags: ['Professional'],
    type: 'template',
  },
  {
    id: 10,
    name: '3D Portfolio',
    author: 'Shubam',
    description: '3D 요소 활용. 임팩트 있는 첫인상을 원할 때',
    siteUrl: 'https://shubam.netlify.app/',
    repoUrl: 'https://github.com/sanidhyy/3d-portfolio',
    thumbnail: '/cc/templates/10-shubam.jpeg',
    tags: ['3D', 'Impact'],
    type: 'template',
  },
  {
    id: 11,
    name: 'Modern Portfolio',
    author: 'Sanidhyy',
    description: '모던하고 세련된 디자인. 균형잡힌 레이아웃',
    siteUrl: 'https://awersome-portfolio.netlify.app/',
    repoUrl: 'https://github.com/sanidhyy/modern-portfolio',
    thumbnail: '/cc/templates/11-awersome.jpeg',
    tags: ['Modern', 'Balanced'],
    type: 'template',
  },
  {
    id: 12,
    name: 'AW 2025 Portfolio',
    author: 'Antoine Wodniack',
    description: '실험적인 인터랙션. 독특한 UX를 원할 때',
    siteUrl: 'https://wodniack.dev/',
    repoUrl: 'https://github.com/AntoineW/AW-2025-Portfolio',
    thumbnail: '/cc/templates/12-wodniack.jpeg',
    tags: ['Experimental', 'Interactive'],
    type: 'template',
  },
  {
    id: 13,
    name: 'Personal Portfolio',
    author: 'Veridiite',
    description: '심플하고 깔끔한 구성. 입문자에게 추천',
    siteUrl: 'https://personal-portfolio-sage-theta-40.vercel.app/',
    repoUrl: 'https://github.com/VERIDIITE/Personal-Portfolio',
    thumbnail: '/cc/templates/13-veridiite.jpeg',
    tags: ['Simple', 'Beginner'],
    type: 'template',
  },
  // Builder 스타일 (2/14)
  {
    id: 14,
    name: 'Mr. Panda\'s Portfolio',
    author: 'Mr. Panda',
    description: '심리적으로 안전한 공간을 강조하는 독특한 컨셉 포트폴리오',
    siteUrl: 'https://mr-pandas-psychologically-safe-portfolio.com/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Builder', 'Unique', 'Concept'],
    category: 'Builder',
  },
  {
    id: 15,
    name: 'Chloe Yan Portfolio',
    author: 'Chloe Yan',
    description: '깔끔하고 세련된 디자이너 포트폴리오',
    siteUrl: 'https://chloeyan.me/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Builder', 'Clean', 'Designer'],
    category: 'Builder',
  },
  {
    id: 16,
    name: 'Wora Work',
    author: 'Wora',
    description: '작업물 중심의 포트폴리오, 깔끔한 레이아웃',
    siteUrl: 'https://worawork.vercel.app/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Builder', 'Work-focused'],
    category: 'Builder',
  },
  {
    id: 17,
    name: 'Fiona Fang Portfolio',
    author: 'Fiona Fang',
    description: '캐나다 기반 디자이너의 감각적인 포트폴리오',
    siteUrl: 'https://fionafang.ca/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Builder', 'Designer', 'Creative'],
    category: 'Builder',
  },
  // Hybrid 스타일 (4/14)
  {
    id: 18,
    name: 'Jackie Zhang Portfolio',
    author: 'Jackie Zhang',
    description: '개발+디자인 하이브리드 스타일의 포트폴리오',
    siteUrl: 'https://jackiezhang.co.za/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Hybrid', 'Developer', 'Designer'],
    category: 'Hybrid',
  },
  {
    id: 19,
    name: 'Bohdan Design',
    author: 'Bohdan',
    description: '디자인에 집중한 하이브리드 포트폴리오',
    siteUrl: 'https://bohdan.design/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Hybrid', 'Design-focused'],
    category: 'Hybrid',
  },
  {
    id: 20,
    name: 'Sebastian Martinez',
    author: 'Sebastian Martinez',
    description: '스토리텔링이 강한 하이브리드 포트폴리오',
    siteUrl: 'https://sebastian-martinez.com/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Hybrid', 'Storytelling'],
    category: 'Hybrid',
  },
  {
    id: 21,
    name: 'Wildy Riftian',
    author: 'Wildy Riftian',
    description: '개성 있는 비주얼과 인터랙션의 하이브리드 포트폴리오',
    siteUrl: 'https://wildyriftian.com/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Hybrid', 'Interactive', 'Visual'],
    category: 'Hybrid',
  },
  // Nostalgia 스타일 (6/14)
  {
    id: 22,
    name: 'Renee Wiki',
    author: 'Renee',
    description: '위키 스타일의 개성 있는 노스탤지아 포트폴리오',
    siteUrl: 'https://renee.wiki/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Nostalgia', 'Wiki', 'Unique'],
    category: 'Nostalgia',
  },
  {
    id: 23,
    name: 'Ryo OS Portfolio',
    author: 'Ryo',
    description: 'OS 인터페이스를 모방한 독특한 노스탤지아 포트폴리오',
    siteUrl: 'https://os.ryo.lu/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Nostalgia', 'OS-style', 'Interactive'],
    category: 'Nostalgia',
  },
  {
    id: 24,
    name: 'Dave OS',
    author: 'Dave',
    description: '재미있고 창의적인 OS 테마 포트폴리오',
    siteUrl: 'https://daveos.fun/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Nostalgia', 'Fun', 'Creative'],
    category: 'Nostalgia',
  },
  {
    id: 25,
    name: 'Adam C Lambert',
    author: 'Adam C Lambert',
    description: '클래식하고 세련된 노스탤지아 감성 포트폴리오',
    siteUrl: 'https://adamclambert.com/',
    repoUrl: '',
    thumbnail: '',
    tags: ['Nostalgia', 'Classic', 'Elegant'],
    category: 'Nostalgia',
  },
  {
    id: 26,
    name: 'ElMehdi Bekkous Portfolio',
    author: 'ElMehdi Bekkous',
    description: '깔끔한 레이아웃의 개발자 포트폴리오. 오픈소스로 그대로 활용 가능',
    siteUrl: 'https://elmehdibekkousportfolio.vercel.app',
    repoUrl: 'https://github.com/ElMehdiBekkous/MyPortfolio',
    thumbnail: '',
    tags: ['Clean', 'Developer', 'Modern'],
    type: 'template',
  },
]

const CATEGORIES = ['전체', 'Builder', 'Hybrid', 'Nostalgia']
const TYPES = ['전체', '오픈소스 템플릿', '레퍼런스']

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState<string>('전체')
  const [activeType, setActiveType] = useState<string>('전체')

  const filtered = templates.filter(t => {
    const matchCategory = activeCategory === '전체' || t.category === activeCategory
    const matchType =
      activeType === '전체' ||
      (activeType === '오픈소스 템플릿' && t.type === 'template') ||
      (activeType === '레퍼런스' && t.type !== 'template')
    return matchCategory && matchType
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/cc/ai-portfolio"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            &larr; AI 포트폴리오 챌린지
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">포트폴리오 템플릿</h1>
          <p className="text-gray-600 mt-1">
            GitHub에서 가져와 그대로 따라만들 수 있는 오픈소스 포트폴리오
          </p>
        </div>
      </header>

      {/* Template Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 필터 */}
        <div className="flex flex-col gap-3 mb-6">
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-400 w-12">종류</span>
            {TYPES.map(t => (
              <button
                key={t}
                onClick={() => setActiveType(t)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeType === t
                    ? 'bg-[#c8ff00] text-black'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-xs text-gray-400 w-12">스타일</span>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === cat
                    ? 'bg-[#c8ff00] text-black'
                    : 'bg-white border border-gray-300 text-gray-600 hover:border-gray-400'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4 text-sm text-gray-500">
          총 {filtered.length}개 템플릿
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div
                onClick={() => window.open(template.siteUrl, '_blank')}
                className="aspect-video bg-gray-100 relative cursor-pointer group overflow-hidden"
              >
                {template.thumbnail ? (
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 text-white text-sm font-medium bg-black/70 px-3 py-1.5 rounded transition-opacity">
                    미리보기
                  </span>
                </div>
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{template.id}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-600 mt-1 mb-2">{template.description}</p>
                <p className="text-xs text-gray-400 mb-3">by {template.author}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 타입 뱃지 */}
                <div className="mb-3">
                  {template.type === 'template' ? (
                    <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full font-medium">
                      🔓 오픈소스 템플릿
                    </span>
                  ) : (
                    <span className="text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full font-medium">
                      👁 레퍼런스
                    </span>
                  )}
                </div>

                {/* Links */}
                <div className="flex gap-2">
                  <a
                    href={template.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center text-sm py-2 bg-gray-900 text-white rounded hover:bg-gray-800 transition-colors"
                  >
                    사이트 보기
                  </a>
                  {template.type === 'template' && template.repoUrl && (
                    <>
                      <CopyButton url={template.repoUrl} />
                      <a
                        href={template.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm py-2 px-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                        title="GitHub 바로가기"
                      >
                        →
                      </a>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coming Soon */}
        <div className="mt-12 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">더 많은 템플릿이 추가될 예정입니다</p>
          <p className="text-sm text-gray-400 mt-1">목표: 20개</p>
        </div>
      </main>
    </div>
  )
}
