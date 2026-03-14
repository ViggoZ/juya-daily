"use client";

import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

export function DailySidebar({
  entries,
  currentDate,
  onSelect,
  open,
  onClose,
}: Props) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={`
          site-sidebar
          fixed top-14 left-0 z-40 h-[calc(100dvh-3.5rem)] w-72
          overflow-y-auto transition-transform duration-300 ease-out
          md:sticky md:translate-x-0 md:block
          ${open ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <div className="p-4">
          <h2 className="sidebar-title text-xs font-semibold uppercase tracking-widest mb-4">
            往期日报
          </h2>
          <div className="sidebar-list space-y-1">
            {entries.map((entry) => {
              const isActive = entry.date === currentDate;
              const d = new Date(entry.date + "T00:00:00");
              const weekday = ["日", "一", "二", "三", "四", "五", "六"][
                d.getDay()
              ];
              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    onSelect(entry);
                    onClose();
                  }}
                  className={`sidebar-item w-full text-left transition-all duration-200 ${isActive ? "sidebar-item-active" : ""}`}
                >
                  <div className="sidebar-item-date text-sm font-medium">
                    {entry.date}
                  </div>
                  <div className="sidebar-item-meta text-xs mt-0.5">
                    第 {entry.id} 期 · 周{weekday}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
