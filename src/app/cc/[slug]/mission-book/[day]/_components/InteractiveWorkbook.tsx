"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/* ─── Types ─── */

interface InteractiveWorkbookProps {
  slug: string;
  day: number;
  totalDays: number;
  title: string;
  content: string;
}

interface WorkbookState {
  fields: Record<string, string>;
  checklist: Record<string, boolean>;
}

/* ─── localStorage helpers ─── */

function storageKey(slug: string, day: number) {
  return `workbook:${slug}:${day}`;
}

function loadState(slug: string, day: number): WorkbookState {
  if (typeof window === "undefined") return { fields: {}, checklist: {} };
  try {
    const raw = localStorage.getItem(storageKey(slug, day));
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return { fields: {}, checklist: {} };
}

/* ─── Markdown-mode content parsing ─── */

type MdBodyChunk =
  | { type: "markdown"; content: string }
  | { type: "checkbox"; id: string; label: string }
  | { type: "input"; id: string; label: string };

interface ParsedMdStep {
  stepNum: number;
  title: string;
  duration: string;
  bodyChunks: MdBodyChunk[];
  checkboxIds: string[];
}

interface ParsedMdContent {
  preamble: string;
  steps: ParsedMdStep[];
  extraSections: { heading: string; body: string }[];
  finalChecklist: { id: string; label: string }[] | null;
}

function parseMdBody(body: string, sectionId: string): MdBodyChunk[] {
  const lines = body.split("\n");
  const chunks: MdBodyChunk[] = [];
  let mdBuffer: string[] = [];
  let checkIdx = 0;
  let inputIdx = 0;

  const flushMd = () => {
    const content = mdBuffer.join("\n").trim();
    if (content) {
      chunks.push({ type: "markdown", content });
    }
    mdBuffer = [];
  };

  for (const line of lines) {
    const checkMatch = line.match(/^- \[ \] (.+)$/);
    if (checkMatch) {
      flushMd();
      chunks.push({
        type: "checkbox",
        id: `${sectionId}-check-${checkIdx++}`,
        label: checkMatch[1],
      });
      continue;
    }

    const inputMatch = line.match(/^✏️\s*(.+)$/);
    if (inputMatch) {
      flushMd();
      chunks.push({
        type: "input",
        id: `${sectionId}-input-${inputIdx++}`,
        label: inputMatch[1],
      });
      continue;
    }

    mdBuffer.push(line);
  }

  flushMd();
  return chunks;
}

function parseMarkdownForSteps(md: string): ParsedMdContent {
  const lines = md.split("\n");
  const sections: { heading: string; body: string }[] = [];
  let preamble = "";
  let currentHeading = "";
  let currentBody: string[] = [];

  for (const line of lines) {
    const h2Match = line.match(/^## (.+)$/);
    if (h2Match) {
      if (currentHeading) {
        sections.push({ heading: currentHeading, body: currentBody.join("\n") });
      } else {
        preamble = currentBody.join("\n");
      }
      currentHeading = line;
      currentBody = [];
    } else {
      currentBody.push(line);
    }
  }

  if (currentHeading) {
    sections.push({ heading: currentHeading, body: currentBody.join("\n") });
  } else {
    preamble = currentBody.join("\n");
  }

  const steps: ParsedMdStep[] = [];
  let finalChecklist: { id: string; label: string }[] | null = null;
  const extraSections: { heading: string; body: string }[] = [];
  const preStepSections: string[] = [];
  let firstStepSeen = false;

  for (const sec of sections) {
    if (sec.heading.includes("📊")) {
      const items: { id: string; label: string }[] = [];
      for (const line of sec.body.split("\n")) {
        const checkMatch = line.match(/^- \[ \] (.+)$/);
        if (checkMatch) {
          items.push({ id: `final-${items.length}`, label: checkMatch[1] });
        }
      }
      if (items.length > 0) finalChecklist = items;
      continue;
    }

    const stepMatch = sec.heading.match(
      /^## Step (\d+)[:\s]*(.+?)(?:\s*\(([^)]+)\))?\s*$/
    );
    if (stepMatch) {
      firstStepSeen = true;
      const stepNum = parseInt(stepMatch[1]);
      const title = stepMatch[2].trim();
      const duration = stepMatch[3] || "";
      const bodyChunks = parseMdBody(sec.body, `step-${stepNum}`);
      const checkboxIds = bodyChunks
        .filter(
          (c): c is Extract<MdBodyChunk, { type: "checkbox" }> =>
            c.type === "checkbox"
        )
        .map((c) => c.id);
      steps.push({ stepNum, title, duration, bodyChunks, checkboxIds });
      continue;
    }

    if (!firstStepSeen) {
      preStepSections.push(sec.heading + "\n" + sec.body);
    } else {
      extraSections.push({ heading: sec.heading, body: sec.body });
    }
  }

  const fullPreamble = [preamble, ...preStepSections].filter(Boolean).join("\n\n");

  return { preamble: fullPreamble, steps, extraSections, finalChecklist };
}

/* ─── Prose classes ─── */

const PROSE_CLASSES = `workbook-content prose prose-slate max-w-none
  prose-headings:text-gray-800
  prose-h1:text-xl prose-h1:font-bold prose-h1:mb-6 prose-h1:mt-0
  prose-h2:text-lg prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-3
  prose-h3:font-semibold prose-h3:mt-6 prose-h3:mb-2 prose-h3:text-gray-800
  prose-p:text-[0.9375rem] prose-p:text-gray-600 prose-p:leading-relaxed
  prose-strong:text-gray-900
  prose-blockquote:border-l-4 prose-blockquote:border-orange-300 prose-blockquote:bg-orange-50 prose-blockquote:rounded-r-lg prose-blockquote:py-4 prose-blockquote:px-5 prose-blockquote:not-italic prose-blockquote:text-orange-900
  prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none
  prose-pre:bg-gray-50 prose-pre:text-gray-700 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl
  prose-table:text-sm
  prose-th:bg-gray-50 prose-th:font-semibold prose-th:px-3 prose-th:py-2
  prose-td:border-gray-200 prose-td:px-3 prose-td:py-2
  prose-li:text-[0.9375rem] prose-li:text-gray-600
  prose-a:text-orange-500 prose-a:underline prose-a:underline-offset-2
  prose-hr:border-gray-200 prose-hr:my-8
  prose-img:rounded-xl prose-img:shadow-sm
  prose-ol:space-y-1.5 prose-ul:space-y-1.5`;

/* ─── Main component ─── */

export function InteractiveWorkbook({
  slug,
  day,
  totalDays,
  title,
  content,
}: InteractiveWorkbookProps) {
  const hasPrev = day > 1;
  const hasNext = day < totalDays;

  const [state, setState] = useState<WorkbookState>({
    fields: {},
    checklist: {},
  });
  const [hydrated, setHydrated] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load state from localStorage on mount
  useEffect(() => {
    setState(loadState(slug, day));
    setHydrated(true);
  }, [slug, day]);

  // Debounced save to localStorage
  const saveState = useCallback(
    (next: WorkbookState) => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        try {
          localStorage.setItem(storageKey(slug, day), JSON.stringify(next));
        } catch {
          /* quota exceeded etc */
        }
      }, 300);
    },
    [slug, day]
  );

  const handleFieldChange = useCallback(
    (fieldId: string, value: string) => {
      setState((prev) => {
        const next = { ...prev, fields: { ...prev.fields, [fieldId]: value } };
        saveState(next);
        return next;
      });
    },
    [saveState]
  );

  const handleChecklistToggle = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = {
          ...prev,
          checklist: { ...prev.checklist, [id]: !prev.checklist[id] },
        };
        saveState(next);
        return next;
      });
    },
    [saveState]
  );

  // Markdown-mode parsed content and collapsed state
  const parsedMd = useMemo(() => parseMarkdownForSteps(content), [content]);
  const [mdStepCollapsed, setMdStepCollapsed] = useState<Record<number, boolean>>({});

  const parsed = parsedMd;

  // Calculate progress from all checkboxes
  const stepCheckIds = parsed.steps.flatMap((s) => s.checkboxIds);
  const finalCheckIds = parsed.finalChecklist?.map((i) => i.id) ?? [];
  const allCheckIds = [...stepCheckIds, ...finalCheckIds];
  const checkedCount = allCheckIds.filter((id) => state.checklist[id]).length;
  const mdProgress =
    allCheckIds.length > 0
      ? Math.round((checkedCount / allCheckIds.length) * 100)
      : 0;

  const isMdStepDone = (stepIdx: number) => {
    const step = parsed.steps[stepIdx];
    return (
      step.checkboxIds.length > 0 &&
      step.checkboxIds.every((id) => state.checklist[id])
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto max-w-2xl px-4 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-1">
            <Link
              href={`/cc/${slug}/mission-book`}
              className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-xs">목록</span>
            </Link>
          </div>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span className="font-medium text-orange-600">
              Day {day}{" "}
              <span className="text-gray-400">/ {totalDays}</span>
            </span>
            <span className="text-xs">{mdProgress}% 완료</span>
          </div>
          {/* progress bar */}
          <div className="mt-1.5 h-1.5 w-full rounded-full bg-gray-100">
            <div
              className="h-full rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${mdProgress}%` }}
            />
          </div>
          {/* title */}
          <h1 className="mt-3 text-xl font-bold text-gray-900">{title}</h1>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 pb-32 pt-6">
        <main className="min-w-0 flex-1">
          {/* Preamble */}
          {parsed.preamble.trim() && (
            <article className={PROSE_CLASSES}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {parsed.preamble}
              </ReactMarkdown>
            </article>
          )}

          {/* Steps as collapsible StepCards */}
          {parsed.steps.map((step, idx) => (
            <MdStepCard
              key={idx}
              step={step.stepNum}
              title={step.title}
              duration={step.duration}
              done={isMdStepDone(idx)}
              collapsed={mdStepCollapsed[idx] ?? true}
              onToggle={() =>
                setMdStepCollapsed((prev) => ({
                  ...prev,
                  [idx]: !(prev[idx] ?? true),
                }))
              }
            >
              {hydrated &&
                step.bodyChunks.map((chunk, ci) => {
                  if (chunk.type === "markdown") {
                    return (
                      <article key={ci} className={PROSE_CLASSES}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {chunk.content}
                        </ReactMarkdown>
                      </article>
                    );
                  }
                  if (chunk.type === "checkbox") {
                    return (
                      <MdCheckbox
                        key={ci}
                        label={chunk.label}
                        checked={!!state.checklist[chunk.id]}
                        onToggle={() => handleChecklistToggle(chunk.id)}
                      />
                    );
                  }
                  if (chunk.type === "input") {
                    return (
                      <MdWriteField
                        key={ci}
                        label={chunk.label}
                        value={String(state.fields[chunk.id] ?? "")}
                        onChange={(v) => handleFieldChange(chunk.id, v)}
                      />
                    );
                  }
                  return null;
                })}
            </MdStepCard>
          ))}

          {/* Extra non-step sections */}
          {parsed.extraSections.length > 0 && (
            <div className="mt-8">
              {parsed.extraSections.map((sec, idx) => (
                <article key={`extra-${idx}`} className={PROSE_CLASSES}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {sec.heading + "\n" + sec.body}
                  </ReactMarkdown>
                </article>
              ))}
            </div>
          )}

          {/* Final Checklist */}
          {hydrated && parsed.finalChecklist && parsed.finalChecklist.length > 0 && (
            <section className="mt-10">
              <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
                <h2 className="mb-1 text-lg font-bold text-gray-900">
                  📊 Day {day} 최종 체크리스트
                </h2>
                <p className="mb-5 text-sm text-gray-500">
                  오늘 한 일을 최종 확인하세요.
                </p>
                <ul className="space-y-3">
                  {parsed.finalChecklist.map((item) => {
                    const isChecked = !!state.checklist[item.id];
                    return (
                      <li key={item.id}>
                        <label className="flex cursor-pointer items-center gap-3">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleChecklistToggle(item.id)}
                            className="sr-only"
                          />
                          <span
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                              isChecked
                                ? "border-orange-500 bg-orange-500"
                                : "border-gray-300"
                            }`}
                          >
                            {isChecked && (
                              <svg
                                className="h-3 w-3 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            )}
                          </span>
                          <span
                            className={`text-sm transition-all ${
                              isChecked
                                ? "text-gray-400 line-through"
                                : "text-gray-700"
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>
                      </li>
                    );
                  })}
                </ul>

                {/* Celebration */}
                {parsed.finalChecklist.every(
                  (item) => state.checklist[item.id]
                ) && (
                  <div className="mt-6 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-center text-white">
                    <p className="text-3xl">🎉</p>
                    <p className="mt-2 text-xl font-bold">Day {day} 완료!</p>
                    <p className="mt-1 text-sm text-orange-100">
                      축하합니다! Day {day} 학습을 마쳤어요.
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Bottom Nav */}
          <nav className="mt-10 flex items-center justify-between">
            {hasPrev ? (
              <Link
                href={`/cc/${slug}/mission-book/day${day - 1}`}
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                ← Day {day - 1}
              </Link>
            ) : (
              <button
                disabled
                className="rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm text-gray-300 cursor-not-allowed"
              >
                ← Day 0
              </button>
            )}
            {hasNext ? (
              <Link
                href={`/cc/${slug}/mission-book/day${day + 1}`}
                className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700 transition-colors"
              >
                Day {day + 1} →
              </Link>
            ) : (
              <Link
                href={`/cc/${slug}/mission-book`}
                className="rounded-lg bg-orange-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-orange-700 transition-colors"
              >
                🎉 완료
              </Link>
            )}
          </nav>
        </main>
      </div>
    </div>
  );
}

/* ─── Sub-components ─── */

function MdStepCard({
  step,
  title,
  duration,
  done,
  collapsed,
  onToggle,
  children,
}: {
  step: number;
  title: string;
  duration: string;
  done: boolean;
  collapsed: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6">
      <div
        className={`rounded-2xl bg-white shadow-sm ring-1 transition-all ${
          done ? "ring-green-200" : "ring-gray-200"
        }`}
      >
        <button
          type="button"
          onClick={onToggle}
          className="flex w-full items-center gap-3 px-5 py-4 text-left"
        >
          <span
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors ${
              done
                ? "bg-green-500 text-white"
                : "bg-orange-100 text-orange-600"
            }`}
          >
            {done ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={3}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              step
            )}
          </span>
          <div className="flex-1">
            <h3 className="text-base font-bold text-gray-900">
              Step {step}. {title}
            </h3>
            {duration && (
              <p className="text-xs text-gray-400">⏱ {duration}</p>
            )}
          </div>
          <svg
            className={`h-5 w-5 text-gray-400 transition-transform ${
              collapsed ? "" : "rotate-180"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {!collapsed && <div className="px-5 pb-5">{children}</div>}
      </div>
    </section>
  );
}

function MdCheckbox({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="mb-2">
      <label className="flex cursor-pointer items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onToggle}
          className="sr-only"
        />
        <span
          className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded border-2 transition-colors ${
            checked ? "border-green-500 bg-green-500" : "border-gray-300"
          }`}
        >
          {checked && (
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </span>
        <span
          className={`text-sm transition-all ${
            checked ? "text-gray-400 line-through" : "text-gray-600"
          }`}
        >
          {label}
        </span>
      </label>
    </div>
  );
}

function MdWriteField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="mb-3">
      <p className="mb-1 text-sm font-medium text-gray-600">✏️ {label}</p>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="여기에 작성하세요..."
        className="w-full bg-transparent text-gray-800 placeholder:text-gray-300 focus:outline-none text-sm border-b border-dashed border-gray-300 px-1 pb-1 focus:border-orange-400"
      />
    </div>
  );
}
