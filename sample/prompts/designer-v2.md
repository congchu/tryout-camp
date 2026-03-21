# 디자이너 포트폴리오 생성 프롬프트

> 이 프롬프트는 여러 번 실행해도 동일한 결과가 나오도록 설계됨

---

## 역할

너는 10년차 프론트엔드 개발자다.
아래 명세를 정확히 따라 단일 HTML 파일을 생성한다.
명세에 없는 것은 추가하지 않는다.

---

## 출력 형식

- 파일명: `designer-portfolio.html`
- 단일 HTML 파일 (CSS 내장, JS 최소화)
- 인코딩: UTF-8
- 언어: 한국어

---

## 기술 스택

```
- HTML5
- CSS3 (내장 <style> 태그)
- Google Fonts: Pretendard
- JavaScript: 없음 (순수 CSS만)
```

---

## 색상 시스템 (정확히 이 값만 사용)

```css
:root {
  --bg-primary: #FAFAFA;
  --bg-card: #FFFFFF;
  --text-primary: #1A1A1A;
  --text-secondary: #6B7280;
  --text-muted: #9CA3AF;
  --gradient-start: #8B5CF6;
  --gradient-end: #EC4899;
  --border: #E5E7EB;
  --shadow: rgba(0, 0, 0, 0.08);
}
```

---

## 타이포그래피 (정확히 이 값만 사용)

```css
/* 폰트 */
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;

/* Hero 이름 */
.hero-name { font-size: 56px; font-weight: 700; line-height: 1.2; }

/* Hero 태그라인 */
.hero-tagline { font-size: 24px; font-weight: 400; line-height: 1.5; }

/* Hero 소개 */
.hero-intro { font-size: 18px; font-weight: 400; line-height: 1.8; }

/* 섹션 제목 */
.section-title { font-size: 32px; font-weight: 700; line-height: 1.3; }

/* 카드 제목 */
.card-title { font-size: 20px; font-weight: 600; line-height: 1.4; }

/* 카드 카테고리 */
.card-category { font-size: 14px; font-weight: 500; line-height: 1.5; }

/* 카드 설명 */
.card-desc { font-size: 15px; font-weight: 400; line-height: 1.6; }

/* 카드 메타 (기간) */
.card-meta { font-size: 13px; font-weight: 400; line-height: 1.5; }

/* 스킬 태그 */
.skill-tag { font-size: 14px; font-weight: 500; line-height: 1.5; }

/* 연락처 */
.contact-link { font-size: 16px; font-weight: 500; line-height: 1.5; }

/* Footer */
.footer-text { font-size: 14px; font-weight: 400; line-height: 1.5; }
```

---

## 레이아웃 (정확히 이 값만 사용)

```css
/* 컨테이너 */
.container { max-width: 960px; margin: 0 auto; padding: 0 24px; }

/* 섹션 간격 */
section { padding: 80px 0; }

/* 카드 */
.card {
  background: var(--bg-card);
  border-radius: 16px;
  box-shadow: 0 4px 24px var(--shadow);
  overflow: hidden;
}

/* 카드 호버 */
.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  transition: all 0.3s ease;
}

/* 프로젝트 그리드 */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 32px;
}

/* 스킬 그리드 */
.skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

/* 스킬 태그 */
.skill-tag {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 100px;
  padding: 8px 16px;
}
```

---

## 섹션 구조 (이 순서대로, 이 내용만)

### 1. Hero 섹션

```
위치: 페이지 최상단
높이: 100vh (전체 화면)
정렬: 중앙 정렬 (가로, 세로 모두)
배경: var(--bg-primary)

내용:
- 이름: 김수진
- 직함: Product Designer
- 태그라인: 스타트업과 빠르게 호흡하는 디자이너
- 소개: 5개 스타트업. 평균 2주. 빠르게 치고, 자주 보여주고, 바로 고칩니다. 느린 거 못 참아요.

스타일:
- 이름: 그라데이션 텍스트 (gradient-start → gradient-end)
- 태그라인: text-secondary 색상
- 소개: text-primary 색상
- 이름과 태그라인 사이: 16px
- 태그라인과 소개 사이: 24px
```

### 2. Skills 섹션

