# WORKLOG

> 이 작업의 목적: 시행착오 과정을 기록해서 나중에 강의 자료로 활용

---

## 2026-03-21 10:00 - 목표 설정
샘플 디자이너 포트폴리오를 만들고 싶음. HTML로.
아마 AI에게 프롬프트로 생성 맡기려는 것 같음 (추측)

## 2026-03-21 10:02 - 방향 탐색
"디자이너 포트폴리오는 어때야 해?" 질문함.
-> 일반적인 조언 받음 (첫인상, 프로젝트 중심, 퀄리티>수량 등)
구체적인 레퍼런스가 필요하다고 느낀 것 같음 (추측)

## 2026-03-21 10:05 - 레퍼런스 수집
Medium 기사 크롤링 요청함
https://medium.com/design-bootcamp/12-designers-portfolios-that-will-make-you-jealous-5e5d5dbb7626
-> 12개 포트폴리오 특징 추출

## 2026-03-21 10:08 - 4가지 타입 분류
A: Minimal + Bold Typography (Jordan Gilroy)
B: Dark Theme + Grid (Adrian Zumbrunnen)
C: Light & Clean (Rachel How)
D: Bold Interaction (Constance S)

## 2026-03-21 10:10 - 프롬프트 전략 질문
"4개 다 만들건데, 프롬프트 고도화는 천천히 할거라서 일단 스타일 가이드만"
-> `portfolio-style-guide.md` 생성

## 2026-03-21 10:15 - 프롬프트 고도화 방법 논의
핵심: "여러 번 요청해도 동일한 결과가 나올 정도로 상세하게"
-> 모호함 제거, 수치 고정, 금지 사항 명시 등 원칙 정리

## 2026-03-21 10:18 - Type A 먼저 하려다가 멈춤
디자이너 정보(이름, 직함 등) 필요해서 잠시 멈춤
샘플 데이터를 어디서 가져올지 고민한 듯 (추측)

## 2026-03-21 10:20 - Rachel How 사이트 크롤링 시도
"사진을 긁어오는게 포인트" 라고 판단
-> 사이트 정보 크롤링 (색상, 폰트, 구조 등)
-> 이미지 URL 27개 추출
실제 이미지가 있어야 프롬프트 결과가 일관될 거라고 판단한 듯 (추측)

## 2026-03-21 10:25 - 이미지 다운로드
sample/images/ 폴더에 10개 이미지 저장
- profile-pill.png, profile-photo.jpg
- project-01~06
- mockup-mobile.webp, mockup-desktop.webp

## 2026-03-21 10:28 - 작업 과정 기록 필요성 인식
"이 과정을 나중에 재현할 수 있게 기록하고 싶다"
-> `prompt-engineering-workflow.md` 생성 (정리된 문서)

## 2026-03-21 10:32 - 기록 방식 재정의
"정리된 문서 말고 날것의 history 로그"
"목표 정한 순간부터"
"시간까지 적어줘"
-> 이 WORKLOG.md 생성

## 2026-03-21 10:35 - 로그 목적 명확화
"강의 자료로 활용하려고"
추측도 적되 (추측) 표시하라고 함
"다음 할 일" 섹션 불필요하다고 함
-> CLAUDE.md, WORKLOG.md 업데이트

## 2026-03-21 10:38 - 성장기 관점 논의
"AX 전문가 된 증거자료로 쓸 것"
"시행착오를 거치며 성장했다는 걸 보여주고 싶음"
-> 추가 기록 항목 논의: 삽질, 질문의 진화, 내 판단, 감정, Before/After
-> 이모지로 가볍게 표시하기로 함 (❌💡😤😮🔄✅)
-> 사용자가 앞으로 감정 직접 전달해주기로 함

## 2026-03-21 10:42 - 목표/계획 문서 작성 시작
WHY: 작업 전에 전체 방향을 명확히 정리하고 가려고
WHY: 직접 쓰기 막막해서 인터뷰 형식으로 기획의도 정리하는 게 편함
HOW: Claude에게 인터뷰 요청

