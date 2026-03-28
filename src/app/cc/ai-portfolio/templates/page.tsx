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
      {copied ? '복사됨!' : 'GitHub 복사'}
    </button>
  )
}

interface Template {
  id: number
  name: string
  author: string
  siteUrl: string
  repoUrl: string
  thumbnail: string
  tags: string[]
}

const templates: Template[] = [
  {
    id: 1,
    name: 'Hamish Williams Portfolio',
    author: 'Hamish Williams',
    siteUrl: 'https://hamishw.com/',
    repoUrl: 'https://github.com/HamishMW/portfolio',
    thumbnail: '/cc/templates/01-hamish.png',
    tags: ['3D', 'Three.js', 'Dark', 'Next.js'],
  },
  {
    id: 2,
    name: 'Luxury Engineering Portfolio',
    author: 'Hatim El Hassak',
    siteUrl: 'https://hatimelhassak.is-a.dev/',
    repoUrl: 'https://github.com/hatimhtm/luxury-engineering-portfolio',
    thumbnail: '/cc/templates/02-hatim.jpeg',
    tags: ['Luxury', 'Engineering'],
  },
  {
    id: 3,
    name: 'Karthigaiselvam Portfolio',
    author: 'Karthigai Selvam',
    siteUrl: 'https://karthigaiselvamr.vercel.app/',
    repoUrl: 'https://github.com/Karthigaiselvam-R-official/Karthigaiselvam-dev',
    thumbnail: '/cc/templates/03-karthigai.jpeg',
    tags: [],
  },
  {
    id: 4,
    name: 'Saurav Portfolio',
    author: 'Saurav Singh',
    siteUrl: 'https://saurav-portfolio-updated.netlify.app/',
    repoUrl: 'https://github.com/sauravsingh6568/Saurav-Portfolio',
    thumbnail: '/cc/templates/04-saurav.jpeg',
    tags: [],
  },
  {
    id: 5,
    name: 'AWWWARDS Standard Portfolio',
    author: 'Syed Noor',
    siteUrl: 'https://syednoor.vercel.app/',
    repoUrl: 'https://github.com/syednoor058/AWWWARDS-Standard_Portfolio-Website',
    thumbnail: '/cc/templates/05-syednoor.jpeg',
    tags: ['AWWWARDS'],
  },
  {
    id: 6,
    name: 'Moncy Portfolio',
    author: 'Moncy',
    siteUrl: 'https://www.moncy.dev/',
    repoUrl: 'https://github.com/MoncyDev/Portfolio-Website',
    thumbnail: '/cc/templates/06-moncy.jpeg',
    tags: [],
  },
  {
    id: 7,
    name: 'Mohit Virli Portfolio',
    author: 'Mohit Virli',
    siteUrl: 'https://mohitvirli.github.io/',
    repoUrl: 'https://github.com/mohitvirli/mohitvirli.github.io',
    thumbnail: '/cc/templates/07-mohitvirli.jpeg',
    tags: [],
  },
  {
    id: 8,
    name: 'Vara Portfolio',
    author: 'Vara',
    siteUrl: 'https://vara-s-portfolio.vercel.app/',
    repoUrl: 'https://github.com/VARA4u-tech/Vara-s--Portfolio',
    thumbnail: '/cc/templates/08-vara.jpeg',
    tags: [],
  },
  {
    id: 9,
    name: 'Web Development Portfolio',
    author: 'Prashant Koirala',
    siteUrl: 'https://web-development-portfolio-blond.vercel.app/',
    repoUrl: 'https://github.com/prashantkoirala465/web-development-portfolio',
    thumbnail: '/cc/templates/09-prashant.jpeg',
    tags: [],
  },
]

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <Link
            href="/cc/ai-portfolio"
            className="text-sm text-gray-500 hover:text-gray-700 mb-2 inline-block"
          >
            ← AI 포트폴리오 챌린지
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">포트폴리오 템플릿</h1>
          <p className="text-gray-600 mt-1">
            GitHub에서 가져와 그대로 따라만들 수 있는 오픈소스 포트폴리오
          </p>
        </div>
      </header>

      {/* Template Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-4 text-sm text-gray-500">
          총 {templates.length}개 템플릿
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <div
              key={template.id}
              className="bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Thumbnail */}
              <div className="aspect-video bg-gray-100 relative">
                {template.thumbnail ? (
                  <Image
                    src={template.thumbnail}
                    alt={template.name}
                    fill
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
                <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                  #{template.id}
                </div>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900">{template.name}</h3>
                <p className="text-sm text-gray-500 mb-3">by {template.author}</p>

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
                  <CopyButton url={template.repoUrl} />
                  <a
                    href={template.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm py-2 px-3 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors"
                    title="GitHub 바로가기"
                  >
                    ↗
                  </a>
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
