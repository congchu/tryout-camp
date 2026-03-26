import Link from "next/link";
import { notFound } from "next/navigation";
import { getWorkbook } from "@/lib/file-content";
import { ArrowLeft, Clock, CheckCircle2, PlayCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MissionBookPage({ params }: PageProps) {
  const { slug } = await params;
  const workbook = await getWorkbook(slug);

  if (!workbook || !workbook.challenge) {
    notFound();
  }

  const { challenge } = workbook;
  const missions = challenge.dailyMissions || [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero */}
      <section className="relative pt-14 pb-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Link
            href={`/cc/${slug}`}
            className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            챌린지 홈
          </Link>

          <div className="flex items-start gap-4 mb-6">
            {workbook.image && (
              <div
                className="w-20 h-20 rounded-xl bg-cover bg-center shrink-0"
                style={{ backgroundImage: `url(${workbook.image})` }}
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                {challenge.title || workbook.title}
              </h1>
              <p className="text-gray-600">
                {challenge.description || workbook.description}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
              {challenge.days}일 완성
            </span>
            {challenge.difficulty && (
              <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">
                {challenge.difficulty}
              </span>
            )}
            {challenge.goal && (
              <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                목표: {challenge.goal}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Mission List */}
      <section className="px-4 pb-20">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            미션 목록
          </h2>

          <div className="space-y-3">
            {missions.map((mission, index) => {
              const isFirst = index === 0;
              // TODO: 실제 진행 상태 연동 시 변경
              const isCompleted = false;

              return (
                <Link
                  key={mission.day}
                  href={`/cc/${slug}/mission-book/day${mission.day}`}
                  className="block bg-white rounded-xl border border-gray-100 p-4 transition-all hover:border-orange-300 hover:shadow-md"
                >
                  <div className="flex items-start gap-4">
                    {/* Day Badge */}
                    <div className={`
                      w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                      ${isCompleted
                        ? "bg-emerald-100 text-emerald-600"
                        : isFirst
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500"
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle2 className="w-6 h-6" />
                      ) : (
                        <span className="text-lg font-bold">{mission.day}</span>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {mission.title}
                        </h3>
                        {isFirst && !isCompleted && (
                          <span className="px-2 py-0.5 bg-orange-500 text-white text-xs font-medium rounded-full shrink-0">
                            시작하기
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 line-clamp-2">
                        {mission.mission}
                      </p>
                      {mission.duration && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                          <Clock className="w-3.5 h-3.5" />
                          {mission.duration}
                        </div>
                      )}
                    </div>

                    {/* Arrow */}
                    <div className="shrink-0 text-gray-300">
                      <PlayCircle className="w-6 h-6" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* CTA */}
          {missions.length > 0 && (
            <div className="mt-8 text-center">
              <Link
                href={`/cc/${slug}/mission-book/day1`}
                className="inline-flex items-center gap-2 px-8 py-4 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
              >
                <PlayCircle className="w-5 h-5" />
                Day 1 시작하기
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const workbook = await getWorkbook(slug);

  return {
    title: `${workbook?.challenge?.title || workbook?.title || "미션북"}`,
    description: workbook?.challenge?.description || workbook?.description,
  };
}
