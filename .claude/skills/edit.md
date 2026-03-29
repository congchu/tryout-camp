# /edit

Day 콘텐츠를 편집/검토하는 스킬

## 사용법

```
/edit day3
/edit day3 tone
/edit day3 flow
```

## 실행 절차

1. `.claude/agents/editor.md` 가이드 읽기
2. 대상 파일 읽기: `day{n}.ts`
3. 이전/다음 Day 파일 확인 (연결성)
4. 검토 기준에 따라 체크
5. 수정사항 반영
6. 핸드오프 메시지 출력

## 검토 항목

- **tone**: 톤앤매너 일관성
- **flow**: 흐름/연결성
- **accuracy**: 기술적 정확성
- **typo**: 오타/문법

## 핸드오프

편집 완료 후 다음 메시지 출력:

```
✅ 편집 완료: day{n}.ts

수정 사항:
- ...

확인 필요:
- ...

다음 단계: /test day{n}
```
