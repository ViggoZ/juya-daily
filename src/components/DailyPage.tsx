"use client";

import { useState, useCallback, useRef } from "react";
import { DailyEntry, ParsedDaily, parseMarkdown } from "@/lib/github";
import { Header } from "./Header";
import { DailySidebar } from "./DailySidebar";
import { ArticleView } from "./ArticleView";

const RAW_BASE =
  "https://raw.githubusercontent.com/imjuya/juya-ai-daily/master/BACKUP";

interface Props {
  entries: DailyEntry[];
  initialData: ParsedDaily;
  initialIssueId: number;
  initialDate: string;
}

export function DailyPage({
  entries,
  initialData,
  initialIssueId,
  initialDate,
}: Props) {
  const [data, setData] = useState(initialData);
  const [issueId, setIssueId] = useState(initialIssueId);
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth >= 768 : true
  );
  const mainRef = useRef<HTMLElement>(null);

  const handleSelect = useCallback(async (entry: DailyEntry) => {
    setLoading(true);
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

  return (
    <div
      className="h-dvh flex flex-col overflow-hidden"
      style={{ background: "var(--bg)" }}
    >
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        mainRef={mainRef}
      />
      <div className="flex flex-1 overflow-hidden">
        <DailySidebar
          entries={entries}
          currentDate={currentDate}
          onSelect={handleSelect}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main
          ref={mainRef}
          className="flex-1 min-w-0 overflow-y-auto"
        >
          {loading ? (
            <div className="flex items-center justify-center py-32">
              <div
                className="w-6 h-6 border-2 rounded-full animate-spin"
                style={{
                  borderColor: "var(--border)",
                  borderTopColor: "var(--accent)",
                }}
              />
            </div>
          ) : (
            <ArticleView data={data} issueId={issueId} mainRef={mainRef} />
          )}
        </main>
      </div>
    </div>
  );
}
