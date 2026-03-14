"use client";

import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  currentCover?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

export function DailySidebar({
  entries,
  currentDate,
  currentCover,
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
          fixed top-0 left-0 z-50 h-dvh w-72
          md:relative md:z-auto md:top-auto md:left-auto md:h-full
          ${open
            ? "translate-x-0 md:translate-x-0 md:w-72"
            : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0"
          }
        `}
      >
        {/* Mobile header */}
        <div
          className="md:hidden sticky top-0 z-10 h-14 flex items-center px-5 border-b"
          style={{ background: "var(--bg-warm)", borderColor: "var(--border)" }}
        >
          <span
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--theme-font-display)", color: "var(--fg)" }}
          >
            往期日报
          </span>
          <button
            onClick={onClose}
            className="ml-auto w-8 h-8 flex items-center justify-center rounded-lg hover:opacity-70"
            style={{ color: "var(--fg-muted)" }}
            aria-label="关闭"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-3 min-w-[17rem]">
          <h2 className="sidebar-title text-xs font-semibold uppercase tracking-widest mb-3 px-1 hidden md:block">
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
                  className={`sidebar-item w-full text-left transition-all duration-200 relative overflow-hidden ${isActive ? "sidebar-item-active" : ""}`}
                >
                  {/* Cover image as background for active item */}
                  {isActive && currentCover && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={currentCover}
                      alt=""
                      className="sidebar-cover"
                    />
                  )}
                  <div className="relative z-[1]">
                    <div className="sidebar-item-date text-sm font-medium">
                      {entry.date}
                    </div>
                    <div className="sidebar-item-meta text-xs mt-0.5">
                      第 {entry.id} 期 · 周{weekday}
                    </div>
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
