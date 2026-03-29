# /write

Day 콘텐츠를 작성하는 스킬

## 사용법

```
/write day3
/write day3 mission
/write day3 step-2
```

## 실행 절차

1. `.claude/agents/writer.md` 가이드 읽기
2. **⚠️ 스펙 확인: `documents/lesson-plans/day-{n}.md` 읽기** ← 필수!
3. 스펙이 없으면 → 사용자에게 방향 확인 (추측으로 작성 금지)
4. `documents/syllabus.md`에서 해당 Day 의도 확인 (필요시)
5. `sample/research-day{n}.md` 리서치 자료 읽기 (있으면)
6. 이전 Day 콘텐츠 확인 (day{n-1}.ts)
7. 콘텐츠 작성
8. `src/app/cc/ai-portfolio/workbook/day/[day]/_content/day{n}.ts`로 저장
9. 핸드오프 메시지 출력

## 핸드오프

작성 완료 후 다음 메시지 출력:

```
✅ 콘텐츠 작성 완료: day{n}.ts

작성 의도:
- ...

다음 단계: /edit day{n}
```
