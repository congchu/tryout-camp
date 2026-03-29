# /research

Day별 리서치를 수행하는 스킬

## 사용법

```
/research day3
/research day3 도구
/research day3 레퍼런스
```

## 실행 절차

1. `.claude/agents/researcher.md` 가이드 읽기
2. `documents/syllabus.md`에서 해당 Day 의도 확인
3. 리서치 수행
4. `sample/research-day{n}.md`로 저장
5. 핸드오프 메시지 출력

## 핸드오프

리서치 완료 후 다음 메시지 출력:

```
✅ 리서치 완료: sample/research-day{n}.md

다음 단계: /write day{n}
```
