import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const webhookUrl = process.env.SLACK_WEBHOOK_URL

    if (!webhookUrl) {
      console.error('SLACK_WEBHOOK_URL not configured')
      return NextResponse.json({ error: 'Slack not configured' }, { status: 500 })
    }

    const {
      name,
      expectation,
      nps,
      recommendTo,
      portfolioComplete,
      dayDifficulty,
      amount,
      mindsetChange,
      wantToLearn,
      wantToLearnOther,
      feedback,
      lastWord,
    } = data

    // Day별 난이도 포맷
    const difficultyText = Object.entries(dayDifficulty as Record<string, string>)
      .map(([day, difficulty]) => `Day ${day}: ${difficulty}`)
      .join('\n')

    const text = `📝 *챌린지 피드백이 도착했어요!*

*제출자*
${name}

*만족도*
${expectation}

*추천 의향 (NPS)*
${nps}/10점
${recommendTo ? `
*추천 대상*
${recommendTo}` : ''}

*결과물 완성도*
${portfolioComplete}

*Day별 난이도*
${difficultyText}

*전체 분량*
${amount}
${wantToLearn && wantToLearn.length > 0 ? `
*심화 과정에서 알고 싶은 것*
${(wantToLearn as string[]).join(', ')}${wantToLearnOther ? ` (기타: ${wantToLearnOther})` : ''}` : ''}${mindsetChange ? `

*생각의 변화*
${mindsetChange}` : ''}${feedback ? `

*다음 챌린지 주제*
${feedback}` : ''}${lastWord ? `

*마지막으로 하고 싶은 말*
${lastWord}` : ''}`

    const message = { text }

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Slack webhook failed:', response.status, errorText)
      return NextResponse.json({ error: 'Slack send failed' }, { status: 500 })
    }

    // SLACK_2에 간단한 알림
    const webhookUrl2 = process.env.SLACK_WEBHOOK_URL_2
    if (webhookUrl2) {
      await fetch(webhookUrl2, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: `📝 ${name}님의 만족도 조사가 제출되었어요. 감사합니다!☺️` }),
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Feedback slack error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
