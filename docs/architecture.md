# 아키텍처

이 문서는 캠프 플랫폼이 기술적으로 어떻게 구성되어 있는지 설명한다.

---

## 1. 기술 스택

| 기술 | 역할 | 선택 이유 |
|------|------|-----------|
| **Next.js 15** | 웹 프레임워크 | App Router, Vercel 배포 편함 |
| **TypeScript** | 언어 | 타입 안정성 |
| **Tailwind CSS** | 스타일링 | 빠른 UI 개발 |
| **Firebase** | 인증 + DB | 빠른 셋업, 무료 티어 |
| **Vercel** | 배포 | 자동 배포 |
| **Slack Webhook** | 알림 | 실시간 확인 |
| **Claude Haiku** | 챗봇 | 신청 폼에 사용 |

---

## 2. 프로젝트 구조

```
tryout-camp/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── page.tsx            # 메인 (챌린지 리스트)
│   │   ├── api/                # API 라우트
│   │   │   ├── chat/           # 챗봇 API
│   │   │   ├── submit/         # 신청 제출
│   │   │   └── mission-slack/  # 미션 알림
│   │   └── cc/                 # 캠프들
│   │       └── ai-portfolio/   # AI 포트폴리오
│   ├── components/             # 공통 컴포넌트
│   └── lib/                    # 유틸리티
├── documents/                  # 레슨 플랜, 로그
└── docs/                       # 이 위키
```

---

## 3. 라우트 구조

```
/                                    # 메인
└── /cc/[캠프명]                      # 각 캠프
    ├── /                            # 랜딩
    ├── /apply                       # 신청
    └── /workbook                    # 워크북
        └── /day/[day]               # Day별
```

**현재 캠프**: `/cc/ai-portfolio`

---

## 4. 데이터 흐름

### 신청

```
랜딩 → 신청(/apply) → 챗봇 대화 → 제출
                                   → Firebase 저장
                                   → Slack 알림
```

### 워크북

```
워크북 → Firebase Auth 확인 → Day 선택 → 미션 제출
                                        → Firestore 저장
                                        → Slack 알림
```

---

## 5. 워크북 시스템

콘텐츠 파일 위치:
```
src/app/cc/ai-portfolio/workbook/day/[day]/_content/
├── day1.ts
├── day2.ts
└── ...
```

콘텐츠 구조:
```typescript
interface DayContent {
  title: string
  subtitle: string
  steps: Step[]
  mission: Mission
}
```

미션 필드 타입:
- `radio` - 단일 선택
- `select` - 드롭다운
- `text` - 텍스트
- `textarea` - 긴 텍스트
- `url_or_file` - URL 또는 파일

---

## 6. API 라우트

| 경로 | 용도 |
|------|------|
| `/api/chat` | 챗봇 대화 |
| `/api/submit` | 신청 제출 |
| `/api/mission-slack` | 미션 알림 |

---

## 7. 환경변수

```bash
ANTHROPIC_API_KEY=          # 챗봇
NEXT_PUBLIC_FIREBASE_*=     # Firebase
SLACK_WEBHOOK_URL=          # Slack
```

---

## 8. 새 캠프 추가

1. `src/app/cc/[캠프명]` 폴더 생성
2. 기존 캠프 구조 복사
3. 콘텐츠 파일 수정
4. 필요시 Firebase 컬렉션 추가
