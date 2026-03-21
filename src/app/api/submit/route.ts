import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

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

async function sendConfirmationEmail(data: SubmitData) {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('Resend API key not set, skipping email...')
    return
  }

  const resend = new Resend(apiKey)

  try {
    await resend.emails.send({
      from: 'AI 5일 챌린지 <onboarding@resend.dev>',
      to: data.email,
      subject: `${data.name}님, AI 5일 챌린지 신청이 접수되었어요! 🎉`,
      html: `
        <div style="font-family: 'Apple SD Gothic Neo', sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #c8ff00; background: #1a1a1a; padding: 20px; border-radius: 16px; text-align: center;">
            🐙 AI 5일 챌린지
          </h1>

          <p style="font-size: 18px; margin-top: 24px;">
            안녕하세요, <strong>${data.name}</strong>님! 👋
          </p>

          <p>신청이 접수되었어요. 아래 보증금 입금 후 참여가 확정됩니다!</p>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 12px; margin: 20px 0;">
            <p style="margin: 0 0 8px 0;"><strong>💰 보증금:</strong> 3만원</p>
            <p style="margin: 0 0 8px 0;"><strong>🏦 계좌:</strong> 국민은행 206802-04-058304 (구민정)</p>
            <p style="margin: 0;"><strong>📱 카카오페이:</strong> <a href="https://qr.kakaopay.com/FFqnDXru7">송금하기</a></p>
          </div>

          <p style="color: #666; font-size: 14px;">
            * 입금자명을 신청자 이름으로 해주세요<br/>
            * 5일 미션 완료 시 100% 환급!
          </p>

          <div style="background: #1a1a1a; color: white; padding: 16px; border-radius: 12px; margin-top: 24px;">
            <p style="margin: 0 0 8px 0;">📅 챌린지 시작: <strong>3/28(토)</strong></p>
            <p style="margin: 0;">💬 슬랙 초대는 다음 주 중 보내드려요!</p>
          </div>

          <p style="color: #999; font-size: 12px; margin-top: 24px; text-align: center;">
            문의: cookie00421@gmail.com
          </p>
        </div>
      `,
    })

    console.log('Email: confirmation sent to', data.email)
  } catch (error) {
    console.error('Resend email error:', JSON.stringify(error, null, 2))
  }
}

// 환경변수 확인용
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY)

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

    await Promise.all([
      sendSlackNotification(submitData),
      sendConfirmationEmail(submitData),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Submit API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
