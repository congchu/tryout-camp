import { DayContent } from './types'

export const day4: DayContent = {
  title: '사이트 만들고 배포!',
  subtitle: 'AI로 사이트를 만들고, 세상에 공개해요!',
  steps: [
    {
      id: 'step-1',
      title: 'AI로 사이트 만들기',
      duration: '15분',
      content: `Lovable에 프롬프트를 입력해요.

**프롬프트 예시:**
\`\`\`
포트폴리오 웹사이트를 만들어줘.

이름: 홍길동
직함: UI/UX 디자이너
태그라인: 복잡함을 단순하게

스타일: 미니멀, 밝은 배경
레퍼런스: [참고 사이트 URL]

프로젝트:
1. OO앱 리디자인 - 설명
2. XX 브랜딩 - 설명
\`\`\`

Day 1~3에서 정리한 내용을 넣으면 돼요!`
    },
    {
      id: 'step-2',
      title: '수정 요청하기',
      duration: '10분',
      content: `첫 결과물이 완벽하지 않아도 괜찮아요!

**수정 요청 예시:**
- "색상을 더 따뜻하게 바꿔줘"
- "프로젝트 카드 간격을 더 넓게"
- "폰트를 더 현대적으로"

**팁:** 한 번에 여러 개 수정하지 말고, 하나씩 요청하세요.`
    },
    {
      id: 'step-3',
      title: '배포하기',
      duration: '5분',
      content: `Lovable에서 바로 배포할 수 있어요!

**배포 방법:**
1. 오른쪽 상단 "Publish" 클릭
2. URL 확인 (yourname.lovable.app)
3. 완료!

이제 누구에게든 링크를 공유할 수 있어요.`
    }
  ],
  mission: {
    title: 'Day 4 미션',
    description: '완성된 포트폴리오 URL을 슬랙에 공유하세요!',
    placeholder: '포트폴리오 URL:\n\n만들면서 어려웠던 점:\n\n마음에 드는 부분:'
  }
}
