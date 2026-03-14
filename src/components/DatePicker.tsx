"use client";

import { useState } from "react";
import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

function groupByMonth(entries: DailyEntry[]) {
  const map = new Map<string, DailyEntry[]>();
  for (const entry of entries) {
    const [y, m] = entry.date.split("-");
    const key = `${y}-${m}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(entry);
  }
  return Array.from(map.entries()).map(([key, items]) => {
    const [y, m] = key.split("-");
    return { year: y, month: parseInt(m, 10), entries: items };
  });
}

/** Get the day-of-week offset for the 1st of a month (0=Sun) */
function getFirstDayOffset(year: number, month: number) {
  return new Date(year, month - 1, 1).getDay();
}

/** Get total days in a month */
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function DatePicker({ entries, currentDate, onSelect, open, onClose }: Props) {
  const groups = groupByMonth(entries);
  // Default to the month of the current date
  const initGroup = groups.findIndex((g) => {
    const [y, m] = (currentDate || "").split("-");
    return g.year === y && g.month === parseInt(m || "0", 10);
  });
  const [activeIdx, setActiveIdx] = useState(Math.max(initGroup, 0));

  if (!open) return null;

  const group = groups[activeIdx] || groups[0];
  const year = parseInt(group.year, 10);
  const month = group.month;
  const firstOffset = getFirstDayOffset(year, month);
  const totalDays = getDaysInMonth(year, month);
  const weekdays = ["日", "一", "二", "三", "四", "五", "六"];

  // Build a set of available dates for quick lookup
  const availableDates = new Map<number, DailyEntry>();
  for (const entry of group.entries) {
    const day = new Date(entry.date + "T00:00:00").getDate();
    availableDates.set(day, entry);
  }

  const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-[340px]"
        style={{
          background: "var(--bg-card)",
          borderRadius: "12px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.12)",
          animation: "fadeInUp 0.15s ease-out",
          overflow: "hidden",
        }}
      >
        {/* Month navigation */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <button
            onClick={() => setActiveIdx((i) => Math.min(i + 1, groups.length - 1))}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:opacity-70"
            style={{ color: activeIdx >= groups.length - 1 ? "var(--border)" : "var(--fg-muted)" }}
            disabled={activeIdx >= groups.length - 1}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
          <span className="text-base font-semibold" style={{ color: "var(--fg)" }}>
            {group.year} {monthNames[month - 1]}
          </span>
          <button
            onClick={() => setActiveIdx((i) => Math.max(i - 1, 0))}
            className="w-7 h-7 flex items-center justify-center rounded-md hover:opacity-70"
            style={{ color: activeIdx <= 0 ? "var(--border)" : "var(--fg-muted)" }}
            disabled={activeIdx <= 0}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>

        {/* Weekday header */}
        <div className="grid grid-cols-7 px-4 pt-2">
          {weekdays.map((w) => (
            <div
              key={w}
              className="text-center text-xs font-medium py-1"
              style={{ color: "var(--fg-muted)" }}
            >
              {w}
            </div>
          ))}
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-0.5 px-4 pb-4 pt-1">
          {/* Empty cells for offset */}
          {Array.from({ length: firstOffset }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {/* Day cells */}
          {Array.from({ length: totalDays }).map((_, i) => {
            const day = i + 1;
            const entry = availableDates.get(day);
            const isActive = entry?.date === currentDate;
            const isToday = (() => {
              const now = new Date();
              return now.getFullYear() === year && now.getMonth() + 1 === month && now.getDate() === day;
            })();

            if (!entry) {
              return (
                <div
                  key={day}
                  className="flex items-center justify-center h-10 text-sm"
                  style={{ color: "var(--border-strong)" }}
                >
                  {day}
                </div>
              );
            }

            return (
              <button
                key={day}
                onClick={() => onSelect(entry)}
                className="flex items-center justify-center h-10 text-sm font-medium rounded-lg transition-all duration-100 hover:opacity-80 active:scale-90"
                style={{
                  background: isActive ? "var(--accent)" : "transparent",
                  color: isActive ? "white" : "var(--fg)",
                  boxShadow: isToday && !isActive ? `inset 0 0 0 1.5px var(--accent)` : "none",
                }}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
