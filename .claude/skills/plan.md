# /plan

Day 스펙을 작성하는 스킬

## 사용법

```
/plan day3
/plan day3 --from-research
```

## 실행 절차

1. `.claude/agents/planner.md` 가이드 읽기
2. `documents/syllabus.md`에서 해당 Day 의도 확인
3. `sample/research-day{n}.md` 리서치 자료 읽기 (있으면)
4. 이전 Day 스펙 확인 (`documents/lesson-plans/day-{n-1}.md`)
5. 이전 Day 콘텐츠 확인 (연결성)
6. 스펙 초안 작성
7. `documents/lesson-plans/day-{n}.md`로 저장
8. **슬라이드 형식으로 대표님께 발표** ← 필수!

## 핸드오프

스펙 작성 후 **슬라이드 발표**:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 Day {n} 기획안 보고
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

슬라이드 1: 오늘의 안건
슬라이드 2: 실라버스 리마인드
슬라이드 3: 이전 Day 요약
슬라이드 4: 핵심 메시지
슬라이드 5: 스텝 구성
슬라이드 6: 미션 설계
슬라이드 7: 다음 Day 연결
슬라이드 8: 검토 요청
```

**상세 형식은 `.claude/agents/planner.md` 참조**

사용자 승인 후 → `/write day{n}` 실행
