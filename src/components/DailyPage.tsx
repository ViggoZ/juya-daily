"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { DailyEntry, ParsedDaily, parseMarkdown } from "@/lib/github";
import { Header } from "./Header";
import { DatePicker } from "./DatePicker";
import { ArticleView } from "./ArticleView";

const RAW_BASE =
  "https://raw.githubusercontent.com/imjuya/juya-ai-daily/master/BACKUP";

interface Props {
  entries: DailyEntry[];
  initialData: ParsedDaily | null;
  initialIssueId: number;
  initialDate: string;
  error?: string;
}

function ArticleSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-5 py-8 md:py-12">
      <div className="animate-pulse">
        {/* Date line */}
        <div className="flex items-center gap-3 mb-3">
          <div className="h-3 w-24 rounded" style={{ background: "var(--border)" }} />
          <div className="h-px flex-1" style={{ background: "var(--border)" }} />
          <div className="h-3 w-12 rounded" style={{ background: "var(--border)" }} />
        </div>
        {/* Title */}
        <div className="h-10 w-20 rounded mb-2" style={{ background: "var(--border)" }} />
        <div className="h-4 w-48 rounded mb-8" style={{ background: "var(--border)" }} />
        {/* Overview card */}
        <div className="rounded-lg p-5 mb-8" style={{ background: "var(--tag-bg)" }}>
          <div className="h-3 w-16 rounded mb-4" style={{ background: "var(--border)" }} />
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-3 rounded" style={{ background: "var(--border)", width: `${85 - i * 8}%` }} />
            ))}
          </div>
        </div>
        {/* Content blocks */}
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <div className="h-5 w-3/4 rounded mb-3" style={{ background: "var(--border)" }} />
              <div className="space-y-2">
                <div className="h-3 w-full rounded" style={{ background: "var(--border)" }} />
                <div className="h-3 w-full rounded" style={{ background: "var(--border)" }} />
                <div className="h-3 w-2/3 rounded" style={{ background: "var(--border)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function DailyPage({
  entries,
  initialData,
  initialIssueId,
  initialDate,
  error,
}: Props) {
  const [data, setData] = useState(initialData);
  const [issueId, setIssueId] = useState(initialIssueId);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const mainRef = useRef<HTMLElement>(null);

  // Sync when initialData arrives from parent
  useEffect(() => {
    if (initialData) setData(initialData);
  }, [initialData]);
  useEffect(() => {
    if (initialIssueId) setIssueId(initialIssueId);
  }, [initialIssueId]);
  useEffect(() => {
    if (initialDate) setCurrentDate(initialDate);
  }, [initialDate]);

  const handleSelect = useCallback(async (entry: DailyEntry) => {
    setLoading(true);
    setCalendarOpen(false);
    try {
      const res = await fetch(`${RAW_BASE}/${entry.filename}`);
      const md = await res.text();
      const parsed = parseMarkdown(md);
      setData(parsed);
      setIssueId(entry.id);
      setCurrentDate(entry.date);
      mainRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const contentLoading = !data || loading;

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      {/* Header always visible immediately */}
      <Header
        mainRef={mainRef}
        currentDate={currentDate || ""}
        onCalendarToggle={() => setCalendarOpen((v) => !v)}
        hasEntries={entries.length > 0}
      />

      <main
        ref={mainRef}
        className="flex-1 min-w-0 overflow-y-auto"
      >
        {error ? (
          <div className="flex items-center justify-center py-32">
            <p className="text-sm" style={{ color: "var(--fg-muted)" }}>{error}</p>
          </div>
        ) : contentLoading ? (
          <ArticleSkeleton />
        ) : (
          <ArticleView data={data} issueId={issueId} mainRef={mainRef} />
        )}
      </main>

      {entries.length > 0 && (
        <DatePicker
          entries={entries}
          currentDate={currentDate}
          onSelect={handleSelect}
          open={calendarOpen}
          onClose={() => setCalendarOpen(false)}
        />
      )}
    </div>
  );
}