인터뷰로 파악된 내용:
- 실험마켓 서비스의 첫 프로젝트
- 크크웍스(프리랜서 공유오피스) 대상 "AI로 포트폴리오 만들기 5일 챌린지"
- 신청 페이지에 보여줄 샘플 포트폴리오 필요
🔄 4개 → 3개로 정정 (디자이너/마케터/개발자 각 1개)
-> 스타일 매칭은 만들면서 판단하기로
-> 디자이너용 먼저 시작 (Rachel How 재료 준비됨)

## 2026-03-21 10:50 - 워크로그 형식 피드백
😤 "내 의도가 안 보여"
💡 깨달음: 모든 행동에 WHY가 있어야 함
💡 깨달음: 인터뷰는 수단, 목표/계획 문서 작성이 목적
🔄 PROJECT-INTERVIEW.md → PROJECT-GOAL.md + PROJECT-PLAN.md로 분리

## 2026-03-21 10:55 - 목표 문서 개선
WHY: 산출물 목록이 없으니 기준을 잃어버림
HOW: PRD 라이트 버전으로 산출물 체크리스트 추가
-> PROJECT-GOAL.md 업데이트

💡 깨달음: "백지에서 창작하는 게 어렵다"
- 스타일 가이드 → 레퍼런스 크롤링으로 해결 (쉬움)
- 이미지 → 레퍼런스 다운로드로 해결 (쉬움)
- 목표/계획 문서 → 백지라서 막막 → 인터뷰로 해결
- 샘플 개인정보 → 아직 백지 상태

## 2026-03-21 11:00 - 문서 통합
WHY: 문서가 파편화되어 참고하기 어려움
HOW: README.md에 핵심 내용 통합
-> PROJECT-GOAL.md, PROJECT-PLAN.md, PROJECT-INTERVIEW.md 삭제
-> prompt-engineering-workflow.md는 유지 (프롬프트 고도화 방법론 참고용)

## 2026-03-21 11:05 - 샘플 데이터 설계
WHY: 백지에서 창작하기 어려우니 구조부터 잡기
HOW: 각 항목마다 "왜 필요한지" 설명하며 설계
-> portfolio-structure.md 생성 (포트폴리오에 들어갈 항목 스펙)
-> data/designer.md 생성 (디자이너 샘플 데이터)

포함된 항목:
- 기본 정보 (이름, 직함, 태그라인, 소개, 프로필 이미지)
- 스킬 태그 (추가됨)
- 프로젝트 4개 (3-6개 권장)
- 연락처/소셜

제외된 항목:
- 경력 연차 (프리랜서 특성상 결과물이 더 중요)

## 2026-03-21 11:15 - 좋은 포트폴리오란? 토론
💡 핵심 인사이트:

좋은 포트폴리오 = 의도(브랜딩) + 구조 + UI/UX

포트폴리오는 "설득하는 글"이다:
- 주장이 있어야 함
- 설득이 있어야 함

취업 vs 프리랜서 차이:
| 타겟 | 설득 방식 | 이유 |
|------|----------|------|
| 취업 | 직접 말하기 | 가능성을 봄, 확신 필요 |
| 프리랜서 | 간접 증명 | 퀄리티가 핵심, 결과물로 보여줌 |

→ 크크웍스 챌린지 = 프리랜서 대상 = 간접 증명 방식
→ 실제 결과물 퀄리티가 가장 중요

## 2026-03-21 11:25 - 증거와 설득 토론
WHY: 직군별로 포트폴리오 전략이 달라야 함
💡 핵심 인사이트:
- 디자이너: 결과물 가시성 높음 → 간접 증명
- 개발자: 결과물 가시성 낮음 → 직접 설명 필요
- 마케터: 수치 있으면 간접, 없으면 직접
- 근본 원칙: "증거 있으면 보여주고, 없으면 설득"
-> worklog/02-증거와-설득.md 기록

## 2026-03-21 11:30 - 샘플 포트폴리오 전략 재정립
WHY: 지금까지 토론한 철학을 실제 샘플에 반영해야 함

4단계 프로세스 확정:
```
Step 1. 브랜딩 먼저 (WHY)
Step 2. 구조에 반영 (WHAT)
Step 3. UI/UX 선택 (HOW)
Step 4. 프롬프트 작성 (재현 가능하게)
```

💡 이 과정 자체가 5일 챌린지 커리큘럼이 됨

