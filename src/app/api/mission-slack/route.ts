import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack not configured' }, { status: 500 })
    }

    const { userName, userEmail, day, prompt, tool, reference, result, rating, likes, dislikes, feedback } = data

    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `🎯 Day ${day} 미션 제출!`,
            emoji: true
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*제출자:*\n${userName} (${userEmail})`
            },
            {
              type: 'mrkdwn',
              text: `*사용한 도구:*\n${tool || '-'}`
            }
          ]
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*완성된 프롬프트:*\n\`\`\`${prompt?.slice(0, 500)}${prompt?.length > 500 ? '...' : ''}\`\`\``
          }
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*참고 사이트:*\n${reference || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*결과물:*\n${result || '-'}`
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*첫인상:*\n${rating || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*마음에 드는 부분:*\n${likes || '-'}`
            }
          ]
        },
        {
          type: 'section',
          fields: [
            {
              type: 'mrkdwn',
              text: `*아쉬운 부분:*\n${dislikes || '-'}`
            },
            {
              type: 'mrkdwn',
              text: `*소감:*\n${feedback || '-'}`
            }
          ]
        },
        {
          type: 'divider'
        }
      ]
    }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message)
    })

    if (!response.ok) {
      console.error('Slack webhook failed:', await response.text())
      return NextResponse.json({ error: 'Slack send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mission slack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
