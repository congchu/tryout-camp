# .claude 폴더 구조

Claude Code 에이전트 시스템 설정 폴더

## 에이전트 시스템

Day 콘텐츠 제작을 위한 5개 에이전트가 협업합니다.

### 워크플로우

```
리서쳐 → 기획자 → [사용자 승인] → 워크북 제작자 → 편집자 → 유저 테스터
```

### 에이전트별 역할과 산출물

| 에이전트 | 역할 | 스킬 | 산출물 |
|---------|------|------|--------|
| **리서쳐** | 레퍼런스/도구 조사 | `/research day{n}` | `sample/research-day{n}.md` |
| **기획자** | 스펙 문서 작성 | `/plan day{n}` | `documents/lesson-plans/day-{n}.md` |
| **워크북 제작자** | 실제 콘텐츠 작성 | `/write day{n}` | `src/.../day{n}.ts` |
| **편집자** | 콘텐츠 리뷰/수정 | `/edit day{n}` | `day{n}.ts` (수정) |
| **유저 테스터** | 실행 가능성 테스트 | `/test day{n}` | `sample/test-day{n}.md` |

### 정본 문서

| 문서 | 경로 | 용도 |
|------|------|------|
| 실라버스 | `documents/syllabus.md` | 챌린지 전체 의도 (정본) |
| 레슨 플랜 | `documents/lesson-plans/` | Day별 스펙 (기획자 작성) |

## 폴더 구조

```
.claude/
├── README.md              # 이 파일
├── agents/                # 에이전트 상세 가이드
│   ├── researcher.md      # 리서쳐
│   ├── planner.md         # 기획자
│   ├── writer.md          # 워크북 제작자
│   ├── editor.md          # 편집자
│   └── tester.md          # 유저 테스터
├── skills/                # 스킬 (명령어) 정의
│   ├── research.md        # /research
│   ├── plan.md            # /plan
│   ├── write.md           # /write
│   ├── edit.md            # /edit
│   └── test.md            # /test
└── workflows/             # 워크플로우 정의
    └── day-content.md     # Day 콘텐츠 제작 흐름
```

## 사용 예시

### 새 Day 콘텐츠 만들기

```bash
/research day3    # 리서치
/plan day3        # 스펙 작성 → 사용자 피드백
/write day3       # 콘텐츠 작성
/edit day3        # 편집
/test day3        # 테스트
```

### 스펙이 이미 있으면

```bash
/plan day3        # 스펙 확인/수정 → 사용자 승인
/write day3       # 콘텐츠 작성
```

## 핵심 규칙

1. **기획자는 사용자 승인 필수** - 스펙 작성 후 반드시 피드백 요청
2. **워크북 제작자는 스펙 우선** - `lesson-plans/day-{n}.md` 먼저 확인
3. **실라버스가 정본** - 챌린지 의도는 `syllabus.md` 참조
