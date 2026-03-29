# Day 콘텐츠 제작 워크플로우

새로운 Day 콘텐츠를 제작할 때 따르는 전체 흐름

## 워크플로우 다이어그램

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  리서쳐     │ ──▶ │ 워크북제작자 │ ──▶ │   편집자    │ ──▶ │ 유저테스터  │
│ /research   │     │   /write    │     │   /edit     │     │   /test     │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
       │                   │                   │                   │
       ▼                   ▼                   ▼                   ▼
research-day{n}.md    day{n}.ts         day{n}.ts 수정     test-day{n}.md
                                                                   │
                                                                   ▼
                                                        ┌──────────────────┐
                                                        │ 문제 있으면      │
                                                        │ /write 또는 /edit│
                                                        │ 로 돌아감        │
                                                        └──────────────────┘
```

## 단계별 상세

### 1단계: 리서치 (`/research day{n}`)

**입력:**
- CLAUDE.md의 5일 로드맵

**출력:**
- `sample/research-day{n}.md`

**핸드오프:**
- 리서치 파일 경로 전달
- 핵심 포인트 3개 요약

---

### 2단계: 콘텐츠 작성 (`/write day{n}`)

**입력:**
- 리서치 파일: `sample/research-day{n}.md`
- 이전 Day: `day{n-1}.ts`
- 로드맵: CLAUDE.md

**출력:**
- `day{n}.ts`

**핸드오프:**
- 파일 경로 전달
- 작성 의도/고민 공유

---

### 3단계: 편집 (`/edit day{n}`)

**입력:**
- 대상 파일: `day{n}.ts`
- 이전/다음 Day 파일

**출력:**
- 수정된 `day{n}.ts`

**핸드오프:**
- 수정 사항 요약
- 확인 필요 사항 전달

---

### 4단계: 유저 테스트 (`/test day{n}`)

**입력:**
- 대상 파일: `day{n}.ts`
- 편집 노트 (있으면)

**출력:**
- `sample/test-day{n}.md`

**핸드오프:**
- 문제 없으면: **완료!**
- 문제 있으면: `/write` 또는 `/edit`로 되돌아감

---

## 전체 실행 예시

```bash
# Day 3 콘텐츠 제작

/research day3
# → sample/research-day3.md 생성

/write day3
# → day3.ts 생성

/edit day3
# → day3.ts 수정

/test day3
# → sample/test-day3.md 생성
# → 문제 발견 시 /edit day3 재실행
```

## 빠른 실행 (리서치 스킵)

이미 주제가 명확하면:

```bash
/write day3
/edit day3
/test day3
```

## 부분 수정

특정 부분만 수정할 때:

```bash
/edit day3 tone      # 톤앤매너만 검토
/test day3 execution # 실행 가능성만 테스트
```
