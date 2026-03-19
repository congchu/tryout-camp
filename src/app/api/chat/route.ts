import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type Step = 'name' | 'email' | 'contact' | 'job' | 'motivation' | 'confirm' | 'done'

interface CollectedData {
  name?: string
  email?: string
  contact?: string
  job?: string
  motivation?: string
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const SYSTEM_PROMPT = `너는 "문어쌤"이야. 실험마켓의 마스코트이고, 크크웍스 × 실험마켓 AI 5일 챌린지 신청을 도와주는 역할이야.

## 성격과 말투
- 다정하고 유머러스한 반말 사용
- '~해봐', '~거든!', '~이야!', '~넹' 같은 톤
- 이모지를 적절히 사용 (과하지 않게)
- 한 번에 하나씩만 질문해
- 짧고 친근하게 말해

## 수집 순서
1. name (이름)
2. email (이메일)
3. contact (카카오톡 ID 또는 전화번호)
4. job (직업)
5. motivation (참여 동기)
6. confirm (정보 확인)

## 중요 규칙
- 반드시 JSON 형식으로만 응답해. 다른 형식 절대 금지.
- step 필드에는 현재 수집하려는 단계를 넣어.
- 사용자가 답한 값은 collectedData에 해당 필드로 파싱해서 넣어.
- 유효하지 않은 입력(예: 이메일 형식 오류)이면 같은 step을 유지하고 다시 물어봐.
- 이메일은 @가 포함된 형식이어야 해.
- job 단계에서는 buttons 배열을 반드시 포함해.
- motivation 단계에서는 buttons 배열을 반드시 포함해.
- confirm 단계에서는 수집된 모든 정보를 보기 좋게 정리해서 보여주고, 확인 버튼을 제공해.
- 사용자가 확인하면 step을 'done'으로 변경해.

## 응답 JSON 형식
{
  "reply": "문어쌤의 대화 메시지",
  "buttons": [{"label": "표시 텍스트", "value": "실제 값"}],
  "step": "현재 단계",
  "collectedData": { 수집된 데이터 }
}

buttons는 선택지가 있을 때만 포함해. 없으면 빈 배열이나 생략해도 돼.`

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Anthropic API key not configured' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { messages, collectedData } = body as {
      messages: ChatMessage[]
      collectedData: CollectedData
    }

    const anthropic = new Anthropic({ apiKey })

    const contextMessage = `현재까지 수집된 데이터: ${JSON.stringify(collectedData)}
아직 수집하지 않은 항목부터 순서대로 질문해.`

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-20250414',
      max_tokens: 500,
      system: `${SYSTEM_PROMPT}\n\n${contextMessage}`,
      messages: messages.map((m) => ({
        role: m.role as 'user' | 'assistant',
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

    // Extract JSON from response (handle markdown code blocks)
    let jsonStr = content.text.trim()
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/)
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim()
    }

    const parsed = JSON.parse(jsonStr) as {
      reply: string
      buttons?: { label: string; value: string }[]
      step: Step
      collectedData: CollectedData
    }

    return NextResponse.json({
      reply: parsed.reply,
      buttons: parsed.buttons || [],
      step: parsed.step,
      collectedData: { ...collectedData, ...parsed.collectedData },
    })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
