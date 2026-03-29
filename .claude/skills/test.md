# /test

Day 콘텐츠를 유저 관점에서 테스트하는 스킬

## 사용법

```
/test day3
/test day3 understanding
/test day3 execution
```

## 실행 절차

1. `.claude/agents/tester.md` 가이드 읽기
2. 대상 파일 읽기: `day{n}.ts`
3. 페르소나 관점에서 읽기
4. 테스트 체크리스트 수행
5. `sample/test-day{n}.md`로 결과 저장
6. 핸드오프 메시지 출력

## 테스트 항목

- **understanding**: 이해도 테스트
- **execution**: 실행 가능성 테스트
- **motivation**: 동기 부여 테스트
- **time**: 시간 현실성 테스트

## 핸드오프

테스트 완료 후 다음 메시지 출력:

```
✅ 테스트 완료: sample/test-day{n}.md

발견된 문제:
- ...

종합 평가: ⭐⭐⭐⭐☆

심각한 문제 있으면: /write day{n} 또는 /edit day{n}로 수정 필요
문제 없으면: Day {n} 콘텐츠 완성!
```