```
배경: var(--bg-primary)
섹션 제목: "Skills"

스킬 목록 (태그 형태로 가로 나열):
- Figma
- Sketch
- Adobe XD
- Photoshop
- Illustrator
- Framer
- Notion
- Slack

스타일:
- 제목과 태그 사이: 32px
- 태그 배경: var(--bg-card)
- 태그 테두리: 1px solid var(--border)
- 태그 모서리: 100px (pill 형태)
- 태그 패딩: 8px 16px
- 태그 간격: 12px
```

### 3. Projects 섹션

```
배경: var(--bg-card)
섹션 제목: "Projects"
레이아웃: 2열 그리드, gap 32px

프로젝트 1:
- 이미지: images/project-01.webp
- 카테고리: App UI/UX
- 제목: 핀테크 앱 리디자인
- 설명: 기존 뱅킹 앱 사용성 개선. 전환율 40% 상승.
- 기간: 2주 완성

프로젝트 2:
- 이미지: images/project-02.webp
- 카테고리: Web Design
- 제목: 이커머스 웹사이트
- 설명: 반응형 쇼핑몰 디자인. 런칭 후 첫 달 매출 2배.
- 기간: 3주 완성

프로젝트 3:
- 이미지: images/project-03.webp
- 카테고리: Dashboard
- 제목: 헬스케어 대시보드
- 설명: 의료진용 데이터 시각화. 복잡한 정보를 단순하게.
- 기간: 2주 완성

프로젝트 4:
- 이미지: images/project-04.webp
- 카테고리: Branding
- 제목: 푸드테크 브랜딩
- 설명: 로고, 컬러, 타이포. 브랜드 가이드라인까지.
- 기간: 10일 완성

카드 구조:
- 이미지: 상단, width 100%, aspect-ratio 16/10, object-fit cover
- 콘텐츠: padding 24px
- 카테고리: 그라데이션 텍스트, margin-bottom 8px
- 제목: text-primary, margin-bottom 8px
- 설명: text-secondary, margin-bottom 12px
- 기간: text-muted
```

### 4. Contact 섹션

```
배경: var(--bg-primary)
정렬: 중앙 정렬
섹션 제목: "Contact"

내용:
- 메인 텍스트: "프로젝트 문의는 언제든 환영합니다"
- 이메일: sujin.design@gmail.com (mailto 링크)
- 소셜: LinkedIn, Instagram (가로 나열)

스타일:
- 메인 텍스트: 24px, text-secondary, margin-bottom 32px
- 이메일: 그라데이션 텍스트, 20px, font-weight 600
- 소셜 링크: text-secondary, 호버 시 text-primary
- 이메일과 소셜 사이: 24px
- 소셜 링크 간격: 24px
```

### 5. Footer

```
배경: var(--bg-primary)
정렬: 중앙 정렬
패딩: 40px 0
border-top: 1px solid var(--border)

내용:
- 텍스트: "© 2024 김수진. All rights reserved."
- 색상: text-muted
```

---

## 반응형 (모바일)

```css
@media (max-width: 768px) {
  .hero-name { font-size: 40px; }
  .hero-tagline { font-size: 20px; }
  .hero-intro { font-size: 16px; }
  .section-title { font-size: 28px; }
  .projects-grid { grid-template-columns: 1fr; gap: 24px; }
  .container { padding: 0 20px; }
  section { padding: 60px 0; }
}
```

---

## 그라데이션 텍스트 구현

```css
.gradient-text {
  background: linear-gradient(135deg, var(--gradient-start), var(--gradient-end));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 금지 사항

1. 명세에 없는 섹션 추가 금지
2. 명세에 없는 색상 사용 금지
3. 명세에 없는 텍스트 추가 금지
4. 외부 이미지 URL 사용 금지 (images/ 경로만 사용)
5. JavaScript 사용 금지
6. 애니메이션 추가 금지 (호버 transition만 허용)
7. 아이콘 라이브러리 사용 금지
8. 다크 모드 금지

---

## 체크리스트

생성 후 확인:
- [ ] 모든 색상이 명세와 일치하는가?
- [ ] 모든 폰트 크기가 명세와 일치하는가?
- [ ] 섹션 순서가 명세와 일치하는가?
- [ ] 모든 텍스트가 명세와 일치하는가?
- [ ] 이미지 경로가 images/로 시작하는가?
- [ ] JavaScript가 없는가?

---

## 실행

위 명세를 정확히 따라 `designer-portfolio.html` 파일을 생성하라.
