import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack not configured' }, { status: 500 })
    }

    const { userName, day, tool, reference, result, rating, likes, dislikes, feedback } = data

    // 결과물 링크 처리
    let resultText = ''
    if (result && result !== '(이미지 첨부됨)') {
      resultText = result
    } else if (result === '(이미지 첨부됨)') {
      resultText = '📎 이미지 첨부됨'
    }

    // 참고 사이트 링크 처리
    let refText = ''
    if (reference && reference !== '(이미지 첨부됨)') {
      refText = reference
    }

    const text = `🎉 *Day ${day} 미션을 제출했어요!*

*제출자*
${userName}

*사용 도구*
${tool || '-'}

*결과 평가*
• 첫인상: ${rating || '-'}
• 좋은 점: ${likes || '-'}
• 아쉬운 점: ${dislikes || '-'}
• 소감: ${feedback || '-'}

*링크*${refText ? `\n• 참고: ${refText}` : ''}${resultText ? `\n• 결과물: ${resultText}` : ''}${!refText && !resultText ? '\n없음' : ''}`

    const message = { text }

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
