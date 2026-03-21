import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { message, collectedData } = await request.json()

    const webhookUrl = process.env.SLACK_WEBHOOK_URL
    if (!webhookUrl) {
      return NextResponse.json({ error: 'Webhook URL not configured' }, { status: 500 })
    }

    const slackMessage = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: '💬 신청 페이지 문의',
            emoji: true,
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*문의 내용:*\n${message}`,
          },
        },
        {
          type: 'divider',
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*입력된 정보:*\n` +
              `• 이름: ${collectedData?.name || '미입력'}\n` +
              `• 이메일: ${collectedData?.email || '미입력'}\n` +
              `• 연락처: ${collectedData?.contact || '미입력'}\n` +
              `• 직종: ${collectedData?.job || '미입력'}\n` +
              `• AI 레벨: ${collectedData?.aiLevel || '미입력'}\n` +
              `• AI 툴: ${collectedData?.aiTools?.join(', ') || '미입력'}\n` +
              `• 참여 동기: ${collectedData?.motivation || '미입력'}`,
          },
        },
      ],
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(slackMessage),
    })

    if (!response.ok) {
      throw new Error('Slack webhook failed')
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Inquiry error:', error)
    return NextResponse.json({ error: 'Failed to send inquiry' }, { status: 500 })
  }
}
