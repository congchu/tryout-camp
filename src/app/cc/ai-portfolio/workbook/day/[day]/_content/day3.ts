import { DayContent } from './types'

export const day3: DayContent = {
  title: '레퍼런스 + UX 구성',
  subtitle: '마음에 드는 레퍼런스를 찾고, UX를 구성해요',
  steps: [
    {
      id: 'step-1',
      title: '레퍼런스 찾기',
      duration: '15분',
      content: `마음에 드는 포트폴리오 사이트 1~3개를 찾아요.

**참고할 사이트:**
- https://www.bestfolios.com
- https://www.awwwards.com/websites/portfolio/
- Pinterest에서 "portfolio website" 검색

**고를 때 체크:**
- 전체적인 분위기가 나와 맞는가?
- 내 프로젝트가 잘 보일 레이아웃인가?`,
      checkItems: ['레퍼런스 1~3개 찾기', 'URL 저장해두기']
    },
    {
      id: 'step-2',
      title: 'UX 구성 결정하기',
      duration: '10분',
      content: `레퍼런스를 보면서 내 포트폴리오 구성을 정해요.

**결정할 것들:**
1. **전체 색상 톤** - 밝은/어두운/컬러풀
2. **레이아웃** - 1열/2열/그리드
3. **섹션 순서** - Hero → About → Projects → Contact

**팁:** 레퍼런스와 100% 같을 필요 없어요. 느낌만 참고!`,
      checkItems: ['색상 톤 결정', '레이아웃 결정', '섹션 순서 결정']
    },
    {
      id: 'step-3',
      title: '프롬프트 초안 작성',
      duration: '5분',
      content: `내일 AI에게 줄 프롬프트 초안을 작성해요.

**포함할 내용:**
- Day 2에서 정리한 기본 정보
- 레퍼런스 URL
- 원하는 색상/분위기

> 내일 이 프롬프트를 Lovable에 입력할 거예요!`,
      checkItems: ['프롬프트 초안 작성']
    }
  ],
  mission: {
    title: 'Day 3 미션',
    description: '찾은 레퍼런스 URL과 UX 구성 계획을 슬랙에 공유하세요!',
    placeholder: '레퍼런스 URL:\n\n색상 톤:\n레이아웃:\n섹션 순서:\n\n프롬프트 초안:'
  }
}
