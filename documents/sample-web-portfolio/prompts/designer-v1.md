# 디자이너 포트폴리오 프롬프트 v1

## 역할
너는 시니어 프론트엔드 개발자다. 단일 HTML 파일로 포트폴리오 웹사이트를 만든다.

## 기술 스택
- HTML5, CSS3 (내장 style 태그)
- Google Fonts: Pretendard (한글), Inter (영문)
- 외부 라이브러리 없음
- JavaScript 최소화 (필요시에만)

## 스타일: Light & Clean

### 색상 시스템
| 용도 | HEX |
|------|-----|
| 배경 | #FAFAFA |
| 서피스 (카드) | #FFFFFF |
| 텍스트 | #1A1A1A |
| 서브텍스트 | #6B7280 |
| 그라데이션 시작 | #8B5CF6 |
| 그라데이션 끝 | #EC4899 |

### 타이포그래피
| 요소 | 크기 | 굵기 |
|------|------|------|
| Hero 이름 | 56px | 700 |
| Hero 태그라인 | 24px | 400 |
| 섹션 제목 | 36px | 600 |
| 본문 | 16px | 400 |
| 카드 제목 | 20px | 600 |
| 카드 설명 | 14px | 400 |

### 레이아웃
- 컨테이너 최대 너비: 1000px
- 섹션 간 간격: 100px
- 카드 border-radius: 16px
- 카드 box-shadow: 0 4px 20px rgba(0,0,0,0.08)

### 특수 효과
- 네비게이션: backdrop-filter: blur(10px)
- 버튼/링크: 그라데이션 텍스트 (background-clip: text)
- 카드 호버: translateY(-4px) + 그림자 강화

---

## 콘텐츠

### 기본 정보
- 이름: 김수진
- 직함: Product Designer
- 태그라인: 스타트업과 빠르게 호흡하는 디자이너
- 소개: 5개 스타트업. 평균 2주. 빠르게 치고, 자주 보여주고, 바로 고칩니다. 느린 거 못 참아요.

### 스킬
- 디자인: Figma, Sketch, Adobe XD
- 그래픽: Photoshop, Illustrator
- 프로토타이핑: Framer, Principle
- 협업: Notion, Slack, Jira

### 프로젝트 (4개)

#### 프로젝트 1
- 이름: 핀테크 앱 리디자인
- 카테고리: App UI/UX
- 설명: 기존 뱅킹 앱 사용성 개선. 전환율 40% 상승.
- 기간: 2주
- 이미지: images/project-01.webp

#### 프로젝트 2
- 이름: 이커머스 웹사이트
- 카테고리: Web Design
- 설명: 반응형 쇼핑몰 디자인. 런칭 후 첫 달 매출 2배.
- 기간: 3주
- 이미지: images/project-02.webp

#### 프로젝트 3
- 이름: 헬스케어 대시보드
- 카테고리: Dashboard
- 설명: 의료진용 데이터 시각화. 복잡한 정보를 단순하게.
- 기간: 2주
- 이미지: images/project-03.webp

#### 프로젝트 4
- 이름: 푸드테크 브랜딩
- 카테고리: Branding
- 설명: 로고, 컬러, 타이포. 브랜드 가이드라인까지.
- 기간: 10일
- 이미지: images/project-04.webp

### 연락처
- 이메일: sujin.design@gmail.com
- LinkedIn: linkedin.com/in/sujinkim-design
- Instagram: @sujin.designs

---

## 섹션 구조

```
1. Navigation (fixed, 프로스티드 글래스)
2. Hero (이름 + 태그라인 + 소개, 중앙 정렬)
3. Skills (태그 형태로 나열)
4. Projects (2열 그리드, 카드형)
5. Contact (중앙 정렬, CTA 버튼)
6. Footer (심플)
```

---

## 금지 사항
- 외부 이미지 URL 사용 금지 (images/ 폴더 경로 사용)
- 복잡한 JavaScript 금지
- 다크 테마 금지
- 날카로운 모서리 금지 (최소 8px radius)

---

## 출력
- 단일 HTML 파일
- 파일명: designer-portfolio.html
