"use client";

import { useEffect, useState } from "react";
import {
  fetchDailyList,
  fetchDailyContent,
  parseMarkdown,
  DailyEntry,
  ParsedDaily,
} from "@/lib/github";
import { DailyPage } from "@/components/DailyPage";

export default function Home() {
  const [entries, setEntries] = useState<DailyEntry[] | null>(null);
  const [data, setData] = useState<ParsedDaily | null>(null);
  const [latestId, setLatestId] = useState(0);
  const [latestDate, setLatestDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await fetchDailyList();
        setEntries(list);
        const latest = list[0];
        const content = await fetchDailyContent(latest.filename);
        const parsed = parseMarkdown(content);
        setData(parsed);
        setLatestId(latest.id);
        setLatestDate(latest.date);
      } catch {
        setError("加载失败，请刷新重试");
      }
    })();
  }, []);

  if (error) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <p style={{ color: "var(--fg-muted)" }}>{error}</p>
      </div>
    );
  }

  if (!entries || !data) {
    return (
      <div className="min-h-dvh flex items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="flex flex-col items-center gap-3">
          <div
            className="w-6 h-6 border-2 rounded-full animate-spin"
            style={{ borderColor: "var(--border)", borderTopColor: "var(--accent)" }}
          />
          <span className="text-sm" style={{ color: "var(--fg-muted)" }}>加载中...</span>
        </div>
      </div>
    );
  }

  return (
    <DailyPage
      entries={entries}
      initialData={data}
      initialIssueId={latestId}
      initialDate={latestDate}
    />
  );
}
