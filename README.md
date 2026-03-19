# tryout-camp

크크웍스 × 실험마켓 AI 5일 챌린지 랜딩 & 신청 플랫폼

## 기술 스택

- Next.js 15 (App Router, Turbopack)
- TypeScript
- Tailwind CSS v4
- Framer Motion
- Claude Haiku (챗봇)

## 라우트

| 경로 | 설명 |
|------|------|
| `/` | 랜딩 페이지 |
| `/apply` | 문어쌤 챗봇 신청폼 |
| `/api/chat` | 챗봇 API (Claude Haiku) |
| `/api/submit` | 신청 제출 (Google Sheets + Slack) |

## 개발

```bash
pnpm install
pnpm dev
```

## 환경변수

`.env.local.example` 참고:

- `ANTHROPIC_API_KEY` — 챗봇용
- `GOOGLE_SHEETS_ID` — 신청 데이터 저장
- `GOOGLE_SERVICE_ACCOUNT_KEY` — Google Sheets 접근
- `SLACK_WEBHOOK_URL` — 신청 알림

## 배포

Vercel에 배포하고 환경변수 설정

## 디자인

- 검정 배경 + #c8ff00 형광연두
- KyoboHandwriting2019 손글씨 폰트
- 문어쌤 🐙 캐릭터
