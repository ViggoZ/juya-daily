"use client";

import { useState, useCallback } from "react";
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSelect = useCallback(async (entry: DailyEntry) => {
    setLoading(true);
    try {
      const res = await fetch(`${RAW_BASE}/${entry.filename}`);
      const md = await res.text();
      const parsed = parseMarkdown(md);
      setData(parsed);
      setIssueId(entry.id);
      setCurrentDate(entry.date);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("Failed to load:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-dvh flex flex-col" style={{ background: "var(--bg)" }}>
      <Header />
      {/* Content area below header — fills remaining height */}
      <div className="flex flex-1 min-h-0">
        <DailySidebar
          entries={entries}
          currentDate={currentDate}
          onSelect={handleSelect}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <main className="flex-1 min-w-0 overflow-y-auto">
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
            <ArticleView data={data} issueId={issueId} />
          )}
        </main>
      </div>

      <button
        onClick={() => setSidebarOpen(true)}
        className="site-fab fixed bottom-6 left-6 z-30 w-12 h-12 flex items-center justify-center shadow-lg md:hidden hover:scale-110 active:scale-95"
        aria-label="打开日报列表"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      </button>
    </div>
  );
}
