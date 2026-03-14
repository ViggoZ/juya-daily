"use client";

import { DailyEntry } from "@/lib/github";

interface Props {
  entries: DailyEntry[];
  currentDate?: string;
  onSelect: (entry: DailyEntry) => void;
  open: boolean;
  onClose: () => void;
}

/** Group entries by year-month */
function groupByMonth(entries: DailyEntry[]) {
  const groups: { label: string; entries: DailyEntry[] }[] = [];
  let current = "";
  for (const entry of entries) {
    const [y, m] = entry.date.split("-");
    const key = `${y}-${m}`;
    if (key !== current) {
      current = key;
      const monthNames = ["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
      groups.push({ label: `${y} ${monthNames[parseInt(m, 10) - 1]}`, entries: [] });
    }
    groups[groups.length - 1].entries.push(entry);
  }
  return groups;
}

export function DailySidebar({
  entries,
  currentDate,
  onSelect,
  open,
  onClose,
}: Props) {
  const groups = groupByMonth(entries);

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
          fixed top-0 left-0 z-50 h-dvh w-52
          md:relative md:z-auto md:top-auto md:left-auto md:h-full
          ${open
            ? "translate-x-0 md:translate-x-0 md:w-52"
            : "-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden md:border-r-0"
          }
        `}
      >
        {/* Mobile header */}
        <div
          className="md:hidden sticky top-0 z-10 h-12 flex items-center px-4 border-b"
          style={{ background: "var(--bg-warm)", borderColor: "var(--border)" }}
        >
          <span className="text-xs font-medium" style={{ color: "var(--fg-muted)" }}>
            选择日期
          </span>
          <button
            onClick={onClose}
            className="ml-auto w-7 h-7 flex items-center justify-center rounded-md hover:opacity-70"
            style={{ color: "var(--fg-muted)" }}
            aria-label="关闭"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className="p-3 min-w-[12rem]">
          {groups.map((group) => (
            <div key={group.label} className="mb-4">
              <div
                className="text-[0.65rem] font-semibold uppercase tracking-wider mb-2 px-1"
                style={{ color: "var(--fg-muted)" }}
              >
                {group.label}
              </div>
              <div className="grid grid-cols-5 gap-1">
                {group.entries.map((entry) => {
                  const isActive = entry.date === currentDate;
                  const d = new Date(entry.date + "T00:00:00");
                  const day = d.getDate();
                  const weekday = ["日","一","二","三","四","五","六"][d.getDay()];
                  return (
                    <button
                      key={entry.id}
                      onClick={() => { onSelect(entry); onClose(); }}
                      className={`sidebar-cell ${isActive ? "sidebar-cell-active" : ""}`}
                      title={`${entry.date} 周${weekday} 第${entry.id}期`}
                    >
                      <span className="sidebar-cell-day">{day}</span>
                      <span className="sidebar-cell-weekday">
                        {weekday}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
