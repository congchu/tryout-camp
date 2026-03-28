import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack not configured' }, { status: 500 })
    }

    // const webhookUrl2 = process.env.SLACK_WEBHOOK_URL_2
    const webhookUrl2 = null // 임시 비활성화
    const { userName, day } = data

    // 결과물 링크 처리
    const formatResult = (result: string) => {
      if (!result) return ''
      if (result === '(이미지 첨부됨)') return '📎 이미지 첨부됨'
      return result
    }

    let text = ''

    if (day === 1) {
      // Day 1: 프롬프트 + AI 빌더 결과
      const { tool, reference, result, rating, likes, dislikes, feedback } = data
      const resultText = formatResult(result)
      const refText = reference && reference !== '(이미지 첨부됨)' ? reference : ''

      text = `🎉 *Day ${day} 미션을 제출했어요!*

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

    } else if (day === 2) {
      // Day 2: Codex 레퍼런스 따라만들기
      const { success, result, good, bad, question } = data
      const resultText = formatResult(result)

      text = `🎉 *Day ${day} 미션을 제출했어요!*

*제출자*
${userName}

*미션 결과*
${success || '-'}

*피드백*
• 좋았던 점: ${good || '-'}
• 아쉬웠던 점: ${bad || '-'}
• 궁금한 점: ${question || '-'}

*결과물*
${resultText || '없음'}`

    } else {
      // Day 3~5: 기본 포맷
      text = `🎉 *Day ${day} 미션을 제출했어요!*

*제출자*
${userName}

*제출 내용*
${JSON.stringify(data, null, 2)}`
    }

    const message = { text }

    // 두 개의 webhook으로 동시 전송
    const webhooks = [webhookUrl, webhookUrl2].filter(Boolean) as string[]
    console.log(`Sending to ${webhooks.length} webhooks`)

    const results = await Promise.allSettled(
      webhooks.map(async (url, index) => {
        console.log(`Sending to webhook ${index + 1}...`)
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(message)
        })
        if (!res.ok) {
          const text = await res.text()
          console.error(`Webhook ${index + 1} failed:`, res.status, text)
        } else {
          console.log(`Webhook ${index + 1} success`)
        }
        return res
      })
    )

    const failed = results.filter(r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.ok))
    if (failed.length === webhooks.length) {
      console.error('All Slack webhooks failed')
      return NextResponse.json({ error: 'Slack send failed' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Mission slack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