## 2026-03-21 11:40 - 프롬프트 v2 작성
WHY: 다른 AI에게 넘겨도 동일한 결과가 나오는 펑셔널 프롬프트 필요
HOW: 모든 값을 고정 (색상 HEX, 폰트 px, 텍스트 전문, 구조)

포함된 것:
- 색상 시스템 (CSS 변수로 고정)
- 타이포그래피 (모든 요소 크기/굵기 고정)
- 레이아웃 (px 단위로 고정)
- 섹션 구조 (순서, 내용 전문)
- 반응형 브레이크포인트
- 금지 사항 (추가하지 말 것들)
- 체크리스트

-> prompts/designer-v2.md 생성

## 2026-03-21 (시간 미확인) - 페이지 구조 변경
WHY: 챌린지가 여러 개 생길 수 있으니 index를 챌린지 리스트로 쓰고, 각 챌린지는 하위 페이지로 분리
HOW:
- 기존 `page.tsx` (포폴 챌린지 랜딩) → `/cc/ai-5days-porfolio/page.tsx`로 이동
- 새 `page.tsx` → 챌린지 리스트 페이지로 변경
-> 챌린지 카드 클릭하면 상세 페이지로 이동하는 구조

산출물:
- `/src/app/cc/ai-5days-porfolio/page.tsx` (챌린지 상세)
- `/src/app/page.tsx` (챌린지 리스트)

## 2026-03-21 (시간 미확인) - 프롬프트 v3 작성
WHY: v2가 너무 빡빡해서 결과물이 구려짐 😤
HOW: 느낌/무드만 전달하고 나머지는 AI 자유에 맡기는 방식으로 변경

v2 vs v3 차이:
| v2 | v3 |
|----|-----|
| 색상 HEX 고정 | "보라-핑크 그라데이션 느낌" |
| 폰트 px 고정 | "고급스러운 타이포그래피" |
| 간격 px 고정 | "여백 넉넉하게" |
| 금지사항 8개 | 금지사항 2개만 |
| 체크리스트 있음 | 없음 |

🔄 방향 전환: 재현성 < 퀄리티
-> prompts/designer-v3.md 생성

## 2026-03-21 (시간 미확인) - 프롬프트 워딩 삽질
❌ "아름다운"이라는 표현 쓰면 엉망으로 나옴 ㅋㅋㅋ
💡 깨달음: AI한테 "아름다운", "예쁜" 같은 주관적 형용사는 독
- 각자 생각하는 아름다움이 다름
- 구체적인 무드 키워드가 나음 (ex: "미니멀한", "고급스러운", "여백 있는")

## 2026-03-21 (시간 미확인) - 프롬프트 v4 작성
WHY: v3도 결과가 맘에 안 듦. 미니멀이 제일 낫다고 판단
HOW: 핀터레스트 레퍼런스 + 구체적 제약

v4 핵심 변경:
- "아름다운", "예쁜" 표현 완전 제거
- "Pinterest 같은 느낌" 레퍼런스 명시
- Sharp edges 강조 (border-radius 거의 없이)
- 피해야 할 것 섹션 추가 (둥글둥글, 그라데이션, 과한 그림자)
- Masonry 그리드 레이아웃 명시

🔄 방향: 추상적 형용사 → 구체적 레퍼런스 사이트
-> prompts/designer-v4.md 생성

## 2026-03-21 - 이미지 URL 도메인 오류 수정
WHY: designer-sample.html에서 이미지가 안 뜸 (SSL 오류)
HOW: 잘못된 도메인 `camp.tryout.co` → `camp.tryoutmarket.co`로 일괄 변경
-> public/cc/sample/designer-sample.html, sample/output/designer-portfolio-v9.html 수정
✅ 해결

## 2026-03-21 - FAQ 가독성 개선
WHY: FAQ 답변이 줄글이라 읽기 불편함
HOW: `whitespace-pre-line` 클래스 추가해서 `\n` 줄바꿈 반영
-> FAQSection.tsx 수정 (1줄)
✅ 해결

## 2026-03-21 - 404 페이지 추가
WHY: 없는 URL 접근 시 기본 404가 아닌 브랜딩된 페이지 필요
HOW: Next.js App Router의 not-found.tsx 생성, 기존 스타일 유지
-> /src/app/not-found.tsx 생성
✅ 완료

