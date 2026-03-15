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
  const [entries, setEntries] = useState<DailyEntry[]>([]);
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
        setLatestId(latest.id);
        setLatestDate(latest.date);
        const content = await fetchDailyContent(latest.filename);
        const parsed = parseMarkdown(content);
        setData(parsed);
      } catch {
        setError("加载失败，请刷新重试");
      }
    })();
  }, []);

  return (
    <DailyPage
      entries={entries}
      initialData={data}
      initialIssueId={latestId}
      initialDate={latestDate}
      error={error}
    />
  );
}
