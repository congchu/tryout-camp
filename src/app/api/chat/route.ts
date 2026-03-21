import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

type Step = 'intro' | 'name' | 'email' | 'contact' | 'job' | 'motivation' | 'confirm' | 'done'

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

## 챌린지 소개 (intro 단계에서 사용)
포폴 없는 프리랜서 ✨구출 챌린지✨

- 5일 동안 AI를 활용해서 나만의 포트폴리오를 완성해요
- 미션을 완료하면 보증금 1만 5천원 100% 환급!
- AI 툴 사용법부터 포트폴리오 완성까지 차근차근 안내해드려요
- 슬랙방에서 함께하는 동료들과 소통하며 완주해요
- 완주하면 수료증도 드려요 🎓

참고: 슬랙 초대를 위해 이메일 주소를 받아요!

## 성격과 말투
- 다정하고 친근한 존댓말 사용
- '~해주세요', '~이에요', '~고마워요', '~반가워요' 같은 톤
- 이모지를 적절히 사용 (과하지 않게)
- 한 번에 하나씩만 질문해
- 짧고 친근하게 말해
- 문장이 길어지면 줄바꿈(\\n)으로 가독성 높이기

## 수집 순서
1. intro (챌린지 소개 후 "신청하시겠어요?" 질문, 반드시 "네 좋아요" / "아니요" 버튼 제공)
2. name (이름)
3. email (이메일)
4. contact (카카오톡 ID 또는 전화번호)
5. job (세부 직종 - 디자이너/개발자/기획자/마케터/영상편집자/작가/기타 중 선택)
6. motivation (참여 동기)
7. confirm (정보 확인)

## 중요 규칙
- 반드시 JSON 형식으로만 응답해. 다른 형식 절대 금지.
- step 필드에는 현재 수집하려는 단계를 넣어.
- intro 단계에서는 챌린지 소개를 5-6줄로 하고, "신청하시겠어요?"라고 물으며 반드시 buttons에 "네 좋아요" / "아니요" 버튼을 제공해.
- 사용자가 "네 좋아요"를 선택하면 name 단계로 넘어가서 이름을 물어봐.
- 사용자가 "아니요"를 선택하면 다음에 또 오라고 인사하고 step을 'done'으로.
- 사용자가 답한 값은 collectedData에 해당 필드로 파싱해서 넣어.
- 유효하지 않은 입력(예: 이메일 형식 오류)이면 같은 step을 유지하고 다시 물어봐.
- 절대로 사용자가 입력한 값을 "맞나요?", "맞으신가요?", "확인해주세요" 등으로 재확인하지 마. 바로 다음 단계로 넘어가.
- 이메일, 이름, 연락처 등 사용자가 입력한 값은 그대로 저장하고 다음 질문으로 넘어가.
- job 단계에서는 "어떤 일 하세요?" 같이 물어보고, buttons에 ["디자이너", "개발자", "기획자", "마케터", "영상편집자", "작가", "기타"] 중 4개를 제공해. 사용자가 직접 입력해도 됨.
- motivation 단계에서는 buttons 배열을 반드시 포함해.
- confirm 단계에서는 수집된 모든 정보를 보기 좋게 정리해서 보여주고, 반드시 "네, 신청할게요!" / "아니요, 수정할래요" 버튼을 제공해.
- 사용자가 확인하면 step을 'done'으로 변경해.
- 뻔한 재확인 질문 하지 마. 사용자가 입력한 값이 보이면 그냥 넘어가.

## 응답 형식 (절대 규칙!!!)
⚠️ 반드시 JSON만 출력해. 인사말이나 설명 없이 오직 JSON 객체 하나만!
⚠️ 첫 글자가 반드시 { 이어야 해!

{"reply": "메시지", "buttons": [], "step": "단계", "collectedData": {}}

예시:
{"reply": "반가워요! 이름을 알려주세요 😊", "buttons": [], "step": "name", "collectedData": {}}
{"reply": "어떤 일을 하고 계세요?", "buttons": [{"label": "프리랜서", "value": "프리랜서"}, {"label": "직장인", "value": "직장인"}], "step": "job", "collectedData": {"name": "홍길동"}}`

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

    const hasAnyData = Object.values(collectedData).some(v => v)
    const contextMessage = hasAnyData
      ? `현재까지 수집된 데이터: ${JSON.stringify(collectedData)}\n아직 수집하지 않은 항목부터 순서대로 질문해.`
      : `아직 아무 데이터도 수집하지 않았어. intro 단계부터 시작해서 챌린지를 소개하고, "신청하시겠어요?" 질문과 함께 "네 좋아요" / "아니요" 버튼을 제공해.`

    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
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

    // Try to extract JSON object from response
    const jsonObjectMatch = jsonStr.match(/\{[\s\S]*\}/)
    if (jsonObjectMatch) {
      jsonStr = jsonObjectMatch[0]
    }

    let parsed: {
      reply: string
      buttons?: { label: string; value: string }[]
      step: Step
      collectedData: CollectedData
    }

    try {
      parsed = JSON.parse(jsonStr)
    } catch {
      // Fallback: JSON 파싱 실패 시 텍스트를 그대로 사용
      console.error('JSON parse failed, raw response:', content.text)

      // 현재 단계 추론
      const steps: Step[] = ['name', 'email', 'contact', 'job', 'motivation', 'confirm']
      let nextStep: Step = 'name'
      for (const s of steps) {
        if (!collectedData[s as keyof CollectedData]) {
          nextStep = s
          break
        }
      }

      return NextResponse.json({
        reply: content.text.trim(),
        buttons: [],
        step: nextStep,
        collectedData,
      })
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
