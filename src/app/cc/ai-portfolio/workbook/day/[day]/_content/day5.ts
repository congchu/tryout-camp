import { DayContent } from './types'

export const day5: DayContent = {
  title: '사람들이 봤을까?',
  subtitle: '몇 명이 봤는지 확인하는 방법',
  steps: [
    {
      id: 'step-1',
      title: 'Day 5 시작하기',
      duration: '2분',
      content: `## 드디어 마지막 날!

Day 1~4에서 우리는:
- 포트폴리오 웹사이트를 만들고
- 내 정보를 채워넣고
- **진짜 URL로 공개**까지 했습니다

이제 누구에게든 링크를 보낼 수 있습니다.

---

## 근데... 봤을까?

링크를 보냈는데, 상대방이:
- 진짜 봤는지?
- 어디까지 봤는지?
- 관심 있게 봤는지?

**모르겠죠?**

---

## "봤어요~" 는 믿을 수 없다

"포트폴리오 보내드렸는데 확인하셨나요?"
<br><br>
"아 네 봤어요~"
<br><br>
...진짜 봤을까요? 😅

---

## 오늘 할 일

오늘은 **몇 명이 봤는지 확인하는 방법**을 알려드릴게요.

설정해두면:
- 몇 명이 방문했는지
- 언제 방문했는지
- 어느 나라에서 봤는지

**자동으로 기록**됩니다!`
    },
    {
      id: 'step-2',
      title: '믹스패널 세팅하기',
      duration: '10분',
      content: `## Mixpanel(믹스패널)을 사용할 겁니다

> **[Mixpanel](https://mixpanel.com) = 내 사이트에 누가 왔는지 알려주는 서비스**

우리 사이트에 Mixpanel을 연결하면:
- 누가 언제 방문했는지 **자동으로 기록**
- 대시보드에서 **한눈에 확인**
- **무료**로 사용 가능!

---

## 이것도 Codex한테 시키면 됩니다

원래 이런 설정은 코드를 직접 수정해야 해요.
<br><br>
**근데 우리는 몰라도 됩니다!**
<br><br>
Codex가 알아서 해주니까요.

---

## Step 1. Codex에 요청하기

아래 프롬프트를 **그대로 복사**해서 Codex에 붙여넣으세요.

\`\`\`
Mixpanel 연동해줘.
방문자 수 확인하고 싶어.
\`\`\`

Codex가 알아서:
- Mixpanel 계정 만들기 안내
- 필요한 코드 추가
- 설정 완료

---

## Step 2. Mixpanel 가입하기

Codex가 **Mixpanel 가입 페이지**를 안내해줄 거예요.

1. 이메일로 가입
2. 프로젝트 이름 입력 (아무거나 OK)
3. 가입 완료되면 Codex에게 알려주기

\`\`\`
가입 했어
\`\`\`

---

## Step 3. Codex 따라가기

이후부터는 **Codex가 요청하는 걸 계속 수락**해주세요.

코드 수정하고, 설정하고...
<br><br>
복잡한 건 **Codex가 알아서** 다 해줍니다.

---

## Step 4. 다시 배포하기

설정이 끝나면, **다시 배포**해야 반영됩니다.

\`\`\`
다시 배포해줘
\`\`\`

---

## Step 5. 확인하기

배포가 완료되면:

1. 내 포트폴리오 URL에 **직접 접속**해보기
2. Codex에게 물어보기:

\`\`\`
Mixpanel 대시보드 열어줘
\`\`\`

대시보드에서 **방문자 1명** (본인!)이 보이면 성공! 🎉`
    },
    {
      id: 'step-3',
      title: '데일리 접속자수 보기',
      duration: '5분',
      content: `## 접속자 수는 어디서 봐요?

Mixpanel에 들어가면 숫자가 보이긴 하는데...
<br>
**"언제 몇 명이 왔는지"** 한눈에 보려면 **Board**를 만들어야 해요.

---

## Board 만들기

> 🎬 **영상으로 따라해보세요!**

<iframe width="100%" height="450" src="https://www.youtube.com/embed/Bvkh225nRzQ" frameborder="0" allowfullscreen></iframe>

**1. 왼쪽 상단 [+ Create New] 클릭**

**2. [Insights] 선택**

**3. 오른쪽에서 [Select Metric] 클릭 → [Page View] 선택**

**4. 오른쪽 상단 [Save to New Board] 클릭**

**5. 이름에 "접속자수" 입력하고 저장**

---

## 다음부터는?

왼쪽 메뉴 **Your Boards** 아래에 **[접속자수]** 가 생겼어요!
<br><br>
이걸 클릭하면 **언제든 최신 접속자 수**를 확인할 수 있습니다.`
    },
    {
      id: 'step-4',
      title: '기본 템플릿 활용하기',
      duration: '3분',
      content: `Mixpanel에는 **미리 만들어진 대시보드 템플릿**이 있어요.
<br><br>
이런 재미있는 주제들을 볼 수 있어요:
- **DAU** - 오늘 몇 명이 왔는지
- **WAU** - 이번 주에 몇 명이 왔는지
- **MAU** - 이번 달에 몇 명이 왔는지
- **New Users** - 신규 방문자는 몇 명인지
- 사용자는 **어느 국가**에서 방문하고 있는가?
- 사용자는 **어떤 플랫폼**(디바이스/환경)을 사용하고 있는가?

<br>
재미삼아 한번 따라해보세요!

**모르는 내용이 잔뜩이어도 걱정할 필요 없답니다~!**

Codex에게 물어보면 친절하게 설명해줘요(호호, 이제 아시죠?!)

쭉 긁어서 물어보거나, **스크린샷** 찍어서 물어봐도 잘 이해한답니다! 

> 🎬 **영상으로 따라해보세요!**

<iframe width="100%" height="450" src="https://www.youtube.com/embed/u1giI2TEJeI" frameborder="0" allowfullscreen></iframe>`
    },
    {
      id: 'step-5',
      title: 'Session Replay',
      duration: '2분',
      content: `왼쪽 메뉴에서 **Session Replay**를 클릭해보세요.
<br><br>
방문자가 **실제로 내 사이트를 어떻게 봤는지** 녹화된 영상으로 볼 수 있어요!
<br><br>
- 어디를 클릭했는지
- 어디서 멈췄는지
- 어디까지 스크롤했는지

---

## 이걸로 뭘 알 수 있냐면...

- 채용담당자가 **어떤 프로젝트에 관심** 가졌는지
- **연락처까지 갔는지** (컨택 의향 있는지)
- "봤어요~" 했는데 실제로는 **3초 보고 나갔는지** 😅
<br><br>
포트폴리오 **어디를 고쳐야 할지** 힌트를 얻을 수 있어요!

> 🎬 **영상으로 확인해보세요!**

<iframe width="100%" height="450" src="https://www.youtube.com/embed/CJ21GKCUVpA" frameborder="0" allowfullscreen></iframe>`
    },
    {
      id: 'step-6',
      title: 'Day 5 완료!',
      duration: '2분',
      content: `## 수고하셨습니다! 🎉

이제 **몇 명이 내 포트폴리오를 봤는지** 확인할 수 있게 됐어요!
<br><br>
링크를 보내고, 며칠 뒤에 Mixpanel을 확인해보세요.
<br>
생각보다 재미있을 거예요 😎

---

## 🎁 보너스 Day 6

여기까지 오셨다면, **Day 6도 도전해보세요!**
<br><br>
\`yourname.netlify.app\` 대신
<br>
**\`yourname.com\`** 같은 나만의 도메인을 연결하는 방법을 알려드려요.
<br><br>
명함에 넣기 훨씬 멋지겠죠? ✨

---

## 미션 제출
[오늘의 미션](?step=mission)에서 Day 5 미션을 제출해주세요!`
    }
  ],
  mission: {
    title: 'Day 5 미션 제출',
    description: 'Mixpanel 어디까지 해봤나요?',
    fields: [
      {
        id: 'success',
        label: '어디까지 확인해봤나요?',
        type: 'radio',
        options: ['실패했어요 😢', '접속자수 Board까지 만들었어요', '기본 템플릿도 해봤어요', 'Session Replay까지 다 해봤어요'],
        required: true
      },
      {
        id: 'info',
        label: '어떤 정보를 확인했나요?',
        type: 'textarea',
        placeholder: '예: 방문자 3명, 한국에서 접속, 모바일로 봤더라 등',
        required: false
      },
      {
        id: 'want',
        label: '더 알고 싶은 정보가 있나요?',
        type: 'textarea',
        placeholder: '예: 어떤 프로젝트를 오래 봤는지 알고 싶어요',
        required: false
      },
      {
        id: 'feedback',
        label: '셋팅하는 과정이 어떠셨나요? 알려주세요!',
        type: 'textarea',
        placeholder: '어땠나요?',
        required: false
      }
    ]
  }
}