## 2026-03-25 - 크크웍스 워크북 초안 작성
WHY: 참여자들에게 제공할 5일 챌린지 가이드 문서 필요
HOW: 기존 포트폴리오 제작 4단계(브랜딩→구조→UI/UX→프롬프트)를 5일 미션으로 확장
-> sample/workbook-draft.md 생성

포함된 내용:
- 챌린지 소개 및 일정
- Day 1~5 미션 상세 (제출 양식 포함)
- AI 도구 사용법 (Lovable 추천)
- 배포 가이드 (Vercel)
- FAQ
- AI 프롬프트 팁

5일 미션 구조:
| Day | 주제 | 핵심 질문 |
|-----|------|----------|
| 1 | 브랜딩 | 어떤 사람으로 보여지고 싶은가? |
| 2 | 구조 설계 | 뭘 보여줘야 하나? |
| 3 | AI로 생성 | 어떤 스타일로? |
| 4 | 수정/개선 | 다듬기 |
| 5 | 배포 | 세상에 공개 |

✅ 완료

## 2026-03-25 - 워크북 시스템 적용
WHY: tryout-market의 워크북 시스템을 이 프로젝트에도 사용하려고
HOW: tryout-market에서 핵심 파일들 참고해서 구조 재구성

URL 구조:
- `/cc/[slug]/mission-book` - 챌린지 소개 + 미션 목록
- `/cc/[slug]/mission-book/day1` - Day별 미션 페이지

생성된 파일들:
```
src/lib/content.types.ts          - 타입 정의
src/lib/workbook-schema.types.ts  - 워크북 스키마 타입
src/lib/file-content.ts           - 콘텐츠 로더

src/app/cc/[slug]/mission-book/page.tsx          - 미션 목록 페이지
src/app/cc/[slug]/mission-book/[day]/page.tsx    - Day별 페이지
src/app/cc/[slug]/mission-book/[day]/_components/InteractiveWorkbook.tsx

contents/ai-5days-portfolio/
├── meta.yaml       - 워크북 메타데이터
├── challenge.yaml  - 미션 정의
└── missions/
    └── day-01.md   - Day 1 마크다운
```

설치된 의존성:
- react-markdown, remark-gfm (마크다운 렌더링)
- gray-matter (YAML frontmatter 파싱)
- @tailwindcss/typography (prose 스타일)
- yaml, server-only

마크다운 작성 규칙:
- `## Step N: 제목 (시간)` - 스텝 구분
- `- [ ] 체크리스트` - 체크박스
- `✏️ 라벨:` - 입력 필드
- `📊 Day N 최종 체크리스트` - 최종 체크리스트

핵심 기능:
- localStorage 기반 진행 상태 저장
- Step별 접기/펼치기
- 체크박스 완료 시 Step 완료 표시
- 진행률 표시 (프로그레스바)
- Day간 네비게이션

✅ 빌드 성공

## 2026-03-26 - Firebase 워크북 시스템 구축
WHY: 참여자가 구글 로그인해서 본인 워크북 진행 상황을 관리할 수 있게 하려고
HOW: Firebase Auth (구글 로그인) + Firestore (진행 상황 저장)

생성된 파일들:
```
src/lib/firebase.ts           - Firebase 초기화
src/lib/auth-context.tsx      - 구글 로그인 Context
src/lib/workbook-db.ts        - Firestore 진행상황 저장

src/app/workbook/
├── layout.tsx                - AuthProvider 래핑
├── page.tsx                  - 메인 (로그인 + Day 목록)
├── intro/page.tsx            - 인트로 페이지
└── day/[day]/page.tsx        - Day 1~5 페이지
```

Firestore 구조:
```
workbook_progress/{userId}/
  - day1: { status, submission, submittedAt }
  - day2: ...
  - day5: ...
  - createdAt, updatedAt
```

랜딩 페이지 버튼 변경:
- "지금 신청하기" → "시작하기" (→ /workbook)
- 아래에 "챌린지 신청하기" 텍스트 링크 추가

5일 커리큘럼 (랜딩 페이지 기준으로 맞춤):
| Day | 주제 |
|-----|------|
| 1 | AI 툴 셋팅 + 타겟 분석 |
| 2 | 작업물 정리 + 구성 초안 |
| 3 | 레퍼런스 + UX 구성 |
| 4 | 사이트 만들고 배포! |
| 5 | 피드백 받으면서 개선 |

