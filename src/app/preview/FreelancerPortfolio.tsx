export default function KimJisuPortfolio() {
  const services = [
    {
      title: "쇼핑몰 상세페이지",
      description:
        "제품의 장점을 빠르게 이해시키는 구조 설계와 판매 전환을 고려한 비주얼 상세페이지를 제작합니다.",
      tags: ["상세페이지 기획", "배너 디자인", "이벤트 페이지", "상품 정보 시각화"],
      works: [
        {
          client: "뷰티 브랜드",
          title: "신제품 런칭 상세페이지",
          summary: "브랜드 톤에 맞춘 메인 비주얼과 구매 포인트 중심 정보 구조 설계",
          type: "상세페이지",
          date: "2026.03",
        },
        {
          client: "패션 셀러",
          title: "시즌 기획전 배너/상세페이지",
          summary: "모바일 우선 레이아웃으로 핵심 정보 전달력 강화",
          type: "이커머스",
          date: "2026.02",
        },
        {
          client: "라이프스타일 브랜드",
          title: "상세 리디자인 패키지",
          summary: "기존 자료를 재구성해 더 깔끔하고 신뢰감 있게 개선",
          type: "리디자인",
          date: "2026.01",
        },
      ],
    },
    {
      title: "브랜드 로고",
      description:
        "작은 브랜드도 쉽게 기억될 수 있도록, 업종과 분위기에 맞는 로고와 기본 활용 방향을 함께 제안합니다.",
      tags: ["로고 디자인", "브랜드 무드", "컬러 제안", "기본 활용 가이드"],
      works: [
        {
          client: "소형 카페 브랜드",
          title: "신규 브랜드 로고 제작",
          summary: "따뜻하고 감성적인 무드에 맞춘 워드마크/심볼 제안",
          type: "로고",
          date: "2026.03",
        },
        {
          client: "1인 뷰티샵",
          title: "로고 + SNS 프로필 세트",
          summary: "온라인 채널에서 바로 사용할 수 있도록 응용 버전까지 정리",
          type: "브랜딩",
          date: "2026.02",
        },
      ],
    },
  ]

  const trustPoints = [
    {
      title: "응답이 빠릅니다",
      body: "의뢰 전 상담부터 수정 커뮤니케이션까지, 막히지 않도록 빠르게 소통합니다.",
      icon: "✦",
    },
    {
      title: "클라이언트가 보기 쉽게 정리합니다",
      body: "복잡한 디자인 용어보다, 결과물과 선택지를 이해하기 쉬운 방식으로 안내합니다.",
      icon: "▣",
    },
    {
      title: "실사용을 고려해 작업합니다",
      body: "크몽/숨고 문의, 스마트스토어/자사몰 업로드, SNS 활용까지 함께 생각합니다.",
      icon: "◌",
    },
  ]

  const reviews = [
    {
      text: "상세페이지를 너무 깔끔하게 정리해주셔서 제품 장점이 훨씬 잘 보였어요. 요청사항 반영도 빨랐습니다.",
      author: "쇼핑몰 운영자",
    },
    {
      text: "막연했던 로고 방향을 차분하게 잡아주셔서 좋았어요. 작은 브랜드인데도 진지하게 봐주시는 느낌이 있었습니다.",
      author: "브랜드 창업자",
    },
    {
      text: "수정 요청이 많았는데도 커뮤니케이션이 안정적이었고, 최종 결과물이 훨씬 프로페셔널해졌어요.",
      author: "스마트스토어 셀러",
    },
  ]

  const gallery = [
    "쇼핑몰 상세페이지 제작",
    "브랜드 로고 시안",
    "이벤트 배너 디자인",
    "상품 소개 카드뉴스",
  ]

  return (
    <div className="min-h-screen bg-[#f4f4f6] text-[#111827]">
      <header className="sticky top-0 z-20 border-b border-black/5 bg-[#f4f4f6]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
          <div className="text-lg font-semibold tracking-tight">김지수</div>
          <nav className="hidden gap-8 text-sm text-[#6b7280] md:flex">
            <a href="#about" className="hover:text-[#111827]">소개</a>
            <a href="#services" className="hover:text-[#111827]">작업</a>
            <a href="#reviews" className="hover:text-[#111827]">후기</a>
            <a href="#contact" className="hover:text-[#111827]">문의</a>
          </nav>
        </div>
      </header>

      <main>
        <section className="bg-[#040b26] text-white">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8 lg:py-20">
            <div className="flex flex-col justify-center">
              <div className="mb-4 text-sm font-semibold text-[#8b82ff]">웹 디자인 · 프리랜서</div>
              <h1 className="max-w-xl text-4xl font-bold leading-tight tracking-tight lg:text-6xl">
                판매와 인상을 함께 만드는
                <br />
                웹 디자이너입니다.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-white/70 lg:text-lg">
                쇼핑몰 상세페이지와 브랜드 로고 작업을 중심으로,
                첫인상은 깔끔하게, 전달력은 분명하게 만드는 디자인을 합니다.
                크몽/숨고에서 바로 보여줄 수 있는 신뢰감 있는 포트폴리오 구조로 정리했습니다.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#contact"
                  className="rounded-2xl bg-[#5b4dff] px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-[#5b4dff]/30 transition hover:-translate-y-0.5"
                >
                  작업 문의하기 →
                </a>
                <a
                  href="#services"
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10"
                >
                  작업 예시 보기
                </a>
              </div>
            </div>

            <div className="flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-sm rounded-[28px] bg-white/90 p-4 text-[#111827] shadow-2xl shadow-black/30">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[22px] bg-gradient-to-br from-[#f3f4f6] via-[#ffffff] to-[#dbe4ff]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(91,77,255,0.18),transparent_30%),radial-gradient(circle_at_75%_30%,rgba(17,24,39,0.10),transparent_25%),radial-gradient(circle_at_50%_85%,rgba(91,77,255,0.12),transparent_25%)]" />
                  <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/70 bg-white/80 p-4 backdrop-blur">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#6b7280]">Freelance Portfolio</div>
                    <div className="mt-2 text-2xl font-bold">김지수</div>
                    <div className="mt-1 text-sm text-[#6b7280]">Web Designer · Detail Page · Logo</div>
                  </div>
                </div>
                <div className="mt-3 inline-flex rounded-full bg-[#5b4dff] px-3 py-1 text-xs font-semibold text-white">
                  상담 가능
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-[#5b4dff] to-[#6d5cff] text-white">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-6 py-8 text-center md:grid-cols-4 lg:px-8">
            {[
              ["2개", "핵심 작업 분야"],
              ["상세페이지", "쇼핑몰 중심"],
              ["로고 제작", "브랜드 시작점"],
              ["빠른 소통", "클라이언트 친화형"],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/5 px-4 py-5">
                <div className="text-3xl font-bold tracking-tight">{value}</div>
                <div className="mt-1 text-sm text-white/75">{label}</div>
              </div>
            ))}
          </div>
        </section>

        <section id="about" className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b4dff]">Clients Fit</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">이런 분들과 잘 맞습니다</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              "스마트스토어 운영자",
              "크몽/숨고용 포트폴리오가 필요한 프리랜서",
              "상세페이지가 필요한 소형 브랜드",
              "첫 로고가 필요한 1인 창업자",
              "기존 디자인을 깔끔하게 리디자인하고 싶은 셀러",
              "배너/SNS용 확장 디자인이 필요한 분",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-[#d7d8dd] bg-white px-4 py-2 text-sm text-[#4b5563] shadow-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </section>

        <section id="services" className="mx-auto max-w-6xl px-6 pb-16 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b4dff]">Fields</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">주요 작업 분야</h2>

          <div className="mt-8 grid gap-8">
            {services.map((service, idx) => (
              <div key={service.title} className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm">
                <div className="border-b border-black/5 px-6 py-5">
                  <div className="flex flex-wrap gap-3">
                    <span className={`rounded-xl px-4 py-2 text-sm font-semibold ${idx === 0 ? "bg-[#5b4dff] text-white" : "bg-[#f3f4f6] text-[#111827]"}`}>
                      {service.title}
                    </span>
                    {service.tags.map((tag) => (
                      <span key={tag} className="rounded-xl bg-[#f7f7fb] px-3 py-2 text-xs font-medium text-[#6b7280]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="mt-5 max-w-4xl text-sm leading-7 text-[#6b7280] lg:text-base">{service.description}</p>
                </div>

                <div className="space-y-4 p-6">
                  {service.works.map((work) => (
                    <div key={work.title} className="rounded-2xl border border-[#ececf1] bg-[#fafafe] p-5 transition hover:border-[#d8d8e8] hover:bg-white">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="text-xs font-semibold text-[#5b4dff]">{work.client}</div>
                          <div className="mt-1 text-lg font-semibold tracking-tight">{work.title}</div>
                          <div className="mt-2 text-sm text-[#6b7280]">{work.summary}</div>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                          <span className="rounded-full bg-[#ece9ff] px-3 py-1 font-semibold text-[#5b4dff]">{work.type}</span>
                          <span className="text-[#9ca3af]">{work.date}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b4dff]">Why Me</div>
          <h2 className="mt-3 text-3xl font-bold tracking-tight">의뢰 전에 확인해보세요</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {trustPoints.map((point) => (
              <div key={point.title} className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-black/5">
                <div className="text-2xl text-[#5b4dff]">{point.icon}</div>
                <h3 className="mt-4 text-xl font-semibold tracking-tight">{point.title}</h3>
                <p className="mt-3 text-sm leading-7 text-[#6b7280]">{point.body}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="reviews" className="bg-[#efeff2]">
          <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b4dff]">Reviews</div>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">클라이언트 후기</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {reviews.map((review) => (
                <div key={review.text} className="rounded-[24px] bg-white p-6 shadow-sm ring-1 ring-black/5">
                  <div className="text-3xl leading-none text-[#c7c9d1]">“</div>
                  <p className="mt-4 text-sm leading-7 text-[#4b5563]">{review.text}</p>
                  <div className="mt-5 text-sm font-semibold text-[#111827]">{review.author}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-6xl px-6 py-16 lg:px-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.24em] text-[#5b4dff]">Gallery</div>
              <h2 className="mt-3 text-3xl font-bold tracking-tight">작업 무드</h2>
            </div>
            <div className="text-sm text-[#9ca3af]">샘플 섹션</div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((item, idx) => (
              <div key={item} className="group relative aspect-[0.92] overflow-hidden rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
                <div className={`absolute inset-0 ${[
                  "bg-[linear-gradient(135deg,#bfd7ff,#5b4dff)]",
                  "bg-[linear-gradient(135deg,#d9f5ff,#6a77ff)]",
                  "bg-[linear-gradient(135deg,#c8d1ff,#1c274f)]",
                  "bg-[linear-gradient(135deg,#e6ebff,#9aa8ff)]",
                ][idx]}`} />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.55),transparent_25%),radial-gradient(circle_at_80%_80%,rgba(255,255,255,0.25),transparent_20%)]" />
                <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/85 p-4 backdrop-blur transition group-hover:translate-y-[-2px]">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b4dff]">Sample {idx + 1}</div>
                  <div className="mt-2 text-base font-semibold">{item}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section id="contact" className="bg-[#040b26] text-white">
          <div className="mx-auto max-w-4xl px-6 py-20 text-center lg:px-8">
            <h2 className="text-4xl font-bold tracking-tight">작업 문의, 편하게 주세요.</h2>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-white/70">
              쇼핑몰 상세페이지, 브랜드 로고, 배너 작업 등 필요한 범위를 정리해 보내주시면
              일정과 방향에 맞춰 상담해드립니다.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <a
                href="mailto:kimjisu.design@example.com"
                className="rounded-2xl bg-[#5b4dff] px-6 py-4 text-base font-semibold text-white shadow-lg shadow-[#5b4dff]/30"
              >
                kimjisu.design@example.com →
              </a>
              <a
                href="https://kmong.com"
                className="rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-base font-semibold text-white/90"
              >
                크몽/숨고 프로필 연결
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-black/5 bg-[#f4f4f6]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-[#9ca3af] md:flex-row md:items-center md:justify-between lg:px-8">
          <div>김지수 © 2026</div>
          <div className="flex gap-4">
            <span>Instagram</span>
            <span>Behance</span>
            <span>Email</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
