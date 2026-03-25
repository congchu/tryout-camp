'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface AIMissionHelperProps {
  desktopOpen: boolean
  setDesktopOpen: (v: boolean) => void
  day?: number
  missionTitle?: string
  missionContent?: string
}

const QUICK_CHIPS = [
  '오늘 뭐 해야 해?',
  '어디서 막혔는지 모르겠어',
  '내가 쓴 거 봐줘',
  '예시 보여줘',
]

function BounceDots() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full bg-orange-400"
          style={{
            animation: 'bounce-dot 1.2s infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes bounce-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
      `}</style>
    </div>
  )
}

export default function AIMissionHelper({
  desktopOpen,
  setDesktopOpen,
  day,
  missionTitle,
  missionContent,
}: AIMissionHelperProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return

    const userMessage: Message = { role: 'user', content: text.trim() }
    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/chat/workbook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          day,
          missionTitle,
          missionContent,
        }),
      })

      if (!res.ok) throw new Error('API error')
      const data = await res.json()
      setMessages([...newMessages, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: '앗, 잠깐 문제가 생겼어요. 다시 한 번 물어봐 주세요!' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const chatContent = (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐙</span>
          <div>
            <h3 className="text-sm font-bold text-gray-900">문어쌤</h3>
            <p className="text-xs text-gray-400">AI 미션 도우미</p>
          </div>
        </div>
        {/* Desktop: close sidebar, Mobile: close fullscreen */}
        <button
          onClick={() => {
            setDesktopOpen(false)
            setMobileOpen(false)
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <span className="text-4xl mb-3">🐙</span>
            <p className="text-gray-900 font-bold text-base mb-1">안녕! 문어쌤이에요</p>
            <p className="text-gray-400 text-sm mb-6">
              {day ? `Day ${day} 미션에 대해 궁금한 거 물어봐요!` : '미션에 대해 궁금한 거 물어봐요!'}
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {QUICK_CHIPS.map((chip) => (
                <button
                  key={chip}
                  onClick={() => sendMessage(chip)}
                  className="px-3 py-1.5 rounded-full border border-orange-200 text-sm text-orange-600 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <span className="text-lg mr-2 flex-shrink-0 mt-1">🐙</span>
            )}
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-orange-500 text-white rounded-br-md'
                  : 'bg-gray-100 text-gray-800 rounded-bl-md'
              }`}
            >
              {msg.role === 'assistant' ? (
                <div className="prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:my-2 prose-code:text-orange-600 prose-code:bg-orange-50 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-xs">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <span className="text-lg mr-2 flex-shrink-0 mt-1">🐙</span>
            <div className="bg-gray-100 rounded-2xl rounded-bl-md px-4 py-2">
              <BounceDots />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick chips (when messages exist) */}
      {messages.length > 0 && !loading && (
        <div className="px-4 pb-2 flex gap-2 overflow-x-auto flex-shrink-0">
          {QUICK_CHIPS.map((chip) => (
            <button
              key={chip}
              onClick={() => sendMessage(chip)}
              className="px-3 py-1 rounded-full border border-gray-200 text-xs text-gray-500 hover:bg-gray-50 transition-colors whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <form onSubmit={handleSubmit} className="px-4 py-3 border-t border-gray-100 flex-shrink-0">
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="문어쌤에게 질문하기..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-orange-300 focus:ring-1 focus:ring-orange-300 bg-white"
            style={{ maxHeight: '100px' }}
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-orange-500 text-white disabled:opacity-40 hover:bg-orange-600 transition-colors cursor-pointer flex-shrink-0"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </form>
    </div>
  )

  return (
    <>
      {/* Desktop: Right sidebar panel */}
      <div
        className={`hidden md:flex fixed top-0 right-0 h-full z-40 transition-transform duration-300 ease-in-out ${
          desktopOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: '380px' }}
      >
        <div className="w-full h-full shadow-2xl border-l border-gray-200">
          {chatContent}
        </div>
      </div>

      {/* Desktop: Toggle button (when closed) */}
      {!desktopOpen && (
        <button
          onClick={() => setDesktopOpen(true)}
          className="hidden md:flex fixed bottom-6 right-6 z-50 items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full px-5 py-3 shadow-lg transition-all hover:shadow-xl cursor-pointer"
        >
          <span className="text-lg">🐙</span>
          <span className="text-sm font-bold">문어쌤에게 질문</span>
        </button>
      )}

      {/* Mobile: FAB */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className="md:hidden fixed bottom-6 right-6 z-50 w-14 h-14 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:shadow-xl cursor-pointer"
        >
          <span className="text-2xl">🐙</span>
        </button>
      )}

      {/* Mobile: Fullscreen overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {chatContent}
        </div>
      )}
    </>
  )
}
