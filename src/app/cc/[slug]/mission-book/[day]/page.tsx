import { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { InteractiveWorkbook } from "./_components/InteractiveWorkbook";
import { getWorkbookMission } from "@/lib/file-content";

/* ─── missions/ 마크다운 로드 ─── */
async function getMissionMarkdown(
  slug: string,
  day: string
): Promise<{ title: string; content: string } | null> {
  // day1 -> 01, day2 -> 02, ...
  const dayNum = day.replace("day", "");
  const dayPadded = dayNum.padStart(2, "0");
  const filename = `day-${dayPadded}.md`;

  const filePath = path.join(
    process.cwd(),
    "contents",
    slug,
    "missions",
    filename
  );
  try {
    const raw = await readFile(filePath, "utf-8");
    const { data, content } = matter(raw);
    if (!content.trim()) return null;
    return { title: data.title || "", content: content.trim() };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; day: string }>;
}): Promise<Metadata> {
  const { slug, day } = await params;
  const dayNum = parseInt(day.replace("day", ""));

  const workbook = await getWorkbookMission(slug, dayNum);
  const title = workbook
    ? `Day ${dayNum} - ${workbook.mission.title}`
    : `Day ${dayNum}`;

  return {
    title: `${title}`,
  };
}

export default async function MissionDayPage({
  params,
}: {
  params: Promise<{ slug: string; day: string }>;
}) {
  const { slug, day } = await params;
  const dayNum = parseInt(day.replace("day", ""));

  // missions/ 마크다운 로드
  const missionMarkdown = await getMissionMarkdown(slug, day);
  const workbook = await getWorkbookMission(slug, dayNum);
  const totalDays = workbook?.totalDays || 5;

  if (missionMarkdown) {
    const title = missionMarkdown.title || `Day ${dayNum}`;
    return (
      <InteractiveWorkbook
        slug={slug}
        day={dayNum}
        totalDays={totalDays}
        title={title}
        content={missionMarkdown.content}
      />
    );
  }

  // fallback: 마크다운이 없는 경우
  if (!workbook) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-800">
            미션을 찾을 수 없습니다
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Day {dayNum} 데이터가 아직 준비되지 않았습니다.
          </p>
        </div>
      </div>
    );
  }

  // challenge.yaml의 미션 정보만 있는 경우
  return (
    <InteractiveWorkbook
      slug={slug}
      day={dayNum}
      totalDays={totalDays}
      title={workbook.mission.title}
      content={`# ${workbook.mission.title}\n\n${workbook.mission.mission}`}
    />
  );
}
