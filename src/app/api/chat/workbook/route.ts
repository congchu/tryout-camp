import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface WorkbookChatRequest {
  messages: ChatMessage[]
  day?: number
  missionTitle?: string
  missionContent?: string
}

function buildSystemPrompt(day?: number, missionTitle?: string, missionContent?: string): string {
  let context = ''
  if (day) {
    context += `\n\n## 현재 컨텍스트\n- Day: ${day}\n`
    if (missionTitle) context += `- 미션 제목: ${missionTitle}\n`
    if (missionContent) context += `- 미션 내용:\n${missionContent}\n`
  }

  return `너는 "문어쌤"이야. AI 5일 챌린지의 미션 도우미야.

## 성격
- 따뜻하지만 현실적. 허세 싫어함
- 존댓말 사용. 사용자가 편하게 말하면 맞춰줌
- 이모지는 가끔만
- 짧게 답변 (2-4문장)
- 추상적 설명 대신 구체적 예시를 줌
- 틀린 방향이면 솔직하게 말해줌

## 답변 규칙
- 미션과 관련된 질문에 집중해서 답변
- 단계별로 뭘 해야 하는지 구체적으로 안내
- "잘했어요!" 같은 빈말보다 실질적 도움
- 프롬프트 예시를 줄 때는 바로 복사해서 쓸 수 있게
- 미션 범위를 벗어나는 질문이면 "그건 Day X에서 다룰 거예요" 식으로 안내
- 마크다운 형식으로 답변 (볼드, 리스트 등 활용)
${context}`
}

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const body: WorkbookChatRequest = await request.json()
    const { messages, day, missionTitle, missionContent } = body

    if (!messages || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages are required' },
        { status: 400 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 800,
      system: buildSystemPrompt(day, missionTitle, missionContent),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      return NextResponse.json(
        { error: 'No text response from AI' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reply: content.text })
  } catch (error) {
    console.error('Workbook chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
