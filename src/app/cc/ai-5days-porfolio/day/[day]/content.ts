export type Step = {
  title: string
  duration: string
  content: ContentBlock[]
}

export type ContentBlock =
  | { type: 'text'; value: string }
  | { type: 'prompt'; value: string }
  | { type: 'list'; items: string[] }
  | { type: 'tip'; value: string }
  | { type: 'input'; label: string; placeholder?: string }
  | { type: 'checkbox'; items: string[] }

export type DayContent = {
  day: number
  emoji: string
  title: string
  totalTime: string
  steps: Step[]
  mission: string
}

export const DAYS_CONTENT: DayContent[] = [
  {
    day: 1,
    emoji: '🛠',
    title: 'AI 툴 셋팅 + 타겟 분석',
    totalTime: '30분',
    steps: [
      {
        title: 'AI 툴 준비하기',
        duration: '5분',
        content: [
          { type: 'text', value: '오늘 사용할 도구 2개만 준비하면 됩니다. 둘 다 무료!' },
          {
            type: 'list',
            items: [
              'ChatGPT 접속 (chat.openai.com) — 무료 플랜 OK',
              'Lovable 또는 v0.dev 회원가입 — 무료 플랜 OK',
            ],
          },
          { type: 'tip', value: '오늘 쓸 도구는 이 2개뿐! 나머지는 신경 끄세요 😎' },
        ],
      },
      {
        title: '내 강점 분석하기',
        duration: '10분',
        content: [
          { type: 'text', value: 'ChatGPT에게 아래 프롬프트를 복사해서 붙여넣기 하세요.' },
          {
            type: 'prompt',
            value: `나는 [직업/경력]이고, [경력 연수]년차야.
내가 잘하는 것, 남들이 나한테 자주 부탁하는 것,
내가 재밌어서 시간 가는 줄 모르고 하는 것을 분석해줘.
포트폴리오에 넣을 핵심 강점 3가지를 뽑아줘.`,
          },
          {
            type: 'list',
            items: [
              'AI가 뽑아준 강점 3가지 메모하기',
              '마음에 안 들면 대화로 수정 요청하기',
            ],
          },
        ],
      },
      {
        title: '타겟 고객 정하기',
        duration: '10분',
        content: [
          { type: 'text', value: 'Step 2에서 나온 강점을 바탕으로, 이상적인 고객 1명을 만들어봐요.' },
          {
            type: 'prompt',
            value: `내 강점은 [Step 2 결과]야.
이 강점으로 도움을 줄 수 있는 이상적인 고객 1명을 만들어줘.
이름, 나이, 직업, 지금 고민하고 있는 것, 내가 해결해줄 수 있는 것을 포함해서.`,
          },
          {
            type: 'list',
            items: ['고객 페르소나 카드 저장하기'],
          },
        ],
      },
      {
        title: '포트폴리오 컨셉 정하기',
        duration: '5분',
        content: [
          { type: 'text', value: '마지막으로, 나를 한 줄로 소개하는 문장을 만들어요.' },
          {
            type: 'prompt',
            value: `위 내용을 바탕으로, 내 포트폴리오의 한 줄 소개를 만들어줘.
[이름] — [한 줄 소개] 형태로.
3가지 후보를 제시하고, 각각 왜 좋은지 설명해줘.`,
          },
          {
            type: 'list',
            items: ['마음에 드는 한 줄 소개 선택'],
          },
        ],
      },
    ],
    mission:
      "슬랙에 '내 강점 3가지 + 타겟 고객 페르소나 + 한 줄 소개' 공유하기",
  },
  {
    day: 2,
    emoji: '📂',
    title: '작업물 정리 + 구성 초안',
    totalTime: '30분',
    steps: [
      {
        title: '내 작업물/경험 정리',
        duration: '15분',
        content: [
          { type: 'text', value: '지금까지 해온 프로젝트와 경험을 정리해볼 거예요. 대충 나열해도 AI가 잘 정리해줍니다!' },
          {
            type: 'prompt',
            value: `나는 [직업]이고, 지금까지 해온 프로젝트/경험은 이거야:
[나열하기]
포트폴리오에 넣을 만한 대표 프로젝트 3~5개를 골라주고,
각각 '무슨 문제 → 어떻게 해결 → 결과/수치'로 정리해줘.`,
          },
          {
            type: 'list',
            items: ['3~5개 프로젝트 정리'],
          },
        ],
      },
      {
        title: '포트폴리오 구성 짜기',
        duration: '10분',
        content: [
          { type: 'text', value: '정리한 내용으로 포트폴리오 웹사이트의 구성(섹션)을 짜볼 거예요.' },
          {
            type: 'prompt',
            value: `위 내용으로 포트폴리오 웹사이트 구성(섹션)을 짜줘.
원페이지 포트폴리오 기준으로, 어떤 섹션이 어떤 순서로 있으면 좋을지.
각 섹션에 들어갈 내용 요약도 포함해줘.`,
          },
        ],
      },
      {
        title: '레퍼런스 찾기',
        duration: '5분',
        content: [
          { type: 'text', value: '마음에 드는 포트폴리오 사이트 2~3개를 찾아보세요.' },
          {
            type: 'list',
            items: [
              '추천 사이트: dribbble.com, awwwards.com',
              '또는 구글에서 "portfolio site" 검색',
              '어떤 점이 마음에 드는지 메모',
            ],
          },
          { type: 'tip', value: '레이아웃, 색감, 분위기 위주로 봐주세요. 내용은 내 것으로 채우면 됩니다!' },
        ],
      },
    ],
    mission:
      "슬랙에 '프로젝트 정리 + 구성 초안 + 레퍼런스 2~3개 링크' 공유하기",
  },
  {
    day: 3,
    emoji: '🎨',
    title: 'AI로 포트폴리오 1차 제작',
    totalTime: '30분',
    steps: [
      {
        title: 'Lovable/v0에서 포트폴리오 생성',
        duration: '20분',
        content: [
          { type: 'text', value: 'Lovable(lovable.dev) 또는 v0.dev에 접속해서 아래 프롬프트를 입력하세요.' },
          {
            type: 'prompt',
            value: `아래 내용으로 원페이지 포트폴리오 웹사이트를 만들어줘.

[이름]: [한 줄 소개]

[구성 초안 전체 붙여넣기]

디자인 스타일: [레퍼런스에서 마음에 들었던 키워드 — 예: 미니멀, 다크모드, 깔끔한]`,
          },
          { type: 'text', value: '생성된 결과를 확인하고, 마음에 안 드는 부분은 대화로 수정 요청하세요.' },
          {
            type: 'list',
            items: [
              "예: '히어로 섹션 배경을 어둡게 바꿔줘'",
              "예: '프로젝트 카드 디자인을 좀 더 모던하게'",
            ],
          },
        ],
      },
      {
        title: '콘텐츠 채우기',
        duration: '10분',
        content: [
          { type: 'text', value: '아직 더미 텍스트인 부분을 실제 내용으로 교체해요.' },
          {
            type: 'list',
            items: [
              'Day 2에서 정리한 프로젝트 내용 복붙',
              '프로필 사진이 있으면 추가 (없어도 OK)',
            ],
          },
          { type: 'tip', value: '완벽하지 않아도 괜찮아요. 내일 배포하고 나서도 수정할 수 있어요!' },
        ],
      },
    ],
    mission: "슬랙에 '포트폴리오 1차 결과물 스크린샷' 공유하기",
  },
  {
    day: 4,
    emoji: '🚀',
    title: '배포하기',
    totalTime: '30분',
    steps: [
      {
        title: 'Vercel로 배포',
        duration: '15분',
        content: [
          { type: 'text', value: '드디어 세상에 공개하는 날! 생각보다 쉬워요.' },
          {
            type: 'list',
            items: [
              'Lovable에서 만든 결과물 → GitHub 연동 or 코드 다운로드',
              'vercel.com 접속 → GitHub 연결 → 프로젝트 import',
              'Deploy 버튼 클릭 → 1분 뒤 라이브 URL 생성!',
              '(Lovable 자체 배포 기능 써도 OK)',
            ],
          },
          { type: 'tip', value: 'Lovable 자체 배포가 가장 쉽습니다. Vercel은 나중에 커스텀 도메인을 쓰고 싶을 때!' },
        ],
      },
      {
        title: '실제 접속해서 확인',
        duration: '5분',
        content: [
          { type: 'text', value: '배포된 사이트를 직접 확인해보세요.' },
          {
            type: 'list',
            items: [
              '모바일로 접속해보기',
              '다른 사람한테 링크 보내서 보여주기',
              '깨지거나 이상한 부분 메모',
            ],
          },
        ],
      },
      {
        title: '수정 사항 반영',
        duration: '10분',
        content: [
          { type: 'text', value: '깨진 부분이나 마음에 안 드는 부분을 수정해요.' },
          {
            type: 'list',
            items: [
              'AI한테 수정 요청하기',
              '재배포 (Vercel은 push하면 자동 배포)',
            ],
          },
        ],
      },
    ],
    mission: "슬랙에 '라이브 URL' 공유하기 🎉",
  },
  {
    day: 5,
    emoji: '🔄',
    title: '피드백 받고 최종 개선',
    totalTime: '30분',
    steps: [
      {
        title: 'AI 고객 피드백 받기',
        duration: '10분',
        content: [
          { type: 'text', value: 'Day 1에서 만든 고객 페르소나를 활용해서, AI한테 피드백을 받아볼 거예요.' },
          {
            type: 'prompt',
            value: `너는 [페르소나 이름]이야. [직업]이고, [고민]을 갖고 있어.
아래 포트폴리오 사이트를 보고 솔직하게 피드백해줘:
[포트폴리오 URL 또는 내용 복붙]

1. 첫인상은 어때?
2. 이 사람한테 연락하고 싶어?
3. 뭐가 부족해?
4. 뭐가 좋아?`,
          },
        ],
      },
      {
        title: '피드백 반영',
        duration: '15분',
        content: [
          { type: 'text', value: 'AI 피드백에서 핵심 수정 포인트 2~3개를 뽑아서 반영하세요.' },
          {
            type: 'list',
            items: [
              'AI 피드백에서 핵심 수정 포인트 2~3개 뽑기',
              'Lovable/v0에서 수정 반영',
              '재배포',
            ],
          },
        ],
      },
      {
        title: '최종 점검',
        duration: '5분',
        content: [
          { type: 'text', value: '마지막 점검! 이것만 확인하면 끝!' },
          {
            type: 'list',
            items: [
              '오탈자 확인',
              '모바일/PC 양쪽에서 확인',
              '링크 공유 테스트',
            ],
          },
          { type: 'tip', value: '축하합니다! 이제 나만의 포트폴리오가 완성됐어요 🎉🎉' },
        ],
      },
    ],
    mission:
      "슬랙에 '최종 포트폴리오 URL + 변경점 메모' 공유하기 🎉🎉",
  },
]
