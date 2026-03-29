# Claude 작업 규칙

## 자동 로그 기록

작업 시 `documents/logs/WORKLOG.md`에 날것의 히스토리 로그를 남긴다.

### 기록 시점
- 새로운 목표/방향이 정해졌을 때
- 의사결정이 있었을 때 (왜 이걸 선택했는지)
- 시행착오가 있었을 때 (뭘 시도했고 왜 안됐는지)
- 파일 생성/수정했을 때
- 크롤링/다운로드 등 외부 리소스 작업했을 때

### 기록 형식
```
## YYYY-MM-DD HH:MM - 한 줄 요약 (목적 중심, 수단 아님)
WHY: 왜 이걸 하는지 (필수)
HOW: 어떻게 했는지 (선택)
상세 내용 (필요시)
-> 결과나 산출물
```

### WHY 필수 규칙
- 모든 행동에 WHY가 있어야 함
- 수단을 제목으로 쓰지 않음 (인터뷰 진행 ❌ → 목표 문서 작성 ✅)
- 사용자의 의도가 보여야 함

### 기록 원칙
- 잘 정리된 문서 ❌
- 날것의 로그 ✅
- 시간 포함
- 간결하지만 맥락 있게
- 나중에 "왜 이렇게 했지?" 알 수 있게
- "다음 할 일" 섹션 불필요

### 추측 기록
사용자가 작업 이유를 언급하지 않았을 때:
- Claude가 추측한 이유를 적되
- 반드시 `(추측)` 표시를 붙인다
- 예: "아마 재사용하려는 것 같음 (추측)"

### 감정/상태 이모지
```
❌ 실패/막힘
💡 깨달음
😤 답답함
😮 신기함
🔄 방향 전환
✅ 해결/성공
```
- 사용자가 감정을 전달하면 이모지와 함께 기록
- 무거워지면 그때 분리

---

## 라우트 구조 (변경 금지)

```
/                                        # 챌린지 리스트 메인
└── /cc/ai-portfolio                     # AI 포트폴리오 챌린지
    ├── /apply                           # 신청 페이지
    └── /workbook                        # 워크북 (Firebase)
        └── /day/[day]                   # Day 1~5 페이지
```

### 규칙
- 위 구조 외 새로운 라우트 생성 금지
- 기존 라우트 이동/삭제 시 사용자 확인 필수
- API 라우트: `/api/*` (chat, inquiry, submit 등)

---

## 워크북 콘텐츠 작성 규칙

### ⚠️ 필수: 콘텐츠 작성 전 레슨 플랜 확인
Day 콘텐츠 작성/수정 전 반드시 해당 Day의 레슨 플랜을 먼저 읽을 것:
- 위치: `documents/lesson-plans/day-{n}.md`
- 레슨 플랜에 정의된 방향/흐름/핵심 메시지를 따를 것
- 레슨 플랜이 없으면 사용자에게 먼저 방향 확인할 것

### Day 콘텐츠 구조
파일 위치: `src/app/cc/ai-portfolio/workbook/day/[day]/_content/day{n}.ts`

```typescript
export const day1: DayContent = {
  title: '제목',
  subtitle: '부제목',
  steps: [
    {
      id: 'step-1',
      title: '스텝 제목',
      duration: '5분',
      content: `마크다운 내용`
    }
  ],
  mission: {
    title: '미션 제목',
    description: '미션 설명',
    fields: [...]  // 미션 입력 필드
  }
}
```

### 미션 필드 타입
```typescript
// 라디오 버튼 (단일 선택)
{ id: 'success', label: '미션 성공 여부', type: 'radio', options: ['옵션1', '옵션2'], required: true }

// 드롭다운 (단일 선택)
{ id: 'rating', label: '만족도', type: 'select', options: ['1점', '2점', ...], required: true }

// 텍스트 입력
{ id: 'name', label: '이름', type: 'text', placeholder: '이름 입력', required: true }

// 긴 텍스트
{ id: 'feedback', label: '소감', type: 'textarea', placeholder: '자유롭게 작성', required: false }

// URL 또는 파일 업로드
{ id: 'result', label: '결과물', type: 'url_or_file', accept: 'image/*', required: false }
```

### 마크다운 커스텀 컴포넌트
```markdown
<!-- 이미지 모달 -->
<modal-img src="/cc/images/example.png">버튼 텍스트</modal-img>

<!-- 버튼 링크 -->
<button-link href="/cc/ai-portfolio/templates">👉 템플릿 보기</button-link>
```

### 슬랙 알림 (Day별 분기)
- `/api/mission-slack/route.ts`에서 Day별 다른 포맷 적용
- 새 Day 추가 시 해당 파일에 분기 추가 필요

### 잠금 설정
- `workbook/page.tsx`의 `isLocked` 변수로 Day별 잠금 제어
- 예: `mission.day > 2` → Day 3부터 잠금

---

## 5일 챌린지 로드맵

| Day | 주제 | 목표 | 핵심 도구 |
|-----|------|------|----------|
| 1 | AI로 웹사이트 만드는 법 | AI 도구 이해 + 첫 결과물 | Lovable/v0/Bolt |
| 2 | 화려한 포폴 따라만들기 | GitHub 레포 복사 | Codex |
| 3 | 콘텐츠 완성하기 | 내 정보 + 이미지 채우기 | Codex |
| 4 | 배포하기 | 실제 URL로 공개 | Netlify |
| 5 | 방문자 확인 | 분석 연동 | Mixpanel |

---

## 에이전트 시스템

Day 콘텐츠 제작을 위한 4개의 에이전트와 워크플로우

### 에이전트 역할

| 에이전트 | 스킬 | 역할 | 산출물 |
|----------|------|------|--------|
| 리서쳐 | `/research` | 자료 수집, 도구 조사 | `documents/logs/research-day{n}.md` |
| 워크북 제작자 | `/write` | Day 콘텐츠 작성 | `day{n}.ts` |
| 편집자 | `/edit` | 톤앤매너, 흐름 검토 | `day{n}.ts` 수정 |
| 유저 테스터 | `/test` | UX 검증, 문제 발견 | `documents/logs/test-day{n}.md` |

### 워크플로우

```
/research day{n} → /write day{n} → /edit day{n} → /test day{n}
```

상세 가이드: `.claude/workflows/day-content.md`

### 파일 구조

```
.claude/
├── skills/      # 스킬 호출 정의
├── agents/      # 에이전트 상세 가이드
└── workflows/   # 워크플로우 정의
```