✅ 빌드 성공

## 2026-03-26 - 워크북 Day 페이지 UI 변경: 스크롤 → 단일 step 뷰
WHY: 사용자 피드백 "목차에 해당하는 내용만 보여줘야지" - 모든 step이 다 보이면 집중이 안됨
HOW: page.tsx 전체 재작성
- 모든 step 동시 표시 → activeStep만 렌더링
- scrollToStep() → goToStep(), goToPrev(), goToNext()
- stepRefs 제거 (더이상 스크롤 안함)
- 모바일: 상단 숫자 버튼 네비게이션
- PC: 사이드바 목차 + 하단 이전/다음 버튼
-> /cc/ai-portfolio/workbook/day/[day]/page.tsx 수정 완료

## 2026-03-28 - 워크북 Day 1 콘텐츠 수정
WHY: 콘텐츠가 흰글씨로 보이는 버그 + 콘텐츠 구조 개선
HOW:
1. 흰글씨 버그 수정: layout.tsx에 `text-gray-900` 추가
   - 원인: globals.css에 `body { color: white }` 설정이 있어서 상속됨
2. Day 1 콘텐츠 재구성:
   - Step 1: "타겟 분석" → "목표 정하기" (왜 포트폴리오를 만드는지 먼저)
   - Step 2: Lovable만 → Lovable + Bolt.new 둘 다 소개
   - Step 3: 타겟 분석 (세부 - 누구를 설득할 것인지)
-> /cc/ai-portfolio/workbook/layout.tsx 수정
-> /cc/ai-portfolio/workbook/day/[day]/_content/day1.ts 수정
✅ 완료

## 2026-03-28 - Day 1/Day 2 콘텐츠 재구성
WHY: Day 1에 너무 많은 내용이 있어서 간소화 필요
HOW:
1. "내 정보 정리" 섹션을 Day 1에서 Day 2로 이동
2. Day 1은 AI로 웹사이트 만드는 방법 이해 → 바로 Lovable 실습으로 간소화
3. Day 1 Lovable 실습은 예시 데이터로 진행 (맛보기)
4. Day 2에서 내 정보 정리 후 진짜 포트폴리오 만들기

Day 1 최종 구조:
- intro: 왜 포트폴리오가 필요할까?
- step-1: AI로 웹사이트 만드는 방법 (4단계 프롬프팅 설명)
- step-2: Lovable로 만들어보기 (예시 데이터)

Day 2 최종 구조:
- step-1: 내 정보 정리하기
- step-2: 내 정보로 포트폴리오 만들기
- step-3: 결과 확인하고 수정하기

## 2026-03-28 - 이미지 모달 기능 추가
WHY: 프롬프트 실행 결과 스크린샷을 보여주고 싶음
HOW:
❌ 마크다운 링크 `[text](modal:path)` 방식 시도 → 클릭시 새로고침됨 (실패)
❌ `e.preventDefault()`, `e.stopPropagation()` 추가 → 여전히 새로고침 (실패)
✅ custom HTML 태그 `<modal-img src="path">text</modal-img>` + rehype-raw 플러그인 사용 → 성공!

추가된 기능:
- ImageModal 컴포넌트 (X 버튼, 배경 클릭으로 닫기)
- 모달 열릴 때 배경 스크롤 방지 (`document.body.style.overflow = 'hidden'`)
- 이미지 클릭 시 브라우저 기본 확대 가능

사용법:
```
<modal-img src="/cc/images/day1-step2-1.png">프롬프트 실행 결과 보기</modal-img>
```

## 2026-03-28 - Day 1 프롬프팅 단계에 "디자인 지침 주기" 추가
WHY: 2단계(목적)와 4단계(레퍼런스) 사이에 디자인 지침만 주는 단계가 있으면 더 이해하기 쉬움
HOW: 3단계 추가 (토스 스타일 프롬프트 예시)
-> day1.ts step-1 내용에 "3단계. 디자인 지침 주기" 추가

현재 4단계:
1. 내 정보 주기
2. 목적까지 알려주기
3. 디자인 지침 주기 (신규)
4. 레퍼런스 보여주기 ⭐

