import "server-only";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import type { WorkbookMeta, DailyMission, Challenge } from "./content.types";

export type { WorkbookMeta, DailyMission, Challenge };

const CONTENTS_DIR = path.join(process.cwd(), "contents");

/**
 * contents/ 하위 모든 디렉토리에서 meta.yaml을 읽어 WorkbookMeta[] 반환
 */
export async function getAllWorkbooks(
  includeUnpublished = false
): Promise<WorkbookMeta[]> {
  const dirs = await fs.readdir(CONTENTS_DIR, { withFileTypes: true });
  const slugs = dirs.filter((d) => d.isDirectory()).map((d) => d.name);

  const results: WorkbookMeta[] = [];

  for (const slug of slugs) {
    const meta = await loadMeta(slug);
    if (!meta) continue;
    if (!includeUnpublished && !meta.published) continue;
    results.push(meta);
  }

  // 최신순 정렬
  results.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return results;
}

/**
 * 특정 slug의 워크북 메타데이터 반환
 */
export async function getWorkbook(slug: string): Promise<WorkbookMeta | null> {
  return loadMeta(slug);
}

/**
 * 미션 마크다운 콘텐츠 로드
 */
export async function getMissionContent(
  slug: string,
  day: number
): Promise<string | null> {
  const dayPadded = day.toString().padStart(2, "0");
  const missionPath = path.join(
    CONTENTS_DIR,
    slug,
    "missions",
    `day-${dayPadded}.md`
  );

  try {
    return await fs.readFile(missionPath, "utf-8");
  } catch {
    return null;
  }
}

/**
 * 특정 slug의 challenge.yaml에서 특정 day의 워크북 미션 데이터 로드
 */
export async function getWorkbookMission(
  slug: string,
  day: number
): Promise<{ mission: DailyMission; totalDays: number; challengeTitle: string } | null> {
  const meta = await loadMeta(slug);
  if (!meta?.challenge?.dailyMissions) return null;

  const mission = meta.challenge.dailyMissions.find((m) => m.day === day);
  if (!mission) return null;

  return {
    mission,
    totalDays: meta.challenge.days,
    challengeTitle: meta.challenge.title,
  };
}

// ========================================
// Internal helpers
// ========================================

async function loadMeta(slug: string): Promise<WorkbookMeta | null> {
  const metaPath = path.join(CONTENTS_DIR, slug, "meta.yaml");

  try {
    const raw = await fs.readFile(metaPath, "utf-8");
    // meta.yaml은 순수 YAML 파일이므로 frontmatter 래핑이 필요
    const wrapped = `---\n${raw}\n---`;
    const { data } = matter(wrapped);

    // challenge.yaml 로드 (있으면)
    const challenge = await loadChallenge(slug);

    return {
      title: data.title || slug,
      slug: data.slug || slug,
      description: data.description || "",
      image: data.image || undefined,
      published: data.published ?? false,
      createdAt: data.createdAt
        ? new Date(data.createdAt).toISOString()
        : new Date().toISOString(),
      challenge,
    };
  } catch {
    return null;
  }
}

async function loadChallenge(slug: string): Promise<Challenge | undefined> {
  const challengePath = path.join(CONTENTS_DIR, slug, "challenge.yaml");

  try {
    const raw = await fs.readFile(challengePath, "utf-8");
    const wrapped = `---\n${raw}\n---`;
    const { data } = matter(wrapped);

    const missions = data.missions || data.dailyMissions || [];

    const dailyMissions: DailyMission[] = missions.map(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (m: any, i: number) => ({
        day: m.day || i + 1,
        title: m.title || "",
        mission: m.mission || m.description || "",
        duration: m.duration || "",
        tips: m.tips || undefined,
        deliverable: m.deliverable || undefined,
      })
    );

    return {
      title: data.title || "",
      description: data.description || "",
      days: data.days || missions.length,
      difficulty: data.difficulty || undefined,
      goal: data.goal || undefined,
      dailyMissions,
    };
  } catch {
    return undefined;
  }
}
