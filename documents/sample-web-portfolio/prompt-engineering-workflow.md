# 디자이너 포트폴리오 프롬프트 고도화 워크플로우

> 목표: AI에게 여러 번 요청해도 동일한 결과물이 나오는 수준의 상세한 프롬프트 제작

---

## Phase 1: 레퍼런스 수집

### 1.1 트렌드 분석 기사 크롤링
```
URL: https://medium.com/design-bootcamp/12-designers-portfolios-that-will-make-you-jealous-5e5d5dbb7626

추출 항목:
- 포트폴리오 URL 목록
- 각 포트폴리오의 특징
- 공통 트렌드 (미니멀, 커스텀 커서, 큰 타이포 등)
```

### 1.2 스타일 분류
분석 결과를 바탕으로 4가지 타입으로 분류:

| 타입 | 스타일 | 대표 레퍼런스 |
|------|--------|---------------|
| A | Minimal + Bold Typography | Jordan Gilroy |
| B | Dark Theme + Grid | Adrian Zumbrunnen |
| C | Light & Clean | Rachel How |
| D | Bold Interaction | Constance S |

### 1.3 기초 스타일 가이드 작성
각 타입별로 아래 항목 정리:
- 컨셉 (1-2문장)
- 색상 시스템 (HEX 값)
- 타이포그래피 (크기, 굵기, 서체)
- 레이아웃 구조
- 특징적 요소
- 인터랙션
- 금지 사항

**산출물**: `portfolio-style-guide.md`

---

## Phase 2: 레퍼런스 상세 크롤링

### 2.1 대표 사이트 선정
각 타입별 1개 사이트 선정하여 심층 분석

### 2.2 사이트 정보 크롤링
```
추출 항목:
1. 디자이너 정보 (이름, 직함, 소개)
2. 네비게이션 구조
3. 섹션 구조와 순서
4. 색상 팔레트 (정확한 HEX)
5. 폰트 정보
6. 특별 UI 요소/인터랙션
7. 소셜/연락처
```

### 2.3 이미지 에셋 크롤링
```
추출 항목:
- 프로필 이미지 URL
- 프로젝트 썸네일 URL
- 목업 이미지 URL
- 아이콘/데코레이션 URL
```

### 2.4 이미지 다운로드
```bash
mkdir -p sample/images

# 프로필
curl -sL "[URL]" -o profile-pill.png
curl -sL "[URL]" -o profile-photo.jpg

# 프로젝트 (번호 순서대로)
curl -sL "[URL]" -o project-01.webp
curl -sL "[URL]" -o project-02.webp
...

# 목업
curl -sL "[URL]" -o mockup-mobile.webp
curl -sL "[URL]" -o mockup-desktop.webp
```

**산출물**: `sample/images/` 폴더

---

## Phase 3: 프롬프트 고도화

### 3.1 프롬프트 구조 템플릿
```markdown
# 역할
[AI 역할 정의]

# 기술 스택
[사용 기술 고정]

# 색상 시스템
[모든 색상 HEX 값]

# 타이포그래피
[폰트명, 크기, 굵기 - px 단위]

# 간격 시스템
[모든 간격 px 단위]

# 섹션 구조
[순서 고정, 각 섹션 상세 명세]

# 이미지 경로
[고정된 이미지 파일 경로]

# 인터랙션
[duration, easing 포함]

# 금지 사항
[하지 말아야 할 것들]

# 출력 형식
[파일 형식, 구조]
```

### 3.2 재현성 확보 핵심 원칙
1. **모호함 제거**: "적당한", "충분한" 같은 표현 금지
2. **수치 고정**: 모든 크기, 간격, 시간을 px/ms 단위로
3. **색상 고정**: 모든 색상을 HEX로 명시
4. **순서 고정**: 섹션, 요소 순서 명확히
5. **이미지 고정**: placeholder 대신 실제 경로 사용
6. **금지 사항**: AI가 임의로 추가할 수 있는 것들 제한

### 3.3 체크리스트
프롬프트 작성 후 확인:
- [ ] 색상 HEX 값 전체 명시
- [ ] 폰트 이름, 크기, 굵기 전체 명시
- [ ] 각 섹션 구조와 순서 명시
- [ ] 모든 간격 수치 (px 단위)
- [ ] 인터랙션 상세 (duration, easing)
- [ ] 이미지 경로 전체 명시
- [ ] 금지 사항 명시
- [ ] 출력 형식 명시

---

## Phase 4: 검증

### 4.1 동일성 테스트
- 동일 프롬프트로 3회 이상 생성
- 결과물 비교하여 차이점 확인
- 차이 발생 시 해당 부분 프롬프트 보강

### 4.2 프롬프트 버전 관리
```
sample/prompts/
├── type-a-v1.md
├── type-a-v2.md  (수정 사항 기록)
├── type-b-v1.md
...
```

---

## 현재 진행 상황

### 완료
- [x] Phase 1: 레퍼런스 수집
- [x] Phase 2.1: 대표 사이트 선정 (Rachel How)
- [x] Phase 2.2: 사이트 정보 크롤링
- [x] Phase 2.3: 이미지 URL 추출
- [x] Phase 2.4: 이미지 다운로드

### 진행 예정
- [ ] Phase 3: Type C (Light & Clean) 프롬프트 고도화
- [ ] Phase 3: Type A, B, D 프롬프트 고도화
- [ ] Phase 4: 검증

---

## 폴더 구조

```
sample/
├── portfolio-style-guide.md      # 4가지 타입 스타일 가이드
├── prompt-engineering-workflow.md # 이 문서 (작업 과정 기록)
├── images/                        # 다운로드한 이미지 에셋
│   ├── profile-pill.png
│   ├── profile-photo.jpg
│   ├── project-01.webp
│   ├── project-02.webp
│   ├── project-03.webp
│   ├── project-04.webp
│   ├── project-05.webp
│   ├── project-06.png
│   ├── mockup-mobile.webp
│   └── mockup-desktop.webp
└── prompts/                       # (예정) 완성된 프롬프트들
    ├── type-a-minimal-bold.md
    ├── type-b-dark-grid.md
    ├── type-c-light-clean.md
    └── type-d-bold-interaction.md
```

---

## 참고 자료

### 크롤링한 레퍼런스
- Medium 기사: https://medium.com/design-bootcamp/12-designers-portfolios-that-will-make-you-jealous-5e5d5dbb7626
- Rachel How: https://www.rachelhow.com/

### 레퍼런스 포트폴리오 목록
1. Rachel How - rachelhow.com
2. Daniel Autry - danielautry.com
3. Adrian Zumbrunnen - azumbrunnen.me
4. Jordan Gilroy - jordangilroy.com
5. Daniel Vaszka - danielvaszka.com
6. Igor Sokoltsov - igorsokoltsov.com
7. Constance S - constancesouville.com
8. Daniel Gamble - danielgamble.com.au
9. Olha Uzhykova - olhauzhykova.com
10. Shabnam Kashani - shabnamkashani.com
11. Ran Segall - ransegall.com
12. Michal Malewicz - michalmalewicz.com