✅ 완료

## 2026-03-28 - Day 1 미션 폼 개선 및 슬랙 연동
WHY: 미션 제출 UX 개선 + 제출 알림 자동화
HOW: 폼 필드 확장, 임시저장 기능, Slack webhook 연동

변경사항:
- 주관식 필드 (`likes`, `dislikes`, `feedback`)를 textarea로 변경 (더 길게 작성 가능)
- `사용한 도구` select → text 입력으로 변경 (여러 도구 입력 가능)
- 새 필드 추가: `참고한 사이트 URL`, `결과물 URL/스크린샷`
- **미션 카드만 회색 배경으로 변경** (from-gray-700 to-gray-800), 나머지 UI는 주황색 유지
- 임시 저장 기능 추가 (`saveMissionDraft` 함수 + "임시 저장" 버튼)
- 제출 시 슬랙으로 알림 전송 (`/api/mission-slack` 엔드포인트 신규 생성)

수정된 파일:
- `day1.ts` - mission.fields 확장
- `page.tsx` - missionForm 상태, 색상, 버튼
- `workbook-db.ts` - MissionSubmission 타입, saveMissionDraft 함수
- `api/mission-slack/route.ts` (신규) - 슬랙 알림

✅ 완료

## 2026-03-28 - 빌드 오류 수정 및 미사용 파일 정리
WHY: Vercel 배포를 위해 빌드 오류 해결 필요

❌ gray-matter 모듈 없음 오류 → file-content.ts, content.types.ts 확인 → 미사용 파일 삭제
❌ Firebase Admin 설정 오류 → api/upload 라우트 확인 → 미사용 (Base64 방식으로 전환) → 삭제
❌ eo-Brutalist-portfolio 폴더 빌드 오류 → tsconfig.json exclude에 추가
❌ modal-img 커스텀 컴포넌트 타입 오류 → @ts-expect-error 추가

✅ 빌드 성공 및 배포 완료

## 2026-03-29 - Day 2 워크북 콘텐츠 작성
WHY: 캠프 2일차 콘텐츠 필요

Day 2 핵심 메시지:
- Day 1의 한계: 평면적, 스크린샷으로 "똑같이"는 안 됨, 애니메이션 어색
- Day 2의 가치: GitHub 링크로 완벽 복사, 코딩의 시작점, 바이브코딩 확장
- 톤: "무조건 좋다"가 아니라 "이런 방법도 알면 더 재밌다"

구조:
| Step | 제목 |
|------|------|
| intro | Day 2에서 할 일 |
| step-1 | Day 1 방식의 한계 |
| step-2 | 이 방법이 다른 점 |
| step-3 | 도구 & 비용 안내 (Mac: Claude Code / Win: Codex) |
| step-4 | 셋팅하기 |
| step-5 | 레퍼런스 따라만들기 |
| step-6 | 결과 확인 + 수정 |

비용 안내:
- Claude Pro / ChatGPT Plus 각 $20/월
- 무료 대안: ChatGPT 무료 버전으로 Day 1 방식 유지

-> day2.ts 작성 완료

## 2026-03-29 - Day 2 레퍼런스 수집
WHY: 워크북에서 사용할 실제 GitHub 레퍼런스 필요
HOW: 실제 오픈소스 포트폴리오 사이트 수집

수집된 레퍼런스:
- Hamish Williams: https://hamishw.com/ | https://github.com/HamishMW/portfolio

참고 사이트:
- https://portfolio-ideas.vercel.app/portfolio.html (600+ 포폴 큐레이션)
  - 형식: Author / Screenshot / Live URL / Repo / Tech Stack

✅ 둘 다 진행:
1. sample/portfolio-references.md 생성 (portfolio-ideas 형식 표)
2. day2.ts step-4 예시 레포 → 실제 Hamish 링크로 교체

## 2026-03-29 - CLAUDE.md에서 checkItems 예시 제거
WHY: 새 Day 콘텐츠 만들 때 자꾸 예전 버전(checkItems 포함)으로 만들어지는 문제
HOW: 원인 추적 → CLAUDE.md 예시 코드에 checkItems: [] 포함되어 있었음

