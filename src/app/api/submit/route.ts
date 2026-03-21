import { NextRequest, NextResponse } from 'next/server'

interface SubmitData {
  name: string
  email: string
  contact: string
  job: string
  aiTools?: string[]
  aiLevel?: string
  motivation: string
  comment?: string
  appliedAt: string
}

function formatKoreanTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

async function sendSlackNotification(data: SubmitData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.log('Slack webhook URL not set, skipping...')
    return
  }

  const koreanTime = formatKoreanTime(data.appliedAt)

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🐙 새로운 AI 5일 챌린지 신청!
• 이름: ${data.name}
• 이메일: ${data.email}
• 연락처: ${data.contact}
• 직업: ${data.job}
• AI 툴: ${data.aiTools?.join(', ') || '없음'}
• AI 친숙도: ${data.aiLevel || '없음'}
• 참여 동기: ${data.motivation}
• 하고 싶은 말: ${data.comment || '없음'}
• 신청 시간: ${koreanTime}`,
      }),
    })

    console.log('Slack: notification sent')
  } catch (error) {
    console.error('Slack webhook error:', error)
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = (await request.json()) as SubmitData

    if (!data.name || !data.email || !data.contact || !data.job || !data.motivation) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const submitData: SubmitData = {
      ...data,
      appliedAt: data.appliedAt || new Date().toISOString(),
    }

    await sendSlackNotification(submitData)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
