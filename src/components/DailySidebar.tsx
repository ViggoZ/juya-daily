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
          site-sidebar overflow-y-auto transition-all duration-300 ease-out shrink-0
          fixed top-0 left-0 z-50 h-dvh w-56
          md:relative md:z-auto md:top-auto md:left-auto md:h-full
          ${open
            ? "translate-x-0 md:translate-x-0 md:w-56"
            : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0"
          }
        `}
      >
        {/* Mobile header */}
        <div
          className="md:hidden sticky top-0 z-10 h-14 flex items-center px-4 border-b"
          style={{ background: "var(--bg-warm)", borderColor: "var(--border)" }}
        >
          <span className="text-xs font-semibold" style={{ color: "var(--fg)" }}>
            往期日报
          </span>
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:opacity-70"
            style={{ color: "var(--fg-muted)" }}
            aria-label="关闭"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-2 min-w-[13rem]">
          <div className="sidebar-list">
            {entries.map((entry) => {
              const isActive = entry.date === currentDate;
              const d = new Date(entry.date + "T00:00:00");
              const weekday = ["日", "一", "二", "三", "四", "五", "六"][
                d.getDay()
              ];
              const month = d.getMonth() + 1;
              const day = d.getDate();
              return (
                <button
                  key={entry.id}
                  onClick={() => {
                    onSelect(entry);
                    onClose();
                  }}
                  className={`sidebar-item w-full text-left transition-all duration-150 ${isActive ? "sidebar-item-active" : ""}`}
                >
                  <span className="sidebar-item-date">
                    {month}/{day}
                  </span>
                  <span className="sidebar-item-meta">
                    周{weekday}
                  </span>
                  <span className="sidebar-item-id">
                    #{entry.id}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
}