-> CLAUDE.md 수정: step 예시에서 checkItems 라인 삭제
-> types.ts에서 checkItems는 optional이라 안 넣어도 됨

## 2026-03-29 - Day 3 잠금 해제
WHY: Day 3 콘텐츠 오픈
HOW: workbook/page.tsx의 isLocked 조건 변경
- `mission.day > 2` → `mission.day > 3`
-> Day 1~3 접근 가능, Day 4부터 잠금

## 2026-03-29 - 에이전트 시스템 구축
WHY: Day 콘텐츠 제작 시 매번 주제/방향을 물어보는 반복 줄이기
WHY: 역할 분리로 체계적인 콘텐츠 제작 프로세스 구축

4개 에이전트 정의:
| 에이전트 | 스킬 | 역할 |
|----------|------|------|
| 리서쳐 | /research | 자료 수집 |
| 워크북 제작자 | /write | Day 콘텐츠 작성 |
| 편집자 | /edit | 톤앤매너/흐름 검토 |
| 유저 테스터 | /test | UX 검증 |

파일 구조:
```
.claude/
├── skills/      # 스킬 호출 정의
│   ├── research.md
│   ├── write.md
│   ├── edit.md
│   └── test.md
├── agents/      # 에이전트 상세 가이드
│   ├── researcher.md
│   ├── writer.md
│   ├── editor.md
│   └── tester.md
└── workflows/   # 워크플로우 정의 (핸드오프)
    └── day-content.md
```

워크플로우:
```
/research day{n} → /write day{n} → /edit day{n} → /test day{n}
```

-> CLAUDE.md에 5일 로드맵 + 에이전트 시스템 섹션 추가
✅ 완료

## 2026-03-29 - 리서처 에이전트에 검색 전략 가이드 추가
WHY: Brave API 추가보다 프롬프트 개선이 효과적 (이미 WebSearch 도구 있음)
HOW: 구체적인 검색 방법 지시 추가
-> `.claude/agents/researcher.md`에 검색 전략 섹션 추가
- 키워드: 한/영 모두, 동의어 활용
- 소스 다양화: 공식문서, 블로그, 유튜브, 깃허브, SNS
- 우선순위: 최신, 무료, 한국어, 초보자 친화적
- 검색량: 주제당 5개+, 도구 비교 3개+

## 2026-03-29 - Day 3 콘텐츠 방향 논의
WHY: Day 1-2는 "멋진 사이트 따라 만들기"였는데, Day 3부터는 "진짜 내 포트폴리오"로 만들어야 함

💡 핵심 인사이트:
- 멋지게만 만들면 안 됨 → 목적에 맞아야 함
- 포트폴리오는 "설득하는 글"이다 (WORKLOG 기존 논의 연결)

Day 3 흐름 확정:
```
1. 목적 정하기 (포트폴리오론)
   - 왜 만드는지 (취업? 프리랜서 수주? 브랜딩?)
   - 누가 볼 건지 (채용담당자? 클라이언트?)
   - 그 사람이 뭘 기대하는지
   → 그래서 뭘 보여줘야 하는지

2. 나 위키 만들기
   - Codex에 내 모든 자료 쏟아붓기 (이력서, 프로젝트 자료 등)
   - "나에 대한 모든 정보가 모여있는 원천 자료"

3. 인터뷰로 카피 뽑기
   - 위키 기반으로 AI와 대화
   - 목적에 맞게 카피라이팅 가공

4. 웹사이트에 적용
   - Day 2 결과물에 콘텐츠 채우기
```

용어: "위키" 채택 (비개발자도 이해하기 쉬움, 위키피디아 연상)

## 2026-03-31 02:28 - Day 4 잠금 해제
WHY: 4일차 콘텐츠 오픈
-> workbook/page.tsx: isLocked 조건 mission.day > 3 → mission.day > 4로 변경

## 2026-04-01 - Day 5, 6 잠금 해제 + Day 5 보너스로 이동
WHY: Day 5, Day 6 콘텐츠 오픈
HOW:
- MISSIONS에서 Day 5 제거, BONUS_MISSIONS로 이동
- Day 6의 isLocked: true → false로 변경
- MISSIONS 잠금 조건 제거 (Day 1~4 모두 열림)
-> workbook/page.tsx 수정
