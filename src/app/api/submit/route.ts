import { NextRequest, NextResponse } from 'next/server'

interface SubmitData {
  name: string
  email: string
  contact: string
  job: string
  motivation: string
  appliedAt: string
}

async function appendToGoogleSheets(data: SubmitData) {
  const sheetsId = process.env.GOOGLE_SHEETS_ID
  const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY

  if (!sheetsId || !serviceAccountKey) {
    console.log('Google Sheets env vars not set, skipping...')
    return
  }

  try {
    const { google } = await import('googleapis')
    const credentials = JSON.parse(serviceAccountKey)
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetsId,
      range: 'Sheet1!A:F',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          data.name,
          data.email,
          data.contact,
          data.job,
          data.motivation,
          data.appliedAt,
        ]],
      },
    })

    console.log('Google Sheets: row appended')
  } catch (error) {
    console.error('Google Sheets error:', error)
  }
}

async function sendSlackNotification(data: SubmitData) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL

  if (!webhookUrl) {
    console.log('Slack webhook URL not set, skipping...')
    return
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `🐙 새로운 AI 5일 챌린지 신청!`,
        blocks: [
          {
            type: 'header',
            text: { type: 'plain_text', text: '🐙 새로운 AI 5일 챌린지 신청!' },
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*이름:*\n${data.name}` },
              { type: 'mrkdwn', text: `*이메일:*\n${data.email}` },
              { type: 'mrkdwn', text: `*연락처:*\n${data.contact}` },
              { type: 'mrkdwn', text: `*직업:*\n${data.job}` },
            ],
          },
          {
            type: 'section',
            text: { type: 'mrkdwn', text: `*참여 동기:*\n${data.motivation}` },
          },
          {
            type: 'context',
            elements: [
              { type: 'mrkdwn', text: `신청 시간: ${data.appliedAt}` },
            ],
          },
        ],
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

    // Run both in parallel, gracefully handle failures
    await Promise.allSettled([
      appendToGoogleSheets(submitData),
      sendSlackNotification(submitData),
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
